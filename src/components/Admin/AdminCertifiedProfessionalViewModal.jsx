const DETAIL_FIELDS = [
  { key: "employeeId", label: "Employee ID" },
  { key: "designation", label: "Designation" },
  { key: "department", label: "Department" },
  { key: "officeLocation", label: "Office Location" },
  { key: "email", label: "Email" },
  { key: "certificationName", label: "Certification" },
  { key: "provider", label: "Provider" },
  { key: "completionDate", label: "Completion Date" },
  { key: "expiryDate", label: "Expiry Date" },
  { key: "credentialId", label: "Credential ID" },
  { key: "examScore", label: "Exam Score" },
  { key: "percentage", label: "Percentage" },
  {
    key: "certificateVerificationUrl",
    label: "Certificate Verification URL",
    isLink: true,
  },
  { key: "linkedInUrl", label: "LinkedIn URL", isLink: true },
  {
    key: "status",
    label: "Status",
    isStatus: true,
  },
];

const getFieldValue = (field, professional) => {
  if (field.key === "examScore") {
    return professional.examScore || professional.score || "—";
  }
  if (field.key === "certificateVerificationUrl") {
    return (
      professional.certificateVerificationUrl ||
      professional.certificateUrl ||
      "—"
    );
  }
  return professional[field.key] || "—";
};

const AdminCertifiedProfessionalViewModal = ({ professional, onClose }) => {
  if (!professional) return null;

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-professional-view-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--blog-view"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">View Certified Person</p>
            <h3 id="admin-professional-view-title">
              {professional.employeeName || "Untitled Employee"}
            </h3>
            <p>
              Employee ID <strong>{professional.employeeId || "—"}</strong>
            </p>
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
          <section className="admin_demo_modal__section">
            <h4>Profile</h4>
            <div className="admin_certified_professional__profile-preview">
              {professional.profilePhoto ? (
                <img
                  src={professional.profilePhoto}
                  alt={professional.employeeName || "Employee profile"}
                />
              ) : (
                <div className="admin_certified_professional__profile-placeholder">
                  {(professional.employeeName || "?").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </section>

          <section className="admin_demo_modal__section">
            <h4>Employee Details</h4>
            <dl className="admin_blog_view__details">
              {DETAIL_FIELDS.map((field) => {
                const value = getFieldValue(field, professional);
                const isEmpty = value === "—";

                return (
                  <div key={field.key} className="admin_blog_view__detail-item">
                    <dt>{field.label}</dt>
                    <dd
                      className={
                        isEmpty
                          ? "admin_blog_view__detail-value is-empty"
                          : "admin_blog_view__detail-value"
                      }
                    >
                      {field.isStatus ? (
                        <span
                          className={`admin_blog_view__status admin_blog_view__status--${String(professional.status || "draft").toLowerCase()}`}
                        >
                          {value}
                        </span>
                      ) : field.isLink && !isEmpty ? (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin_blog_view__link"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                );
              })}

              <div className="admin_blog_view__detail-item">
                <dt>Certificate File</dt>
                <dd
                  className={
                    professional.certificatePdf
                      ? "admin_blog_view__detail-value"
                      : "admin_blog_view__detail-value is-empty"
                  }
                >
                  {professional.certificatePdf ? (
                    <a
                      href={professional.certificatePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin_blog_view__link"
                      download={professional.certificateFileName || undefined}
                    >
                      {professional.certificateFileName || "View file"}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <footer className="admin_demo_modal__footer">
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--primary"
            onClick={onClose}
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminCertifiedProfessionalViewModal;
