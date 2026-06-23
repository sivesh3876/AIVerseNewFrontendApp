import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import { getServiceIdForDomain } from "../utils/solutionMapper";
import { navigateToSiteSearch } from "../utils/siteSearch";
import "./Solutions.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://func-aiverse-backend-dwgpguatgadjezae.centralindia-01.azurewebsites.net/api";

export default function Solutions() {
  const navigate = useNavigate();
  const [businessDomains, setBusinessDomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    const fetchBusinessDomains = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get-business-domains`);
        const result = await response.json();

        if (response.ok && result.status === "success") {
          setBusinessDomains(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching business domains:", error);
      }
    };

    fetchBusinessDomains();
  }, []);

  const groupedDomains = useMemo(() => {
    const groups = {};

    businessDomains.forEach((domain) => {
      if (!domain.ParentDomainCode) return;

      const key = domain.ParentDomainCode;
      const name = domain.ParentDomainName || key;

      if (!groups[key]) {
        groups[key] = { name, domains: [] };
      }

      groups[key].domains.push(domain);
    });

    return groups;
  }, [businessDomains]);

  const toggleGroup = (key) =>
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  const navigateToExplore = (domainCode) => {
    const domain = businessDomains.find(
      (entry) => entry.DomainCode === domainCode,
    );

    if (domain?.ParentDomainCode === "Industries") {
      navigate(`/explore-solutions?domain=${domainCode}`);
      return;
    }

    const serviceId =
      getServiceIdForDomain(domainCode) || "customer-communication-management";
    navigate(`/explore-solutions?service=${serviceId}`);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();

    if (!query) {
      navigate("/explore-solutions");
      return;
    }

    navigateToSiteSearch(navigate, query);
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Solutions" },
        ]}
      />
      <section className="solutions-page">
      <aside className="solutions-sidebar" aria-label="Business domains">
        <form className="solutions-search-wrap" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="solutions-search"
            placeholder="Search solutions..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </form>

        <nav className="solutions-domain-list">
          <button
            type="button"
            className="solutions-domain-item active"
            onClick={() => navigate("/explore-solutions")}
          >
            AI Service Offerings
          </button>

          {Object.entries(groupedDomains).map(([groupKey, group]) => (
            <div key={groupKey}>
              <button
                type="button"
                className="solutions-domain-item solutions-domain-group"
                onClick={() => toggleGroup(groupKey)}
              >
                <span>{group.name}</span>
                {expandedGroups[groupKey] ? (
                  <FiChevronDown />
                ) : (
                  <FiChevronRight />
                )}
              </button>

              {expandedGroups[groupKey] &&
                group.domains.map((domain) => (
                  <button
                    key={domain.DomainCode}
                    type="button"
                    className="solutions-domain-item submenu-item"
                    onClick={() => navigateToExplore(domain.DomainCode)}
                  >
                    {domain.DomainName}
                  </button>
                ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="solutions-main">
        <div className="solutions-showcase">
          <img
            src="/ai-solutionsimg.JPG"
            alt="AI Solutions Overview"
            className="solutions-showcase-img"
          />
        </div>
      </div>
    </section>
    </>
  );
}
