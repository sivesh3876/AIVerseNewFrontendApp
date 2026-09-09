import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  totalExperienceFoundations,
  totalExperienceFrameworkMeta,
  totalExperienceInputPillars,
  totalExperienceResultPillar,
} from "../../data/totalExperienceData";
import { getFoundationIcons } from "./FoundationIcons";
import { queueFoundationHighlight } from "../../utils/foundationNavigation";
import { scrollToHomeSection } from "../../utils/homeSections";
import "./TotalExperienceFramework.scss";

const PORTAL_MAX_HIGHLIGHTS = 2;

const PillarCard = ({ pillar, onClick, maxHighlights }) => {
  const isInteractive = Boolean(pillar.detailPath);
  const Tag = isInteractive ? "button" : "div";
  const highlights =
    typeof maxHighlights === "number"
      ? pillar.highlights.slice(0, maxHighlights)
      : pillar.highlights;

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
        {highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Tag>
  );
};

const ChevronIcon = ({ direction = "right" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {direction === "left" ? (
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

const PortalFrameworkRow = ({ children, className = "" }) => {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const [needsCarousel, setNeedsCarousel] = useState(false);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track) {
      return;
    }

    const overflow = Math.ceil(track.scrollWidth - viewport.clientWidth);
    const nextMaxOffset = Math.max(0, overflow);

    setNeedsCarousel(overflow > 2);
    setMaxOffset(nextMaxOffset);
    setOffset((current) => Math.min(current, nextMaxOffset));
  }, []);

  useEffect(() => {
    measure();

    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport) {
      return undefined;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);

    if (track) {
      observer.observe(track);
    }

    return () => observer.disconnect();
  }, [measure, children]);

  const scrollBy = (direction) => {
    const viewport = viewportRef.current;
    const step = viewport
      ? Math.max(160, Math.round(viewport.clientWidth * 0.72))
      : 200;

    setOffset((current) => {
      const next = current + direction * step;
      return Math.max(0, Math.min(maxOffset, next));
    });
  };

  return (
    <div
      className={`txf_portal_row ${needsCarousel ? "txf_portal_row--carousel" : ""} ${className}`}
    >
      {needsCarousel ? (
        <button
          type="button"
          className="txf_portal_row__nav txf_portal_row__nav--prev"
          onClick={() => scrollBy(-1)}
          disabled={offset <= 0}
          aria-label="Scroll framework blocks left"
        >
          <ChevronIcon direction="left" />
        </button>
      ) : null}

      <div className="txf_portal_row__viewport" ref={viewportRef}>
        <div
          className="txf_portal_row__track"
          ref={trackRef}
          style={needsCarousel ? { transform: `translateX(-${offset}px)` } : undefined}
        >
          {children}
        </div>
      </div>

      {needsCarousel ? (
        <button
          type="button"
          className="txf_portal_row__nav txf_portal_row__nav--next"
          onClick={() => scrollBy(1)}
          disabled={offset >= maxOffset}
          aria-label="Scroll framework blocks right"
        >
          <ChevronIcon direction="right" />
        </button>
      ) : null}
    </div>
  );
};

const TotalExperienceFramework = ({
  inputPillars = totalExperienceInputPillars,
  resultPillar = totalExperienceResultPillar,
  foundations = totalExperienceFoundations,
  meta = totalExperienceFrameworkMeta,
  onPillarClick,
  variant = "default",
}) => {
  const isPortal = variant === "portal";
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(isPortal);

  useEffect(() => {
    if (isPortal) {
      return undefined;
    }

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
  }, [isPortal]);

  const handlePillarClick = (pillar) => {
    if (onPillarClick) {
      onPillarClick(pillar);
      return;
    }

    if (pillar.detailPath) {
      navigate(pillar.detailPath);
    }
  };

  const handleFoundationClick = (foundation) => {
    if (typeof foundation === "string" || !foundation?.id) {
      return;
    }

    queueFoundationHighlight(foundation.id);
    scrollToHomeSection("capabilities");
  };

  const getFoundationLabel = (foundation) =>
    typeof foundation === "string" ? foundation : foundation.label;

  const pillarCardProps = isPortal
    ? { maxHighlights: PORTAL_MAX_HIGHLIGHTS }
    : {};

  const renderFoundationTags = () =>
    foundations.map((item) => {
      const label = getFoundationLabel(item);
      const key = typeof item === "string" ? item : item.id;
      const foundationIcons =
        typeof item === "string" ? [] : getFoundationIcons(item);

      return (
        <button
          key={key}
          type="button"
          className="total_experience_framework__tag is-clickable"
          onClick={() => handleFoundationClick(item)}
          aria-label={`Explore solutions for ${label}`}
        >
          {foundationIcons.length > 0 ? (
            <span className="total_experience_framework__tag-icons">
              {foundationIcons.map(({ id, Icon }) => (
                <span key={id} className="total_experience_framework__tag-icon">
                  <Icon />
                </span>
              ))}
            </span>
          ) : null}
          <span>{label}</span>
        </button>
      );
    });

  return (
    <section
      id="total-experience-framework"
      ref={sectionRef}
      className={`total_experience_framework ${
        isPortal ? "total_experience_framework--portal" : ""
      } ${visible && !isPortal ? "animate" : ""}`}
    >
      <div className="total_experience_framework__container">
        <header className="total_experience_framework__header">
          <h2>{meta.title}</h2>
          {!isPortal ? <p>{meta.subtitle}</p> : null}
        </header>

        {isPortal ? (
          <>
            <PortalFrameworkRow className="total_experience_framework__portal-equation">
              {inputPillars.flatMap((pillar, index) => {
                const items = [
                  <PillarCard
                    key={pillar.id}
                    pillar={pillar}
                    onClick={handlePillarClick}
                    {...pillarCardProps}
                  />,
                ];

                if (index < inputPillars.length - 1) {
                  items.push(
                    <span
                      key={`operator-plus-${pillar.id}`}
                      className="total_experience_framework__operator"
                      aria-hidden="true"
                    >
                      +
                    </span>,
                  );
                }

                return items;
              })}

              <span
                className="total_experience_framework__operator"
                aria-hidden="true"
              >
                =
              </span>

              <PillarCard
                pillar={resultPillar}
                onClick={handlePillarClick}
                {...pillarCardProps}
              />
            </PortalFrameworkRow>
          </>
        ) : (
          <>
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

              <span
                className="total_experience_framework__operator"
                aria-hidden="true"
              >
                =
              </span>

              <PillarCard pillar={resultPillar} onClick={handlePillarClick} />
            </div>

            <div className="total_experience_framework__foundations">
              <span className="total_experience_framework__foundation-label">
                {meta.foundationLabel}
              </span>
              <div className="total_experience_framework__foundation-tags">
                {renderFoundationTags()}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TotalExperienceFramework;
