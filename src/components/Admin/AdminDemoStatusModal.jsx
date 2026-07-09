import { useState } from "react";
import { DEMO_RECORD_STATUSES } from "../../utils/demoRequestStorage";

const AdminDemoStatusModal = ({ request, onClose, onSave }) => {
  const [status, setStatus] = useState(request?.recordStatus || "Active");

  if (!request) return null;

  const handleSave = () => {
    onSave?.({ recordStatus: status });
  };

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-demo-status-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--detail"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">Update Status</p>
            <h3 id="admin-demo-status-title">
              {request.solutionTitle || "Untitled Solution"}
            </h3>
            <p>
              Requester: <strong>{request.fullName || "—"}</strong>
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
            <h4>Record Status</h4>
            <div className="admin_demo_status_modal__options">
              {DEMO_RECORD_STATUSES.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`admin_demo_status_modal__option admin_demo_status_modal__option--${option.toLowerCase()}${status === option ? " is-selected" : ""}`}
                  onClick={() => setStatus(option)}
                >
                  <span
                    className="admin_demo_status_modal__dot"
                    aria-hidden="true"
                  />
                  {option}
                </button>
              ))}
            </div>
          </section>
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
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--primary"
            onClick={handleSave}
          >
            Update
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminDemoStatusModal;
