import { useState } from "react";
import { Link } from "react-router-dom";
import "./HeroBanner.scss";
import slider1 from "../../assets/images/slider1.svg";
import slider2 from "../../assets/images/slider2.svg";
import slider3 from "../../assets/images/slider1.svg";
import { useRegistrationReminder } from "../../context/RegistrationReminderContext";
import GlobalSearch from "../GlobalSearch";

const slides = [
  {
    image: slider1,
    title: "Transform Customer Interactions with AI",
    description:
      "Deliver personalized, seamless experiences across all touchpoints with AI-powered solutions that understand and anticipate customer needs.",
    bullets: [
      "Conversational AI & Intelligent Chatbots",
      "Hyper-Personalization at Scale",
      "Seamless Omnichannel Support",
    ],
    primaryBtn: "Explore Solutions",
    secondaryBtn: "Register",
  },
  {
    image: slider2,
    title: "Optimize Operations with AI",
    description:
      "Drive efficiency and innovation with intelligent automation, predictive insights, and data-driven decision making across your enterprise.",
    bullets: [
      "Advanced Process Intelligence",
      "End-to-End Intelligent Automation",
      "Predictive Operational Analytics",
    ],
    primaryBtn: "Explore Solutions",
    secondaryBtn: "Register",
  },
  {
    image: slider3,
    title: "Transform Customer Interactions with AI",
    description:
      "Deliver personalized, seamless experiences across all touchpoints with AI-powered solutions that understand and anticipate customer needs.",
    bullets: [
      "Conversational AI & Intelligent Chatbots",
      "Hyper-Personalization at Scale",
      "Seamless Omnichannel Support",
    ],
    primaryBtn: "Explore Solutions",
    secondaryBtn: "Register",
  },
];

const HeroBannerSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const { openRegisterModal } = useRegistrationReminder();

  const goToPrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="hero_slider"
      style={{ backgroundImage: `url(${slides[activeSlide].image})` }}
    >
      <button
        type="button"
        className="hero_arrow hero_arrow--prev"
        aria-label="Previous slide"
        onClick={goToPrevSlide}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        className="hero_arrow hero_arrow--next"
        aria-label="Next slide"
        onClick={goToNextSlide}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="hero_search">
        <GlobalSearch variant="hero" />
      </div>
      <div className="hero_content">
        <div className="hero_content_info" key={activeSlide}>
          <h1>{slides[activeSlide].title}</h1>

          <p>{slides[activeSlide].description}</p>

          <ul>
            {slides[activeSlide].bullets.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <div className="cta_group">
            <Link to="/explore-solutions" className="primary_btn">
              {slides[activeSlide].primaryBtn}
            </Link>

            <button
              type="button"
              className="secondary_btn register_btn"
              onClick={() => openRegisterModal("Hero Registration")}
            >
              {slides[activeSlide].secondaryBtn}
            </button>

            <Link
              to="/ai-readiness-assessment"
              className="secondary_btn assessment_btn"
            >
              AI Readiness Assessment
            </Link>
          </div>
        </div>
      </div>

      <div className="slider_dots" role="tablist" aria-label="Hero pages">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-label={`Go to page ${index + 1}`}
            aria-selected={activeSlide === index}
            className={activeSlide === index ? "active" : ""}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBannerSlider;
