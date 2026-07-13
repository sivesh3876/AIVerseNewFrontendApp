const AdminCertificationDeleteModal = ({ certification, onClose, onConfirm }) => {
  if (!certification) return null;

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-certification-delete-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--confirm"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">Delete Certification</p>
            <h3 id="admin-certification-delete-title">
              Are you sure you want to delete this certification?
            </h3>
            <p>
              You are about to delete{" "}
              <strong>{certification.name || "Untitled Certification"}</strong>.
              This action cannot be undone.
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
            onClick={() => onConfirm?.(certification)}
          >
            Delete Certification
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminCertificationDeleteModal;
