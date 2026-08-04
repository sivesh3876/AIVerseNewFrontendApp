import { useEffect, useMemo, useRef, useState } from "react";
import { addContactRequest, LEAD_TYPES } from "../../utils/contactRequestStorage";
import { markRegistrationCompleted } from "../../utils/registrationStatusStorage";
import {
  isRequestDemoEmailConfigured,
  sendContactEmail,
} from "../../services/requestDemoEmailService";
import logo from "../../assets/images/logo.svg";
import "./RegisterModal.scss";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  consent: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterModal = ({
  open,
  onClose,
  onRegistered,
  source = "Hero Registration",
}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !successMessage) onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, successMessage]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const isValid = useMemo(
    () =>
      Boolean(
        form.fullName.trim() &&
          EMAIL_RE.test(form.email.trim()) &&
          form.phone.trim() &&
          form.consent,
      ),
    [form],
  );

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.email.trim()) next.email = "Business email is required";
    else if (!EMAIL_RE.test(form.email.trim()))
      next.email = "Enter a valid business email";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    if (!form.consent)
      next.consent = "Please agree to the Privacy Policy and Terms";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetAndClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setForm(INITIAL_FORM);
    setErrors({});
    setSuccessMessage("");
    setIsSubmitting(false);
    onClose?.();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate() || !isValid) return;

    setIsSubmitting(true);
    setErrors({});

    const leadSource = source || "Hero Registration";
    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const message = [
      "AI Verse registration request",
      `Source: ${leadSource}`,
      `Phone: ${phone}`,
      "Consent: Privacy Policy and Terms of Service accepted",
    ].join("\n");

    try {
      // Save to Leads immediately so Admin cards update in this browser.
      addContactRequest({
        name: fullName,
        email,
        company: "—",
        phone,
        country: "—",
        industry: "—",
        reason: "Register",
        type: LEAD_TYPES.REGISTER,
        source: leadSource,
        message,
      });

      if (isRequestDemoEmailConfigured()) {
        try {
          await sendContactEmail({
            form: {
              name: fullName,
              email,
              company: "",
              phone,
              message,
              subject: "Register for AI Verse",
              leadType: LEAD_TYPES.REGISTER,
            },
          });
        } catch {
          // Local lead is already saved for Admin → Leads.
        }
      }

      markRegistrationCompleted();
      onRegistered?.();
      setSuccessMessage(
        "Thank you for registering with AI Verse. Your details are now on the Leads page.",
      );
      setForm(INITIAL_FORM);
      closeTimerRef.current = setTimeout(() => {
        resetAndClose();
      }, 2200);
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="register_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
      onClick={() => {
        if (!successMessage) resetAndClose();
      }}
    >
      <div
        className="register_modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="register_modal__close"
          onClick={resetAndClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div className="register_modal__glow" aria-hidden="true" />

        <header className="register_modal__header">
          <img src={logo} alt="AI Verse" className="register_modal__logo" />
          <h2 id="register-modal-title">Register for AI Verse</h2>
          <p>
            Register to access AI Verse solutions, AI resources, and enterprise
            insights.
          </p>
        </header>

        {successMessage ? (
          <div className="register_modal__success">
            <div className="register_modal__success-icon" aria-hidden="true">
              ✓
            </div>
            <h3>Registration Successful</h3>
            <p>{successMessage}</p>
          </div>
        ) : (
          <form
            className="register_modal__form"
            onSubmit={handleSubmit}
            noValidate
          >
            <label className="register_modal__field">
              <span>Full Name *</span>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
              />
              {errors.fullName && <em>{errors.fullName}</em>}
            </label>

            <label className="register_modal__field">
              <span>Business Email *</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                autoComplete="email"
              />
              {errors.email && <em>{errors.email}</em>}
            </label>

            <label className="register_modal__field">
              <span>Phone Number *</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                autoComplete="tel"
              />
              {errors.phone && <em>{errors.phone}</em>}
            </label>

            <label className="register_modal__consent">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
              />
              <span>
                I agree to the Privacy Policy and Terms of Service. *
              </span>
            </label>
            {errors.consent && (
              <em className="register_modal__consent-error">{errors.consent}</em>
            )}

            {errors.form && (
              <p className="register_modal__form-error">{errors.form}</p>
            )}

            <div className="register_modal__actions">
              <button
                type="button"
                className="register_modal__cancel"
                onClick={resetAndClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="register_modal__submit"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? "Registering…" : "Register"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
