import ActionDropdown from "./ActionDropdown";
import StatusBadge from "./StatusBadge";
import {
  formatUserDate,
  formatUserDateTime,
  getUserInitials,
} from "../../utils/userTableUtils";

const COLUMN_COUNT = 10;

const UserAvatar = ({ user }) => (
  <span
    className="admin_user_avatar"
    style={{ background: user.avatarColor || "#3A8D9D" }}
    aria-hidden="true"
  >
    {getUserInitials(user.fullName)}
  </span>
);

const UserRow = ({ user, onAction }) => (
  <tr>
    <td>
      <ActionDropdown
        status={user.status}
        onSelect={(action) => onAction(user, action)}
      />
    </td>
    <td>{formatUserDate(user.createdDate)}</td>
    <td>
      <UserAvatar user={user} />
    </td>
    <td>
      <button
        type="button"
        className="admin_user_table__name-btn"
        onClick={() => onAction(user, "view")}
      >
        {user.fullName || "—"}
      </button>
    </td>
    <td>
      <a className="admin_user_table__email" href={`mailto:${user.email}`}>
        {user.email || "—"}
      </a>
    </td>
    <td>{user.department || "—"}</td>
    <td>{user.designation || "—"}</td>
    <td>
      <span className="admin_user_table__role">{user.role || "—"}</span>
    </td>
    <td>
      <StatusBadge status={user.status} />
    </td>
    <td>{formatUserDateTime(user.lastLogin)}</td>
  </tr>
);

const UserTable = ({
  users = [],
  loading = false,
  totalCount = 0,
  onAction,
}) => (
  <div className="admin_demo_table__wrap">
    <table className="admin_demo_table admin_user_table">
      <thead>
        <tr>
          <th>Actions</th>
          <th>Date</th>
          <th>Profile</th>
          <th>Full Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Designation</th>
          <th>Assigned Role</th>
          <th className="admin_demo_table__status-col">Status</th>
          <th>Last Login</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={COLUMN_COUNT}>Loading users…</td>
          </tr>
        ) : totalCount === 0 ? (
          <tr>
            <td colSpan={COLUMN_COUNT}>No user records found.</td>
          </tr>
        ) : users.length === 0 ? (
          <tr>
            <td colSpan={COLUMN_COUNT}>
              No records match your search or filters.
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <UserRow key={user.id} user={user} onAction={onAction} />
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default UserTable;
