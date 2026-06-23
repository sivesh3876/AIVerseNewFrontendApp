import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./ComprehensiveAICapabilities.scss";
import { homeCapabilities as defaultCapabilities } from "../AICapabilitiesExplore/aiCapabilitiesData";

const ComprehensiveAICapabilities = ({ capabilities = defaultCapabilities }) => {
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
      id="capabilities"
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
                key={capability.id}
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <div className="ai_capabilities__icon">
                  <Icon />
                </div>

                <h3>{capability.title}</h3>
                <p>{capability.description}</p>

                <Link
                  to={`/ai-capabilities?capability=${capability.id}`}
                  className="ai_capabilities__link"
                >
                  Learn More &gt;
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ComprehensiveAICapabilities;
