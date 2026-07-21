import { formatDemoRequestDate } from "../../services/demoRequestService";

const formatCell = (value) => value || "—";

const getStatusClass = (status = "") => {
  const normalized = String(status).trim().toLowerCase();
  if (normalized === "active" || normalized === "published") return "active";
  if (normalized === "inactive" || normalized === "draft") return "inactive";
  if (normalized === "completed" || normalized === "done") return "completed";
  return "default";
};

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 3v4M16 3v4M3 10h18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 19c1.8-3.2 4.2-4.8 7-4.8s5.2 1.6 7 4.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 20V6l8-3 8 3v14H4Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 20v-6h6v6" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M7 3h3l1.5 4.5-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2L21 14v3a2 2 0 0 1-2.2 2A16 16 0 0 1 5 7.2 2 2 0 0 1 7 3Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="m8.5 12.2 2.4 2.4 4.6-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const MessageIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 5h16v11H8l-4 4V5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const FieldCard = ({ icon, label, children, tone = "blue" }) => (
  <div className={`admin_solution_demo_modal__field admin_solution_demo_modal__field--${tone}`}>
    <span className="admin_solution_demo_modal__field-icon">{icon}</span>
    <div>
      <span className="admin_solution_demo_modal__field-label">{label}</span>
      <div className="admin_solution_demo_modal__field-value">{children}</div>
    </div>
  </div>
);

const AdminSolutionDemoRequestsModal = ({
  solution,
  demoRequests = [],
  onClose,
}) => {
  if (!solution) return null;

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-solution-demo-title"
      onClick={onClose}
    >
      <div
        className="admin_solution_demo_modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_solution_demo_modal__header">
          <div className="admin_solution_demo_modal__header-copy">
            <p className="admin_solution_demo_modal__eyebrow">
              Requested Demo Details
            </p>
            <h3 id="admin-solution-demo-title">
              {solution.Title || "Untitled Solution"}
            </h3>
            <p className="admin_solution_demo_modal__subtitle">
              {demoRequests.length} demo request
              {demoRequests.length === 1 ? "" : "s"} for this solution
            </p>
          </div>
          <button
            type="button"
            className="admin_solution_demo_modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </header>

        <div className="admin_solution_demo_modal__body">
          {demoRequests.length === 0 ? (
            <div className="admin_solution_demo_modal__empty">
              <strong>No demo requests yet</strong>
              <p>
                When users request a demo for this card, details will appear
                here.
              </p>
            </div>
          ) : (
            <div className="admin_solution_demo_modal__list">
              {demoRequests.map((request, index) => {
                const statusValue =
                  request.recordStatus || request.status || "—";
                const statusClass = getStatusClass(statusValue);

                return (
                  <article
                    key={request.id}
                    className="admin_solution_demo_modal__card"
                  >
                    <div className="admin_solution_demo_modal__card-top">
                      <span className="admin_solution_demo_modal__index">
                        Request #{index + 1}
                      </span>
                      <span
                        className={`admin_solution_demo_modal__status admin_solution_demo_modal__status--${statusClass}`}
                      >
                        <span className="admin_solution_demo_modal__status-dot" />
                        {statusValue}
                      </span>
                    </div>

                    <div className="admin_solution_demo_modal__grid">
                      <FieldCard icon={<CalendarIcon />} label="Request Date" tone="blue">
                        {formatDemoRequestDate(request.submittedAt)}
                      </FieldCard>
                      <FieldCard icon={<UserIcon />} label="Requester" tone="blue">
                        {formatCell(request.fullName)}
                      </FieldCard>
                      <FieldCard icon={<MailIcon />} label="Email" tone="sky">
                        {request.email ? (
                          <a href={`mailto:${request.email}`}>{request.email}</a>
                        ) : (
                          "—"
                        )}
                      </FieldCard>
                      <FieldCard icon={<BuildingIcon />} label="Company" tone="violet">
                        {formatCell(request.company)}
                      </FieldCard>
                      <FieldCard icon={<PhoneIcon />} label="Phone" tone="blue">
                        {formatCell(request.phone)}
                      </FieldCard>
                      <FieldCard icon={<BriefcaseIcon />} label="COE (Owner)" tone="violet">
                        {formatCell(request.coeName)}
                      </FieldCard>
                      <FieldCard icon={<CheckIcon />} label="Demo Given By" tone="teal">
                        {formatCell(request.demoGivenBy)}
                      </FieldCard>
                      <FieldCard icon={<ClockIcon />} label="Demo Given At" tone="teal">
                        {request.demoGivenAt
                          ? formatDemoRequestDate(request.demoGivenAt)
                          : "—"}
                      </FieldCard>
                    </div>

                    <div className="admin_solution_demo_modal__message">
                      <div className="admin_solution_demo_modal__message-head">
                        <span className="admin_solution_demo_modal__message-icon">
                          <MessageIcon />
                        </span>
                        <span>Message</span>
                      </div>
                      <p>{formatCell(request.message)}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <footer className="admin_solution_demo_modal__footer">
          <button
            type="button"
            className="admin_solution_demo_modal__btn admin_solution_demo_modal__btn--primary"
            onClick={onClose}
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminSolutionDemoRequestsModal;
