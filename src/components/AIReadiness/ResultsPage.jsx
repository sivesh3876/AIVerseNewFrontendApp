import MaturityRadarChart from "./MaturityRadarChart";
import {
  getRecommendationPrefix,
  getDimensionMaturityScore,
  getDimensionMaturityLevel,
  getRatingBlocks,
} from "../../utils/aiReadinessAssessmentUtils";
import downloadAssessmentReport from "../../utils/downloadAssessmentReport";

export default function ResultsPage({
  heroBackground,
  overallScore,
  readinessLevel,
  dimensionResults,
  totalDimensions,
  onRetake,
  onStartOver,
}) {
  const readinessMessage = {
    Initial: "AI readiness is at an early stage. Focus on establishing foundational capabilities.",
    Developing: "AI capabilities are beginning to develop. Focus on building consistent practices.",
    Defined: "AI capabilities are developing across the organisation. Focus on scaling and strengthening them.",
    Advanced: "The organisation demonstrates strong AI readiness. Focus on optimisation and continued improvement.",
    Leading: "The organisation demonstrates leading AI readiness. Focus on continuous improvement and innovation.",
  }[readinessLevel] || "";

  const readinessClass = readinessLevel.toLowerCase().replace(/\s+/g, "-");
  const scoreRange = {
    Initial: "0–19%",
    Developing: "20–39%",
    Defined: "40–59%",
    Advanced: "60–79%",
    Leading: "80–100%",
  }[readinessLevel] || "—";

  return (
    <div className="results-page">

      <section
        className="welcome-hero dashboard-hero"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="welcome-hero__overlay" aria-hidden="true" />
        <div className="welcome-hero__content">
          <div className="welcome-badge">AI VERSE • ASSESSMENT COMPLETE</div>
          <h1>Assessment <span className="welcome-hero__accent">Complete</span></h1>
          <p className="welcome-description">
            Your organisation&apos;s AI readiness score and dimension-level insights are ready.
          </p>
          <div className="assessment-stats">
            <div className="assessment-stat"><strong>{overallScore}%</strong><span>Overall Score</span></div>
            <div className="stat-divider" />
            <div className="assessment-stat"><strong>{readinessLevel}</strong><span>Readiness Level</span></div>
            <div className="stat-divider" />
            <div className="assessment-stat"><strong>{totalDimensions}</strong><span>Dimensions</span></div>
            <div className="stat-divider" />
            <div className="assessment-stat"><strong>{scoreRange}</strong><span>Score Range</span></div>
          </div>
        </div>
      </section>

      <section className="dashboard-results">
        <div className="section-heading">
          <p className="section-label">YOUR RESULTS</p>
          <h2>Your AI Readiness Score</h2>
          <p>
            Review your overall score and dimension breakdown to identify strengths and next steps.
          </p>
        </div>

        <div className="results-summary-card">
          <div className="score-circle">
            <div className="score-circle-inner">
              <span>{overallScore}%</span>
              <small>Readiness</small>
            </div>
          </div>
          <h3 className="results-summary-title">AI Readiness</h3>
          <div className={`readiness-badge ${readinessClass}`}>{readinessLevel}</div>
          <p className="score-range">Score range: {scoreRange}</p>
          <p className="readiness-message">{readinessMessage}</p>
        </div>
      </section>

      <div className="results-card">
        <div className="dimension-section">
          <h3>Dimension Scores</h3>
          {dimensionResults.map((dimension, index) => {
            const score = dimension.score ?? 0;
            const maturityScore = getDimensionMaturityScore(score);
            const maturityLevel = getDimensionMaturityLevel(score);
            const rating = getRatingBlocks(score);
            const questionCount = dimension.maxRawScore ? dimension.maxRawScore / 5 : 4;

            return (
              <div className={`dimension-result dimension-result-${index}`} key={dimension.id}>
                <div className="dimension-header">
                  <div>
                    <span className="dimension-name">{dimension.name}</span>
                    <span className="dimension-question-count">{questionCount} questions</span>
                  </div>
                  <span className="dimension-score">{score}%</span>
                </div>

                <div className="progress-background">
                  <div className="progress-fill" style={{ width: `${score}%` }} />
                </div>

                <div className="dimension-maturity-info">
                  <span className="dimension-maturity-level">{maturityLevel}</span>
                  <span className="dimension-rating">{rating}</span>
                  <span className="dimension-maturity-score">{maturityScore.toFixed(1)} / 5</span>
                </div>

                {dimension.recommendation && (
                  <p className="dimension-recommendation">
                    <strong>{getRecommendationPrefix(score)}</strong>{" "}
                    {dimension.recommendation}
                  </p>
                )}

                {dimension.nextStep && (
                  <p className="dimension-next-step">
                    <strong>Recommended next step:</strong> {dimension.nextStep}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <MaturityRadarChart dimensions={dimensionResults} />

        <p className="results-footer">
          Thank you for completing the AI Readiness Assessment.
        </p>

        <div className="results-actions">
          <button
            type="button"
            className="download-results-button"
            onClick={() => downloadAssessmentReport({ overallScore, readinessLevel, dimensionResults })}
          >
            Download Results
          </button>
          <button type="button" className="retake-button" onClick={onRetake}>
            Retake Assessment
          </button>
          <button type="button" className="start-over-button" onClick={onStartOver}>
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
