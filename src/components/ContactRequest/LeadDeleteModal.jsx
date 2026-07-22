const LeadDeleteModal = ({ lead, deleting = false, onClose, onConfirm }) => {
  if (!lead) return null;

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-lead-delete-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--confirm"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">Delete Lead</p>
            <h3 id="admin-lead-delete-title">
              Are you sure you want to delete this lead?
            </h3>
            <p>
              You are about to delete{" "}
              <strong>{lead.name || "this lead"}</strong>
              {lead.email ? ` (${lead.email})` : ""}. This action cannot be
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
            onClick={() => onConfirm?.(lead)}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete Lead"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default LeadDeleteModal;
