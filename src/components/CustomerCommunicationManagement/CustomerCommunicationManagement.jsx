import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { EditIcon, TrashIcon } from "../icons/FeatherIcons";
import AddAISolutionCard from "../AddAISolutionCard";
import TalkToExpertCard from "../TalkToExpertCard";
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
  enrichCapabilityContacts,
  extractSolutionIdFromCapabilityId,
  hydrateCapability,
  loadPersistedSubmittedCapabilities,
  mapApiSolutionToCapability,
  mergeSubmittedCapabilities,
  persistSubmittedCapability,
  prunePersistedCapabilitiesSyncedWithApi,
  removePersistedSubmittedCapability,
  resolveCapabilityIcon,
  shouldDeleteCapabilityFromApi,
} from "../../utils/solutionMapper";
import "./CustomerCommunicationManagement.scss";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://func-aiverse-backend-dwgpguatgadjezae.centralindia-01.azurewebsites.net/api";

const getInitials = (name) =>
  name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

const PersonAvatar = ({ name, color }) => (
  <span className={`ccm_dashboard__avatar ccm_dashboard__avatar--${color}`}>
    {getInitials(name)}
  </span>
);

const CapabilityCard = ({
  capability,
  isHighlighted = false,
  onEdit,
  onDelete,
  onRequestDemo,
  isDeleting = false,
}) => {
  const CardIcon = resolveCapabilityIcon(capability);
  const hasRecordedDemo = Boolean(capability.recordedDemoLink);
  const isSubmitted = Boolean(capability.isApiSolution);

  return (
    <article
      className={`ccm_dashboard__capability${isHighlighted ? " is-highlighted" : ""}${isSubmitted ? " is-submitted" : ""}`}
      data-solution-id={capability.id}
    >
      {isSubmitted && (
        <div className="ccm_dashboard__capability-controls">
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

      <div className="ccm_dashboard__capability-body">
        <div className="ccm_dashboard__capability-head">
          <span className="ccm_dashboard__capability-icon" aria-hidden="true">
            <CardIcon />
          </span>
          <h4>{capability.title}</h4>
        </div>

        <p>{capability.description}</p>

        <div className="ccm_dashboard__meta">
          <div className="ccm_dashboard__meta-block">
            <span className="ccm_dashboard__section-label">
              <CoeLabelIcon />
              COE
            </span>
            <div className="ccm_dashboard__person">
              <PersonAvatar
                name={capability.coe.name}
                color={capability.coe.color}
              />
              <div>
                <strong>{capability.coe.name}</strong>
                <span>{capability.coe.title}</span>
              </div>
            </div>
          </div>

          <div className="ccm_dashboard__meta-block">
            <span className="ccm_dashboard__section-label">
              <EvangelistLabelIcon />
              AI EVANGELISTS
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

          <div className="ccm_dashboard__meta-block ccm_dashboard__meta-block--tech">
            <span className="ccm_dashboard__section-label">
              <TechStackLabelIcon />
              TECH STACK
            </span>
            <div className="ccm_dashboard__tags">
              {capability.techStack.map((tech) => (
                <div className="ccm_dashboard__tag" key={tech.name}>
                  <strong>{tech.name}</strong>
                  <span>{tech.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ccm_dashboard__capability-actions">
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
    </article>
  );
};

const CustomerCommunicationManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service");
  const highlightId = searchParams.get("highlight");
  const submitted = searchParams.get("submitted") === "1";
  const [activeServiceIndex, setActiveServiceIndex] = useState(() =>
    getEnterpriseServiceIndexById(serviceId),
  );
  const [apiCapabilities, setApiCapabilities] = useState([]);
  const [pendingCapabilities, setPendingCapabilities] = useState(() =>
    loadPersistedSubmittedCapabilities().map(hydrateCapability),
  );
  const [loadingApiSolutions, setLoadingApiSolutions] = useState(true);
  const [aiEvangelists, setAiEvangelists] = useState([]);
  const [solutionOwners, setSolutionOwners] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingCapabilityId, setDeletingCapabilityId] = useState(null);
  const [demoRequestTarget, setDemoRequestTarget] = useState(null);

  useEffect(() => {
    const fetchDirectories = async () => {
      try {
        const [ownersResponse, evangelistsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/get-solution-owners`),
          fetch(`${API_BASE_URL}/get-ai-evangelists`),
        ]);

        const ownersResult = await ownersResponse.json();
        const evangelistsResult = await evangelistsResponse.json();

        if (ownersResponse.ok && ownersResult.status === "success") {
          setSolutionOwners(ownersResult.data || []);
        }

        if (evangelistsResponse.ok && evangelistsResult.status === "success") {
          setAiEvangelists(evangelistsResult.data || []);
        }
      } catch (error) {
        console.error("Error fetching solution directories:", error);
      }
    };

    fetchDirectories();
  }, []);

  useEffect(() => {
    if (aiEvangelists.length === 0 && solutionOwners.length === 0) return;

    setPendingCapabilities((prev) =>
      prev.map((capability) =>
        hydrateCapability(
          enrichCapabilityContacts(capability, {
            evangelistDirectory: aiEvangelists,
            solutionOwners,
          }),
        ),
      ),
    );
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

  useEffect(() => {
    if (!highlightId || loadingApiSolutions) return;

    const timer = window.setTimeout(() => {
      const element = document.querySelector(`[data-solution-id="api-${highlightId}"]`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [highlightId, loadingApiSolutions, activeServiceIndex]);

  useEffect(() => {
    let isMounted = true;

    const fetchSubmittedSolutions = async () => {
      try {
        setLoadingApiSolutions(true);
        const response = await fetch(`${API_BASE_URL}/get-usecases`);
        const result = await response.json();

        if (
          isMounted &&
          response.ok &&
          result.status === "success" &&
          Array.isArray(result.data)
        ) {
          const hydrated = result.data.map((solution) =>
            hydrateCapability(
              mapApiSolutionToCapability(solution, {
                evangelistDirectory: aiEvangelists,
                solutionOwners,
              }),
            ),
          );
          setApiCapabilities(hydrated);
          prunePersistedCapabilitiesSyncedWithApi(hydrated);
          setPendingCapabilities(
            loadPersistedSubmittedCapabilities().map(hydrateCapability),
          );
        }
      } catch (error) {
        console.error("Error fetching submitted solutions:", error);
      } finally {
        if (isMounted) {
          setLoadingApiSolutions(false);
        }
      }
    };

    fetchSubmittedSolutions();

    if (submitted) {
      const retryTimer = window.setTimeout(fetchSubmittedSolutions, 2000);
      return () => {
        isMounted = false;
        window.clearTimeout(retryTimer);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [submitted, aiEvangelists, solutionOwners]);

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

    try {
      setDeletingCapabilityId(capability.id);

      if (deleteFromApi && solutionId) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/delete-usecase?id=${solutionId}`,
            { method: "DELETE" },
          );

          let result = {};
          try {
            result = await response.json();
          } catch {
            result = {};
          }

          if (!response.ok || result.status !== "success") {
            console.warn(
              "Server delete failed; removing card from this page anyway.",
              result.message,
            );
          }
        } catch (apiError) {
          console.warn(
            "Server delete unavailable; removing card from this page anyway.",
            apiError,
          );
        }
      }

      removePersistedSubmittedCapability(capability.id);
      setApiCapabilities((prev) =>
        prev.filter((item) => item.id !== capability.id),
      );
      setPendingCapabilities((prev) =>
        prev.filter((item) => item.id !== capability.id),
      );
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting solution:", error);
      window.alert("Failed to remove solution from this page.");
    } finally {
      setDeletingCapabilityId(null);
    }
  };

  const handleServiceChange = (index) => {
    setActiveServiceIndex(index);
    navigate(`/explore-solutions?service=${enterpriseServicesData[index].id}`, {
      replace: true,
    });
  };

  const activeService = enterpriseServicesData[activeServiceIndex];
  const BannerIcon = activeService.navIcon;

  const submittedCapabilities = useMemo(
    () =>
      mergeSubmittedCapabilities({
        apiCapabilities,
        pendingCapabilities,
        activeServiceId: activeService.id,
      }),
    [apiCapabilities, pendingCapabilities, activeService.id],
  );

  const totalSolutionCount =
    submittedCapabilities.length + activeService.capabilities.length;

  return (
    <div className="ccm_dashboard">
      <aside className="ccm_dashboard__sidebar">
        <nav className="ccm_dashboard__nav" aria-label="Enterprise services">
          <h2>ALL ENTERPRISE SERVICES</h2>
          <ul>
            {enterpriseServicesData.map((service, index) => {
              const isActive = index === activeServiceIndex;
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

        <AddAISolutionCard />
        <TalkToExpertCard />
      </aside>

      <main className="ccm_dashboard__main" key={activeService.label}>
        <section className="ccm_dashboard__banner">
          <div className="ccm_dashboard__banner-header">
            <div className="ccm_dashboard__banner-icon" aria-hidden="true">
              <BannerIcon />
            </div>
            <div className="ccm_dashboard__banner-copy">
              <h1>{activeService.label}</h1>
              <p>{activeService.subtitle}</p>
            </div>
          </div>

          <div className="ccm_dashboard__banner-body">
            <ul className="ccm_dashboard__features">
              {activeService.features.map((feature) => (
                <li key={feature}>
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

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
                  ? `${submittedCapabilities.length} submitted solution(s) shown with featured capability areas`
                  : `${activeService.capabilities.length} solution areas — hover a card to manage`}
              </p>
            </div>
            <span className="ccm_dashboard__badge">
              {totalSolutionCount} Solutions
            </span>
          </div>

          {submittedCapabilities.length > 0 && (
            <div className="ccm_dashboard__submitted-section">
              <h3>Your Submitted Solutions</h3>
              <div className="ccm_dashboard__grid ccm_dashboard__grid--submitted">
                {submittedCapabilities.map((capability) => (
                  <CapabilityCard
                    capability={capability}
                    key={capability.id || capability.title}
                    isHighlighted={
                      highlightId != null &&
                      (capability.id === `api-${highlightId}` ||
                        capability.id === `api-pending-${highlightId}`)
                    }
                    onEdit={handleEditCapability}
                    onDelete={handleDeleteCapability}
                    onRequestDemo={handleRequestDemo}
                    isDeleting={deletingCapabilityId === capability.id}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="ccm_dashboard__capabilities-header ccm_dashboard__capabilities-header--secondary">
            <div>
              <h3>Featured Capability Areas</h3>
              <p>Reference solution cards for this enterprise service</p>
            </div>
          </div>

          <div className="ccm_dashboard__grid">
            {activeService.capabilities.map((capability) => (
              <CapabilityCard
                capability={capability}
                key={capability.title}
                onRequestDemo={handleRequestDemo}
              />
            ))}
          </div>

          {loadingApiSolutions && submittedCapabilities.length === 0 && (
            <p className="ccm_dashboard__loading-note">Loading submitted solutions...</p>
          )}
        </section>
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
