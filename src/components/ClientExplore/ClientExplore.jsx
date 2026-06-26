import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AddAISolutionCard from "../AddAISolutionCard";
import TalkToExpertCard from "../TalkToExpertCard";
import ClientLogo from "./ClientLogo";
import { useScrollToSection } from "../../utils/pageScroll";
import {
  CLIENT_SECTION,
  getSectionItemById,
} from "./clientsData";
import {
  getStandaloneClientPocs,
  getSuccessStoriesForClient,
} from "./clientSuccessStories";
import "./ClientExplore.scss";

const ClientExplore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("client");
  const mainRef = useRef(null);

  const sectionState = useMemo(
    () => getSectionItemById(clientId),
    [clientId],
  );

  const [activeIndex, setActiveIndex] = useState(sectionState.index);

  useEffect(() => {
    setActiveIndex(sectionState.index);
  }, [sectionState.index]);

  useScrollToSection(mainRef, [clientId, sectionState.section]);

  const { section, items: sectionItems } = sectionState;
  const activeClient = sectionItems[activeIndex] ?? sectionState.item;
  const isClientSection = section === CLIENT_SECTION;

  const successStories = useMemo(
    () => (isClientSection ? getSuccessStoriesForClient(activeClient) : []),
    [activeClient, isClientSection],
  );

  const standalonePocs = useMemo(
    () =>
      isClientSection
        ? getStandaloneClientPocs(activeClient, successStories)
        : [],
    [activeClient, isClientSection, successStories],
  );

  const handleItemChange = (index) => {
    setActiveIndex(index);
    navigate(`/clients?client=${sectionItems[index].id}`, { replace: true });
  };

  const navLabel = isClientSection ? "ALL CLIENTS" : "ALL PARTNERS";
  const overviewTitle = isClientSection ? "Client Overview" : "Partnership Overview";

  return (
    <div className="client_explore">
      <aside className="client_explore__sidebar">
        <nav
          className="client_explore__nav"
          aria-label={isClientSection ? "Clients" : "Partners"}
        >
          <h2>{navLabel}</h2>
          <ul>
            {sectionItems.map((entry, index) => {
              const isActive = index === activeIndex;

              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    className={`client_explore__nav-item${isActive ? " is-active" : ""}`}
                    onClick={() => handleItemChange(index)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="client_explore__nav-logo" aria-hidden="true">
                      <ClientLogo client={entry} />
                    </span>
                    <span className="client_explore__nav-label">{entry.name}</span>
                    {isActive && (
                      <span className="client_explore__nav-arrow" aria-hidden="true">
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

      <main className="client_explore__main" key={activeClient.id} ref={mainRef}>
        <section className="client_explore__banner">
          <div className="client_explore__banner-logo">
            <ClientLogo client={activeClient} />
          </div>
          <div className="client_explore__banner-copy">
            <p className="client_explore__tagline">{activeClient.tagline}</p>
            <h1>{activeClient.name}</h1>
            <p>{activeClient.subtitle}</p>
          </div>
        </section>

        <section className="client_explore__content">
          <div className="client_explore__content-header">
            <div className="client_explore__content-logo" aria-hidden="true">
              <ClientLogo client={activeClient} />
            </div>
            <h2>{overviewTitle}</h2>
          </div>
          <div className="client_explore__content-body">
            {activeClient.contentParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="client_explore__highlights">
            <h3>What We Deliver Together</h3>
            <div className="client_explore__highlights-grid">
              {activeClient.highlights.map((highlight) => (
                <article key={highlight.title} className="client_explore__highlight">
                  <h4>{highlight.title}</h4>
                  <p>{highlight.description}</p>
                </article>
              ))}
            </div>
          </div>

          {isClientSection && successStories.length > 0 && (
            <div className="client_explore__stories">
              <h3>Success Stories</h3>
              <div className="client_explore__stories-grid">
                {successStories.map((story) => (
                  <article key={story.id} className="client_explore__story">
                    <div className="client_explore__story-media">
                      <img src={story.image} alt="" loading="lazy" />
                      <span
                        className="client_explore__story-badge"
                        style={{ backgroundColor: story.badgeColor }}
                      >
                        {story.badge}
                      </span>
                    </div>
                    <div className="client_explore__story-body">
                      <span className="client_explore__story-tag">
                        {story.industryTag}
                      </span>
                      <h4>{story.title}</h4>
                      <p>{story.description}</p>
                      {(story.statValue || story.metric) && (
                        <p className="client_explore__story-metric">
                          <strong>{story.statValue ?? story.metric}</strong>
                          {story.statLabel ? ` ${story.statLabel}` : ""}
                        </p>
                      )}
                      <Link
                        to={`/success-stories?story=${story.id}`}
                        className="client_explore__poc-link"
                      >
                        Read full success story
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {isClientSection && standalonePocs.length > 0 && (
            <div className="client_explore__pocs">
              <h3>Proof of Concepts</h3>
              <div className="client_explore__pocs-grid">
                {standalonePocs.map((poc) => {
                  const pocKey = poc.storyId ?? poc.title;
                  const pocLink = poc.storyId
                    ? `/success-stories?story=${poc.storyId}`
                    : poc.href;

                  return (
                    <article key={pocKey} className="client_explore__poc">
                      <h4>{poc.title}</h4>
                      <p>{poc.description}</p>
                      {pocLink && (
                        <Link to={pocLink} className="client_explore__poc-link">
                          {poc.ctaLabel ?? "View case study"}
                        </Link>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ClientExplore;
