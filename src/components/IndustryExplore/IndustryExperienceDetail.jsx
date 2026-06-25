import { Link } from "react-router-dom";
import {
  experiencePillars,
  getIndustryExperienceItem,
  getIndustryExperiencePillar,
} from "./industryExperiencesData";
import "./IndustryExperienceDetail.scss";

const IndustryExperienceDetail = ({ industry, solutionId }) => {
  const item = getIndustryExperienceItem(industry.id, solutionId);
  const pillar = getIndustryExperiencePillar(item?.pillarId);

  if (!item) {
    return null;
  }

  return (
    <article className="industry_experience_detail">
      <Link
        to={`/industry-solutions?industry=${industry.id}`}
        className="industry_experience_detail__back"
      >
        &larr; Back to {industry.title}
      </Link>

      <header
        className="industry_experience_detail__hero"
        style={{ borderColor: pillar.accentColor }}
      >
        <span
          className="industry_experience_detail__pillar"
          style={{ background: pillar.headerColor }}
        >
          {pillar.label}
        </span>
        <p className="industry_experience_detail__industry">{industry.title}</p>
        <h1>{item.title}</h1>
        <p className="industry_experience_detail__summary">{item.description}</p>
      </header>

      <div className="industry_experience_detail__body">
        <section>
          <h2>Overview</h2>
          <p>{item.detail.overview}</p>
        </section>

        <section>
          <h2>Key Benefits</h2>
          <ul>
            {item.detail.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Expected Outcomes</h2>
          <ul>
            {item.detail.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="industry_experience_detail__actions">
        <Link
          to={`/explore-solutions?domain=${encodeURIComponent(industry.domainCode)}`}
          className="industry_experience_detail__btn industry_experience_detail__btn--primary"
        >
          Explore {industry.title} Solutions
        </Link>
        <Link to="/contact" className="industry_experience_detail__btn">
          Talk to an Expert
        </Link>
      </div>
    </article>
  );
};

export default IndustryExperienceDetail;
