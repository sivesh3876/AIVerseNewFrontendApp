import { useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AddAISolutionCard from "../AddAISolutionCard";
import TalkToExpertCard from "../TalkToExpertCard";
import { useScrollToSection } from "../../utils/pageScroll";
import {
  getSuccessStoryById,
  isFullCaseStudy,
  successStories,
} from "./successStoriesData";
import "./SuccessStoriesHub.scss";

const CaseStudyDetail = ({ story }) => (
  <article className="success_stories_hub__case-study" key={story.id}>
    <div className="success_stories_hub__case-layout">
      <aside className="success_stories_hub__case-sidebar">
        <div className="success_stories_hub__case-logo">
          {story.clientLogo ? (
            <img src={story.clientLogo} alt={story.client} />
          ) : (
            <span>{story.client}</span>
          )}
        </div>

        <section>
          <h2>Client Context</h2>
          <p>{story.clientContext}</p>
        </section>

        <section>
          <h2>Our Role as Digital Partner</h2>
          <p>{story.digitalPartnerRole}</p>
        </section>
      </aside>

      <div className="success_stories_hub__case-main">
        <header
          className="success_stories_hub__case-banner"
          style={{ backgroundImage: `url(${story.image})` }}
        >
          <div className="success_stories_hub__case-banner-overlay" />
          <h1>{story.subtitle}</h1>
        </header>

        <div className="success_stories_hub__case-columns">
          <section className="success_stories_hub__case-column">
            <div className="success_stories_hub__case-icon success_stories_hub__case-icon--solution" />
            <h2>Solution Delivered</h2>
            <ul>
              {story.solutionDelivered.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="success_stories_hub__case-column">
            <div className="success_stories_hub__case-icon success_stories_hub__case-icon--benefits" />
            <h2>Business Benefits</h2>
            <ul>
              {story.businessBenefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="success_stories_hub__case-column">
            <div className="success_stories_hub__case-icon success_stories_hub__case-icon--outcome" />
            <h2>Outcome</h2>
            <p>{story.outcome}</p>

            {story.websiteUrl && (
              <a
                href={story.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="success_stories_hub__case-url"
              >
                {story.websiteUrl}
              </a>
            )}

            {story.partnerTechnologies?.length > 0 && (
              <div className="success_stories_hub__case-partners">
                {story.partnerTechnologies.map((partner) =>
                  partner.logo ? (
                    <img
                      key={partner.name}
                      src={partner.logo}
                      alt={partner.name}
                      title={partner.name}
                    />
                  ) : (
                    <span key={partner.name}>{partner.name}</span>
                  ),
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  </article>
);

const StandardStoryDetail = ({ story }) => (
  <article className="success_stories_hub__detail" key={story.id}>
    <div
      className="success_stories_hub__hero"
      style={{ backgroundImage: `url(${story.image})` }}
    >
      <div className="success_stories_hub__hero-overlay" />
      <div className="success_stories_hub__hero-content">
        <span
          className="success_stories_hub__badge"
          style={{ background: story.badgeColor }}
        >
          {story.badge}
        </span>
        <p className="success_stories_hub__client">{story.client}</p>
        <h1>{story.title}</h1>
        <p className="success_stories_hub__hero-summary">{story.description}</p>
        <p className="success_stories_hub__metric" style={{ color: "#18E0CC" }}>
          {story.metric}
        </p>
      </div>
    </div>

    <div className="success_stories_hub__detail-body">
      <section>
        <h2>The Challenge</h2>
        <p>{story.challenge}</p>
      </section>

      <section>
        <h2>The Solution</h2>
        <p>{story.solution}</p>
      </section>

      <section>
        <h2>Results</h2>
        <ul>
          {story.results.map((result) => (
            <li key={result}>{result}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Technologies</h2>
        <div className="success_stories_hub__tech">
          {story.technologies.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </section>
    </div>
  </article>
);

const SuccessStoriesHub = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get("story");
  const activeStory = storyId ? getSuccessStoryById(storyId) : null;
  const mainRef = useRef(null);

  useScrollToSection(mainRef, [storyId]);

  useEffect(() => {
    if (storyId && !activeStory) {
      navigate("/success-stories", { replace: true });
    }
  }, [storyId, activeStory, navigate]);

  const handleStoryChange = (id) => {
    navigate(`/success-stories?story=${id}`, { replace: true });
  };

  return (
    <div className="success_stories_hub">
      <aside className="success_stories_hub__sidebar">
        <nav className="success_stories_hub__nav" aria-label="Success stories">
          <h2>ALL STORIES</h2>
          <ul>
            {successStories.map((story) => {
              const isActive = story.id === (activeStory?.id ?? storyId);

              return (
                <li key={story.id}>
                  <button
                    type="button"
                    className={`success_stories_hub__nav-item${isActive ? " is-active" : ""}`}
                    onClick={() => handleStoryChange(story.id)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="success_stories_hub__nav-label">
                      {story.client}
                    </span>
                    {isActive && (
                      <span className="success_stories_hub__nav-arrow" aria-hidden="true">
                        &rsaquo;
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <AddAISolutionCard />
        <TalkToExpertCard />
      </aside>

      <main className="success_stories_hub__main" ref={mainRef}>
        {!activeStory ? (
          <>
            <header className="success_stories_hub__header">
              <h1>Success Stories</h1>
              <p>
                Explore how leading organizations deliver measurable business
                impact with AI Verse solutions.
              </p>
            </header>

            <div className="success_stories_hub__grid">
              {successStories.map((story) => (
                <Link
                  key={story.id}
                  to={`/success-stories?story=${story.id}`}
                  className="success_stories_hub__card"
                >
                  <div className="success_stories_hub__card-image">
                    <img src={story.image} alt="" />
                  </div>

                  <div className="success_stories_hub__card-body">
                    <span
                      className="success_stories_hub__badge"
                      style={{ background: story.badgeColor }}
                    >
                      {story.industryTag || story.industry}
                    </span>
                    <h2>{story.title}</h2>
                    <p>{story.description}</p>
                    <p
                      className="success_stories_hub__metric"
                      style={{ color: story.badgeColor }}
                    >
                      {story.statValue ? `${story.statValue} ${story.statLabel}` : story.metric}
                    </p>
                    <time dateTime={story.date}>{story.date}</time>
                    <span className="success_stories_hub__card-link">
                      Read Full Story &gt;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : isFullCaseStudy(activeStory) ? (
          <CaseStudyDetail story={activeStory} />
        ) : (
          <StandardStoryDetail story={activeStory} />
        )}
      </main>
    </div>
  );
};

export default SuccessStoriesHub;
