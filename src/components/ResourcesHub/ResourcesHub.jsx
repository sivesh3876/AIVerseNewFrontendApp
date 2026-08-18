import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getResourcesByCategory } from "../LearnExplore/learnExploreData";
import {
  BLOGS_CHANGED_EVENT,
  refreshBlogsFromApi,
} from "../../utils/adminBlogStorage";
import { getBlogHubResources } from "../../utils/publicBlogContent";
import BlogResourceLink from "../BlogResourceLink/BlogResourceLink";
import { useScrollToSection } from "../../utils/pageScroll";
import "./ResourcesHub.scss";

const ResourcesHub = ({ title, description, category, eyebrow }) => {
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("article");
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

    let cancelled = false;

    const refreshResources = async () => {
      try {
        // Public page only needs Published blogs from production API.
        await refreshBlogsFromApi({ includeUnpublished: false });
      } catch (error) {
        console.warn("Blog API unavailable; showing seed blogs.", error);
      }
      if (!cancelled) {
        setResources(getBlogHubResources());
      }
    };

    refreshResources();
    const onLocalChange = () => setResources(getBlogHubResources());
    window.addEventListener(BLOGS_CHANGED_EVENT, onLocalChange);
    window.addEventListener("storage", onLocalChange);

    return () => {
      cancelled = true;
      window.removeEventListener(BLOGS_CHANGED_EVENT, onLocalChange);
      window.removeEventListener("storage", onLocalChange);
    };
  }, [category]);

  useEffect(() => {
    if (!articleId) return undefined;

    const timer = window.setTimeout(() => {
      const element = document.getElementById(`resource-${articleId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [articleId, resources]);

  useScrollToSection(heroRef, [category]);

  const orderedResources = useMemo(() => {
    if (!articleId) return resources;

    const highlighted = resources.find((item) => item.id === articleId);
    if (!highlighted) return resources;

    return [
      highlighted,
      ...resources.filter((item) => item.id !== articleId),
    ];
  }, [resources, articleId]);

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
          {orderedResources.length === 0 ? (
            <p className="resources_hub__empty">No resources available yet.</p>
          ) : (
            <div className="resources_hub__grid">
              {orderedResources.map((resource) => (
                <BlogResourceLink
                  key={resource.id}
                  id={`resource-${resource.id}`}
                  resource={resource}
                  className={`resources_hub__card${
                    articleId === resource.id
                      ? " resources_hub__card--highlight"
                      : ""
                  }`}
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
