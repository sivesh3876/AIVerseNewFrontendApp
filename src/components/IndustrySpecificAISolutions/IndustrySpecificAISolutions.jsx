import { useEffect, useRef, useState } from "react";
import "./IndustrySpecificAISolutions.scss";
import educationImage from "../../assets/images/industries01.svg";
import healthcareImage from "../../assets/images/industries02.svg";
import financialServicesImage from "../../assets/images/industries03.svg";
import retailImage from "../../assets/images/industries04.svg";
import {
  CheckIcon,
  EducationIcon,
  FinancialServicesIcon,
  HealthcareIcon,
  RetailIcon,
} from "./IndustryIcons";

const defaultIndustries = [
  {
    icon: EducationIcon,
    iconBg: "#4D90E3",
    accentColor: "#4D90E3",
    title: "Education",
    image: educationImage,
    features: [
      "Student Success AI",
      "Administrative Automation",
      "Personalized Learning",
      "Virtual Assistants",
    ],
    metric: "30% Improved Engagement",
  },
  {
    icon: HealthcareIcon,
    iconBg: "#18E0CC",
    accentColor: "#18E0CC",
    title: "Healthcare",
    image: healthcareImage,
    features: [
      "Patient Care AI",
      "Diagnostic Support",
      "Clinical Documentation",
      "Operational Efficiency",
    ],
    metric: "50% Reduced Admin Time",
  },
  {
    icon: FinancialServicesIcon,
    iconBg: "#EF8E29",
    accentColor: "#EF8E29",
    title: "Financial Services",
    image: financialServicesImage,
    features: [
      "Risk Modeling",
      "Fraud Detection",
      "Compliance Automation",
      "Customer Insights",
    ],
    metric: "40% Faster Decisions",
  },
  {
    icon: RetailIcon,
    iconBg: "#F5B800",
    accentColor: "#D4A017",
    title: "Retail",
    image: retailImage,
    features: [
      "Personalization",
      "Inventory Optimization",
      "Visual Search",
      "Dynamic Pricing",
    ],
    metric: "35% Higher Conversion",
  },
];

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

const IndustrySpecificAISolutions = ({
  industries = defaultIndustries,
  onExplore,
}) => {
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
              <article
                className={`industry_solutions__card ${className}`}
                key={industry.title}
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

                    <button
                      type="button"
                      className="industry_solutions__link"
                      onClick={() => onExplore?.(industry)}
                    >
                      Explore &gt;
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IndustrySpecificAISolutions;
