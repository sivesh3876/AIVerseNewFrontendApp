import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { updateDemoRequestRecord } from "../../utils/demoRequestStorage";
import AdminDemoFieldBox from "./AdminDemoFieldBox";
import AdminDemoPageShell from "./AdminDemoPageShell";
import { useAdminDemoRequests } from "./useAdminDemoRequests";
import "./AdminLayout.scss";

const StarRating = ({ value, onChange }) => (
  <div className="admin_request_demos__stars" role="group" aria-label="Rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`admin_request_demos__star${
          star <= value ? " is-active" : ""
        }`}
        onClick={() => onChange(star)}
        aria-label={`${star} star`}
      >
        ★
      </button>
    ))}
  </div>
);

const StarDisplay = ({ value }) => (
  <div className="admin_request_demos__stars" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`admin_request_demos__star-display${
          star <= value ? " is-active" : ""
        }`}
      >
        ★
      </span>
    ))}
  </div>
);

const BlankFeedbackCard = () => (
  <article className="admin_request_demos__card admin_request_demos__card--section">
    <header className="admin_request_demos__card-header">
      <div>
        <h3>No demo request yet</h3>
        <p>Feedback will appear here after a demo request is recorded.</p>
      </div>
    </header>
    <div className="admin_demo_fields">
      <AdminDemoFieldBox label="5 Star Rating" isEmpty>
        <div className="admin_demo_field__box admin_demo_field__box--stars">
          <StarDisplay value={0} />
        </div>
      </AdminDemoFieldBox>
      <AdminDemoFieldBox label="Like / Dislike" isEmpty />
      <AdminDemoFieldBox label="Feedback Message" isEmpty />
    </div>
  </article>
);

const FeedbackCard = ({ request, onUpdated }) => {
  const [draft, setDraft] = useState({
    feedbackRating: Number(request.feedbackRating) || 0,
    feedbackSentiment: request.feedbackSentiment || "",
    feedbackMessage: request.feedbackMessage || "",
  });
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setDraft({
      feedbackRating: Number(request.feedbackRating) || 0,
      feedbackSentiment: request.feedbackSentiment || "",
      feedbackMessage: request.feedbackMessage || "",
    });
  }, [request]);

  const handleSave = () => {
    const updated = updateDemoRequestRecord(request.id, draft);
    if (!updated) {
      setSaveMessage("Could not save feedback.");
      return;
    }

    onUpdated?.(updated);
    setSaveMessage("Feedback saved.");
  };

  const { feedbackRating, feedbackSentiment, feedbackMessage } = draft;

  return (
    <article className="admin_request_demos__card admin_request_demos__card--section">
      <header className="admin_request_demos__card-header">
        <div>
          <h3>{request.solutionTitle || "Untitled Solution"}</h3>
          <p>
            Requested by <strong>{request.fullName || "—"}</strong>
          </p>
        </div>
      </header>
      <div className="admin_demo_fields">
        <AdminDemoFieldBox
          label="5 Star Rating"
          isEmpty={feedbackRating === 0}
        >
          <div className="admin_demo_field__box admin_demo_field__box--stars">
            <StarRating
              value={feedbackRating}
              onChange={(rating) =>
                setDraft((prev) => ({ ...prev, feedbackRating: rating }))
              }
            />
          </div>
        </AdminDemoFieldBox>

        <AdminDemoFieldBox
          label="Like / Dislike"
          isEmpty={!feedbackSentiment}
        >
          <div className="admin_demo_field__box admin_demo_field__box--actions">
            <div className="admin_request_demos__sentiment">
              <button
                type="button"
                className={`admin_request_demos__sentiment-btn${
                  feedbackSentiment === "like" ? " is-active" : ""
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
                  feedbackSentiment === "dislike" ? " is-active" : ""
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
        </AdminDemoFieldBox>

        <AdminDemoFieldBox
          label="Feedback Message"
          isEmpty={!feedbackMessage}
        >
          <div className="admin_demo_field__box">
            <textarea
              rows={4}
              value={feedbackMessage}
              placeholder="Add customer feedback..."
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  feedbackMessage: event.target.value,
                }))
              }
            />
          </div>
        </AdminDemoFieldBox>

        <div className="admin_demo_field admin_demo_field--actions">
          <span className="admin_demo_field__label">Save Feedback</span>
          <div className="admin_demo_field__box admin_demo_field__box--actions">
            <button
              type="button"
              className="admin_request_demos__btn admin_request_demos__btn--primary"
              onClick={handleSave}
            >
              Save Feedback
            </button>
            {saveMessage && (
              <p className="admin_request_demos__save-message">{saveMessage}</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

const AdminRequestDemoFeedback = () => {
  const { requests, loading, error, loadRequests, handleRequestUpdated } =
    useAdminDemoRequests();

  return (
    <AdminDemoPageShell
      title="Feedback"
      description="Customer rating, like/dislike sentiment, and feedback notes."
      loading={loading}
      error={error}
      onRefresh={loadRequests}
    >
      {!loading && !error && requests.length === 0 && (
        <div className="admin_request_demos__empty">
          <p>No feedback yet. Demo request feedback will show here once added.</p>
          <Link
            to="/explore-solutions"
            className="admin_request_demos__empty-link"
          >
            Go to Explore Solutions
          </Link>
        </div>
      )}

      <div className="admin_request_demos__cards">
        {loading ? (
          <BlankFeedbackCard />
        ) : requests.length === 0 ? (
          <BlankFeedbackCard />
        ) : (
          requests.map((request) => (
            <FeedbackCard
              key={request.id}
              request={request}
              onUpdated={handleRequestUpdated}
            />
          ))
        )}
      </div>
    </AdminDemoPageShell>
  );
};

export default AdminRequestDemoFeedback;
