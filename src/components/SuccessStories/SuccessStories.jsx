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

const CARD_GAP = 20;

const storyTimestamp = (story) => {
  const value = story?.publishedAt || story?.createdAt || story?.createdDate || 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const sortStoriesNewestFirst = (stories) =>
  [...stories].sort((left, right) => storyTimestamp(right) - storyTimestamp(left));

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
  const [cardWidth, setCardWidth] = useState(0);

  const loadStories = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchSuccessStories({ includeUnpublished: false });
      const rows = Array.isArray(data)
        ? data
        : data?.items ?? data?.stories ?? data?.data ?? [];
      setStories(
        sortStoriesNewestFirst(
          rows.filter(isPublishedStory).map(normalizeSuccessStory),
        ),
      );
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

    const updateCardWidth = () => {
      const width =
        (viewport.clientWidth - CARD_GAP * (cardsPerView - 1)) / cardsPerView;
      setCardWidth(Math.max(0, width));
    };

    updateCardWidth();
    const observer = new ResizeObserver(updateCardWidth);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [cardsPerView, stories.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [stories.length, cardsPerView]);

  const cardStep = cardWidth + CARD_GAP;
  const maxIndex = Math.max(0, stories.length - cardsPerView);
  const displayIndex = Math.min(activeIndex, maxIndex);
  const showNav = stories.length > cardsPerView;

  const handlePrev = () => {
    setActiveIndex((current) => Math.max(0, Math.min(current, maxIndex) - 1));
  };

  const handleNext = () => {
    setActiveIndex((current) =>
      Math.min(maxIndex, Math.min(current, maxIndex) + 1),
    );
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
                  transform:
                    cardWidth > 0
                      ? `translate3d(-${displayIndex * cardStep}px, 0, 0)`
                      : undefined,
                }}
              >
                {stories.map((story) => {
                  const metricValue = story.statValue || story.metricValue;
                  const metricLabel = story.statLabel || story.metricLabel;
                  const slug = story.slug || story.id;

                  return (
                    <article
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

                      <Link
                        to={`/success-stories?story=${encodeURIComponent(slug)}`}
                        className="success_stories__link"
                      >
                        Read Case Study
                        <ChevronIcon />
                      </Link>
                    </article>
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
