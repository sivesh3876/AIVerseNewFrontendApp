import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { EditIcon, TrashIcon } from "../icons/FeatherIcons";
import SolutionCapabilityCard from "../SolutionCapabilityCard/SolutionCapabilityCard";
import AddAISolutionCard from "../AddAISolutionCard";
import TalkToExpertCard from "../TalkToExpertCard";
import SolutionDocuments from "../SolutionDocuments";
import RequestDemoModal from "./RequestDemoModal";
import {
  TechStackLabelIcon,
  CoeLabelIcon,
  EvangelistLabelIcon,
  VideoCameraIcon,
} from "./CapabilityIcons";
import {
  enterpriseServicesData,
  getEnterpriseServiceIndexById,
} from "./enterpriseServicesData";
import {
  buildDetailFromCapability,
  mapApiSolutionToDetail,
  solutionToCapabilityCard,
} from "../../data/solutionsData";
import {
  enrichCapabilityContacts,
  extractSolutionIdFromCapabilityId,
  filterOutDeletedSolutions,
  getServiceIdForDomain,
  hydrateCapability,
  loadPersistedSubmittedCapabilities,
  mapApiSolutionToCapability,
  markSolutionAsDeleted,
  mergeSubmittedCapabilities,
  persistSubmittedCapability,
  prunePersistedCapabilitiesSyncedWithApi,
  removePersistedSubmittedCapability,
  resolveCapabilityIcon,
  shouldDeleteCapabilityFromApi,
} from "../../utils/solutionMapper";
import { buildDocumentsFromCapability } from "../../utils/solutionDocuments";
import { useScrollToSection } from "../../utils/pageScroll";
import {
  deleteUseCase,
  fetchAllUseCases,
  fetchUseCaseById,
  getUsecasesApiBaseUrl,
} from "../../services/usecasesService";
import "./CustomerCommunicationManagement.scss";

const API_BASE_URL = getUsecasesApiBaseUrl();

const getInitials = (name) =>
  name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const PersonAvatar = ({ name, color }) => (
  <span className={`ccm_dashboard__avatar ccm_dashboard__avatar--${color}`}>
    {getInitials(name)}
  </span>
);

const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="9" stroke="#3A8D9D" strokeWidth="1.75" />
    <path
      d="m8 12 2.5 2.5L16 9"
      stroke="#3A8D9D"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SolutionDetailPanel = ({
  capability,
  detailSolution,
  documents,
  onBack,
  onEdit,
  onDelete,
  onRequestDemo,
  isDeleting = false,
}) => {
  const hasRecordedDemo = Boolean(capability.recordedDemoLink);
  const showAdminActions = Boolean(detailSolution?.isApiSolution);
  const clientName = (detailSolution?.client || capability.client || "").trim();

  return (
    <section className="ccm_dashboard__content">
      <div className="ccm_dashboard__content-toolbar">
        <button type="button" className="ccm_dashboard__back-link" onClick={onBack}>
          &larr; Back to solutions
        </button>

        {showAdminActions && (
          <div className="ccm_dashboard__content-actions">
            <button
              type="button"
              className="ccm_dashboard__control-btn ccm_dashboard__control-btn--edit"
              onClick={() => onEdit?.(capability)}
              aria-label={`Edit ${capability.title}`}
              title="Edit"
            >
              <EditIcon />
            </button>
            <button
              type="button"
              className="ccm_dashboard__control-btn ccm_dashboard__control-btn--delete"
              onClick={() => onDelete?.(capability)}
              disabled={isDeleting}
              aria-label={`Delete ${capability.title}`}
              title="Delete"
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </div>

      <h2>About this solution</h2>

      {clientName && (
        <div className="ccm_dashboard__detail-client">
          <span className="ccm_dashboard__client-badge">
            Client: {clientName}
          </span>
        </div>
      )}

      <div className="ccm_dashboard__content-body">
        <p>{detailSolution.detailedDescription || capability.description}</p>
      </div>

      {detailSolution.industry && (
        <div className="ccm_dashboard__detail-meta">
          <span>
            <strong>Industry:</strong> {detailSolution.industry}
          </span>
        </div>
      )}

      <div className="ccm_dashboard__detail-sections">
        <div className="ccm_dashboard__detail-section">
          <span className="ccm_dashboard__section-label">
            <CoeLabelIcon />
            COE
          </span>
          <div className="ccm_dashboard__person">
            <PersonAvatar name={capability.coe.name} color={capability.coe.color} />
            <div>
              <strong>{capability.coe.name}</strong>
              <span>{capability.coe.title}</span>
            </div>
          </div>
        </div>

        <div className="ccm_dashboard__detail-section">
          <span className="ccm_dashboard__section-label">
            <EvangelistLabelIcon />
            AI Evangelists
          </span>
          <div className="ccm_dashboard__evangelists">
            {capability.evangelists.map((person) => (
              <div className="ccm_dashboard__person" key={person.name}>
                <PersonAvatar name={person.name} color={person.color} />
                <div>
                  <strong>{person.name}</strong>
                  <span>{person.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {capability.techStack.length > 0 && (
        <div className="ccm_dashboard__highlights">
          <h3>Technology Stack</h3>
          <div className="ccm_dashboard__highlights-grid">
            {capability.techStack.map((tech) => (
              <article className="ccm_dashboard__highlight" key={`${tech.name}-${tech.label}`}>
                <h4>{tech.name}</h4>
                <p>{tech.label}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="ccm_dashboard__detail-actions">
        <button
          type="button"
          className="ccm_dashboard__action-btn"
          onClick={() => onRequestDemo?.(capability)}
        >
          Request Demo
        </button>
        {hasRecordedDemo ? (
          <a
            href={capability.recordedDemoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ccm_dashboard__action-btn"
          >
            Recorded Demo
            <VideoCameraIcon />
          </a>
        ) : (
          <button type="button" className="ccm_dashboard__action-btn" disabled>
            Recorded Demo
            <VideoCameraIcon />
          </button>
        )}
      </div>

      {documents.length > 0 && (
        <SolutionDocuments
          documents={documents}
          variant="full"
          title="Solution Resources & Attachments"
          subtitle="Review the solution overview, low level design, architecture diagrams, and any supporting documents."
          className="ccm_dashboard__detail-documents"
        />
      )}
    </section>
  );
};

const CustomerCommunicationManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service");
  const solutionQueryId = searchParams.get("solution");
  const isDetailView = Boolean(solutionQueryId);
  const activeDomainCode = searchParams.get("domain");
  const highlightId = searchParams.get("highlight");
  const submitted = searchParams.get("submitted") === "1";
  const mainRef = useRef(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(() =>
    getEnterpriseServiceIndexById(serviceId),
  );
  const [apiSolutions, setApiSolutions] = useState([]);
  const [pendingCapabilities, setPendingCapabilities] = useState(() =>
    loadPersistedSubmittedCapabilities().map(hydrateCapability),
  );
  const [loadingApiSolutions, setLoadingApiSolutions] = useState(true);
  const [solutionsFetchError, setSolutionsFetchError] = useState(null);
  const [detailSolution, setDetailSolution] = useState(null);
  const [loadingDetailSolution, setLoadingDetailSolution] = useState(false);
  const [detailSolutionError, setDetailSolutionError] = useState(null);
  const [aiEvangelists, setAiEvangelists] = useState([]);
  const [solutionOwners, setSolutionOwners] = useState([]);
  const [businessDomains, setBusinessDomains] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingCapabilityId, setDeletingCapabilityId] = useState(null);
  const [demoRequestTarget, setDemoRequestTarget] = useState(null);
  const fetchRequestIdRef = useRef(0);

  useEffect(() => {
    const fetchDirectories = async () => {
      try {
        const [ownersResponse, evangelistsResponse, domainsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/get-solution-owners`),
          fetch(`${API_BASE_URL}/get-ai-evangelists`),
          fetch(`${API_BASE_URL}/get-business-domains`),
        ]);

        const ownersResult = await ownersResponse.json();
        const evangelistsResult = await evangelistsResponse.json();
        const domainsResult = await domainsResponse.json();

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
        console.error("Error fetching solution directories:", error);
      }
    };

    fetchDirectories();
  }, []);

  useEffect(() => {
    if (aiEvangelists.length === 0 && solutionOwners.length === 0) return;

    const enrich = (capability) =>
      hydrateCapability(
        enrichCapabilityContacts(capability, {
          evangelistDirectory: aiEvangelists,
          solutionOwners,
        }),
      );

    setPendingCapabilities((prev) => prev.map(enrich));
  }, [aiEvangelists, solutionOwners]);

  useEffect(() => {
    const fromNavigation = location.state?.submittedSolution;
    if (fromNavigation) {
      persistSubmittedCapability(fromNavigation);
      setPendingCapabilities(loadPersistedSubmittedCapabilities().map(hydrateCapability));
    }
  }, [location.state?.submittedSolution]);

  useEffect(() => {
    setActiveServiceIndex(getEnterpriseServiceIndexById(serviceId));
  }, [serviceId]);

  useScrollToSection(mainRef, [solutionQueryId, activeServiceIndex]);

  useEffect(() => {
    if (!highlightId || loadingApiSolutions) return;

    const timer = window.setTimeout(() => {
      const element = document.querySelector(`[data-solution-id="api-${highlightId}"]`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [highlightId, loadingApiSolutions, activeServiceIndex]);

  useEffect(() => {
    const requestId = ++fetchRequestIdRef.current;

    const fetchSubmittedSolutions = async () => {
      try {
        setLoadingApiSolutions(true);
        setSolutionsFetchError(null);

        const data = filterOutDeletedSolutions(await fetchAllUseCases());
        if (requestId !== fetchRequestIdRef.current) return;

        setApiSolutions(data);

        const mappedForSync = data
          .map((solution) => {
            try {
              return mapApiSolutionToCapability(solution);
            } catch (error) {
              console.error("Failed to map solution:", solution?.ID, error);
              return null;
            }
          })
          .filter(Boolean);

        prunePersistedCapabilitiesSyncedWithApi(mappedForSync);
        setPendingCapabilities(
          loadPersistedSubmittedCapabilities().map(hydrateCapability),
        );
      } catch (error) {
        console.error("Error fetching submitted solutions:", error);
        if (requestId === fetchRequestIdRef.current) {
          setSolutionsFetchError(
            error.message || "Network error while loading solutions",
          );
        }
      } finally {
        if (requestId === fetchRequestIdRef.current) {
          setLoadingApiSolutions(false);
        }
      }
    };

    fetchSubmittedSolutions();

    if (submitted) {
      const retryTimer = window.setTimeout(fetchSubmittedSolutions, 2000);
      return () => {
        window.clearTimeout(retryTimer);
        fetchRequestIdRef.current += 1;
      };
    }

    return () => {
      fetchRequestIdRef.current += 1;
    };
  }, [submitted]);

  const handleEditCapability = (capability) => {
    const solutionId = extractSolutionIdFromCapabilityId(capability.id);
    if (!solutionId) return;
    navigate(`/get-started?id=${solutionId}`);
  };

  const handleDeleteCapability = (capability) => {
    setDeleteTarget(capability);
  };

  const handleRequestDemo = (capability) => {
    setDemoRequestTarget(capability);
  };

  const cancelDeleteCapability = () => {
    if (deletingCapabilityId) return;
    setDeleteTarget(null);
  };

  const confirmDeleteCapability = async () => {
    if (!deleteTarget) return;

    const capability = deleteTarget;
    const solutionId = extractSolutionIdFromCapabilityId(capability.id);
    const deleteFromApi = shouldDeleteCapabilityFromApi(capability, apiCapabilities);

    setDeletingCapabilityId(capability.id);

    if (deleteFromApi && solutionId) {
      markSolutionAsDeleted(solutionId);
    }

    removePersistedSubmittedCapability(capability.id);
    setApiSolutions((prev) =>
      prev.filter((item) => `api-${item.ID}` !== capability.id),
    );
    setPendingCapabilities((prev) =>
      prev.filter((item) => item.id !== capability.id),
    );
    setDeleteTarget(null);
    setDeletingCapabilityId(null);

    if (solutionQueryId === capability.id) {
      handleBackToSolutions();
    }

    if (deleteFromApi && solutionId) {
      try {
        await deleteUseCase(solutionId);
      } catch (error) {
        console.warn("Server delete failed; solution remains hidden on this browser.", error);
      }
    }
  };

  const handleServiceChange = (index) => {
    setActiveServiceIndex(index);
    navigate(`/explore-solutions?service=${enterpriseServicesData[index].id}`, {
      replace: true,
    });
  };

  const handleIndustryChange = (domainCode) => {
    navigate(`/explore-solutions?domain=${domainCode}`, {
      replace: true,
    });
  };

  const handleBackToSolutions = () => {
    const serviceLine = detailSolution?.serviceLine || activeService.id;
    navigate(`/explore-solutions?service=${serviceLine}`, { replace: true });
  };

  const apiCapabilities = useMemo(
    () =>
      apiSolutions
        .filter((solution) => solution.IsSolutionActive !== false)
        .map((solution) => {
          try {
            return hydrateCapability(
              mapApiSolutionToCapability(solution, {
                evangelistDirectory: aiEvangelists,
                solutionOwners,
              }),
            );
          } catch (error) {
            console.error("Failed to map solution:", solution?.ID, error);
            return null;
          }
        })
        .filter(Boolean),
    [apiSolutions, aiEvangelists, solutionOwners],
  );

  const activeService = enterpriseServicesData[activeServiceIndex];
  const activeIndustryDomain = businessDomains.find(
    (domain) => domain.DomainCode === activeDomainCode,
  );
  const industryDomains = businessDomains.filter(
    (domain) => domain.ParentDomainCode === "Industries",
  );
  const detailPrimaryCapability = detailSolution
    ? solutionToCapabilityCard(detailSolution)
    : null;
  const BannerIconComponent =
    isDetailView && detailPrimaryCapability
      ? resolveCapabilityIcon(detailPrimaryCapability)
      : activeService.navIcon;
  const bannerTitle =
    detailSolution?.title || activeIndustryDomain?.DomainName || activeService.label;
  const bannerSubtitle =
    detailSolution?.shortDescription ||
    activeIndustryDomain?.Description ||
    activeService.subtitle;
  const bannerFeatures =
    isDetailView && detailPrimaryCapability
      ? detailPrimaryCapability.techStack.map((tech) => tech.name)
      : activeIndustryDomain
        ? []
        : activeService.features;

  const submittedCapabilities = useMemo(
    () =>
      mergeSubmittedCapabilities({
        apiCapabilities,
        pendingCapabilities,
        activeServiceId: activeService.id,
        activeDomainCode,
      }),
    [apiCapabilities, pendingCapabilities, activeService.id, activeDomainCode],
  );

  useEffect(() => {
    if (!solutionQueryId) {
      setDetailSolution(null);
      setDetailSolutionError(null);
      setLoadingDetailSolution(false);
      return;
    }

    const mapDirectories = {
      evangelistDirectory: aiEvangelists,
      solutionOwners,
      businessDomains,
    };

    const rawSolution = apiSolutions.find(
      (solution) => `api-${solution.ID}` === solutionQueryId,
    );

    if (rawSolution) {
      setDetailSolution(mapApiSolutionToDetail(rawSolution, mapDirectories));
      setDetailSolutionError(null);
      setLoadingDetailSolution(false);
      return;
    }

    const matchedCapability = [...apiCapabilities, ...pendingCapabilities].find(
      (capability) => capability.id === solutionQueryId,
    );

    if (matchedCapability) {
      setDetailSolution(
        buildDetailFromCapability(matchedCapability, mapDirectories),
      );
      setDetailSolutionError(null);
      setLoadingDetailSolution(false);
      return;
    }

    const apiMatch = solutionQueryId.match(/^api-(\d+)$/);
    if (!apiMatch) {
      setDetailSolution(null);
      setDetailSolutionError("Solution not found.");
      setLoadingDetailSolution(false);
      return;
    }

    let isMounted = true;

    const loadSolutionDetail = async () => {
      try {
        setLoadingDetailSolution(true);
        setDetailSolutionError(null);

        const fetchedSolution = await fetchUseCaseById(apiMatch[1]);
        if (!isMounted) return;

        setDetailSolution(
          mapApiSolutionToDetail(fetchedSolution, mapDirectories),
        );
      } catch (error) {
        console.error("Error loading solution detail:", error);
        if (isMounted) {
          setDetailSolution(null);
          setDetailSolutionError("Solution not found or could not be loaded.");
        }
      } finally {
        if (isMounted) {
          setLoadingDetailSolution(false);
        }
      }
    };

    if (!loadingApiSolutions) {
      loadSolutionDetail();
    }

    return () => {
      isMounted = false;
    };
  }, [
    solutionQueryId,
    apiSolutions,
    apiCapabilities,
    pendingCapabilities,
    aiEvangelists,
    solutionOwners,
    businessDomains,
    loadingApiSolutions,
  ]);

  useEffect(() => {
    if (detailSolution?.serviceLine) {
      setActiveServiceIndex(getEnterpriseServiceIndexById(detailSolution.serviceLine));
    }
  }, [detailSolution?.serviceLine]);

  useEffect(() => {
    if (!detailSolution?.serviceLine || !solutionQueryId) return;
    if (serviceId === detailSolution.serviceLine) return;

    navigate(
      `/explore-solutions?service=${detailSolution.serviceLine}&solution=${encodeURIComponent(solutionQueryId)}`,
      { replace: true },
    );
  }, [detailSolution?.serviceLine, navigate, serviceId, solutionQueryId]);

  const detailDocuments = useMemo(
    () => buildDocumentsFromCapability(detailPrimaryCapability || {}),
    [detailPrimaryCapability],
  );

  const handleCapabilityNavigate = (capability) => {
    if (!capability.id) return;

    const serviceForCapability =
      getServiceIdForDomain(capability.businessDomain) || activeService.id;

    navigate(
      `/explore-solutions?service=${serviceForCapability}&solution=${encodeURIComponent(capability.id)}`,
    );
  };

  const totalSolutionCount = isDetailView
    ? 1
    : submittedCapabilities.length;

  return (
    <div className="ccm_dashboard">
      <aside className="ccm_dashboard__sidebar">
        <nav className="ccm_dashboard__nav" aria-label="Enterprise services">
          <h2>ALL ENTERPRISE SERVICES</h2>
          <ul>
            {enterpriseServicesData.map((service, index) => {
              const isActive = !activeDomainCode && index === activeServiceIndex;
              const NavIcon = service.navIcon;

              return (
                <li key={service.id}>
                  <button
                    type="button"
                    className={`ccm_dashboard__nav-item${isActive ? " is-active" : ""}`}
                    onClick={() => handleServiceChange(index)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="ccm_dashboard__nav-icon" aria-hidden="true">
                      <NavIcon />
                    </span>
                    <span className="ccm_dashboard__nav-label">{service.label}</span>
                    {isActive && (
                      <span className="ccm_dashboard__nav-arrow" aria-hidden="true">
                        &rsaquo;
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {industryDomains.length > 0 && (
          <nav className="ccm_dashboard__nav ccm_dashboard__nav--industries" aria-label="Industries">
            <h2>INDUSTRIES</h2>
            <ul>
              {industryDomains.map((domain) => {
                const isActive = activeDomainCode === domain.DomainCode;

                return (
                  <li key={domain.DomainCode}>
                    <button
                      type="button"
                      className={`ccm_dashboard__nav-item${isActive ? " is-active" : ""}`}
                      onClick={() => handleIndustryChange(domain.DomainCode)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="ccm_dashboard__nav-label">{domain.DomainName}</span>
                      {isActive && (
                        <span className="ccm_dashboard__nav-arrow" aria-hidden="true">
                          &rsaquo;
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <AddAISolutionCard />
        <TalkToExpertCard />
      </aside>

      <main
        className="ccm_dashboard__main"
        key={solutionQueryId || activeDomainCode || activeService.id}
        ref={mainRef}
      >
        <section className="ccm_dashboard__banner">
          <div className="ccm_dashboard__banner-header">
            <div className="ccm_dashboard__banner-icon" aria-hidden="true">
              <BannerIconComponent />
            </div>
            <div className="ccm_dashboard__banner-copy">
              <h1>{bannerTitle}</h1>
              <p>{bannerSubtitle}</p>
            </div>
          </div>

          <div className="ccm_dashboard__banner-body">
            {bannerFeatures.length > 0 && (
              <ul className="ccm_dashboard__features">
                {bannerFeatures.map((feature) => (
                  <li key={feature}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {isDetailView ? (
          <>
            {loadingDetailSolution && (
              <p className="ccm_dashboard__loading-note">Loading solution details...</p>
            )}

            {detailSolutionError && !loadingDetailSolution && (
              <p className="ccm_dashboard__loading-note ccm_dashboard__loading-note--error">
                {detailSolutionError}
              </p>
            )}

            {detailSolution && detailPrimaryCapability && (
              <SolutionDetailPanel
                capability={detailPrimaryCapability}
                detailSolution={detailSolution}
                documents={detailDocuments}
                onBack={handleBackToSolutions}
                onEdit={detailSolution.isApiSolution ? handleEditCapability : undefined}
                onDelete={
                  detailSolution.isApiSolution ? handleDeleteCapability : undefined
                }
                onRequestDemo={handleRequestDemo}
                isDeleting={deletingCapabilityId === detailPrimaryCapability.id}
              />
            )}
          </>
        ) : (
        <section className="ccm_dashboard__capabilities">
          {submitted && (
            <div className="ccm_dashboard__submitted-banner">
              Your solution was saved successfully and is now visible below.
            </div>
          )}

          <div className="ccm_dashboard__capabilities-header">
            <div>
              <h2>Key Capabilities</h2>
              <p>
                {submittedCapabilities.length > 0
                  ? `${submittedCapabilities.length} solution(s) available`
                  : "Submitted solutions for this enterprise service"}
              </p>
            </div>
            <span className="ccm_dashboard__badge">
              {totalSolutionCount} Solutions
            </span>
          </div>

          {submittedCapabilities.length > 0 && (
            <div className="ccm_dashboard__grid ccm_dashboard__grid--submitted">
              {submittedCapabilities.map((capability) => (
                <SolutionCapabilityCard
                  capability={capability}
                  key={capability.id || capability.title}
                  isHighlighted={
                    highlightId != null &&
                    (capability.id === `api-${highlightId}` ||
                      capability.id === `api-pending-${highlightId}`)
                  }
                  showAdminActions
                  onEdit={handleEditCapability}
                  onDelete={handleDeleteCapability}
                  onRequestDemo={handleRequestDemo}
                  onNavigate={handleCapabilityNavigate}
                  isDeleting={deletingCapabilityId === capability.id}
                />
              ))}
            </div>
          )}

          {solutionsFetchError && !loadingApiSolutions && (
            <p className="ccm_dashboard__loading-note ccm_dashboard__loading-note--error">
              {solutionsFetchError}
            </p>
          )}

          {!solutionsFetchError &&
            !loadingApiSolutions &&
            submittedCapabilities.length === 0 && (
            <p className="ccm_dashboard__loading-note">
              No submitted solutions for this service yet.
            </p>
          )}

          {loadingApiSolutions && submittedCapabilities.length === 0 && (
            <p className="ccm_dashboard__loading-note">Loading submitted solutions...</p>
          )}
        </section>
        )}
      </main>

      {demoRequestTarget && (
        <RequestDemoModal
          capability={demoRequestTarget}
          onClose={() => setDemoRequestTarget(null)}
        />
      )}

      {deleteTarget && (
        <div
          className="ccm_dashboard__delete-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ccm-delete-title"
          onClick={cancelDeleteCapability}
        >
          <div
            className="ccm_dashboard__delete-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="ccm-delete-title">Delete Solution</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.title}</strong>?
            </p>
            <div className="ccm_dashboard__delete-actions">
              <button
                type="button"
                className="ccm_dashboard__delete-btn ccm_dashboard__delete-btn--secondary"
                onClick={cancelDeleteCapability}
                disabled={Boolean(deletingCapabilityId)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ccm_dashboard__delete-btn ccm_dashboard__delete-btn--danger"
                onClick={confirmDeleteCapability}
                disabled={Boolean(deletingCapabilityId)}
              >
                {deletingCapabilityId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCommunicationManagement;
