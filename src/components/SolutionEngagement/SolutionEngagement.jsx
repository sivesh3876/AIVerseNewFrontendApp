import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { FiEye, FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";
import SolutionCommentModal from "./SolutionCommentModal";
import SolutionCommentsInline from "./SolutionCommentsInline";
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
  commentUi = "modal",
  className = "",
  onActionClick,
  trackView = false,
  overlayRootRef = null,
  overlayRoot = null,
  commentOpen: controlledCommentOpen,
  onCommentOpenChange,
}) => {
  const isHomeVariant = variant === "home";
  const isInlineComments = commentUi === "inline";
  const isCardOverlayComments = commentUi === "card-overlay";
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLikePending, setIsLikePending] = useState(false);
  const [internalCommentOpen, setInternalCommentOpen] = useState(false);
  const isCommentControlled = controlledCommentOpen !== undefined;
  const isCommentOpen = isCommentControlled
    ? controlledCommentOpen
    : internalCommentOpen;

  const setCommentOpen = useCallback(
    (next) => {
      if (isCommentControlled) {
        onCommentOpenChange?.(next);
      } else {
        setInternalCommentOpen(next);
      }
    },
    [isCommentControlled, onCommentOpenChange],
  );
  const [shareMessage, setShareMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [portalRoot, setPortalRoot] = useState(null);
  const hasTrackedViewRef = useRef(false);
  const likeRequestIdRef = useRef(0);
  const isLikePendingRef = useRef(false);

  useLayoutEffect(() => {
    if (!isCardOverlayComments) {
      setPortalRoot(null);
      return;
    }

    const root = overlayRoot ?? overlayRootRef?.current ?? null;
    setPortalRoot((previous) => (previous === root ? previous : root));
  }, [isCardOverlayComments, isCommentOpen, overlayRoot, overlayRootRef]);

  const shareUrl = useMemo(
    () => buildSolutionShareUrl({ solutionId, detailUrl, serviceLine }),
    [detailUrl, serviceLine, solutionId],
  );

  const applyEngagementState = useCallback((state, { preserveLike = false } = {}) => {
    if (!preserveLike) {
      setLiked(state.liked);
      setLikeCount(state.likeCount);
    }
    setCommentCount(state.commentCount);
    setShareCount(state.shareCount);
    setViewCount(state.viewCount);
  }, []);

  useEffect(() => {
    let isMounted = true;
    likeRequestIdRef.current += 1;
    isLikePendingRef.current = false;
    setIsLikePending(false);

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
          applyEngagementState(state, {
            preserveLike: isLikePendingRef.current,
          });
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
          applyEngagementState(state, {
            preserveLike: isLikePendingRef.current,
          });
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
    if (!shareMessage && !errorMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShareMessage("");
      setErrorMessage("");
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [shareMessage, errorMessage]);

  const stopCardNavigation = (event) => {
    event.stopPropagation();
    onActionClick?.(event);
  };

  const handleLike = async (event) => {
    stopCardNavigation(event);

    if (isLikePendingRef.current || isLoading || !solutionId) {
      return;
    }

    const previousLiked = liked;
    const previousCount = likeCount;
    const nextLiked = !liked;
    const nextCount = Math.max(0, likeCount + (nextLiked ? 1 : -1));
    const requestId = likeRequestIdRef.current + 1;
    likeRequestIdRef.current = requestId;

    isLikePendingRef.current = true;
    setIsLikePending(true);
    setLiked(nextLiked);
    setLikeCount(nextCount);
    setErrorMessage("");

    try {
      const state = await toggleSolutionLike(solutionId, title);
      if (likeRequestIdRef.current !== requestId) {
        return;
      }
      applyEngagementState(state);
    } catch (error) {
      if (likeRequestIdRef.current !== requestId) {
        return;
      }
      setLiked(previousLiked);
      setLikeCount(previousCount);
      setErrorMessage(error.message || "Unable to update like.");
    } finally {
      if (likeRequestIdRef.current === requestId) {
        isLikePendingRef.current = false;
        setIsLikePending(false);
      }
    }
  };

  const handleCommentOpen = (event) => {
    stopCardNavigation(event);
    if (isInlineComments || isCardOverlayComments) {
      setCommentOpen(!isCommentOpen);
      return;
    }
    setCommentOpen(true);
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
      if (shareError?.name === "AbortError") {
        return;
      }
      setErrorMessage(shareError.message || "Unable to share this solution.");
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
          className={`solution_engagement__btn solution_engagement__btn--like${liked ? " is-active" : ""}${isLikePending ? " is-pending" : ""}`}
          onClick={handleLike}
          aria-pressed={liked}
          aria-busy={isLikePending}
          aria-label={liked ? "Unlike" : "Like"}
          title={liked ? "Unlike" : "Like"}
          disabled={isLoading}
        >
          <FiHeart aria-hidden="true" />
          {!isHomeVariant && <span>{liked ? "Liked" : "Like"}</span>}
          {renderCount(likeCount)}
        </button>

        <button
          type="button"
          className={`solution_engagement__btn${
            (isInlineComments || isCardOverlayComments) && isCommentOpen
              ? " is-active"
              : ""
          }`}
          onClick={handleCommentOpen}
          aria-label="Comment"
          aria-expanded={
            isInlineComments || isCardOverlayComments ? isCommentOpen : undefined
          }
          title="Comment"
          disabled={isLoading}
        >
          <FiMessageCircle aria-hidden="true" />
          {!isHomeVariant && <span>Comment</span>}
          {renderCount(commentCount)}
        </button>

        <button
          type="button"
          className="solution_engagement__btn solution_engagement__btn--share"
          onClick={handleShare}
          aria-label="Share"
          title="Share"
        >
          <FiShare2 aria-hidden="true" />
          {!isHomeVariant && <span>Share</span>}
          {renderCount(shareCount)}
        </button>

        {shareMessage ? (
          <p className="solution_engagement__feedback" role="status">
            {shareMessage}
          </p>
        ) : null}

        {errorMessage ? (
          <p className="solution_engagement__feedback is-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>

      {isCommentOpen && isInlineComments && (
        <SolutionCommentsInline
          solutionId={solutionId}
          title={title}
          onClose={() => setCommentOpen(false)}
          onUpdated={(state) =>
            applyEngagementState(state, {
              preserveLike: isLikePendingRef.current,
            })
          }
        />
      )}

      {isCommentOpen &&
        isCardOverlayComments &&
        portalRoot &&
        createPortal(
          <div className="ai_capabilities__card-overlay ai_capabilities__card-overlay--comments">
            <SolutionCommentsInline
              solutionId={solutionId}
              title={title}
              variant="overlay"
              onClose={() => setCommentOpen(false)}
              onUpdated={(state) =>
                applyEngagementState(state, {
                  preserveLike: isLikePendingRef.current,
                })
              }
            />
          </div>,
          portalRoot,
        )}

      {isCommentOpen && !isInlineComments && !isCardOverlayComments && (
        <SolutionCommentModal
          solutionId={solutionId}
          title={title}
          onClose={() => setCommentOpen(false)}
          onUpdated={(state) =>
            applyEngagementState(state, {
              preserveLike: isLikePendingRef.current,
            })
          }
        />
      )}
    </>
  );
};

export default SolutionEngagement;
