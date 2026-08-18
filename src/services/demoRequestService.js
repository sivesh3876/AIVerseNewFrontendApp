import { fetchAllUseCases } from "./usecasesService";
import { buildApiPath } from "./apiConfig";
import {
  loadLastDemoSubmission,
  loadStoredDemoRequests,
  normalizeDemoRequest,
} from "../utils/demoRequestStorage";
import { mapApiSolutionToCapability } from "../utils/solutionMapper";
import { mergeEngagementIntoDemoRequest } from "../utils/solutionEngagementStorage";

const EMAIL_API_KEY = import.meta.env.VITE_EMAIL_API_KEY || "";

const normalizeApiDemoRequest = (item = {}) =>
  normalizeDemoRequest({
    id: String(item.ID ?? item.id ?? item.request_id ?? `api-${Date.now()}`),
    solutionId: item.SolutionId ?? item.solution_id ?? null,
    solutionTitle: item.SolutionTitle ?? item.solution_title ?? "",
    fullName: item.FullName ?? item.full_name ?? item.name ?? "",
    email: item.Email ?? item.email ?? "",
    company: item.Company ?? item.company ?? "",
    phone: item.Phone ?? item.phone ?? "",
    message: item.Message ?? item.message ?? "",
    submittedAt:
      item.SubmittedAt ??
      item.submitted_at ??
      item.CreatedDate ??
      item.created_at ??
      new Date().toISOString(),
    notifiedTo: item.notified_to ?? item.NotifiedTo ?? [],
    notifiedCc: item.notified_cc ?? item.NotifiedCc ?? [],
    emailSent: item.email_sent ?? item.EmailSent ?? true,
    statusMessage: item.status_message ?? item.message_status ?? "",
    coeName: item.coe_name ?? item.CoeName ?? "",
    evangelistNames: item.evangelist_names ?? item.EvangelistNames ?? [],
    status: item.status ?? item.Status ?? "",
    recordStatus: item.record_status ?? item.RecordStatus ?? "Active",
    demoScheduledBy: item.demo_scheduled_by ?? item.DemoScheduledBy ?? "",
    demoScheduledAt: item.demo_scheduled_at ?? item.DemoScheduledAt ?? "",
    demoGivenBy: item.demo_given_by ?? item.DemoGivenBy ?? "",
    demoGivenAt: item.demo_given_at ?? item.DemoGivenAt ?? "",
    feedbackRating: item.feedback_rating ?? item.FeedbackRating ?? 0,
    feedbackMessage: item.feedback_message ?? item.FeedbackMessage ?? "",
    feedbackSentiment: item.feedback_sentiment ?? item.FeedbackSentiment ?? "",
    viewCount: item.view_count ?? item.ViewCount ?? 0,
    source: "api",
  });

const DEMO_REQUESTS_ENDPOINTS = [
  import.meta.env.VITE_GET_DEMO_REQUESTS_ENDPOINT || "get-demo-requests",
  "get-all-demo-requests",
  "list-demo-requests",
].filter(Boolean);

const parseDemoRequestsPayload = (result = {}) => {
  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result.data)) {
    return result.data;
  }

  if (Array.isArray(result.requests)) {
    return result.requests;
  }

  return [];
};

const fetchDemoRequestsFromEndpoint = async (endpoint) => {
  const response = await fetch(
    buildApiPath(endpoint, EMAIL_API_KEY ? { code: EMAIL_API_KEY } : {}),
  );

  if (!response.ok) {
    return { ok: false, rows: [] };
  }

  let result = {};
  try {
    result = await response.json();
  } catch {
    return { ok: false, rows: [] };
  }

  if (result.status && result.status !== "success") {
    return { ok: false, rows: [] };
  }

  const rows = parseDemoRequestsPayload(result).map(normalizeApiDemoRequest);
  return { ok: true, rows };
};

const fetchDemoRequestsFromApi = async () => {
  for (const endpoint of DEMO_REQUESTS_ENDPOINTS) {
    try {
      const result = await fetchDemoRequestsFromEndpoint(endpoint);
      // Prefer first endpoint that responds successfully (even if empty).
      if (result.ok) {
        return result.rows;
      }
    } catch {
      // Try the next endpoint candidate.
    }
  }

  return [];
};

const mergeDemoRequests = (apiRequests = [], localRequests = []) => {
  const localById = new Map(localRequests.map((item) => [item.id, item]));
  const mergedIds = new Set();

  const merged = apiRequests.map((apiRequest) => {
    const local = localById.get(apiRequest.id);
    mergedIds.add(apiRequest.id);
    return normalizeDemoRequest({
      ...apiRequest,
      ...local,
      solutionTitle: local?.solutionTitle || apiRequest.solutionTitle,
      fullName: local?.fullName || apiRequest.fullName,
      email: local?.email || apiRequest.email,
      company: local?.company || apiRequest.company,
      phone: local?.phone || apiRequest.phone,
      message: local?.message || apiRequest.message,
      submittedAt: local?.submittedAt || apiRequest.submittedAt,
    });
  });

  localRequests.forEach((localRequest) => {
    if (!mergedIds.has(localRequest.id)) {
      merged.push(localRequest);
    }
  });

  return merged.sort(
    (left, right) =>
      new Date(right.submittedAt || 0).getTime() -
      new Date(left.submittedAt || 0).getTime(),
  );
};

const enrichWithSolutionMeta = (requests, solutions = []) => {
  const solutionById = new Map(
    solutions.map((solution) => [Number(solution.ID), solution]),
  );

  return requests.map((request) => {
    const solution = request.solutionId
      ? solutionById.get(Number(request.solutionId))
      : null;

    if (!solution) {
      return request;
    }

    const capability = mapApiSolutionToCapability(solution);
    const evangelistNames = (capability.evangelists || [])
      .map((person) => person.name)
      .filter((name) => name && name !== "Not assigned");

    return normalizeDemoRequest({
      ...request,
      solutionTitle: request.solutionTitle || solution.Title || "",
      coeName: request.coeName || capability.coe?.name || "",
      evangelistNames:
        request.evangelistNames?.length > 0
          ? request.evangelistNames
          : evangelistNames,
    });
  });
};

export const fetchAdminDemoRequests = async () => {
  const localRequests = loadStoredDemoRequests().map((item) => ({
    ...item,
    source: item.source || "local",
  }));

  const lastSubmission = loadLastDemoSubmission();
  const withBackup =
    lastSubmission &&
    !localRequests.some((item) => item.id === lastSubmission.id)
      ? [lastSubmission, ...localRequests]
      : localRequests;

  let merged = withBackup;

  try {
    const apiRequests = await fetchDemoRequestsFromApi();
    merged = mergeDemoRequests(apiRequests, withBackup);
  } catch {
    merged = withBackup;
  }

  try {
    const solutions = await fetchAllUseCases();
    const enriched = enrichWithSolutionMeta(merged, solutions);
    return enriched.map(mergeEngagementIntoDemoRequest);
  } catch {
    return merged.map(mergeEngagementIntoDemoRequest);
  }
};

export const formatDemoRequestDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRequestDateOnly = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatRequestTimeOnly = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
