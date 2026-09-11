import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { stripHtml } from "../../utils/htmlContent";
import { loadHomeSuccessStories } from "../../utils/publicSuccessStories";
import { homeCarouselStories } from "./successStoriesData";
import "./SuccessStories.scss";

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

const SuccessStories = () => {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [stories, setStories] = useState(homeCarouselStories);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [cardWidth, setCardWidth] = useState(0);

  const loadStories = useCallback(async () => {
    setIsLoading(true);
    try {
      const nextStories = await loadHomeSuccessStories();
      setStories(nextStories.length ? nextStories : homeCarouselStories);
    } catch {
      setStories(homeCarouselStories);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadStories, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadStories]);

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

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth <= 768) {
        setCardsPerView(1);
        return;
      }

      if (window.innerWidth <= 1100) {
        setCardsPerView(2);
        return;
      }

      setCardsPerView(3);
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const updateCardWidth = () => {
      const gap = 20;
      const width =
        (viewport.clientWidth - gap * (cardsPerView - 1)) / cardsPerView;
      setCardWidth(Math.max(0, width));
    };

    updateCardWidth();
    const observer = new ResizeObserver(updateCardWidth);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [cardsPerView, stories.length, isLoading]);

  useEffect(() => {
    setActiveIndex(0);
  }, [stories.length, cardsPerView]);

  const maxIndex = Math.max(0, stories.length - cardsPerView);
  const displayIndex = Math.min(activeIndex, maxIndex);
  const showNav = stories.length > cardsPerView;
  const cardStep = cardWidth > 0 ? cardWidth + 20 : 0;

  const handlePrev = () => {
    setActiveIndex(Math.max(0, displayIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex(Math.min(maxIndex, displayIndex + 1));
  };

  return (
    <section
      id="success-stories"
      className={`success_stories ${visible ? "animate" : ""}`}
      ref={sectionRef}
    >
      <div className="success_stories__container">
        <header className="success_stories__header">
          <span className="success_stories__eyebrow">Strategic Partnership</span>
          <h2>Stories of Transformation</h2>
          <p>
            Together, we deliver connected employee experiences that drive
            productivity, engagement, and business growth at enterprise scale.
          </p>
        </header>

        {isLoading && stories.length === 0 ? (
          <div className="success_stories__state" role="status">
            Loading success stories...
          </div>
        ) : (
          <div className="success_stories__carousel">
            <button
              type="button"
              className="success_stories__nav success_stories__nav--prev"
              onClick={handlePrev}
              disabled={!showNav || displayIndex === 0}
              aria-label="Previous success stories"
            >
              <ChevronIcon direction="left" />
            </button>

            <div className="success_stories__viewport" ref={viewportRef}>
              <div
                className="success_stories__grid"
                style={{
                  transform: `translate3d(-${displayIndex * cardStep}px, 0, 0)`,
                }}
              >
                {stories.map((story) => {
                  const metricValue = story.statValue || story.metricValue;
                  const metricLabel = story.statLabel || story.metricLabel;
                  const slug = story.slug || story.id;

                  return (
                    <Link
                      to={`/success-stories?story=${encodeURIComponent(slug)}`}
                      className="success_stories__card"
                      key={story.id || slug}
                      style={
                        cardWidth > 0
                          ? {
                              flex: `0 0 ${cardWidth}px`,
                              width: `${cardWidth}px`,
                              maxWidth: `${cardWidth}px`,
                            }
                          : undefined
                      }
                    >
                      {(story.industryTag || story.industry) && (
                        <span className="success_stories__tag">
                          {story.industryTag || story.industry}
                        </span>
                      )}

                      <h3>{story.title}</h3>
                      <p className="success_stories__description">
                        {stripHtml(story.description)}
                      </p>

                      {(metricValue || metricLabel || story.metric) && (
                        <div className="success_stories__stat">
                          {metricValue && <strong>{metricValue}</strong>}
                          <span>{metricLabel || story.metric}</span>
                        </div>
                      )}

                      <span className="success_stories__link">
                        Read Case Study
                        <ChevronIcon />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              className="success_stories__nav success_stories__nav--next"
              onClick={handleNext}
              disabled={!showNav || displayIndex >= maxIndex}
              aria-label="Next success stories"
            >
              <ChevronIcon />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SuccessStories;
