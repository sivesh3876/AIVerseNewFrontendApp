import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./InsightsThoughtLeadership.scss";
import insigts from "../../assets/images/insigts.svg";
import {
  featuredArticle as defaultFeaturedArticle,
  homeInsights as defaultInsights,
} from "../LearnExplore/learnExploreData";

const getCardAnimation = (index) => {
  const columns = 3;
  const row = Math.floor(index / columns);
  const col = index % columns;

  return {
    animationDelay: `${0.65 + row * 0.18 + col * 0.1}s`,
  };
};

const InsightsThoughtLeadership = ({
  featuredArticle = { ...defaultFeaturedArticle, image: insigts },
  insights = defaultInsights,
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
      id="success-stories"
      className={`insights_leadership ${visible ? "animate" : ""}`}
      ref={sectionRef}
    >
      <div className="insights_leadership__container">
        <header className="insights_leadership__header">
          <h2>Insights &amp; Thought Leadership</h2>
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

            <Link
              to={`/learn-explore?article=${featuredArticle.id}`}
              className="insights_leadership__featured-link"
            >
              {featuredArticle.linkText} &rarr;
            </Link>
          </div>
        </article>

        <div className="insights_leadership__grid">
          {insights.map((insight, index) => {
            const { animationDelay } = getCardAnimation(index);

            return (
              <article
                className="insights_leadership__card"
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

                <Link
                  to={`/learn-explore?article=${insight.id}`}
                  className="insights_leadership__card-link"
                >
                  Read More &gt;
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InsightsThoughtLeadership;
