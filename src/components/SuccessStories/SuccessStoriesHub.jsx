import { useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AddAISolutionCard from "../AddAISolutionCard";
import TalkToExpertCard from "../TalkToExpertCard";
import { useScrollToSection } from "../../utils/pageScroll";
import {
  getSuccessStoryById,
  successStories,
} from "./successStoriesData";
import "./SuccessStoriesHub.scss";

const StandardStoryDetail = ({ story }) => {
  const challengeText = story.clientContext || story.challenge;
  const solutionText = story.digitalPartnerRole || story.solution;
  const solutionItems =
    story.solutionDelivered?.length > 0 ? story.solutionDelivered : null;
  const resultItems = [
    ...(story.businessBenefits ?? []),
    ...(story.results ?? []),
  ].filter((item, index, items) => items.indexOf(item) === index);
  const technologyItems =
    story.partnerTechnologies?.length > 0
      ? story.partnerTechnologies.map((partner) => partner.name)
      : story.technologies ?? [];

  return (
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
        <p>{challengeText}</p>
      </section>

      <section>
        <h2>The Solution</h2>
        {solutionItems ? (
          <ul>
            {solutionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>{solutionText}</p>
        )}
      </section>

      <section>
        <h2>Results</h2>
        <ul>
          {resultItems.map((result) => (
            <li key={result}>{result}</li>
          ))}
        </ul>
        {story.outcome && (
          <p className="success_stories_hub__outcome">{story.outcome}</p>
        )}
      </section>

      <section>
        <h2>Technologies</h2>
        <div className="success_stories_hub__tech">
          {technologyItems.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
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
      </section>
    </div>
  </article>
  );
};

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
        ) : (
          <StandardStoryDetail story={activeStory} />
        )}
      </main>
    </div>
  );
};

export default SuccessStoriesHub;
