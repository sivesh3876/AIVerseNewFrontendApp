import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buildApiPath } from "../../services/apiConfig";
import {
  experiencePillars,
  getIndustryExperienceMeta,
} from "./industryExperiencesData";
import {
  getIndustryById,
  getIndustryDomainCode,
} from "./industrySolutionsData";
import "./IndustryExperienceGrid.scss";

const getExploreSolutionLabel = (industryId) => {
  if (industryId === "insurance") {
    return "Explore BFSI Solution";
  }
  if (industryId === "logistics") {
    return "Explore Logistics Solution";
  }
  return "Explore Education Solution";
};

const normalizeTitleKey = (value = "") =>
  String(value).trim().replace(/\s+/g, " ").toLowerCase();

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

const IndustryExperienceGrid = ({ industryId }) => {
  const meta = getIndustryExperienceMeta(industryId);
  const industry = getIndustryById(industryId);
  const domainCode = getIndustryDomainCode(industryId);
  const isEducationIndustry = industryId === "education";
  const isLogisticsIndustry = industryId === "logistics";
  const isInsuranceIndustry = industryId === "insurance";
  const isClickableExperienceCard = (item) => {
    if (isEducationIndustry) return false;
    if (isLogisticsIndustry) {
      return item?.id === "wms-customer-onboarding-accelerator";
    }
    return true;
  };
  const exploreSolutionPath = `/explore-solutions?domain=${encodeURIComponent(domainCode)}&industry=${industry?.id || industryId}`;
  const exploreSolutionLabel = getExploreSolutionLabel(industryId);
  const maxRows = Math.max(
    ...PILLAR_IDS.map((pillarId) => meta.pillars[pillarId]?.length ?? 0),
  );
  const [titleToSolutionId, setTitleToSolutionId] = useState({});

  useEffect(() => {
    if (!isInsuranceIndustry) {
      setTitleToSolutionId({});
      return;
    }

    let cancelled = false;

    const loadInsuranceSolutions = async () => {
      try {
        const response = await fetch(
          buildApiPath("get-usecases", { businessDomain: "Insurance" }),
        );
        const result = await response.json();

        if (
          cancelled ||
          !response.ok ||
          result.status !== "success" ||
          !Array.isArray(result.data)
        ) {
          return;
        }

        const nextMap = {};
        for (const solution of result.data) {
          const key = normalizeTitleKey(solution?.Title);
          if (!key || solution?.ID == null) continue;
          nextMap[key] = solution.ID;
        }
        setTitleToSolutionId(nextMap);
      } catch (error) {
        console.error("Failed to map BFSI experience cards to Explore solutions:", error);
      }
    };

    loadInsuranceSolutions();

    return () => {
      cancelled = true;
    };
  }, [isInsuranceIndustry]);

  const resolveCardLink = (item) => {
    const resolvedId =
      item.apiSolutionId || titleToSolutionId[normalizeTitleKey(item.title)];

    if (resolvedId) {
      return `/explore-solutions?domain=${encodeURIComponent(domainCode)}&industry=${industryId}&solution=api-${resolvedId}`;
    }

    return `/industry-solutions?industry=${industryId}&solution=${item.id}`;
  };

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

                const cardContent = (
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

                const cardStyle = {
                  background: pillar.cardBg,
                  animationDelay: `${rowIndex * 0.05}s`,
                };

                if (!isClickableExperienceCard(item)) {
                  return (
                    <article
                      key={item.id}
                      className="industry_experience__card industry_experience__card--static"
                      style={cardStyle}
                    >
                      {cardContent}
                    </article>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    to={resolveCardLink(item)}
                    className="industry_experience__card"
                    style={cardStyle}
                  >
                    {cardContent}
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
