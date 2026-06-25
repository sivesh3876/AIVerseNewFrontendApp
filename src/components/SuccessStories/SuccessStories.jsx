import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./SuccessStories.scss";
import { homeCarouselStories as defaultStories } from "./successStoriesData";

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

const SuccessStories = ({ stories = defaultStories }) => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

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

  const maxIndex = Math.max(0, stories.length - cardsPerView);
  const visibleStories = stories.slice(activeIndex, activeIndex + cardsPerView);
  const showNav = stories.length > cardsPerView;

  const handlePrev = () => {
    setActiveIndex((current) => Math.max(0, current - 1));
  };

  const handleNext = () => {
    setActiveIndex((current) => Math.min(maxIndex, current + 1));
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

        <div className="success_stories__carousel">
          <button
            type="button"
            className="success_stories__nav success_stories__nav--prev"
            onClick={handlePrev}
            disabled={!showNav || activeIndex === 0}
            aria-label="Previous success stories"
          >
            <ChevronIcon direction="left" />
          </button>

          <div className="success_stories__grid">
            {visibleStories.map((story) => (
              <article className="success_stories__card" key={story.id}>
                <span className="success_stories__tag">{story.industryTag}</span>

                <h3>{story.title}</h3>
                <p className="success_stories__description">{story.description}</p>

                <div className="success_stories__stat">
                  <strong>{story.statValue}</strong>
                  <span>{story.statLabel}</span>
                </div>

                <Link
                  to={`/success-stories?story=${story.id}`}
                  className="success_stories__link"
                >
                  Read Case Study
                  <ChevronIcon />
                </Link>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="success_stories__nav success_stories__nav--next"
            onClick={handleNext}
            disabled={!showNav || activeIndex >= maxIndex}
            aria-label="Next success stories"
          >
            <ChevronIcon />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
