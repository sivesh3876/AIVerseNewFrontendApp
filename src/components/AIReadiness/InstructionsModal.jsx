export default function InstructionsModal({ open, onClose, maturityLevels, scoringTips }) {
  if (!open) return null;

  return (
    <div
      className="instructions-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="instructions-title"
    >
      <div className="instructions-panel">
        <button
          type="button"
          className="instructions-close"
          aria-label="Close instructions"
          onClick={onClose}
        >
          ×
        </button>

        <div className="instructions-panel-content">
          <p className="section-label">ASSESSMENT INSTRUCTIONS</p>

          <h2 id="instructions-title">How to rate your organisation</h2>

          <p className="instructions-intro">
            Select the level that best describes your organisation today. Score
            where you are, not where you aspire to be.
          </p>

          <div className="instruction-levels">
            {maturityLevels.map((level) => (
              <div className="instruction-level" key={level.value}>
                <div className="instruction-level-number">{level.value}</div>
                <div>
                  <h3>{level.name}</h3>
                  <p>{level.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="instruction-tips">
            <h3>Tips for honest scoring</h3>
            <ul>
              {scoringTips.map((tip) => <li key={tip}>{tip}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
