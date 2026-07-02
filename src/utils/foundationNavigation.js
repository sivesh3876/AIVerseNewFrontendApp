export const AI_FOUNDATION_HIGHLIGHT_KEY = "aiFoundationHighlight";
export const AI_FOUNDATION_HIGHLIGHT_EVENT = "ai-foundation-highlight";

export const FOUNDATION_NAVIGATION = {
  "azure-openai": {
    keywords: ["azure", "openai", "open ai", "gpt", "azure ai foundry"],
    serviceId: "digital-engineering",
  },
  claude: {
    keywords: ["claude", "anthropic"],
    serviceId: "digital-experience",
  },
  "github-copilot": {
    keywords: ["copilot", "github"],
    serviceId: "digital-engineering",
  },
  cursor: {
    keywords: ["cursor"],
    serviceId: "digital-engineering",
  },
};

const getSearchableText = (solution = {}) =>
  [
    solution.title,
    solution.description,
    solution.techHighlight,
    solution.client,
    solution.domainLabel,
    solution.techText,
    Array.isArray(solution.aiFoundation)
      ? solution.aiFoundation.join(" ")
      : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const solutionMatchesFoundation = (solution, foundationId) => {
  const config = FOUNDATION_NAVIGATION[foundationId];
  if (!config || !solution) {
    return false;
  }

  const foundationLabels = {
    "azure-openai": "Azure OpenAI",
    claude: "Claude (Anthropic)",
    "github-copilot": "GitHub Copilot",
    cursor: "Cursor",
  };

  if (
    Array.isArray(solution.aiFoundation) &&
    solution.aiFoundation.includes(foundationLabels[foundationId])
  ) {
    return true;
  }

  const searchableText = getSearchableText(solution);
  return config.keywords.some((keyword) => searchableText.includes(keyword));
};

export const findHomeSolutionForFoundation = (solutions = [], foundationId) =>
  solutions.find((solution) => solutionMatchesFoundation(solution, foundationId));

export const getFoundationExplorePath = (foundationId) => {
  const config = FOUNDATION_NAVIGATION[foundationId];
  if (!config?.serviceId) {
    return "/explore-solutions";
  }

  return `/explore-solutions?service=${config.serviceId}`;
};

export const readPendingFoundationHighlight = () => {
  const foundationId = sessionStorage.getItem(AI_FOUNDATION_HIGHLIGHT_KEY);
  if (!foundationId) {
    return null;
  }

  sessionStorage.removeItem(AI_FOUNDATION_HIGHLIGHT_KEY);
  return foundationId;
};

export const queueFoundationHighlight = (foundationId) => {
  if (!foundationId) {
    return;
  }

  sessionStorage.setItem(AI_FOUNDATION_HIGHLIGHT_KEY, foundationId);
  window.dispatchEvent(
    new CustomEvent(AI_FOUNDATION_HIGHLIGHT_EVENT, {
      detail: { foundationId },
    }),
  );
};
