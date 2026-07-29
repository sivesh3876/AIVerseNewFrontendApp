import AdminBlogActionDropdown from "../Admin/AdminBlogActionDropdown";

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

const stageClass = (stage = "") =>
  String(stage)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

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

const COLUMN_COUNT = 10;

const ContactRequestTable = ({ requests, onRowAction }) => (
  <div className="admin_demo_table__wrap">
    <table className="admin_demo_table admin_contact_table">
      <thead>
        <tr>
          <th>Actions</th>
          <th>User</th>
          <th>Company</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Industry</th>
          <th>Type</th>
          <th>Assigned To</th>
          <th>Submitted</th>
          <th className="admin_demo_table__status-col">Stage</th>
        </tr>
      </thead>
      <tbody>
        {requests.length === 0 ? (
          <tr>
            <td colSpan={COLUMN_COUNT}>No leads found.</td>
          </tr>
        ) : (
          requests.map((request) => (
            <tr key={request.requestKey || request.id}>
              <td>
                <AdminBlogActionDropdown
                  onSelect={(action) => onRowAction?.(request, action)}
                />
              </td>
              <td>
                <div className="admin_role_user-cell">
                  <span
                    className="admin_user_avatar"
                    style={{ background: request.avatarColor || "#3A8D9D" }}
                    aria-hidden="true"
                  >
                    {getInitials(request.name)}
                  </span>
                  <div>
                    <button
                      type="button"
                      className="admin_user_table__name-btn"
                      onClick={() => onRowAction?.(request, "view")}
                    >
                      {request.name}
                    </button>
                  </div>
                </div>
              </td>
              <td>{request.company}</td>
              <td>
                <a className="admin_user_table__email" href={`mailto:${request.email}`}>
                  {request.email}
                </a>
              </td>
              <td>{request.phone}</td>
              <td>{request.industry}</td>
              <td>
                <span
                  className={`admin_contact_type admin_contact_type--${typeClass(
                    request.type,
                  )}`}
                >
                  {request.type || "Message"}
                </span>
              </td>
              <td>{request.assignedTo}</td>
              <td>{formatDate(request.submittedAt)}</td>
              <td className="admin_demo_table__status-cell">
                <span
                  className={`admin_contact_stage admin_contact_stage--${stageClass(
                    request.stage,
                  )}`}
                >
                  {request.stage || "—"}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default ContactRequestTable;
