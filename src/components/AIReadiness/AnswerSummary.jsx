export default function AnswerSummary({
  assessmentData,
  questions,
  answers,
  maturityLevels,
  onBack,
  onDashboard,
}) {
  return (
    <div className="results-page">
      <div className="results-card answer-summary-card">
        <p className="results-eyebrow">AI VERSE • ASSESSMENT REVIEW</p>
        <h1>Review Your Answers</h1>
        <p className="results-subtitle">
          Please review the options you selected for each question.
        </p>

        <div className="answer-summary">
          {assessmentData.map((dimension) => (
            <div className="summary-dimension" key={dimension.id}>
              <div className="summary-dimension-header">
                <div>
                  <p className="section-label">DIMENSION</p>
                  <h2>{dimension.name}</h2>
                </div>
                <span className="dimension-question-count">
                  {dimension.questions.length} questions
                </span>
              </div>

              <div className="summary-questions">
                {dimension.questions.map((question) => {
                  const index = questions.findIndex((item) => item.id === question.id);
                  const selectedAnswer = answers[index];
                  const selectedLevel = maturityLevels.find(
                    (level) => level.value === selectedAnswer
                  );

                  return (
                    <div className="summary-question" key={question.id}>
                      <p className="summary-question-number">Question {index + 1}</p>
                      <h3>{question.text}</h3>
                      <div className="summary-answer">
                        <span className="summary-answer-check">✓</span>
                        <div>
                          <span className="summary-answer-label">Your answer</span>
                          <strong>
                            {selectedLevel
                              ? `${selectedLevel.value} — ${selectedLevel.name}`
                              : "Not answered"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="summary-actions">
          <button type="button" className="summary-back-button" onClick={onBack}>
            ← Back to Assessment
          </button>
          <button type="button" className="summary-dashboard-button" onClick={onDashboard}>
            View Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
