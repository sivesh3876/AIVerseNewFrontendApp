import jsPDF from "jspdf";
import { getDimensionMaturityLevel, getDimensionMaturityScore } from "./aiReadinessAssessmentUtils";

export default function downloadAssessmentReport({
    overallScore,
    readinessLevel,
    dimensionResults,
}) {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 20;

    // -----------------------------------
    // TITLE
    // -----------------------------------

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("AI Readiness Assessment", 20, y);

    y += 9;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Assessment Results", 20, y);

    y += 15;

    // -----------------------------------
    // OVERALL SCORE
    // -----------------------------------

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Overall Readiness", 20, y);

    y += 10;

    doc.setFontSize(28);
    doc.text(`${overallScore}%`, 20, y);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(readinessLevel, 60, y);

    y += 12;

    doc.setFontSize(10);
    doc.text(
        "Overall AI readiness score",
        20,
        y
    );

    y += 18;

    // -----------------------------------
    // DIMENSION SCORES
    // -----------------------------------

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Dimension Scores", 20, y);

    y += 10;

    dimensionResults.forEach((dimension) => {
        const score = Number(dimension.score ?? 0);

        const maturityScore = getDimensionMaturityScore(score);

        const maturityLevel = getDimensionMaturityLevel(score);

        // Prevent content from running off the page
        if (y > pageHeight - 55) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(dimension.name, 20, y);

        doc.setFont("helvetica", "normal");
        doc.text(
            `${score}%   |   ${maturityScore.toFixed(1)} / 5   |   ${maturityLevel}`,
            20,
            y + 6
        );

        // Rating blocks
        const filledBlocks = Math.round(maturityScore);

        for (let i = 0; i < 5; i++) {
            const x = 20 + i * 9;

            if (i < filledBlocks) {
                doc.setFillColor(37, 99, 235);
                doc.rect(x, y + 11, 6, 5, "F");
            } else {
                doc.setDrawColor(180, 180, 180);
                doc.rect(x, y + 11, 6, 5);
            }
        }

        y += 23;

        if (dimension.recommendation) {
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");

            const recommendation =
                `Recommendation: ${dimension.recommendation}`;

            const recommendationLines =
                doc.splitTextToSize(
                    recommendation,
                    pageWidth - 40
                );

            doc.text(
                recommendationLines,
                20,
                y
            );

            y += recommendationLines.length * 4 + 3;
        }

        if (dimension.nextStep) {
            doc.setFontSize(9);

            const nextStep =
                `Next step: ${dimension.nextStep}`;

            const nextStepLines =
                doc.splitTextToSize(
                    nextStep,
                    pageWidth - 40
                );

            doc.text(
                nextStepLines,
                20,
                y
            );

            y += nextStepLines.length * 4 + 6;
        }
    });

    // -----------------------------------
    // RADAR CHART
    // -----------------------------------

    if (y > pageHeight - 150) {
        doc.addPage();
        y = 25;
    }

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text(
        "Maturity by Dimension",
        20,
        y
    );

    y += 12;

    const centerX = pageWidth / 2;
    const centerY = y + 65;
    const radius = 48;

    const count = dimensionResults.length;

    // Grid
    for (let level = 1; level <= 5; level++) {
        const levelRadius =
            radius * (level / 5);

        const points = [];

        for (let i = 0; i < count; i++) {
            const angle =
                (Math.PI * 2 * i) / count -
                Math.PI / 2;

            points.push({
                x:
                    centerX +
                    Math.cos(angle) * levelRadius,
                y:
                    centerY +
                    Math.sin(angle) * levelRadius,
            });
        }

        doc.setDrawColor(210, 210, 210);

        for (let i = 0; i < points.length; i++) {
            const current = points[i];
            const next =
                points[(i + 1) % points.length];

            doc.line(
                current.x,
                current.y,
                next.x,
                next.y
            );
        }
    }

    // Axes
    for (let i = 0; i < count; i++) {
        const angle =
            (Math.PI * 2 * i) / count -
            Math.PI / 2;

        const x =
            centerX +
            Math.cos(angle) * radius;

        const yAxis =
            centerY +
            Math.sin(angle) * radius;

        doc.setDrawColor(210, 210, 210);

        doc.line(
            centerX,
            centerY,
            x,
            yAxis
        );
    }

    // Actual score polygon
    const scorePoints =
        dimensionResults.map(
            (dimension, index) => {
                const score =
                    Math.max(
                        0,
                        Math.min(
                            5,
                            Number(dimension.score ?? 0) / 20
                        )
                    );

                const angle =
                    (Math.PI * 2 * index) / count -
                    Math.PI / 2;

                return {
                    x:
                        centerX +
                        Math.cos(angle) *
                        radius *
                        (score / 5),

                    y:
                        centerY +
                        Math.sin(angle) *
                        radius *
                        (score / 5),
                };
            }
        );

    // Radar outline
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1.2);

    for (
        let i = 0;
        i < scorePoints.length;
        i++
    ) {
        const current = scorePoints[i];

        const next =
            scorePoints[
            (i + 1) % scorePoints.length
            ];

        doc.line(
            current.x,
            current.y,
            next.x,
            next.y
        );
    }

    // Radar points
    doc.setFillColor(37, 99, 235);

    scorePoints.forEach((point) => {
        doc.circle(
            point.x,
            point.y,
            2,
            "F"
        );
    });

    // Labels
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");

    dimensionResults.forEach(
        (dimension, index) => {
            const angle =
                (Math.PI * 2 * index) / count -
                Math.PI / 2;

            const labelRadius = radius + 12;

            const x =
                centerX +
                Math.cos(angle) *
                labelRadius;

            const labelY =
                centerY +
                Math.sin(angle) *
                labelRadius;

            const lines =
                doc.splitTextToSize(
                    dimension.name,
                    28
                );

            doc.text(
                lines,
                x,
                labelY,
                {
                    align:
                        x < centerX
                            ? "right"
                            : x > centerX
                                ? "left"
                                : "center",
                }
            );
        }
    );

    // -----------------------------------
    // FOOTER
    // -----------------------------------

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    doc.text(
        "AI Readiness Assessment",
        20,
        pageHeight - 10
    );

    doc.text(
        `Generated ${new Date().toLocaleDateString()}`,
        pageWidth - 20,
        pageHeight - 10,
        { align: "right" }
    );

    // -----------------------------------
    // DOWNLOAD
    // -----------------------------------

    doc.save(
        "AI-Readiness-Assessment-Results.pdf"
    );
}
