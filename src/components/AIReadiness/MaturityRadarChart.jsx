import { getDimensionMaturityScore } from "../../utils/aiReadinessAssessmentUtils";

export default function MaturityRadarChart({ dimensions }) {
  const size = 420;
  const center = size / 2;
  const radius = 145;

  const count = dimensions.length;

  if (!count) return null;

  const getPoint = (index, value) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const distance = (value / 5) * radius;

    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    };
  };

  const getAxisPoint = (index, scale = 5) => {
    return getPoint(index, scale);
  };

  const radarPoints = dimensions
    .map((dimension, index) => {
      const score = getDimensionMaturityScore(dimension.score);
      const point = getPoint(index, score);

      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <div className="radar-chart-card">
      <h3>Radar — maturity by dimension</h3>

      <div className="radar-chart-wrapper">
        <svg
          className="radar-chart"
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label="AI maturity by dimension"
        >
          {/* Radar grid */}
          {[1, 2, 3, 4, 5].map((level) => {
            const points = dimensions
              .map((_, index) => {
                const point = getAxisPoint(index, level);

                return `${point.x},${point.y}`;
              })
              .join(" ");

            return (
              <polygon
                key={level}
                points={points}
                className="radar-grid"
              />
            );
          })}

          {/* Axis lines */}
          {dimensions.map((dimension, index) => {
            const point = getAxisPoint(index, 5);

            return (
              <line
                key={`axis-${dimension.id}`}
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                className="radar-axis"
              />
            );
          })}

          {/* Filled radar area */}
          <polygon
            points={radarPoints}
            className="radar-area"
          />

          {/* Radar outline */}
          <polyline
            points={radarPoints}
            className="radar-line"
          />

          {/* Score points */}
          {dimensions.map((dimension, index) => {
            const score = getDimensionMaturityScore(
              dimension.score
            );

            const point = getPoint(index, score);

            return (
              <circle
                key={`point-${dimension.id}`}
                cx={point.x}
                cy={point.y}
                r="5"
                className="radar-point"
              />
            );
          })}

          {/* Dimension labels */}
          {dimensions.map((dimension, index) => {
            const labelPoint = getPoint(index, 6);

            let textAnchor = "middle";

            if (labelPoint.x < center - 20) {
              textAnchor = "end";
            } else if (labelPoint.x > center + 20) {
              textAnchor = "start";
            }

            return (
              <text
                key={`label-${dimension.id}`}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor={textAnchor}
                className="radar-label"
              >
                {dimension.name}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="radar-scale">
        <span>1 — Initial</span>
        <span>2 — Developing</span>
        <span>3 — Defined</span>
        <span>4 — Advanced</span>
        <span>5 — Leading</span>
      </div>
    </div>
  );
}