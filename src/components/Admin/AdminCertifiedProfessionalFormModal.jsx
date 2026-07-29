import { useEffect, useState } from "react";
import { CERTIFIED_PROFESSIONAL_STATUSES } from "../../utils/adminCertifiedProfessionalStorage";
import AdminCertificationFileUpload from "./AdminCertificationFileUpload";
import AdminCertificationImageUpload from "./AdminCertificationImageUpload";

const EMPTY_FORM = {
  employeeName: "",
  employeeId: "",
  designation: "",
  department: "",
  officeLocation: "",
  email: "",
  profilePhoto: "",
  certificationName: "",
  provider: "",
  completionDate: "",
  expiryDate: "",
  credentialId: "",
  examScore: "",
  percentage: "",
  certificatePdf: "",
  certificateFileName: "",
  certificateVerificationUrl: "",
  linkedInUrl: "",
  status: "Draft",
};

const getTodayLabel = () =>
  new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const toDateInputValue = (dateLabel = "") => {
  if (!dateLabel) return "";
  const parsed = new Date(dateLabel);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

const formatDateFromInput = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const buildDraftFromProfessional = (professional, certification) => ({
  employeeName: professional.employeeName || "",
  employeeId: professional.employeeId || "",
  designation: professional.designation || "",
  department: professional.department || "",
  officeLocation: professional.officeLocation || "",
  email: professional.email || "",
  profilePhoto: professional.profilePhoto || "",
  certificationName:
    professional.certificationName || certification?.name || "",
  provider: professional.provider || certification?.provider || "",
  completionDate: professional.completionDate || getTodayLabel(),
  expiryDate: professional.expiryDate || "",
  credentialId: professional.credentialId || "",
  examScore: professional.examScore || professional.score || "",
  percentage: professional.percentage || "",
  certificatePdf: professional.certificatePdf || "",
  certificateFileName: professional.certificateFileName || "",
  certificateVerificationUrl:
    professional.certificateVerificationUrl ||
    professional.certificateUrl ||
    "",
  linkedInUrl: professional.linkedInUrl || "",
  status: professional.status || "Draft",
});

const AdminCertifiedProfessionalFormModal = ({
  professional,
  certification = null,
  mode = "add",
  onClose,
  onSave,
}) => {
  const [draft, setDraft] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [isHydrated, setIsHydrated] = useState(mode === "add");
  const isEdit = mode === "edit";

  useEffect(() => {
    if (mode === "add") {
      setDraft({
        ...EMPTY_FORM,
        completionDate: getTodayLabel(),
        certificationName: certification?.name || "",
        provider: certification?.provider || "",
      });
      setError("");
      setIsHydrated(true);
      return;
    }

    if (!professional) {
      setIsHydrated(false);
      return;
    }

    setDraft(buildDraftFromProfessional(professional, certification));
    setError("");
    setIsHydrated(true);
  }, [professional, certification, mode]);

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field, value) => {
    if (!value) {
      handleChange(field, "");
      return;
    }
    handleChange(field, formatDateFromInput(value));
  };

  const handleCertificateFileChange = ({
    dataUrl = "",
    fileName = "",
  }) => {
    setDraft((prev) => ({
      ...prev,
      certificatePdf: dataUrl,
      certificateFileName: fileName,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!draft.employeeName.trim()) {
      setError("Employee name is required.");
      return;
    }

    onSave?.({
      employeeName: draft.employeeName.trim(),
      employeeId: draft.employeeId.trim(),
      designation: draft.designation.trim(),
      department: draft.department.trim(),
      officeLocation: draft.officeLocation.trim(),
      email: draft.email.trim(),
      profilePhoto: draft.profilePhoto,
      certificationName: draft.certificationName.trim(),
      provider: draft.provider.trim(),
      completionDate: draft.completionDate || getTodayLabel(),
      expiryDate: draft.expiryDate,
      credentialId: draft.credentialId.trim(),
      examScore: draft.examScore.trim(),
      percentage: draft.percentage.trim(),
      certificatePdf: draft.certificatePdf,
      certificateFileName: draft.certificateFileName,
      certificateVerificationUrl: draft.certificateVerificationUrl.trim(),
      linkedInUrl: draft.linkedInUrl.trim(),
      status: draft.status,
    });
  };

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-professional-form-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--certification-form"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">
              {isEdit ? "Edit Certified Person" : "Add Certified Person"}
            </p>
            <h3 id="admin-professional-form-title">
              {isEdit
                ? professional?.employeeName || "Edit certified person"
                : "Add a certified professional"}
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

        <form className="admin_demo_modal__body" onSubmit={handleSubmit}>
          {error && <p className="admin_request_demos__error">{error}</p>}

          {!isHydrated ? (
            <p className="admin_demo_modal__loading">Loading employee details…</p>
          ) : (
            <div className="admin_blog_form__grid">
              <div className="admin_blog_form__field">
                <AdminCertificationImageUpload
                  id="professional-profile-photo"
                  label="Profile Photo"
                  value={draft.profilePhoto}
                  onChange={(value) => handleChange("profilePhoto", value)}
                  helpText="PNG, JPG, or WEBP up to 2 MB."
                />
              </div>

              <label className="admin_blog_form__field">
                <span>Employee Name *</span>
                <input
                  type="text"
                  value={draft.employeeName}
                  onChange={(event) =>
                    handleChange("employeeName", event.target.value)
                  }
                  placeholder="Enter employee name"
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
                  placeholder="Enter employee ID"
                />
              </label>

              <label className="admin_blog_form__field">
                <span>Designation</span>
                <input
                  type="text"
                  value={draft.designation}
                  onChange={(event) =>
                    handleChange("designation", event.target.value)
                  }
                  placeholder="Enter designation"
                />
              </label>

              <label className="admin_blog_form__field">
                <span>Department</span>
                <input
                  type="text"
                  value={draft.department}
                  onChange={(event) =>
                    handleChange("department", event.target.value)
                  }
                  placeholder="Enter department"
                />
              </label>

              <label className="admin_blog_form__field">
                <span>Email</span>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  placeholder="Enter email address"
                />
              </label>

              <label className="admin_blog_form__field">
                <span>Office Location</span>
                <input
                  type="text"
                  value={draft.officeLocation}
                  onChange={(event) =>
                    handleChange("officeLocation", event.target.value)
                  }
                  placeholder="e.g. Noida, India"
                />
              </label>

              <label className="admin_blog_form__field">
                <span>Certification</span>
                <input
                  type="text"
                  value={draft.certificationName}
                  onChange={(event) =>
                    handleChange("certificationName", event.target.value)
                  }
                  placeholder="Certification name"
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
                  placeholder="Microsoft, AWS, Google Cloud…"
                />
              </label>

              <label className="admin_blog_form__field">
                <span>Completion Date</span>
                <input
                  type="date"
                  value={toDateInputValue(draft.completionDate)}
                  onChange={(event) =>
                    handleDateChange("completionDate", event.target.value)
                  }
                />
              </label>

              <label className="admin_blog_form__field">
                <span>Expiry Date</span>
                <input
                  type="date"
                  value={toDateInputValue(draft.expiryDate)}
                  onChange={(event) =>
                    handleDateChange("expiryDate", event.target.value)
                  }
                />
              </label>

              <label className="admin_blog_form__field">
                <span>Credential ID</span>
                <input
                  type="text"
                  value={draft.credentialId}
                  onChange={(event) =>
                    handleChange("credentialId", event.target.value)
                  }
                  placeholder="Enter credential ID"
                />
              </label>

              <label className="admin_blog_form__field">
                <span>Exam Score</span>
                <input
                  type="text"
                  value={draft.examScore}
                  onChange={(event) =>
                    handleChange("examScore", event.target.value)
                  }
                  placeholder="e.g. 850"
                />
              </label>

              <label className="admin_blog_form__field">
                <span>Percentage</span>
                <input
                  type="text"
                  value={draft.percentage}
                  onChange={(event) =>
                    handleChange("percentage", event.target.value)
                  }
                  placeholder="e.g. 85%"
                />
              </label>

              <div className="admin_blog_form__field admin_blog_form__field--full">
                <AdminCertificationFileUpload
                  id="professional-certificate-file"
                  label="File Upload"
                  value={draft.certificatePdf}
                  fileName={draft.certificateFileName}
                  onChange={handleCertificateFileChange}
                  helpText="PDF, Word, JPG, or PNG up to 10 MB."
                />
              </div>

              <label className="admin_blog_form__field">
                <span>Certificate Verification URL</span>
                <input
                  type="url"
                  value={draft.certificateVerificationUrl}
                  onChange={(event) =>
                    handleChange(
                      "certificateVerificationUrl",
                      event.target.value,
                    )
                  }
                  placeholder="https://example.com/verify/credential"
                />
              </label>

              <label className="admin_blog_form__field">
                <span>LinkedIn URL</span>
                <input
                  type="url"
                  value={draft.linkedInUrl}
                  onChange={(event) =>
                    handleChange("linkedInUrl", event.target.value)
                  }
                  placeholder="https://linkedin.com/in/username"
                />
              </label>

              <label className="admin_blog_form__field">
                <span>Status</span>
                <select
                  value={draft.status}
                  onChange={(event) => handleChange("status", event.target.value)}
                >
                  {CERTIFIED_PROFESSIONAL_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <footer className="admin_demo_modal__footer">
            <button
              type="button"
              className="admin_request_demos__btn admin_request_demos__btn--secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin_request_demos__btn admin_request_demos__btn--primary"
              disabled={!isHydrated}
            >
              {isEdit ? "Save Changes" : "Add Certified Person"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AdminCertifiedProfessionalFormModal;
