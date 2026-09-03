import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { homeIndustries } from "../IndustryExplore/industrySolutionsData";
import { CheckIcon } from "./IndustryIcons";
import "./IndustrySpecificAISolutions.scss";

const REVEAL_VARIANTS = [
  "industry_solutions__card--reveal-tl",
  "industry_solutions__card--reveal-tr",
  "industry_solutions__card--reveal-bl",
  "industry_solutions__card--reveal-br",
];

const getCardAnimation = (index) => {
  const columns = 2;
  const row = Math.floor(index / columns);
  const col = index % columns;

  return {
    className: REVEAL_VARIANTS[index % REVEAL_VARIANTS.length],
    animationDelay: `${(row + col) * 0.2}s`,
  };
};

const IndustrySpecificAISolutions = ({ industries = homeIndustries }) => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <section
      id="industries"
      className={`industry_solutions ${visible ? "animate" : ""}`}
      ref={sectionRef}
    >
      <div className="industry_solutions__container">
        <header className="industry_solutions__header">
          <h2>Industry-Specific AI Solutions</h2>
          <p>Tailored AI solutions for unique industry challenges</p>
        </header>

        <div className="industry_solutions__grid">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            const { className, animationDelay } = getCardAnimation(index);

            return (
              <Link
                to={`/industry-solutions?industry=${industry.id}`}
                className={`industry_solutions__card ${className}`}
                key={industry.id}
                style={{
                  animationDelay,
                  "--card-delay": animationDelay,
                }}
              >
                <div className="industry_solutions__image-wrap">
                  <img src={industry.image} alt={industry.title} />
                  <div className="industry_solutions__image-overlay">
                    <div
                      className="industry_solutions__badge-icon"
                      style={{ background: industry.iconBg }}
                    >
                      <Icon />
                    </div>
                    <span className="industry_solutions__badge-title">
                      {industry.title}
                    </span>
                  </div>
                </div>

                <div className="industry_solutions__content">
                  <ul>
                    {industry.features.map((feature) => (
                      <li key={feature}>
                        <CheckIcon />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="industry_solutions__footer">
                    <p
                      className="industry_solutions__metric"
                      style={{ color: industry.accentColor }}
                    >
                      {industry.metric}
                    </p>

                    <span className="industry_solutions__link">
                      Explore &gt;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IndustrySpecificAISolutions;
