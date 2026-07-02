import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiEye, FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";
import SolutionCommentModal from "./SolutionCommentModal";
import {
  buildSolutionShareUrl,
  loadSolutionEngagement,
  recordSolutionView,
  shareSolution,
  toggleSolutionLike,
} from "../../utils/solutionEngagement";
import "./SolutionEngagement.scss";

const SolutionEngagement = ({
  solutionId,
  title,
  detailUrl,
  serviceLine,
  variant = "default",
  className = "",
  onActionClick,
  trackView = false,
}) => {
  const isHomeVariant = variant === "home";
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLikePending, setIsLikePending] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const hasTrackedViewRef = useRef(false);

  const shareUrl = useMemo(
    () => buildSolutionShareUrl({ solutionId, detailUrl, serviceLine }),
    [detailUrl, serviceLine, solutionId],
  );

  const applyEngagementState = useCallback((state) => {
    setLiked(state.liked);
    setLikeCount(state.likeCount);
    setCommentCount(state.commentCount);
    setShareCount(state.shareCount);
    setViewCount(state.viewCount);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadState = async () => {
      if (!solutionId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");
        const state = await loadSolutionEngagement(solutionId);
        if (isMounted) {
          applyEngagementState(state);
        }
      } catch (error) {
        if (isMounted && !isHomeVariant) {
          setErrorMessage(error.message || "Unable to load engagement data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadState();

    return () => {
      isMounted = false;
    };
  }, [applyEngagementState, isHomeVariant, solutionId]);

  useEffect(() => {
    hasTrackedViewRef.current = false;
  }, [solutionId]);

  useEffect(() => {
    if (!trackView || !solutionId || isLoading || hasTrackedViewRef.current) {
      return undefined;
    }

    let isMounted = true;
    hasTrackedViewRef.current = true;

    const trackViewCount = async () => {
      try {
        const state = await recordSolutionView(solutionId, title, "detail");
        if (isMounted && state) {
          applyEngagementState(state);
        }
      } catch {
        // View tracking should not block the detail page.
      }
    };

    trackViewCount();

    return () => {
      isMounted = false;
    };
  }, [applyEngagementState, isLoading, solutionId, title, trackView]);

  useEffect(() => {
    if (!shareMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => setShareMessage(""), 2400);
    return () => window.clearTimeout(timer);
  }, [shareMessage]);

  const stopCardNavigation = (event) => {
    event.stopPropagation();
    onActionClick?.(event);
  };

  const handleLike = async (event) => {
    stopCardNavigation(event);

    if (isLikePending || isLoading) {
      return;
    }

    try {
      setIsLikePending(true);
      setErrorMessage("");
      const state = await toggleSolutionLike(solutionId, title);
      applyEngagementState(state);
    } catch (error) {
      if (!isHomeVariant) {
        setErrorMessage(error.message || "Unable to update like.");
      }
    } finally {
      setIsLikePending(false);
    }
  };

  const handleCommentOpen = (event) => {
    stopCardNavigation(event);
    setIsCommentOpen(true);
  };

  const handleShare = async (event) => {
    stopCardNavigation(event);

    try {
      setErrorMessage("");
      const result = await shareSolution({ solutionId, title, shareUrl });
      setShareMessage(
        result.method === "clipboard" ? "Link copied to clipboard." : "Shared successfully.",
      );
      const state = await loadSolutionEngagement(solutionId);
      applyEngagementState(state);
    } catch (shareError) {
      if (shareError?.name !== "AbortError" && !isHomeVariant) {
        setErrorMessage(shareError.message || "Unable to share this solution.");
      }
    }
  };

  if (!solutionId) {
    return null;
  }

  const renderCount = (count) => (count > 0 ? <strong>{count}</strong> : null);

  return (
    <>
      <div
        className={`solution_engagement solution_engagement--${variant} ${className}`.trim()}
        aria-label={`Engagement actions for ${title}`}
      >
        <span
          className="solution_engagement__stat"
          aria-label={`${viewCount} views`}
          title={`${viewCount} views`}
        >
          <FiEye aria-hidden="true" />
          {!isHomeVariant && <span>Views</span>}
          <strong>{viewCount}</strong>
        </span>

        <button
          type="button"
          className={`solution_engagement__btn${liked ? " is-active" : ""}`}
          onClick={handleLike}
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          title={liked ? "Unlike" : "Like"}
          disabled={isLoading || isLikePending}
        >
          <FiHeart aria-hidden="true" />
          {!isHomeVariant && <span>{liked ? "Liked" : "Like"}</span>}
          {renderCount(likeCount)}
        </button>

        <button
          type="button"
          className="solution_engagement__btn"
          onClick={handleCommentOpen}
          aria-label="Comment"
          title="Comment"
          disabled={isLoading}
        >
          <FiMessageCircle aria-hidden="true" />
          {!isHomeVariant && <span>Comment</span>}
          {renderCount(commentCount)}
        </button>

        <button
          type="button"
          className="solution_engagement__btn"
          onClick={handleShare}
          aria-label="Share"
          title="Share"
          disabled={isLoading}
        >
          <FiShare2 aria-hidden="true" />
          {!isHomeVariant && <span>Share</span>}
          {renderCount(shareCount)}
        </button>

        {shareMessage && !isHomeVariant && (
          <p className="solution_engagement__feedback" role="status">
            {shareMessage}
          </p>
        )}

        {errorMessage && !isHomeVariant && (
          <p className="solution_engagement__feedback is-error" role="alert">
            {errorMessage}
          </p>
        )}
      </div>

      {isCommentOpen && (
        <SolutionCommentModal
          solutionId={solutionId}
          title={title}
          onClose={() => setIsCommentOpen(false)}
          onUpdated={applyEngagementState}
        />
      )}
    </>
  );
};

export default SolutionEngagement;
