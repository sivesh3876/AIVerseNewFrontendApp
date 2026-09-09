import {
  buildExploreSolutionPath,
  getServiceIdForDomain,
} from "./solutionMapper";

export const getJourneySolutionCapabilityId = (solutionId) =>
  `api-${solutionId}`;

export const extractSolutionIdFromJourneyLink = (linkPath = "") => {
  const match = String(linkPath).match(/solution=api-(\d+)/i);
  return match ? Number(match[1]) : null;
};

export const extractServiceIdFromJourneyLink = (linkPath = "") => {
  const match = String(linkPath).match(/[?&]service=([^&]+)/i);
  return match ? decodeURIComponent(match[1]) : null;
};

export const buildJourneySolutionLinkPath = (solutionId, serviceId) =>
  `/explore-solutions?service=${serviceId}&solution=${getJourneySolutionCapabilityId(solutionId)}`;

export const buildSolutionTitleMap = (solutions = []) => {
  const map = new Map();

  solutions.forEach((solution) => {
    if (solution?.ID == null) {
      return;
    }

    map.set(Number(solution.ID), {
      title: solution.Title || "",
      serviceId: getServiceIdForDomain(solution.BusinessDomain),
      businessDomain: solution.BusinessDomain || "",
      path: buildExploreSolutionPath({
        businessDomain: solution.BusinessDomain,
        solutionId: solution.ID,
      }),
    });
  });

  return map;
};

export const resolveJourneyCardDisplayTitle = (card, solutionMap = new Map()) => {
  if (card.solutionId == null) {
    return card.title || "";
  }

  const fromApi = solutionMap.get(Number(card.solutionId));
  if (fromApi?.title) {
    return fromApi.title;
  }

  return "";
};

export const resolveJourneyCardSolutionLink = (card, solutionMap = new Map()) => {
  const solutionId =
    card.solutionId ?? extractSolutionIdFromJourneyLink(card.linkPath);

  if (!solutionId) {
    return null;
  }

  const fromApi = solutionMap.get(Number(solutionId));
  const path =
    fromApi?.path ||
    buildExploreSolutionPath({
      businessDomain: fromApi?.businessDomain,
      solutionId,
    });

  if (path && path !== "/explore-solutions") {
    return {
      solutionId,
      label: fromApi?.title || "",
      path,
    };
  }

  const serviceId =
    fromApi?.serviceId ||
    extractServiceIdFromJourneyLink(card.linkPath) ||
    "agentic-automation";

  return {
    solutionId,
    label: fromApi?.title || "",
    path: buildJourneySolutionLinkPath(solutionId, serviceId),
  };
};
