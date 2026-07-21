import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserCard, { UserInfoField } from "../../components/User/UserCard";
import RoleStatusBadge from "../../components/Role/StatusBadge";
import UserStatusBadge from "../../components/User/StatusBadge";
import PermissionSection from "../../components/Role/PermissionSection";
import {
  fetchRoleActivityHistory,
  fetchRoleById,
} from "../../services/roleService";
import { fetchUsers } from "../../services/userService";
import {
  formatRoleDate,
  formatRoleDateTime,
  getPermissionLevelLabel,
} from "../../utils/roleTableUtils";
import { formatUserDateTime, getUserInitials } from "../../utils/userTableUtils";
import "../../components/Admin/AdminLayout.scss";

const RoleDetails = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      const [record, activity, allUsers] = await Promise.all([
        fetchRoleById(roleId),
        fetchRoleActivityHistory(roleId),
        fetchUsers(),
      ]);

      if (!active) return;

      if (!record) {
        setNotFound(true);
      } else {
        setRole(record);
        setHistory(activity);
        setAssignedUsers(
          allUsers.filter((user) => user.role === record.name),
        );
      }
      setLoading(false);
    };

    load();
    return () => {
      active = false;
    };
  }, [roleId]);

  const recentUpdates = useMemo(() => history.slice(0, 3), [history]);

  if (loading) {
    return (
      <section className="admin_request_demos">
        <p className="admin_request_demos__error" style={{ color: "#64748b" }}>
          Loading role details…
        </p>
      </section>
    );
  }

  if (notFound || !role) {
    return (
      <section className="admin_request_demos">
        <header className="admin_request_demos__header">
          <button
            type="button"
            className="admin_solution_new_ai__back"
            onClick={() => navigate("/admin/role-management")}
          >
            ← Back to roles
          </button>
          <h1>Role not found</h1>
          <p className="admin_request_demos__subtitle">
            The role you are looking for does not exist or has been removed.
          </p>
        </header>
      </section>
    );
  }

  return (
    <section className="admin_request_demos admin_user_details">
      <header className="admin_request_demos__header">
        <button
          type="button"
          className="admin_solution_new_ai__back"
          onClick={() => navigate("/admin/role-management")}
        >
          ← Back to roles
        </button>

        <div className="admin_user_details__hero">
          <span
            className="admin_user_avatar admin_user_avatar--lg"
            style={{ background: "#3A8D9D" }}
            aria-hidden="true"
          >
            {getUserInitials(role.name)}
          </span>
          <div className="admin_user_details__hero-copy">
            <h1>{role.name}</h1>
            <p className="admin_request_demos__subtitle">{role.description}</p>
            <div className="admin_user_details__hero-meta">
              <RoleStatusBadge status={role.status} />
              <span className="admin_user_table__role">
                {getPermissionLevelLabel(role)} access
              </span>
              <span className="admin_role_table__users">
                {role.assignedUsers ?? assignedUsers.length} users
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="admin_user_details__grid">
        <UserCard title="Basic Information">
          <div className="admin_user_card__fields">
            <UserInfoField label="Role Name">{role.name}</UserInfoField>
            <UserInfoField label="Status">
              <RoleStatusBadge status={role.status} />
            </UserInfoField>
            <UserInfoField label="Assigned Users">
              {role.assignedUsers ?? assignedUsers.length}
            </UserInfoField>
            <UserInfoField label="Permission Level">
              {getPermissionLevelLabel(role)}
            </UserInfoField>
            <UserInfoField label="Created Date">
              {formatRoleDate(role.createdDate)}
            </UserInfoField>
            <UserInfoField label="Last Updated">
              {formatRoleDate(role.lastUpdated)}
            </UserInfoField>
          </div>
          <div className="admin_user_card__field" style={{ marginTop: 14 }}>
            <span className="admin_user_card__field-label">Description</span>
            <span className="admin_user_card__field-value">
              {role.description}
            </span>
          </div>
        </UserCard>

        <UserCard
          title="Recent Updates"
          subtitle="Latest changes applied to this role."
        >
          {recentUpdates.length === 0 ? (
            <p className="admin_user_permissions__empty">No recent updates.</p>
          ) : (
            <ul className="admin_user_timeline">
              {recentUpdates.map((entry) => (
                <li key={entry.id} className="admin_user_timeline__item">
                  <span className="admin_user_timeline__dot" aria-hidden="true" />
                  <div>
                    <strong>{entry.action}</strong>
                    <p>by {entry.by}</p>
                    <span>{formatRoleDateTime(entry.at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </UserCard>

        <div className="admin_user_details__full">
          <UserCard
            title="Permissions"
            subtitle={`${(role.permissions || []).length} permissions granted to this role.`}
          >
            <PermissionSection selected={role.permissions || []} readOnly />
          </UserCard>
        </div>

        <div className="admin_user_details__full">
          <UserCard
            title="Assigned Users"
            subtitle="Users currently assigned to this role."
          >
            <div className="admin_demo_table__wrap">
              <table className="admin_demo_table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Department</th>
                    <th className="admin_demo_table__status-col">Status</th>
                    <th>Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4}>No users are assigned to this role yet.</td>
                    </tr>
                  ) : (
                    assignedUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="admin_role_user-cell">
                            <span
                              className="admin_user_avatar"
                              style={{ background: user.avatarColor || "#3A8D9D" }}
                              aria-hidden="true"
                            >
                              {getUserInitials(user.fullName)}
                            </span>
                            <div>
                              <strong>{user.fullName}</strong>
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>{user.department || "—"}</td>
                        <td className="admin_demo_table__status-cell">
                          <UserStatusBadge status={user.status} />
                        </td>
                        <td>{formatUserDateTime(user.lastLogin)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </UserCard>
        </div>

        <div className="admin_user_details__full">
          <UserCard title="Activity History">
            {history.length === 0 ? (
              <p className="admin_user_permissions__empty">
                No activity recorded.
              </p>
            ) : (
              <ul className="admin_user_timeline">
                {history.map((entry) => (
                  <li key={entry.id} className="admin_user_timeline__item">
                    <span
                      className="admin_user_timeline__dot"
                      aria-hidden="true"
                    />
                    <div>
                      <strong>{entry.action}</strong>
                      <p>by {entry.by}</p>
                      <span>{formatRoleDateTime(entry.at)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </UserCard>
        </div>
      </div>
    </section>
  );
};

export default RoleDetails;
