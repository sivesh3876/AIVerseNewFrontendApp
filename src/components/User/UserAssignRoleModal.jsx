import { useEffect, useState } from "react";
import { getPermissionLabel } from "../../services/roleService";

const UserAssignRoleModal = ({
  user,
  roles = [],
  saving = false,
  onClose,
  onConfirm,
}) => {
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user) {
      setRole(user.role || roles[0]?.name || "");
    }
  }, [user, roles]);

  if (!user) return null;

  const selectedRole = roles.find((option) => option.name === role);
  const permissions = selectedRole?.permissions || [];

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-user-role-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--detail"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">Assign Role</p>
            <h3 id="admin-user-role-title">{user.fullName || "User"}</h3>
            <p>Choose the role this user should be assigned.</p>
          </div>
          <button
            type="button"
            className="admin_demo_modal__close"
            onClick={onClose}
            aria-label="Close"
            disabled={saving}
          >
            &times;
          </button>
        </header>

        <div className="admin_demo_modal__body">
          <label className="admin_blog_form__field admin_blog_form__field--full">
            <span>Role</span>
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              {roles.map((option) => (
                <option key={option.id ?? option.name} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <div className="admin_user_permissions">
            <span className="admin_user_permissions__label">
              Permissions granted
            </span>
            <div className="admin_user_permissions__list">
              {permissions.length === 0 ? (
                <p className="admin_user_permissions__empty">
                  No permissions mapped to this role yet.
                </p>
              ) : (
                permissions.map((permission) => (
                  <span key={permission} className="admin_user_permissions__chip">
                    {getPermissionLabel(permission)}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <footer className="admin_demo_modal__footer">
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--primary"
            onClick={() => onConfirm?.(selectedRole)}
            disabled={saving || !selectedRole}
          >
            {saving ? "Saving…" : "Assign Role"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default UserAssignRoleModal;
