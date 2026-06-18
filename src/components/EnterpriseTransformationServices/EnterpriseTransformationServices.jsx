import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./EnterpriseTransformationServices.scss";
import {
  AgenticAutomationIcon,
  CustomerCommunicationIcon,
  CustomerExperienceIcon,
  CxCrmIcon,
  DataManagementIcon,
  DigitalEngineeringIcon,
  DigitalExperienceIcon,
  ExternalLinkIcon,
  StrategyModernizationIcon,
} from "./ServiceIcons";

const defaultServices = [
  {
    icon: StrategyModernizationIcon,
    iconBg: "#18E0CC",
    title: "Strategy & Modernization",
    exploreServiceId: "strategy-modernization",
    description:
      "AI strategy, roadmap, and legacy system modernization for future-ready enterprises",
  },
  {
    icon: CustomerExperienceIcon,
    iconBg: "#4D90E3",
    title: "Customer Experience",
    exploreServiceId: "customer-experience-crm",
    description:
      "AI-powered personalization and conversational interfaces that delight customers",
  },
  {
    icon: DigitalEngineeringIcon,
    iconBg: "#EF8E29",
    title: "Digital Engineering",
    exploreServiceId: "digital-engineering",
    description:
      "Build AI-native applications with modern cloud-native architectures",
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
    icon: AgenticAutomationIcon,
    iconBg: "#EF8E29",
    title: "Agentic Automation",
    exploreServiceId: "agentic-automation",
    description:
      "Deploy intelligent AI agents for complex business workflows",
  },
  {
    icon: CustomerCommunicationIcon,
    iconBg: "#4D90E3",
    title: "Customer Communication",
    exploreServiceId: "customer-communication-management",
    description:
      "Omnichannel messaging with AI-driven content personalization",
  },
  {
    icon: CxCrmIcon,
    iconBg: "#3A8D9D",
    title: "CX & CRM",
    exploreServiceId: "customer-experience-crm",
    description:
      "AI-enhanced CRM platforms with predictive customer insights",
  },
  {
    icon: DigitalExperienceIcon,
    iconBg: "linear-gradient(135deg, #EF8E29 0%, #18E0CC 100%)",
    title: "Digital Experience",
    exploreServiceId: "digital-experience",
    description:
      "AI-powered digital platforms with advanced personalization",
  },
];

const CARDS_PER_ROW = 4;

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

const EnterpriseTransformationServices = ({
  services = defaultServices,
  onKnowMore,
}) => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
  }, []);

  return (
    <section
      className={`enterprise_services ${visible ? "animate" : ""}`}
      ref={sectionRef}
    >
      <div className="enterprise_services__container">
        <header className="enterprise_services__header">
          <h2>Enterprise Transformation Services</h2>
          <p>
            End-to-end AI transformation services tailored to your business
            needs
          </p>
        </header>

        <div className="enterprise_services__grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            const { className, animationDelay } = getCardAnimation(index);

            return (
              <Link
                className={`enterprise_services__card ${className}`}
                key={service.title}
                style={{ animationDelay }}
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
          })}
        </div>
      </div>
    </section>
  );
};

export default EnterpriseTransformationServices;
