import { useRef, useState } from "react";
import { addContactRequest, LEAD_TYPES } from "../../utils/contactRequestStorage";
import {
  isRequestDemoEmailConfigured,
  sendContactEmail,
} from "../../services/requestDemoEmailService";
import logo from "../../assets/images/logo.svg";
import "./CallbackScheduleModal.scss";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferDate: "",
  preferTime: "",
};

const formatPreferLabel = (dateValue, timeValue) => {
  const datePart = dateValue || "—";
  const timePart = timeValue || "—";
  return `${datePart} at ${timePart}`;
};

const CallbackScheduleModal = ({ open, onClose }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  if (!open) return null;

  const openNativePicker = (ref) => {
    const input = ref.current;
    if (!input) return;
    try {
      if (typeof input.showPicker === "function") {
        input.showPicker();
      } else {
        input.focus();
        input.click();
      }
    } catch {
      input.focus();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.preferDate || errors.preferTime || errors.form) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        preferDate: "",
        preferTime: "",
        form: "",
      }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email";
    }
    if (!form.phone.trim()) next.phone = "Contact number is required";
    if (!form.preferDate.trim()) next.preferDate = "Preferred date is required";
    if (!form.preferTime.trim()) next.preferTime = "Preferred time is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSuccessMessage("");
    onClose?.();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    const preferLabel = formatPreferLabel(form.preferDate, form.preferTime);
    const preferredCallbackTime = `${form.preferDate}T${form.preferTime}`;
    const message = [
      "Schedule a Call request",
      `Preferred date: ${form.preferDate}`,
      `Preferred time: ${form.preferTime}`,
      `Contact number: ${form.phone.trim()}`,
    ].join("\n");

    try {
      // Always persist locally so Admin → Leads shows the card immediately.
      addContactRequest({
        name: fullName,
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: "—",
        reason: "Schedule a Call",
        message,
        type: LEAD_TYPES.CALLBACK_SCHEDULE,
        preferredCallbackTime,
        source: "Schedule a Call",
      });

      if (isRequestDemoEmailConfigured()) {
        try {
          await sendContactEmail({
            form: {
              name: fullName,
              email: form.email.trim(),
              company: "",
              phone: form.phone.trim(),
              message,
              subject: `Schedule a Call: ${preferLabel}`,
              leadType: LEAD_TYPES.CALLBACK_SCHEDULE,
              preferredCallbackTime: preferLabel,
            },
          });
        } catch (apiError) {
          console.warn(
            "Schedule a Call saved to Leads locally; contact-us API sync failed.",
            apiError,
          );
        }
      }

      setSuccessMessage(
        "Your call is scheduled. It is now available on the Leads page.",
      );
      setForm(INITIAL_FORM);
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="callback_schedule_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="callback-schedule-title"
      onClick={handleClose}
    >
      <div
        className="callback_schedule_modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="callback_schedule_modal__close"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div className="callback_schedule_modal__glow" aria-hidden="true" />

        <header className="callback_schedule_modal__header">
          {/* <img
            src={logo}
            alt="AI Verse"
            className="callback_schedule_modal__logo"
          /> */}
          {/* <p className="callback_schedule_modal__eyebrow">AI Verse</p> */}
          <h2 id="callback-schedule-title">Schedule a Call</h2>
          <p>
            Share your details and preferred time — our experts will reach out
            shortly.
          </p>
        </header>

        {successMessage ? (
          <div className="callback_schedule_modal__success">
            <div
              className="callback_schedule_modal__success-icon"
              aria-hidden="true"
            >
              ✓
            </div>
            <h3>Request Received</h3>
            <p>{successMessage}</p>
            <button
              type="button"
              className="callback_schedule_modal__submit"
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        ) : (
          <form
            className="callback_schedule_modal__form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="callback_schedule_modal__row">
              <label className="callback_schedule_modal__field">
                <span>First Name *</span>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  disabled={isSubmitting}
                />
                {errors.firstName && <em>{errors.firstName}</em>}
              </label>
              <label className="callback_schedule_modal__field">
                <span>Last Name *</span>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  disabled={isSubmitting}
                />
                {errors.lastName && <em>{errors.lastName}</em>}
              </label>
            </div>

            <label className="callback_schedule_modal__field">
              <span>Email Address *</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                disabled={isSubmitting}
              />
              {errors.email && <em>{errors.email}</em>}
            </label>

            <label className="callback_schedule_modal__field">
              <span>Contact No *</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                disabled={isSubmitting}
              />
              {errors.phone && <em>{errors.phone}</em>}
            </label>

            <div className="callback_schedule_modal__row">
              <label className="callback_schedule_modal__field">
                <span>Preferred Date *</span>
                <div
                  className="callback_schedule_modal__picker"
                  onClick={() => openNativePicker(dateInputRef)}
                >
                  <input
                    ref={dateInputRef}
                    type="date"
                    name="preferDate"
                    value={form.preferDate}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    min={new Date().toISOString().slice(0, 10)}
                  />
                  <span
                    className="callback_schedule_modal__picker-icon"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 3v2M17 3v2M4 9h16M6 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
                {errors.preferDate && <em>{errors.preferDate}</em>}
              </label>
              <label className="callback_schedule_modal__field">
                <span>Preferred Time *</span>
                <div
                  className="callback_schedule_modal__picker"
                  onClick={() => openNativePicker(timeInputRef)}
                >
                  <input
                    ref={timeInputRef}
                    type="time"
                    name="preferTime"
                    value={form.preferTime}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <span
                    className="callback_schedule_modal__picker-icon"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="8.25"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                      <path
                        d="M12 8v4.5l2.5 1.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                {errors.preferTime && <em>{errors.preferTime}</em>}
              </label>
            </div>

            {errors.form && (
              <p className="callback_schedule_modal__form-error">
                {errors.form}
              </p>
            )}

            <div className="callback_schedule_modal__actions">
              <button
                type="submit"
                className="callback_schedule_modal__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Scheduling…" : "Schedule Now"}
              </button>
              <button
                type="button"
                className="callback_schedule_modal__cancel"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CallbackScheduleModal;
