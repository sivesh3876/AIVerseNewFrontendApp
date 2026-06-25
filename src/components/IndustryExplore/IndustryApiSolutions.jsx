import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RequestDemoModal from "../CustomerCommunicationManagement/RequestDemoModal";
import SolutionCapabilityCard from "../SolutionCapabilityCard/SolutionCapabilityCard";
import {
  fetchAllUseCases,
  getUsecasesApiBaseUrl,
} from "../../services/usecasesService";
import {
  enrichCapabilityContacts,
  filterOutDeletedSolutions,
  getServiceIdForDomain,
  hydrateCapability,
  loadPersistedSubmittedCapabilities,
  mapApiSolutionToCapability,
  mergeSubmittedCapabilities,
  resolveIndustryDomainCode,
} from "../../utils/solutionMapper";
import "../CustomerCommunicationManagement/CustomerCommunicationManagement.scss";
import "./IndustryApiSolutions.scss";

const API_BASE_URL = getUsecasesApiBaseUrl();

const IndustryApiSolutions = ({ domainCode, industryId, industryTitle }) => {
  const navigate = useNavigate();
  const [apiSolutions, setApiSolutions] = useState([]);
  const [aiEvangelists, setAiEvangelists] = useState([]);
  const [solutionOwners, setSolutionOwners] = useState([]);
  const [businessDomains, setBusinessDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [demoRequestTarget, setDemoRequestTarget] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setFetchError("");

        const [solutionsResult, ownersResponse, evangelistsResponse, domainsResponse] =
          await Promise.all([
            fetchAllUseCases(),
            fetch(`${API_BASE_URL}/get-solution-owners`),
            fetch(`${API_BASE_URL}/get-ai-evangelists`),
            fetch(`${API_BASE_URL}/get-business-domains`),
          ]);

        const ownersResult = await ownersResponse.json();
        const evangelistsResult = await evangelistsResponse.json();
        const domainsResult = await domainsResponse.json();

        if (!isMounted) return;

        setApiSolutions(filterOutDeletedSolutions(solutionsResult));

        if (ownersResponse.ok && ownersResult.status === "success") {
          setSolutionOwners(ownersResult.data || []);
        }

        if (evangelistsResponse.ok && evangelistsResult.status === "success") {
          setAiEvangelists(evangelistsResult.data || []);
        }

        if (domainsResponse.ok && domainsResult.status === "success") {
          setBusinessDomains(domainsResult.data || []);
        }
      } catch (error) {
        if (isMounted) {
          setApiSolutions([]);
          setFetchError(error.message || "Unable to load industry solutions.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [domainCode, industryId]);

  const resolvedDomainCode = useMemo(
    () =>
      resolveIndustryDomainCode(
        { domainCode, industryId, industryTitle },
        businessDomains,
      ),
    [businessDomains, domainCode, industryId, industryTitle],
  );

  const industryCapabilities = useMemo(() => {
    const directories = {
      evangelistDirectory: aiEvangelists,
      solutionOwners,
    };

    const enrich = (capability) =>
      hydrateCapability(
        enrichCapabilityContacts(capability, directories),
      );

    const apiCapabilities = apiSolutions
      .filter((solution) => solution.IsSolutionActive !== false)
      .map((solution) => {
        try {
          return enrich(mapApiSolutionToCapability(solution, directories));
        } catch (error) {
          console.error("Failed to map industry solution:", solution?.ID, error);
          return null;
        }
      })
      .filter(Boolean);

    const pendingCapabilities = loadPersistedSubmittedCapabilities()
      .map(enrich)
      .filter(Boolean);

    return mergeSubmittedCapabilities({
      apiCapabilities,
      pendingCapabilities,
      activeServiceId: null,
      activeDomainCode: resolvedDomainCode,
    });
  }, [
    aiEvangelists,
    apiSolutions,
    resolvedDomainCode,
    solutionOwners,
  ]);

  const handleSolutionNavigate = (capability) => {
    if (!capability?.id) return;

    const serviceForCapability =
      getServiceIdForDomain(capability.businessDomain) || "agentic-automation";

    navigate(
      `/explore-solutions?domain=${encodeURIComponent(resolvedDomainCode)}&service=${serviceForCapability}&solution=${encodeURIComponent(capability.id)}`,
    );
  };

  return (
    <div className="industry_api_solutions">
      <div className="industry_api_solutions__header">
        <div>
          <h3>Solutions for {industryTitle}</h3>
          <p>
            {industryCapabilities.length > 0
              ? `${industryCapabilities.length} solution(s) available`
              : "Submitted solutions for this industry"}
          </p>
        </div>
        <Link
          to={`/explore-solutions?domain=${encodeURIComponent(resolvedDomainCode)}`}
          className="industry_api_solutions__link"
        >
          View all in Explore Solutions
        </Link>
      </div>

      {loading && (
        <p className="industry_api_solutions__status">Loading solutions...</p>
      )}

      {!loading && fetchError && (
        <p className="industry_api_solutions__status industry_api_solutions__status--error">
          {fetchError}
        </p>
      )}

      {!loading && !fetchError && industryCapabilities.length === 0 && (
        <p className="industry_api_solutions__status">
          No published solutions for {industryTitle} yet.
        </p>
      )}

      {!loading && industryCapabilities.length > 0 && (
        <div className="ccm_dashboard__grid ccm_dashboard__grid--submitted industry_api_solutions__grid">
          {industryCapabilities.map((capability) => (
            <SolutionCapabilityCard
              key={capability.id || capability.title}
              capability={capability}
              onRequestDemo={setDemoRequestTarget}
              onNavigate={handleSolutionNavigate}
            />
          ))}
        </div>
      )}

      {demoRequestTarget && (
        <RequestDemoModal
          capability={demoRequestTarget}
          onClose={() => setDemoRequestTarget(null)}
        />
      )}
    </div>
  );
};

export default IndustryApiSolutions;
