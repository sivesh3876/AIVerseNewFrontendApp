import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import "./Navigation.scss";
import logo from "../../assets/images/logo.svg";
import search from "../../assets/images/search.svg";
import {
  buildSearchNavigationTarget,
  navigateToSearchPath,
  searchSite,
} from "../../utils/siteSearch";

const Navigation = () => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(
    () => (showSearch ? searchSite(searchQuery) : []),
    [showSearch, searchQuery],
  );

  const goToSearchResult = (path) => {
    setShowSearch(false);
    setSearchQuery("");
    setMobileMenu(false);
    navigateToSearchPath(navigate, path);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    goToSearchResult(buildSearchNavigationTarget(trimmed));
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
  };
  return (
    <>
      <div className="navigation">
        <nav className="navbar">
          <Link to="/" className="logo">
            <img src={logo} alt="Logo" />
          </Link>

          <div
            className="hamburger"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            ☰
          </div>

          <ul className={`nav-links ${mobileMenu ? "active" : ""}`}>
            <li>Capabilities</li>
            <li>Industries</li>
            <li>Success Stories</li>
            <li>Partners</li>
            <li>Learn & Explore</li>
            <li>About Us</li>
          </ul>

          <div className="nav-right">
            <button
              className="icon-btn"
              onClick={() => setShowSearch(!showSearch)}
            >
              <img src={search} alt="Search" />
            </button>
          </div>
        </nav>
      </div>

      {/* Search Bar Below Navbar */}
      {showSearch && (
        <div className="search-dropdown">
          <form className="search-dropdown__form" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Search capabilities, services, industries..."
              autoFocus
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search site"
            />
            <button
              type="button"
              className="close-btn"
              onClick={closeSearch}
              aria-label="Close search"
            >
              ✕
            </button>
          </form>

          {searchQuery.trim() && searchResults.length > 0 && (
            <ul className="search-dropdown__results">
              {searchResults.map((result) => (
                <li key={`${result.type}-${result.title}-${result.path}`}>
                  <button
                    type="button"
                    className="search-dropdown__result"
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

          {searchQuery.trim() && searchResults.length === 0 && (
            <p className="search-dropdown__empty">
              No direct match found. Press Enter to search all solutions.
            </p>
          )}
        </div>
      )}    </>
  );
};

export default Navigation;