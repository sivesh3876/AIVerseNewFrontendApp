import { EditIcon, TrashIcon } from "../icons/FeatherIcons";
import SolutionDocuments from "../SolutionDocuments";
import SolutionEngagementBar from "../SolutionEngagement/SolutionEngagementBar";
import {
  CoeLabelIcon,
  EvangelistLabelIcon,
  TechStackLabelIcon,
  AiFoundationLabelIcon,
  VideoCameraIcon,
  DocumentIcon,
} from "../CustomerCommunicationManagement/CapabilityIcons";
import { resolveCapabilityIcon } from "../../utils/solutionMapper";
import {
  buildDocumentsFromCapability,
  excludeSalesDeskDocuments,
  getSalesDeskDocumentUrl,
} from "../../utils/solutionDocuments";

const getInitials = (name) =>
  name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const PersonAvatar = ({ name, color, title }) => (
  <span
    className={`ccm_dashboard__avatar ccm_dashboard__avatar--${color}`}
    title={title || name}
  >
    {getInitials(name)}
  </span>
);

const parseAiFoundationItems = (client = "") =>
  String(client)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const SolutionCapabilityCard = ({
  capability,
  isHighlighted = false,
  onEdit,
  onDelete,
  onRequestDemo,
  onNavigate,
  isDeleting = false,
  showAdminActions = false,
}) => {
  const CardIcon = resolveCapabilityIcon(capability);
  const hasRecordedDemo = Boolean(capability.recordedDemoLink);
  const salesDeskUrl = getSalesDeskDocumentUrl(capability);
  const hasSalesDesk = Boolean(salesDeskUrl);
  const isSubmitted = Boolean(capability.isApiSolution);
  const documents = excludeSalesDeskDocuments(
    buildDocumentsFromCapability(capability),
  );
  const techStackItems = (capability.techStack || []).filter(
    (tech) => tech?.name && tech.name !== "Not specified",
  );
  const aiFoundationItems = parseAiFoundationItems(capability.client);

  return (
    <article
      className={`ccm_dashboard__capability${isHighlighted ? " is-highlighted" : ""}${isSubmitted ? " is-submitted" : ""}${onNavigate ? " is-clickable" : ""}`}
      data-solution-id={capability.id}
      onClick={() => {
        if (!onNavigate) return;
        onNavigate(capability);
      }}
      onKeyDown={(event) => {
        if (!onNavigate) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onNavigate(capability);
        }
      }}
      role={onNavigate ? "button" : undefined}
      tabIndex={onNavigate ? 0 : undefined}
    >
      {showAdminActions && isSubmitted && (
        <div className="ccm_dashboard__capability-controls">
          <button
            type="button"
            className="ccm_dashboard__control-btn ccm_dashboard__control-btn--edit"
            onClick={(event) => {
              event.stopPropagation();
              onEdit?.(capability);
            }}
            aria-label={`Edit ${capability.title}`}
            title="Edit"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className="ccm_dashboard__control-btn ccm_dashboard__control-btn--delete"
            onClick={(event) => {
              event.stopPropagation();
              onDelete?.(capability);
            }}
            disabled={isDeleting}
            aria-label={`Delete ${capability.title}`}
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      )}

      <div className="ccm_dashboard__capability-head">
        <span className="ccm_dashboard__capability-icon" aria-hidden="true">
          <CardIcon />
        </span>
        <div className="ccm_dashboard__capability-heading">
          <h4>{capability.title}</h4>
        </div>
      </div>

      <p className="ccm_dashboard__capability-description">{capability.description}</p>

      <div className="ccm_dashboard__capability-scroll">
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
            <div className="ccm_dashboard__evangelists ccm_dashboard__evangelists--list">
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

        <div className="ccm_dashboard__details-panel">
          <div className="ccm_dashboard__meta-block ccm_dashboard__meta-block--tech">
            <span className="ccm_dashboard__section-label">
              <TechStackLabelIcon />
              TECH STACK
            </span>
            <div className="ccm_dashboard__highlights-grid ccm_dashboard__highlights-grid--card">
              {techStackItems.length > 0 ? (
                techStackItems.map((tech, index) => (
                  <article
                    className="ccm_dashboard__highlight ccm_dashboard__highlight--card"
                    key={`${tech.name}-${index}`}
                  >
                    <h4>{tech.name}</h4>
                    <p>{tech.label || "Technology"}</p>
                  </article>
                ))
              ) : (
                <span className="ccm_dashboard__info-empty">Not specified</span>
              )}
            </div>
          </div>

          <div className="ccm_dashboard__meta-block ccm_dashboard__meta-block--foundation">
            <span className="ccm_dashboard__section-label">
              <AiFoundationLabelIcon />
              AI FOUNDATION
            </span>
            <div className="ccm_dashboard__info-box ccm_dashboard__info-box--scroll">
              {aiFoundationItems.length > 0 ? (
                aiFoundationItems.map((item) => (
                  <div className="ccm_dashboard__info-item" key={item}>
                    {item}
                  </div>
                ))
              ) : (
                <span>Not specified</span>
              )}
            </div>

            {aiFoundation.length > 0 && (
              <div className="ccm_dashboard__meta-block ccm_dashboard__meta-block--foundation">
                <span className="ccm_dashboard__section-label">
                  <AiFoundationLabelIcon />
                  AI FOUNDATION
                </span>
                <div className="ccm_dashboard__tags">
                  {aiFoundation.map((item) => (
                    <div className="ccm_dashboard__tag" key={item}>
                      <strong>{item}</strong>
                      <span>Foundation</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {documents.length > 0 && (
          <SolutionDocuments
            documents={documents}
            variant="compact"
            onActionClick={(event) => event.stopPropagation()}
          />
        )}
      </div>

      <div className="ccm_dashboard__capability-footer">
        <SolutionEngagementBar
          solutionId={capability.id}
          className="ccm_dashboard__capability-engagement"
          compact
        />

        <div className="ccm_dashboard__capability-actions">
          <button
            type="button"
            className="ccm_dashboard__action-btn"
            onClick={(event) => {
              event.stopPropagation();
              onRequestDemo?.(capability);
            }}
          >
            Request Demo
          </button>
          {hasRecordedDemo ? (
            <a
              href={capability.recordedDemoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ccm_dashboard__action-btn"
              onClick={(event) => event.stopPropagation()}
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
              onClick={(event) => event.stopPropagation()}
            >
              Sales Pitch
              <DocumentIcon />
            </a>
          ) : (
            <button
              type="button"
              className="ccm_dashboard__action-btn"
              onClick={(event) => event.stopPropagation()}
            >
              Sales Pitch
              <DocumentIcon />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default SolutionCapabilityCard;
