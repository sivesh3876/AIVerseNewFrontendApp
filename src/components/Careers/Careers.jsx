import { useRef } from "react";
import { Link } from "react-router-dom";
import { careerBenefits, openRoles } from "./careersData";
import { useScrollToSection } from "../../utils/pageScroll";
import "./Careers.scss";

const Careers = () => {
  const heroRef = useRef(null);

  useScrollToSection(heroRef, []);

  return (
    <div className="careers">
      <section className="careers__hero" ref={heroRef}>
        <div className="careers__hero-inner">
          <p className="careers__eyebrow">Careers at AI Verse</p>
          <h1>Shape the Future of Enterprise AI</h1>
          <p>
            Join Espire&apos;s AI Verse team and help organizations worldwide
            discover, deploy, and scale intelligent solutions that deliver real impact.
          </p>
        </div>
      </section>

      <section className="careers__benefits">
        <div className="careers__container">
          <header>
            <h2>Why Join Us</h2>
            <p>Build your career at the intersection of AI innovation and enterprise transformation</p>
          </header>

          <div className="careers__benefits-grid">
            {careerBenefits.map((benefit) => (
              <article key={benefit.title} className="careers__benefit-card">
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="careers__roles">
        <div className="careers__container">
          <header>
            <h2>Open Positions</h2>
            <p>Explore current opportunities across engineering, consulting, and strategy</p>
          </header>

          <div className="careers__roles-list">
            {openRoles.map((role) => (
              <article key={role.id} className="careers__role-card">
                <div>
                  <h3>{role.title}</h3>
                  <p className="careers__role-meta">
                    {role.department} · {role.location}
                  </p>
                  <p>{role.summary}</p>
                </div>
                <Link to="/contact" className="careers__apply-btn">
                  Apply Now
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="careers__cta">
        <div className="careers__container">
          <h2>Don&apos;t See the Right Role?</h2>
          <p>
            We&apos;re always looking for talented people passionate about AI.
            Send us your profile and we&apos;ll reach out when a match opens up.
          </p>
          <Link to="/contact" className="careers__cta-btn">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Careers;
