import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddAISolutionCard from "../AddAISolutionCard";
import TalkToExpertCard from "../TalkToExpertCard";
import { useScrollToSection } from "../../utils/pageScroll";
import {
  getIndustryIndexById,
  industrySolutionsData,
} from "./industrySolutionsData";
import { getIndustryExperienceItem } from "./industryExperiencesData";
import IndustryExperienceGrid from "./IndustryExperienceGrid";
import IndustryExperienceDetail from "./IndustryExperienceDetail";
import "./IndustryExplore.scss";

const IndustryExplore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const industryId = searchParams.get("industry");
  const solutionId = searchParams.get("solution");
  const [activeIndex, setActiveIndex] = useState(() =>
    getIndustryIndexById(industryId),
  );
  const mainRef = useRef(null);

  useEffect(() => {
    setActiveIndex(getIndustryIndexById(industryId));
  }, [industryId]);

  useScrollToSection(mainRef, [industryId, solutionId]);

  const activeIndustry = industrySolutionsData[activeIndex];
  const BannerIcon = activeIndustry.icon;
  const activeSolution = solutionId
    ? getIndustryExperienceItem(activeIndustry.id, solutionId)
    : null;

  useEffect(() => {
    if (solutionId && !activeSolution) {
      navigate(`/industry-solutions?industry=${activeIndustry.id}`, {
        replace: true,
      });
    }
  }, [solutionId, activeSolution, activeIndustry.id, navigate]);

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
          </div>
        </section>

        <section className="industry_explore__content">
          {activeSolution ? (
            <IndustryExperienceDetail
              industry={activeIndustry}
              solutionId={solutionId}
            />
          ) : (
            <IndustryExperienceGrid industryId={activeIndustry.id} />
          )}
        </section>
      </main>
    </div>
  );
};

export default IndustryExplore;
