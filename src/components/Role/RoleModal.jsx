import { useEffect, useMemo, useState } from "react";
import {
  PERMISSION_TEMPLATES,
  ROLE_STATUSES,
  getTemplatePermissions,
} from "../../services/roleService";
import PermissionSection from "./PermissionSection";

const EMPTY_FORM = {
  name: "",
  description: "",
  status: "Active",
  template: "none",
  permissions: [],
};

const buildDraftFromRole = (role) => ({
  name: role.name || "",
  description: role.description || "",
  status: role.status || "Active",
  template: "none",
  permissions: [...(role.permissions || [])],
});

// Single modal for both "Add Role" and "Edit Role". The permission template
// dropdown is only offered while creating (edit starts from the saved matrix).
const RoleModal = ({ mode = "add", role, saving = false, onClose, onSave }) => {
  const isEdit = mode === "edit";
  const [draft, setDraft] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && role) {
      setDraft(buildDraftFromRole(role));
    } else {
      setDraft(EMPTY_FORM);
    }
    setError("");
  }, [isEdit, role]);

  const title = useMemo(() => {
    if (isEdit) return role?.name || "Edit role";
    return "Create a new role";
  }, [isEdit, role]);

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleTemplateChange = (templateId) => {
    setDraft((prev) => ({
      ...prev,
      template: templateId,
      permissions:
        templateId === "none"
          ? prev.permissions
          : getTemplatePermissions(templateId),
    }));
  };

  const handlePermissionsChange = (permissions) => {
    setDraft((prev) => ({ ...prev, permissions }));
  };

  const handleSubmit = () => {
    if (!draft.name.trim()) {
      setError("Role name is required.");
      return;
    }
    if (!draft.description.trim()) {
      setError("Description is required.");
      return;
    }

    onSave?.({
      name: draft.name.trim(),
      description: draft.description.trim(),
      status: draft.status,
      permissions: draft.permissions,
    });
  };

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-role-form-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--certification-form"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">
              {isEdit ? "Edit Role" : "Add Role"}
            </p>
            <h3 id="admin-role-form-title">{title}</h3>
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
              <span>Role Name *</span>
              <input
                type="text"
                value={draft.name}
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder="e.g. Content Manager"
              />
            </label>

            <label className="admin_blog_form__field admin_blog_form__field--full">
              <span>Description *</span>
              <textarea
                value={draft.description}
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
                placeholder="Describe what this role can do"
                rows={2}
              />
            </label>

            <label className="admin_blog_form__field">
              <span>Status</span>
              <select
                value={draft.status}
                onChange={(event) => handleChange("status", event.target.value)}
              >
                {ROLE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            {!isEdit && (
              <label className="admin_blog_form__field">
                <span>Permission Template (optional)</span>
                <select
                  value={draft.template}
                  onChange={(event) => handleTemplateChange(event.target.value)}
                >
                  {PERMISSION_TEMPLATES.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="admin_blog_form__field admin_blog_form__field--full">
              <PermissionSection
                selected={draft.permissions}
                onChange={handlePermissionsChange}
              />
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
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Role"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default RoleModal;
