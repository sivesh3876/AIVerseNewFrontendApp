import { useEffect, useState } from "react";
import { FiChevronUp, FiSend } from "react-icons/fi";
import {
  fetchAuthenticatedUser,
  getLoginUrl,
} from "../../services/authUserService";
import {
  addSolutionComment,
  getSolutionComments,
} from "../../utils/solutionEngagement";

const getInitials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";

const formatRelativeTime = (value) => {
  try {
    const date = new Date(value);
    const diffMs = Date.now() - date.getTime();
    if (Number.isNaN(diffMs)) {
      return "";
    }

    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) {
      return "just now";
    }
    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days}d ago`;
    }

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(date);
  } catch {
    return "";
  }
};

const InlineComposer = ({
  placeholder,
  onSubmit,
  isSubmitting,
  autoFocus = false,
}) => {
  const [text, setText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!text.trim() || isSubmitting) {
      return;
    }

    await onSubmit(text.trim());
    setText("");
  };

  return (
    <form className="solution_comments_inline__composer" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        placeholder={placeholder}
        disabled={isSubmitting}
        autoFocus={autoFocus}
        aria-label={placeholder}
      />
      <button
        type="submit"
        className="solution_comments_inline__send"
        disabled={isSubmitting || !text.trim()}
        aria-label="Send comment"
        onClick={(event) => event.stopPropagation()}
      >
        <FiSend aria-hidden="true" />
      </button>
    </form>
  );
};

const InlineCommentItem = ({
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
      className={`solution_comments_inline__item${depth > 0 ? " is-reply" : ""}`}
    >
      <span className="solution_comments_inline__avatar" aria-hidden="true">
        {getInitials(comment.author)}
      </span>
      <div className="solution_comments_inline__item-body">
        <div className="solution_comments_inline__item-meta">
          <strong>{comment.author}</strong>
          <time dateTime={comment.createdAt}>
            {formatRelativeTime(comment.createdAt)}
          </time>
        </div>
        <p>{comment.text}</p>

        {user && (
          <button
            type="button"
            className="solution_comments_inline__reply"
            onClick={(event) => {
              event.stopPropagation();
              onReplyClick(comment.id);
            }}
          >
            Reply
          </button>
        )}

        {isReplyOpen && user && (
          <div className="solution_comments_inline__reply-box">
            <InlineComposer
              placeholder={`Reply to ${comment.author}`}
              onSubmit={(text) => onSubmitReply(comment.id, text)}
              isSubmitting={isSubmitting}
              autoFocus
            />
            <button
              type="button"
              className="solution_comments_inline__cancel"
              onClick={(event) => {
                event.stopPropagation();
                onCancelReply();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        )}

        {comment.replies?.length > 0 && (
          <div className="solution_comments_inline__replies">
            {comment.replies.map((reply) => (
              <InlineCommentItem
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
      </div>
    </article>
  );
};

const SolutionCommentsInline = ({
  solutionId,
  title,
  onClose,
  onUpdated,
}) => {
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
      setReplyTargetId(null);
      onUpdated?.(state);
    } catch (submitError) {
      setError(submitError.message || "Unable to save comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const commentCount = comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);

  return (
    <div
      className="solution_comments_inline"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <div className="solution_comments_inline__header">
        <h4>Comments ({commentCount})</h4>
        <button
          type="button"
          className="solution_comments_inline__collapse"
          onClick={onClose}
          aria-label="Collapse comments"
        >
          <FiChevronUp aria-hidden="true" />
        </button>
      </div>

      <div className="solution_comments_inline__list">
        {isLoading ? (
          <p className="solution_comments_inline__empty">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="solution_comments_inline__empty">
            No comments yet. Be the first to share feedback.
          </p>
        ) : (
          comments.map((comment) => (
            <InlineCommentItem
              key={comment.id}
              comment={comment}
              user={user}
              replyTargetId={replyTargetId}
              onReplyClick={(commentId) => setReplyTargetId(commentId)}
              onCancelReply={() => setReplyTargetId(null)}
              onSubmitReply={(parentCommentId, text) =>
                handleSubmitComment(text, parentCommentId)
              }
              isSubmitting={isSubmitting}
            />
          ))
        )}
      </div>

      {error && <p className="solution_comments_inline__error">{error}</p>}

      <div className="solution_comments_inline__footer">
        {!user ? (
          <div className="solution_comments_inline__signin">
            <p>Sign in to comment</p>
            <a
              className="solution_comments_inline__signin-btn"
              href={getLoginUrl()}
              onClick={(event) => event.stopPropagation()}
            >
              Sign in
            </a>
          </div>
        ) : (
          <InlineComposer
            placeholder="Write a comment..."
            onSubmit={(text) => handleSubmitComment(text)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default SolutionCommentsInline;
