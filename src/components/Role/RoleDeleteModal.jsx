const RoleDeleteModal = ({ role, deleting = false, onClose, onConfirm }) => {
  if (!role) return null;

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-role-delete-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--confirm"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">Delete Role</p>
            <h3 id="admin-role-delete-title">
              Are you sure you want to delete this role?
            </h3>
            <p>
              You are about to delete{" "}
              <strong>{role.name || "this role"}</strong>
              {role.assignedUsers
                ? ` (${role.assignedUsers} user${role.assignedUsers === 1 ? "" : "s"} assigned)`
                : ""}
              . This action cannot be undone.
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
            onClick={() => onConfirm?.(role)}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete Role"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default RoleDeleteModal;
