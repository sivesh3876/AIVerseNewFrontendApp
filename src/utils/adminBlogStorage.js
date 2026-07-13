import {
  getResourcesByCategory,
  getTrackById,
  learnExploreTracks,
} from "../components/LearnExplore/learnExploreData";
import { normalizeBlogUrl } from "./blogResourceLinks";

export const HOMEPAGE_CARD_COUNT = 6;
export const BLOG_RECORD_STATUSES = ["Published", "Draft", "Archive"];
export const BLOG_FORM_STATUSES = ["Published", "Draft"];
export const BLOG_CATEGORIES = [
  "FEATURED ARTICLE",
  "GUIDE",
  "RESEARCH",
  "TRENDS REPORT",
  "INDUSTRY REPORT",
];
export const BLOGS_CHANGED_EVENT = "aiVerseBlogsChanged";

const STORAGE_KEY = "aiVerseAdminBlogs";

const DEFAULT_STORAGE = {
  overrides: {},
  customBlogs: [],
  deletedIds: [],
  customCategories: [],
  customTracks: [],
};

const normalizeBlogStatus = (status) => {
  if (status === "Active") return "Published";
  if (status === "Inactive") return "Draft";
  if (BLOG_RECORD_STATUSES.includes(status)) return status;
  return "Published";
};

export const getBlogStatusTransitions = (currentStatus) => {
  const status = normalizeBlogStatus(currentStatus);

  if (status === "Draft") {
    return ["Draft", "Published"];
  }

  if (status === "Published") {
    return ["Published", "Archive"];
  }

  if (status === "Archive") {
    return ["Archive", "Published"];
  }

  return ["Published", "Archive"];
};

export const getDefaultAuthorName = (email = "") => {
  const normalized = String(email || "").trim();
  if (!normalized) return "AI Verse Team";

  const localPart = normalized.split("@")[0] || normalized;
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const parsePublishedAt = (dateLabel = "") => {
  const parsed = new Date(dateLabel);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const formatPublishedDate = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getDefaultViewCount = (id = "") => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash += id.charCodeAt(i);
  }
  return 150 + (hash % 850);
};

const buildSeedBlog = (resource) => ({
  id: resource.id,
  title: resource.title,
  category: resource.badge,
  trackId: resource.trackId,
  trackLabel: getTrackById(resource.trackId)?.label || "—",
  author: "AI Verse Team",
  description: resource.description,
  date: resource.date,
  publishedDate: resource.date,
  url: resource.url || "",
  publishedAt: parsePublishedAt(resource.date),
  viewCount: getDefaultViewCount(resource.id),
  recordStatus: "Published",
  showOnHomepage: false,
  homepageOrder: null,
  isCustom: false,
});

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STORAGE };

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT_STORAGE };

    if (
      parsed.overrides ||
      parsed.customBlogs ||
      parsed.deletedIds
    ) {
      return {
        ...DEFAULT_STORAGE,
        overrides: parsed.overrides || {},
        customBlogs: Array.isArray(parsed.customBlogs) ? parsed.customBlogs : [],
        deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
        customCategories: Array.isArray(parsed.customCategories)
          ? parsed.customCategories
          : [],
        customTracks: Array.isArray(parsed.customTracks) ? parsed.customTracks : [],
      };
    }

    return {
      ...DEFAULT_STORAGE,
      overrides: parsed,
    };
  } catch {
    return { ...DEFAULT_STORAGE };
  }
};

const writeStorage = (storage) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  window.dispatchEvent(new Event(BLOGS_CHANGED_EVENT));
};

const slugifyTrackId = (label = "") =>
  String(label)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeCategory = (value = "") =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();

export const saveCustomCategory = (category = "") => {
  const normalized = normalizeCategory(category);
  if (!normalized) return "";

  const storage = readStorage();
  const exists =
    BLOG_CATEGORIES.includes(normalized) ||
    storage.customCategories.includes(normalized);

  if (!exists) {
    storage.customCategories = [...storage.customCategories, normalized];
    writeStorage(storage);
  }

  return normalized;
};

export const saveCustomTrack = (label = "") => {
  const normalizedLabel = String(label || "").trim().replace(/\s+/g, " ");
  if (!normalizedLabel) return null;

  const builtIn = learnExploreTracks.find(
    (track) =>
      track.id !== "all" &&
      track.label.toLowerCase() === normalizedLabel.toLowerCase(),
  );
  if (builtIn) {
    return { id: builtIn.id, label: builtIn.label };
  }

  const storage = readStorage();
  const existingCustom = storage.customTracks.find(
    (track) => track.label.toLowerCase() === normalizedLabel.toLowerCase(),
  );
  if (existingCustom) {
    return existingCustom;
  }

  const id = `custom-${slugifyTrackId(normalizedLabel) || Date.now()}`;
  const track = { id, label: normalizedLabel };
  storage.customTracks = [...storage.customTracks, track];
  writeStorage(storage);
  return track;
};

export const getBlogCategoryOptions = () => {
  const storage = readStorage();
  const blogs = loadAdminBlogs();
  const fromBlogs = blogs.map((blog) => blog.category).filter(Boolean);

  return [
    ...new Set([...BLOG_CATEGORIES, ...storage.customCategories, ...fromBlogs]),
  ].sort((a, b) => a.localeCompare(b));
};

const normalizeBlogPayload = (payload = {}) => {
  const recordStatus = normalizeBlogStatus(payload.recordStatus);
  const isDraft = recordStatus === "Draft";

  const category = payload.customCategory
    ? saveCustomCategory(payload.customCategory)
    : normalizeCategory(payload.category) || BLOG_CATEGORIES[0];

  let trackId = payload.trackId || "generative-ai";
  let trackLabel = payload.trackLabel || "—";

  if (payload.customTrackLabel) {
    const savedTrack = saveCustomTrack(payload.customTrackLabel);
    if (savedTrack) {
      trackId = savedTrack.id;
      trackLabel = savedTrack.label;
    }
  } else {
    const builtInTrack = learnExploreTracks.find((track) => track.id === trackId);
    const customTrack = readStorage().customTracks.find(
      (track) => track.id === trackId,
    );
    trackLabel = builtInTrack?.label || customTrack?.label || trackLabel;
  }

  const publishedDate = isDraft
    ? ""
    : payload.publishedDate || formatPublishedDate(new Date().toISOString());
  const showOnHomepage = Boolean(payload.showOnHomepage);
  const homepageOrder = showOnHomepage
    ? Math.min(
        HOMEPAGE_CARD_COUNT,
        Math.max(1, Number(payload.homepageOrder) || 1),
      )
    : null;

  return {
    title: String(payload.title || "").trim(),
    category: payload.category || BLOG_CATEGORIES[0],
    trackId,
    trackLabel,
    author: String(payload.author || payload.defaultAuthor || "").trim() ||
      getDefaultAuthorName(payload.defaultAuthorEmail),
    description: String(payload.description || "").trim(),
    date: publishedDate,
    publishedDate,
    url: normalizeBlogUrl(payload.url),
    publishedAt: isDraft
      ? null
      : parsePublishedAt(publishedDate) || new Date().toISOString(),
    viewCount:
      Number(payload.viewCount) ||
      getDefaultViewCount(payload.id || `blog-${Date.now()}`),
    recordStatus,
    showOnHomepage,
    homepageOrder,
  };
};

const releaseHomepageSlot = (storage, order, exceptId) => {
  if (!order) return;

  storage.customBlogs = storage.customBlogs.map((blog) => {
    if (
      blog.id !== exceptId &&
      blog.showOnHomepage &&
      Number(blog.homepageOrder) === order
    ) {
      return { ...blog, showOnHomepage: false, homepageOrder: null };
    }
    return blog;
  });

  Object.entries(storage.overrides).forEach(([id, override]) => {
    if (id === exceptId) return;
    if (override?.showOnHomepage && Number(override.homepageOrder) === order) {
      storage.overrides[id] = {
        ...override,
        showOnHomepage: false,
        homepageOrder: null,
      };
    }
  });
};

const applyHomepagePlacement = (storage, blogId, normalized) => {
  if (normalized.showOnHomepage && normalized.homepageOrder) {
    releaseHomepageSlot(storage, normalized.homepageOrder, blogId);
  }
};

const mergeBlogRecord = (baseBlog, overrides = {}) => {
  const merged = {
    ...baseBlog,
    ...overrides,
    id: baseBlog.id,
    recordStatus: normalizeBlogStatus(overrides.recordStatus ?? baseBlog.recordStatus),
  };

  if (!merged.date) {
    merged.date = merged.publishedDate || "";
  }

  return merged;
};

export const loadAdminBlogs = () => {
  const storage = readStorage();
  const deleted = new Set(storage.deletedIds);

  const seedBlogs = getResourcesByCategory("blogs")
    .filter((resource) => !deleted.has(resource.id))
    .map((resource) =>
      mergeBlogRecord(buildSeedBlog(resource), storage.overrides[resource.id]),
    );

  const customBlogs = storage.customBlogs
    .filter((blog) => blog?.id && !deleted.has(blog.id))
    .map((blog) => mergeBlogRecord(blog, storage.overrides[blog.id]));

  return [...seedBlogs, ...customBlogs].sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });
};

export const createAdminBlogRecord = (payload = {}) => {
  const storage = readStorage();
  const normalized = normalizeBlogPayload(payload);
  const id = `blog-${Date.now()}`;

  const blog = {
    id,
    ...normalized,
    isCustom: true,
  };

  applyHomepagePlacement(storage, id, normalized);
  storage.customBlogs = [blog, ...storage.customBlogs];
  writeStorage(storage);

  return loadAdminBlogs().find((item) => item.id === id) || null;
};

export const updateAdminBlogRecord = (blogId, updates = {}) => {
  const storage = readStorage();
  const existingCustom = storage.customBlogs.find((blog) => blog.id === blogId);
  const normalized = normalizeBlogPayload({
    ...(existingCustom || {}),
    ...(storage.overrides[blogId] || {}),
    ...updates,
    id: blogId,
  });

  applyHomepagePlacement(storage, blogId, normalized);

  if (existingCustom) {
    storage.customBlogs = storage.customBlogs.map((blog) =>
      blog.id === blogId ? { ...blog, ...normalized, id: blogId, isCustom: true } : blog,
    );
    delete storage.overrides[blogId];
  } else {
    storage.overrides[blogId] = {
      ...(storage.overrides[blogId] || {}),
      ...normalized,
    };
  }

  writeStorage(storage);
  return loadAdminBlogs().find((item) => item.id === blogId) || null;
};

export const deleteAdminBlogRecord = (blogId) => {
  const storage = readStorage();

  storage.customBlogs = storage.customBlogs.filter((blog) => blog.id !== blogId);

  if (!storage.deletedIds.includes(blogId)) {
    storage.deletedIds = [...storage.deletedIds, blogId];
  }

  delete storage.overrides[blogId];
  writeStorage(storage);
  return true;
};

export const getBlogTrackOptions = () => {
  const storage = readStorage();
  const builtIn = learnExploreTracks.filter((track) => track.id !== "all");
  const blogs = loadAdminBlogs();
  const fromBlogs = blogs
    .filter((blog) => blog.trackId && blog.trackLabel)
    .map((blog) => ({ id: blog.trackId, label: blog.trackLabel }));

  const merged = new Map();
  [...builtIn, ...storage.customTracks, ...fromBlogs].forEach((track) => {
    if (track?.id && track?.label) {
      merged.set(track.id, track);
    }
  });

  return [...merged.values()].sort((a, b) => a.label.localeCompare(b.label));
};
