const UserDeleteModal = ({ user, deleting = false, onClose, onConfirm }) => {
  if (!user) return null;

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-user-delete-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--confirm"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">Delete User</p>
            <h3 id="admin-user-delete-title">
              Are you sure you want to delete this user?
            </h3>
            <p>
              You are about to delete{" "}
              <strong>{user.fullName || "this user"}</strong>
              {user.email ? ` (${user.email})` : ""}. This action cannot be
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
            onClick={() => onConfirm?.(user)}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete User"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default UserDeleteModal;
