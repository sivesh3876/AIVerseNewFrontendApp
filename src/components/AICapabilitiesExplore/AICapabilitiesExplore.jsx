import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddAISolutionCard from "../AddAISolutionCard";
import TalkToExpertCard from "../TalkToExpertCard";
import { useScrollToSection } from "../../utils/pageScroll";
import {
  aiCapabilitiesData,
  getCapabilityIndexById,
} from "./aiCapabilitiesData";
import "./AICapabilitiesExplore.scss";

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#3A8D9D" strokeWidth="1.75" />
    <path d="m8 12 2.5 2.5L16 9" stroke="#3A8D9D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AICapabilitiesExplore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const capabilityId = searchParams.get("capability");
  const [activeIndex, setActiveIndex] = useState(() =>
    getCapabilityIndexById(capabilityId),
  );
  const mainRef = useRef(null);

  useEffect(() => {
    setActiveIndex(getCapabilityIndexById(capabilityId));
  }, [capabilityId]);

  useScrollToSection(mainRef, [capabilityId]);

  const activeCapability = aiCapabilitiesData[activeIndex];
  const BannerIcon = activeCapability.navIcon;

  const handleCapabilityChange = (index) => {
    setActiveIndex(index);
    navigate(`/ai-capabilities?capability=${aiCapabilitiesData[index].id}`, {
      replace: true,
    });
  };

  return (
    <div className="ai_cap_explore">
      <aside className="ai_cap_explore__sidebar">
        <nav className="ai_cap_explore__nav" aria-label="AI capabilities">
          <h2>ALL AI CAPABILITIES</h2>
          <ul>
            {aiCapabilitiesData.map((capability, index) => {
              const isActive = index === activeIndex;
              const NavIcon = capability.navIcon;

              return (
                <li key={capability.id}>
                  <button
                    type="button"
                    className={`ai_cap_explore__nav-item${isActive ? " is-active" : ""}`}
                    onClick={() => handleCapabilityChange(index)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="ai_cap_explore__nav-icon" aria-hidden="true">
                      <NavIcon />
                    </span>
                    <span className="ai_cap_explore__nav-label">{capability.title}</span>
                    {isActive && (
                      <span className="ai_cap_explore__nav-arrow" aria-hidden="true">
                        &rsaquo;
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <AddAISolutionCard />
        <TalkToExpertCard />
      </aside>

      <main className="ai_cap_explore__main" key={activeCapability.id} ref={mainRef}>
        <section className="ai_cap_explore__banner">
          <div className="ai_cap_explore__banner-header">
            <div className="ai_cap_explore__banner-icon" aria-hidden="true">
              <BannerIcon />
            </div>
            <div className="ai_cap_explore__banner-copy">
              <h1>{activeCapability.title}</h1>
              <p>{activeCapability.subtitle}</p>
            </div>
          </div>

          <div className="ai_cap_explore__banner-body">
            <ul className="ai_cap_explore__features">
              {activeCapability.features.map((feature) => (
                <li key={feature}>
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ai_cap_explore__content">
          <h2>{activeCapability.contentHeading}</h2>
          <div className="ai_cap_explore__content-body">
            {activeCapability.contentParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="ai_cap_explore__highlights">
            <h3>Key Outcomes</h3>
            <div className="ai_cap_explore__highlights-grid">
              {activeCapability.highlights.map((highlight) => (
                <article key={highlight.title} className="ai_cap_explore__highlight">
                  <h4>{highlight.title}</h4>
                  <p>{highlight.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AICapabilitiesExplore;
