import { useEffect, useRef, useState } from "react";
import "./InsightsThoughtLeadership.scss";
import insigts from "../../assets/images/insigts.svg";
import BlogResourceLink from "../BlogResourceLink/BlogResourceLink";
import {
  featuredArticle as defaultFeaturedArticle,
  homeInsights as defaultInsights,
} from "../LearnExplore/learnExploreData";
import { BLOGS_CHANGED_EVENT, refreshBlogsFromApi } from "../../utils/adminBlogStorage";
import { getHomepageInsightCards } from "../../utils/publicBlogContent";
import {
  getPublicCertificationById,
  PUBLIC_CERTIFICATION_EVENTS,
  refreshPublicCertificationData,
} from "../../utils/publicCertificationContent";

const FEATURED_CERT_ID = "cert-ai-900";

const buildFeaturedCertificationCard = () => {
  const certification = getPublicCertificationById(FEATURED_CERT_ID);
  if (!certification) {
    return null;
  }

  return {
    ...defaultFeaturedArticle,
    id: certification.id,
    certificationId: certification.id,
    badge: "Certification",
    title: defaultFeaturedArticle.title,
    description: defaultFeaturedArticle.description,
    linkText: defaultFeaturedArticle.linkText,
    linkTo: "/learn-explore/certifications",
    image: insigts,
  };
};

const getCardAnimation = (index) => {
  const columns = 3;
  const row = Math.floor(index / columns);
  const col = index % columns;

  return {
    animationDelay: `${0.65 + row * 0.18 + col * 0.1}s`,
  };
};

const InsightsThoughtLeadership = ({
  featuredArticle: featuredArticleProp,
  insights: initialInsights = defaultInsights,
}) => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [insights, setInsights] = useState(initialInsights);
  const [featuredArticle, setFeaturedArticle] = useState(() => {
    if (featuredArticleProp) {
      return { ...featuredArticleProp, image: featuredArticleProp.image || insigts };
    }
    return (
      buildFeaturedCertificationCard() || {
        ...defaultFeaturedArticle,
        image: insigts,
      }
    );
  });

  useEffect(() => {
    const refreshInsights = () => {
      setInsights(getHomepageInsightCards());
    };

    const refreshFeatured = () => {
      if (featuredArticleProp) {
        setFeaturedArticle({
          ...featuredArticleProp,
          image: featuredArticleProp.image || insigts,
        });
        return;
      }

      const fromAdmin = buildFeaturedCertificationCard();
      setFeaturedArticle(
        fromAdmin || {
          ...defaultFeaturedArticle,
          image: insigts,
        },
      );
    };

    const loadFromApi = async () => {
      try {
        await refreshBlogsFromApi({ includeUnpublished: false });
      } catch (error) {
        console.warn("Blog API unavailable for homepage insights.", error);
      }
      try {
        await refreshPublicCertificationData();
      } catch (error) {
        console.warn(
          "Certification API unavailable for homepage featured card.",
          error,
        );
      }
      refreshInsights();
      refreshFeatured();
    };

    loadFromApi();

    window.addEventListener(BLOGS_CHANGED_EVENT, refreshInsights);
    PUBLIC_CERTIFICATION_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, refreshFeatured);
    });
    window.addEventListener("storage", refreshInsights);
    window.addEventListener("storage", refreshFeatured);

    return () => {
      window.removeEventListener(BLOGS_CHANGED_EVENT, refreshInsights);
      PUBLIC_CERTIFICATION_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, refreshFeatured);
      });
      window.removeEventListener("storage", refreshInsights);
      window.removeEventListener("storage", refreshFeatured);
    };
  }, [featuredArticleProp]);

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
      id="learn-explore"
      className={`insights_leadership ${visible ? "animate" : ""}`}
      ref={sectionRef}
    >
      <div className="insights_leadership__container">
        <header className="insights_leadership__header">
          <h2>Learn &amp; Explore</h2>
          <p>Stay informed with the latest AI trends and enterprise insights</p>
        </header>

        <article className="insights_leadership__featured">
          <div className="insights_leadership__featured-image">
            <img src={featuredArticle.image} alt="" />
          </div>

          <div className="insights_leadership__featured-content">
            <span className="insights_leadership__featured-badge">
              {featuredArticle.badge}
            </span>

            <h3>{featuredArticle.title}</h3>
            <p>{featuredArticle.description}</p>

            <BlogResourceLink
              resource={featuredArticle}
              className="insights_leadership__featured-link"
            >
              {featuredArticle.linkText} &rarr;
            </BlogResourceLink>
          </div>
        </article>

        <div className="insights_leadership__grid">
          {insights.map((insight, index) => {
            const { animationDelay } = getCardAnimation(index);

            return (
              <BlogResourceLink
                resource={insight}
                className="insights_leadership__card insights_leadership__card--link"
                key={insight.id}
                style={{ animationDelay }}
              >
                <span
                  className="insights_leadership__card-badge"
                  style={{ background: insight.badgeColor }}
                >
                  {insight.badge}
                </span>

                <h4>{insight.title}</h4>

                <p className="insights_leadership__card-description">
                  {insight.description}
                </p>

                <time
                  className="insights_leadership__card-date"
                  dateTime={insight.date}
                >
                  {insight.date}
                </time>

                <span className="insights_leadership__card-link">Read More &gt;</span>
              </BlogResourceLink>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InsightsThoughtLeadership;
