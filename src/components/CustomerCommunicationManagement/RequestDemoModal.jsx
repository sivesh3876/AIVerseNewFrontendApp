import { useState } from "react";
import {
  isRequestDemoEmailConfigured,
  REQUEST_DEMO_EMAIL_SETUP_MESSAGE,
  sendContactEmail,
  sendRequestDemoEmail,
} from "../../services/requestDemoEmailService";
import "./RequestDemoModal.scss";

const INITIAL_FORM = {
  name: "",
  email: "",
  company: "",
  phone: "",
  message: "",
};

const RequestDemoModal = ({ capability = null, mode = "demo", onClose }) => {
  const isContactMode = mode === "contact";
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");
  const isEmailApiReady = isRequestDemoEmailConfigured();

  const modalTitle = isContactMode ? "Contact Us" : "Request Demo";
  const modalSubtitle = isContactMode
    ? "Send us a message and our team will get back to you."
    : capability?.title || "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEmailApiReady) {
      setErrors({ form: REQUEST_DEMO_EMAIL_SETUP_MESSAGE });
      return;
    }

    if (!validateForm()) return;

    try {
      setIsSending(true);
      setErrors({});
      setSuccessPopupMessage("");

      const result = isContactMode
        ? await sendContactEmail({ form })
        : await sendRequestDemoEmail({ capability, form });

      setSuccessPopupMessage(
        result.successMessage || "Mail sent successfully.",
      );
    } catch (error) {
      setErrors({
        form:
          error.message ||
          "Failed to send request. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div
        className="request_demo_modal__overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-demo-title"
        onClick={onClose}
      >
        <div
          className="request_demo_modal"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="request_demo_modal__header">
            <div>
              <h3 id="request-demo-title">{modalTitle}</h3>
              {modalSubtitle && <p>{modalSubtitle}</p>}
            </div>
            <button
              type="button"
              className="request_demo_modal__close"
              onClick={onClose}
              aria-label="Close form"
              disabled={isSending}
            >
              &times;
            </button>
          </div>

          {!isEmailApiReady && (
            <div className="request_demo_modal__setup-note" role="status">
              {REQUEST_DEMO_EMAIL_SETUP_MESSAGE}
            </div>
          )}

          <form className="request_demo_modal__form" onSubmit={handleSubmit} noValidate>
            {!isContactMode && capability?.title && (
              <label className="request_demo_modal__field">
                <span>
                  Solution Title <strong>*</strong>
                </span>
                <input
                  type="text"
                  value={capability.title}
                  readOnly
                  disabled
                  className="is-readonly"
                />
              </label>
            )}

            <label className="request_demo_modal__field">
              <span>
                Full Name <strong>*</strong>
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? "has-error" : ""}
                disabled={isSending}
              />
              {errors.name && (
                <small className="request_demo_modal__error">{errors.name}</small>
              )}
            </label>

            <label className="request_demo_modal__field">
              <span>
                Email <strong>*</strong>
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={errors.email ? "has-error" : ""}
                disabled={isSending}
              />
              {errors.email && (
                <small className="request_demo_modal__error">{errors.email}</small>
              )}
            </label>

            <label className="request_demo_modal__field">
              <span>Company</span>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Enter your company name"
                disabled={isSending}
              />
            </label>

            <label className="request_demo_modal__field">
              <span>Phone</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                disabled={isSending}
              />
            </label>

            <label className="request_demo_modal__field">
              <span>Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder={
                  isContactMode
                    ? "How can we help you?"
                    : "Tell us what you would like to see in the demo"
                }
                disabled={isSending}
              />
            </label>

            {errors.form && (
              <p className="request_demo_modal__form-error">{errors.form}</p>
            )}

            <div className="request_demo_modal__actions">
              <button
                type="button"
                className="request_demo_modal__btn request_demo_modal__btn--secondary"
                onClick={onClose}
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="request_demo_modal__btn request_demo_modal__btn--primary"
                disabled={isSending || !isEmailApiReady}
                title={
                  isEmailApiReady ? "Send email" : REQUEST_DEMO_EMAIL_SETUP_MESSAGE
                }
              >
                {isSending ? "Sending..." : "Send Mail"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {successPopupMessage && (
        <div
          className="request_demo_modal__success-overlay"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="request-demo-success-title"
          onClick={() => {
            setSuccessPopupMessage("");
            onClose();
          }}
        >
          <div
            className="request_demo_modal__success-popup"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="request_demo_modal__success-icon" aria-hidden="true">
              ✓
            </div>
            <h4 id="request-demo-success-title">Email Sent</h4>
            <p>{successPopupMessage}</p>
            <button
              type="button"
              className="request_demo_modal__btn request_demo_modal__btn--primary"
              onClick={() => {
                setSuccessPopupMessage("");
                onClose();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestDemoModal;
