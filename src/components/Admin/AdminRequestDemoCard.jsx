import { useEffect, useState } from "react";
import {
  DEMO_REQUEST_STATUSES,
  incrementDemoRequestViewCount,
  updateDemoRequestRecord,
} from "../../utils/demoRequestStorage";
import { formatDemoRequestDate } from "../../services/demoRequestService";

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

const StarRating = ({ value, onChange, disabled = false }) => (
  <div className="admin_request_demos__stars" role="group" aria-label="Rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`admin_request_demos__star${
          star <= value ? " is-active" : ""
        }`}
        onClick={() => onChange(star)}
        disabled={disabled}
        aria-label={`${star} star`}
      >
        ★
      </button>
    ))}
  </div>
);

const AdminRequestDemoCard = ({ request, onUpdated }) => {
  const [draft, setDraft] = useState(request);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setDraft(request);
  }, [request]);

  const handleView = () => {
    const updated = incrementDemoRequestViewCount(request.id);
    if (updated) {
      setDraft(updated);
      onUpdated?.(updated);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");

    const updated = updateDemoRequestRecord(request.id, {
      status: draft.status,
      demoGivenBy: draft.demoGivenBy,
      demoGivenAt: draft.demoGivenAt
        ? new Date(draft.demoGivenAt).toISOString()
        : "",
      feedbackRating: draft.feedbackRating,
      feedbackMessage: draft.feedbackMessage,
      feedbackSentiment: draft.feedbackSentiment,
    });

    setIsSaving(false);

    if (!updated) {
      setSaveMessage("Could not save changes.");
      return;
    }

    setDraft(updated);
    onUpdated?.(updated);
    setSaveMessage("Saved successfully.");
  };

  return (
    <article className="admin_request_demos__card">
      <header className="admin_request_demos__card-header">
        <div>
          <h3>{draft.solutionTitle || "Untitled Solution"}</h3>
          <p>
            Requested by <strong>{draft.fullName || "—"}</strong> on{" "}
            {formatDemoRequestDate(draft.submittedAt)}
          </p>
        </div>
        <div className="admin_request_demos__card-badges">
          <span
            className={`admin_request_demos__status admin_request_demos__status--${draft.status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {draft.status}
          </span>
          <span className="admin_request_demos__views">
            {draft.viewCount} view{draft.viewCount === 1 ? "" : "s"}
          </span>
        </div>
      </header>

      <div className="admin_request_demos__sections">
        <section className="admin_request_demos__section">
          <h4>1. Solution Details</h4>
          <dl>
            <div>
              <dt>Solution Name</dt>
              <dd>{draft.solutionTitle || "—"}</dd>
            </div>
            <div>
              <dt>COE (Solution Owner)</dt>
              <dd>{draft.coeName || "—"}</dd>
            </div>
            <div>
              <dt>AI Evangelist(s)</dt>
              <dd>
                {draft.evangelistNames?.length
                  ? draft.evangelistNames.join(", ")
                  : "—"}
              </dd>
            </div>
            <div>
              <dt>Demo Request Date & Time</dt>
              <dd>{formatDemoRequestDate(draft.submittedAt)}</dd>
            </div>
            <div>
              <dt>Requester Email</dt>
              <dd>{draft.email || "—"}</dd>
            </div>
            <div>
              <dt>Company / Phone</dt>
              <dd>
                {[draft.company, draft.phone].filter(Boolean).join(" · ") || "—"}
              </dd>
            </div>
            <div>
              <dt>Request Message</dt>
              <dd>{draft.message || "—"}</dd>
            </div>
            <div>
              <dt>Demo Given By</dt>
              <dd>
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
              </dd>
            </div>
            <div>
              <dt>Demo Given On</dt>
              <dd>
                {draft.demoGivenAt
                  ? formatDemoRequestDate(draft.demoGivenAt)
                  : "—"}
              </dd>
            </div>
            <div>
              <dt>Set Demo Date & Time</dt>
              <dd>
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
              </dd>
            </div>
          </dl>
        </section>

        <section className="admin_request_demos__section">
          <h4>2. Feedback</h4>
          <div className="admin_request_demos__feedback-block">
            <span className="admin_request_demos__label">5 Star Rating</span>
            <StarRating
              value={draft.feedbackRating}
              onChange={(rating) =>
                setDraft((prev) => ({ ...prev, feedbackRating: rating }))
              }
            />
          </div>

          <div className="admin_request_demos__feedback-block">
            <span className="admin_request_demos__label">Like / Dislike</span>
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

          <label className="admin_request_demos__feedback-block">
            <span className="admin_request_demos__label">Feedback Message</span>
            <textarea
              rows={4}
              value={draft.feedbackMessage}
              placeholder="Customer feedback notes..."
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  feedbackMessage: event.target.value,
                }))
              }
            />
          </label>
        </section>

        <section className="admin_request_demos__section">
          <h4>3. Actions</h4>
          <label className="admin_request_demos__field">
            <span>Status</span>
            <select
              value={draft.status}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, status: event.target.value }))
              }
            >
              {DEMO_REQUEST_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
              {draft.status === "Pending" && (
                <option value="Pending">Pending</option>
              )}
            </select>
          </label>

          <div className="admin_request_demos__action-metrics">
            <div>
              <span>Views</span>
              <strong>{draft.viewCount}</strong>
            </div>
            <div>
              <span>Last Updated</span>
              <strong>
                {draft.updatedAt
                  ? formatDemoRequestDate(draft.updatedAt)
                  : "—"}
              </strong>
            </div>
          </div>

          <div className="admin_request_demos__action-buttons">
            <button
              type="button"
              className="admin_request_demos__btn admin_request_demos__btn--secondary"
              onClick={handleView}
            >
              Record View
            </button>
            <button
              type="button"
              className="admin_request_demos__btn admin_request_demos__btn--primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Updating…" : "Update Status"}
            </button>
          </div>

          {saveMessage && (
            <p className="admin_request_demos__save-message">{saveMessage}</p>
          )}
        </section>
      </div>
    </article>
  );
};

export default AdminRequestDemoCard;
