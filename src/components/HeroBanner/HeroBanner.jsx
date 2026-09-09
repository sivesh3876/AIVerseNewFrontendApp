// import { Link } from "react-router-dom";
import "./HeroBanner.scss";
import slider1 from "../../assets/images/slider1.svg";
import { useRegistrationReminder } from "../../context/RegistrationReminderContext";
import GlobalSearch from "../GlobalSearch";
import HomeCapabilitiesPreview from "../ComprehensiveAICapabilities/HomeCapabilitiesPreview";
import HeroJourneySteps from "./HeroJourneySteps";

const HERO_SEARCH_FORM_ID = "hero-banner-search";

const heroSlide = {
  image: slider1,
  desc: "Try live AI use cases accross insurance, logistics, banking, education and more. No account required. Just explore, interact and discover what's possible.",
};

const HeroBannerSlider = () => {
  const { openRegisterModal } = useRegistrationReminder();

  return (
    <section
      className="hero_slider"
      style={{ backgroundImage: `url(${heroSlide.image})` }}
    >
      <div className="hero_slider__overlay" aria-hidden="true" />

      <div className="hero_content">
        <h1>
          See what AI can do for your{" "}
          <span className="hero_content__accent">Industry</span> - right now
        </h1>
      </div>
      <div className="hero_desc">
        <p>{heroSlide.desc}</p>
      </div>

      <div className="hero_cta_card">
        <div className="hero_cta_card__body">
          <div className="hero_cta_card__search">
            <GlobalSearch
              variant="hero-card"
              placeholder="Ask me anything"
              formId={HERO_SEARCH_FORM_ID}
              hideSubmit
            />
          </div>

          <HeroJourneySteps
            onCreateAccount={() => openRegisterModal("Hero Registration")}
          />

          <p className="hero_cta_card__disclaimer">
            *Content is generated with AI assistance*
          </p>
        </div>
      </div>

      <div className="hero_capabilities">
        <div className="hero_capabilities__header">
          <h2>Live AI use cases — try them now</h2>
          <p>Click any card to launch a live demo in seconds</p>
          <button
            type="button"
            className="primary_btn hero_capabilities__cta"
            onClick={() => openRegisterModal("Hero Readiness CTA")}
          >
            Improve your readiness
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M7 17 17 7M17 7H9M17 7v8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <HomeCapabilitiesPreview />
      </div>
    </section>
  );
};

export default HeroBannerSlider;
