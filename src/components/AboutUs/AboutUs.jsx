import { useRef } from "react";
import { Link } from "react-router-dom";
import { aboutUsValues } from "./aboutUsData";
import { useScrollToSection } from "../../utils/pageScroll";
import "./AboutUs.scss";

const AboutUs = () => {
  const heroRef = useRef(null);

  useScrollToSection(heroRef, []);

  return (
    <div className="about_us">
      <section className="about_us__hero" ref={heroRef}>
        <div className="about_us__hero-inner">
          <p className="about_us__eyebrow">About AI Verse</p>
          <h1>Accelerating Enterprise AI Transformation</h1>
          <p>
            AI Verse is Espire&apos;s dedicated platform for discovering, evaluating,
            and deploying enterprise AI capabilities. We help organizations move from
            AI ambition to measurable business outcomes.
          </p>
        </div>
      </section>

      <section className="about_us__intro">
        <div className="about_us__container">
          <div className="about_us__intro-grid">
            <article>
              <h2>Who We Are</h2>
              <p>
                Espire Infolabs brings decades of experience in digital transformation,
                customer experience, and intelligent automation. AI Verse unifies that
                expertise into a single destination where enterprises can explore AI
                capabilities, industry solutions, and transformation services.
              </p>
              <p>
                From conversational AI and agentic workflows to document intelligence
                and predictive analytics, we design and deliver solutions that integrate
                with your existing technology landscape.
              </p>
            </article>

            <article className="about_us__mission">
              <h3>Our Mission</h3>
              <p>
                To make enterprise AI accessible, actionable, and accountable—empowering
                every organization to innovate responsibly and compete in an AI-first world.
              </p>
              <h3>Our Vision</h3>
              <p>
                A future where intelligent systems augment human expertise across every
                industry, driving growth without compromising trust or compliance.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="about_us__values">
        <div className="about_us__container">
          <header>
            <h2>What We Stand For</h2>
            <p>The principles that guide every AI Verse engagement</p>
          </header>

          <div className="about_us__values-grid">
            {aboutUsValues.map((value) => (
              <article key={value.title} className="about_us__value-card">
                <h4>{value.title}</h4>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about_us__cta">
        <div className="about_us__container">
          <h2>Ready to Transform with AI?</h2>
          <p>
            Explore our capabilities, browse industry solutions, or talk to an expert
            to start your AI journey today.
          </p>
          <div className="about_us__cta-actions">
            <Link to="/#capabilities" className="about_us__btn about_us__btn--primary">
              Explore Capabilities
            </Link>
            <Link to="/get-started" className="about_us__btn about_us__btn--secondary">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
