import ActionDropdown from "./ActionDropdown";
import StatusBadge from "./StatusBadge";
import { formatRoleDate } from "../../utils/roleTableUtils";

const COLUMN_COUNT = 8;

const RoleRow = ({ role, onAction }) => (
  <tr>
    <td>
      <ActionDropdown
        status={role.status}
        onSelect={(action) => onAction(role, action)}
      />
    </td>
    <td>{formatRoleDate(role.createdDate)}</td>
    <td>
      <button
        type="button"
        className="admin_user_table__name-btn"
        onClick={() => onAction(role, "view")}
      >
        {role.name || "—"}
      </button>
    </td>
    <td className="admin_role_table__description">
      {role.description || "—"}
    </td>
    <td>
      <span className="admin_role_table__users">{role.assignedUsers ?? 0}</span>
    </td>
    <td>
      <span className="admin_role_table__perms">
        {(role.permissions || []).length} Permissions
      </span>
    </td>
    <td className="admin_demo_table__status-cell">
      <StatusBadge status={role.status} />
    </td>
    <td>{formatRoleDate(role.lastUpdated)}</td>
  </tr>
);

const RoleTable = ({ roles = [], loading = false, totalCount = 0, onAction }) => (
  <div className="admin_demo_table__wrap">
    <table className="admin_demo_table admin_role_table">
      <thead>
        <tr>
          <th>Actions</th>
          <th>Date</th>
          <th>Role Name</th>
          <th>Description</th>
          <th>Assigned Users</th>
          <th>Permissions</th>
          <th className="admin_demo_table__status-col">Status</th>
          <th>Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={COLUMN_COUNT}>Loading roles…</td>
          </tr>
        ) : totalCount === 0 ? (
          <tr>
            <td colSpan={COLUMN_COUNT}>No role records found.</td>
          </tr>
        ) : roles.length === 0 ? (
          <tr>
            <td colSpan={COLUMN_COUNT}>
              No records match your search or filters.
            </td>
          </tr>
        ) : (
          roles.map((role) => (
            <RoleRow key={role.id} role={role} onAction={onAction} />
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default RoleTable;
