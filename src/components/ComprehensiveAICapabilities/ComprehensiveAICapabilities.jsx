import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ComprehensiveAICapabilities.scss";
import RequestDemoModal from "../CustomerCommunicationManagement/RequestDemoModal";
import { DocumentIcon } from "../CustomerCommunicationManagement/CapabilityIcons";
import SolutionEngagement from "../SolutionEngagement/SolutionEngagement";
import { fetchTopOrderedSolutions } from "../../services/usecasesService";
import { mapApiSolutionToHomeCard } from "../../utils/solutionMapper";
import {
  AI_FOUNDATION_HIGHLIGHT_EVENT,
  AI_FOUNDATION_HIGHLIGHT_KEY,
  findHomeSolutionForFoundation,
  getFoundationExplorePath,
  readPendingFoundationHighlight,
} from "../../utils/foundationNavigation";
import { HOME_SOLUTION_ICONS } from "./HomeSolutionCardIcons";

const HOME_SOLUTION_LIMIT = 8;

const EyeSmallIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M1.5 12C3.5 7.5 7.5 5 12 5s8.5 2.5 10.5 7c-2 4.5-6 7-10.5 7S3.5 16.5 1.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const PlaySmallIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m10 8 6 4-6 4V8Z" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.75" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SolutionCardSkeleton = ({ index }) => (
  <article
    className="ai_capabilities__card ai_capabilities__card--skeleton"
    style={{ animationDelay: `${index * 0.08}s` }}
    aria-hidden="true"
  >
    <div className="ai_capabilities__skeleton-icon" />
    <div className="ai_capabilities__skeleton-line ai_capabilities__skeleton-line--title" />
    <div className="ai_capabilities__skeleton-line" />
    <div className="ai_capabilities__skeleton-line ai_capabilities__skeleton-line--short" />
    <div className="ai_capabilities__skeleton-actions" />
  </article>
);

const SolutionCard = ({ solution, index, onRequestDemo, cardRef, isHighlighted }) => {
  const navigate = useNavigate();
  const internalCardRef = useRef(null);
  const panelHostRef = useRef(null);
  const descriptionRef = useRef(null);
  const [panelHostEl, setPanelHostEl] = useState(null);
  const [activePanel, setActivePanel] = useState(null);
  const [isDescriptionClamped, setIsDescriptionClamped] = useState(false);
  const descriptionText = String(solution?.description ?? "").trim();
  const Icon =
    HOME_SOLUTION_ICONS[
      Math.abs(Number(solution?.themeIndex) || 0) % HOME_SOLUTION_ICONS.length
    ] ?? HOME_SOLUTION_ICONS[0];
  const hasRecordedDemo = Boolean(solution.recordedDemoLink);
  const salesDeskUrl = solution.salesDeskDoc;
  const hasSalesDesk = Boolean(salesDeskUrl);

  const assignCardRef = useCallback(
    (node) => {
      internalCardRef.current = node;
      if (typeof cardRef === "function") {
        cardRef(node);
      } else if (cardRef) {
        cardRef.current = node;
      }
    },
    [cardRef],
  );

  const measureDescriptionClamp = useCallback(() => {
    const element = descriptionRef.current;
    if (!element) {
      return;
    }

    setIsDescriptionClamped((previous) => {
      const clamped = element.scrollHeight > element.clientHeight + 1;
      return previous === clamped ? previous : clamped;
    });
  }, []);

  const assignDescriptionRef = useCallback(
    (node) => {
      descriptionRef.current = node;
      if (node) {
        requestAnimationFrame(measureDescriptionClamp);
      }
    },
    [measureDescriptionClamp],
  );

  useLayoutEffect(() => {
    if (activePanel === "description") {
      return undefined;
    }

    measureDescriptionClamp();

    const element = descriptionRef.current;
    if (!element) {
      return undefined;
    }

    const observer = new ResizeObserver(measureDescriptionClamp);
    observer.observe(element);
    window.addEventListener("resize", measureDescriptionClamp);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureDescriptionClamp);
    };
  }, [activePanel, measureDescriptionClamp, descriptionText]);

  const handleNavigate = () => {
    navigate(solution.detailUrl);
  };

  const handleReadMore = (event) => {
    event.stopPropagation();
    setIsDescriptionClamped(true);
    setActivePanel("description");
  };

  const handleReadLess = (event) => {
    event.stopPropagation();
    setActivePanel(null);
  };

  const handleCommentOpenChange = (open) => {
    setActivePanel(open ? "comments" : null);
  };

  const handleClosePanel = (event) => {
    event?.stopPropagation();
    setActivePanel(null);
  };

  const showReadMore =
    descriptionText.length > 110 || isDescriptionClamped;

  const assignPanelHostRef = useCallback((node) => {
    panelHostRef.current = node;
    setPanelHostEl((previous) => (previous === node ? previous : node));
  }, []);

  return (
    <article
      ref={assignCardRef}
      className={`ai_capabilities__card${
        isHighlighted ? " is-foundation-highlight" : ""
      }${activePanel ? " is-panel-open" : ""}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="ai_capabilities__card-body">
        <div className="ai_capabilities__card-head">
          <div className="ai_capabilities__icon">
            <Icon />
          </div>

          <div className="ai_capabilities__head-meta">
            {solution.orderNumber != null && (
              <span className="ai_capabilities__order">
                #{String(solution.orderNumber).padStart(2, "0")}
              </span>
            )}
            <span className="ai_capabilities__domain">
              {solution.domainLabel}
            </span>
          </div>
        </div>

        <div className="ai_capabilities__title-row">
          <h3>{solution.title}</h3>
          {activePanel ? (
            <button
              type="button"
              className="ai_capabilities__card-overlay-close"
              onClick={handleClosePanel}
              aria-label="Close panel"
            >
              &times;
            </button>
          ) : (
            <span className="ai_capabilities__bookmark" aria-hidden="true">
              <BookmarkIcon />
            </span>
          )}
        </div>

        <div
          ref={assignPanelHostRef}
          className={`ai_capabilities__panel-host${
            activePanel ? " is-panel-active" : ""
          }${activePanel === "description" ? " is-description-open" : ""}`}
        >
          <div className="ai_capabilities__panel-main">
            {activePanel === "description" ? (
              <div className="ai_capabilities__description-expanded">
                <p>{descriptionText}</p>
                <button
                  type="button"
                  className="ai_capabilities__read-less"
                  onClick={handleReadLess}
                >
                  Read less
                </button>
              </div>
            ) : (
              <div
                className={`ai_capabilities__panel-content${
                  activePanel === "comments" ? " is-hidden" : ""
                }`}
              >
                <div
                  className={`ai_capabilities__desc-wrap${
                    showReadMore ? " is-clamped" : ""
                  }`}
                >
                  <p ref={assignDescriptionRef}>{descriptionText}</p>
                  {showReadMore && (
                    <button
                      type="button"
                      className="ai_capabilities__read-more"
                      onClick={handleReadMore}
                    >
                      Read more
                    </button>
                  )}
                </div>

                <div className="ai_capabilities__meta">
                  {solution.techHighlight && (
                    <span className="ai_capabilities__chip">
                      {solution.techHighlight}
                    </span>
                  )}
                  {solution.client && (
                    <span className="ai_capabilities__client">
                      AI Foundation: {solution.client}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className={`ai_capabilities__engagement-wrap${
              activePanel === "comments" ? " is-hidden" : ""
            }`}
          >
            <SolutionEngagement
              solutionId={solution.id}
              title={solution.title}
              serviceLine={solution.serviceId}
              detailUrl={solution.detailUrl}
              variant="home"
              commentUi="card-overlay"
              overlayRoot={panelHostEl}
              overlayRootRef={panelHostRef}
              commentOpen={activePanel === "comments"}
              onCommentOpenChange={handleCommentOpenChange}
              onActionClick={(event) => event.stopPropagation()}
            />
          </div>
        </div>
      </div>

      <div className="ai_capabilities__actions">
        <button
          type="button"
          className="ai_capabilities__btn ai_capabilities__btn--primary"
          onClick={handleNavigate}
        >
          <EyeSmallIcon />
          <span className="ai_capabilities__btn-text">
            View Solution
            <ArrowIcon />
          </span>
        </button>

        {hasRecordedDemo ? (
          <a
            href={solution.recordedDemoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ai_capabilities__btn ai_capabilities__btn--demo"
          >
            <PlaySmallIcon />
            <span className="ai_capabilities__btn-text">
              Watch Demo
              <ArrowIcon />
            </span>
          </a>
        ) : (
          <button
            type="button"
            className="ai_capabilities__btn ai_capabilities__btn--demo"
            onClick={() => onRequestDemo(solution.capabilityForDemo)}
          >
            <PlaySmallIcon />
            <span className="ai_capabilities__btn-text">
              Watch Demo
              <ArrowIcon />
            </span>
          </button>
        )}

        {hasSalesDesk ? (
          <a
            href={salesDeskUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ai_capabilities__btn ai_capabilities__btn--demo"
          >
            <DocumentIcon />
            <span className="ai_capabilities__btn-text">
              Sales Pitch
              <ArrowIcon />
            </span>
          </a>
        ) : (
          <button
            type="button"
            className="ai_capabilities__btn ai_capabilities__btn--demo"
          >
            <DocumentIcon />
            <span className="ai_capabilities__btn-text">
              Sales Pitch
              <ArrowIcon />
            </span>
          </button>
        )}
      </div>

    </article>
  );
};

const ComprehensiveAICapabilities = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const highlightTimeoutRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [demoTarget, setDemoTarget] = useState(null);
  const [highlightedSolutionId, setHighlightedSolutionId] = useState(null);

  const clearHighlight = useCallback(() => {
    if (highlightTimeoutRef.current) {
      window.clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }
    setHighlightedSolutionId(null);
  }, []);

  const focusFoundationSolution = useCallback(
    (foundationId) => {
      if (!foundationId || loading) {
        return;
      }

      sessionStorage.removeItem(AI_FOUNDATION_HIGHLIGHT_KEY);

      const match = findHomeSolutionForFoundation(solutions, foundationId);

      if (match) {
        const matchIndex = solutions.findIndex(
          (solution) => solution.id === match.id,
        );
        const cardElement = cardRefs.current[matchIndex];

        setHighlightedSolutionId(match.id);

        if (cardElement) {
          window.setTimeout(() => {
            cardElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 150);
        }

        if (highlightTimeoutRef.current) {
          window.clearTimeout(highlightTimeoutRef.current);
        }

        highlightTimeoutRef.current = window.setTimeout(() => {
          clearHighlight();
        }, 3200);
        return;
      }

      navigate(getFoundationExplorePath(foundationId));
    },
    [clearHighlight, loading, navigate, solutions],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadSolutions = async () => {
      try {
        setLoading(true);
        setFetchError("");
        const apiSolutions =
          await fetchTopOrderedSolutions(HOME_SOLUTION_LIMIT);
        const cards = apiSolutions
          .map(mapApiSolutionToHomeCard)
          .filter(Boolean);

        if (isMounted) {
          setSolutions(cards);
        }
      } catch (error) {
        if (isMounted) {
          setSolutions([]);
          setFetchError(error.message || "Unable to load featured solutions.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSolutions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleFoundationHighlight = (event) => {
      focusFoundationSolution(event.detail?.foundationId);
    };

    window.addEventListener(
      AI_FOUNDATION_HIGHLIGHT_EVENT,
      handleFoundationHighlight,
    );

    return () => {
      window.removeEventListener(
        AI_FOUNDATION_HIGHLIGHT_EVENT,
        handleFoundationHighlight,
      );
    };
  }, [focusFoundationSolution]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const pendingFoundationId = readPendingFoundationHighlight();
    if (pendingFoundationId) {
      focusFoundationSolution(pendingFoundationId);
    }
  }, [focusFoundationSolution, loading, solutions]);

  useEffect(
    () => () => {
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
    },
    [],
  );

  return (
    <section
      id="capabilities"
      className={`ai_capabilities ${visible ? "animate" : ""}`}
      ref={sectionRef}
    >
      <div className="ai_capabilities__container">
        <header className="ai_capabilities__header">
          <span className="ai_capabilities__eyebrow">Featured Solutions</span>
          <h2>Espire's AI capabilities, proven in action</h2>
          <p>Live demos and real-world AI solutions</p>
        </header>

        <div className="ai_capabilities__grid">
          {loading &&
            Array.from({ length: HOME_SOLUTION_LIMIT }, (_, index) => (
              <SolutionCardSkeleton key={`skeleton-${index}`} index={index} />
            ))}

          {!loading &&
            solutions.map((solution, index) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                index={index}
                onRequestDemo={setDemoTarget}
                cardRef={(element) => {
                  cardRefs.current[index] = element;
                }}
                isHighlighted={highlightedSolutionId === solution.id}
              />
            ))}
        </div>

        {!loading && fetchError && (
          <p className="ai_capabilities__status ai_capabilities__status--error">
            {fetchError}
          </p>
        )}

        {!loading && !fetchError && solutions.length === 0 && (
          <p className="ai_capabilities__status">
            Featured solutions will appear here once they are published.
          </p>
        )}
      </div>

      {demoTarget && (
        <RequestDemoModal
          capability={demoTarget}
          onClose={() => setDemoTarget(null)}
        />
      )}
    </section>
  );
};

export default ComprehensiveAICapabilities;
