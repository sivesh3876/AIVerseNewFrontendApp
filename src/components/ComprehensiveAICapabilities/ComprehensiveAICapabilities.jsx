import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ComprehensiveAICapabilities.scss";
import RequestDemoModal from "../CustomerCommunicationManagement/RequestDemoModal";
import OnboardingAcceleratorModal from "./OnboardingAcceleratorModal";
import { fetchTopOrderedSolutions } from "../../services/usecasesService";
import { mapApiSolutionToHomeCard } from "../../utils/solutionMapper";
import {
  AI_FOUNDATION_HIGHLIGHT_EVENT,
  AI_FOUNDATION_HIGHLIGHT_KEY,
  findHomeSolutionForFoundation,
  getFoundationExplorePath,
  readPendingFoundationHighlight,
} from "../../utils/foundationNavigation";
import {
  ONBOARDING_ACCELERATOR,
  OnboardingAcceleratorCard,
  SolutionCard,
  SolutionCardSkeleton,
} from "./HomeCapabilityCards";

const HOME_SOLUTION_LIMIT = 8;

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
  const [onboardingOpen, setOnboardingOpen] = useState(false);
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
        const cardElement = cardRefs.current[matchIndex + 1];

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
          <OnboardingAcceleratorCard
            onOpenWms={() => setOnboardingOpen(true)}
          />

          {loading &&
            Array.from({ length: HOME_SOLUTION_LIMIT }, (_, index) => (
              <SolutionCardSkeleton
                key={`skeleton-${index}`}
                index={index + 1}
              />
            ))}

          {!loading &&
            solutions.map((solution, index) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                index={index + 1}
                onRequestDemo={setDemoTarget}
                cardRef={(element) => {
                  cardRefs.current[index + 1] = element;
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

      {onboardingOpen && (
        <OnboardingAcceleratorModal
          title={ONBOARDING_ACCELERATOR.title}
          subtitle={ONBOARDING_ACCELERATOR.domainLabel}
          src={ONBOARDING_ACCELERATOR.url}
          onClose={() => setOnboardingOpen(false)}
        />
      )}
    </section>
  );
};

export default ComprehensiveAICapabilities;
