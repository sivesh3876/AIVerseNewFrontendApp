import {
  BrainIcon,
  GlobeIcon,
  RefreshIcon,
  ZapIcon,
  ShieldIcon,
  ChartIcon,
} from "../components/CustomerCommunicationManagement/CapabilityIcons";
import { enterpriseServicesData } from "../components/CustomerCommunicationManagement/enterpriseServicesData";
import {
  getIndustryByDomainCode,
} from "../components/IndustryExplore/industrySolutionsData";
import {
  buildDocumentsFromApiSolution,
} from "./solutionDocuments";
import { isSolutionIdMarkedInactiveLocally } from "./solutionStatusStorage";

const capabilityIconMap = {
  brain: BrainIcon,
  globe: GlobeIcon,
  refresh: RefreshIcon,
  zap: ZapIcon,
  shield: ShieldIcon,
  chart: ChartIcon,
};

export const resolveCapabilityIcon = (capability) => {
  if (typeof capability?.icon === "function") {
    return capability.icon;
  }

  return capabilityIconMap[capability?.iconKey] || BrainIcon;
};

export const hydrateCapability = (capability) => {
  if (!capability) return null;

  const { icon: _icon, ...rest } = capability;
  return {
    ...rest,
    icon: resolveCapabilityIcon(capability),
  };
};

const AVATAR_COLORS = ["teal", "navy", "orange", "sky"];
const PLACEHOLDER_EVANGELIST = "Undefined";

const AI_FOUNDATION_OPTIONS = [
  "Azure OpenAI",
  "Claude (Anthropic)",
  "GitHub Copilot",
  "Cursor",
];

const LEGACY_AI_FOUNDATION_VALUES = {
  Azure: "Azure OpenAI",
  "Open AI": "Azure OpenAI",
  "Azure OpenAI & GitHub Copilot": "Azure OpenAI",
  Claude: "Claude (Anthropic)",
  "GitHub Copilot": "GitHub Copilot",
};

const normalizeAiFoundationLabel = (value = "") => {
  const trimmed = String(value).trim();
  return LEGACY_AI_FOUNDATION_VALUES[trimmed] || trimmed;
};

export const parseAiFoundationValues = (value = "") => {
  const items = String(value)
    .split(",")
    .map((item) => normalizeAiFoundationLabel(item))
    .filter(Boolean);

  return [...new Set(items)].filter((item) =>
    AI_FOUNDATION_OPTIONS.includes(item),
  );
};

export const resolveSolutionAiFoundation = (solution = {}) => {
  const rawFoundation =
    solution.AiFoundation ??
    solution.AIFoundation ??
    solution.aiFoundation ??
    "";

  const fromField = parseAiFoundationValues(rawFoundation);
  if (fromField.length > 0) {
    return fromField;
  }

  return parseAiFoundationValues(solution.Client);
};

const isAiFoundationValue = (value = "") => {
  const trimmed = String(value).trim();
  if (!trimmed) {
    return false;
  }

  if (trimmed in LEGACY_AI_FOUNDATION_VALUES) {
    return true;
  }

  return AI_FOUNDATION_OPTIONS.includes(trimmed);
};

const domainCodeToServiceId = {
  CustomerCommunicationManagement: "customer-communication-management",
  CustomerExperienceCRM: "enterprise-application",
  CustomerExperience: "enterprise-application",
  DigitalExperience: "digital-experience",
  AIStrategyModernization: "strategy-modernization",
  DigitalEngineering: "digital-engineering",
  DataAnalytics: "data-management",
  AgenticAutomation: "agentic-automation",
};

const normalizeKey = (value = "") =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

export const getServiceIdForDomain = (domainCode) => {
  if (!domainCode) return null;

  if (domainCodeToServiceId[domainCode]) {
    return domainCodeToServiceId[domainCode];
  }

  const normalizedCode = normalizeKey(domainCode);
  const mappedEntry = Object.entries(domainCodeToServiceId).find(
    ([code]) => normalizeKey(code) === normalizedCode,
  );
  if (mappedEntry) {
    return mappedEntry[1];
  }

  const serviceByLabel = enterpriseServicesData.find(
    (service) => normalizeKey(service.label) === normalizedCode,
  );
  if (serviceByLabel) {
    return serviceByLabel.id;
  }

  return null;
};

export const isIndustryBusinessDomain = (domainCode) =>
  Boolean(getIndustryByDomainCode(domainCode));

export const normalizeSolutionCapabilityId = (solutionId) => {
  if (solutionId == null || solutionId === "") return "";

  const raw = String(solutionId).trim();
  if (/^api-/i.test(raw)) return raw;
  if (/^\d+$/.test(raw)) return `api-${raw}`;
  return raw;
};

export const buildExploreSolutionPath = ({
  businessDomain,
  solutionId,
  extraParams = {},
} = {}) => {
  const capabilityId = normalizeSolutionCapabilityId(solutionId);
  const params = new URLSearchParams(
    Object.entries(extraParams).reduce((acc, [key, value]) => {
      if (value != null && value !== "") {
        acc[key] = String(value);
      }
      return acc;
    }, {}),
  );

  const serviceId = getServiceIdForDomain(businessDomain);
  const isIndustry = isIndustryBusinessDomain(businessDomain);

  if (serviceId && !isIndustry) {
    params.set("service", serviceId);
  } else if (businessDomain) {
    params.set("domain", businessDomain);
    const industry = getIndustryByDomainCode(businessDomain);
    if (industry?.id) {
      params.set("industry", industry.id);
    }
  } else {
    params.set("service", "agentic-automation");
  }

  if (capabilityId) {
    params.set("solution", capabilityId);
  }

  const query = params.toString();
  return `/explore-solutions${query ? `?${query}` : ""}`;
};

export const solutionMatchesExploreFilter = ({
  businessDomain,
  activeServiceId,
  activeDomainCode = null,
}) => {
  if (!businessDomain) return false;

  if (activeDomainCode) {
    return normalizeKey(businessDomain) === normalizeKey(activeDomainCode);
  }

  if (isIndustryBusinessDomain(businessDomain)) {
    return false;
  }

  return getServiceIdForDomain(businessDomain) === activeServiceId;
};

export const resolveIndustryDomainCode = (
  { domainCode, industryId, industryTitle } = {},
  businessDomains = [],
) => {
  const industryDomains = businessDomains.filter(
    (domain) => domain.ParentDomainCode === "Industries",
  );

  const normalizedTitle = normalizeKey(industryTitle || "");
  const normalizedId = normalizeKey(industryId || "");
  const normalizedCode = normalizeKey(domainCode || "");

  const match = industryDomains.find((domain) => {
    const code = normalizeKey(domain.DomainCode);
    const name = normalizeKey(domain.DomainName);

    return (
      code === normalizedCode ||
      code === normalizedId ||
      name === normalizedTitle ||
      name === normalizedId
    );
  });

  return match?.DomainCode || domainCode;
};

const getAvatarColor = (index) => AVATAR_COLORS[index % AVATAR_COLORS.length];

const toText = (value) => (value == null ? "" : String(value));

const CLIENT_INFERENCE_RULES = [
  { pattern: /\bhh\s*global\b/i, client: "HH Global" },
  {
    pattern: /\b(the\s+)?dispute\s+service\b|\btds\b/i,
    client: "The Dispute Service Limited",
  },
  {
    pattern: /\bcanopius\b|\bvave\s+mga\b/i,
    client: "Vave MGA (Canopius Insurance Services)",
  },
  { pattern: /\bcullina\b/i, client: "Cullina" },
  { pattern: /\binsper[ae]x\b|\binspera\b/i, client: "InspereX" },
  { pattern: /\bpublicis\b/i, client: "Publicis Groupe" },
  { pattern: /\bfuji\s*xerox\b/i, client: "Fuji Xerox" },
  { pattern: /\bcharles\s*sturt\b/i, client: "Charles Sturt University" },
  { pattern: /\bceva\s*logistics\b/i, client: "CEVA Logistics" },
  { pattern: /\badlm\b|\bdiagnostics\s*&\s*laboratory\b/i, client: "ADLM" },
];

export const resolveSolutionClient = (solution = {}) => {
  const explicit = toText(
    solution.Client ??
      solution.Clients ??
      solution.ClientName ??
      solution.client,
  ).trim();

  if (explicit && explicit.toLowerCase() !== "null") {
    const explicitParts = explicit
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (
      explicitParts.length > 0 &&
      explicitParts.every((item) => isAiFoundationValue(item))
    ) {
      return "";
    }

    return explicit;
  }

  const searchText = [
    solution.Title,
    solution.SolutionContext,
    solution.title,
    solution.description,
    solution.shortDescription,
    solution.detailedDescription,
  ]
    .map(toText)
    .join(" ");

  const matchedRule = CLIENT_INFERENCE_RULES.find((rule) =>
    rule.pattern.test(searchText),
  );

  return matchedRule?.client || "";
};

const parsePersonName = (value) => {
  const trimmed = toText(value).trim();
  if (!trimmed || trimmed === PLACEHOLDER_EVANGELIST) {
    return null;
  }

  const withoutEmail = trimmed.replace(/\s*\([^)]*\)\s*$/, "").trim();
  return withoutEmail || trimmed;
};

const parseEmailFromValue = (value) => {
  const match = toText(value).match(/\(([^)]+@[^)]+)\)/);
  return match ? match[1].trim() : "";
};

const resolveRecordedDemoLink = (solution = {}) => {
  const recordedVideoLink = (solution.DemoRecordedVideoLink || "").trim();
  const demoLink = (solution.DemoLink || "").trim();
  return recordedVideoLink || demoLink;
};

const TECH_STACK_NAME_KEYS = [
  "name",
  "Name",
  "title",
  "Title",
  "technology",
  "Technology",
  "tech",
  "Tech",
  "value",
  "Value",
];

const getTechStackSource = (solution = {}) =>
  solution.TechHighlights ??
  solution.TechnologyHighlights ??
  solution.TechStack ??
  solution.Technologies ??
  solution.techHighlights ??
  "";

const normalizeTechStackItem = (item) => {
  if (item == null) return null;

  if (typeof item === "string" || typeof item === "number") {
    const name = String(item)
      .replace(/^(?:[-•*]\s+|\d+[.)]\s+)/, "")
      .trim();
    return name ? { name, label: "Technology" } : null;
  }

  if (typeof item === "object") {
    const name = TECH_STACK_NAME_KEYS.map((key) => item[key]).find(Boolean);
    const label = item.label || item.Label || item.role || item.category || "Technology";
    const resolvedName = String(name || "")
      .replace(/^(?:[-•*]\s+|\d+[.)]\s+)/, "")
      .trim();

    return resolvedName
      ? { name: resolvedName, label: String(label).trim() || "Technology" }
      : null;
  }

  return null;
};

const parseTechStack = (techHighlights) => {
  if (Array.isArray(techHighlights)) {
    return techHighlights.map(normalizeTechStackItem).filter(Boolean);
  }

  const value =
    techHighlights === null || techHighlights === undefined
      ? ""
      : String(techHighlights).trim();

  if (!value) return [];

  if (value.startsWith("[") || value.startsWith("{")) {
    try {
      return parseTechStack(JSON.parse(value));
    } catch {
      // Fall through to delimiter parsing.
    }
  }

  return value
    .split(/[,;|\n]+/)
    .map((item) => item.replace(/^(?:[-•*]\s+|\d+[.)]\s+)/, "").trim())
    .filter(Boolean)
    .map((name) => ({ name, label: "Technology" }));
};


const truncateText = (value, maxLength = 110) => {
  const text = toText(value).trim();
  if (!text || text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}…`;
};

export const getSolutionOrderNumber = (solution = {}) => {
  const raw =
    solution.OrderNumber ??
    solution.orderNumber ??
    solution.OrderNo ??
    solution.DisplayOrder;

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

const isExplicitlyInactiveFlag = (value) => {
  if (value === false || value === 0) return true;
  if (value == null || value === "") return false;
  const normalized = String(value).trim().toLowerCase();
  return ["false", "0", "no", "inactive"].includes(normalized);
};

/** True when a solution should be treated as Inactive in admin + public views. */
export const isSolutionMarkedInactive = (solution = {}) => {
  const rawId = solution?.ID ?? solution?.id;
  if (rawId != null && isSolutionIdMarkedInactiveLocally(rawId)) {
    return true;
  }

  const numericId = String(rawId || "").match(/(\d+)$/);
  if (numericId && isSolutionIdMarkedInactiveLocally(numericId[1])) {
    return true;
  }

  if (
    isExplicitlyInactiveFlag(
      solution?.IsSolutionActive ?? solution?.isSolutionActive,
    )
  ) {
    return true;
  }

  const publishValue = String(
    solution?.Publish ?? solution?.publish ?? "",
  )
    .trim()
    .toLowerCase();
  if (["no", "false", "0", "inactive"].includes(publishValue)) return true;

  const publicationStatus = String(
    solution?.PublicationStatus ?? solution?.publicationStatus ?? "",
  )
    .trim()
    .toLowerCase();
  if (["draft", "inactive", "archive", "unpublished"].includes(publicationStatus)) {
    return true;
  }

  return false;
};

export const isPublicSolutionVisible = (solution = {}) =>
  !isSolutionMarkedInactive(solution);

export const selectTopOrderedSolutions = (solutions = [], limit = 8) =>
  [...solutions]
    .filter(isPublicSolutionVisible)
    .filter((solution) => {
      const order = getSolutionOrderNumber(solution);
      return Number.isFinite(order) && order >= 1 && order <= 8;
    })
    .sort((left, right) => {
      const leftOrder = getSolutionOrderNumber(left);
      const rightOrder = getSolutionOrderNumber(right);

      if (leftOrder !== rightOrder) return leftOrder - rightOrder;

      return Number(left?.ID || 0) - Number(right?.ID || 0);
    })
    .slice(0, limit);

export const mapApiSolutionToHomeCard = (solution) => {
  if (!solution) return null;

  const orderNumber = getSolutionOrderNumber(solution);
  const serviceId = getServiceIdForDomain(solution.BusinessDomain);
  const service = enterpriseServicesData.find((entry) => entry.id === serviceId);
  const industry = getIndustryByDomainCode(solution.BusinessDomain);
  const techStack = parseTechStack(getTechStackSource(solution));
  const solutionApiId = `api-${solution.ID}`;
  const iconSeed = orderNumber ?? Number(solution.ID) ?? 0;
  const detailUrl = buildExploreSolutionPath({
    businessDomain: solution.BusinessDomain,
    solutionId: solution.ID,
  });

  return {
    id: solutionApiId,
    title: solution.Title || "Untitled Solution",
    description:
      toText(solution.SolutionContext).trim() ||
      "Explore this enterprise AI solution.",
    domainLabel:
      service?.label || industry?.title || solution.BusinessDomain || "Enterprise AI",
    client: resolveSolutionClient(solution),
    aiFoundation: resolveSolutionAiFoundation(solution),
    techHighlight: techStack[0]?.name || null,
    techText: techStack.map((entry) => entry.name).join(" "),
    serviceId: serviceId || null,
    orderNumber,
    themeIndex: Math.abs(iconSeed) % 8,
    recordedDemoLink: resolveRecordedDemoLink(solution) || null,
    salesDeskDoc: solution.SalesDeskDoc || null,
    detailUrl,
    capabilityForDemo: {
      id: solutionApiId,
      title: solution.Title || "Untitled Solution",
      description:
        truncateText(solution.SolutionContext, 200) ||
        "Explore this enterprise AI solution.",
      businessDomain: solution.BusinessDomain,
    },
  };
};

const parseEvangelists = (value, evangelistDirectory = []) => {
  const items = toText(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (items.length === 0) {
    return [];
  }

  return items
    .map((item, index) => {
      const name = parsePersonName(item);
      if (!name) return null;

      const match = evangelistDirectory.find((entry) => entry.Name === name);

      return {
        name,
        title: match?.Department || "AI Evangelist",
        color: getAvatarColor(index + 1),
        email: parseEmailFromValue(item) || match?.Email || "",
      };
    })
    .filter(Boolean);
};

const parseCoe = (ownershipDetails, solutionOwners = []) => {
  const details = toText(ownershipDetails);
  const name = parsePersonName(details);
  if (!name) {
    return {
      name: "Not assigned",
      title: "Center of Excellence",
      color: "teal",
      email: "",
    };
  }

  const owner = solutionOwners.find(
    (entry) =>
      details.includes(entry.Email) ||
      details.startsWith(entry.Name),
  );

  return {
    name,
    title: owner?.Title || owner?.Department || "Solution Owner",
    color: "teal",
    email: parseEmailFromValue(details) || owner?.Email || "",
  };
};

export const mapApiSolutionToCapability = (
  solution,
  { evangelistDirectory = [], solutionOwners = [] } = {},
) => {
  const evangelists = parseEvangelists(solution.AiEvangelists, evangelistDirectory);
  const techStack = parseTechStack(getTechStackSource(solution));
  const recordedDemoLink = resolveRecordedDemoLink(solution);

  return {
    id: `api-${solution.ID}`,
    isApiSolution: true,
    IsSolutionActive: solution.IsSolutionActive,
    title: solution.Title || "Untitled Solution",
    iconKey: "brain",
    description: solution.SolutionContext || "No description available.",
    techStack:
      techStack.length > 0
        ? techStack
        : [{ name: "Not specified", label: "Technology" }],
    coe: parseCoe(solution.OwnershipDetails, solutionOwners),
    evangelists:
      evangelists.length > 0
        ? evangelists
        : [
            {
              name: "Not assigned",
              title: "AI Evangelist",
              color: "sky",
              email: "",
            },
          ],
    recordedDemoLink,
    businessDomain: solution.BusinessDomain,
    client: resolveSolutionClient(solution),
    aiFoundation: resolveSolutionAiFoundation(solution),
    solutionDetailsDoc: solution.SolutionDetailsDoc || null,
    lowLevelDesignDoc: solution.LowLevelDesignDoc || null,
    architectureDiagram: solution.ArchitectureDiagram || null,
    salesDeskDoc: solution.SalesDeskDoc || null,
    otherDocuments: Array.isArray(solution.OtherDocuments)
      ? solution.OtherDocuments
      : [],
    documents: buildDocumentsFromApiSolution(solution),
  };
};

export const mapFormToCapability = (
  form,
  {
    solutionId,
    evangelistDirectory = [],
    solutionOwners = [],
  } = {},
) => {
  const evangelistNames = (form.AiEvangelists || []).filter(
    (name) => name !== PLACEHOLDER_EVANGELIST,
  );

  return mapApiSolutionToCapability(
    {
      ID: solutionId || `pending-${Date.now()}`,
      Title: form.Title,
      SolutionContext: form.SolutionContext,
      TechHighlights: form.TechHighlights,
      OwnershipDetails: form.OwnershipDetails,
      AiEvangelists: evangelistNames.join(", "),
      DemoLink: form.DemoLink,
      DemoRecordedVideoLink: "",
      BusinessDomain: form.BusinessDomain,
      AiFoundation: (form.AiFoundation || []).join(", "),
      Client: (form.AiFoundation || []).join(", "),
    },
    { evangelistDirectory, solutionOwners },
  );
};

export const serializeCapabilityForNavigation = (capability) => {
  if (!capability) return null;

  const { icon: _icon, ...serializable } = capability;
  return serializable;
};

export const enrichCapabilityContacts = (
  capability,
  { evangelistDirectory = [], solutionOwners = [] } = {},
) => {
  if (!capability) return capability;

  const coe = { ...capability.coe };
  if (!coe.email && coe.name && coe.name !== "Not assigned") {
    const owner = solutionOwners.find((entry) => entry.Name === coe.name);
    if (owner?.Email) {
      coe.email = owner.Email;
    }
  }

  const evangelists = (capability.evangelists || []).map((person) => {
    if (person.email || person.name === "Not assigned") {
      return person;
    }

    const match = evangelistDirectory.find((entry) => entry.Name === person.name);
    return {
      ...person,
      email: match?.Email || "",
    };
  });

  return {
    ...capability,
    coe,
    evangelists,
  };
};

export const getRequestDemoRecipientEmails = (capability) => {
  if (!capability) return [];

  const emails = [];

  const coeEmail = capability.coe?.email?.trim();
  if (coeEmail) {
    emails.push(coeEmail);
  }

  (capability.evangelists || []).forEach((person) => {
    const email = person.email?.trim();
    if (email && person.name !== "Not assigned") {
      emails.push(email);
    }
  });

  return [...new Set(emails)];
};

export const getRequestDemoRecipientNames = (capability) => {
  if (!capability) return [];

  const names = [];

  if (capability.coe?.name && capability.coe.name !== "Not assigned") {
    names.push(capability.coe.name);
  }

  (capability.evangelists || []).forEach((person) => {
    if (person.name && person.name !== "Not assigned") {
      names.push(person.name);
    }
  });

  return [...new Set(names)];
};

export const buildRequestDemoMailto = (capability, form = {}) => {
  const name = (form.name || "").trim();
  const email = (form.email || "").trim();
  const company = (form.company || "").trim();
  const phone = (form.phone || "").trim();
  const message = (form.message || "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }

  const cardRecipients = getRequestDemoRecipientEmails(capability);
  const uniqueRecipients = [email];

  const subject = encodeURIComponent(`Demo Request: ${capability.title}`);
  const bodyLines = [
    "Hello,",
    "",
    `I would like to request a demo for "${capability.title}".`,
    "",
    "Contact Details:",
    `Name: ${name}`,
    `Email: ${email}`,
  ];

  if (company) bodyLines.push(`Company: ${company}`);
  if (phone) bodyLines.push(`Phone: ${phone}`);
  if (message) {
    bodyLines.push("");
    bodyLines.push("Message:");
    bodyLines.push(message);
  }

  if (cardRecipients.length > 0) {
    bodyLines.push("");
    bodyLines.push("Solution Contacts:");
    if (capability.coe?.name && capability.coe.name !== "Not assigned") {
      bodyLines.push(`COE: ${capability.coe.name}`);
    }
    (capability.evangelists || []).forEach((person) => {
      if (person.name !== "Not assigned") {
        bodyLines.push(`AI Evangelist: ${person.name}`);
      }
    });
  }

  bodyLines.push("");
  bodyLines.push("Thank you.");

  const body = encodeURIComponent(bodyLines.join("\n"));

  return `mailto:${uniqueRecipients.join(",")}?subject=${subject}&body=${body}`;
};

export const extractSolutionIdFromCapabilityId = (capabilityId = "") => {
  if (!capabilityId || capabilityId.includes("pending")) {
    return null;
  }

  const match = capabilityId.match(/^api-(\d+)$/);
  return match ? match[1] : null;
};

export const shouldDeleteCapabilityFromApi = (capability, apiCapabilities = []) => {
  const solutionId = extractSolutionIdFromCapabilityId(capability?.id);
  if (!solutionId) return false;

  return apiCapabilities.some((item) => item.id === capability.id);
};

const SUBMITTED_SOLUTIONS_STORAGE_KEY = "aiVerseSubmittedSolutions";
const DELETED_SOLUTIONS_STORAGE_KEY = "aiVerseDeletedSolutionIds";
const LEGACY_SESSION_STORAGE_KEY = SUBMITTED_SOLUTIONS_STORAGE_KEY;

export const getDeletedSolutionIds = () => {
  try {
    const raw = localStorage.getItem(DELETED_SOLUTIONS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

export const markSolutionAsDeleted = (solutionId) => {
  if (solutionId == null || solutionId === "") return;

  const id = String(solutionId);
  const deletedIds = new Set(getDeletedSolutionIds());
  deletedIds.add(id);
  localStorage.setItem(
    DELETED_SOLUTIONS_STORAGE_KEY,
    JSON.stringify([...deletedIds]),
  );
};

export const filterOutDeletedSolutions = (solutions = []) => {
  const deletedIds = new Set(getDeletedSolutionIds());
  if (deletedIds.size === 0) return solutions;

  return solutions.filter((solution) => !deletedIds.has(String(solution.ID)));
};

const dedupeCapabilitiesById = (capabilities = []) => {
  const byId = new Map();

  capabilities.forEach((capability) => {
    if (capability?.id && !byId.has(capability.id)) {
      byId.set(capability.id, capability);
    }
  });

  return [...byId.values()];
};

const savePersistedSubmittedCapabilities = (capabilities) => {
  localStorage.setItem(
    SUBMITTED_SOLUTIONS_STORAGE_KEY,
    JSON.stringify(dedupeCapabilitiesById(capabilities)),
  );
};

const readPersistedSubmittedCapabilities = () => {
  try {
    const raw = localStorage.getItem(SUBMITTED_SOLUTIONS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const migrateLegacySessionStorage = () => {
  try {
    const legacyRaw = sessionStorage.getItem(LEGACY_SESSION_STORAGE_KEY);
    if (!legacyRaw) return;

    const legacyParsed = JSON.parse(legacyRaw);
    const legacyItems = Array.isArray(legacyParsed) ? legacyParsed : [];
    if (legacyItems.length === 0) {
      sessionStorage.removeItem(LEGACY_SESSION_STORAGE_KEY);
      return;
    }

    const existing = readPersistedSubmittedCapabilities();
    savePersistedSubmittedCapabilities([...legacyItems, ...existing]);
    sessionStorage.removeItem(LEGACY_SESSION_STORAGE_KEY);
  } catch {
    sessionStorage.removeItem(LEGACY_SESSION_STORAGE_KEY);
  }
};

const getPersistedSubmittedCapabilities = () => {
  migrateLegacySessionStorage();
  return readPersistedSubmittedCapabilities();
};

export const persistSubmittedCapability = (capability) => {
  if (!capability) return;

  const serialized =
    typeof capability?.icon === "function"
      ? serializeCapabilityForNavigation(capability)
      : capability;

  if (!serialized?.id) return;

  const existing = getPersistedSubmittedCapabilities();
  const next = [serialized, ...existing.filter((item) => item.id !== serialized.id)];

  savePersistedSubmittedCapabilities(next);
};

export const removePersistedSubmittedCapability = (capabilityId) => {
  if (!capabilityId) return;

  const existing = getPersistedSubmittedCapabilities();
  const next = existing.filter((item) => item.id !== capabilityId);
  savePersistedSubmittedCapabilities(next);
};

const normalizeCapabilityTitle = (value) =>
  String(value || "").trim().toLowerCase();

/** Optimistic cards are stored with temporary ids, so title is the only reliable key. */
export const removePersistedSubmittedCapabilitiesByTitle = (title) => {
  const key = normalizeCapabilityTitle(title);
  if (!key) return;

  const existing = getPersistedSubmittedCapabilities();
  const next = existing.filter(
    (item) => normalizeCapabilityTitle(item?.title) !== key,
  );
  savePersistedSubmittedCapabilities(next);
};

export const loadPersistedSubmittedCapabilities = getPersistedSubmittedCapabilities;

export const prunePersistedCapabilitiesSyncedWithApi = (apiCapabilities = []) => {
  const persisted = getPersistedSubmittedCapabilities();
  if (persisted.length === 0) return;

  const apiIds = new Set(apiCapabilities.map((capability) => capability.id));
  const apiTitles = new Set(
    apiCapabilities.map((capability) => normalizeCapabilityTitle(capability.title)),
  );

  const remaining = persisted.filter(
    (capability) =>
      !apiIds.has(capability.id) &&
      !apiTitles.has(normalizeCapabilityTitle(capability.title)),
  );

  savePersistedSubmittedCapabilities(remaining);
};

export const mergeSubmittedCapabilities = ({
  apiCapabilities,
  pendingCapabilities = [],
  activeServiceId,
  activeDomainCode = null,
}) => {
  const matchesFilter = (capability) =>
    solutionMatchesExploreFilter({
      businessDomain: capability.businessDomain,
      activeServiceId,
      activeDomainCode,
    });

  const fromApi = apiCapabilities.filter(
    (capability) => matchesFilter(capability) && isPublicSolutionVisible(capability),
  );

  const apiIds = new Set(fromApi.map((capability) => capability.id));
  const apiTitles = new Set(
    apiCapabilities.map((capability) => normalizeCapabilityTitle(capability.title)),
  );

  const fromPending = pendingCapabilities.filter((capability) => {
    if (isSolutionMarkedInactive(capability)) {
      return false;
    }

    if (!matchesFilter(capability)) {
      return false;
    }

    if (apiTitles.has(normalizeCapabilityTitle(capability.title))) {
      return false;
    }

    return capability.id && !apiIds.has(capability.id);
  });

  return dedupeCapabilitiesById([...fromApi, ...fromPending]).filter(
    isPublicSolutionVisible,
  );
};
