import { getSolutionEngagement } from "../../utils/solutionEngagementStorage";
import { getSolutionStatusLabel } from "../../utils/adminSolutionTableUtils";

const formatCell = (value) => value || "—";

const formatCommentDate = (value) => {
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

const AdminSolutionEnhancementModal = ({ solution, onClose }) => {
  if (!solution) return null;

  const engagement = getSolutionEngagement(solution.ID);
  const comments = engagement.comments || [];
  const statusLabel = getSolutionStatusLabel(solution);
  const isActive = statusLabel === "Active";

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
                <p>Live activity from the Explore Solutions card</p>
              </div>
            </div>

            <div className="admin_solution_enhancement_modal__stats">
              <article className="admin_solution_enhancement_modal__stat admin_solution_enhancement_modal__stat--views">
                <span className="admin_solution_enhancement_modal__stat-icon">
                  <EyeIcon />
                </span>
                <div>
                  <span>Views</span>
                  <strong>{engagement.views}</strong>
                  <em>Total views</em>
                </div>
              </article>

              <article className="admin_solution_enhancement_modal__stat admin_solution_enhancement_modal__stat--likes">
                <span className="admin_solution_enhancement_modal__stat-icon">
                  <HeartIcon />
                </span>
                <div>
                  <span>Likes</span>
                  <strong>{engagement.likes}</strong>
                  <em>Total likes</em>
                </div>
              </article>

              <article className="admin_solution_enhancement_modal__stat admin_solution_enhancement_modal__stat--comments">
                <span className="admin_solution_enhancement_modal__stat-icon">
                  <CommentIcon />
                </span>
                <div>
                  <span>Comments</span>
                  <strong>{comments.length}</strong>
                  <em>Total comments</em>
                </div>
              </article>
            </div>
          </section>

          <section className="admin_solution_enhancement_modal__section">
            <div className="admin_solution_enhancement_modal__section-head">
              <span className="admin_solution_enhancement_modal__section-icon">
                <CommentIcon />
              </span>
              <div>
                <h4>Comments</h4>
                <p>
                  {comments.length} comment
                  {comments.length === 1 ? "" : "s"} shared on this solution
                </p>
              </div>
            </div>

            {comments.length === 0 ? (
              <div className="admin_solution_enhancement_modal__empty">
                <div className="admin_solution_enhancement_modal__empty-visual">
                  <span className="admin_solution_enhancement_modal__sparkle admin_solution_enhancement_modal__sparkle--one">
                    <SparkleIcon />
                  </span>
                  <span className="admin_solution_enhancement_modal__empty-icon">
                    <CommentIcon />
                  </span>
                  <span className="admin_solution_enhancement_modal__sparkle admin_solution_enhancement_modal__sparkle--two">
                    <SparkleIcon />
                  </span>
                </div>
                <strong>No comments yet</strong>
                <p>
                  When users comment on this card, their feedback will appear
                  here.
                </p>
              </div>
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
                        <span>{formatCommentDate(comment.createdAt)}</span>
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
