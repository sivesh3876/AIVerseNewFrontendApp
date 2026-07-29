const AdminSolutionDeleteModal = ({
  solution,
  onClose,
  onConfirm,
  deleting = false,
}) => {
  if (!solution) return null;

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-solution-delete-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--confirm"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">Delete Solution</p>
            <h3 id="admin-solution-delete-title">
              Are you sure you want to delete this solution?
            </h3>
            <p>
              You are about to delete{" "}
              <strong>{solution.Title || "Untitled Solution"}</strong>
              {solution.ID ? ` (ID ${solution.ID})` : ""}. This action cannot be
              undone.
            </p>
          </div>
          <button
            type="button"
            className="admin_demo_modal__close"
            onClick={onClose}
            aria-label="Close"
            disabled={deleting}
          >
            &times;
          </button>
        </header>

        <footer className="admin_demo_modal__footer">
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--danger"
            onClick={() => onConfirm?.(solution)}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete Solution"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminSolutionDeleteModal;
