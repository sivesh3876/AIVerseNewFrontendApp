import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ComprehensiveAICapabilities.scss";
import RequestDemoModal from "../CustomerCommunicationManagement/RequestDemoModal";
import { fetchTopOrderedSolutions } from "../../services/usecasesService";
import { mapApiSolutionToHomeCard } from "../../utils/solutionMapper";
import {
  HOME_SOLUTION_ICONS,
} from "./HomeSolutionCardIcons";

const HOME_SOLUTION_LIMIT = 8;

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
    <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" stroke="none" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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

const SolutionCard = ({ solution, index, onRequestDemo }) => {
  const navigate = useNavigate();
  const Icon = HOME_SOLUTION_ICONS[solution.themeIndex % HOME_SOLUTION_ICONS.length];
  const hasRecordedDemo = Boolean(solution.recordedDemoLink);

  const handleNavigate = () => {
    navigate(solution.detailUrl);
  };

  return (
    <article
      className="ai_capabilities__card"
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
            <span className="ai_capabilities__domain">{solution.domainLabel}</span>
          </div>
        </div>

        <h3>{solution.title}</h3>
        <p>{solution.description}</p>

        <div className="ai_capabilities__meta">
          {solution.techHighlight && (
            <span className="ai_capabilities__chip">{solution.techHighlight}</span>
          )}
          {solution.client && (
            <span className="ai_capabilities__client">
              Client: {solution.client}
            </span>
          )}
        </div>
      </div>

      <div className="ai_capabilities__actions">
        <button
          type="button"
          className="ai_capabilities__btn ai_capabilities__btn--primary"
          onClick={handleNavigate}
        >
          View Solution
          <ArrowIcon />
        </button>

        {hasRecordedDemo ? (
          <a
            href={solution.recordedDemoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ai_capabilities__btn ai_capabilities__btn--demo"
          >
            Watch Demo
            <PlayIcon />
          </a>
        ) : (
          <button
            type="button"
            className="ai_capabilities__btn ai_capabilities__btn--demo"
            onClick={() => onRequestDemo(solution.capabilityForDemo)}
          >
            Request Demo
            <PlayIcon />
          </button>
        )}
      </div>
    </article>
  );
};

const ComprehensiveAICapabilities = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [demoTarget, setDemoTarget] = useState(null);

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
        const apiSolutions = await fetchTopOrderedSolutions(HOME_SOLUTION_LIMIT);
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

  return (
    <section
      id="capabilities"
      className={`ai_capabilities ${visible ? "animate" : ""}`}
      ref={sectionRef}
    >
      <div className="ai_capabilities__container">
        <header className="ai_capabilities__header">
          <span className="ai_capabilities__eyebrow">Featured Solutions</span>
          <h2>Comprehensive AI Capabilities</h2>
          <p>
            Top enterprise AI solutions curated for real-world business impact
          </p>
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
