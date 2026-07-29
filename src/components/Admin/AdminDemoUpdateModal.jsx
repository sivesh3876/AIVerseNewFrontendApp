import { useEffect, useMemo, useState } from "react";
import { formatDemoRequestDate } from "../../services/demoRequestService";

const MAX_FEEDBACK_WORDS = 100;

const MODAL_SECTIONS = {
  schedule: { id: "schedule", label: "Schedule & Delivery" },
  feedback: { id: "feedback", label: "Feedback" },
  timeline: { id: "timeline", label: "Timeline" },
};

const countWords = (text = "") =>
  text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;

const toDatetimeLocalValue = (value) => {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
    return value.slice(0, 16);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (part) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const StarRating = ({ value, onChange }) => (
  <div className="admin_request_demos__stars" role="group" aria-label="Rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`admin_request_demos__star${star <= value ? " is-active" : ""}`}
        onClick={() => onChange(star)}
        aria-label={`${star} star`}
      >
        ★
      </button>
    ))}
  </div>
);

const TimelineItem = ({ title, date, by, isEmpty }) => (
  <div className={`admin_demo_modal__timeline-item${isEmpty ? " is-empty" : ""}`}>
    <div className="admin_demo_modal__timeline-dot" aria-hidden="true" />
    <div>
      <strong>{title}</strong>
      <p>{isEmpty ? "Not recorded yet" : formatDemoRequestDate(date)}</p>
      {!isEmpty && by && <span>By: {by}</span>}
    </div>
  </div>
);

const AdminDemoUpdateModal = ({
  request,
  mode = "schedule",
  onClose,
  onSave,
}) => {
  const activeSection = MODAL_SECTIONS[mode] || MODAL_SECTIONS.schedule;
  const isReadOnly = mode === "timeline";
  const [draft, setDraft] = useState({
    demoScheduledBy: request?.demoScheduledBy || "",
    demoScheduledAt: request?.demoScheduledAt || "",
    demoGivenBy: request?.demoGivenBy || "",
    demoGivenAt: request?.demoGivenAt || "",
    feedbackRating: Number(request?.feedbackRating) || 0,
    feedbackSentiment: request?.feedbackSentiment || "",
    feedbackMessage: request?.feedbackMessage || "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!request) return;

    setDraft({
      demoScheduledBy: request.demoScheduledBy || "",
      demoScheduledAt: request.demoScheduledAt || "",
      demoGivenBy: request.demoGivenBy || "",
      demoGivenAt: request.demoGivenAt || "",
      feedbackRating: Number(request.feedbackRating) || 0,
      feedbackSentiment: request.feedbackSentiment || "",
      feedbackMessage: request.feedbackMessage || "",
    });
    setError("");
  }, [request, mode]);

  const wordCount = useMemo(
    () => countWords(draft.feedbackMessage),
    [draft.feedbackMessage],
  );

  if (!request) return null;

  const handleFeedbackChange = (event) => {
    const nextValue = event.target.value;
    if (countWords(nextValue) > MAX_FEEDBACK_WORDS) return;

    setDraft((prev) => ({ ...prev, feedbackMessage: nextValue }));
  };

  const handleUpdate = () => {
    if (wordCount > MAX_FEEDBACK_WORDS) {
      setError(`Feedback cannot exceed ${MAX_FEEDBACK_WORDS} words.`);
      return;
    }

    const now = new Date().toISOString();
    const adminEntry = {
      id: `admin-${request.id}`,
      authorName: "Admin",
      authorEmail: "",
      message: draft.feedbackMessage.trim(),
      rating: draft.feedbackRating,
      sentiment: draft.feedbackSentiment,
      createdAt: request.submittedAt || now,
      updatedAt: now,
      source: "admin",
    };

    const existingEntries = Array.isArray(request.feedbackEntries)
      ? request.feedbackEntries
      : [];
    const withoutAdmin = existingEntries.filter(
      (entry) => entry.id !== adminEntry.id,
    );

    onSave?.({
      demoScheduledBy: draft.demoScheduledBy.trim(),
      demoScheduledAt: draft.demoScheduledAt
        ? new Date(draft.demoScheduledAt).toISOString()
        : "",
      demoGivenBy: draft.demoGivenBy.trim(),
      demoGivenAt: draft.demoGivenAt
        ? new Date(draft.demoGivenAt).toISOString()
        : "",
      feedbackRating: draft.feedbackRating,
      feedbackSentiment: draft.feedbackSentiment,
      feedbackMessage: draft.feedbackMessage.trim(),
      feedbackEntries:
        draft.feedbackRating ||
        draft.feedbackSentiment ||
        draft.feedbackMessage.trim()
          ? [adminEntry, ...withoutAdmin]
          : existingEntries,
    });
  };

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-demo-update-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--single"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">{activeSection.label}</p>
            <h3 id="admin-demo-update-title">
              {request.solutionTitle || "Untitled Solution"}
            </h3>
            <p>
              Requested by <strong>{request.fullName || "—"}</strong>
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
          {mode === "schedule" && (
            <section className="admin_demo_modal__section">
              <h4>Schedule & Delivery</h4>
              <div className="admin_demo_modal__grid">
                <label className="admin_demo_modal__field">
                  <span>Demo Scheduled By</span>
                  <input
                    type="text"
                    value={draft.demoScheduledBy}
                    placeholder="Who scheduled the demo?"
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        demoScheduledBy: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="admin_demo_modal__field">
                  <span>Demo Scheduled On</span>
                  <input
                    type="datetime-local"
                    value={toDatetimeLocalValue(draft.demoScheduledAt)}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        demoScheduledAt: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="admin_demo_modal__field">
                  <span>Demo Given By</span>
                  <input
                    type="text"
                    value={draft.demoGivenBy}
                    placeholder="Who delivered the demo?"
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        demoGivenBy: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="admin_demo_modal__field">
                  <span>Demo Given On</span>
                  <input
                    type="datetime-local"
                    value={toDatetimeLocalValue(draft.demoGivenAt)}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        demoGivenAt: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
            </section>
          )}

          {mode === "feedback" && (
            <section className="admin_demo_modal__section">
              <h4>Feedback</h4>

              <div className="admin_demo_modal__feedback-block">
                <span>5 Star Rating</span>
                <StarRating
                  value={draft.feedbackRating}
                  onChange={(rating) =>
                    setDraft((prev) => ({ ...prev, feedbackRating: rating }))
                  }
                />
              </div>

              <div className="admin_demo_modal__feedback-block">
                <span>Like / Dislike</span>
                <div className="admin_request_demos__sentiment">
                  <button
                    type="button"
                    className={`admin_request_demos__sentiment-btn${
                      draft.feedbackSentiment === "like" ? " is-active" : ""
                    }`}
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        feedbackSentiment:
                          prev.feedbackSentiment === "like" ? "" : "like",
                      }))
                    }
                  >
                    👍 Like
                  </button>
                  <button
                    type="button"
                    className={`admin_request_demos__sentiment-btn${
                      draft.feedbackSentiment === "dislike" ? " is-active" : ""
                    }`}
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        feedbackSentiment:
                          prev.feedbackSentiment === "dislike" ? "" : "dislike",
                      }))
                    }
                  >
                    👎 Dislike
                  </button>
                </div>
              </div>

              <label className="admin_demo_modal__field">
                <span>Feedback Message (max {MAX_FEEDBACK_WORDS} words)</span>
                <textarea
                  rows={4}
                  value={draft.feedbackMessage}
                  placeholder="Add customer feedback..."
                  onChange={handleFeedbackChange}
                />
                <small className="admin_demo_modal__word-count">
                  {wordCount} / {MAX_FEEDBACK_WORDS} words
                </small>
              </label>
            </section>
          )}

          {mode === "timeline" && (
            <section className="admin_demo_modal__section">
              <h4>Timeline</h4>
              <div className="admin_demo_modal__timeline">
                <TimelineItem
                  title="Demo Request Received"
                  date={request.submittedAt}
                  by={request.fullName}
                  isEmpty={!request.submittedAt}
                />
                <TimelineItem
                  title="Demo Scheduled"
                  date={draft.demoScheduledAt}
                  by={draft.demoScheduledBy}
                  isEmpty={!draft.demoScheduledAt}
                />
                <TimelineItem
                  title="Demo Delivered"
                  date={draft.demoGivenAt}
                  by={draft.demoGivenBy}
                  isEmpty={!draft.demoGivenAt}
                />
              </div>
            </section>
          )}
        </div>

        {error && <p className="admin_demo_modal__error">{error}</p>}

        <footer className="admin_demo_modal__footer">
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          {!isReadOnly && (
            <button
              type="button"
              className="admin_request_demos__btn admin_request_demos__btn--primary"
              onClick={handleUpdate}
            >
              Update
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default AdminDemoUpdateModal;
