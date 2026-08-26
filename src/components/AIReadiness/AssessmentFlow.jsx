import { useEffect, useRef, useState } from "react";
import InstructionsModal from "./InstructionsModal";

export default function AssessmentFlow({
  heroBackground,
  assessmentData,
  questions,
  totalQuestions,
  totalDimensions,
  currentDimension,
  questionIndex,
  progress,
  answers,
  error,
  submitting,
  maturityLevels,
  scoringTips,
  instructionsOpen,
  onOpenInstructions,
  onCloseInstructions,
  onAnswer,
  onSubmit,
  onSaveExit,
}) {
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const lastShownError = useRef("");
  useEffect(() => {
  if (error && error !== lastShownError.current) {
    lastShownError.current = error;
    setShowValidationPopup(true);
  }
}, [error]);
  if (!questions[questionIndex]) {
    return (
      <div className="welcome-page">
        <main className="welcome-main">
          <div className="assessment-body">
            <div className="error">
              No assessment question is available. Please check the assessment data.
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="welcome-page assessment-flow">

      <main className="welcome-main">
        <section
          className="welcome-hero assessment-hero"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="welcome-hero__overlay" aria-hidden="true" />
          <div className="welcome-hero__content">
            <div className="welcome-badge">AI VERSE • AI READINESS ASSESSMENT</div>
            <h1>
              {(() => {
                const dimensionName = assessmentData[currentDimension].name;
                const parts = dimensionName.split(" ");
                const firstWord = parts[0];
                const restWords = parts.slice(1).join(" ");
                return (
                  <>
                    {firstWord}
                    {restWords ? (
                      <> <span className="welcome-hero__accent">{restWords}</span></>
                    ) : null}
                  </>
                );
              })()}
            </h1>

            <p className="welcome-description">
              Answer each question based on your organisation&apos;s current capabilities.
              Select the option that best describes your organisation.
            </p>

            <div className="assessment-stats">
              <div className="assessment-stat"><strong>{questionIndex + 1}/{totalQuestions}</strong><span>Questions</span></div>
              <div className="stat-divider" />
              <div className="assessment-stat"><strong>{currentDimension + 1}/{totalDimensions}</strong><span>Dimensions</span></div>
              <div className="stat-divider" />
              <div className="assessment-stat"><strong>{progress}%</strong><span>Complete</span></div>
              <div className="stat-divider" />
              <div className="assessment-stat"><strong>1–5</strong><span>Rating Scale</span></div>
            </div>
          </div>
        </section>

        <section className="assessment-overview assessment-body">
          <div className="assessment-toolbar">
            <button
              type="button"
              className="assessment-toolbar-button"
              onClick={onOpenInstructions}
            >
              Instructions
            </button>

            <button
              type="button"
              className="assessment-toolbar-button assessment-toolbar-button--save"
              onClick={onSaveExit}
            >
              Save & Exit
            </button>
          </div>

          <div className="section-heading">
            <p className="section-label">AI READINESS ASSESSMENT</p>
            <h2>Assessment Questions</h2>
            <p>Please answer all {totalQuestions} questions.</p>
          </div>

          <p className="answer-instruction">
            Select the maturity level that best describes your organisation.
          </p>

          <div className="all-questions-container">
            {assessmentData.map((dimension) => (
              <div className="assessment-dimension-card" key={dimension.id}>
                <div className="assessment-dimension-header">
                  <div>
                    <p className="section-label">DIMENSION</p>
                    <h2>{dimension.name}</h2>
                  </div>
                  <span className="dimension-question-count">{dimension.questions.length} questions</span>
                </div>

                <div className="dimension-questions">
                  {dimension.questions.map((question) => {
                    const index = questions.findIndex((item) => item.id === question.id);
                    const selectedAnswer = answers[index];

                    return (
                      <div className="all-question-card" key={question.id}>
                        <p className="question-number">Question {index + 1}</p>
                        <h3 className="question-text">{question.text}</h3>

                        {question.context && (
                          <div className="question-context">
                            <p className="question-context-title">What this assesses</p>
                            <p className="question-context-text">{question.context}</p>
                          </div>
                        )}

                        <div className="answer-section">
                          <div className="answer-buttons">
                            {maturityLevels.map((option) => (
                              <button
                                type="button"
                                key={option.value}
                                className={selectedAnswer === option.value ? "selected" : ""}
                                aria-pressed={selectedAnswer === option.value}
                                onClick={() => onAnswer(index, option.value)}
                              >
                                <span className="answer-number">{option.value}</span>
                                <span className="answer-label">{option.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="navigation-buttons">
            <button type="button" className="next-button" onClick={onSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Assessment"}
            </button>
          </div>
        </section>
      </main>

      {showValidationPopup && error && (
        <div
          className="assessment-validation-overlay"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="assessment-validation-title"
        >
          <div className="assessment-validation-modal">
            <div className="assessment-validation-icon" aria-hidden="true">
              !
            </div>

            <h2 id="assessment-validation-title">
              Complete the assessment
            </h2>

            <p>{error}</p>

            <button
              type="button"
              className="assessment-validation-button"
              onClick={() => setShowValidationPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <InstructionsModal
        open={instructionsOpen}
        onClose={onCloseInstructions}
        maturityLevels={maturityLevels}
        scoringTips={scoringTips}
      />
    </div>
  );
}
