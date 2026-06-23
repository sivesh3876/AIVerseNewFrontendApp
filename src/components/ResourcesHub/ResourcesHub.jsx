import { useRef } from "react";
import { Link } from "react-router-dom";
import { getResourcesByCategory } from "../LearnExplore/learnExploreData";
import { useScrollToSection } from "../../utils/pageScroll";
import "./ResourcesHub.scss";

const ResourcesHub = ({ title, description, category, eyebrow }) => {
  const resources = getResourcesByCategory(category);
  const heroRef = useRef(null);

  useScrollToSection(heroRef, [category]);

  return (
    <div className="resources_hub">
      <section className="resources_hub__hero" ref={heroRef}>
        <div className="resources_hub__hero-inner">
          <p className="resources_hub__eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>

      <section className="resources_hub__content">
        <div className="resources_hub__container">
          {resources.length === 0 ? (
            <p className="resources_hub__empty">No resources available yet.</p>
          ) : (
            <div className="resources_hub__grid">
              {resources.map((resource) => (
                <Link
                  key={resource.id}
                  to={`/learn-explore?article=${resource.id}`}
                  className="resources_hub__card"
                >
                  <span
                    className="resources_hub__badge"
                    style={{ background: resource.badgeColor }}
                  >
                    {resource.badge}
                  </span>
                  <h2>{resource.title}</h2>
                  <p>{resource.description}</p>
                  <time dateTime={resource.date}>{resource.date}</time>
                  <span className="resources_hub__link">Read More &gt;</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ResourcesHub;
