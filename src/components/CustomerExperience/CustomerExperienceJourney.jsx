import { Link } from "react-router-dom";
import {
  customerExperienceMeta,
  customerJourneyStages,
} from "../../data/customerExperienceData";
import "./CustomerExperienceJourney.scss";

const JourneyCardIcon = ({ type }) => {
  if (type === "sparkle") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m12 3 1.4 4.2L17.6 8.8 13.4 9.8 12 14l-1.4-4.2L6.4 8.8l4.2-1.6L12 3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M5 17l1 2 2 1-1-2-2-1Z" fill="currentColor" />
      </svg>
    );
  }

  if (type === "journey") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="6" cy="18" r="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="10" cy="10" r="1.5" fill="currentColor" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" />
        <path
          d="M8 16c3-2 5-4 8-8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "cart") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 5h1.5l2.2 9.2a2 2 0 0 0 2 1.6h7.1a2 2 0 0 0 1.9-1.4L20 9H7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="19" r="1.4" fill="currentColor" />
        <circle cx="17" cy="19" r="1.4" fill="currentColor" />
      </svg>
    );
  }

  if (type === "chat") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v5A3.5 3.5 0 0 1 15.5 15H11l-3.5 3v-3H8.5A3.5 3.5 0 0 1 5 11.5v-5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "heart") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 20s-7-4.6-7-9.2C5 7.8 7.2 6 9.6 6c1.4 0 2.4.6 3.1 1.5.7-.9 1.7-1.5 3.1-1.5 2.4 0 4.6 1.8 4.6 4.8C20 15.4 12 20 12 20Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 18V8l4-2v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 16h3v2H9z" fill="currentColor" />
      <path d="M14 18V6l5 2v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
};

const HeroIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M17 20a4 4 0 1 0-8 0" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="13" cy="7" r="3.25" stroke="currentColor" strokeWidth="1.75" />
    <path d="M5 20a4 4 0 0 1 8 0" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="7" cy="9" r="2.75" stroke="currentColor" strokeWidth="1.75" />
  </svg>
);

const CustomerExperienceJourney = ({
  meta = customerExperienceMeta,
  stages = customerJourneyStages,
}) => {
  const maxRows = Math.max(...stages.map((stage) => stage.cards.length), 1);

  return (
    <section className="customer_experience_journey">
      <header className="customer_experience_journey__hero">
        <div className="customer_experience_journey__hero-icon">
          <HeroIcon />
        </div>
        <div>
          <h1>{meta.pageTitle}</h1>
          <p>{meta.heroSubtitle}</p>
        </div>
      </header>

      <p className="customer_experience_journey__intro">{meta.intro}</p>

      <div className="customer_experience_journey__frame">
        <div className="customer_experience_journey__stage-bar">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="customer_experience_journey__stage-item"
              style={{ background: stage.headerColor }}
            >
              <span className="customer_experience_journey__stage-chevron" aria-hidden="true">
                &gt;
              </span>
              <span>{stage.label}</span>
            </div>
          ))}
        </div>

        <div className="customer_experience_journey__columns">
          {stages.map((stage) => (
            <div className="customer_experience_journey__column" key={stage.id}>
              {stage.stageDescription && (
                <div
                  className="customer_experience_journey__stage-description"
                  style={{ borderTopColor: stage.headerColor }}
                >
                  <p>{stage.stageDescription}</p>
                </div>
              )}

              <div
                className="customer_experience_journey__column-cards"
                style={{ "--journey-rows": maxRows }}
              >
                {Array.from({ length: maxRows }, (_, rowIndex) => {
                const card = stage.cards[rowIndex];

                if (!card) {
                  return (
                    <div
                      key={`empty-${stage.id}-${rowIndex}`}
                      className="customer_experience_journey__card-spacer"
                      aria-hidden="true"
                    />
                  );
                }

                return (
                  <article
                    key={card.id}
                    className="customer_experience_journey__card"
                    style={{ background: card.cardBg }}
                  >
                    <div
                      className="customer_experience_journey__card-icon"
                      style={{
                        background: card.iconBg,
                        color: card.iconColor,
                      }}
                    >
                      <JourneyCardIcon type={card.icon} />
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    {card.linkPath && card.linkLabel ? (
                      <Link
                        to={card.linkPath}
                        className="customer_experience_journey__card-link"
                      >
                        {card.linkLabel}
                      </Link>
                    ) : (
                      card.metric && (
                        <span
                          className="customer_experience_journey__metric"
                          style={{ color: card.metricColor }}
                        >
                          <span aria-hidden="true">★</span>
                          {card.metric}
                        </span>
                      )
                    )}
                  </article>
                );
              })}
              </div>
            </div>
          ))}
        </div>

        {meta.ctaLabel && meta.ctaPath ? (
          <div className="customer_experience_journey__footer">
            <Link to={meta.ctaPath} className="customer_experience_journey__cta">
              {meta.ctaLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default CustomerExperienceJourney;
