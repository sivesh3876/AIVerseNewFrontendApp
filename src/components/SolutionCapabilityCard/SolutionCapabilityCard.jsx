import { EditIcon, TrashIcon } from "../icons/FeatherIcons";
import SolutionDocuments from "../SolutionDocuments";
import {
  TechStackLabelIcon,
  CoeLabelIcon,
  EvangelistLabelIcon,
  VideoCameraIcon,
} from "../CustomerCommunicationManagement/CapabilityIcons";
import { resolveCapabilityIcon } from "../../utils/solutionMapper";
import { buildDocumentsFromCapability } from "../../utils/solutionDocuments";

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
  const isSubmitted = Boolean(capability.isApiSolution);
  const documents = buildDocumentsFromCapability(capability);

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

      <div className="ccm_dashboard__capability-body">
        <div className="ccm_dashboard__capability-head">
          <span className="ccm_dashboard__capability-icon" aria-hidden="true">
            <CardIcon />
          </span>
          <div className="ccm_dashboard__capability-heading">
            <h4>{capability.title}</h4>
            {capability.client && (
              <span className="ccm_dashboard__client-badge">
                Client: {capability.client}
              </span>
            )}
          </div>
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

        {documents.length > 0 && (
          <SolutionDocuments
            documents={documents}
            variant="compact"
            onActionClick={(event) => event.stopPropagation()}
          />
        )}
      </div>

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
      </div>
    </article>
  );
};

export default SolutionCapabilityCard;
