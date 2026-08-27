const ENGAGEMENT_STORAGE_KEY = "aiVerseSolutionEngagement";
const VISITOR_ID_KEY = "aiVerseVisitorId";
const VISITOR_PROFILE_KEY = "aiVerseVisitorProfile";

const toText = (value) => (value == null ? "" : String(value).trim());

const normalizeSolutionId = (value) => {
  if (value == null || value === "") return "";

  const normalized = String(value).trim();
  const withoutPrefix = normalized.toLowerCase().startsWith("api-")
    ? normalized.slice(4).trim()
    : normalized;

  // Card ids are `api-26`; admin table uses numeric `26` — same storage key.
  return /^\d+$/.test(withoutPrefix) ? withoutPrefix : normalized;
};

export { normalizeSolutionId };

const createId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeEmail = (value) => toText(value).toLowerCase();

export const getOrCreateVisitorId = () => {
  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;

    const visitorId = createId("visitor");
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
    return visitorId;
  } catch {
    return createId("visitor");
  }
};

export const getVisitorProfile = () => {
  try {
    const raw = localStorage.getItem(VISITOR_PROFILE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      name: toText(parsed?.name),
      email: toText(parsed?.email),
    };
  } catch {
    return { name: "", email: "" };
  }
};

export const setVisitorProfile = (profile = {}) => {
  const next = {
    name: toText(profile.name),
    email: toText(profile.email),
  };

  try {
    localStorage.setItem(VISITOR_PROFILE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures.
  }

  return next;
};

const normalizeReactor = (person = {}, dateKey = "actedAt") => {
  const email = normalizeEmail(person.email);
  const userId = toText(person.userId) || email || toText(person.visitorId) || createId("user");
  const name = toText(person.name) || (email ? email.split("@")[0] : "User");
  const actedAt =
    person[dateKey] || person.likedAt || person.dislikedAt || person.actedAt || new Date().toISOString();

  return {
    id: String(person.id || userId),
    userId,
    visitorId: userId,
    name,
    email,
    [dateKey]: actedAt,
    actedAt,
  };
};

const normalizeLiker = (person = {}) => {
  const normalized = normalizeReactor(person, "likedAt");
  return {
    id: normalized.id,
    userId: normalized.userId,
    visitorId: normalized.visitorId,
    name: normalized.name,
    email: normalized.email,
    likedAt: normalized.likedAt || normalized.actedAt,
  };
};

const normalizeDisliker = (person = {}) => {
  const normalized = normalizeReactor(person, "dislikedAt");
  return {
    id: normalized.id,
    userId: normalized.userId,
    visitorId: normalized.visitorId,
    name: normalized.name,
    email: normalized.email,
    dislikedAt: normalized.dislikedAt || normalized.actedAt,
  };
};

const normalizeViewer = (person = {}) => {
  const normalized = normalizeReactor(person, "viewedAt");
  return {
    id: normalized.id,
    userId: normalized.userId,
    visitorId: normalized.visitorId,
    name: normalized.name,
    email: normalized.email,
    viewedAt: normalized.viewedAt || normalized.actedAt,
  };
};

const defaultEngagement = () => ({
  views: 0,
  likes: 0,
  dislikes: 0,
  comments: [],
  likedBy: [],
  dislikedBy: [],
  viewers: [],
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
  window.dispatchEvent(new CustomEvent("aiverse:solution-engagement-updated"));
};

const sameUser = (person, user) => {
  const personEmail = normalizeEmail(person.email);
  const userEmail = normalizeEmail(user.email);
  if (personEmail && userEmail && personEmail === userEmail) return true;

  const personId = toText(person.userId || person.visitorId);
  const userId = toText(user.userId || user.visitorId || userEmail);
  return Boolean(personId && userId && personId === userId);
};

const normalizeEngagementRecord = (record = {}) => {
  const likedBy = Array.isArray(record.likedBy)
    ? record.likedBy.map(normalizeLiker)
    : [];
  const dislikedBy = Array.isArray(record.dislikedBy)
    ? record.dislikedBy.map(normalizeDisliker)
    : [];
  const viewers = Array.isArray(record.viewers)
    ? record.viewers.map(normalizeViewer)
    : [];

  return {
    views: viewers.length > 0 ? viewers.length : Number(record.views) || 0,
    likes: likedBy.length > 0 ? likedBy.length : Number(record.likes) || 0,
    dislikes:
      dislikedBy.length > 0 ? dislikedBy.length : Number(record.dislikes) || 0,
    comments: Array.isArray(record.comments)
      ? record.comments.map(normalizeComment)
      : [],
    likedBy,
    dislikedBy,
    viewers,
  };
};

export const getSolutionEngagement = (solutionId) => {
  const key = normalizeSolutionId(solutionId);
  if (!key) return defaultEngagement();

  const store = readEngagementStore();
  return normalizeEngagementRecord(store[key] || defaultEngagement());
};

export const getUserReaction = (solutionId, emailOrUserId) => {
  const engagement = getSolutionEngagement(solutionId);
  const user = { email: emailOrUserId, userId: emailOrUserId };

  if (engagement.likedBy.some((person) => sameUser(person, user))) return "like";
  if (engagement.dislikedBy.some((person) => sameUser(person, user))) return "dislike";
  return null;
};

export const hasVisitorLikedSolution = (solutionId, visitorId = getOrCreateVisitorId()) =>
  getUserReaction(solutionId, visitorId) === "like";

export const hasVisitorViewedSolution = (solutionId, visitorId = getOrCreateVisitorId()) => {
  const engagement = getSolutionEngagement(solutionId);
  return engagement.viewers.some((person) =>
    sameUser(person, { userId: visitorId, email: visitorId }),
  );
};

const updateSolutionEngagement = (solutionId, updater) => {
  const key = normalizeSolutionId(solutionId);
  if (!key) return defaultEngagement();

  const store = readEngagementStore();
  const current = getSolutionEngagement(key);
  const next = normalizeEngagementRecord(updater(current));

  store[key] = {
    views: next.views,
    likes: next.likes,
    dislikes: next.dislikes,
    comments: next.comments,
    likedBy: next.likedBy,
    dislikedBy: next.dislikedBy,
    viewers: next.viewers,
  };
  writeEngagementStore(store);
  return store[key];
};

const resolveActor = (actor = {}) => {
  const email = normalizeEmail(actor.email);
  const userId = toText(actor.userId) || email || toText(actor.visitorId) || getOrCreateVisitorId();
  const name =
    toText(actor.name) ||
    (email ? email.split("@")[0] : "") ||
    getVisitorProfile().name ||
    "User";

  return { userId, visitorId: userId, name, email };
};

/**
 * Records a unique view per authenticated/anonymous user.
 */
export const incrementSolutionView = (solutionId, actor = {}) =>
  updateSolutionEngagement(solutionId, (current) => {
    const person = resolveActor(actor);
    const alreadyViewed = current.viewers.some((viewer) => sameUser(viewer, person));
    if (alreadyViewed) return current;

    const viewers = [
      normalizeViewer({
        ...person,
        viewedAt: new Date().toISOString(),
      }),
      ...current.viewers,
    ];

    return {
      ...current,
      viewers,
      views: viewers.length,
    };
  });

/**
 * Apply like/dislike for an authenticated user.
 * Prevents duplicate likes/dislikes from the same user (matched by email).
 */
export const applyAuthenticatedReaction = (solutionId, action, user = {}) => {
  const person = resolveActor(user);
  if (!person.email && !person.userId) {
    throw new Error("Authenticated user is required.");
  }

  let status = "liked";
  const engagement = updateSolutionEngagement(solutionId, (current) => {
    const alreadyLiked = current.likedBy.some((entry) => sameUser(entry, person));
    const alreadyDisliked = current.dislikedBy.some((entry) => sameUser(entry, person));

    if (action === "like") {
      if (alreadyLiked) {
        status = "already_liked";
        return current;
      }

      const likedBy = [
        normalizeLiker({
          ...person,
          likedAt: new Date().toISOString(),
        }),
        ...current.likedBy.filter((entry) => !sameUser(entry, person)),
      ];
      const dislikedBy = current.dislikedBy.filter((entry) => !sameUser(entry, person));
      status = alreadyDisliked ? "switched_to_like" : "liked";

      return {
        ...current,
        likedBy,
        dislikedBy,
        likes: likedBy.length,
        dislikes: dislikedBy.length,
      };
    }

    if (action === "dislike") {
      if (alreadyDisliked) {
        status = "already_disliked";
        return current;
      }

      const dislikedBy = [
        normalizeDisliker({
          ...person,
          dislikedAt: new Date().toISOString(),
        }),
        ...current.dislikedBy.filter((entry) => !sameUser(entry, person)),
      ];
      const likedBy = current.likedBy.filter((entry) => !sameUser(entry, person));
      status = alreadyLiked ? "switched_to_dislike" : "disliked";

      return {
        ...current,
        likedBy,
        dislikedBy,
        likes: likedBy.length,
        dislikes: dislikedBy.length,
      };
    }

    return current;
  });

  return { engagement, status };
};

/** @deprecated Prefer applyAuthenticatedReaction / submitSolutionReaction */
export const toggleSolutionLike = (solutionId, actor = {}) => {
  const result = applyAuthenticatedReaction(solutionId, "like", actor);
  return result.engagement;
};

export const addSolutionComment = (solutionId, comment = {}) =>
  updateSolutionEngagement(solutionId, (current) => {
    if (toText(comment.authorName) || toText(comment.authorEmail)) {
      setVisitorProfile({
        name: comment.authorName,
        email: comment.authorEmail,
      });
    }

    return {
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
    };
  });

/**
 * Merge comments into storage by id (API hydrate / mirror). Newest first.
 */
export const upsertSolutionComments = (solutionId, comments = []) => {
  const incoming = (Array.isArray(comments) ? comments : [])
    .map((comment) => normalizeComment({ ...comment, source: comment.source || "public" }))
    .filter((comment) => comment.id);

  if (!incoming.length) {
    return getSolutionEngagement(solutionId);
  }

  return updateSolutionEngagement(solutionId, (current) => {
    const byId = new Map();
    [...current.comments, ...incoming].forEach((comment) => {
      if (comment?.id) {
        byId.set(String(comment.id), comment);
      }
    });

    const merged = [...byId.values()].sort(
      (left, right) =>
        new Date(right.createdAt || 0).getTime() -
        new Date(left.createdAt || 0).getTime(),
    );

    return {
      ...current,
      comments: merged,
    };
  });
};

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
