import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserCard, { UserInfoField } from "../../components/User/UserCard";
import StatusBadge from "../../components/User/StatusBadge";
import {
  fetchUserActivityLog,
  fetchUserById,
  fetchUserLoginHistory,
  getPermissionsForRole,
} from "../../services/userService";
import {
  formatUserDate,
  formatUserDateTime,
  getUserInitials,
} from "../../utils/userTableUtils";
import "../../components/Admin/AdminLayout.scss";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loginHistory, setLoginHistory] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      const [record, history, activity] = await Promise.all([
        fetchUserById(userId),
        fetchUserLoginHistory(userId),
        fetchUserActivityLog(userId),
      ]);

      if (!active) return;

      if (!record) {
        setNotFound(true);
      } else {
        setUser(record);
        setLoginHistory(history);
        setActivityLog(activity);
      }
      setLoading(false);
    };

    load();
    return () => {
      active = false;
    };
  }, [userId]);

  const permissions = useMemo(
    () => (user ? getPermissionsForRole(user.role) : []),
    [user],
  );

  if (loading) {
    return (
      <section className="admin_request_demos">
        <p className="admin_request_demos__error" style={{ color: "#64748b" }}>
          Loading user details…
        </p>
      </section>
    );
  }

  if (notFound || !user) {
    return (
      <section className="admin_request_demos">
        <header className="admin_request_demos__header">
          <button
            type="button"
            className="admin_solution_new_ai__back"
            onClick={() => navigate("/admin/user-management")}
          >
            ← Back to users
          </button>
          <h1>User not found</h1>
          <p className="admin_request_demos__subtitle">
            The user you are looking for does not exist or has been removed.
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
          onClick={() => navigate("/admin/user-management")}
        >
          ← Back to users
        </button>

        <div className="admin_user_details__hero">
          <span
            className="admin_user_avatar admin_user_avatar--lg"
            style={{ background: user.avatarColor || "#3A8D9D" }}
            aria-hidden="true"
          >
            {getUserInitials(user.fullName)}
          </span>
          <div className="admin_user_details__hero-copy">
            <h1>{user.fullName}</h1>
            <p className="admin_request_demos__subtitle">
              {user.designation ? `${user.designation} · ` : ""}
              {user.department}
            </p>
            <div className="admin_user_details__hero-meta">
              <StatusBadge status={user.status} />
              <span className="admin_user_table__role">{user.role}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="admin_user_details__grid">
        <UserCard title="Basic Information">
          <div className="admin_user_card__fields">
            <UserInfoField label="Full Name">{user.fullName}</UserInfoField>
            <UserInfoField label="Email">
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </UserInfoField>
            <UserInfoField label="Phone Number">{user.phone}</UserInfoField>
            <UserInfoField label="Employee ID">{user.employeeId}</UserInfoField>
            <UserInfoField label="Department">{user.department}</UserInfoField>
            <UserInfoField label="Designation">{user.designation}</UserInfoField>
            <UserInfoField label="Status">
              <StatusBadge status={user.status} />
            </UserInfoField>
            <UserInfoField label="Created Date">
              {formatUserDate(user.createdDate)}
            </UserInfoField>
          </div>
        </UserCard>

        <UserCard title="Assigned Role" subtitle="The role controls what this user can access.">
          <div className="admin_user_card__fields">
            <UserInfoField label="Role">
              <span className="admin_user_table__role">{user.role}</span>
            </UserInfoField>
            <UserInfoField label="Last Login">
              {formatUserDateTime(user.lastLogin)}
            </UserInfoField>
          </div>
        </UserCard>

        <UserCard
          title="Permissions"
          subtitle="Derived from the assigned role. Editable once Permission Management is enabled."
        >
          <div className="admin_user_permissions__list">
            {permissions.length === 0 ? (
              <p className="admin_user_permissions__empty">
                No permissions mapped to this role yet.
              </p>
            ) : (
              permissions.map((permission) => (
                <span key={permission} className="admin_user_permissions__chip">
                  {permission}
                </span>
              ))
            )}
          </div>
        </UserCard>

        <UserCard title="Login History">
          {loginHistory.length === 0 ? (
            <p className="admin_user_permissions__empty">
              No login history available.
            </p>
          ) : (
            <ul className="admin_user_timeline">
              {loginHistory.map((entry) => (
                <li key={entry.id} className="admin_user_timeline__item">
                  <span className="admin_user_timeline__dot" aria-hidden="true" />
                  <div>
                    <strong>{entry.device}</strong>
                    <p>
                      IP {entry.ip} ·{" "}
                      <span
                        className={`admin_user_timeline__result admin_user_timeline__result--${entry.result === "Success" ? "success" : "failed"}`}
                      >
                        {entry.result}
                      </span>
                    </p>
                    <span>{formatUserDateTime(entry.at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </UserCard>

        <UserCard title="Activity Log">
          {activityLog.length === 0 ? (
            <p className="admin_user_permissions__empty">
              No recent activity recorded.
            </p>
          ) : (
            <ul className="admin_user_timeline">
              {activityLog.map((entry) => (
                <li key={entry.id} className="admin_user_timeline__item">
                  <span className="admin_user_timeline__dot" aria-hidden="true" />
                  <div>
                    <p>{entry.action}</p>
                    <span>{formatUserDateTime(entry.at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </UserCard>
      </div>
    </section>
  );
};

export default UserDetails;
