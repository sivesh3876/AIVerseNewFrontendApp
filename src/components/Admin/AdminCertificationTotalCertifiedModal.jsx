import { getCertifiedProfessionalCount } from "../../utils/adminCertifiedProfessionalStorage";

const AdminCertificationTotalCertifiedModal = ({
  certification,
  onClose,
  onView,
}) => {
  if (!certification) return null;

  const total =
    getCertifiedProfessionalCount(certification.id) ||
    Number(certification.totalCertified) ||
    0;

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-total-certified-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--confirm"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">Total Certified</p>
            <h3 id="admin-total-certified-title">View certified employees?</h3>
            <p>
              <strong>{total.toLocaleString("en-IN")}</strong> employee
              {total === 1 ? "" : "s"} completed{" "}
              <strong>{certification.name || "this certification"}</strong>.
              Would you like to view the full list?
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
            className="admin_request_demos__btn admin_request_demos__btn--primary"
            onClick={() => onView?.(certification)}
          >
            View
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminCertificationTotalCertifiedModal;
