import { useEffect } from "react";

const ContactRequestToast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      className={`admin_contact_toast admin_contact_toast--${toast.type}`}
      role="alert"
    >
      <span>{toast.message}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss">
        &times;
      </button>
    </div>
  );
};

export default ContactRequestToast;
