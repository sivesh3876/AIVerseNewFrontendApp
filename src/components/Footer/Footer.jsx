import { Link } from "react-router-dom";
import "./Footer.scss";

import linkdIn from "../../assets/images/linkdIn.svg";
import twitter from "../../assets/images/twitter.svg";
import facebook from "../../assets/images/facebook.svg";
import { footerSections } from "./footerData";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_container">
        <div className="footer_list">
          {footerSections.map((section) => (
            <div className="list_column" key={section.title}>
              <h5>{section.title}</h5>

              <ul>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="list_column">
            <h5>Contact</h5>

            <ul>
              <li>
                <a href="mailto:info@aiverse.com">info@aiverse.com</a>
              </li>

              <li>
                <ul className="social_media">
                  <li>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn">
                      <img src={linkdIn} alt="LinkedIn" />
                    </a>
                  </li>

                  <li>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Twitter">
                      <img src={twitter} alt="Twitter" />
                    </a>
                  </li>

                  <li>
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook">
                      <img src={facebook} alt="Facebook" />
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer_copyright">
          <p>© 2026 AI Verse by Espire. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
