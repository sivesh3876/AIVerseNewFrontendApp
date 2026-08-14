import {
  getResourcesByCategory,
  getTrackById,
  learnExploreTracks,
} from "../components/LearnExplore/learnExploreData";
import {
  createBlog as createBlogApi,
  deleteBlog as deleteBlogApi,
  fetchBlogs,
  updateBlog as updateBlogApi,
} from "../services/blogsApiService";
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
  "WHITEPAPER",
  "CASE STUDY",
];
export const BLOGS_CHANGED_EVENT = "aiVerseBlogsChanged";

const STORAGE_KEY = "aiVerseAdminBlogs";

/** In-memory cache of blogs loaded from production API. */
let apiBlogsCache = [];

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
    category,
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

const normalizeApiBlog = (blog = {}) => {
  const apiId = blog.apiId ?? null;
  const id =
    blog.id ||
    blog.seedKey ||
    (apiId != null ? `blog-${apiId}` : `blog-${Date.now()}`);

  return {
    ...blog,
    id,
    apiId,
    seedKey: blog.seedKey || null,
    title: blog.title || "",
    category: blog.category || BLOG_CATEGORIES[0],
    trackId: blog.trackId || "",
    trackLabel: blog.trackLabel || "—",
    author: blog.author || "AI Verse Team",
    description: blog.description || "",
    url: blog.url || "",
    date: blog.date || blog.publishedDate || "",
    publishedDate: blog.publishedDate || blog.date || "",
    publishedAt: blog.publishedAt || null,
    viewCount: Number(blog.viewCount) || 0,
    recordStatus: normalizeBlogStatus(blog.recordStatus),
    showOnHomepage: Boolean(blog.showOnHomepage),
    homepageOrder: blog.homepageOrder ?? null,
    isCustom: Boolean(blog.isCustom ?? !blog.seedKey),
  };
};

const toApiPayload = (normalized, extra = {}) => ({
  title: normalized.title,
  category: normalized.category,
  trackId: normalized.trackId,
  trackLabel: normalized.trackLabel,
  author: normalized.author,
  description: normalized.description,
  url: normalized.url,
  publishedDate: normalized.publishedDate,
  publishedAt: normalized.publishedAt,
  viewCount: normalized.viewCount,
  recordStatus: normalized.recordStatus,
  showOnHomepage: normalized.showOnHomepage,
  homepageOrder: normalized.homepageOrder,
  ...extra,
});

export const refreshBlogsFromApi = async ({ includeUnpublished = true } = {}) => {
  const data = await fetchBlogs({ includeUnpublished });
  apiBlogsCache = data.map(normalizeApiBlog);
  window.dispatchEvent(new Event(BLOGS_CHANGED_EVENT));
  return loadAdminBlogs();
};

export const loadAdminBlogs = () => {
  const storage = readStorage();
  const deleted = new Set(storage.deletedIds);
  const apiById = new Map(apiBlogsCache.map((blog) => [String(blog.id), blog]));
  const apiBySeed = new Map(
    apiBlogsCache
      .filter((blog) => blog.seedKey)
      .map((blog) => [String(blog.seedKey), blog]),
  );

  const seedBlogs = getResourcesByCategory("blogs")
    .filter((resource) => !deleted.has(resource.id))
    .map((resource) => {
      const fromApi =
        apiBySeed.get(String(resource.id)) || apiById.get(String(resource.id));
      if (fromApi) return fromApi;
      return mergeBlogRecord(
        buildSeedBlog(resource),
        storage.overrides[resource.id],
      );
    });

  const seedIds = new Set(seedBlogs.map((blog) => String(blog.id)));

  const apiCustoms = apiBlogsCache.filter(
    (blog) =>
      !seedIds.has(String(blog.id)) &&
      !deleted.has(blog.id) &&
      !blog.seedKey,
  );

  const localCustoms = storage.customBlogs
    .filter(
      (blog) =>
        blog?.id &&
        !deleted.has(blog.id) &&
        !apiById.has(String(blog.id)) &&
        !seedIds.has(String(blog.id)),
    )
    .map((blog) => mergeBlogRecord(blog, storage.overrides[blog.id]));

  return [...seedBlogs, ...apiCustoms, ...localCustoms].sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });
};

export const createAdminBlogRecord = async (payload = {}) => {
  const normalized = normalizeBlogPayload(payload);

  try {
    const created = await createBlogApi(toApiPayload(normalized));
    await refreshBlogsFromApi({ includeUnpublished: true });
    return normalizeApiBlog(created);
  } catch (apiError) {
    // Fallback for local/dev when API/table is unavailable.
    const storage = readStorage();
    const id = `blog-${Date.now()}`;
    const blog = { id, ...normalized, isCustom: true };
    applyHomepagePlacement(storage, id, normalized);
    storage.customBlogs = [blog, ...storage.customBlogs];
    writeStorage(storage);
    console.warn("Blog API create failed; saved locally.", apiError);
    return loadAdminBlogs().find((item) => item.id === id) || null;
  }
};

export const updateAdminBlogRecord = async (blogId, updates = {}) => {
  const existing = loadAdminBlogs().find((blog) => String(blog.id) === String(blogId));
  const normalized = normalizeBlogPayload({
    ...(existing || {}),
    ...updates,
    id: blogId,
  });

  const apiMatch =
    apiBlogsCache.find(
      (blog) =>
        String(blog.id) === String(blogId) ||
        String(blog.seedKey) === String(blogId) ||
        String(blog.apiId) === String(blogId).replace(/^blog-/, ""),
    ) || null;

  try {
    if (apiMatch?.apiId != null) {
      await updateBlogApi(
        toApiPayload(normalized, {
          apiId: apiMatch.apiId,
          id: apiMatch.apiId,
          seedKey: apiMatch.seedKey || existing?.seedKey || null,
        }),
      );
    } else if (existing && existing.isCustom === false) {
      await createBlogApi(
        toApiPayload(normalized, { seedKey: blogId }),
      );
    } else if (existing?.apiId != null) {
      await updateBlogApi(
        toApiPayload(normalized, { apiId: existing.apiId, id: existing.apiId }),
      );
    } else {
      await createBlogApi(toApiPayload(normalized));
    }

    await refreshBlogsFromApi({ includeUnpublished: true });
    return (
      loadAdminBlogs().find((blog) => String(blog.id) === String(blogId)) ||
      loadAdminBlogs()[0] ||
      null
    );
  } catch (apiError) {
    const storage = readStorage();
    const existingCustom = storage.customBlogs.find((blog) => blog.id === blogId);
    applyHomepagePlacement(storage, blogId, normalized);

    if (existingCustom) {
      storage.customBlogs = storage.customBlogs.map((blog) =>
        blog.id === blogId
          ? { ...blog, ...normalized, id: blogId, isCustom: true }
          : blog,
      );
      delete storage.overrides[blogId];
    } else {
      storage.overrides[blogId] = {
        ...(storage.overrides[blogId] || {}),
        ...normalized,
      };
    }

    writeStorage(storage);
    console.warn("Blog API update failed; saved locally.", apiError);
    return loadAdminBlogs().find((blog) => blog.id === blogId) || null;
  }
};

export const deleteAdminBlogRecord = async (blogId) => {
  const existing = loadAdminBlogs().find((blog) => String(blog.id) === String(blogId));
  const apiId =
    existing?.apiId ??
    apiBlogsCache.find((blog) => String(blog.id) === String(blogId))?.apiId;

  try {
    if (apiId != null) {
      await deleteBlogApi(apiId);
      await refreshBlogsFromApi({ includeUnpublished: true });
      return true;
    }
  } catch (apiError) {
    console.warn("Blog API delete failed; applying local delete.", apiError);
  }

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
