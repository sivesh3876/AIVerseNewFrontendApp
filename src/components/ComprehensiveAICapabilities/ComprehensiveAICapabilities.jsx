import { useEffect, useRef, useState } from "react";
import "./ComprehensiveAICapabilities.scss";
import {
  AgenticAIIcon,
  AdvancedNLPIcon,
  ComputerVisionIcon,
  ConversationalAIIcon,
  DocumentIntelligenceIcon,
  EnterpriseSearchIcon,
  GenerativeAIIcon,
  IntelligentAutomationIcon,
  KnowledgeAssistantsIcon,
  MultiLanguageAIIcon,
  PredictiveAnalyticsIcon,
  RecommendationEnginesIcon,
} from "./CapabilityIcons";

const defaultCapabilities = [
  {
    icon: ConversationalAIIcon,
    title: "Conversational AI",
    description: "Natural language interfaces",
  },
  {
    icon: AgenticAIIcon,
    title: "Agentic AI",
    description: "Autonomous AI agents",
  },
  {
    icon: AdvancedNLPIcon,
    title: "Advanced NLP",
    description: "Language understanding",
  },
  {
    icon: ComputerVisionIcon,
    title: "Computer Vision",
    description: "Visual intelligence",
  },
  {
    icon: DocumentIntelligenceIcon,
    title: "Document Intelligence",
    description: "Automated processing",
  },
  {
    icon: PredictiveAnalyticsIcon,
    title: "Predictive Analytics",
    description: "Data-driven forecasting",
  },
  {
    icon: IntelligentAutomationIcon,
    title: "Intelligent Automation",
    description: "Process automation",
  },
  {
    icon: RecommendationEnginesIcon,
    title: "Recommendation Engines",
    description: "Personalization",
  },
  {
    icon: MultiLanguageAIIcon,
    title: "Multi-language AI",
    description: "Cross-language support",
  },
  {
    icon: KnowledgeAssistantsIcon,
    title: "Knowledge Assistants",
    description: "Knowledge management",
  },
  {
    icon: GenerativeAIIcon,
    title: "Generative AI",
    description: "Content generation",
  },
  {
    icon: EnterpriseSearchIcon,
    title: "Enterprise Search",
    description: "Intelligent search",
  },
];

const ComprehensiveAICapabilities = ({
  capabilities = defaultCapabilities,
  onLearnMore,
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
      className={`ai_capabilities ${visible ? "animate" : ""}`}
      ref={sectionRef}
    >
      <div className="ai_capabilities__container">
        <header className="ai_capabilities__header">
          <h2>Comprehensive AI Capabilities</h2>
          <p>
            Enterprise-grade AI solutions designed for real-world business
            challenges
          </p>
        </header>

        <div className="ai_capabilities__grid">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;

            return (
              <article
                className="ai_capabilities__card"
                key={capability.title}
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <div className="ai_capabilities__icon">
                  <Icon />
                </div>

                <h3>{capability.title}</h3>
                <p>{capability.description}</p>

                <button
                  type="button"
                  className="ai_capabilities__link"
                  onClick={() => onLearnMore?.(capability)}
                >
                  Learn More &gt;
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ComprehensiveAICapabilities;
