import { useMemo, useState } from "react";
import {
  addSolutionComment,
  getSolutionEngagement,
  incrementSolutionView,
  toggleSolutionLike,
} from "../../utils/solutionEngagementStorage";
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

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 20s-7-4.4-9.2-8.4C1.2 8.2 3.2 5 6.4 5c1.8 0 3.4.9 4.4 2.3C12 5.9 13.6 5 15.4 5 18.6 5 20.6 8.2 21.2 11.6 19 15.6 12 20 12 20Z"
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
  const [engagement, setEngagement] = useState(() =>
    getSolutionEngagement(solutionId),
  );
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentDraft, setCommentDraft] = useState({
    authorName: "",
    message: "",
  });

  const totals = useMemo(
    () => ({
      views: engagement.views,
      likes: engagement.likes,
      comments: engagement.comments.length,
    }),
    [engagement],
  );

  if (!solutionId) return null;

  const refresh = () => setEngagement(getSolutionEngagement(solutionId));

  const handleView = () => {
    incrementSolutionView(solutionId);
    refresh();
  };

  const handleLike = () => {
    toggleSolutionLike(solutionId);
    refresh();
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (!commentDraft.message.trim()) return;

    addSolutionComment(solutionId, {
      authorName: commentDraft.authorName.trim() || "Guest",
      message: commentDraft.message.trim(),
      sentiment: "like",
    });

    setCommentDraft({ authorName: "", message: "" });
    setShowCommentForm(false);
    refresh();
  };

  return (
    <div
      className={`solution_engagement${className ? ` ${className}` : ""}`}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="solution_engagement__stats">
        <button type="button" className="solution_engagement__stat" onClick={handleView}>
          <EyeIcon />
          <span>{totals.views}</span>
        </button>
        <button type="button" className="solution_engagement__stat" onClick={handleLike}>
          <HeartIcon />
          <span>{totals.likes}</span>
        </button>
        <button
          type="button"
          className="solution_engagement__stat"
          onClick={() => setShowCommentForm((open) => !open)}
        >
          <CommentIcon />
          <span>{totals.comments}</span>
        </button>
      </div>

      {showCommentForm && (
        <form className="solution_engagement__comment-form" onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={commentDraft.authorName}
            onChange={(event) =>
              setCommentDraft((prev) => ({ ...prev, authorName: event.target.value }))
            }
          />
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
    </div>
  );
};

export default SolutionEngagementBar;
