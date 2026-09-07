import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchSuccessStories } from "../../services/successStoriesApiService";
import { stripHtml } from "../../utils/htmlContent";
import { normalizeSuccessStory } from "../../utils/successStoryAdminUtils";
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

const isPublishedStory = (story) => {
  const status =
    story?.status ??
    story?.Status ??
    story?.recordStatus ??
    story?.PublicationStatus;
  return !status || String(status).toLowerCase() === "published";
};

const SuccessStories = () => {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [cardStep, setCardStep] = useState(0);

  const loadStories = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchSuccessStories({ includeUnpublished: false });
      const rows = Array.isArray(data)
        ? data
        : data?.items ?? data?.stories ?? data?.data ?? [];
      setStories(rows.filter(isPublishedStory).map(normalizeSuccessStory));
    } catch (loadError) {
      setStories([]);
      setError(loadError?.message || "Unable to load success stories.");
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

    const updateCardStep = () => {
      const gap = 20;
      const cardWidth =
        (viewport.clientWidth - gap * (cardsPerView - 1)) / cardsPerView;
      setCardStep(Math.max(0, cardWidth + gap));
    };

    updateCardStep();
    const observer = new ResizeObserver(updateCardStep);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [cardsPerView]);

  useEffect(() => {
    setActiveIndex(0);
  }, [stories.length, cardsPerView]);

  const maxIndex = Math.max(0, stories.length - cardsPerView);
  const displayIndex = Math.min(activeIndex, maxIndex);
  const showNav = stories.length > cardsPerView;

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

        {isLoading ? (
          <div className="success_stories__state" role="status">
            Loading success stories...
          </div>
        ) : error ? (
          <div className="success_stories__state success_stories__state--error">
            <p>{error}</p>
            <button type="button" onClick={loadStories}>Retry</button>
          </div>
        ) : stories.length === 0 ? (
          <div className="success_stories__state">
            No success stories are available yet.
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
