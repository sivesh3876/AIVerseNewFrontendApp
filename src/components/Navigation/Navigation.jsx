import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navigation.scss";
import logo from "../../assets/images/logo.svg";
import search from "../../assets/images/search.svg";
import user from "../../assets/images/user.svg";
import { HOME_NAV_LINKS, scrollToHomeSection } from "../../utils/homeSections";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

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

  return (
    <>
      <div className="navigation">
        <nav className="navbar">
          <Link to="/" className="logo" onClick={() => setMobileMenu(false)}>
            <img src={logo} alt="Logo" />
          </Link>

          <div
            className="hamburger"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
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
              className="icon-btn"
              onClick={() => setShowSearch(!showSearch)}
            >
              <img src={search} alt="Search" />
            </button>

            <div className="user">
              <img src={user} alt="User" />
              <span>John Doe</span>
            </div>
          </div>
        </nav>
      </div>

      {showSearch && (
        <div className="search-dropdown">
          <input
            type="text"
            placeholder="Search..."
            autoFocus
          />

          <button
            className="close-btn"
            onClick={() => setShowSearch(false)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default Navigation;
