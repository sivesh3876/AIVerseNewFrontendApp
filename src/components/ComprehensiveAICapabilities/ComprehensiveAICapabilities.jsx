import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ComprehensiveAICapabilities.scss";
import RequestDemoModal from "../CustomerCommunicationManagement/RequestDemoModal";
import SolutionEngagement from "../SolutionEngagement";
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
  const Icon =
    HOME_SOLUTION_ICONS[solution.themeIndex % HOME_SOLUTION_ICONS.length];
  const hasRecordedDemo = Boolean(solution.recordedDemoLink);

  const handleNavigate = () => {
    navigate(solution.detailUrl);
  };

  return (
    <article
      ref={cardRef}
      className={`ai_capabilities__card${
        isHighlighted ? " is-foundation-highlight" : ""
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className="ai_capabilities__card-body"
        role="button"
        tabIndex={0}
        onClick={handleNavigate}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleNavigate();
          }
        }}
      >
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

        <h3>{solution.title}</h3>
        <p>{solution.description}</p>

        <div className="ai_capabilities__meta">
          {solution.techHighlight && (
            <span className="ai_capabilities__chip">
              {solution.techHighlight}
            </span>
          )}
          {solution.client && (
            <span className="ai_capabilities__client">
              Client: {solution.client}
            </span>
          )}
        </div>
      </div>

      <SolutionEngagement
        solutionId={solution.id}
        title={solution.title}
        detailUrl={solution.detailUrl}
        variant="home"
        onActionClick={(event) => event.stopPropagation()}
      />

      <div className="ai_capabilities__actions">
        <button
          type="button"
          className="ai_capabilities__btn ai_capabilities__btn--primary"
          onClick={handleNavigate}
        >
          View Solution
        </button>

        {hasRecordedDemo ? (
          <a
            href={solution.recordedDemoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ai_capabilities__btn ai_capabilities__btn--demo"
          >
            Watch Demo
          </a>
        ) : (
          <button
            type="button"
            className="ai_capabilities__btn ai_capabilities__btn--demo"
            onClick={() => onRequestDemo(solution.capabilityForDemo)}
          >
            Request Demo
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
