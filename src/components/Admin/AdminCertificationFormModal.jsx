import { useEffect, useMemo, useRef, useState } from "react";
import {
  CERTIFICATION_FORM_STATUSES,
  CERTIFICATION_LEVELS,
  CERTIFICATION_PUBLISH_OPTIONS,
  getCertificationCategoryOptions,
} from "../../utils/adminCertificationStorage";
import AdminCertificationFileUpload from "./AdminCertificationFileUpload";
import AdminRichTextEditor from "./AdminRichTextEditor";

const ADD_NEW_OPTION = "__add_new__";

const EMPTY_FORM = {
  name: "",
  code: "",
  provider: "",
  category: "",
  customCategory: "",
  level: CERTIFICATION_LEVELS[0],
  description: "",
  attachmentFile: "",
  attachmentName: "",
  attachmentMimeType: "",
  externalUrl: "",
  duration: "",
  skillsCovered: "",
  validity: "",
  status: "Active",
  publish: "No",
};

const buildDraftFromCertification = (certification, categoryOptions) => {
  const defaultCategory = categoryOptions[0] || "";
  const recordCategory = certification.category || defaultCategory;
  const categoryInList = categoryOptions.includes(recordCategory);

  return {
    name: certification.name || "",
    code: certification.code || "",
    provider: certification.provider || "",
    category: categoryInList ? recordCategory : ADD_NEW_OPTION,
    customCategory: categoryInList ? "" : recordCategory,
    level: certification.level || CERTIFICATION_LEVELS[0],
    description: certification.description || "",
    attachmentFile: certification.attachmentFile || "",
    attachmentName: certification.attachmentName || "",
    attachmentMimeType: certification.attachmentMimeType || "",
    externalUrl: certification.externalUrl || "",
    duration: certification.duration || "",
    skillsCovered: certification.skillsCovered || "",
    validity: certification.validity || "",
    status: certification.status || "Active",
    publish:
      certification.publish ||
      (certification.publicationStatus === "Published" ? "Yes" : "No"),
  };
};

const AdminCertificationFormModal = ({
  certification,
  mode = "add",
  onClose,
  onSave,
}) => {
  const [draft, setDraft] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [isHydrated, setIsHydrated] = useState(mode === "add");
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const isEdit = mode === "edit";

  const categoryOptions = useMemo(
    () => getCertificationCategoryOptions(),
    [certification, mode],
  );

  useEffect(() => {
    const defaultCategory = categoryOptions[0] || "";

    if (mode === "add") {
      setDraft({
        ...EMPTY_FORM,
        category: defaultCategory,
      });
      setError("");
      setIsHydrated(true);
      return;
    }

    if (!certification) {
      setIsHydrated(false);
      return;
    }

    setDraft(buildDraftFromCertification(certification, categoryOptions));
    setError("");
    setIsHydrated(true);
  }, [certification, mode, categoryOptions]);

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleAttachmentChange = ({
    dataUrl = "",
    fileName = "",
    mimeType = "",
  }) => {
    setDraft((prev) => ({
      ...prev,
      attachmentFile: dataUrl,
      attachmentName: fileName,
      attachmentMimeType: mimeType,
    }));
  };

  const buildPayload = (saveAction) => {
    const category =
      draft.category === ADD_NEW_OPTION
        ? draft.customCategory.trim()
        : draft.category;

    const publish =
      saveAction === "publish"
        ? "Yes"
        : saveAction === "draft"
          ? "No"
          : draft.publish;

    return {
      name: draft.name.trim(),
      code: draft.code.trim(),
      provider: draft.provider.trim(),
      category,
      customCategory:
        draft.category === ADD_NEW_OPTION ? draft.customCategory.trim() : "",
      level: draft.level,
      description: draft.description,
      attachmentFile: draft.attachmentFile,
      attachmentName: draft.attachmentName,
      attachmentMimeType: draft.attachmentMimeType,
      thumbnailImage: certification?.thumbnailImage || "",
      bannerImage: certification?.bannerImage || "",
      prerequisites: certification?.prerequisites || "",
      externalUrl: draft.externalUrl.trim(),
      duration: draft.duration.trim(),
      skillsCovered: draft.skillsCovered.trim(),
      validity: draft.validity.trim(),
      status: draft.status,
      publish,
      publicationStatus: publish === "Yes" ? "Published" : "Draft",
      createdDate: certification?.createdDate,
      totalCertified: certification?.totalCertified,
      saveAction,
    };
  };

  const validateForm = () => {
    if (!draft.name.trim()) {
      setError("Certification name is required.");
      return false;
    }

    if (draft.category === ADD_NEW_OPTION && !draft.customCategory.trim()) {
      setError("Please enter a new category name.");
      return false;
    }

    return true;
  };

  const handleSave = async (saveAction) => {
    setError("");

    if (!validateForm() || savingRef.current) {
      return;
    }

    savingRef.current = true;
    setSaving(true);

    try {
      await onSave?.(buildPayload(saveAction));
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-certification-form-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--certification-form"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">
              {isEdit ? "Edit Certification" : "Add Certification"}
            </p>
            <h3 id="admin-certification-form-title">
              {isEdit
                ? certification?.name || "Edit certification"
                : "Create a new certification"}
            </h3>
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

          {!isHydrated ? (
            <p className="admin_demo_modal__loading">Loading certification…</p>
          ) : (
            <div className="admin_blog_form__grid">
              <label className="admin_blog_form__field admin_blog_form__field--full">
                <span>Certification Name *</span>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  placeholder="e.g. AI-901: Azure AI Fundamentals"
                />
              </label>

              <label className="admin_blog_form__field">
                <span>Certification Code</span>
                <input
                  type="text"
                  value={draft.code}
                  onChange={(event) => handleChange("code", event.target.value)}
                  placeholder="e.g. AI-901"
                />
              </label>

              <label className="admin_blog_form__field">
                <span>Provider</span>
                <input
                  type="text"
                  value={draft.provider}
                  onChange={(event) =>
                    handleChange("provider", event.target.value)
                  }
                  placeholder="e.g. Microsoft"
                />
              </label>

              <div className="admin_blog_form__field">
                <span>Category</span>
                <select
                  value={draft.category}
                  onChange={(event) =>
                    handleChange("category", event.target.value)
                  }
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value={ADD_NEW_OPTION}>+ Add new category</option>
                </select>
                {draft.category === ADD_NEW_OPTION && (
                  <input
                    type="text"
                    className="admin_blog_form__inline-input"
                    value={draft.customCategory}
                    onChange={(event) =>
                      handleChange("customCategory", event.target.value)
                    }
                    placeholder="Enter new category"
                  />
                )}
              </div>

              <label className="admin_blog_form__field">
                <span>Level</span>
                <select
                  value={draft.level}
                  onChange={(event) => handleChange("level", event.target.value)}
                >
                  {CERTIFICATION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>

              <label className="admin_blog_form__field">
                <span>Duration</span>
                <input
                  type="text"
                  value={draft.duration}
                  onChange={(event) =>
                    handleChange("duration", event.target.value)
                  }
                  placeholder="e.g. 6 weeks"
                />
              </label>

              <label className="admin_blog_form__field">
                <span>Validity</span>
                <input
                  type="text"
                  value={draft.validity}
                  onChange={(event) =>
                    handleChange("validity", event.target.value)
                  }
                  placeholder="e.g. 1 year"
                />
              </label>

              <label className="admin_blog_form__field admin_blog_form__field--full">
                <span>External Certification URL</span>
                <input
                  type="url"
                  value={draft.externalUrl}
                  onChange={(event) =>
                    handleChange("externalUrl", event.target.value)
                  }
                  placeholder="https://example.com/certification"
                />
              </label>

              <label className="admin_blog_form__field admin_blog_form__field--full">
                <span>Skills Covered</span>
                <textarea
                  value={draft.skillsCovered}
                  onChange={(event) =>
                    handleChange("skillsCovered", event.target.value)
                  }
                  placeholder="List the key skills covered by this certification"
                  rows={3}
                />
              </label>

              <div className="admin_blog_form__field admin_blog_form__field--full">
                <span>Description</span>
                <AdminRichTextEditor
                  key={certification?.id || "new-certification"}
                  value={draft.description}
                  onChange={(value) => handleChange("description", value)}
                  placeholder="Enter certification description"
                  ariaLabel="Certification description"
                />
              </div>

              <div className="admin_blog_form__field admin_blog_form__field--full">
                <AdminCertificationFileUpload
                  key={`${certification?.id || "new"}-attachment`}
                  id="certification-attachment"
                  label="File Upload"
                  value={draft.attachmentFile}
                  fileName={draft.attachmentName}
                  onChange={handleAttachmentChange}
                  helpText="PDF, Word, JPG, or PNG up to 10 MB."
                />
              </div>

              <label className="admin_blog_form__field">
                <span>Status</span>
                <select
                  value={draft.status}
                  onChange={(event) => handleChange("status", event.target.value)}
                >
                  {CERTIFICATION_FORM_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="admin_blog_form__field">
                <span>Publish</span>
                <select
                  value={draft.publish}
                  onChange={(event) =>
                    handleChange("publish", event.target.value)
                  }
                >
                  {CERTIFICATION_PUBLISH_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>

        <footer className="admin_demo_modal__footer admin_demo_modal__footer--split">
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <div className="admin_demo_modal__footer-actions">
            <button
              type="button"
              className="admin_request_demos__btn"
              onClick={() => handleSave("draft")}
              disabled={!isHydrated || saving}
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>
            <button
              type="button"
              className="admin_request_demos__btn admin_request_demos__btn--primary"
              onClick={() => handleSave("publish")}
              disabled={!isHydrated || saving}
            >
              {saving ? "Publishing…" : "Publish"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminCertificationFormModal;
