import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddAISolutionCard from "../AddAISolutionCard";
import TalkToExpertCard from "../TalkToExpertCard";
import { useScrollToSection } from "../../utils/pageScroll";
import {
  getIndustryIndexById,
  industrySolutionsData,
} from "./industrySolutionsData";
import "./IndustryExplore.scss";

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#3A8D9D" strokeWidth="1.75" />
    <path d="m8 12 2.5 2.5L16 9" stroke="#3A8D9D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IndustryExplore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const industryId = searchParams.get("industry");
  const [activeIndex, setActiveIndex] = useState(() =>
    getIndustryIndexById(industryId),
  );
  const mainRef = useRef(null);

  useEffect(() => {
    setActiveIndex(getIndustryIndexById(industryId));
  }, [industryId]);

  useScrollToSection(mainRef, [industryId]);

  const activeIndustry = industrySolutionsData[activeIndex];
  const BannerIcon = activeIndustry.icon;

  const handleIndustryChange = (index) => {
    setActiveIndex(index);
    navigate(`/industry-solutions?industry=${industrySolutionsData[index].id}`, {
      replace: true,
    });
  };

  return (
    <div className="industry_explore">
      <aside className="industry_explore__sidebar">
        <nav className="industry_explore__nav" aria-label="Industries">
          <h2>ALL INDUSTRIES</h2>
          <ul>
            {industrySolutionsData.map((industry, index) => {
              const isActive = index === activeIndex;
              const NavIcon = industry.icon;

              return (
                <li key={industry.id}>
                  <button
                    type="button"
                    className={`industry_explore__nav-item${isActive ? " is-active" : ""}`}
                    onClick={() => handleIndustryChange(index)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className="industry_explore__nav-icon"
                      style={{ background: industry.iconBg }}
                      aria-hidden="true"
                    >
                      <NavIcon />
                    </span>
                    <span className="industry_explore__nav-label">{industry.title}</span>
                    {isActive && (
                      <span className="industry_explore__nav-arrow" aria-hidden="true">
                        &rsaquo;
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <AddAISolutionCard />
        <TalkToExpertCard />
      </aside>

      <main className="industry_explore__main" key={activeIndustry.id} ref={mainRef}>
        <section className="industry_explore__banner">
          <div
            className="industry_explore__banner-image"
            style={{ backgroundImage: `url(${activeIndustry.image})` }}
            aria-hidden="true"
          />
          <div className="industry_explore__banner-overlay" aria-hidden="true" />

          <div className="industry_explore__banner-content">
            <div className="industry_explore__banner-header">
              <div
                className="industry_explore__banner-icon"
                style={{ background: activeIndustry.iconBg }}
                aria-hidden="true"
              >
                <BannerIcon />
              </div>
              <div className="industry_explore__banner-copy">
                <h1>{activeIndustry.title}</h1>
                <p>{activeIndustry.subtitle}</p>
              </div>
            </div>

            <div className="industry_explore__banner-body">
              <ul className="industry_explore__features">
                {activeIndustry.features.map((feature) => (
                  <li key={feature}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <p
                className="industry_explore__metric"
                style={{ color: activeIndustry.accentColor }}
              >
                {activeIndustry.metric}
              </p>
            </div>
          </div>
        </section>

        <section className="industry_explore__content">
          <h2>{activeIndustry.contentHeading}</h2>
          <div className="industry_explore__content-body">
            {activeIndustry.contentParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="industry_explore__highlights">
            <h3>Key Outcomes</h3>
            <div className="industry_explore__highlights-grid">
              {activeIndustry.highlights.map((highlight) => (
                <article key={highlight.title} className="industry_explore__highlight">
                  <h4>{highlight.title}</h4>
                  <p>{highlight.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="industry_explore__solutions">
            <h3>Featured Solutions</h3>
            <div className="industry_explore__solutions-grid">
              {activeIndustry.solutions.map((solution) => (
                <article key={solution.title} className="industry_explore__solution">
                  <h4>{solution.title}</h4>
                  <p>{solution.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default IndustryExplore;
