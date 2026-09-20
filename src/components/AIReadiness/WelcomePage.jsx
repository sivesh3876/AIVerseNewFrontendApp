import { useState } from "react";
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
  const [selectedDimension, setSelectedDimension] = useState(null);

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

            <div className="assessment-stats">
              <div className="assessment-stat"><strong>{totalQuestions}</strong><span>Questions</span></div>
              <div className="stat-divider" />
              <div className="assessment-stat"><strong>{totalDimensions}</strong><span>Dimensions</span></div>
              <div className="stat-divider" />
              <div className="assessment-stat"><strong>10–15</strong><span>Minutes</span></div>
              <div className="stat-divider" />
              <div className="assessment-stat"><strong>1–5</strong><span>Rating Scale</span></div>
            </div>

            <button type="button" className="start-assessment-button" onClick={onStart}>
              Start AI Readiness Assessment
              <span className="button-arrow">→</span>
            </button>

            {hasSavedProgress && (
              <button type="button" className="resume-assessment-button" onClick={onResume}>
                Resume Assessment
              </button>
            )}
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
              <div
                className="dimension-card"
                key={dimension.id}
                onClick={() => setSelectedDimension(dimension)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedDimension(dimension);
                  }
                }}
              >
                <div className="dimension-card-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3>{dimension.title}</h3>
                <p>{dimension.questions.length} questions</p>
              </div>
            ))}
          </div>
        </section>

        {selectedDimension && (
          <div
            className="dimension-preview-overlay"
            onClick={() => setSelectedDimension(null)}
          >
            <div
              className="dimension-preview-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="dimension-preview-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="dimension-preview-close"
                onClick={() => setSelectedDimension(null)}
                aria-label="Close"
              >
                ×
              </button>

              <div className="dimension-preview-number">
                {String(
                  assessmentData.findIndex(
                    (dimension) => dimension.id === selectedDimension.id
                  ) + 1
                ).padStart(2, "0")}
              </div>

              <h2 id="dimension-preview-title">
                {selectedDimension.title}
              </h2>

              <p className="dimension-preview-description">
                These are the questions included in this dimension.
              </p>

              <div className="dimension-preview-questions">
                {selectedDimension.questions.map((question, index) => (
                  <div
                    className="dimension-preview-question"
                    key={question.id}
                  >
                    <div className="dimension-preview-question-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <p>{question.text}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="dimension-preview-close-button"
                onClick={() => setSelectedDimension(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

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
