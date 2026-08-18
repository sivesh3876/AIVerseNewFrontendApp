import { stripHtml } from "../../utils/htmlContent";
import { normalizeCertificationUrl } from "../../utils/adminCertificationStorage";

const DETAIL_FIELDS = [
  { key: "code", label: "Certification Code" },
  { key: "provider", label: "Provider" },
  { key: "category", label: "Category" },
  { key: "level", label: "Level" },
  { key: "duration", label: "Duration" },
  { key: "validity", label: "Validity" },
  {
    key: "externalUrl",
    label: "External Certification URL",
    isLink: true,
  },
  { key: "skillsCovered", label: "Skills Covered" },
  {
    key: "totalCertified",
    label: "Total Certified",
    format: (value) => Number(value || 0).toLocaleString("en-IN"),
  },
  {
    key: "status",
    label: "Status",
    isStatus: true,
  },
  {
    key: "publish",
    label: "Publish",
    format: (value, certification) =>
      value || (certification.publicationStatus === "Published" ? "Yes" : "No"),
  },
  { key: "createdDate", label: "Date" },
];

const getFieldValue = (field, certification) => {
  const raw = field.format
    ? field.format(certification[field.key], certification)
    : certification[field.key];

  return raw || "—";
};

const AdminCertificationViewModal = ({ certification, onClose }) => {
  if (!certification) return null;

  const hasDescription = Boolean(stripHtml(certification.description));
  const linkUrl = normalizeCertificationUrl(certification.externalUrl);

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-certification-view-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--blog-view admin_demo_modal--certification-view"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">View Certification</p>
            <h3 id="admin-certification-view-title">
              {certification.name || "Untitled Certification"}
            </h3>
            <p>
              {certification.code ? (
                <>
                  Code <strong>{certification.code}</strong>
                  {certification.provider ? " · " : ""}
                </>
              ) : null}
              {certification.provider ? (
                <>
                  Provider <strong>{certification.provider}</strong>
                </>
              ) : null}
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
          {certification.attachmentFile && (
            <section className="admin_demo_modal__section">
              <h4>Attachment</h4>
              <p>
                <a
                  href={certification.attachmentFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin_blog_view__link"
                  download={certification.attachmentName || undefined}
                >
                  {certification.attachmentName || "View uploaded file"}
                </a>
              </p>
              {certification.attachmentFile.startsWith("data:image") && (
                <img
                  src={certification.attachmentFile}
                  alt={certification.attachmentName || "Certification attachment"}
                  className="admin_certification_view__attachment-preview"
                />
              )}
            </section>
          )}

          <section className="admin_demo_modal__section">
            <h4>Certification Details</h4>
            <dl className="admin_blog_view__details">
              {DETAIL_FIELDS.map((field) => {
                const value = getFieldValue(field, certification);
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
                          className={`admin_blog_view__status admin_blog_view__status--${String(certification.status || "active").toLowerCase()}`}
                        >
                          {value}
                        </span>
                      ) : field.isLink && linkUrl ? (
                        <a
                          href={linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin_blog_view__link"
                        >
                          {linkUrl}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>

          <section className="admin_demo_modal__section">
            <h4>Description</h4>
            {hasDescription ? (
              <div
                className="admin_blog_view__description"
                dangerouslySetInnerHTML={{ __html: certification.description }}
              />
            ) : (
              <p className="admin_demo_detail__empty">—</p>
            )}
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

export default AdminCertificationViewModal;
