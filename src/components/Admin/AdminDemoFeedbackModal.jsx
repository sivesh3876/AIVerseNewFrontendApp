import { useEffect, useMemo, useState } from "react";
import { formatDemoRequestDate } from "../../services/demoRequestService";

const MAX_FEEDBACK_WORDS = 100;

const countWords = (text = "") =>
  text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;

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

const AdminDemoFeedbackModal = ({ request, onClose, onSave }) => {
  const [draft, setDraft] = useState({
    feedbackRating: 0,
    feedbackSentiment: "",
    feedbackMessage: "",
  });
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (!request) return;

    setDraft({
      feedbackRating: Number(request.feedbackRating) || 0,
      feedbackSentiment: request.feedbackSentiment || "",
      feedbackMessage: request.feedbackMessage || "",
    });
    setError("");
    setSaveMessage("");
  }, [request]);

  const wordCount = useMemo(
    () => countWords(draft.feedbackMessage),
    [draft.feedbackMessage],
  );

  if (!request) return null;

  const entries = Array.isArray(request.feedbackEntries)
    ? request.feedbackEntries
    : [];

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
      createdAt: entries[0]?.createdAt || now,
      updatedAt: now,
      source: "admin",
    };

    const withoutAdmin = entries.filter((entry) => entry.id !== adminEntry.id);

    onSave?.({
      feedbackRating: draft.feedbackRating,
      feedbackSentiment: draft.feedbackSentiment,
      feedbackMessage: draft.feedbackMessage.trim(),
      feedbackEntries: [adminEntry, ...withoutAdmin],
    });

    setSaveMessage("Feedback updated.");
  };

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-demo-feedback-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--feedback"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">Solution Feedback</p>
            <h3 id="admin-demo-feedback-title">
              {request.solutionTitle || "Untitled Solution"}
            </h3>
            <p>
              Linked engagement for this solution and demo request.
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
            <h4>Engagement Summary</h4>
            <div className="admin_demo_feedback__metrics">
              <article>
                <span>Views</span>
                <strong>{request.viewCount || 0}</strong>
              </article>
              <article>
                <span>Likes</span>
                <strong>{request.likeCount || 0}</strong>
              </article>
              <article>
                <span>Comments</span>
                <strong>{entries.length}</strong>
              </article>
            </div>
          </section>

          <section className="admin_demo_modal__section">
            <h4>All Feedback & Comments</h4>
            {entries.length === 0 ? (
              <p className="admin_demo_feedback__empty">No feedback recorded yet.</p>
            ) : (
              <div className="admin_demo_feedback__list">
                {entries.map((entry) => (
                  <article key={entry.id} className="admin_demo_feedback__item">
                    <header>
                      <strong>{entry.authorName || "Anonymous"}</strong>
                      <span>{formatDemoRequestDate(entry.createdAt)}</span>
                    </header>
                    {entry.rating > 0 && (
                      <p className="admin_demo_feedback__rating">
                        {entry.rating} / 5 stars
                        {entry.sentiment
                          ? ` · ${entry.sentiment === "like" ? "👍 Like" : "👎 Dislike"}`
                          : ""}
                      </p>
                    )}
                    <p>{entry.message || "—"}</p>
                    {entry.updatedAt && entry.updatedAt !== entry.createdAt && (
                      <small>
                        Updated: {formatDemoRequestDate(entry.updatedAt)}
                      </small>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="admin_demo_modal__section">
            <h4>Update Feedback</h4>

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
                placeholder="Update feedback for this solution..."
                onChange={handleFeedbackChange}
              />
              <small className="admin_demo_modal__word-count">
                {wordCount} / {MAX_FEEDBACK_WORDS} words
              </small>
            </label>
          </section>
        </div>

        {error && <p className="admin_demo_modal__error">{error}</p>}
        {saveMessage && (
          <p className="admin_request_demos__save-message admin_demo_modal__save-inline">
            {saveMessage}
          </p>
        )}

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
            onClick={handleUpdate}
          >
            Update Feedback
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminDemoFeedbackModal;
