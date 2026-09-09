import { buildApiPath, getApiBaseUrl } from "./apiConfig";
import { formatFollowUpDateTime } from "../components/ContactRequest/followUpUtils";

const EMAIL_API_KEY = import.meta.env.VITE_EMAIL_API_KEY || "";

const SCHEDULE_FOLLOW_UP_ENDPOINT =
  import.meta.env.VITE_SCHEDULE_FOLLOW_UP_ENDPOINT || "schedule-follow-up";

const GET_FOLLOW_UPS_ENDPOINT =
  import.meta.env.VITE_GET_FOLLOW_UPS_ENDPOINT || "get-follow-ups";

export const FOLLOW_UP_API_SETUP_MESSAGE =
  "Follow-up API is not configured. Set VITE_API_BASE_URL and restart the dev server.";

export const isFollowUpApiConfigured = () => Boolean(getApiBaseUrl().trim());

const withApiKey = (endpoint, query = {}) =>
  buildApiPath(endpoint, {
    ...query,
    ...(EMAIL_API_KEY ? { code: EMAIL_API_KEY } : {}),
  });

const parseJsonResponse = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const assertSuccessResponse = (response, result, fallbackMessage) => {
  if (!response.ok || (result.status && result.status !== "success")) {
    throw new Error(
      result.message || fallbackMessage || `Server returned ${response.status}.`,
    );
  }
};

export const buildScheduledAtIso = (date, time) => {
  if (!date || !time) return "";
  const parsed = new Date(`${date}T${time}`);
  if (Number.isNaN(parsed.getTime())) {
    return `${date}T${time}`;
  }
  return parsed.toISOString();
};

const mapApiFollowUp = (item = {}, fallbackLeadKey = "") => {
  const date = item.date || item.Date || "";
  const time = item.time || item.Time || "";
  const status = item.status || item.Status || "Scheduled";

  return {
    id: String(item.id || item.ID || `fu-${Date.now()}`),
    requestKey: item.requestKey || item.LeadKey || fallbackLeadKey,
    type: item.type || item.Type || "Call",
    customLabel: item.customLabel || item.Label || item.label || "",
    date,
    time,
    scheduledAt: item.scheduledAt || item.ScheduledAt || "",
    assignedTo: item.assignedTo || item.AssignedTo || "",
    assignedToEmail: item.assignedToEmail || item.AssignedToEmail || "",
    notes: item.notes || item.Notes || "",
    reminder: Boolean(
      item.reminder ?? item.Reminder ?? item.sendReminder ?? false,
    ),
    status,
    createdAt: item.createdAt || item.CreatedAt || "",
  };
};

export const createFollowUpApi = async (lead, payload = {}) => {
  if (!isFollowUpApiConfigured()) {
    throw new Error(FOLLOW_UP_API_SETUP_MESSAGE);
  }

  if (!lead?.email?.trim()) {
    throw new Error("Lead email is required to schedule a reminder.");
  }

  if (payload.reminder && !payload.assignedToEmail?.trim()) {
    throw new Error(
      "Assignee email is required when reminder notification is enabled.",
    );
  }

  const scheduledAt = buildScheduledAtIso(payload.date, payload.time);
  const body = {
    LeadId: lead.id,
    LeadKey: lead.requestKey,
    LeadName: lead.name || "",
    LeadEmail: lead.email || "",
    LeadCompany: lead.company || "",
    Type: payload.type,
    Label: payload.customLabel || "",
    Date: payload.date,
    Time: payload.time,
    ScheduledAt: scheduledAt,
    AssignedTo: payload.assignedTo || "",
    AssignedToEmail: payload.assignedToEmail || "",
    Notes: payload.notes || "",
    Reminder: Boolean(payload.reminder),
    PipelineStage: lead.stage || "",
  };

  const response = await fetch(withApiKey(SCHEDULE_FOLLOW_UP_ENDPOINT), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await parseJsonResponse(response);
  assertSuccessResponse(
    response,
    result,
    `Failed to schedule follow-up. Server returned ${response.status}.`,
  );

  const data = result.data || result.followUp || result;
  return mapApiFollowUp(
    {
      ...payload,
      ...data,
      status: data.status || data.Status || "Scheduled",
      scheduledAt: data.scheduledAt || data.ScheduledAt || scheduledAt,
    },
    lead.requestKey,
  );
};

export const fetchFollowUpsApi = async (leadKey) => {
  if (!leadKey) return [];

  if (!isFollowUpApiConfigured()) {
    throw new Error(FOLLOW_UP_API_SETUP_MESSAGE);
  }

  const response = await fetch(
    withApiKey(GET_FOLLOW_UPS_ENDPOINT, { leadKey }),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const result = await parseJsonResponse(response);
  assertSuccessResponse(
    response,
    result,
    `Failed to load follow-ups. Server returned ${response.status}.`,
  );

  const list = Array.isArray(result.data)
    ? result.data
    : Array.isArray(result.followUps)
      ? result.followUps
      : Array.isArray(result)
        ? result
        : [];

  return list.map((item) => mapApiFollowUp(item, leadKey));
};

export const buildFollowUpScheduleToast = (saved) => {
  const when = formatFollowUpDateTime(saved.date, saved.time);
  if (saved.reminder) {
    return `Follow-up scheduled. Confirmation emailed; reminder will send at ${when}.`;
  }
  return "Follow-up scheduled successfully.";
};
