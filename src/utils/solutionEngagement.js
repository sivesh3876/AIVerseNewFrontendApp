import { getAdminSession } from "./adminAuth";
import {
  addSolutionCommentApi,
  fetchSolutionEngagement,
  fetchSolutionEngagementSummary,
  recordSolutionShareApi,
  recordSolutionViewApi,
  toggleSolutionLikeApi,
} from "../services/solutionEngagementService";
import {
  applyAuthenticatedReaction,
  getVisitorProfile,
  incrementSolutionView,
  upsertSolutionComments,
} from "./solutionEngagementStorage";

const VISITOR_TOKEN_KEY = "aiverse-visitor-token";
const VIEW_SESSION_KEY_PREFIX = "aiverse-view-recorded-";

export const getVisitorToken = () => {
  if (typeof window === "undefined") {
    return "";
  }

  let token = localStorage.getItem(VISITOR_TOKEN_KEY);
  if (!token) {
    token =
      window.crypto?.randomUUID?.() ||
      `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(VISITOR_TOKEN_KEY, token);
  }

  return token;
};

export const parseSolutionId = (value) => {
  if (value == null || value === "") {
    return null;
  }

  const normalized = String(value).trim();
  const withoutPrefix = normalized.toLowerCase().startsWith("api-")
    ? normalized.slice(4).trim()
    : normalized;

  if (!/^\d+$/.test(withoutPrefix)) {
    return null;
  }

  return Number(withoutPrefix);
};

export const buildSolutionShareUrl = ({ solutionId, detailUrl, serviceLine } = {}) => {
  if (typeof window === "undefined") {
    return detailUrl || `/explore-solutions?solution=${encodeURIComponent(solutionId || "")}`;
  }

  if (detailUrl) {
    return detailUrl.startsWith("http")
      ? detailUrl
      : `${window.location.origin}${detailUrl}`;
  }

  const params = new URLSearchParams();
  if (serviceLine) {
    params.set("service", serviceLine);
  }
  if (solutionId) {
    params.set("solution", solutionId);
  }

  const query = params.toString();
  return `${window.location.origin}/explore-solutions${query ? `?${query}` : ""}`;
};

const buildEngagementPayload = (solutionId, title, extra = {}) => ({
  SolutionKey: solutionId,
  SolutionTitle: title || "",
  SolutionId: parseSolutionId(solutionId),
  VisitorToken: getVisitorToken(),
  ...extra,
});

const mapEngagementState = (data = {}) => ({
  liked: Boolean(data.liked),
  likeCount: Number(data.likeCount) || 0,
  commentCount: Number(data.commentCount) || 0,
  shareCount: Number(data.shareCount) || 0,
  viewCount: Number(data.viewCount) || 0,
  comments: Array.isArray(data.comments) ? data.comments : [],
});

const resolveMirrorActor = (override = {}) => {
  const session = typeof window !== "undefined" ? getAdminSession() : null;
  const profile = typeof window !== "undefined" ? getVisitorProfile() : { name: "", email: "" };

  return {
    name:
      String(override.name || "").trim() ||
      session?.name ||
      profile.name ||
      "",
    email:
      String(override.email || "").trim() ||
      session?.email ||
      profile.email ||
      "",
    userId:
      String(override.userId || "").trim() ||
      session?.email ||
      profile.email ||
      getVisitorToken(),
  };
};

/** Flatten API comments (incl. replies) into admin storage shape. */
export const mapApiCommentsToStorage = (comments = []) => {
  const flattened = [];

  const walk = (list) => {
    (Array.isArray(list) ? list : []).forEach((comment) => {
      if (!comment) return;

      const id = comment.id ?? comment.commentId;
      const message =
        comment.message ||
        comment.text ||
        comment.commentText ||
        comment.CommentText ||
        "";
      const authorName =
        comment.authorName ||
        comment.author ||
        comment.AuthorName ||
        "";
      const authorEmail =
        comment.authorEmail ||
        comment.AuthorEmail ||
        "";

      if (id != null || message) {
        flattened.push({
          id: id != null ? String(id) : `comment-${Date.now()}-${flattened.length}`,
          authorName: String(authorName).trim(),
          authorEmail: String(authorEmail).trim(),
          message: String(message).trim(),
          createdAt:
            comment.createdAt ||
            comment.CreatedAt ||
            comment.created_at ||
            new Date().toISOString(),
          source: "public",
        });
      }

      if (Array.isArray(comment.replies) && comment.replies.length) {
        walk(comment.replies);
      }
    });
  };

  walk(comments);
  return flattened;
};

export const persistApiCommentsToAdminStore = (solutionId, comments = []) => {
  if (!solutionId || typeof window === "undefined") {
    return null;
  }

  const mapped = mapApiCommentsToStorage(comments);
  if (!mapped.length) {
    return null;
  }

  return upsertSolutionComments(solutionId, mapped);
};

const mirrorLikeToAdminStore = (solutionId, liked) => {
  if (!solutionId || typeof window === "undefined" || !liked) {
    return;
  }

  try {
    const actor = resolveMirrorActor();
    if (!actor.email && !actor.userId) {
      return;
    }
    applyAuthenticatedReaction(solutionId, "like", actor);
  } catch {
    // Admin mirror must not break public like flow.
  }
};

const mirrorViewToAdminStore = (solutionId) => {
  if (!solutionId || typeof window === "undefined") {
    return;
  }

  try {
    incrementSolutionView(solutionId, resolveMirrorActor());
  } catch {
    // Admin mirror must not break public view flow.
  }
};

export const loadSolutionEngagement = async (solutionId) => {
  if (!solutionId) {
    return mapEngagementState();
  }

  const data = await fetchSolutionEngagement(solutionId, getVisitorToken());
  return mapEngagementState(data);
};

/** Normalize `api-74` / `74` to a shared lookup key. */
export const toEngagementLookupKey = (value) => {
  const parsed = parseSolutionId(value);
  if (parsed != null) {
    return String(parsed);
  }

  return String(value || "")
    .trim()
    .toLowerCase();
};

export const toEngagementSolutionKey = (value) => {
  const parsed = parseSolutionId(value);
  if (parsed != null) {
    return `api-${parsed}`;
  }

  return String(value || "").trim();
};

/** Same totals the explore card shows for one solution. */
export const getAdminEngagementCounts = async (solutionId) => {
  if (!solutionId) {
    return { views: 0, likes: 0, comments: 0, shareCount: 0 };
  }

  const state = await loadSolutionEngagement(toEngagementSolutionKey(solutionId));
  return {
    views: state.viewCount,
    likes: state.likeCount,
    comments: state.commentCount,
    shareCount: state.shareCount,
  };
};

const readSummaryCount = (row, keys) => {
  for (const key of keys) {
    if (row[key] != null && row[key] !== "") {
      return Number(row[key]) || 0;
    }
  }
  return 0;
};

const readSummarySolutionKey = (row = {}) =>
  row.solutionKey ??
  row.SolutionKey ??
  row.solutionId ??
  row.SolutionId ??
  row.id ??
  row.ID ??
  "";

const normalizeSummaryRow = (row) => {
  if (!row || typeof row !== "object") {
    return null;
  }

  const rawKey = readSummarySolutionKey(row);
  const lookupKey = toEngagementLookupKey(rawKey);
  if (!lookupKey) {
    return null;
  }

  let comments = readSummaryCount(row, [
    "commentCount",
    "CommentCount",
    "comments",
    "Comments",
  ]);
  if (Array.isArray(row.comments)) {
    comments = Math.max(comments, row.comments.length);
  }

  return {
    lookupKey,
    counts: {
      views: readSummaryCount(row, ["viewCount", "ViewCount", "views", "Views"]),
      likes: readSummaryCount(row, ["likeCount", "LikeCount", "likes", "Likes"]),
      comments,
      shareCount: readSummaryCount(row, [
        "shareCount",
        "ShareCount",
        "shares",
        "Shares",
      ]),
    },
  };
};

/**
 * Map of engagement totals keyed by numeric id and `api-*` for admin table.
 */
export const loadEngagementSummaryMap = async (limit = 200) => {
  const map = new Map();

  try {
    const data = await fetchSolutionEngagementSummary(limit);
    const rows = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.solutions)
          ? data.solutions
          : Array.isArray(data?.data)
            ? data.data
            : [];

    rows.forEach((row) => {
      const normalized = normalizeSummaryRow(row);
      if (!normalized) return;

      map.set(normalized.lookupKey, normalized.counts);
      if (/^\d+$/.test(normalized.lookupKey)) {
        map.set(`api-${normalized.lookupKey}`, normalized.counts);
      }
    });
  } catch {
    // Admin falls back to localStorage when summary is unavailable.
  }

  return map;
};

export const lookupEngagementCounts = (summaryMap, solutionId) => {
  if (!summaryMap || typeof summaryMap.get !== "function") {
    return null;
  }

  const key = toEngagementLookupKey(solutionId);
  if (!key) {
    return null;
  }

  return summaryMap.get(key) || summaryMap.get(`api-${key}`) || null;
};

export const toggleSolutionLike = async (solutionId, title) => {
  if (!solutionId) {
    return mapEngagementState();
  }

  const data = await toggleSolutionLikeApi(buildEngagementPayload(solutionId, title));
  const state = mapEngagementState(data);
  mirrorLikeToAdminStore(solutionId, state.liked);
  return state;
};

export const getSolutionComments = async (solutionId) => {
  const state = await loadSolutionEngagement(solutionId);
  return state.comments;
};

export const addSolutionComment = async (
  solutionId,
  title,
  { author, text, authorEmail, parentCommentId } = {},
) => {
  if (!solutionId) {
    return mapEngagementState();
  }

  const data = await addSolutionCommentApi({
    ...buildEngagementPayload(solutionId, title),
    AuthorName: (author || "").trim(),
    AuthorEmail: (authorEmail || "").trim() || undefined,
    CommentText: (text || "").trim(),
    ParentCommentId: parentCommentId || undefined,
  });

  const state = mapEngagementState(data);

  try {
    const fromApi = mapApiCommentsToStorage(state.comments);
    if (fromApi.length) {
      persistApiCommentsToAdminStore(solutionId, state.comments);
    } else {
      upsertSolutionComments(solutionId, [
        {
          id: `comment-${Date.now()}`,
          authorName: (author || "").trim(),
          authorEmail: (authorEmail || "").trim(),
          message: (text || "").trim(),
          createdAt: new Date().toISOString(),
          source: "public",
        },
      ]);
    }
  } catch {
    // Admin mirror must not break public comment flow.
  }

  return state;
};

export const recordSolutionView = async (solutionId, title, viewSource = "detail") => {
  if (!solutionId || typeof window === "undefined") {
    return null;
  }

  const sessionKey = `${VIEW_SESSION_KEY_PREFIX}${solutionId}`;
  if (sessionStorage.getItem(sessionKey)) {
    return null;
  }

  const data = await recordSolutionViewApi({
    ...buildEngagementPayload(solutionId, title),
    ViewSource: viewSource,
  });

  sessionStorage.setItem(sessionKey, "1");
  const state = mapEngagementState(data);
  mirrorViewToAdminStore(solutionId);
  return state;
};

export const shareSolution = async ({ solutionId, title, shareUrl }) => {
  const message = `Explore "${title}" on AI Verse`;
  const shareText = shareUrl ? `${message}\n${shareUrl}` : message;
  const shareTitle = `${title} | AI Verse`;
  let shareMethod = "clipboard";

  const tryNativeShare = async (data) => {
    if (typeof navigator.canShare === "function" && !navigator.canShare(data)) {
      return false;
    }

    await navigator.share(data);
    return true;
  };

  if (navigator.share) {
    const fullPayload = {
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    };
    const textOnlyPayload = {
      title: shareTitle,
      text: shareText,
    };

    try {
      if (await tryNativeShare(fullPayload)) {
        shareMethod = "native";
      } else if (await tryNativeShare(textOnlyPayload)) {
        shareMethod = "native";
      }
    } catch (shareError) {
      if (shareError?.name === "AbortError") {
        throw shareError;
      }

      try {
        if (await tryNativeShare(textOnlyPayload)) {
          shareMethod = "native";
        }
      } catch (retryError) {
        if (retryError?.name === "AbortError") {
          throw retryError;
        }
      }
    }
  }

  if (shareMethod === "clipboard") {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Sharing is not supported in this browser.");
    }
    await navigator.clipboard.writeText(shareText);
  }

  if (solutionId) {
    await recordSolutionShareApi({
      ...buildEngagementPayload(solutionId, title),
      ShareMethod: shareMethod,
      ShareUrl: shareUrl,
    });
  }

  return { method: shareMethod };
};
