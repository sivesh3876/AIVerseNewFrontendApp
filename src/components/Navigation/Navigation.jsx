import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import "./Navigation.scss";
import logo from "../../assets/images/logo.svg";
import search from "../../assets/images/search.svg";
import { HOME_NAV_LINKS, scrollToHomeSection } from "../../utils/homeSections";
import {
  buildSearchNavigationTarget,
  navigateToSearchPath,
  searchSite,
} from "../../utils/siteSearch";
import CallbackScheduleModal from "../CallbackSchedule/CallbackScheduleModal";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [callbackOpen, setCallbackOpen] = useState(false);

  const handleSectionNav = (sectionId) => {
    setMobileMenu(false);

    if (location.pathname === "/") {
      scrollToHomeSection(sectionId);

      if (location.hash !== `#${sectionId}`) {
        navigate(`/#${sectionId}`, { replace: true });
      }

      return;
    }

    navigate(`/#${sectionId}`);
  };

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
          <Link to="/" className="logo" onClick={() => setMobileMenu(false)}>
            <img src={logo} alt="Logo" />
          </Link>

          <div className="hamburger" onClick={() => setMobileMenu(!mobileMenu)}>
            ☰
          </div>

          <ul className={`nav-links ${mobileMenu ? "active" : ""}`}>
            {HOME_NAV_LINKS.map((item) => (
              <li key={item.sectionId}>
                <button
                  type="button"
                  onClick={() => handleSectionNav(item.sectionId)}
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li>
              <Link to="/about-us" onClick={() => setMobileMenu(false)}>
                About Us
              </Link>
            </li>
          </ul>

          <div className="nav-right">
            <button
              type="button"
              className="nav-callback-btn"
              onClick={() => {
                setMobileMenu(false);
                setCallbackOpen(true);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 3v2M17 3v2M4 9h16M6 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path
                  d="M15.5 14.5c.8-.3 1.5-.2 2.1.2l.7.5c.6.4.7 1.2.3 1.8-.5.8-1.4 1.5-2.6 1.7-2.6.4-5.4-1-7.6-3.2S5.2 10.1 5.6 7.5c.2-1.2.9-2.1 1.7-2.6.6-.4 1.4-.3 1.8.3l.5.7c.4.6.5 1.3.2 2.1l-.3.8c-.2.4-.1.8.2 1.1l2.2 2.2c.3.3.7.4 1.1.2l.8-.3Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Schedule a Call
            </button>
            <Link
              to="/admin/login"
              className="nav-admin-link"
              onClick={() => setMobileMenu(false)}
            >
              Login
            </Link>
            <button
              className="icon-btn"
              onClick={() => setShowSearch(!showSearch)}
            >
              <img src={search} alt="Search" />
            </button>
          </div>
        </nav>
      </div>
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
      )}

      <CallbackScheduleModal
        open={callbackOpen}
        onClose={() => setCallbackOpen(false)}
      />
    </>
  );
};

export default Navigation;
