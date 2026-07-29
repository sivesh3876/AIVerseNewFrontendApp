import { stripHtml } from "../../utils/htmlContent";
import { normalizeBlogUrl } from "../../utils/blogResourceLinks";

const DETAIL_FIELDS = [
  {
    key: "publishedDate",
    label: "Published Date",
    format: (value, blog) =>
      blog.recordStatus === "Draft" ? "—" : value || "—",
  },
  {
    key: "url",
    label: "URL Link",
    format: (value) => value || "—",
    isLink: true,
  },
  { key: "category", label: "Category" },
  { key: "trackLabel", label: "Track" },
  { key: "author", label: "Author" },
  {
    key: "recordStatus",
    label: "Status",
    isStatus: true,
  },
  {
    key: "viewCount",
    label: "Views",
    format: (value) => Number(value || 0).toLocaleString("en-IN"),
  },
];

const getFieldValue = (field, blog) => {
  const raw = field.format
    ? field.format(blog[field.key], blog)
    : blog[field.key];

  return raw || "—";
};

const AdminBlogViewModal = ({ blog, onClose }) => {
  if (!blog) return null;

  const hasDescription = Boolean(stripHtml(blog.description));

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-blog-view-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--blog-view"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">View Blog</p>
            <h3 id="admin-blog-view-title">{blog.title || "Untitled Blog"}</h3>
            <p>
              By <strong>{blog.author || "—"}</strong>
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
            <h4>Blog Details</h4>
            <dl className="admin_blog_view__details">
              {DETAIL_FIELDS.map((field) => {
                const value = getFieldValue(field, blog);
                const isEmpty = value === "—";
                const linkUrl = field.isLink ? normalizeBlogUrl(blog.url) : "";

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
                          className={`admin_blog_view__status admin_blog_view__status--${String(blog.recordStatus || "published").toLowerCase()}`}
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
                dangerouslySetInnerHTML={{ __html: blog.description }}
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

export default AdminBlogViewModal;
