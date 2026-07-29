import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  BLOG_FORM_STATUSES,
  HOMEPAGE_CARD_COUNT,
  getBlogCategoryOptions,
  getBlogTrackOptions,
  getDefaultAuthorName,
} from "../../utils/adminBlogStorage";
import { isHtmlContentEmpty } from "../../utils/htmlContent";
import AdminRichTextEditor from "./AdminRichTextEditor";

const ADD_NEW_OPTION = "__add_new__";

const EMPTY_FORM = {
  title: "",
  category: "",
  customCategory: "",
  trackId: "",
  customTrack: "",
  author: "",
  publishedDate: "",
  url: "",
  description: "",
  recordStatus: "Published",
  showOnHomepage: false,
  homepageOrder: 1,
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

const AdminBlogFormModal = ({ blog, mode = "add", onClose, onSave }) => {
  const { adminEmail } = useAdminAuth();
  const [draft, setDraft] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const isEdit = mode === "edit";
  const isDraft = draft.recordStatus === "Draft";

  const categoryOptions = useMemo(() => getBlogCategoryOptions(), [blog, mode]);
  const trackOptions = useMemo(() => getBlogTrackOptions(), [blog, mode]);

  useEffect(() => {
    const defaultCategory = categoryOptions[0] || "";
    const defaultTrackId = trackOptions[0]?.id || "generative-ai";
    const today = getTodayLabel();

    if (mode === "add" && !blog) {
      setDraft({
        ...EMPTY_FORM,
        category: defaultCategory,
        trackId: defaultTrackId,
        publishedDate: today,
        url: "",
      });
      setError("");
      return;
    }

    if (!blog) {
      setDraft({
        ...EMPTY_FORM,
        category: defaultCategory,
        trackId: defaultTrackId,
      });
      return;
    }

    const blogCategory = blog.category || defaultCategory;
    const categoryInList = categoryOptions.includes(blogCategory);
    const blogTrackId = blog.trackId || defaultTrackId;
    const trackInList = trackOptions.some((track) => track.id === blogTrackId);

    setDraft({
      title: blog.title || "",
      category: categoryInList ? blogCategory : ADD_NEW_OPTION,
      customCategory: categoryInList ? "" : blogCategory,
      trackId: trackInList ? blogTrackId : ADD_NEW_OPTION,
      customTrack: trackInList ? "" : blog.trackLabel || "",
      author: blog.author || "",
      publishedDate:
        blog.recordStatus === "Draft" ? "" : blog.publishedDate || "",
      url: blog.url || "",
      description: blog.description || "",
      recordStatus: blog.recordStatus || "Published",
      showOnHomepage: Boolean(blog.showOnHomepage),
      homepageOrder: blog.homepageOrder || 1,
    });
    setError("");
  }, [blog, mode, categoryOptions, trackOptions]);

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handlePublishedDateChange = (value) => {
    if (!value) {
      handleChange("publishedDate", "");
      return;
    }
    handleChange("publishedDate", formatDateFromInput(value));
  };

  const handleStatusChange = (status) => {
    setDraft((prev) => ({
      ...prev,
      recordStatus: status,
      publishedDate:
        status === "Draft" ? "" : prev.publishedDate || getTodayLabel(),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!draft.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (draft.category === ADD_NEW_OPTION && !draft.customCategory.trim()) {
      setError("Please enter a new category name.");
      return;
    }

    if (draft.trackId === ADD_NEW_OPTION && !draft.customTrack.trim()) {
      setError("Please enter a new track name.");
      return;
    }

    if (!isDraft && !draft.publishedDate.trim()) {
      setError("Published date is required for published blogs.");
      return;
    }

    if (isHtmlContentEmpty(draft.description)) {
      setError("Description is required.");
      return;
    }

    if (draft.showOnHomepage && !draft.homepageOrder) {
      setError("Please select a homepage card position (1-6).");
      return;
    }

    onSave?.({
      title: draft.title,
      category: draft.category === ADD_NEW_OPTION ? "" : draft.category,
      customCategory:
        draft.category === ADD_NEW_OPTION ? draft.customCategory.trim() : "",
      trackId: draft.trackId === ADD_NEW_OPTION ? "" : draft.trackId,
      customTrackLabel:
        draft.trackId === ADD_NEW_OPTION ? draft.customTrack.trim() : "",
      author: draft.author.trim() || getDefaultAuthorName(adminEmail),
      publishedDate: isDraft ? "" : draft.publishedDate,
      url: draft.url.trim(),
      description: draft.description,
      recordStatus: draft.recordStatus,
      showOnHomepage: draft.showOnHomepage,
      homepageOrder: draft.showOnHomepage ? Number(draft.homepageOrder) : null,
      defaultAuthorEmail: adminEmail,
    });
  };

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-blog-form-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--blog-form"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">
              {isEdit ? "Edit Blog" : "Add Blog"}
            </p>
            <h3 id="admin-blog-form-title">
              {isEdit ? blog?.title || "Edit blog post" : "Create a new blog post"}
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

          <div className="admin_blog_form__grid">
            <label className="admin_blog_form__field admin_blog_form__field--full">
              <span>Title *</span>
              <input
                type="text"
                value={draft.title}
                onChange={(event) => handleChange("title", event.target.value)}
                placeholder="Enter blog title"
                required
              />
            </label>

            <div className="admin_blog_form__field">
              <span>Category *</span>
              <select
                value={draft.category}
                onChange={(event) => handleChange("category", event.target.value)}
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
                  placeholder="Enter new category name"
                />
              )}
            </div>

            <div className="admin_blog_form__field">
              <span>Track *</span>
              <select
                value={draft.trackId}
                onChange={(event) => handleChange("trackId", event.target.value)}
              >
                {trackOptions.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.label}
                  </option>
                ))}
                <option value={ADD_NEW_OPTION}>+ Add new track</option>
              </select>
              {draft.trackId === ADD_NEW_OPTION && (
                <input
                  type="text"
                  className="admin_blog_form__inline-input"
                  value={draft.customTrack}
                  onChange={(event) =>
                    handleChange("customTrack", event.target.value)
                  }
                  placeholder="Enter new track name"
                />
              )}
            </div>

            <label className="admin_blog_form__field">
              <span>Author</span>
              <input
                type="text"
                value={draft.author}
                onChange={(event) => handleChange("author", event.target.value)}
                placeholder={`Leave blank to use ${getDefaultAuthorName(adminEmail)}`}
              />
            </label>

            <label className="admin_blog_form__field">
              <span>Status</span>
              <select
                value={draft.recordStatus}
                onChange={(event) => handleStatusChange(event.target.value)}
              >
                {BLOG_FORM_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            {!isDraft && (
              <label className="admin_blog_form__field">
                <span>Published Date *</span>
                <input
                  type="date"
                  value={toDateInputValue(draft.publishedDate)}
                  onChange={(event) =>
                    handlePublishedDateChange(event.target.value)
                  }
                  required
                />
              </label>
            )}

            <label className="admin_blog_form__field admin_blog_form__field--full">
              <span>URL Link</span>
              <input
                type="url"
                value={draft.url}
                onChange={(event) => handleChange("url", event.target.value)}
                placeholder="https://example.com/your-blog-post"
              />
              <p className="admin_blog_form__help">
                When added, clicking the blog card opens this link in a new tab.
              </p>
            </label>

            <div className="admin_blog_form__field admin_blog_form__field--full admin_blog_form__homepage">
              <label className="admin_blog_form__checkbox">
                <input
                  type="checkbox"
                  checked={draft.showOnHomepage}
                  onChange={(event) =>
                    handleChange("showOnHomepage", event.target.checked)
                  }
                />
                <span>Show on homepage</span>
              </label>
              <p className="admin_blog_form__help">
                Choose a homepage card position (1 to 6). If not selected, the blog
                appears in the track-wise section with remaining blogs.
              </p>

              {draft.showOnHomepage && (
                <label className="admin_blog_form__field">
                  <span>Homepage card position *</span>
                  <select
                    value={draft.homepageOrder}
                    onChange={(event) =>
                      handleChange("homepageOrder", Number(event.target.value))
                    }
                    required
                  >
                    {Array.from({ length: HOMEPAGE_CARD_COUNT }, (_, index) => {
                      const position = index + 1;
                      return (
                        <option key={position} value={position}>
                          Card {position}
                        </option>
                      );
                    })}
                  </select>
                </label>
              )}
            </div>

            <div className="admin_blog_form__field admin_blog_form__field--full">
              <span>Description *</span>
              <AdminRichTextEditor
                key={blog?.id || "new-blog"}
                value={draft.description}
                onChange={(value) => handleChange("description", value)}
                placeholder="Enter blog description"
                ariaLabel="Blog description"
              />
            </div>
          </div>

          <footer className="admin_demo_modal__footer">
            <button
              type="button"
              className="admin_request_demos__btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin_request_demos__btn admin_request_demos__btn--primary"
            >
              {isEdit ? "Update Blog" : "Add Blog"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AdminBlogFormModal;
