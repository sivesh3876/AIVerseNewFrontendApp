import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllUseCases } from "../../services/usecasesService";
import {
  filterOutDeletedSolutions,
  isPublicSolutionVisible,
  parseBusinessDomains,
  solutionMatchesExploreFilter,
} from "../../utils/solutionMapper";
import {
  experiencePillars,
  getIndustryExperienceMeta,
} from "./industryExperiencesData";
import {
  getIndustryById,
  getIndustryDomainCode,
} from "./industrySolutionsData";
import "./IndustryExperienceGrid.scss";

const PillarIcon = ({ pillarId }) => {
  if (pillarId === "cx") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M17 20a4 4 0 1 0-8 0" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="13" cy="7" r="3.25" stroke="currentColor" strokeWidth="1.75" />
        <path d="M5 20a4 4 0 0 1 8 0" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="7" cy="9" r="2.75" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    );
  }

  if (pillarId === "ex") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.75" />
        <path d="M6 20c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20V10l8-5 8 5v10" stroke="currentColor" strokeWidth="1.75" />
      <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
};

const CardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.75" />
    <path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const PILLAR_IDS = ["cx", "ex", "bx"];

const normalizeSolutionTitle = (title) =>
  String(title || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const getExploreSolutionLabel = (industryId) => {
  if (industryId === "insurance") {
    return "Explore BFSI Solution";
  }
  if (industryId === "logistics") {
    return "Explore Logistics Solution";
  }
  return "Explore Education Solution";
};

const isLogisticsWmsOnboardingCard = (industryId, item) =>
  industryId === "logistics" &&
  item?.id === "wms-customer-onboarding-accelerator";

const LOGISTICS_WMS_ONBOARDING_API_ID = "api-104";

const ExperienceCardContent = ({ item, pillar }) => (
  <>
    <div
      className="industry_experience__card-icon"
      style={{
        background: pillar.iconBg,
        color: pillar.headerColor,
      }}
    >
      <CardIcon />
    </div>
    <h3>{item.title}</h3>
    <p>{item.description}</p>
  </>
);

const IndustryExperienceGrid = ({ industryId }) => {
  const meta = getIndustryExperienceMeta(industryId);
  const industry = getIndustryById(industryId);
  const domainCode = getIndustryDomainCode(industryId);
  const cardsAreNonClickable =
    industryId === "education" || industryId === "logistics";
  const exploreSolutionPath = `/explore-solutions?domain=${encodeURIComponent(domainCode)}&industry=${industry?.id || industryId}`;
  const exploreSolutionLabel = getExploreSolutionLabel(industryId);
  const [titleToApiSolutionId, setTitleToApiSolutionId] = useState({});
  const maxRows = Math.max(
    ...PILLAR_IDS.map((pillarId) => meta.pillars[pillarId]?.length ?? 0),
  );

  useEffect(() => {
    if (cardsAreNonClickable) {
      setTitleToApiSolutionId({});
      return undefined;
    }

    let isMounted = true;

    const loadTitleMap = async () => {
      try {
        const solutions = filterOutDeletedSolutions(await fetchAllUseCases());
        if (!isMounted) return;

        const nextMap = {};

        solutions.forEach((solution) => {
          if (!isPublicSolutionVisible(solution)) return;

          const businessDomains = parseBusinessDomains(solution);
          const matchesDomain = solutionMatchesExploreFilter({
            businessDomain: businessDomains[0] || solution.BusinessDomain || "",
            businessDomains,
            activeServiceId: null,
            activeDomainCode: domainCode,
          });

          if (!matchesDomain) return;

          const key = normalizeSolutionTitle(solution.Title);
          const id = solution.ID ?? solution.Id ?? solution.id;
          if (!key || id == null || id === "") return;

          nextMap[key] = `api-${id}`;
        });

        setTitleToApiSolutionId(nextMap);
      } catch (error) {
        console.error("Failed to map industry cards to Explore Solutions:", error);
        if (isMounted) {
          setTitleToApiSolutionId({});
        }
      }
    };

    setTitleToApiSolutionId({});
    loadTitleMap();

    return () => {
      isMounted = false;
    };
  }, [cardsAreNonClickable, domainCode]);

  const resolveCardLink = useMemo(() => {
    const staticDetailPath = (item) =>
      `/industry-solutions?industry=${industryId}&solution=${item.id}`;

    return (item) => {
      if (isLogisticsWmsOnboardingCard(industryId, item)) {
        return `/explore-solutions?domain=${encodeURIComponent(domainCode)}&industry=logistics&solution=${LOGISTICS_WMS_ONBOARDING_API_ID}`;
      }

      const apiSolutionKey =
        titleToApiSolutionId[normalizeSolutionTitle(item?.title)];

      if (apiSolutionKey) {
        return `/explore-solutions?domain=${encodeURIComponent(domainCode)}&industry=${industryId}&solution=${encodeURIComponent(apiSolutionKey)}`;
      }

      return staticDetailPath(item);
    };
  }, [domainCode, industryId, titleToApiSolutionId]);

  return (
    <section className="industry_experience">
      <header className="industry_experience__header">
        <h2>{meta.pageTitle}</h2>
        <p>{meta.intro}</p>
      </header>

      <div
        className="industry_experience__columns"
        style={{ "--experience-rows": maxRows }}
      >
        {PILLAR_IDS.map((pillarId) => {
          const pillar = experiencePillars[pillarId];
          const items = meta.pillars[pillarId] ?? [];

          return (
            <div className="industry_experience__column" key={pillarId}>
              <div
                className="industry_experience__column-head"
                style={{ background: pillar.headerColor }}
              >
                <PillarIcon pillarId={pillarId} />
                <span>{pillar.label}</span>
              </div>

              {Array.from({ length: maxRows }, (_, rowIndex) => {
                const item = items[rowIndex];

                if (!item) {
                  return (
                    <div
                      key={`empty-${pillarId}-${rowIndex}`}
                      className="industry_experience__card industry_experience__card--empty"
                      aria-hidden="true"
                    />
                  );
                }

                const cardStyle = {
                  background: pillar.cardBg,
                  animationDelay: `${rowIndex * 0.05}s`,
                };
                const isCardClickable =
                  !cardsAreNonClickable ||
                  isLogisticsWmsOnboardingCard(industryId, item);

                if (!isCardClickable) {
                  return (
                    <div
                      key={item.id}
                      className="industry_experience__card industry_experience__card--static"
                      style={cardStyle}
                    >
                      <ExperienceCardContent item={item} pillar={pillar} />
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    to={resolveCardLink(item)}
                    className="industry_experience__card"
                    style={cardStyle}
                  >
                    <ExperienceCardContent item={item} pillar={pillar} />
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="industry_experience__footer">
        <div className="industry_experience__cta-row">
          <Link to="/success-stories" className="industry_experience__cta">
            Explore Case Studies
          </Link>
          <Link
            to={exploreSolutionPath}
            className="industry_experience__cta industry_experience__cta--primary"
          >
            {exploreSolutionLabel}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default IndustryExperienceGrid;
