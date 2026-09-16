import { useEffect, useState } from "react";
import RequestDemoModal from "../CustomerCommunicationManagement/RequestDemoModal";
import { fetchTopOrderedSolutions } from "../../services/usecasesService";
import { mapApiSolutionToHomeCard } from "../../utils/solutionMapper";
import {
  OnboardingAcceleratorCard,
  SolutionCard,
  SolutionCardSkeleton,
} from "./HomeCapabilityCards";
import "./ComprehensiveAICapabilities.scss";

const HERO_PREVIEW_SOLUTION_COUNT = 3;

const HomeCapabilitiesPreview = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoTarget, setDemoTarget] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadSolutions = async () => {
      try {
        setLoading(true);
        const apiSolutions = await fetchTopOrderedSolutions(
          HERO_PREVIEW_SOLUTION_COUNT,
        );
        const cards = apiSolutions
          .map(mapApiSolutionToHomeCard)
          .filter(Boolean)
          .slice(0, HERO_PREVIEW_SOLUTION_COUNT);

        if (isMounted) {
          setSolutions(cards);
        }
      } catch {
        if (isMounted) {
          setSolutions([]);
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
    <>
      <div className="ai_capabilities ai_capabilities--hero-preview">
        <div className="ai_capabilities__grid">
          <OnboardingAcceleratorCard index={1} />

          {loading &&
            Array.from({ length: HERO_PREVIEW_SOLUTION_COUNT }, (_, index) => (
              <SolutionCardSkeleton
                key={`hero-skeleton-${index}`}
                index={index + 2}
              />
            ))}

          {!loading &&
            solutions.map((solution, index) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                index={index + 2}
                onRequestDemo={setDemoTarget}
              />
            ))}
        </div>
      </div>

      {demoTarget && (
        <RequestDemoModal
          capability={demoTarget}
          onClose={() => setDemoTarget(null)}
        />
      )}
    </>
  );
};

export default HomeCapabilitiesPreview;
