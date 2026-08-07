import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  addSolutionComment,
  getSolutionEngagement,
  getVisitorProfile,
  incrementSolutionView,
} from "../../utils/solutionEngagementStorage";
import {
  getCurrentUserReaction,
  submitSolutionReaction,
} from "../../services/solutionReactionService";
import "./SolutionEngagementBar.scss";

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M1.5 12C3.5 7.5 7.5 5 12 5s8.5 2.5 10.5 7c-2 4.5-6 7-10.5 7S3.5 16.5 1.5 12Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const HeartIcon = ({ filled = false }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 20s-7-4.4-9.2-8.4C1.2 8.2 3.2 5 6.4 5c1.8 0 3.4.9 4.4 2.3C12 5.9 13.6 5 15.4 5 18.6 5 20.6 8.2 21.2 11.6 19 15.6 12 20 12 20Z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

const DislikeIcon = ({ filled = false }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M10 15v5a2 2 0 0 0 2 2l5-6V4H7.5A2.5 2.5 0 0 0 5 6.4l-1.2 5.2A2 2 0 0 0 5.7 14H10Z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M17 4h2.5A1.5 1.5 0 0 1 21 5.5v7A1.5 1.5 0 0 1 19.5 14H17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

const CommentIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M4 5h16v11H8l-4 4V5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const SolutionEngagementBar = ({ solutionId, className = "" }) => {
  const { isAuthenticated, adminEmail, adminName } = useAdminAuth();
  const [engagement, setEngagement] = useState(() =>
    getSolutionEngagement(solutionId),
  );
  const [userReaction, setUserReaction] = useState(() =>
    getCurrentUserReaction(solutionId),
  );
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [savingAction, setSavingAction] = useState(null);
  const [toast, setToast] = useState(null);
  const [commentDraft, setCommentDraft] = useState(() => {
    const profile = getVisitorProfile();
    return {
      authorName: adminName || profile.name,
      message: "",
    };
  });

  useEffect(() => {
    setEngagement(getSolutionEngagement(solutionId));
    setUserReaction(getCurrentUserReaction(solutionId));
  }, [solutionId, isAuthenticated, adminEmail]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const totals = useMemo(
    () => ({
      views: engagement.views,
      likes: engagement.likes,
      dislikes: engagement.dislikes,
      comments: engagement.comments.length,
    }),
    [engagement],
  );

  if (!solutionId) return null;

  const refresh = () => {
    setEngagement(getSolutionEngagement(solutionId));
    setUserReaction(getCurrentUserReaction(solutionId));
  };

  const showMessage = (type, message) => setToast({ type, message });

  const handleView = () => {
    incrementSolutionView(solutionId, {
      email: adminEmail,
      name: adminName,
      userId: adminEmail || undefined,
    });
    refresh();
  };

  const handleReaction = async (action) => {
    if (!isAuthenticated) {
      showMessage("error", "Please sign in to like or dislike this solution.");
      return;
    }

    if (savingAction) return;

    try {
      setSavingAction(action);
      const result = await submitSolutionReaction({ solutionId, action });
      refresh();

      const isDuplicate =
        result.status === "already_liked" || result.status === "already_disliked";

      showMessage(isDuplicate ? "error" : "success", result.message);
    } catch (error) {
      showMessage(
        "error",
        error?.message || "Failed to save your reaction. Please try again.",
      );
    } finally {
      setSavingAction(null);
    }
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (!commentDraft.message.trim()) return;

    addSolutionComment(solutionId, {
      authorName:
        commentDraft.authorName.trim() ||
        adminName ||
        adminEmail ||
        "Guest",
      authorEmail: adminEmail || "",
      message: commentDraft.message.trim(),
      sentiment: userReaction || "like",
    });

    setCommentDraft((prev) => ({ ...prev, message: "" }));
    setShowCommentForm(false);
    refresh();
    showMessage("success", "Comment posted successfully.");
  };

  return (
    <div
      className={`solution_engagement${className ? ` ${className}` : ""}`}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="solution_engagement__stats">
        <button
          type="button"
          className="solution_engagement__stat"
          onClick={handleView}
          title="View this solution"
          aria-label={`Views: ${totals.views}`}
        >
          <EyeIcon />
          <span>{totals.views}</span>
        </button>
        <button
          type="button"
          className={`solution_engagement__stat${
            userReaction === "like" ? " is-liked" : ""
          }`}
          onClick={() => handleReaction("like")}
          disabled={Boolean(savingAction)}
          title={
            isAuthenticated
              ? "Like this solution"
              : "Sign in to like this solution"
          }
          aria-pressed={userReaction === "like"}
          aria-label={`Likes: ${totals.likes}`}
        >
          <HeartIcon filled={userReaction === "like"} />
          <span>{totals.likes}</span>
        </button>
        <button
          type="button"
          className={`solution_engagement__stat${
            userReaction === "dislike" ? " is-disliked" : ""
          }`}
          onClick={() => handleReaction("dislike")}
          disabled={Boolean(savingAction)}
          title={
            isAuthenticated
              ? "Dislike this solution"
              : "Sign in to dislike this solution"
          }
          aria-pressed={userReaction === "dislike"}
          aria-label={`Dislikes: ${totals.dislikes}`}
        >
          <DislikeIcon filled={userReaction === "dislike"} />
          <span>{totals.dislikes}</span>
        </button>
        <button
          type="button"
          className="solution_engagement__stat"
          onClick={() => setShowCommentForm((open) => !open)}
          aria-label={`Comments: ${totals.comments}`}
        >
          <CommentIcon />
          <span>{totals.comments}</span>
        </button>
      </div>

      {!isAuthenticated && (
        <div className="solution_engagement__auth-hint">
          <p>
            <Link to="/admin/login">Sign in</Link> to like or dislike.
          </p>
          <p>Your account is used automatically — no name entry needed.</p>
        </div>
      )}

      {showCommentForm && (
        <form className="solution_engagement__comment-form" onSubmit={handleCommentSubmit}>
          {!isAuthenticated && (
            <input
              type="text"
              placeholder="Your name"
              value={commentDraft.authorName}
              onChange={(event) =>
                setCommentDraft((prev) => ({
                  ...prev,
                  authorName: event.target.value,
                }))
              }
            />
          )}
          <textarea
            rows={2}
            placeholder="Add a comment..."
            value={commentDraft.message}
            onChange={(event) =>
              setCommentDraft((prev) => ({ ...prev, message: event.target.value }))
            }
          />
          <button type="submit">Post Comment</button>
        </form>
      )}

      {toast && (
        <div
          className={`solution_engagement__toast solution_engagement__toast--${toast.type}`}
          role="status"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default SolutionEngagementBar;
