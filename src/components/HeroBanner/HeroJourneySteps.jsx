import "./HeroJourneySteps.scss";

const JOURNEY_STEPS = [
  {
    number: 1,
    title: "Explore freely",
    description: "Pick a use case and interact live — no login",
  },
  {
    number: 2,
    title: "Go deeper",
    description: "Found something interesting? See the full solution detail",
  },
  {
    number: 3,
    title: "Connect with us",
    description: "Register to unlock full access and speak to an expert",
  },
];

const HeroJourneySteps = ({ onCreateAccount }) => {
  return (
    <div className="hero_journey_steps">
      <div className="hero_journey_steps__steps">
        {JOURNEY_STEPS.map((step) => (
          <article key={step.number} className="hero_journey_steps__step">
            <span className="hero_journey_steps__number" aria-hidden="true">
              {step.number}
            </span>
            <div className="hero_journey_steps__copy">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="hero_journey_steps__cta">
        <p className="hero_journey_steps__cta-label">Ready to go deeper?</p>
        <button
          type="button"
          className="hero_journey_steps__cta-btn primary_btn"
          onClick={onCreateAccount}
        >
          Create free account
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 17 17 7M17 7H9M17 7v8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HeroJourneySteps;
