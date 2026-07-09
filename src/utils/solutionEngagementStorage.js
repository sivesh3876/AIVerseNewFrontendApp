const ENGAGEMENT_STORAGE_KEY = "aiVerseSolutionEngagement";

const toText = (value) => (value == null ? "" : String(value).trim());

const normalizeSolutionId = (value) => {
  if (value == null || value === "") return "";

  const normalized = String(value).trim();
  const withoutPrefix = normalized.toLowerCase().startsWith("api-")
    ? normalized.slice(4).trim()
    : normalized;

  return /^\d+$/.test(withoutPrefix) ? withoutPrefix : normalized;
};

const defaultEngagement = () => ({
  views: 0,
  likes: 0,
  comments: [],
});

const normalizeComment = (comment = {}) => ({
  id: String(comment.id ?? `comment-${Date.now()}`),
  authorName: toText(comment.authorName),
  authorEmail: toText(comment.authorEmail),
  message: toText(comment.message),
  rating: Number(comment.rating) || 0,
  sentiment: comment.sentiment || "",
  createdAt: comment.createdAt || new Date().toISOString(),
  updatedAt: comment.updatedAt || "",
  source: comment.source || "public",
});

const readEngagementStore = () => {
  try {
    const raw = localStorage.getItem(ENGAGEMENT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeEngagementStore = (store) => {
  localStorage.setItem(ENGAGEMENT_STORAGE_KEY, JSON.stringify(store));
};

export const getSolutionEngagement = (solutionId) => {
  const key = normalizeSolutionId(solutionId);
  if (!key) return defaultEngagement();

  const store = readEngagementStore();
  const record = store[key] || defaultEngagement();

  return {
    views: Number(record.views) || 0,
    likes: Number(record.likes) || 0,
    comments: Array.isArray(record.comments)
      ? record.comments.map(normalizeComment)
      : [],
  };
};

const updateSolutionEngagement = (solutionId, updater) => {
  const key = normalizeSolutionId(solutionId);
  if (!key) return defaultEngagement();

  const store = readEngagementStore();
  const current = getSolutionEngagement(key);
  const next = updater(current);
  store[key] = {
    views: Number(next.views) || 0,
    likes: Number(next.likes) || 0,
    comments: Array.isArray(next.comments)
      ? next.comments.map(normalizeComment)
      : [],
  };
  writeEngagementStore(store);
  return store[key];
};

export const incrementSolutionView = (solutionId) =>
  updateSolutionEngagement(solutionId, (current) => ({
    ...current,
    views: current.views + 1,
  }));

export const toggleSolutionLike = (solutionId) =>
  updateSolutionEngagement(solutionId, (current) => ({
    ...current,
    likes: current.likes + 1,
  }));

export const addSolutionComment = (solutionId, comment = {}) =>
  updateSolutionEngagement(solutionId, (current) => ({
    ...current,
    comments: [
      normalizeComment({
        ...comment,
        id: comment.id || `comment-${Date.now()}`,
        createdAt: new Date().toISOString(),
        source: comment.source || "public",
      }),
      ...current.comments,
    ],
  }));

export const mergeEngagementIntoDemoRequest = (request = {}) => {
  if (!request.solutionId) return request;

  const engagement = getSolutionEngagement(request.solutionId);
  const requestEntries = Array.isArray(request.feedbackEntries)
    ? request.feedbackEntries
    : [];

  const legacyEntry =
    request.feedbackMessage ||
    request.feedbackRating ||
    request.feedbackSentiment
      ? [
          {
            id: `legacy-${request.id}`,
            authorName: request.fullName || "Requester",
            authorEmail: request.email || "",
            message: request.feedbackMessage || request.message || "",
            rating: Number(request.feedbackRating) || 0,
            sentiment: request.feedbackSentiment || "",
            createdAt: request.submittedAt || new Date().toISOString(),
            updatedAt: request.updatedAt || "",
            source: "request",
          },
        ]
      : [];

  const commentEntries = engagement.comments.map((comment) => ({
    ...comment,
    source: comment.source || "public",
  }));

  const mergedById = new Map();
  [...legacyEntry, ...requestEntries, ...commentEntries].forEach((entry) => {
    if (entry?.id) {
      mergedById.set(entry.id, entry);
    }
  });

  return {
    ...request,
    viewCount: Math.max(Number(request.viewCount) || 0, engagement.views),
    likeCount: Math.max(Number(request.likeCount) || 0, engagement.likes),
    feedbackEntries: [...mergedById.values()].sort(
      (left, right) =>
        new Date(right.createdAt || 0).getTime() -
        new Date(left.createdAt || 0).getTime(),
    ),
  };
};
