const getInitials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const formatDate = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const PriorityBadge = ({ priority }) => {
  const modifier = priority?.toLowerCase() || "medium";
  return (
    <span className={`admin_contact_priority admin_contact_priority--${modifier}`}>
      {priority}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const modifier = status === "Open" ? "open" : status === "Closed" ? "closed" : "progress";
  return (
    <span className={`admin_contact_status admin_contact_status--${modifier}`}>
      {status}
    </span>
  );
};

const ContactRequestCard = ({ request, onClick }) => (
  <button
    type="button"
    className="admin_contact_card"
    onClick={() => onClick?.(request)}
  >
    <div className="admin_contact_card__top">
      <span
        className="admin_user_avatar"
        style={{ background: request.avatarColor || "#3A8D9D" }}
        aria-hidden="true"
      >
        {getInitials(request.name)}
      </span>
      <div className="admin_contact_card__identity">
        <strong>{request.name}</strong>
        <span>{request.company}</span>
      </div>
    </div>

    <div className="admin_contact_card__meta">
      <span>{request.email}</span>
      <span>{request.phone}</span>
    </div>

    <div className="admin_contact_card__badges">
      <StatusBadge status={request.status} />
      <PriorityBadge priority={request.priority} />
    </div>

    <div className="admin_contact_card__footer">
      <span className="admin_contact_card__assignee">
        {request.assignedTo === "Unassigned" ? "Unassigned" : request.assignedTo}
      </span>
      <span className="admin_contact_card__date">{formatDate(request.submittedAt)}</span>
    </div>
  </button>
);

export default ContactRequestCard;
