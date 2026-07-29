const AdminCertifiedProfessionalDeleteModal = ({
  professional,
  onClose,
  onConfirm,
}) => {
  if (!professional) return null;

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-professional-delete-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--confirm"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">Delete Certified Person</p>
            <h3 id="admin-professional-delete-title">
              Are you sure you want to delete this record?
            </h3>
            <p>
              You are about to remove{" "}
              <strong>{professional.employeeName || "this employee"}</strong> from
              certified professionals. This action cannot be undone.
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
            onClick={() => onConfirm?.(professional)}
          >
            Delete
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminCertifiedProfessionalDeleteModal;
