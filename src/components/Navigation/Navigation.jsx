import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navigation.scss";
import logo from "../../assets/images/logo.svg";
import search from "../../assets/images/search.svg";
import user from "../../assets/images/user.svg";

const Navigation = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

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

            <div className="user">
              <img src={user} alt="User" />
              <span>John Doe</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Search Bar Below Navbar */}
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