import {
  BrainIcon,
  GlobeIcon,
  RefreshIcon,
  ZapIcon,
  ShieldIcon,
  ChartIcon,
} from "../components/CustomerCommunicationManagement/CapabilityIcons";
import { enterpriseServicesData } from "../components/CustomerCommunicationManagement/enterpriseServicesData";

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

const domainCodeToServiceId = {
  CustomerCommunicationManagement: "customer-communication-management",
  CustomerExperienceCRM: "customer-experience-crm",
  CustomerExperience: "customer-experience-crm",
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

  const serviceByLabel = enterpriseServicesData.find(
    (service) => normalizeKey(service.label) === normalizeKey(domainCode),
  );
  if (serviceByLabel) {
    return serviceByLabel.id;
  }

  return null;
};

const getAvatarColor = (index) => AVATAR_COLORS[index % AVATAR_COLORS.length];

const parsePersonName = (value = "") => {
  const trimmed = value.trim();
  if (!trimmed || trimmed === PLACEHOLDER_EVANGELIST) {
    return null;
  }

  const withoutEmail = trimmed.replace(/\s*\([^)]*\)\s*$/, "").trim();
  return withoutEmail || trimmed;
};

const parseEmailFromValue = (value = "") => {
  const match = value.match(/\(([^)]+@[^)]+)\)/);
  return match ? match[1].trim() : "";
};

const resolveRecordedDemoLink = (solution = {}) => {
  const recordedVideoLink = (solution.DemoRecordedVideoLink || "").trim();
  const demoLink = (solution.DemoLink || "").trim();
  return recordedVideoLink || demoLink;
};

const parseTechStack = (techHighlights = "") =>
  techHighlights
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((name) => ({ name, label: "Technology" }));

const parseEvangelists = (value = "", evangelistDirectory = []) => {
  const items = value
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

const parseCoe = (ownershipDetails = "", solutionOwners = []) => {
  const name = parsePersonName(ownershipDetails);
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
      ownershipDetails.includes(entry.Email) ||
      ownershipDetails.startsWith(entry.Name),
  );

  return {
    name,
    title: owner?.Title || owner?.Department || "Solution Owner",
    color: "teal",
    email: parseEmailFromValue(ownershipDetails) || owner?.Email || "",
  };
};

export const mapApiSolutionToCapability = (
  solution,
  { evangelistDirectory = [], solutionOwners = [] } = {},
) => {
  const evangelists = parseEvangelists(solution.AiEvangelists, evangelistDirectory);
  const techStack = parseTechStack(solution.TechHighlights);
  const recordedDemoLink = resolveRecordedDemoLink(solution);

  return {
    id: `api-${solution.ID}`,
    isApiSolution: true,
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
    client: solution.Client || solution.Clients || "",
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
      Client: form.Client,
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
const LEGACY_SESSION_STORAGE_KEY = SUBMITTED_SOLUTIONS_STORAGE_KEY;

const dedupeCapabilities = (capabilities = []) => {
  const seenIds = new Set();
  const seenTitles = new Set();

  return capabilities.filter((capability) => {
    const id = capability?.id;
    const title = capability?.title?.trim().toLowerCase();

    if (id && seenIds.has(id)) return false;
    if (title && seenTitles.has(title)) return false;

    if (id) seenIds.add(id);
    if (title) seenTitles.add(title);
    return true;
  });
};

const savePersistedSubmittedCapabilities = (capabilities) => {
  localStorage.setItem(
    SUBMITTED_SOLUTIONS_STORAGE_KEY,
    JSON.stringify(dedupeCapabilities(capabilities)),
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
  const next = [
    serialized,
    ...existing.filter(
      (item) =>
        item.id !== serialized.id &&
        item.title.trim().toLowerCase() !== serialized.title.trim().toLowerCase(),
    ),
  ];

  savePersistedSubmittedCapabilities(next);
};

export const removePersistedSubmittedCapability = (capabilityId) => {
  if (!capabilityId) return;

  const existing = getPersistedSubmittedCapabilities();
  const next = existing.filter((item) => item.id !== capabilityId);
  savePersistedSubmittedCapabilities(next);
};

export const loadPersistedSubmittedCapabilities = getPersistedSubmittedCapabilities;

export const prunePersistedCapabilitiesSyncedWithApi = (apiCapabilities = []) => {
  const persisted = getPersistedSubmittedCapabilities();
  if (persisted.length === 0) return;

  const apiIds = new Set(apiCapabilities.map((capability) => capability.id));

  const remaining = persisted.filter((capability) => !apiIds.has(capability.id));

  savePersistedSubmittedCapabilities(remaining);
};

export const mergeSubmittedCapabilities = ({
  apiCapabilities,
  pendingCapabilities = [],
  activeServiceId,
}) => {
  const fromApi = apiCapabilities.filter(
    (capability) => getServiceIdForDomain(capability.businessDomain) === activeServiceId,
  );

  const apiIds = new Set(fromApi.map((capability) => capability.id));
  const apiTitles = new Set(
    fromApi.map((capability) => capability.title.trim().toLowerCase()),
  );

  const fromPending = pendingCapabilities.filter((capability) => {
    if (getServiceIdForDomain(capability.businessDomain) !== activeServiceId) {
      return false;
    }

    if (apiIds.has(capability.id)) {
      return false;
    }

    return !apiTitles.has(capability.title.trim().toLowerCase());
  });

  return [...fromPending, ...fromApi];
};
