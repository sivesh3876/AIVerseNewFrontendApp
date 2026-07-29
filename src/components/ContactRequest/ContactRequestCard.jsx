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

const typeClass = (type = "") => {
  const value = String(type).toLowerCase();
  if (value.includes("register")) return "register";
  if (
    value.includes("callback") ||
    value.includes("call back") ||
    value === "schedule"
  ) {
    return "schedule";
  }
  if (value.includes("request demo") || value.includes("demo")) return "demo";
  if (value.includes("mail")) return "mail";
  return "message";
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
        {request.solutionTitle ? (
          <span className="admin_contact_card__solution">{request.solutionTitle}</span>
        ) : null}
      </div>
    </div>

    <div className="admin_contact_card__meta">
      <span>{request.email}</span>
      <span>{request.phone}</span>
    </div>

    <div className="admin_contact_card__badges">
      <span
        className={`admin_contact_type admin_contact_type--${typeClass(
          request.type,
        )}`}
      >
        Type: {request.type || "Message"}
      </span>
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
