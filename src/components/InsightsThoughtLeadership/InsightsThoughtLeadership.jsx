import { useEffect, useRef, useState } from "react";
import "./InsightsThoughtLeadership.scss";
import insigts from "../../assets/images/insigts.svg";

const defaultFeaturedArticle = {
  badge: "FEATURED ARTICLE",
  title:
    "The Future of Enterprise AI: Agentic Systems and Autonomous Workflows",
  description:
    "Explore how autonomous AI agents are transforming enterprise operations, from customer service to complex decision-making processes. Learn about the latest developments in agentic AI.",
  image: insigts,
  linkText: "Read Full Article",
};

const defaultInsights = [
  {
    badge: "INDUSTRY REPORT",
    badgeColor: "#4D90E3",
    title: "AI Adoption in Financial Services 2026",
  },
  {
    badge: "WHITEPAPER",
    badgeColor: "#3A8D9D",
    title: "Building Responsible AI: Ethics Framework",
  },
  {
    badge: "CASE STUDY",
    badgeColor: "#EF8E29",
    title: "How Education Leaders Transform with AI",
  },
  {
    badge: "TRENDS REPORT",
    badgeColor: "#F5B800",
    title: "Generative AI in Enterprise",
  },
  {
    badge: "RESEARCH",
    badgeColor: "#18E0CC",
    title: "The Economics of AI",
  },
  {
    badge: "GUIDE",
    badgeColor: "#4D90E3",
    title: "AI Readiness Assessment",
  },
];

const getCardAnimation = (index) => {
  const columns = 3;
  const row = Math.floor(index / columns);
  const col = index % columns;

  return {
    animationDelay: `${0.65 + row * 0.18 + col * 0.1}s`,
  };
};

const InsightsThoughtLeadership = ({
  featuredArticle = defaultFeaturedArticle,
  insights = defaultInsights,
  onReadFeatured,
  onReadInsight,
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

            <button
              type="button"
              className="insights_leadership__featured-link"
              onClick={() => onReadFeatured?.(featuredArticle)}
            >
              {featuredArticle.linkText} &rarr;
            </button>
          </div>
        </article>

        <div className="insights_leadership__grid">
          {insights.map((insight, index) => {
            const { animationDelay } = getCardAnimation(index);

            return (
              <article
                className="insights_leadership__card"
                key={insight.title}
                style={{ animationDelay }}
              >
              <span
                className="insights_leadership__card-badge"
                style={{ background: insight.badgeColor }}
              >
                {insight.badge}
              </span>

              <h4>{insight.title}</h4>

              <button
                type="button"
                className="insights_leadership__card-link"
                onClick={() => onReadInsight?.(insight)}
              >
                Read More &gt;
              </button>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InsightsThoughtLeadership;
