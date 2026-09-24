import { useEffect, useMemo, useState } from "react";
import RequestDemoModal from "../CustomerCommunicationManagement/RequestDemoModal";
import { fetchTopHeroSolutions } from "../../services/usecasesService";
import {
  HERO_CARD_POSITION_MAX,
  mapApiSolutionToHomeCard,
} from "../../utils/solutionMapper";
import {
  OnboardingAcceleratorCard,
  SolutionCard,
  SolutionCardSkeleton,
} from "./HomeCapabilityCards";
import "./ComprehensiveAICapabilities.scss";

const HERO_PREVIEW_LIMIT = HERO_CARD_POSITION_MAX;

const HomeCapabilitiesPreview = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoTarget, setDemoTarget] = useState(null);

  const solutionsByPosition = useMemo(() => {
    const byPosition = new Map();
    solutions.forEach((solution) => {
      const order = Number(
        solution.heroPosition ?? solution.displayOrder ?? solution.orderNumber,
      );
      if (
        Number.isFinite(order) &&
        order >= 1 &&
        order <= HERO_PREVIEW_LIMIT &&
        !byPosition.has(order)
      ) {
        byPosition.set(order, solution);
      }
    });
    return byPosition;
  }, [solutions]);

  const heroSlots = useMemo(() => {
    const slots = [];
    for (let position = 1; position <= HERO_PREVIEW_LIMIT; position += 1) {
      const solution = solutionsByPosition.get(position);
      if (solution) {
        slots.push({ type: "solution", position, solution });
      } else if (position === 1) {
        slots.push({ type: "onboarding", position });
      }
    }
    return slots;
  }, [solutionsByPosition]);

  useEffect(() => {
    let isMounted = true;

    const loadSolutions = async () => {
      try {
        setLoading(true);
        const apiSolutions = await fetchTopHeroSolutions(HERO_PREVIEW_LIMIT);
        const cards = apiSolutions
          .map(mapApiSolutionToHomeCard)
          .filter(Boolean)
          .slice(0, HERO_PREVIEW_LIMIT);

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
          {loading &&
            Array.from({ length: HERO_PREVIEW_LIMIT }, (_, index) => (
              <SolutionCardSkeleton
                key={`hero-skeleton-${index}`}
                index={index + 1}
              />
            ))}

          {!loading &&
            heroSlots.map((slot) => {
              if (slot.type === "onboarding") {
                return (
                  <OnboardingAcceleratorCard
                    key="hero-onboarding-accelerator"
                    index={slot.position}
                  />
                );
              }

              return (
                <SolutionCard
                  key={slot.solution.id}
                  solution={slot.solution}
                  index={slot.position}
                  onRequestDemo={setDemoTarget}
                />
              );
            })}
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
