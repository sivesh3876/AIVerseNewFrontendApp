import { Link } from "react-router-dom";
import {
  experiencePillars,
  getIndustryExperienceMeta,
} from "./industryExperiencesData";
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

const IndustryExperienceGrid = ({ industryId }) => {
  const meta = getIndustryExperienceMeta(industryId);
  const maxRows = Math.max(
    ...PILLAR_IDS.map((pillarId) => meta.pillars[pillarId]?.length ?? 0),
  );

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

                return (
                  <Link
                    key={item.id}
                    to={`/industry-solutions?industry=${industryId}&solution=${item.id}`}
                    className="industry_experience__card"
                    style={{
                      background: pillar.cardBg,
                      animationDelay: `${rowIndex * 0.05}s`,
                    }}
                  >
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
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="industry_experience__footer">
        <Link to="/success-stories" className="industry_experience__cta">
          Explore Case Studies
        </Link>
      </div>
    </section>
  );
};

export default IndustryExperienceGrid;
