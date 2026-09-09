export function getRecommendationPrefix(score) {
    if (score >= 80) return "Strength:";
    if (score >= 60) return "Good progress:";
    if (score >= 40) return "Development opportunity:";
    if (score >= 20) return "Priority area:";
    return "Critical priority:";
}

export function getReadinessMessage(level) {
    const messages = {
        Initial: "AI readiness is at an early stage. Focus on establishing foundational capabilities.",
        Developing: "AI capabilities are beginning to develop. Focus on building consistent practices.",
        Defined: "AI capabilities are developing across the organisation. Focus on scaling and strengthening them.",
        Advanced: "The organisation demonstrates strong AI readiness. Focus on optimisation and continued improvement.",
        Leading: "The organisation demonstrates leading AI readiness. Focus on continuous improvement and innovation.",
    };

    return messages[level] || "";
}

export function getDimensionMaturityScore(score) {
    return Math.max(0, Math.min(5, Number(score || 0) / 20));
}

export function getDimensionMaturityLevel(score) {
    const maturityScore = getDimensionMaturityScore(score);

    if (maturityScore < 2) return "L1 — Initial";
    if (maturityScore < 3) return "L2 — Developing";
    if (maturityScore < 4) return "L3 — Defined";
    if (maturityScore < 5) return "L4 — Advanced";
    return "L5 — Leading";
}

export function getRatingBlocks(score) {
    const maturityScore = getDimensionMaturityScore(score);
    const filled = Math.round(maturityScore);
    return "■".repeat(filled) + "□".repeat(5 - filled);
}

export const maturityLevels = [
    { value: 1, name: "Initial", description: "No formal capability. This area is ad-hoc, undocumented, or entirely absent." },
    { value: 2, name: "Developing", description: "Early-stage. Informal practices exist but are inconsistent and not scaled." },
    { value: 3, name: "Defined", description: "Formalised and documented. Repeatable processes in place in some areas." },
    { value: 4, name: "Advanced", description: "Scaled and optimised. Embedded across most of the organisation with measurable outcomes." },
    { value: 5, name: "Leading", description: "Best-in-class. Continuously improved, externally benchmarked, and a strategic differentiator." },
];

export const scoringTips = [
    "Score where you ARE, not where you aspire to be. An honest Level 2 is more valuable than an optimistic Level 4.",
    "If in doubt between two levels, choose the lower one. Underestimating gaps leads to more useful recommendations.",
    "Score from the perspective of the whole organisation, not just the most advanced team or project.",
    "Involve multiple stakeholders (IT, business, leadership) to triangulate scores across dimensions.",
    "Reassess every 6–12 months to track progress and update the roadmap accordingly.",
];

export function getReadinessLevel(overallScore) {
    return overallScore >= 80
        ? "Leading"
        : overallScore >= 60
            ? "Advanced"
            : overallScore >= 40
                ? "Defined"
                : overallScore >= 20
                    ? "Developing"
                    : "Initial";
}

export function getScoreRange(readinessLevel) {
    return {
        Initial: "0–19%",
        Developing: "20–39%",
        Defined: "40–59%",
        Advanced: "60–79%",
        Leading: "80–100%",
    }[readinessLevel] || "—";
}

export function getDimensionForQuestion(assessmentData, index) {
    let questionCount = 0;

    for (let dimensionIndex = 0; dimensionIndex < assessmentData.length; dimensionIndex++) {
        questionCount += assessmentData[dimensionIndex].questions.length;
        if (index < questionCount) return dimensionIndex;
    }

    return 0;
}
