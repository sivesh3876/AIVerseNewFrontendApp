import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Solutions.css";
import {
  BriefcaseIcon,
  DatabaseIcon,
  DollarSignIcon,
  FileTextIcon,
  HeartIcon,
  MessageCircleIcon,
  PackageIcon,
  ShieldIcon,
  TrendingUpIcon,
  DownloadIcon,
  ExternalLinkIcon,
  PlayIcon,
  FileIcon,
  EditIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "../components/icons/FeatherIcons";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://func-aiverse-backend-dwgpguatgadjezae.centralindia-01.azurewebsites.net/api";
const iconMap = {
  shield: ShieldIcon,
  contract: FileTextIcon,
  package: PackageIcon,
  health: HeartIcon,
  finance: DollarSignIcon,
  briefcase: BriefcaseIcon,
  growth: TrendingUpIcon,
  concierge: MessageCircleIcon,
  metadata: DatabaseIcon,
};

// Default icon mapping based on domain
const domainIconMap = {
  Hospitality: "concierge",
  "Data AI": "metadata",
  Insurance: "shield",
  Logistics: "package",
  HealthCare: "health",
  Finance: "finance",
  "HR Recruitment": "briefcase",
  Education: "contract",
  Manufacturing: "package",
  Retail: "growth",
  Ecommerce: "growth",
  "In-Progress": "briefcase",
};

const normalizeSearchText = (value = "") =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

export default function Solutions() {
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState([]);
  const [businessDomains, setBusinessDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDomain, setActiveDomain] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const [expandedGroups, setExpandedGroups] = useState({});
  const [openDocs, setOpenDocs] = useState(new Set());

  const toggleDocs = (id) =>
    setOpenDocs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  
//   aapke code mein
useEffect(() => {
  fetchBusinessDomains();
}, []);

useEffect(() => {
  fetchSolutions();
}, []);

  useEffect(() => {
  if (loading) return;

  const scrollToId = sessionStorage.getItem("scrollToSolution");
  const scrollPosition = sessionStorage.getItem("scrollPosition");
  const savedDomain = sessionStorage.getItem("activeDomain");

  if (!scrollToId) return;

  sessionStorage.removeItem("scrollToSolution");
  sessionStorage.removeItem("scrollPosition");
  sessionStorage.removeItem("activeDomain");

  //  Pehle domain set karo
  if (savedDomain && savedDomain !== "") {
    setActiveDomain(savedDomain);
  } else {
    setActiveDomain(null);
  }

  // 150ms nahi — 500ms do taaki filter apply ho aur cards render ho jayein
  setTimeout(() => {
    if (scrollPosition) {
      window.scrollTo({ top: parseInt(scrollPosition), behavior: "smooth" });
    } else {
      const el = document.querySelector(`[data-solution-id="${scrollToId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("solution-card--highlighted");
        setTimeout(() => el.classList.remove("solution-card--highlighted"), 2000);
      }
    }
  }, 500); 
}, [loading]);  

  const fetchBusinessDomains = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-business-domains`);
      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setBusinessDomains(result.data);
      } else {
        console.error('Failed to fetch business domains:', result.message);
      }
    } catch (error) {
      console.error('Error fetching business domains:', error);
    }
  };

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/get-usecases`);
      const result = await response.json();

      if (response.ok && result.status === 'success') {
        // Sort by Priority (ascending - lower number = higher priority)
        const sortedSolutions = result.data.sort((a, b) => {
          const priorityA = a.Priority || 999;
          const priorityB = b.Priority || 999;
          return priorityA - priorityB;
        });
        setSolutions(sortedSolutions);
        setError(null);
      } else {
        setError(result.message || 'Failed to fetch solutions');
      }
    } catch (error) {
      console.error('Error fetching solutions:', error);
      setError('Network error while loading solutions');
    } finally {
      setLoading(false);
    }
  };

  // Get domain name from domain code
  const getDomainName = (domainCode) => {
    const domain = businessDomains.find(d => d.DomainCode === domainCode);
    return domain ? domain.DomainName : domainCode;
  };

  // Group domains by their parent for the sidebar tree
  const groupedDomains = useMemo(() => {
    const groups = {};
    businessDomains.forEach((domain) => {
      if (!domain.ParentDomainCode) return;
      const key = domain.ParentDomainCode;
      const name = domain.ParentDomainName || key;
      if (!groups[key]) groups[key] = { name, domains: [] };
      groups[key].domains.push(domain);
    });
    return groups;
  }, [businessDomains]);

  const toggleGroup = (key) =>
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  // Filter solutions based on search and active domain
  const filteredSolutions = useMemo(() => {
    const query = normalizeSearchText(searchQuery.trim());

    return solutions.filter((solution) => {
      // Filter by active domain
      if (
  activeDomain &&
  normalizeSearchText(solution.BusinessDomain) !==
    normalizeSearchText(activeDomain)
) {
  return false;
}

      // Filter by search query
      if (!query) {
        return true;
      }

      const normalizedTitle = normalizeSearchText(solution.Title || '');
      const normalizedContext = normalizeSearchText(solution.SolutionContext || '');
      const normalizedTech = normalizeSearchText(solution.TechHighlights || '');
      const domainName = getDomainName(solution.BusinessDomain);
      const normalizedDomain = normalizeSearchText(domainName);

      return (
        normalizedTitle.includes(query) ||
        normalizedContext.includes(query) ||
        normalizedTech.includes(query) ||
        normalizedDomain.includes(query)
      );
    });
  }, [solutions, activeDomain, searchQuery, businessDomains]);

  // Parse multiple document URLs from comma-separated string or array
  const parseDocumentUrls = (urlData) => {
    if (!urlData) return [];
    if (Array.isArray(urlData)) {
      return urlData.filter(Boolean);
    }
    if (typeof urlData === 'string') {
      return urlData.split(',').map(url => url.trim()).filter(Boolean);
    }
    return [];
  };

  // Extract filename from blob URL
  const getFilenameFromUrl = (url) => {
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      return decodeURIComponent(filename);
    } catch (error) {
      return 'Document';
    }
  };

  // Get icon for domain
  const getIconForDomain = (domainCode) => {
    const domainName = getDomainName(domainCode);
    const iconKey = domainIconMap[domainName] || 'shield';
    return iconMap[iconKey] || ShieldIcon;
  };

  const handleEdit = (solutionId) => {
  sessionStorage.setItem("scrollToSolution", solutionId);
  sessionStorage.setItem("scrollPosition", window.scrollY);
  sessionStorage.setItem("activeDomain", activeDomain || "");  //  filter bhi save karo
  navigate(`/get-started?id=${solutionId}`);
};
  // Open the confirmation modal for the chosen solution
  const handleDelete = (solution) => {
    setConfirmTarget(solution);
  };

  // Dismiss the modal without deleting
  const cancelDelete = () => {
    if (deletingId) return;
    setConfirmTarget(null);
  };

  // Soft-delete the solution currently in confirmTarget
  const confirmDelete = async () => {
    if (!confirmTarget) return;
    const solution = confirmTarget;

    try {
      setDeletingId(solution.ID);
      const response = await fetch(
        `${API_BASE_URL}/delete-usecase?id=${solution.ID}`,
        { method: 'DELETE' }
      );
      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setSolutions((prev) => prev.filter((s) => s.ID !== solution.ID));
        setConfirmTarget(null);
      } else {
        alert(result.message || 'Failed to delete solution');
      }
    } catch (err) {
      console.error('Error deleting solution:', err);
      alert('Network error while deleting solution');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="solutions-page">
      <aside className="solutions-sidebar" aria-label="Business domains">
        <div className="solutions-search-wrap">
          <input
            type="text"
            className="solutions-search"
            placeholder="Search solutions..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
<nav className="solutions-domain-list">

  <button
    type="button"
    className={`solutions-domain-item ${activeDomain === null ? "active" : ""}`}
    onClick={() => setActiveDomain(null)}
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
        {expandedGroups[groupKey] ? <ChevronDownIcon /> : <ChevronRightIcon />}
      </button>

      {expandedGroups[groupKey] &&
        group.domains.map((domain) => (
          <button
            key={domain.DomainCode}
            type="button"
            className={`solutions-domain-item submenu-item ${
              activeDomain === domain.DomainCode ? "active" : ""
            }`}
            onClick={() => setActiveDomain(domain.DomainCode)}
          >
            {domain.DomainName}
          </button>
        ))}
    </div>
  ))}

</nav>
      </aside>

      <div className="solutions-main">
        {loading ? (
          <div className="solutions-loading">
            <div className="loading-spinner"></div>
            <p>Loading solutions...</p>
          </div>
        ) : error ? (
          <div className="solutions-error">
            <p>Error: {error}</p>
            <button onClick={fetchSolutions} className="retry-button">
              Retry
            </button>
          </div>
        ) : !activeDomain && !searchQuery.trim() ? (
          <div className="solutions-showcase">
            <img
              src="/ai-solutionsimg.JPG"
              alt="AI Solutions Overview"
              className="solutions-showcase-img"
            />
          </div>
        ) : (
          <>
            <header className="solutions-hero">
              <h1>
                {activeDomain
                  ? businessDomains.find(d => d.DomainCode === activeDomain)?.DomainName ||
                    'AI/GenAI solutions'
                  :  'AI/GenAI solutions'}
                </h1>
              <h6>
                {activeDomain
                  ? businessDomains.find(d => d.DomainCode === activeDomain)?.Description ||
                    'Access a comprehensive suite of AI capabilities designed to solve complex business challenges.'
                  : 'Access a comprehensive suite of AI capabilities designed to solve complex business challenges.'}
              </h6>
            </header>
            <div className="solutions-grid">
              {filteredSolutions.map((solution) => {
                const Icon = getIconForDomain(solution.BusinessDomain);
                const otherDocs = parseDocumentUrls(solution.OtherDocuments);
                const hasLiveDemo = solution.IsDemoLink && solution.DemoLink;
                const hasRecordedDemo = solution.IsDemoRecordedVideoLink && solution.DemoRecordedVideoLink;
                const hasSolutionDoc = solution.SolutionDetailsDoc;

                const docCount = (hasSolutionDoc ? 1 : 0) + otherDocs.length;
                const isDocsOpen = openDocs.has(solution.ID);

                return (
                  <article className="solution-card" key={solution.ID} data-solution-id={solution.ID}>

                    {/* Header: icon + domain badge + controls */}
                    <div className="solution-card-header">
                      <div className="solution-icon-wrapper">
                        <div className="solution-icon" aria-hidden="true"><Icon /></div>
                        <span className="solution-domain-badge">{getDomainName(solution.BusinessDomain)}</span>
                      </div>
                      <div className="solution-card-controls">
                        <button type="button" className="solution-control-btn solution-edit-btn" onClick={() => handleEdit(solution.ID)} aria-label={`Edit ${solution.Title}`} title="Edit"><EditIcon /></button>
                        <button type="button" className="solution-control-btn solution-delete-btn" onClick={() => handleDelete(solution)} disabled={deletingId === solution.ID} aria-label={`Delete ${solution.Title}`} title="Delete"><TrashIcon /></button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="solution-title">{solution.Title}</h3>

                    {/* Scrollable description */}
                    <div className="solution-description-area">
                      <p className="solution-description">
                        {solution.SolutionContext || 'No description available'}
                      </p>
                    </div>

                    {/* Documents — above metadata */}
                    {/* {docCount > 0 && (
                      <div className="solution-docs-wrap">
                        <button type="button" className="docs-toggle-btn" onClick={() => toggleDocs(solution.ID)}>
                          <FiFile size={13} />
                          <span>Documents ({docCount})</span>
                          {isDocsOpen ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
                        </button>
                        {isDocsOpen && (
                          <div className="docs-dropdown">
                            {hasSolutionDoc && (
                              <a href={solution.SolutionDetailsDoc} target="_blank" rel="noopener noreferrer" className="docs-dropdown-item">
                                <FiFile size={13} /><span>Solution Details</span><FiDownload size={12} />
                              </a>
                            )}
                            {otherDocs.map((docUrl, idx) => (
                              <a key={idx} href={docUrl} target="_blank" rel="noopener noreferrer" className="docs-dropdown-item">
                                <FiFile size={13} /><span>{getFilenameFromUrl(docUrl)}</span><FiDownload size={12} />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )} */}

                    {/* Metadata — fixed, color-coded */}
                    <div className="solution-meta">
                      {solution.TechHighlights && (
                        <div className="meta-row meta-tech">
                          <span className="meta-label">Tech Stack</span>
                          <span className="meta-value" title={solution.TechHighlights}>{solution.TechHighlights}</span>
                        </div>
                      )}
                      {solution.OwnershipDetails && (
                        <div className="meta-row meta-coe">
                          <span className="meta-label">COE</span>
                          <span className="meta-value" title={solution.OwnershipDetails}>{solution.OwnershipDetails}</span>
                        </div>
                      )}
                      {solution.AiEvangelists && (
                        <div className="meta-row meta-evangelist">
                          <span className="meta-label">AI Evangelists</span>
                          <span className="meta-value" title={solution.AiEvangelists}>{solution.AiEvangelists}</span>
                        </div>
                      )}
                      {solution.Clients && (
                        <div className="meta-row meta-client">
                          <span className="meta-label">Clients</span>
                          <span className="meta-value" title={solution.Clients}>{solution.Clients}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer: demo buttons only */}
                    <div className="solution-card-footer">
                      <div className="solution-demo-actions">
                        {hasLiveDemo && (
                          <a href={solution.DemoLink} target="_blank" rel="noopener noreferrer" className="demo-button demo-live">
                            <ExternalLinkIcon /><span>Live Demo</span>
                          </a>
                        )}
                        {hasRecordedDemo && (
                          <a href={solution.DemoRecordedVideoLink} target="_blank" rel="noopener noreferrer" className="demo-button demo-recorded">
                            <PlayIcon /><span>Recorded Demo</span>
                          </a>
                        )}
                        {!hasLiveDemo && !hasRecordedDemo && (
                          <div className="demo-unavailable"><span>Demo Coming Soon</span></div>
                        )}
                      </div>
                    </div>

                  </article>
                );
              })}
            </div>

            {filteredSolutions.length === 0 && (
              <div className="solutions-empty">
                <PackageIcon className="empty-icon" />
                <p>No solutions found matching your criteria.</p>
                {(searchQuery || activeDomain) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveDomain(null);
                    }}
                    className="clear-filters-button"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {confirmTarget && (
        <div
          className="delete-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          onClick={cancelDelete}
        >
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <div className="delete-modal-icon" aria-hidden="true">
                <TrashIcon />
              </div>
              <h3 id="delete-modal-title" className="delete-modal-title">
                Delete solution?
              </h3>
            </div>
            <p className="delete-modal-message">
              Are you sure you want to delete{' '}
              <strong>"{confirmTarget.Title}"</strong>? This action cannot be
              undone from the UI.
            </p>
            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-modal-btn delete-modal-btn-secondary"
                onClick={cancelDelete}
                disabled={deletingId === confirmTarget.ID}
              >
                No, Cancel
              </button>
              <button
                type="button"
                className="delete-modal-btn delete-modal-btn-danger"
                onClick={confirmDelete}
                disabled={deletingId === confirmTarget.ID}
                autoFocus
              >
                {deletingId === confirmTarget.ID ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}