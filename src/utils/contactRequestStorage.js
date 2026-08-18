// Shared localStorage utility for contact form submissions.
// The public Contact form writes here; the admin Leads page reads.

const STORAGE_KEY = "aiverse_contact_requests";

export const LEAD_TYPES = {
  MAIL_CONTACT: "Mail",
  MESSAGE: "Contact Request",
  REQUEST_DEMO: "Demo Request",
  CALLBACK_SCHEDULE: "Callback Schedule",
  REGISTER: "Register",
};

/** Display labels for Leads cards. */
export const formatLeadTypeLabel = (type = "") => {
  const value = String(type || "").trim().toLowerCase();

  if (!value) return LEAD_TYPES.MAIL_CONTACT;

  if (value.includes("register") || value.includes("registration")) {
    return LEAD_TYPES.REGISTER;
  }

  if (
    value.includes("callback") ||
    value.includes("call back") ||
    value === "schedule" ||
    value.includes("schedule a call")
  ) {
    return LEAD_TYPES.CALLBACK_SCHEDULE;
  }

  if (
    value.includes("demo") ||
    value.includes("request demo") ||
    value === "solution demo"
  ) {
    return LEAD_TYPES.REQUEST_DEMO;
  }

  if (
    value === "message" ||
    value.includes("message form") ||
    value.includes("contact request")
  ) {
    return LEAD_TYPES.MESSAGE;
  }

  if (
    value.includes("mail") ||
    value.includes("contact us") ||
    value === "contact"
  ) {
    return LEAD_TYPES.MAIL_CONTACT;
  }

  return String(type).trim() || LEAD_TYPES.MAIL_CONTACT;
};

const getAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveAll = (requests) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  window.dispatchEvent(new CustomEvent("aiverse:contact-requests-updated"));
};

const AVATAR_COLORS = [
  "#3A8D9D", "#7c3aed", "#db2777", "#ea580c", "#16a34a",
  "#2563eb", "#0d9488", "#9333ea", "#e11d48", "#0891b2",
];

const nextId = (requests) =>
  requests.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0) + 1;

const normalizeStage = (stage) => (stage === "New" ? "Contacted" : stage || "Contacted");

const normalizeLeadType = (type) => {
  const value = String(type || "").trim();
  const lower = value.toLowerCase();

  if (
    value === LEAD_TYPES.MAIL_CONTACT ||
    value === "Mail" ||
    value === "Mail Contact Form" ||
    value === "Contact Us" ||
    value === "Contact Request" ||
    lower === "mail"
  ) {
    return LEAD_TYPES.MAIL_CONTACT;
  }

  if (
    value === LEAD_TYPES.MESSAGE ||
    value === "Message" ||
    value === "Message Form" ||
    value === "Contact Request" ||
    lower === "message"
  ) {
    return LEAD_TYPES.MESSAGE;
  }

  if (
    value === LEAD_TYPES.REQUEST_DEMO ||
    value === "Request Demo" ||
    value === "Demo" ||
    value === "Demo Request" ||
    value === "Solution Demo" ||
    lower.includes("request demo") ||
    lower.includes("demo")
  ) {
    return LEAD_TYPES.REQUEST_DEMO;
  }

  if (
    value === LEAD_TYPES.CALLBACK_SCHEDULE ||
    value === "Schedule" ||
    value === "Callback Shedule" ||
    value === "Callback Schedule" ||
    lower.includes("callback") ||
    lower.includes("call back") ||
    lower === "schedule"
  ) {
    return LEAD_TYPES.CALLBACK_SCHEDULE;
  }

  if (
    value === LEAD_TYPES.REGISTER ||
    lower === "register" ||
    lower.includes("registration")
  ) {
    return LEAD_TYPES.REGISTER;
  }

  return formatLeadTypeLabel(value);
};

export const addContactRequest = ({
  name,
  email,
  company,
  phone,
  country,
  industry,
  jobTitle,
  companySize,
  reason,
  message,
  type,
  solutionTitle,
  preferredCallbackTime,
  source,
}) => {
  const requests = getAll();
  const id = nextId(requests);
  const leadType = normalizeLeadType(type);
  const title = String(solutionTitle || "").trim();
  const preferTime = String(preferredCallbackTime || "").trim();

  const entry = {
    id,
    name: name || "Unknown",
    company: company || "—",
    email: email || "—",
    phone: phone || "—",
    country: country || "—",
    industry: industry || "—",
    jobTitle: String(jobTitle || "").trim(),
    companySize: String(companySize || "").trim(),
    source: String(source || "").trim(),
    message: message || "—",
    reason: reason || title || "General Inquiry",
    solutionTitle: title || "",
    preferredCallbackTime: preferTime,
    type: leadType,
    stage: "Contacted",
    priority: "Medium",
    status: "Open",
    assignedTo: "Unassigned",
    submittedAt: new Date().toISOString(),
    avatarColor: AVATAR_COLORS[id % AVATAR_COLORS.length],
    activities: [
      { id: "a1", label: "Request Received", at: new Date().toISOString() },
    ],
  };

  requests.unshift(entry);
  saveAll(requests);
  return entry;
};

export const getContactRequests = () =>
  getAll().map((request) => ({
    ...request,
    stage: normalizeStage(request.stage),
    type: normalizeLeadType(request.type || request.reason),
  }));

export const updateStoredContactRequestStage = (id, stage) => {
  const requests = getAll();
  const index = requests.findIndex((r) => String(r.id) === String(id));
  if (index === -1) return null;

  const now = new Date().toISOString();
  const updated = {
    ...requests[index],
    stage: normalizeStage(stage),
    activities: [
      ...(requests[index].activities || []),
      {
        id: `a-${Date.now()}`,
        label: `Stage changed to ${normalizeStage(stage)}`,
        at: now,
      },
    ],
  };

  requests[index] = updated;
  saveAll(requests);
  return {
    ...updated,
    type: normalizeLeadType(updated.type || updated.reason),
  };
};

export const deleteContactRequest = (id) => {
  const requests = getAll();
  const next = requests.filter((request) => String(request.id) !== String(id));
  if (next.length === requests.length) return false;
  saveAll(next);
  return true;
};

const DELETED_DEMO_KEY = "aiverse_deleted_demo_leads";

export const getDeletedDemoLeadKeys = () => {
  try {
    const raw = localStorage.getItem(DELETED_DEMO_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

export const markDemoLeadDeleted = (requestKey) => {
  const key = String(requestKey || "");
  if (!key.startsWith("demo-")) return;
  const existing = getDeletedDemoLeadKeys();
  if (existing.includes(key)) return;
  localStorage.setItem(DELETED_DEMO_KEY, JSON.stringify([...existing, key]));
};

export const clearContactRequests = () => {
  localStorage.removeItem(STORAGE_KEY);
};
