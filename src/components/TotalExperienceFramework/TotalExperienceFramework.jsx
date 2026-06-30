import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  totalExperienceFoundations,
  totalExperienceFrameworkMeta,
  totalExperienceInputPillars,
  totalExperienceResultPillar,
} from "../../data/totalExperienceData";
import { getFoundationIcons } from "./FoundationIcons";
import "./TotalExperienceFramework.scss";

const PillarCard = ({ pillar, onClick }) => {
  const isInteractive = Boolean(pillar.detailPath);
  const Tag = isInteractive ? "button" : "div";

  return (
    <Tag
      type={isInteractive ? "button" : undefined}
      className={`total_experience_framework__pillar ${
        pillar.isResult ? "is-result" : ""
      } ${isInteractive ? "is-clickable" : ""}`}
      onClick={isInteractive ? () => onClick(pillar) : undefined}
      aria-label={
        isInteractive
          ? `Explore ${pillar.title}`
          : undefined
      }
    >
      <span
        className="total_experience_framework__badge"
        style={{ background: pillar.color }}
      >
        {pillar.code}
      </span>
      <h3>{pillar.title}</h3>
      <ul>
        {pillar.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Tag>
  );
};

const TotalExperienceFramework = ({
  inputPillars = totalExperienceInputPillars,
  resultPillar = totalExperienceResultPillar,
  foundations = totalExperienceFoundations,
  meta = totalExperienceFrameworkMeta,
  onPillarClick,
}) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePillarClick = (pillar) => {
    if (onPillarClick) {
      onPillarClick(pillar);
      return;
    }

    if (pillar.detailPath) {
      navigate(pillar.detailPath);
    }
  };

  const getFoundationLabel = (foundation) =>
    typeof foundation === "string" ? foundation : foundation.label;

  return (
    <section
      id="total-experience-framework"
      ref={sectionRef}
      className={`total_experience_framework ${visible ? "animate" : ""}`}
    >
      <div className="total_experience_framework__container">
        <header className="total_experience_framework__header">
          <h2>{meta.title}</h2>
          <p>{meta.subtitle}</p>
        </header>

        <div className="total_experience_framework__equation">
          {inputPillars.map((pillar, index) => (
            <div
              key={pillar.id}
              className="total_experience_framework__equation-group"
            >
              <PillarCard pillar={pillar} onClick={handlePillarClick} />
              {index < inputPillars.length - 1 && (
                <span
                  className="total_experience_framework__operator"
                  aria-hidden="true"
                >
                  +
                </span>
              )}
            </div>
          ))}

          <span className="total_experience_framework__operator" aria-hidden="true">
            =
          </span>

          <PillarCard pillar={resultPillar} onClick={handlePillarClick} />
        </div>

        <div className="total_experience_framework__foundations">
          <span className="total_experience_framework__foundation-label">
            {meta.foundationLabel}
          </span>
          <div className="total_experience_framework__foundation-tags">
            {foundations.map((item) => {
              const label = getFoundationLabel(item);
              const key = typeof item === "string" ? item : item.id;
              const foundationIcons =
                typeof item === "string" ? [] : getFoundationIcons(item);

              return (
                <span key={key} className="total_experience_framework__tag is-static">
                  {foundationIcons.length > 0 ? (
                    <span className="total_experience_framework__tag-icons">
                      {foundationIcons.map(({ id, Icon }) => (
                        <span
                          key={id}
                          className="total_experience_framework__tag-icon"
                        >
                          <Icon />
                        </span>
                      ))}
                    </span>
                  ) : null}
                  <span>{label}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalExperienceFramework;
