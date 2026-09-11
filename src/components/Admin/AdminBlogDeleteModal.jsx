const AdminBlogDeleteModal = ({
  blog,
  onClose,
  onConfirm,
  entityLabel = "Blog",
}) => {
  if (!blog) return null;
  const entityName = entityLabel.toLowerCase();
  const titleId = `admin-${entityName.replace(/\s+/g, "-")}-delete-title`;

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--confirm"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">
              Delete {entityLabel}
            </p>
            <h3 id={titleId}>
              Are you sure you want to delete this {entityName}?
            </h3>
            <p>
              You are about to delete{" "}
              <strong>{blog.title || `Untitled ${entityLabel}`}</strong>. This
              action cannot be undone.
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

        <footer className="admin_demo_modal__footer">
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--danger"
            onClick={() => onConfirm?.(blog)}
          >
            Delete {entityLabel}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminBlogDeleteModal;
