import { useEffect, useState } from "react";
import {
  fetchAuthenticatedUser,
  getLoginUrl,
} from "../../services/authUserService";
import {
  addSolutionComment,
  getSolutionComments,
} from "../../utils/solutionEngagement";
import "./SolutionEngagement.scss";

const formatCommentDate = (value) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "";
  }
};

const getInitials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";

const CommentComposer = ({
  user,
  placeholder,
  submitLabel,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [text, setText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim()) {
      return;
    }

    await onSubmit(text.trim());
    setText("");
  };

  return (
    <form className="solution_comment_modal__composer" onSubmit={handleSubmit}>
      <div className="solution_comment_modal__composer-head">
        <span className="solution_comment_modal__avatar" aria-hidden="true">
          {getInitials(user?.name)}
        </span>
        <div className="solution_comment_modal__composer-meta">
          <strong>{user?.name}</strong>
          {user?.email && <span>{user.email}</span>}
        </div>
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={3}
        placeholder={placeholder}
        required
        disabled={isSubmitting}
        autoFocus
      />

      <div className="solution_comment_modal__composer-actions">
        {onCancel && (
          <button
            type="button"
            className="solution_comment_modal__secondary-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button type="submit" disabled={isSubmitting || !text.trim()}>
          {isSubmitting ? "Posting..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

const CommentItem = ({
  comment,
  depth = 0,
  user,
  replyTargetId,
  onReplyClick,
  onCancelReply,
  onSubmitReply,
  isSubmitting,
}) => {
  const isReplyOpen = replyTargetId === comment.id;

  return (
    <article
      className={`solution_comment_modal__item${depth > 0 ? " is-reply" : ""}`}
    >
      <div className="solution_comment_modal__item-head">
        <div className="solution_comment_modal__item-author">
          <span className="solution_comment_modal__avatar" aria-hidden="true">
            {getInitials(comment.author)}
          </span>
          <div>
            <strong>{comment.author}</strong>
            {comment.authorEmail && <span>{comment.authorEmail}</span>}
          </div>
        </div>
        <time dateTime={comment.createdAt}>
          {formatCommentDate(comment.createdAt)}
        </time>
      </div>

      <p>{comment.text}</p>

      {user && (
        <button
          type="button"
          className="solution_comment_modal__reply-btn"
          onClick={() => onReplyClick(comment.id)}
        >
          Reply
        </button>
      )}

      {isReplyOpen && user && (
        <CommentComposer
          user={user}
          placeholder={`Reply to ${comment.author}`}
          submitLabel="Post Reply"
          onSubmit={(text) => onSubmitReply(comment.id, text)}
          onCancel={onCancelReply}
          isSubmitting={isSubmitting}
        />
      )}

      {comment.replies?.length > 0 && (
        <div className="solution_comment_modal__replies">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              user={user}
              replyTargetId={replyTargetId}
              onReplyClick={onReplyClick}
              onCancelReply={onCancelReply}
              onSubmitReply={onSubmitReply}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}
    </article>
  );
};

const SolutionCommentModal = ({ solutionId, title, onClose, onUpdated }) => {
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [replyTargetId, setReplyTargetId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [nextComments, authUser] = await Promise.all([
          getSolutionComments(solutionId),
          fetchAuthenticatedUser(),
        ]);

        if (isMounted) {
          setComments(nextComments);
          setUser(authUser);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Unable to load comments.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [solutionId]);

  const handleSubmitComment = async (text, parentCommentId = null) => {
    if (!user) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const state = await addSolutionComment(solutionId, title, {
        author: user.name,
        authorEmail: user.email,
        text,
        parentCommentId,
      });
      setComments(state.comments);
      setIsComposeOpen(false);
      setReplyTargetId(null);
      onUpdated?.(state);
    } catch (submitError) {
      setError(submitError.message || "Unable to save comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentCommentId, text) => {
    await handleSubmitComment(text, parentCommentId);
  };

  return (
    <div
      className="solution_comment_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="solution-comment-title"
      onClick={onClose}
    >
      <div
        className="solution_comment_modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="solution_comment_modal__header">
          <div>
            <h3 id="solution-comment-title">Comments</h3>
            <p>{title}</p>
          </div>
          <button
            type="button"
            className="solution_comment_modal__close"
            onClick={onClose}
            aria-label="Close comments"
          >
            &times;
          </button>
        </div>

        <div className="solution_comment_modal__list">
          {isLoading ? (
            <p className="solution_comment_modal__empty">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="solution_comment_modal__empty">
              No comments yet. Be the first to share feedback.
            </p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                user={user}
                replyTargetId={replyTargetId}
                onReplyClick={(commentId) => {
                  setIsComposeOpen(false);
                  setReplyTargetId(commentId);
                }}
                onCancelReply={() => setReplyTargetId(null)}
                onSubmitReply={handleSubmitReply}
                isSubmitting={isSubmitting}
              />
            ))
          )}
        </div>

        {error && <p className="solution_comment_modal__error">{error}</p>}

        <div className="solution_comment_modal__footer">
          {!user ? (
            <div className="solution_comment_modal__signin">
              <p>Sign in with your Espire account to comment or reply.</p>
              <a className="solution_comment_modal__signin-btn" href={getLoginUrl()}>
                Sign in
              </a>
            </div>
          ) : !isComposeOpen && !replyTargetId ? (
            <button
              type="button"
              className="solution_comment_modal__add-trigger"
              onClick={() => setIsComposeOpen(true)}
            >
              <span className="solution_comment_modal__avatar" aria-hidden="true">
                {getInitials(user.name)}
              </span>
              <span>Add a comment...</span>
            </button>
          ) : null}

          {user && isComposeOpen && !replyTargetId && (
            <CommentComposer
              user={user}
              placeholder="Share feedback or questions about this solution"
              submitLabel="Post Comment"
              onSubmit={(text) => handleSubmitComment(text)}
              onCancel={() => setIsComposeOpen(false)}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SolutionCommentModal;
