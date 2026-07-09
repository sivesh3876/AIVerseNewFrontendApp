const DETAIL_FIELDS = [
  { key: "solutionTitle", label: "Solution Title" },
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "company", label: "Company" },
  { key: "phone", label: "Phone" },
  { key: "message", label: "Message" },
];

const AdminDemoDetailModal = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-demo-detail-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--detail"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">Request Demo Detail</p>
            <h3 id="admin-demo-detail-title">
              {request.solutionTitle || "Untitled Solution"}
            </h3>
            <p>
              Submitted by <strong>{request.fullName || "—"}</strong>
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
            <h4>Form Details</h4>
            <dl className="admin_demo_detail__list">
              {DETAIL_FIELDS.map((field) => (
                <div key={field.key} className="admin_demo_detail__item">
                  <dt>{field.label}</dt>
                  <dd
                    className={
                      request[field.key] ? "" : "admin_demo_detail__empty"
                    }
                  >
                    {request[field.key] || "—"}
                  </dd>
                </div>
              ))}
            </dl>
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

export default AdminDemoDetailModal;
