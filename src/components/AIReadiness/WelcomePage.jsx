import InstructionsModal from "./InstructionsModal";

export default function WelcomePage({
  heroBackground,
  assessmentData,
  totalQuestions,
  totalDimensions,
  hasSavedProgress,
  onStart,
  onResume,
  instructionsOpen,
  onOpenInstructions,
  onCloseInstructions,
  maturityLevels,
  scoringTips,
}) {
  return (
    <div className="welcome-page">

      <main className="welcome-main">
        <section
          className="welcome-hero"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="welcome-hero__overlay" aria-hidden="true" />
          <div className="welcome-hero__content">
            <div className="welcome-badge">AI VERSE • ORGANISATIONAL ASSESSMENT</div>

            <h1>
              How ready is your{" "}
              <span className="welcome-hero__accent">organisation for AI?</span>
            </h1>

            <p className="welcome-description">
              Understand your organisation's current AI capabilities, identify
              key gaps, and discover where to focus next.
            </p>

            <button type="button" className="start-assessment-button" onClick={onStart}>
              Start AI Readiness Assessment
              <span className="button-arrow">→</span>
            </button>

            {hasSavedProgress && (
              <button type="button" className="resume-assessment-button" onClick={onResume}>
                Resume Assessment
              </button>
            )}

            <div className="assessment-stats">
              <div className="assessment-stat"><strong>{totalQuestions}</strong><span>Questions</span></div>
              <div className="stat-divider" />
              <div className="assessment-stat"><strong>{totalDimensions}</strong><span>Dimensions</span></div>
              <div className="stat-divider" />
              <div className="assessment-stat"><strong>10–15</strong><span>Minutes</span></div>
              <div className="stat-divider" />
              <div className="assessment-stat"><strong>1–5</strong><span>Rating Scale</span></div>
            </div>
          </div>
        </section>

        <section className="assessment-overview">
          <div className="section-heading">
            <p className="section-label">THE ASSESSMENT</p>
            <h2>What you'll assess</h2>
            <p>
              The assessment evaluates key areas that influence an organisation's
              ability to adopt and scale AI successfully.
            </p>
          </div>

          <div className="dimension-grid">
            {assessmentData.map((dimension, index) => (
              <div className="dimension-card" key={dimension.id}>
                <div className="dimension-card-number">{String(index + 1).padStart(2, "0")}</div>
                <h3>{dimension.name}</h3>
                <p>{dimension.questions.length} questions</p>
              </div>
            ))}
          </div>
        </section>

        <div className="welcome-instructions-action">
          <button type="button" className="instructions-link" onClick={onOpenInstructions}>
            View assessment instructions <span aria-hidden="true">→</span>
          </button>
        </div>

        <section className="before-section">
          <div className="before-card">
            <div className="before-icon">✓</div>
            <div>
              <h2>Before you begin</h2>
              <p>
                Answer each question based on your organisation's current
                capabilities and practices. There are no right or wrong answers.
                Your responses will help identify strengths and areas that may
                require further development.
              </p>
            </div>
          </div>
        </section>
      </main>

      <InstructionsModal
        open={instructionsOpen}
        onClose={onCloseInstructions}
        maturityLevels={maturityLevels}
        scoringTips={scoringTips}
      />
    </div>
  );
}
