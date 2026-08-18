import { getSolutionStatusLabel } from "../../utils/adminSolutionTableUtils";

const normalizeUrl = (value = "") => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const formatListValue = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ") || "—";
  }

  const text = String(value || "").trim();
  return text || "—";
};

const DETAIL_FIELDS = [
  { key: "ID", label: "ID" },
  { key: "BusinessDomain", label: "Business Domain" },
  { key: "OwnershipDetails", label: "COE / Ownership" },
  {
    key: "AiEvangelists",
    label: "AI Evangelists",
    format: (value) => formatListValue(value),
  },
  {
    key: "AiFoundation",
    label: "AI Foundation",
    format: (value, solution) =>
      formatListValue(value || solution.Client),
  },
  {
    key: "RepositoryUrl",
    label: "Repository URL",
    isLink: true,
  },
  {
    key: "DemoLink",
    label: "Demo Link",
    isLink: true,
  },
  {
    key: "status",
    label: "Status",
    isStatus: true,
    format: (_value, solution) => getSolutionStatusLabel(solution),
  },
];

const getFieldValue = (field, solution) => {
  const raw = field.format
    ? field.format(solution[field.key], solution)
    : solution[field.key];

  return raw || "—";
};

const getAttachmentLinks = (solution) => {
  const links = [];

  if (solution.SolutionDetailsDoc) {
    links.push({
      label: "Solution Details Document",
      href: solution.SolutionDetailsDoc,
    });
  }

  if (solution.LowLevelDesignDoc) {
    links.push({
      label: "Low Level Design Document",
      href: solution.LowLevelDesignDoc,
    });
  }

  if (solution.ArchitectureDiagram) {
    links.push({
      label: "Architecture Diagram",
      href: solution.ArchitectureDiagram,
    });
  }

  if (solution.SalesDeskDoc) {
    links.push({
      label: "Sales Pitch PDF",
      href: solution.SalesDeskDoc,
    });
  }

  if (solution.DemoRecordedVideoLink) {
    links.push({
      label: "Demo Recorded Video",
      href: solution.DemoRecordedVideoLink,
    });
  }

  const otherDocs = Array.isArray(solution.OtherDocuments)
    ? solution.OtherDocuments
    : [];

  otherDocs.filter(Boolean).forEach((doc, index) => {
    links.push({
      label: `Other Document ${index + 1}`,
      href: doc,
    });
  });

  return links;
};

const AdminSolutionViewModal = ({ solution, onClose }) => {
  if (!solution) return null;

  const statusLabel = getSolutionStatusLabel(solution);
  const contextText = String(solution.SolutionContext || "").trim();
  const highlightsText = String(solution.TechHighlights || "").trim();
  const attachments = getAttachmentLinks(solution);

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-solution-view-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--blog-view"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">View Solution</p>
            <h3 id="admin-solution-view-title">
              {solution.Title || "Untitled Solution"}
            </h3>
            <p>
              {solution.BusinessDomain ? (
                <>
                  Domain <strong>{solution.BusinessDomain}</strong>
                </>
              ) : (
                "AI solution details"
              )}
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
            <h4>Solution Details</h4>
            <dl className="admin_blog_view__details">
              {DETAIL_FIELDS.map((field) => {
                const value = getFieldValue(field, solution);
                const isEmpty = value === "—";
                const linkUrl = field.isLink
                  ? normalizeUrl(solution[field.key])
                  : "";

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
                          className={`admin_blog_view__status admin_blog_view__status--${statusLabel === "Active" ? "published" : "draft"}`}
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
            <h4>Solution Context</h4>
            {contextText ? (
              <div className="admin_blog_view__description">{contextText}</div>
            ) : (
              <p className="admin_demo_detail__empty">—</p>
            )}
          </section>

          <section className="admin_demo_modal__section">
            <h4>Technology Highlights</h4>
            {highlightsText ? (
              <div className="admin_blog_view__description">{highlightsText}</div>
            ) : (
              <p className="admin_demo_detail__empty">—</p>
            )}
          </section>

          {attachments.length > 0 && (
            <section className="admin_demo_modal__section">
              <h4>Attachments</h4>
              <ul className="admin_solution_view__attachments">
                {attachments.map((item) => (
                  <li key={`${item.label}-${item.href}`}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin_blog_view__link"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
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

export default AdminSolutionViewModal;
