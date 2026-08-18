import { useEffect, useMemo, useState } from "react";
import {
  USER_DEPARTMENTS,
  USER_ROLES,
  USER_STATUSES,
} from "../../services/userService";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  employeeId: "",
  department: USER_DEPARTMENTS[0],
  designation: "",
  role: USER_ROLES[USER_ROLES.length - 1],
  status: "Active",
  password: "",
  confirmPassword: "",
};

const buildDraftFromUser = (user) => ({
  fullName: user.fullName || "",
  email: user.email || "",
  phone: user.phone || "",
  employeeId: user.employeeId || "",
  department: user.department || USER_DEPARTMENTS[0],
  designation: user.designation || "",
  role: user.role || USER_ROLES[USER_ROLES.length - 1],
  status: user.status || "Active",
  password: "",
  confirmPassword: "",
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M2.5 12C4.5 7.5 8 5 12 5s7.5 2.5 9.5 7c-2 4.5-5.5 7-9.5 7s-7.5-2.5-9.5-7Z"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M3 3l18 18M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.42-4.42M9.88 5.09A9.77 9.77 0 0 1 12 5c4 0 7.5 2.5 9.5 7a10.12 10.12 0 0 1-2.12 3.17M6.11 6.11C3.6 7.86 1.84 10.2 1 12c2 4.5 5.5 7 11 7 1.61 0 3.11-.32 4.47-.9"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

const PasswordField = ({
  label,
  value,
  onChange,
  placeholder,
  autoComplete = "new-password",
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <label className="admin_blog_form__field">
      <span>{label}</span>
      <div className="admin_password_field">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="admin_password_field__toggle"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </label>
  );
};

// Single modal used for both "Add User" and "Edit User". In edit mode only the
// business-editable fields (name, department, designation, role, status) are
// shown, matching the requirement.
const UserModal = ({ mode = "add", user, saving = false, onClose, onSave }) => {
  const isEdit = mode === "edit";
  const [draft, setDraft] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && user) {
      setDraft(buildDraftFromUser(user));
    } else {
      setDraft(EMPTY_FORM);
    }
    setError("");
  }, [isEdit, user]);

  const title = useMemo(() => {
    if (isEdit) return user?.fullName || "Edit user";
    return "Create a new user";
  }, [isEdit, user]);

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!draft.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (isEdit) {
      onSave?.({
        fullName: draft.fullName.trim(),
        department: draft.department,
        designation: draft.designation.trim(),
        role: draft.role,
        status: draft.status,
      });
      return;
    }

    if (!EMAIL_PATTERN.test(draft.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!draft.password) {
      setError("Password is required.");
      return;
    }

    if (draft.password !== draft.confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    onSave?.({
      fullName: draft.fullName.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      employeeId: draft.employeeId.trim(),
      department: draft.department,
      designation: draft.designation.trim(),
      role: draft.role,
      status: draft.status,
    });
  };

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-user-form-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--certification-form"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">
              {isEdit ? "Edit User" : "Add User"}
            </p>
            <h3 id="admin-user-form-title">{title}</h3>
          </div>
          <button
            type="button"
            className="admin_demo_modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </header>

        <div className="admin_demo_modal__body">
          {error && <p className="admin_request_demos__error">{error}</p>}

          <div className="admin_blog_form__grid">
            <label className="admin_blog_form__field admin_blog_form__field--full">
              <span>Full Name *</span>
              <input
                type="text"
                value={draft.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
                placeholder="e.g. Aarav Sharma"
              />
            </label>

            {!isEdit && (
              <>
                <label className="admin_blog_form__field">
                  <span>Email *</span>
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(event) =>
                      handleChange("email", event.target.value)
                    }
                    placeholder="e.g. name@espire.com"
                  />
                </label>

                <label className="admin_blog_form__field">
                  <span>Phone Number</span>
                  <input
                    type="tel"
                    value={draft.phone}
                    onChange={(event) =>
                      handleChange("phone", event.target.value)
                    }
                    placeholder="e.g. +91 98100 11223"
                  />
                </label>

                <label className="admin_blog_form__field">
                  <span>Employee ID</span>
                  <input
                    type="text"
                    value={draft.employeeId}
                    onChange={(event) =>
                      handleChange("employeeId", event.target.value)
                    }
                    placeholder="e.g. ESP-1001"
                  />
                </label>
              </>
            )}

            <label className="admin_blog_form__field">
              <span>Department</span>
              <select
                value={draft.department}
                onChange={(event) =>
                  handleChange("department", event.target.value)
                }
              >
                {USER_DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin_blog_form__field">
              <span>Designation</span>
              <input
                type="text"
                value={draft.designation}
                onChange={(event) =>
                  handleChange("designation", event.target.value)
                }
                placeholder="e.g. Product Manager"
              />
            </label>

            <label className="admin_blog_form__field">
              <span>Role</span>
              <select
                value={draft.role}
                onChange={(event) => handleChange("role", event.target.value)}
              >
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin_blog_form__field">
              <span>Status</span>
              <select
                value={draft.status}
                onChange={(event) => handleChange("status", event.target.value)}
              >
                {USER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            {!isEdit && (
              <>
                <PasswordField
                  label="Password *"
                  value={draft.password}
                  onChange={(event) =>
                    handleChange("password", event.target.value)
                  }
                  placeholder="Enter a password"
                />

                <PasswordField
                  label="Confirm Password *"
                  value={draft.confirmPassword}
                  onChange={(event) =>
                    handleChange("confirmPassword", event.target.value)
                  }
                  placeholder="Re-enter the password"
                />
              </>
            )}
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
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving
              ? "Saving…"
              : isEdit
                ? "Save Changes"
                : "Create User"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default UserModal;
