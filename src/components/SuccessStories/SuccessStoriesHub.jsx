import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AddAISolutionCard from "../AddAISolutionCard";
import TalkToExpertCard from "../TalkToExpertCard";
import {
  fetchSuccessStories,
  fetchSuccessStory,
  incrementSuccessStoryView,
} from "../../services/successStoriesApiService";
import { stripHtml } from "../../utils/htmlContent";
import { useScrollToSection } from "../../utils/pageScroll";
import { getVisitorToken } from "../../utils/solutionEngagement";
import { normalizeSuccessStory } from "../../utils/successStoryAdminUtils";
import "./SuccessStoriesHub.scss";

const unwrapStories = (data) => {
  const rows = Array.isArray(data)
    ? data
    : data?.items ?? data?.stories ?? data?.data ?? [];
  return Array.isArray(rows) ? rows : [];
};

const unwrapStory = (data) =>
  data?.story ?? (data?.data && !Array.isArray(data.data) ? data.data : data);

const isPublishedStory = (story) => {
  if (!story) return false;
  const status =
    story.status ??
    story.Status ??
    story.recordStatus ??
    story.PublicationStatus;
  return !status || String(status).toLowerCase() === "published";
};

const toText = (value) => stripHtml(value == null ? "" : String(value));

const toItems = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "object"
          ? item?.url ??
            item?.imageUrl ??
            item?.name ??
            item?.label ??
            item?.title ??
            item?.text
          : item,
      )
      .map(toText)
      .filter(Boolean);
  }

  if (typeof value !== "string" || !value.trim()) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return toItems(parsed);
  } catch {
    // A plain text value is rendered as one item.
  }

  return [toText(value)].filter(Boolean);
};

const storyLabel = (story) =>
  story.client || story.clientName || story.title || "Success story";

const formatStoryDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(date);
};

const StoryState = ({ children, error = false, onRetry }) => (
  <div
    className={`success_stories_hub__state${error ? " success_stories_hub__state--error" : ""}`}
    role={error ? "alert" : "status"}
  >
    <p>{children}</p>
    {onRetry && (
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    )}
  </div>
);

const StandardStoryDetail = ({ story }) => {
  const challengeText = story.clientContext || story.challenge;
  const solutionText =
    story.digitalPartnerRole || story.solutionDescription || story.solution;
  const solutionItems = toItems(
    story.solutionDelivered ||
      story.solutionBullets ||
      story.solutionItems ||
      story.solutions,
  );
  const resultItems = [
    ...toItems(story.businessBenefits),
    ...toItems(story.results),
  ].filter((item, index, items) => items.indexOf(item) === index);
  const technologyItems = toItems(
    story.partnerTechnologies || story.technologies,
  );
  const serviceItems = toItems(story.services || story.serviceLines);
  const additionalImages = toItems(
    story.additionalImageUrls || story.additionalImages,
  );
  const heroImage = story.heroImageUrl || story.heroImage || story.image;
  const clientLogo = story.clientLogoUrl || story.clientLogo;
  const metricValue = story.statValue || story.metricValue;
  const metricLabel = story.statLabel || story.metricLabel;
  const testimonial =
    story.testimonial || story.testimonialQuote || story.quote;
  const testimonialAuthor =
    story.testimonialAuthor || story.quoteAuthor;
  const ctaUrl = story.ctaUrl || story.websiteUrl;
  const ctaLabel = story.ctaText || story.ctaLabel || "Visit client website";

  return (
    <article className="success_stories_hub__detail">
      <div
        className={`success_stories_hub__hero${heroImage ? "" : " success_stories_hub__hero--plain"}`}
        style={heroImage ? { backgroundImage: `url("${heroImage}")` } : undefined}
      >
        <div className="success_stories_hub__hero-overlay" />
        <div className="success_stories_hub__hero-content">
          <span className="success_stories_hub__badge success_stories_hub__badge--story">
            {story.badge || "SUCCESS STORY"}
          </span>
          {clientLogo && (
            <img
              className="success_stories_hub__client-logo"
              src={clientLogo}
              alt={`${storyLabel(story)} logo`}
            />
          )}
          <p className="success_stories_hub__client">{storyLabel(story)}</p>
          <h1>{story.title}</h1>
          {story.description && (
            <p className="success_stories_hub__hero-summary">
              {toText(story.description)}
            </p>
          )}
          {(metricValue || metricLabel || story.metric) && (
            <p className="success_stories_hub__metric">
              {[metricValue, metricLabel].filter(Boolean).join(" ") ||
                story.metric}
            </p>
          )}
          {(story.publishedAt || story.createdAt || story.date) && (
            <time dateTime={story.publishedAt || story.createdAt || story.date}>
              {formatStoryDate(
                story.publishedAt || story.createdAt || story.date,
              )}
            </time>
          )}
        </div>
      </div>

      <div className="success_stories_hub__detail-body">
        {challengeText && (
          <section>
            <h2>The Challenge</h2>
            <p>{toText(challengeText)}</p>
          </section>
        )}

        {(solutionItems.length > 0 || solutionText) && (
          <section>
            <h2>The Solution</h2>
            {solutionText && <p>{toText(solutionText)}</p>}
            {solutionItems.length > 0 && (
              <ul>
                {solutionItems.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        )}

        {(resultItems.length > 0 || story.outcome) && (
          <section>
            <h2>Results</h2>
            {resultItems.length > 0 && (
              <ul>
                {resultItems.map((result, index) => (
                  <li key={`${result}-${index}`}>{result}</li>
                ))}
              </ul>
            )}
            {story.outcome && (
              <p className="success_stories_hub__outcome">
                {toText(story.outcome)}
              </p>
            )}
          </section>
        )}

        {(technologyItems.length > 0 || serviceItems.length > 0 || ctaUrl) && (
          <section>
            {technologyItems.length > 0 && (
              <>
                <h2>Technologies</h2>
                <div className="success_stories_hub__tech">
                  {technologyItems.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </>
            )}
            {serviceItems.length > 0 && (
              <>
                <h2 className="success_stories_hub__subheading">Services</h2>
                <div className="success_stories_hub__tech">
                  {serviceItems.map((service) => (
                    <span key={service}>{service}</span>
                  ))}
                </div>
              </>
            )}
            {ctaUrl && (
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="success_stories_hub__case-url"
              >
                {ctaLabel}
              </a>
            )}
          </section>
        )}

        {testimonial && (
          <blockquote className="success_stories_hub__testimonial">
            <p>&ldquo;{toText(testimonial)}&rdquo;</p>
            {testimonialAuthor && <cite>{toText(testimonialAuthor)}</cite>}
          </blockquote>
        )}

        {additionalImages.length > 0 && (
          <section>
            <h2>Story Gallery</h2>
            <div className="success_stories_hub__gallery">
              {additionalImages.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${story.title} gallery ${index + 1}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

const SuccessStoriesHub = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storySlug = searchParams.get("story") || "";
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);
  const [isLoadingStories, setIsLoadingStories] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(Boolean(storySlug));
  const [storiesError, setStoriesError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [detailErrorSlug, setDetailErrorSlug] = useState("");
  const viewedStoriesRef = useRef(new Set());
  const mainRef = useRef(null);

  useScrollToSection(mainRef, [storySlug]);

  const loadStories = useCallback(async () => {
    setIsLoadingStories(true);
    setStoriesError("");

    try {
      const data = await fetchSuccessStories({ includeUnpublished: false });
      setStories(
        unwrapStories(data).filter(isPublishedStory).map(normalizeSuccessStory),
      );
    } catch (loadError) {
      setStories([]);
      setStoriesError(loadError?.message || "Unable to load success stories.");
    } finally {
      setIsLoadingStories(false);
    }
  }, []);

  const loadDetail = useCallback(async () => {
    if (!storySlug) {
      setActiveStory(null);
      setDetailError("");
      setDetailErrorSlug("");
      setIsLoadingDetail(false);
      return;
    }

    setIsLoadingDetail(true);
    setDetailError("");
    setDetailErrorSlug("");

    try {
      const data = await fetchSuccessStory({ slug: storySlug });
      const rawStory = unwrapStory(data);
      if (!isPublishedStory(rawStory)) {
        throw new Error("This success story is not available.");
      }
      const story = normalizeSuccessStory(rawStory);
      setActiveStory(story);
    } catch (loadError) {
      setActiveStory(null);
      setDetailError(loadError?.message || "Unable to load this success story.");
      setDetailErrorSlug(storySlug);
    } finally {
      setIsLoadingDetail(false);
    }
  }, [storySlug]);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadStories, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadStories]);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadDetail, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadDetail]);

  useEffect(() => {
    if (!storySlug || !activeStory) return;

    const activeSlug = activeStory.slug || String(activeStory.id || "");
    if (activeSlug !== storySlug) return;

    const storyKey = activeStory.id || activeStory.slug || storySlug;
    if (viewedStoriesRef.current.has(storyKey)) return;
    viewedStoriesRef.current.add(storyKey);

    incrementSuccessStoryView(storyKey, getVisitorToken()).catch(() => {
      viewedStoriesRef.current.delete(storyKey);
    });
  }, [activeStory, storySlug]);

  const handleStoryChange = (slug) => {
    navigate(
      slug
        ? `/success-stories?story=${encodeURIComponent(slug)}`
        : "/success-stories",
    );
  };

  const activeStorySlug =
    activeStory?.slug || String(activeStory?.id || "");
  const hasCurrentStory = activeStorySlug === storySlug;
  const currentDetailError =
    detailErrorSlug === storySlug ? detailError : "";

  const renderStoryOptions = () =>
    stories.map((story) => {
      const slug = story.slug || story.id;
      const isActive = slug === storySlug;

      return (
        <li key={story.id || slug}>
          <button
            type="button"
            className={`success_stories_hub__nav-item${isActive ? " is-active" : ""}`}
            onClick={() => handleStoryChange(slug)}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="success_stories_hub__nav-label">
              {storyLabel(story)}
            </span>
            {isActive && (
              <span className="success_stories_hub__nav-arrow" aria-hidden="true">
                &rsaquo;
              </span>
            )}
          </button>
        </li>
      );
    });

  return (
    <div className="success_stories_hub">
      <aside className="success_stories_hub__sidebar">
        <nav className="success_stories_hub__nav" aria-label="Success stories">
          <h2>ALL STORIES</h2>
          {isLoadingStories ? (
            <p className="success_stories_hub__nav-state">Loading...</p>
          ) : storiesError ? (
            <div className="success_stories_hub__nav-state">
              <p>{storiesError}</p>
              <button type="button" onClick={loadStories}>Retry</button>
            </div>
          ) : stories.length === 0 ? (
            <p className="success_stories_hub__nav-state">No stories available.</p>
          ) : (
            <>
              <ul className="success_stories_hub__desktop-nav">
                {renderStoryOptions()}
              </ul>
              <label className="success_stories_hub__mobile-selector">
                <span>Choose a story</span>
                <select
                  value={storySlug}
                  onChange={(event) => handleStoryChange(event.target.value)}
                >
                  <option value="">All success stories</option>
                  {stories.map((story) => {
                    const slug = story.slug || story.id;
                    return (
                      <option key={story.id || slug} value={slug}>
                        {storyLabel(story)}
                      </option>
                    );
                  })}
                </select>
              </label>
            </>
          )}
        </nav>

        <AddAISolutionCard />
        <TalkToExpertCard />
      </aside>

      <main className="success_stories_hub__main" ref={mainRef}>
        {storySlug ? (
          isLoadingDetail || (!hasCurrentStory && !currentDetailError) ? (
            <StoryState>Loading success story...</StoryState>
          ) : currentDetailError ? (
            <StoryState error onRetry={loadDetail}>
              {currentDetailError}
            </StoryState>
          ) : (
            <StandardStoryDetail story={activeStory} />
          )
        ) : (
          <>
            <header className="success_stories_hub__header">
              <h1>Success Stories</h1>
              <p>
                Explore how leading organizations deliver measurable business
                impact with AI Verse solutions.
              </p>
            </header>

            {isLoadingStories ? (
              <StoryState>Loading success stories...</StoryState>
            ) : storiesError ? (
              <StoryState error onRetry={loadStories}>{storiesError}</StoryState>
            ) : stories.length === 0 ? (
              <StoryState>No published success stories are available yet.</StoryState>
            ) : (
              <div className="success_stories_hub__grid">
                {stories.map((story) => {
                  const slug = story.slug || story.id;
                  const image =
                    story.heroImageUrl || story.heroImage || story.image;
                  const metricValue = story.statValue || story.metricValue;
                  const metricLabel = story.statLabel || story.metricLabel;

                  return (
                    <Link
                      key={story.id || slug}
                      to={`/success-stories?story=${encodeURIComponent(slug)}`}
                      className="success_stories_hub__card"
                    >
                      {image && (
                        <div className="success_stories_hub__card-image">
                          <img src={image} alt="" />
                        </div>
                      )}

                      <div className="success_stories_hub__card-body">
                        {(story.industryTag || story.industry) && (
                          <span
                            className="success_stories_hub__badge"
                            style={{ background: story.badgeColor || "#3A8D9D" }}
                          >
                            {story.industryTag || story.industry}
                          </span>
                        )}
                        <h2>{story.title}</h2>
                        {story.description && <p>{toText(story.description)}</p>}
                        {(metricValue || metricLabel || story.metric) && (
                          <p className="success_stories_hub__metric">
                            {[metricValue, metricLabel]
                              .filter(Boolean)
                              .join(" ") || story.metric}
                          </p>
                        )}
                        {(story.publishedAt || story.createdAt || story.date) && (
                          <time
                            dateTime={
                              story.publishedAt || story.createdAt || story.date
                            }
                          >
                            {formatStoryDate(
                              story.publishedAt || story.createdAt || story.date,
                            )}
                          </time>
                        )}
                        <span className="success_stories_hub__card-link">
                          Read Full Story &gt;
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SuccessStoriesHub;
