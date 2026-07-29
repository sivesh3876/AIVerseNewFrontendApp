import { useEffect, useRef, useState } from "react";
import { getResourcesByCategory } from "../LearnExplore/learnExploreData";
import { BLOGS_CHANGED_EVENT } from "../../utils/adminBlogStorage";
import { getBlogHubResources } from "../../utils/publicBlogContent";
import BlogResourceLink from "../BlogResourceLink/BlogResourceLink";
import { useScrollToSection } from "../../utils/pageScroll";
import "./ResourcesHub.scss";

const ResourcesHub = ({ title, description, category, eyebrow }) => {
  const [resources, setResources] = useState(() =>
    category === "blogs"
      ? getBlogHubResources()
      : getResourcesByCategory(category),
  );
  const heroRef = useRef(null);

  useEffect(() => {
    if (category !== "blogs") {
      setResources(getResourcesByCategory(category));
      return undefined;
    }

    const refreshResources = () => {
      setResources(getBlogHubResources());
    };

    refreshResources();
    window.addEventListener(BLOGS_CHANGED_EVENT, refreshResources);
    window.addEventListener("storage", refreshResources);

    return () => {
      window.removeEventListener(BLOGS_CHANGED_EVENT, refreshResources);
      window.removeEventListener("storage", refreshResources);
    };
  }, [category]);

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
                <BlogResourceLink
                  key={resource.id}
                  resource={resource}
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
                </BlogResourceLink>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ResourcesHub;
