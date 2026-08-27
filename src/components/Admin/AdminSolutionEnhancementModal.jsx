import { useEffect, useState } from "react";
import {
  loadSolutionEngagement,
  mapApiCommentsToStorage,
  persistApiCommentsToAdminStore,
} from "../../utils/solutionEngagement";
import { getSolutionEngagement } from "../../utils/solutionEngagementStorage";
import { getSolutionStatusLabel } from "../../utils/adminSolutionTableUtils";

const formatCell = (value) => value || "—";

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

const DislikeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M10 15v5a2 2 0 0 0 2 2l5-6V4H7.5A2.5 2.5 0 0 0 5 6.4l-1.2 5.2A2 2 0 0 0 5.7 14H10Z"
      fill="none"
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

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 3l1.4 5.2L18.5 9.5 13.4 11.3 12 16.5 10.6 11.3 5.5 9.5l5.1-1.3L12 3Z"
      fill="currentColor"
    />
  </svg>
);

const EmptyState = ({ title, description, icon }) => (
  <div className="admin_solution_enhancement_modal__empty">
    <div className="admin_solution_enhancement_modal__empty-visual">
      <span className="admin_solution_enhancement_modal__sparkle admin_solution_enhancement_modal__sparkle--one">
        <SparkleIcon />
      </span>
      <span className="admin_solution_enhancement_modal__empty-icon">{icon}</span>
      <span className="admin_solution_enhancement_modal__sparkle admin_solution_enhancement_modal__sparkle--two">
        <SparkleIcon />
      </span>
    </div>
    <strong>{title}</strong>
    <p>{description}</p>
  </div>
);

const PeopleList = ({ people, dateKey, emptyTitle, emptyDescription, emptyIcon }) => {
  if (!people.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
      />
    );
  }

  return (
    <ul className="admin_solution_enhancement_modal__comments">
      {people.map((person) => (
        <li key={person.id || person.userId || person.email}>
          <div className="admin_solution_enhancement_modal__comment-avatar">
            {(person.name || person.email || "U").charAt(0).toUpperCase()}
          </div>
          <div className="admin_solution_enhancement_modal__comment-body">
            <div className="admin_solution_enhancement_modal__comment-meta">
              <strong>{formatCell(person.name || "User")}</strong>
              <span>{formatDateTime(person[dateKey])}</span>
            </div>
            <p className="admin_solution_enhancement_modal__person-email">
              {person.email ? person.email : "No email on record"}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

const mergeCommentsById = (apiComments, localComments) => {
  const byId = new Map();

  [...(localComments || []), ...(apiComments || [])].forEach((comment) => {
    if (!comment?.id) return;
    byId.set(String(comment.id), comment);
  });

  return [...byId.values()].sort(
    (left, right) =>
      new Date(right.createdAt || 0).getTime() -
      new Date(left.createdAt || 0).getTime(),
  );
};

const resolveEngagementSolutionKey = (solution) => {
  if (!solution) return "";
  const id = solution.ID ?? solution.id;
  if (id == null || id === "") return "";
  const raw = String(id).trim();
  if (/^api-/i.test(raw)) return raw;
  if (/^\d+$/.test(raw)) return `api-${raw}`;
  return raw;
};

const AdminSolutionEnhancementModal = ({ solution, onClose }) => {
  const localEngagement = solution
    ? getSolutionEngagement(solution.ID)
    : null;

  const [comments, setComments] = useState(localEngagement?.comments || []);
  const [apiCounts, setApiCounts] = useState(null);
  const [isLoadingComments, setIsLoadingComments] = useState(Boolean(solution));

  useEffect(() => {
    if (!solution) {
      return undefined;
    }

    let isMounted = true;
    const local = getSolutionEngagement(solution.ID);
    setComments(local.comments || []);
    setApiCounts(null);
    setIsLoadingComments(true);

    const hydrateFromApi = async () => {
      try {
        const solutionKey = resolveEngagementSolutionKey(solution);
        const apiState = await loadSolutionEngagement(solutionKey);
        if (!isMounted) return;

        const apiComments = mapApiCommentsToStorage(apiState.comments);
        const merged = mergeCommentsById(apiComments, local.comments || []);
        setComments(merged);
        setApiCounts({
          views: Number(apiState.viewCount) || 0,
          likes: Number(apiState.likeCount) || 0,
          comments: Math.max(
            Number(apiState.commentCount) || 0,
            merged.length,
          ),
        });

        if (apiComments.length) {
          persistApiCommentsToAdminStore(solution.ID, apiState.comments);
        }
      } catch {
        // Keep local engagement when API is unavailable.
      } finally {
        if (isMounted) {
          setIsLoadingComments(false);
        }
      }
    };

    hydrateFromApi();

    return () => {
      isMounted = false;
    };
  }, [solution]);

  if (!solution) return null;

  const engagement = getSolutionEngagement(solution.ID);
  const likedBy = engagement.likedBy || [];
  const dislikedBy = engagement.dislikedBy || [];
  const viewers = engagement.viewers || [];
  const viewCount = apiCounts?.views ?? engagement.views;
  const likeCount = apiCounts?.likes ?? engagement.likes;
  const dislikeCount = engagement.dislikes;
  const commentCount = apiCounts?.comments ?? comments.length;
  const statusLabel = getSolutionStatusLabel(solution);
  const isActive = statusLabel === "Active";
  const knownLikersLabel =
    likeCount > likedBy.length
      ? `${likedBy.length} known signed-in user${likedBy.length === 1 ? "" : "s"}`
      : `${likedBy.length} user${likedBy.length === 1 ? "" : "s"}`;
  const knownViewersLabel =
    viewCount > viewers.length
      ? `${viewers.length} known viewer${viewers.length === 1 ? "" : "s"} on record`
      : `${viewers.length} unique viewer${viewers.length === 1 ? "" : "s"}`;

  return (
    <div
      className="admin_demo_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-solution-enhancement-title"
      onClick={onClose}
    >
      <div
        className="admin_solution_enhancement_modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_solution_enhancement_modal__header">
          <div>
            <p className="admin_solution_enhancement_modal__eyebrow">
              Card Engagement
            </p>
            <h3 id="admin-solution-enhancement-title">
              {solution.Title || "Untitled Solution"}
            </h3>
            <div className="admin_solution_enhancement_modal__meta">
              <span>
                Domain{" "}
                <strong className="admin_solution_enhancement_modal__domain">
                  {formatCell(solution.BusinessDomain)}
                </strong>
              </span>
              <span
                className={`admin_solution_enhancement_modal__status${
                  isActive ? " is-active" : " is-inactive"
                }`}
              >
                {statusLabel}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="admin_solution_enhancement_modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </header>

        <div className="admin_solution_enhancement_modal__body">
          <section className="admin_solution_enhancement_modal__section">
            <div className="admin_solution_enhancement_modal__section-head">
              <span className="admin_solution_enhancement_modal__section-icon">
                <CommentIcon />
              </span>
              <div>
                <h4>Card Engagement</h4>
                <p>Authenticated likes and dislikes from signed-in users</p>
              </div>
            </div>

            <div className="admin_solution_enhancement_modal__stats admin_solution_enhancement_modal__stats--four">
              <article className="admin_solution_enhancement_modal__stat admin_solution_enhancement_modal__stat--views">
                <span className="admin_solution_enhancement_modal__stat-icon">
                  <EyeIcon />
                </span>
                <div>
                  <span>Views</span>
                  <strong>{viewCount}</strong>
                  <em>Unique viewers</em>
                </div>
              </article>

              <article className="admin_solution_enhancement_modal__stat admin_solution_enhancement_modal__stat--likes">
                <span className="admin_solution_enhancement_modal__stat-icon">
                  <HeartIcon />
                </span>
                <div>
                  <span>Likes</span>
                  <strong>{likeCount}</strong>
                  <em>Total likes</em>
                </div>
              </article>

              <article className="admin_solution_enhancement_modal__stat admin_solution_enhancement_modal__stat--dislikes">
                <span className="admin_solution_enhancement_modal__stat-icon">
                  <DislikeIcon />
                </span>
                <div>
                  <span>Dislikes</span>
                  <strong>{dislikeCount}</strong>
                  <em>Total dislikes</em>
                </div>
              </article>

              <article className="admin_solution_enhancement_modal__stat admin_solution_enhancement_modal__stat--comments">
                <span className="admin_solution_enhancement_modal__stat-icon">
                  <CommentIcon />
                </span>
                <div>
                  <span>Comments</span>
                  <strong>{commentCount}</strong>
                  <em>Total comments</em>
                </div>
              </article>
            </div>
          </section>

          <section className="admin_solution_enhancement_modal__section">
            <div className="admin_solution_enhancement_modal__section-head">
              <span className="admin_solution_enhancement_modal__section-icon admin_solution_enhancement_modal__section-icon--likes">
                <HeartIcon />
              </span>
              <div>
                <h4>Who liked</h4>
                <p>{knownLikersLabel}</p>
              </div>
            </div>
            <PeopleList
              people={likedBy}
              dateKey="likedAt"
              emptyTitle="No likes yet"
              emptyDescription="Signed-in users who like this solution will appear here with their name."
              emptyIcon={<HeartIcon />}
            />
          </section>

          <section className="admin_solution_enhancement_modal__section">
            <div className="admin_solution_enhancement_modal__section-head">
              <span className="admin_solution_enhancement_modal__section-icon admin_solution_enhancement_modal__section-icon--dislikes">
                <DislikeIcon />
              </span>
              <div>
                <h4>Who disliked</h4>
                <p>
                  {dislikedBy.length} user{dislikedBy.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <PeopleList
              people={dislikedBy}
              dateKey="dislikedAt"
              emptyTitle="No dislikes yet"
              emptyDescription="Signed-in users who dislike this solution will appear here with their name."
              emptyIcon={<DislikeIcon />}
            />
          </section>

          <section className="admin_solution_enhancement_modal__section">
            <div className="admin_solution_enhancement_modal__section-head">
              <span className="admin_solution_enhancement_modal__section-icon admin_solution_enhancement_modal__section-icon--views">
                <EyeIcon />
              </span>
              <div>
                <h4>Who viewed</h4>
                <p>{knownViewersLabel}</p>
              </div>
            </div>
            <PeopleList
              people={viewers}
              dateKey="viewedAt"
              emptyTitle="No viewers yet"
              emptyDescription="When someone views this card, their details will appear here."
              emptyIcon={<EyeIcon />}
            />
          </section>

          <section className="admin_solution_enhancement_modal__section">
            <div className="admin_solution_enhancement_modal__section-head">
              <span className="admin_solution_enhancement_modal__section-icon">
                <CommentIcon />
              </span>
              <div>
                <h4>Comments</h4>
                <p>
                  {isLoadingComments
                    ? "Loading comments..."
                    : `${commentCount} comment${
                        commentCount === 1 ? "" : "s"
                      } shared on this solution`}
                </p>
              </div>
            </div>

            {isLoadingComments ? (
              <p className="admin_solution_enhancement_modal__person-email">
                Loading comments from the solution card...
              </p>
            ) : comments.length === 0 ? (
              <EmptyState
                title="No comments yet"
                description="When users comment on this card, their feedback will appear here."
                icon={<CommentIcon />}
              />
            ) : (
              <ul className="admin_solution_enhancement_modal__comments">
                {comments.map((comment) => (
                  <li key={comment.id}>
                    <div className="admin_solution_enhancement_modal__comment-avatar">
                      {(comment.authorName || "G").charAt(0).toUpperCase()}
                    </div>
                    <div className="admin_solution_enhancement_modal__comment-body">
                      <div className="admin_solution_enhancement_modal__comment-meta">
                        <strong>
                          {formatCell(comment.authorName || "Guest")}
                        </strong>
                        <span>{formatDateTime(comment.createdAt)}</span>
                      </div>
                      <p>{formatCell(comment.message)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <footer className="admin_solution_enhancement_modal__footer">
          <button
            type="button"
            className="admin_solution_enhancement_modal__close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminSolutionEnhancementModal;
