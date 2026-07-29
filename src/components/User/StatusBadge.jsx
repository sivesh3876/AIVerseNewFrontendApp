const STATUS_MODIFIERS = {
  Active: "active",
  Inactive: "inactive",
  Pending: "pending",
};

const StatusBadge = ({ status }) => {
  const modifier = STATUS_MODIFIERS[status] || "inactive";

  return (
    <span
      className={`admin_user_status_badge admin_user_status_badge--${modifier}`}
    >
      <span className="admin_user_status_badge__dot" aria-hidden="true" />
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;
