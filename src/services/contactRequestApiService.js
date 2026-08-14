import { buildApiPath, getApiBaseUrl } from "./apiConfig";
import { formatLeadTypeLabel } from "../utils/contactRequestStorage";

const EMAIL_API_KEY = import.meta.env.VITE_EMAIL_API_KEY || "";

const AVATAR_COLORS = [
  "#3A8D9D",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#16a34a",
  "#2563eb",
  "#0d9488",
  "#9333ea",
  "#e11d48",
  "#0891b2",
];

const parseJsonResponse = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const withApiKey = (endpoint) =>
  buildApiPath(endpoint, EMAIL_API_KEY ? { code: EMAIL_API_KEY } : {});

export const isContactRequestsApiConfigured = () => Boolean(getApiBaseUrl().trim());

export const mapApiLeadToRequest = (lead = {}) => {
  const id = lead.id ?? lead.ID;
  const submittedAt = lead.submittedAt || lead.CreatedDate || new Date().toISOString();
  const subject = lead.reason || lead.Subject || "Contact Us";
  let reason = subject;
  if (String(subject).startsWith("Contact Inquiry: ")) {
    reason = String(subject).replace("Contact Inquiry: ", "").trim() || "Contact Us";
  } else if (String(subject).toLowerCase().startsWith("schedule a call")) {
    reason = "Schedule a Call";
  } else if (String(subject).toLowerCase().startsWith("register")) {
    reason = "Register";
  } else if (String(subject).toLowerCase().startsWith("request demo")) {
    const afterColon = String(subject).includes(":")
      ? String(subject).split(":").slice(1).join(":").trim()
      : "";
    reason = afterColon || "Request Demo";
  }

  const message = lead.message || lead.Message || "—";
  let preferredCallbackTime = lead.preferredCallbackTime || "";
  let solutionTitle = lead.solutionTitle || "";
  if (!preferredCallbackTime && typeof message === "string") {
    const dateLine = message
      .split("\n")
      .find((line) => line.toLowerCase().startsWith("preferred date:"));
    const timeLine = message
      .split("\n")
      .find((line) => line.toLowerCase().startsWith("preferred time:"));
    const datePart = dateLine ? dateLine.split(":").slice(1).join(":").trim() : "";
    const timePart = timeLine ? timeLine.split(":").slice(1).join(":").trim() : "";
    preferredCallbackTime = [datePart, timePart].filter(Boolean).join(" ");
  }
  if (!solutionTitle && typeof message === "string") {
    const solutionLine = message
      .split("\n")
      .find((line) => line.toLowerCase().startsWith("solution:"));
    if (solutionLine) {
      solutionTitle = solutionLine.split(":").slice(1).join(":").trim();
    }
  }
  if (!solutionTitle && String(subject).toLowerCase().startsWith("request demo:")) {
    solutionTitle = String(subject).split(":").slice(1).join(":").trim();
  }

  let type = lead.type || lead.LeadType || "Mail";
  if (reason === "Schedule a Call" && ["Mail", "Message", "Contact Request"].includes(type)) {
    type = "Callback Schedule";
  }
  if (reason === "Register" && ["Mail", "Message", "Contact Request"].includes(type)) {
    type = "Register";
  }
  if (
    (solutionTitle || String(subject).toLowerCase().startsWith("request demo")) &&
    ["Mail", "Message", "Contact Request"].includes(type)
  ) {
    type = "Demo Request";
  }
  if (String(type).toLowerCase().includes("demo")) {
    type = "Demo Request";
  }
  type = formatLeadTypeLabel(type);

  let source = lead.source || "Contact Us";
  if (reason === "Schedule a Call") source = lead.source || "Schedule a Call";
  if (reason === "Register") source = lead.source || "Register";
  if (type === "Demo Request") source = lead.source || "Request Demo";

  return {
    id,
    name: lead.name || lead.FullName || "Unknown",
    company: lead.company || lead.Company || "—",
    email: lead.email || lead.Email || "—",
    phone: lead.phone || lead.Phone || "—",
    country: lead.country || "—",
    industry: lead.industry || "—",
    jobTitle: lead.jobTitle || "",
    companySize: lead.companySize || "",
    source,
    message,
    reason,
    solutionTitle,
    preferredCallbackTime,
    type,
    stage: lead.stage || lead.Stage || "Contacted",
    priority: lead.priority || lead.Priority || "Medium",
    status: lead.status || lead.Status || "Open",
    assignedTo: lead.assignedTo || lead.AssignedTo || "Unassigned",
    submittedAt,
    avatarColor: AVATAR_COLORS[Number(String(id).replace(/\D/g, "") || 0) % AVATAR_COLORS.length],
    activities: Array.isArray(lead.activities)
      ? lead.activities
      : [{ id: "a1", label: "Request Received", at: submittedAt }],
    requestKey: `api-${id}`,
    isApi: true,
    isStored: false,
  };
};

export const getContactRequestsFromApi = async () => {
  if (!isContactRequestsApiConfigured()) {
    throw new Error("Contact requests API is not configured.");
  }

  const response = await fetch(withApiKey("get-contact-requests"));
  const result = await parseJsonResponse(response);

  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Failed to load contact requests.");
  }

  return (result.data || []).map(mapApiLeadToRequest);
};

export const updateContactRequestStageOnApi = async ({ id, stage }) => {
  if (!isContactRequestsApiConfigured()) {
    throw new Error("Contact requests API is not configured.");
  }

  const response = await fetch(withApiKey("update-contact-request-stage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, stage }),
  });
  const result = await parseJsonResponse(response);

  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Failed to update lead stage.");
  }

  return result.data;
};
