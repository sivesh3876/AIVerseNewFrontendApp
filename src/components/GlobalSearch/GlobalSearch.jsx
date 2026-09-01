import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  buildSearchNavigationTarget,
  loadSolutionSearchEntries,
  navigateToSearchPath,
  searchSite,
} from "../../utils/siteSearch";
import "./GlobalSearch.scss";

const GlobalSearch = ({
  variant = "hero",
  placeholder = "Search capabilities, services, industries...",
  className = "",
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [solutionEntries, setSolutionEntries] = useState([]);

  useEffect(() => {
    let isMounted = true;

    loadSolutionSearchEntries()
      .then((entries) => {
        if (isMounted) {
          setSolutionEntries(entries);
        }
      })
      .catch(() => {
        // Static catalog still works if solutions fail to load.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const searchResults = useMemo(
    () =>
      isFocused || searchQuery
        ? searchSite(searchQuery, 10, solutionEntries)
        : [],
    [isFocused, searchQuery, solutionEntries],
  );

  const goToSearchResult = (path) => {
    setSearchQuery("");
    setIsFocused(false);
    navigateToSearchPath(navigate, path);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    goToSearchResult(buildSearchNavigationTarget(trimmed, solutionEntries));
  };

  const showResults = searchQuery.trim().length > 0;
  const rootClassName = [
    "global-search",
    `global-search--${variant}`,
    isFocused ? "global-search--focused" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      <form className="global-search__form" onSubmit={handleSearchSubmit}>
        <span className="global-search__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M20 20l-3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <input
          type="search"
          className="global-search__input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setIsFocused(false), 150);
          }}
          aria-label="Search site"
          aria-expanded={showResults}
          aria-controls="global-search-results"
        />

        <button type="submit" className="global-search__submit">
          Search
        </button>
      </form>

      {showResults && searchResults.length > 0 && (
        <ul
          id="global-search-results"
          className="global-search__results"
          role="listbox"
        >
          {searchResults.map((result) => (
            <li
              key={`${result.type}-${result.title}-${result.path}`}
              role="option"
            >
              <button
                type="button"
                className="global-search__result"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => goToSearchResult(result.path)}
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

      {showResults && searchResults.length === 0 && (
        <p className="global-search__empty" id="global-search-results">
          No direct match found. Press Enter to search all solutions.
        </p>
      )}
    </div>
  );
};

export default GlobalSearch;
