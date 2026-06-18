import { useState, useEffect, useRef } from "react";
import "./ExploreAISolutions.scss";
import searchIcon from "../../assets/images/search-teal.svg";
import robotIcon from "../../assets/images/robot.svg";

const defaultTags = [
  "Conversational AI",
  "Healthcare",
  "Automation",
  "Financial Services",
];

const ExploreAISolutions = ({ tags = defaultTags, onSearch, onTagClick }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(query.trim());
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    onTagClick?.(tag);
  };

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`explore_ai_solutions ${isVisible ? "animate" : ""}`}
    >
      <div className="explore_ai_solutions__content">
        <h1>Explore AI Solutions</h1>
        <p>
          Discover transformative AI capabilities across industries and use
          cases
        </p>

        <form className="explore_ai_solutions__search" onSubmit={handleSubmit}>
          <img
            src={searchIcon}
            alt=""
            className="explore_ai_solutions__search-icon"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search capabilities, industries, use cases..."
            aria-label="Search AI capabilities, industries, and use cases"
          />
          <img
            src={robotIcon}
            alt=""
            className="explore_ai_solutions__robot-icon"
            aria-hidden="true"
          />
        </form>

        <div className="explore_ai_solutions__tags">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="explore_ai_solutions__tag"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreAISolutions;
