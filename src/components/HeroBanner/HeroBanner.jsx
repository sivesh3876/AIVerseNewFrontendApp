import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HeroBanner.scss";
import slider1 from "../../assets/images/slider1.svg";
import slider2 from "../../assets/images/slider2.svg";
import slider3 from "../../assets/images/slider1.svg";

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
    secondaryBtn: "Get Started",
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
    secondaryBtn: "Get Started",
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
    secondaryBtn: "Get Started",
  },
];

const HeroBannerSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="hero_slider"
      style={{ backgroundImage: `url(${slides[activeSlide].image})` }}
    >
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

            <Link to="/get-started" className="secondary_btn">
              {slides[activeSlide].secondaryBtn}
            </Link>
          </div>
        </div>
      </div>

      <div className="slider_dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={activeSlide === index ? "active" : ""}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBannerSlider;
