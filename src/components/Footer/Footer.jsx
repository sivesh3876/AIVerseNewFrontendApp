import { useState } from "react";
import RequestDemoModal from "../CustomerCommunicationManagement/RequestDemoModal";
import "./Footer.scss";

import linkdIn from "../../assets/images/linkdIn.svg";
import twitter from "../../assets/images/twitter.svg";
import facebook from "../../assets/images/facebook.svg";

const footerData = [
  {
    title: "Capabilities",
    links: ["Conversational AI", "Agentic AI", "Automation"],
  },
  {
    title: "Industries",
    links: ["Education", "Healthcare", "Financial"],
  },
  {
    title: "Resources",
    links: ["Blogs", "Whitepapers", "Case Studies"],
  },
  {
    title: "Partners",
    links: ["Microsoft", "Salesforce", "Databricks"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact"],
  },
];

const Footer = () => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const handleFooterLinkClick = (event, link) => {
    if (link !== "Contact") return;

    event.preventDefault();
    setIsContactFormOpen(true);
  };

  return (
    <>
      <footer className="footer">
        <div className="footer_container">
          <div className="footer_list">
            {footerData.map((section) => (
              <div className="list_column" key={section.title}>
                <h5>{section.title}</h5>

                <ul>
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href={link === "Contact" ? "#contact" : "#"}
                        onClick={(event) => handleFooterLinkClick(event, link)}
                      >
                        {link}
                      </a>
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
                    onClick={() => setIsContactFormOpen(true)}
                  >
                    info@aiverse.com
                  </button>
                </li>

                <li>
                  <ul className="social_media">
                    <li>
                      <a href="#" title="LinkedIn">
                        <img src={linkdIn} alt="LinkedIn" />
                      </a>
                    </li>

                    <li>
                      <a href="#" title="Twitter">
                        <img src={twitter} alt="Twitter" />
                      </a>
                    </li>

                    <li>
                      <a href="#" title="Facebook">
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
