import {
  addSolutionCommentApi,
  fetchSolutionEngagement,
  recordSolutionShareApi,
  recordSolutionViewApi,
  toggleSolutionLikeApi,
} from "../services/solutionEngagementService";

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

export const loadSolutionEngagement = async (solutionId) => {
  if (!solutionId) {
    return mapEngagementState();
  }

  const data = await fetchSolutionEngagement(solutionId, getVisitorToken());
  return mapEngagementState(data);
};

export const toggleSolutionLike = async (solutionId, title) => {
  if (!solutionId) {
    return mapEngagementState();
  }

  const data = await toggleSolutionLikeApi(buildEngagementPayload(solutionId, title));
  return mapEngagementState(data);
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

  return mapEngagementState(data);
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
  return mapEngagementState(data);
};

export const shareSolution = async ({ solutionId, title, shareUrl }) => {
  const message = `Explore "${title}" on AI Verse`;
  let shareMethod = "clipboard";

  if (navigator.share) {
    try {
      await navigator.share({
        title: `${title} | AI Verse`,
        text: message,
        url: shareUrl,
      });
      shareMethod = "native";
    } catch (shareError) {
      if (shareError?.name === "AbortError") {
        throw shareError;
      }
    }
  }

  if (shareMethod === "clipboard") {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Sharing is not supported in this browser.");
    }
    await navigator.clipboard.writeText(shareUrl);
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
