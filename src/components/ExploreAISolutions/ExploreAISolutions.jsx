import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ExploreAISolutions.scss";
import searchIcon from "../../assets/images/search-teal.svg";
import robotIcon from "../../assets/images/robot.svg";
import { navigateToSearchPath, navigateToSiteSearch, searchSite } from "../../utils/siteSearch";

const defaultTags = [
  "Conversational AI",
  "Healthcare",
  "Automation",
  "Financial Services",
];

const ExploreAISolutions = ({ tags = defaultTags, onSearch, onTagClick }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchWrapRef = useRef(null);

  const searchResults = useMemo(
    () => (showResults && query.trim() ? searchSite(query) : []),
    [showResults, query],
  );

  const runSearch = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setShowResults(false);
    setQuery("");

    if (onSearch) {
      onSearch(trimmed);
      return;
    }

    navigateToSiteSearch(navigate, trimmed);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runSearch(query);
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    if (onTagClick) {
      onTagClick(tag);
      return;
    }
    runSearch(tag);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

        <div className="explore_ai_solutions__search-wrap" ref={searchWrapRef}>
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
              onChange={(event) => {
                setQuery(event.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
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

          {showResults && query.trim() && searchResults.length > 0 && (
            <ul className="explore_ai_solutions__results">
              {searchResults.map((result) => (
                <li key={`${result.type}-${result.title}-${result.path}`}>
                  <button
                    type="button"
                    className="explore_ai_solutions__result"
                    onClick={() => {
                      setShowResults(false);
                      setQuery("");
                      navigateToSearchPath(navigate, result.path);
                    }}
                  >
                    <strong>{result.title}</strong>
                    <span>
                      {result.subtitle || result.description || result.type}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

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
