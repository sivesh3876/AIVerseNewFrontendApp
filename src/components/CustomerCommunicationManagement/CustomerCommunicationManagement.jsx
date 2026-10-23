import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { EditIcon, TrashIcon } from "../icons/FeatherIcons";
import SolutionCapabilityCard from "../SolutionCapabilityCard/SolutionCapabilityCard";
import AddAISolutionCard from "../AddAISolutionCard";
import TalkToExpertCard from "../TalkToExpertCard";
import SolutionDocuments from "../SolutionDocuments";
import SolutionEngagement from "../SolutionEngagement/SolutionEngagement";
import RequestDemoModal from "./RequestDemoModal";
import {
  TechStackLabelIcon,
  CoeLabelIcon,
  EvangelistLabelIcon,
  AiFoundationLabelIcon,
  VideoCameraIcon,
  DocumentIcon,
} from "./CapabilityIcons";
import {
  enterpriseServicesData,
  getEnterpriseServiceIndexById,
} from "./enterpriseServicesData";
import {
  getIndustryByDomainCode,
  industrySolutionsData,
} from "../IndustryExplore/industrySolutionsData";
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
  isIndustryBusinessDomain,
  loadPersistedSubmittedCapabilities,
  mapApiSolutionToCapability,
  markSolutionAsDeleted,
  mergeSubmittedCapabilities,
  persistSubmittedCapability,
  prunePersistedCapabilitiesSyncedWithApi,
  isPublicSolutionVisible,
  removePersistedSubmittedCapability,
  resolveCapabilityIcon,
  shouldDeleteCapabilityFromApi,
} from "../../utils/solutionMapper";
import {
  buildDocumentsFromCapability,
  excludeSalesDeskDocuments,
  getSalesDeskDocumentUrl,
} from "../../utils/solutionDocuments";
import { useScrollToSection } from "../../utils/pageScroll";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  deleteUseCase,
  fetchAllUseCases,
  fetchUseCaseById,
  getUsecasesApiBaseUrl,
} from "../../services/usecasesService";
import {
  SOLUTION_STATUS_STORAGE_KEY,
  SOLUTION_STATUS_UPDATED_EVENT,
  applyInactiveSolutionOverrides,
} from "../../utils/solutionStatusStorage";
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
  showAdminActions = false,
}) => {
  const hasRecordedDemo = Boolean(capability.recordedDemoLink);
  const salesDeskUrl = getSalesDeskDocumentUrl(capability);
  const hasSalesDesk = Boolean(salesDeskUrl);
  const clientName = (detailSolution?.client || capability.client || "").trim();
  const attachmentDocuments = excludeSalesDeskDocuments(documents);
  const businessDomain =
    capability.businessDomain || detailSolution?.businessDomain;
  const isIndustrySolution = isIndustryBusinessDomain(businessDomain);
  const placementLabel = isIndustrySolution ? "Industry" : "Service line";
  const placementValue = isIndustrySolution
    ? detailSolution?.industry
    : detailSolution?.serviceLineLabel || detailSolution?.industry;

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
            AI Foundation: {clientName}
          </span>
        </div>
      )}

      <div className="ccm_dashboard__content-body">
        <p>{detailSolution.detailedDescription || capability.description}</p>
      </div>

      {placementValue && (
        <div className="ccm_dashboard__detail-meta">
          <span>
            <strong>{placementLabel}:</strong> {placementValue}
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
            <PersonAvatar
              name={capability.coe?.name || "Not assigned"}
              color={capability.coe?.color || "teal"}
            />
            <div>
              <strong>{capability.coe?.name || "Not assigned"}</strong>
              <span>{capability.coe?.title || "Center of Excellence"}</span>
            </div>
          </div>
        </div>

        <div className="ccm_dashboard__detail-section">
          <span className="ccm_dashboard__section-label">
            <EvangelistLabelIcon />
            AI Evangelists
          </span>
          <div className="ccm_dashboard__evangelists">
            {(capability.evangelists || []).map((person) => (
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

      {(capability.techStack || []).length > 0 && (
        <div className="ccm_dashboard__highlights">
          <h3>Technology Stack</h3>
          <div className="ccm_dashboard__highlights-grid">
            {(capability.techStack || []).map((tech) => (
              <article
                className="ccm_dashboard__highlight"
                key={`${tech.name}-${tech.label}`}
              >
                <h4>{tech.name}</h4>
              </article>
            ))}
          </div>
        </div>
      )}

      <SolutionEngagement
        solutionId={capability.id}
        title={capability.title}
        serviceLine={
          detailSolution?.serviceLine ||
          getServiceIdForDomain(capability.businessDomain)
        }
        variant="card"
        trackView
      />

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
        {hasSalesDesk ? (
          <a
            href={salesDeskUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ccm_dashboard__action-btn"
          >
            Sales Pitch
            <DocumentIcon />
          </a>
        ) : (
          <button type="button" className="ccm_dashboard__action-btn" disabled>
            Sales Pitch
            <DocumentIcon />
          </button>
        )}
      </div>

      {String(capability.efficientBenefit || "").trim() ? (
        <div className="ccm_dashboard__efficient-benefit">
          <h3>Efficient Benefit</h3>
          <p>{String(capability.efficientBenefit).trim()}</p>
        </div>
      ) : null}

      {attachmentDocuments.length > 0 && (
        <SolutionDocuments
          documents={attachmentDocuments}
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
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service");
  const solutionQueryId = searchParams.get("solution");
  const isDetailView = Boolean(solutionQueryId);
  const activeDomainCode = searchParams.get("domain");
  const industryId = searchParams.get("industry");
  const resolvedIndustryId =
    industryId || getIndustryByDomainCode(activeDomainCode)?.id || null;
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
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [highlightId, loadingApiSolutions, activeServiceIndex]);

  useEffect(() => {
    let cancelled = false;
    let latestAttempt = 0;

    const loadSubmittedSolutions = async () => {
      const attempt = ++latestAttempt;
      setLoadingApiSolutions(true);
      setSolutionsFetchError(null);

      try {
        const data = filterOutDeletedSolutions(await fetchAllUseCases()).filter(
          (solution) => {
            const title = String(solution?.Title || "").trim().toLowerCase();
            return (
              title &&
              title !== "solution title *" &&
              title !== "solution title*" &&
              title !== "untitled solution"
            );
          },
        );

        if (cancelled || attempt !== latestAttempt) return;

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
        if (cancelled || attempt !== latestAttempt) return;
        console.error("Error fetching submitted solutions:", error);
        setSolutionsFetchError(
          error.message || "Network error while loading solutions",
        );
      } finally {
        if (!cancelled && attempt === latestAttempt) {
          setLoadingApiSolutions(false);
        }
      }
    };

    loadSubmittedSolutions();
    const retryTimer = submitted
      ? window.setTimeout(loadSubmittedSolutions, 2000)
      : null;

    return () => {
      cancelled = true;
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
    };
  }, [submitted]);

  useEffect(() => {
    const syncInactiveStatus = async () => {
      try {
        const data = filterOutDeletedSolutions(await fetchAllUseCases());
        setApiSolutions(data);
        setPendingCapabilities(
          loadPersistedSubmittedCapabilities().map(hydrateCapability),
        );
      } catch {
        setApiSolutions((prev) => applyInactiveSolutionOverrides(prev));
        setPendingCapabilities((prev) => [...prev]);
      }
    };

    const syncStatusAcrossTabs = (event) => {
      if (event.key === SOLUTION_STATUS_STORAGE_KEY) {
        syncInactiveStatus();
      }
    };

    window.addEventListener(SOLUTION_STATUS_UPDATED_EVENT, syncInactiveStatus);
    window.addEventListener("storage", syncStatusAcrossTabs);
    return () => {
      window.removeEventListener(
        SOLUTION_STATUS_UPDATED_EVENT,
        syncInactiveStatus,
      );
      window.removeEventListener("storage", syncStatusAcrossTabs);
    };
  }, []);

  const handleEditCapability = (capability) => {
    const solutionId = extractSolutionIdFromCapabilityId(capability.id);
    if (!solutionId) return;
    navigate(`/get-started?id=${solutionId}`, {
      state: { returnTo: `${location.pathname}${location.search}` },
    });
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
    const industry = getIndustryByDomainCode(domainCode);

    navigate(
      `/explore-solutions?domain=${encodeURIComponent(domainCode)}${industry ? `&industry=${industry.id}` : ""}`,
      { replace: true },
    );
  };

  const handleBackToSolutions = () => {
    if (activeDomainCode && resolvedIndustryId) {
      navigate(
        `/explore-solutions?domain=${encodeURIComponent(activeDomainCode)}&industry=${resolvedIndustryId}`,
        { replace: true },
      );
      return;
    }

    if (activeDomainCode) {
      navigate(`/explore-solutions?domain=${encodeURIComponent(activeDomainCode)}`, {
        replace: true,
      });
      return;
    }

    const serviceLine = detailSolution?.serviceLine || activeService.id;
    navigate(`/explore-solutions?service=${serviceLine}`, { replace: true });
  };

  const apiCapabilities = useMemo(
    () =>
      apiSolutions
        .filter(isPublicSolutionVisible)
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
  const seenIndustryCodes = new Set();
  const apiIndustryDomains = businessDomains
    .filter((domain) => domain.ParentDomainCode === "Industries")
    .filter((domain) => {
      const key = String(domain.DomainCode || "")
        .trim()
        .toLowerCase();
      if (!key || seenIndustryCodes.has(key)) return false;
      seenIndustryCodes.add(key);
      return true;
    });
  const industryDomains =
    apiIndustryDomains.length > 0
      ? apiIndustryDomains
      : industrySolutionsData.map((industry) => ({
          DomainCode: industry.domainCode,
          DomainName: industry.navTitle || industry.title,
          ParentDomainCode: "Industries",
          Description: industry.subtitle,
        }));
  const activeIndustryMeta = activeDomainCode
    ? getIndustryByDomainCode(activeDomainCode)
    : null;
  const detailPrimaryCapability = detailSolution
    ? solutionToCapabilityCard(detailSolution)
    : null;
  const BannerIconComponent =
    isDetailView && detailPrimaryCapability
      ? resolveCapabilityIcon(detailPrimaryCapability)
      : activeIndustryMeta?.icon || activeService.navIcon;
  const bannerTitle =
    detailSolution?.title ||
    activeIndustryMeta?.title ||
    activeIndustryDomain?.DomainName ||
    activeService.label;
  const bannerSubtitle =
    activeIndustryDomain?.Description ||
    activeIndustryMeta?.subtitle ||
    activeService.subtitle;
  const bannerFeatures = activeIndustryDomain || activeIndustryMeta
    ? []
    : activeService.features;

  const submittedCapabilities = useMemo(() => {
    const merged = mergeSubmittedCapabilities({
      apiCapabilities,
      pendingCapabilities,
      activeServiceId: activeService.id,
      activeDomainCode,
    });

    const getNumericId = (capability) => {
      const match = String(capability.id || "").match(/(\d+)$/);
      return match ? Number(match[1]) : 0;
    };

    return [...merged].sort((left, right) => {
      const leftIsHighlighted =
        highlightId != null &&
        (left.id === `api-${highlightId}` ||
          left.id === `api-pending-${highlightId}`);
      const rightIsHighlighted =
        highlightId != null &&
        (right.id === `api-${highlightId}` ||
          right.id === `api-pending-${highlightId}`);

      if (leftIsHighlighted && !rightIsHighlighted) return -1;
      if (rightIsHighlighted && !leftIsHighlighted) return 1;

      return getNumericId(right) - getNumericId(left);
    });
  }, [apiCapabilities, pendingCapabilities, activeService.id, activeDomainCode, highlightId]);

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

    // Always load API solutions by id so Documentation uses detail URLs
    // (list/home cards intentionally omit SolutionDetailsDoc / LLD / etc.).
    const apiMatch = solutionQueryId.match(/^api-(\d+)$/);
    if (apiMatch) {
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

      loadSolutionDetail();

      return () => {
        isMounted = false;
      };
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

    setDetailSolution(null);
    setDetailSolutionError("Solution not found.");
    setLoadingDetailSolution(false);
  }, [
    solutionQueryId,
    apiCapabilities,
    pendingCapabilities,
    aiEvangelists,
    solutionOwners,
    businessDomains,
  ]);

  useEffect(() => {
    if (detailSolution?.serviceLine) {
      setActiveServiceIndex(getEnterpriseServiceIndexById(detailSolution.serviceLine));
    }
  }, [detailSolution?.serviceLine]);

  useEffect(() => {
    if (!detailSolution?.serviceLine || !solutionQueryId) return;
    if (activeDomainCode) return;
    if (serviceId === detailSolution.serviceLine) return;

    navigate(
      `/explore-solutions?service=${detailSolution.serviceLine}&solution=${encodeURIComponent(solutionQueryId)}`,
      { replace: true },
    );
  }, [
    activeDomainCode,
    detailSolution?.serviceLine,
    navigate,
    serviceId,
    solutionQueryId,
  ]);

  const detailDocuments = useMemo(
    () => buildDocumentsFromCapability(detailPrimaryCapability || {}),
    [detailPrimaryCapability],
  );

  const handleCapabilityNavigate = (capability) => {
    if (!capability.id) return;

    if (activeDomainCode) {
      const industrySuffix = resolvedIndustryId
        ? `&industry=${resolvedIndustryId}`
        : "";

      navigate(
        `/explore-solutions?domain=${encodeURIComponent(activeDomainCode)}${industrySuffix}&solution=${encodeURIComponent(capability.id)}`,
      );
      return;
    }

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
                const industryMeta = getIndustryByDomainCode(domain.DomainCode);
                const IndustryIcon = industryMeta?.icon;

                return (
                  <li key={domain.DomainCode}>
                    <button
                      type="button"
                      className={`ccm_dashboard__nav-item${isActive ? " is-active" : ""}`}
                      onClick={() => handleIndustryChange(domain.DomainCode)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {IndustryIcon && (
                        <span
                          className="ccm_dashboard__nav-icon"
                          style={{ background: industryMeta.iconBg }}
                          aria-hidden="true"
                        >
                          <IndustryIcon />
                        </span>
                      )}
                      <span className="ccm_dashboard__nav-label">
                        {industryMeta?.navTitle ||
                          industryMeta?.title ||
                          domain.DomainName}
                      </span>
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
              {!isDetailView && bannerSubtitle ? <p>{bannerSubtitle}</p> : null}
            </div>
          </div>

          {!isDetailView && bannerFeatures.length > 0 ? (
            <div className="ccm_dashboard__banner-body">
              <ul className="ccm_dashboard__features">
                {bannerFeatures.map((feature) => (
                  <li key={feature}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
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
                showAdminActions={
                  isAdminAuthenticated && Boolean(detailSolution.isApiSolution)
                }
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
                  showAdminActions={isAdminAuthenticated}
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
