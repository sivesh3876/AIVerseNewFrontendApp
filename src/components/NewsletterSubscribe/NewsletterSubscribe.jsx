import { useEffect, useRef, useState } from "react";
import {
  isRequestDemoEmailConfigured,
  REQUEST_DEMO_EMAIL_SETUP_MESSAGE,
  sendNewsletterSubscribe,
} from "../../services/requestDemoEmailService";
import "./NewsletterSubscribe.scss";

const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect
      x="2"
      y="4"
      width="20"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <path
      d="m2 7 10 7 10-7"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" fill="#18E0CC" />
    <path
      d="m8 12 2.5 2.5L16 9"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const isEmailApiReady = isRequestDemoEmailConfigured();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    if (!isEmailApiReady) {
      setFeedback({ type: "error", message: REQUEST_DEMO_EMAIL_SETUP_MESSAGE });
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback({ type: "", message: "" });

      const result = await sendNewsletterSubscribe({ email: trimmedEmail });

      setFeedback({
        type: "success",
        message: result.successMessage || "You're subscribed!",
      });
      setEmail("");
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.message ||
          "Failed to subscribe. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={`newsletter_subscribe ${visible ? "animate" : ""}`}
      ref={sectionRef}
    >
      <div className="newsletter_subscribe__container">
        <div className="newsletter_subscribe__content">
          <h2>Stay Ahead of the AI Curve</h2>
          <p>
            Join 10,000+ enterprise leaders receiving exclusive AI insights,
            industry trends, research reports, and success stories delivered to
            your inbox monthly.
          </p>
        </div>

        <div className="newsletter_subscribe__form-wrap">
          <form className="newsletter_subscribe__form" onSubmit={handleSubmit}>
            <div className="newsletter_subscribe__input-group">
              <span className="newsletter_subscribe__input-icon">
                <MailIcon />
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (feedback.message) {
                    setFeedback({ type: "", message: "" });
                  }
                }}
                placeholder="Enter your email address"
                aria-label="Email address"
                required
                disabled={isSubmitting}
              />
              <button type="submit" disabled={isSubmitting || !isEmailApiReady}>
                {isSubmitting ? "Subscribing..." : "Subscribe Now"}
              </button>
            </div>

            {!isEmailApiReady && (
              <p className="newsletter_subscribe__setup-note" role="status">
                {REQUEST_DEMO_EMAIL_SETUP_MESSAGE}
              </p>
            )}

            {feedback.message && (
              <p
                className={`newsletter_subscribe__feedback is-${feedback.type}`}
                role={feedback.type === "error" ? "alert" : "status"}
              >
                {feedback.message}
              </p>
            )}

            <p className="newsletter_subscribe__note">
              <CheckIcon />
              <span>No spam. Unsubscribe anytime.</span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscribe;
