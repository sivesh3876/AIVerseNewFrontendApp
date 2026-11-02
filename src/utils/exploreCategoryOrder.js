import {
  hasPermission,
  isAdminPortalSession,
} from "./adminAuth";

/** DomainCode → explore category slug (matches backend SERVICE_SLUG_TO_DOMAIN_CODES). */
const DOMAIN_CODE_TO_CATEGORY_SLUG = {
  Education: "education",
  Insurance: "insurance",
  Logistics: "logistics",
  CustomerCommunicationManagement: "customer-communication-management",
  CustomerExperienceCRM: "enterprise-application",
  CustomerExperience: "enterprise-application",
  DigitalExperience: "digital-experience",
  AIStrategyModernization: "strategy-modernization",
  DigitalEngineering: "digital-engineering",
  DataAnalytics: "data-management",
  AgenticAutomation: "agentic-automation",
};

/**
 * Canonical CategoryKey for reorder-usecases / SolutionCategoryOrders.
 * Prefer service slug; map known DomainCodes to the same slug the API uses.
 */
export const resolveExploreCategoryKey = ({
  serviceId = null,
  domainCode = null,
} = {}) => {
  const service = String(serviceId || "").trim();
  if (service) {
    return service.toLowerCase();
  }

  const domain = String(domainCode || "").trim();
  if (!domain) {
    return null;
  }

  return DOMAIN_CODE_TO_CATEGORY_SLUG[domain] || domain;
};

/**
 * Admin portal session with solutions.edit may reorder Explore cards.
 * Evangelists / owners / members without that permission cannot.
 */
export const canReorderExploreCards = (session) =>
  isAdminPortalSession(session) && hasPermission("solutions.edit", session);

export const extractNumericSolutionId = (capabilityOrId) => {
  if (capabilityOrId == null) return null;
  if (typeof capabilityOrId === "number" && Number.isFinite(capabilityOrId)) {
    return capabilityOrId;
  }
  const raw =
    typeof capabilityOrId === "object"
      ? capabilityOrId.id ??
        capabilityOrId.ID ??
        capabilityOrId.Id ??
        capabilityOrId.solutionId
      : capabilityOrId;
  const match = String(raw || "").match(/(\d+)$/);
  return match ? Number(match[1]) : null;
};

/** Move one item in an array from fromIndex to toIndex (returns new array). */
export const moveItemInList = (list, fromIndex, toIndex) => {
  if (!Array.isArray(list)) return [];
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length ||
    fromIndex === toIndex
  ) {
    return [...list];
  }
  const next = [...list];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
};

/** Apply an ordered id list to capabilities; unknown ids append at end. */
export const applyCapabilityOrder = (capabilities, orderedIds) => {
  const list = Array.isArray(capabilities) ? [...capabilities] : [];
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return list;
  }

  const byId = new Map(list.map((item) => [String(item.id), item]));
  const used = new Set();
  const ordered = [];

  orderedIds.forEach((id) => {
    const key = String(id);
    const item = byId.get(key);
    if (item) {
      ordered.push(item);
      used.add(key);
    }
  });

  list.forEach((item) => {
    const key = String(item.id);
    if (!used.has(key)) {
      ordered.push(item);
    }
  });

  return ordered;
};
