import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RequestDemoModal from "../CustomerCommunicationManagement/RequestDemoModal";
import { useRegistrationReminder } from "../../context/RegistrationReminderContext";
import { setRegistrationReturnUrl } from "../../utils/registrationReturnUrl";
import "./Footer.scss";

import linkdIn from "../../assets/images/linkdIn.svg";
import twitter from "../../assets/images/twitter.svg";
import facebook from "../../assets/images/facebook.svg";
import { footerSections } from "./footerData";

const Footer = () => {
  const navigate = useNavigate();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const { isAppAccessGranted, openRegisterModal } = useRegistrationReminder();

  const handleInternalLinkClick = (event, to) => {
    // Public "Login" unlocks full Home — never open Admin Portal from site chrome.
    if (to === "/admin/login") {
      event.preventDefault();
      if (isAppAccessGranted) {
        navigate("/");
        return;
      }
      setRegistrationReturnUrl("/");
      openRegisterModal("Login");
      return;
    }

    if (isAppAccessGranted) return;
    event.preventDefault();
    setRegistrationReturnUrl(to || "/");
    openRegisterModal("Footer gate");
  };

  const handleContactClick = () => {
    if (!isAppAccessGranted) {
      setRegistrationReturnUrl("/");
      openRegisterModal("Footer gate");
      return;
    }
    setIsContactFormOpen(true);
  };

  return (
    <>
      <footer className="footer">
        <div className="footer_container">
          <div className="footer_list">
            {footerSections.map((section) => (
              <div className="list_column" key={section.title}>
                <h5>{section.title}</h5>

                <ul>
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        onClick={(event) =>
                          handleInternalLinkClick(event, link.to)
                        }
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="list_column">
              <h5>Contact</h5>

              <ul>
                <li>
                  <button
                    type="button"
                    className="footer_contact_button"
                    onClick={handleContactClick}
                  >
                    info@aiverse.com
                  </button>
                </li>

                <li>
                  <ul className="social_media">
                    <li>
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noreferrer"
                        title="LinkedIn"
                      >
                        <img src={linkdIn} alt="LinkedIn" />
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noreferrer"
                        title="Twitter"
                      >
                        <img src={twitter} alt="Twitter" />
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noreferrer"
                        title="Facebook"
                      >
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

      {isContactFormOpen && (
        <RequestDemoModal
          mode="contact"
          onClose={() => setIsContactFormOpen(false)}
        />
      )}
    </>
  );
};

export default Footer;
