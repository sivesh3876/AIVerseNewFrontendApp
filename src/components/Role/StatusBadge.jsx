const STATUS_MODIFIERS = {
  Active: "active",
  Inactive: "inactive",
  Draft: "draft",
};

// Role status badge. Active (green), Inactive (gray), Draft (orange). Uses the
// same pill shape/spacing as the rest of the admin panel badges.
const StatusBadge = ({ status }) => {
  const modifier = STATUS_MODIFIERS[status] || "inactive";

  return (
    <span
      className={`admin_role_status_badge admin_role_status_badge--${modifier}`}
    >
      <span className="admin_role_status_badge__dot" aria-hidden="true" />
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;
