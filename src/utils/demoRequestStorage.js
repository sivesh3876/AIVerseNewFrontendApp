const DEMO_REQUESTS_STORAGE_KEY = "aiVerseDemoRequests";
const DEMO_REQUEST_VIEWS_KEY = "aiVerseDemoRequestViews";
const LEGACY_DEMO_REQUESTS_SESSION_KEY = "aiVerseDemoRequestsSession";
const LAST_DEMO_SUBMISSION_KEY = "aiVerseLastDemoSubmission";

export const DEMO_REQUESTS_CHANGED_EVENT = "aiverse-demo-requests-changed";

export const notifyDemoRequestsChanged = () => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(DEMO_REQUESTS_CHANGED_EVENT));
};

export const DEMO_REQUEST_STATUSES = [
  "New",
  "In Progress",
  "Demo Scheduled",
  "Demo Completed",
  "Closed",
];

export const DEMO_RECORD_STATUSES = ["Active", "Inactive"];

const toText = (value) => (value == null ? "" : String(value).trim());

export const normalizeDemoRequest = (record = {}) => ({
  ...record,
  id: String(record.id ?? ""),
  solutionId: record.solutionId ?? null,
  solutionTitle: toText(record.solutionTitle),
  fullName: toText(record.fullName),
  email: toText(record.email),
  company: toText(record.company),
  phone: toText(record.phone),
  message: toText(record.message),
  submittedAt: record.submittedAt || new Date().toISOString(),
  notifiedTo: Array.isArray(record.notifiedTo) ? record.notifiedTo : [],
  notifiedCc: Array.isArray(record.notifiedCc) ? record.notifiedCc : [],
  emailSent: Boolean(record.emailSent),
  statusMessage: toText(record.statusMessage),
  coeName: toText(record.coeName),
  evangelistNames: Array.isArray(record.evangelistNames)
    ? record.evangelistNames.filter(Boolean)
    : [],
  status:
    record.status ||
    (record.emailSent === false ? "Pending" : DEMO_REQUEST_STATUSES[0]),
  recordStatus: record.recordStatus || "Active",
  demoScheduledBy: toText(record.demoScheduledBy),
  demoScheduledAt: record.demoScheduledAt || "",
  demoGivenBy: toText(record.demoGivenBy),
  demoGivenAt: record.demoGivenAt || "",
  feedbackRating: Number(record.feedbackRating) || 0,
  feedbackMessage: toText(record.feedbackMessage),
  feedbackSentiment: record.feedbackSentiment || "",
  likeCount: Number(record.likeCount) || 0,
  feedbackEntries: Array.isArray(record.feedbackEntries)
    ? record.feedbackEntries
    : [],
  viewCount: Number(record.viewCount) || 0,
  updatedAt: record.updatedAt || "",
});

export const buildDemoRequestRecord = (
  payload = {},
  apiResult = {},
  capabilityMeta = {},
) => {
  const requestId =
    apiResult?.data?.request_id ??
    apiResult?.data?.ID ??
    `local-${Date.now()}`;

  return normalizeDemoRequest({
    id: String(requestId),
    solutionId: payload.SolutionId ?? null,
    solutionTitle: toText(payload.SolutionTitle),
    fullName: toText(payload.FullName),
    email: toText(payload.Email),
    company: toText(payload.Company),
    phone: toText(payload.Phone),
    message: toText(payload.Message),
    submittedAt: new Date().toISOString(),
    notifiedTo: Array.isArray(apiResult?.data?.notified_to)
      ? apiResult.data.notified_to
      : [],
    notifiedCc: Array.isArray(apiResult?.data?.notified_cc)
      ? apiResult.data.notified_cc
      : [],
    emailSent: Boolean(apiResult?.data?.email_sent),
    statusMessage: toText(apiResult?.message),
    coeName: toText(capabilityMeta.coeName),
    evangelistNames: capabilityMeta.evangelistNames || [],
    status: DEMO_REQUEST_STATUSES[0],
    recordStatus: "Active",
    demoScheduledBy: "",
    demoScheduledAt: "",
    demoGivenBy: "",
    demoGivenAt: "",
    feedbackRating: 0,
    feedbackMessage: "",
    feedbackSentiment: "",
    likeCount: 0,
    feedbackEntries: toText(payload.Message)
      ? [
          {
            id: `request-${String(requestId)}`,
            authorName: toText(payload.FullName),
            authorEmail: toText(payload.Email),
            message: toText(payload.Message),
            rating: 0,
            sentiment: "",
            createdAt: new Date().toISOString(),
            source: "request",
          },
        ]
      : [],
    viewCount: 0,
  });
};

const readFromStorage = (storage, key) => {
  try {
    const raw = storage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const readStoredDemoRequests = () => {
  const mergedById = new Map();

  const ingest = (items = []) => {
    items.forEach((item) => {
      const normalized = normalizeDemoRequest(item);
      if (normalized.id) {
        mergedById.set(normalized.id, normalized);
      }
    });
  };

  ingest(readFromStorage(localStorage, DEMO_REQUESTS_STORAGE_KEY));
  ingest(readFromStorage(sessionStorage, DEMO_REQUESTS_STORAGE_KEY));
  ingest(readFromStorage(sessionStorage, LEGACY_DEMO_REQUESTS_SESSION_KEY));

  return [...mergedById.values()];
};

const writeStoredDemoRequests = (requests) => {
  const json = JSON.stringify(requests);

  try {
    localStorage.setItem(DEMO_REQUESTS_STORAGE_KEY, json);
  } catch {
    // Ignore quota or private-mode errors for localStorage.
  }

  try {
    sessionStorage.setItem(DEMO_REQUESTS_STORAGE_KEY, json);
  } catch {
    // Ignore quota or private-mode errors for sessionStorage.
  }

  try {
    sessionStorage.removeItem(LEGACY_DEMO_REQUESTS_SESSION_KEY);
  } catch {
    // Ignore cleanup errors.
  }

  notifyDemoRequestsChanged();
};

export const saveLastDemoSubmission = (record) => {
  if (!record?.id) return;

  try {
    sessionStorage.setItem(
      LAST_DEMO_SUBMISSION_KEY,
      JSON.stringify(normalizeDemoRequest(record)),
    );
  } catch {
    // Ignore backup errors.
  }
};

export const loadLastDemoSubmission = () => {
  try {
    const raw = sessionStorage.getItem(LAST_DEMO_SUBMISSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed ? normalizeDemoRequest(parsed) : null;
  } catch {
    return null;
  }
};

export const restoreLastDemoSubmission = () => {
  const last = loadLastDemoSubmission();
  if (!last?.id) return null;

  return saveDemoRequestRecord(last);
};

export const removeDemoRequestRecord = (id) => {
  if (!id) return;

  const requestId = String(id);
  const existing = readStoredDemoRequests();
  const next = existing.filter((item) => item.id !== requestId);

  if (next.length === existing.length) {
    return;
  }

  writeStoredDemoRequests(next);
};

export const saveDemoRequestRecord = (record) => {
  if (!record?.id) return null;

  const normalized = normalizeDemoRequest(record);
  const existing = readStoredDemoRequests();
  const withoutDuplicate = existing.filter((item) => item.id !== normalized.id);
  writeStoredDemoRequests([normalized, ...withoutDuplicate]);
  saveLastDemoSubmission(normalized);
  return normalized;
};

export const savePendingDemoRequest = (payload = {}, capabilityMeta = {}) => {
  const pendingId = `pending-${Date.now()}`;
  const record = normalizeDemoRequest({
    ...buildDemoRequestRecord(payload, { data: { request_id: pendingId } }, capabilityMeta),
    status: "Submitting",
    emailSent: false,
  });

  saveDemoRequestRecord(record);
  return record;
};

export const persistDemoRequestSubmission = (
  payload,
  apiResult,
  capabilityMeta = {},
  options = {},
) => {
  const record = buildDemoRequestRecord(payload, apiResult, capabilityMeta);

  if (options.pendingId) {
    removeDemoRequestRecord(options.pendingId);
  }

  saveDemoRequestRecord(record);
  return record;
};

export const updateDemoRequestRecord = (id, updates = {}) => {
  if (!id) return null;

  const existing = readStoredDemoRequests();
  let updatedRecord = null;

  const next = existing.map((item) => {
    if (item.id !== String(id)) {
      return item;
    }

    updatedRecord = normalizeDemoRequest({
      ...item,
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return updatedRecord;
  });

  if (!updatedRecord) {
    return null;
  }

  writeStoredDemoRequests(next);
  return updatedRecord;
};

const readViewLedger = () => {
  try {
    const raw = localStorage.getItem(DEMO_REQUEST_VIEWS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const incrementDemoRequestViewCount = (id) => {
  if (!id) return null;

  const ledger = readViewLedger();
  const requestId = String(id);
  ledger[requestId] = (Number(ledger[requestId]) || 0) + 1;
  localStorage.setItem(DEMO_REQUEST_VIEWS_KEY, JSON.stringify(ledger));

  const existing = readStoredDemoRequests();
  const match = existing.find((item) => item.id === requestId);
  const baseViews = Number(match?.viewCount) || 0;
  const viewCount = Math.max(baseViews, ledger[requestId]);

  return updateDemoRequestRecord(requestId, { viewCount });
};

export const loadStoredDemoRequests = () =>
  readStoredDemoRequests().sort(
    (left, right) =>
      new Date(right.submittedAt || 0).getTime() -
      new Date(left.submittedAt || 0).getTime(),
  );

export const clearStoredDemoRequests = () => {
  localStorage.removeItem(DEMO_REQUESTS_STORAGE_KEY);
  localStorage.removeItem(DEMO_REQUEST_VIEWS_KEY);
  sessionStorage.removeItem(DEMO_REQUESTS_STORAGE_KEY);
  sessionStorage.removeItem(LEGACY_DEMO_REQUESTS_SESSION_KEY);
  sessionStorage.removeItem(LAST_DEMO_SUBMISSION_KEY);
  notifyDemoRequestsChanged();
};
