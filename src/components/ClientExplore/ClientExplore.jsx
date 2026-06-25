import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AddAISolutionCard from "../AddAISolutionCard";
import TalkToExpertCard from "../TalkToExpertCard";
import ClientLogo from "./ClientLogo";
import { useScrollToSection } from "../../utils/pageScroll";
import { clientsData, getClientIndexById } from "./clientsData";
import "./ClientExplore.scss";

const ClientExplore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("client");
  const [activeIndex, setActiveIndex] = useState(() =>
    getClientIndexById(clientId),
  );
  const mainRef = useRef(null);

  useEffect(() => {
    setActiveIndex(getClientIndexById(clientId));
  }, [clientId]);

  useScrollToSection(mainRef, [clientId]);

  const activeClient = clientsData[activeIndex];

  const handleClientChange = (index) => {
    setActiveIndex(index);
    navigate(`/clients?client=${clientsData[index].id}`, { replace: true });
  };

  return (
    <div className="client_explore">
      <aside className="client_explore__sidebar">
        <nav className="client_explore__nav" aria-label="Clients and partners">
          <h2>ALL PARTNERS & CLIENTS</h2>
          <ul>
            {clientsData.map((client, index) => {
              const isActive = index === activeIndex;

              return (
                <li key={client.id}>
                  <button
                    type="button"
                    className={`client_explore__nav-item${isActive ? " is-active" : ""}`}
                    onClick={() => handleClientChange(index)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="client_explore__nav-logo" aria-hidden="true">
                      <ClientLogo client={client} />
                    </span>
                    <span className="client_explore__nav-label">{client.name}</span>
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
            <h2>Partnership Overview</h2>
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

          {activeClient.pocs?.length > 0 && (
            <div className="client_explore__pocs">
              <h3>Proof of Concepts & Success Stories</h3>
              <div className="client_explore__pocs-grid">
                {activeClient.pocs.map((poc) => {
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
