import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./EnterpriseTransformationServices.scss";
import {
  AgenticAutomationIcon,
  CustomerCommunicationIcon,
  CxCrmIcon,
  DataManagementIcon,
  DigitalEngineeringIcon,
  DigitalExperienceIcon,
  ExternalLinkIcon,
} from "./ServiceIcons";

const defaultServices = [
  {
    icon: DigitalEngineeringIcon,
    iconBg: "#EF8E29",
    title: "Digital Engineering",
    exploreServiceId: "digital-engineering",
    description:
      "Build AI-native applications with modern cloud-native architectures",
  },
  {
    icon: DigitalExperienceIcon,
    iconBg: "linear-gradient(135deg, #EF8E29 0%, #18E0CC 100%)",
    title: "Digital Experience",
    exploreServiceId: "digital-experience",
    description: "AI-powered digital platforms with advanced personalization",
  },
  {
    icon: CustomerCommunicationIcon,
    iconBg: "#4D90E3",
    title: "Customer Communication Management",
    exploreServiceId: "customer-communication-management",
    description: "Omnichannel messaging with AI-driven content personalization",
  },
  {
    icon: AgenticAutomationIcon,
    iconBg: "#EF8E29",
    title: "Agentic Automation",
    exploreServiceId: "agentic-automation",
    description: "Deploy intelligent AI agents for complex business workflows",
  },
  {
    icon: DataManagementIcon,
    iconBg: "#18E0CC",
    title: "Data Management",
    exploreServiceId: "data-management",
    description:
      "Modern data platforms, governance, and AI-ready data pipelines",
  },
  {
    icon: CxCrmIcon,
    iconBg: "#3A8D9D",
    title: "Enterprise Application",
    exploreServiceId: "enterprise-application",
    description: "AI-enhanced CRM platforms with predictive customer insights",
  },
];

const CARDS_PER_ROW = 3;

const ChevronIcon = ({ direction = "right" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {direction === "left" ? (
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

const getCardAnimation = (index) => {
  const positionInRow = index % CARDS_PER_ROW;
  const rowIndex = Math.floor(index / CARDS_PER_ROW);
  const fromLeft = positionInRow < 2;

  return {
    className: fromLeft
      ? "enterprise_services__card--from-left"
      : "enterprise_services__card--from-right",
    animationDelay: `${rowIndex * 0.55 + positionInRow * 0.1}s`,
  };
};

const ServiceCard = ({ service, onKnowMore, className = "", style }) => {
  const Icon = service.icon;

  return (
    <Link
      className={`enterprise_services__card ${className}`.trim()}
      style={style}
      to={`/explore-solutions?service=${service.exploreServiceId}`}
      onClick={() => onKnowMore?.(service)}
    >
      <div
        className="enterprise_services__icon"
        style={{ background: service.iconBg }}
      >
        <Icon />
      </div>

      <h3>{service.title}</h3>
      <p>{service.description}</p>

      <span className="enterprise_services__link">
        Know More
        <ExternalLinkIcon />
      </span>
    </Link>
  );
};

const EnterpriseTransformationServices = ({
  services = defaultServices,
  onKnowMore,
  disableAnimation = false,
  variant = "default",
  sliderCardsPerView,
}) => {
  const isSlider = variant === "slider";
  const fixedCardsPerView =
    typeof sliderCardsPerView === "number" ? sliderCardsPerView : null;
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const [visible, setVisible] = useState(disableAnimation || isSlider);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(fixedCardsPerView ?? 1);

  useEffect(() => {
    if (disableAnimation || isSlider) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [disableAnimation, isSlider]);

  useEffect(() => {
    if (!isSlider) {
      return undefined;
    }

    if (fixedCardsPerView !== null) {
      setCardsPerView(fixedCardsPerView);
      return undefined;
    }

    const updateCardsPerView = () => {
      const width = carouselRef.current?.clientWidth ?? window.innerWidth;

      if (width >= 720) {
        setCardsPerView(2);
        return;
      }

      setCardsPerView(1);
    };

    updateCardsPerView();

    const observer = carouselRef.current
      ? new ResizeObserver(updateCardsPerView)
      : null;

    if (carouselRef.current && observer) {
      observer.observe(carouselRef.current);
    }

    window.addEventListener("resize", updateCardsPerView);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateCardsPerView);
    };
  }, [fixedCardsPerView, isSlider]);

  const maxIndex = Math.max(0, services.length - cardsPerView);
  const showNav = isSlider && services.length > cardsPerView;
  const visibleServices = isSlider
    ? services.slice(activeIndex, activeIndex + cardsPerView)
    : services;

  useEffect(() => {
    if (!isSlider) {
      return;
    }

    setActiveIndex((current) => Math.min(current, maxIndex));
  }, [isSlider, maxIndex]);

  const handlePrev = () => {
    setActiveIndex((current) => Math.max(0, current - 1));
  };

  const handleNext = () => {
    setActiveIndex((current) => Math.min(maxIndex, current + 1));
  };

  return (
    <section
      id="enterprise-transformation"
      className={`enterprise_services ${
        isSlider ? "enterprise_services--slider" : ""
      } ${visible && !disableAnimation && !isSlider ? "animate" : ""} ${
        disableAnimation || isSlider ? "enterprise_services--static" : ""
      }`}
      ref={sectionRef}
    >
      <div className="enterprise_services__container">
        <header className="enterprise_services__header">
          <h2>AI Capabilities by Service Line</h2>
          {!isSlider ? (
            <p>
              Every Espire service line, mapped to its AI capabilities — with a
              live demo for each
            </p>
          ) : null}
        </header>

        {isSlider ? (
          <div className="enterprise_services__carousel" ref={carouselRef}>
            <div className="enterprise_services__carousel-row">
              <button
                type="button"
                className="enterprise_services__nav enterprise_services__nav--prev"
                onClick={handlePrev}
                disabled={!showNav || activeIndex === 0}
                aria-label="Previous service line"
              >
                <ChevronIcon direction="left" />
              </button>

              <div
                className="enterprise_services__slider-track"
                style={{ "--cards-per-view": cardsPerView }}
              >
                {visibleServices.map((service) => (
                  <ServiceCard
                    key={service.title}
                    service={service}
                    onKnowMore={onKnowMore}
                  />
                ))}
              </div>

              <button
                type="button"
                className="enterprise_services__nav enterprise_services__nav--next"
                onClick={handleNext}
                disabled={!showNav || activeIndex >= maxIndex}
                aria-label="Next service line"
              >
                <ChevronIcon direction="right" />
              </button>
            </div>

            {showNav ? (
              <div
                className="enterprise_services__dots"
                role="tablist"
                aria-label="Service line slides"
              >
                {Array.from({ length: maxIndex + 1 }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`enterprise_services__dot ${
                      activeIndex === index ? "is-active" : ""
                    }`}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-selected={activeIndex === index}
                    role="tab"
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="enterprise_services__grid">
            {services.map((service, index) => {
              const { className, animationDelay } = getCardAnimation(index);

              return (
                <ServiceCard
                  key={service.title}
                  service={service}
                  onKnowMore={onKnowMore}
                  className={className}
                  style={disableAnimation ? undefined : { animationDelay }}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default EnterpriseTransformationServices;
