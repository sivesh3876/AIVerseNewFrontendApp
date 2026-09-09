import {
  getResourcesByCategory,
  homeInsights as defaultHomeInsights,
  learnExploreResources,
} from "../components/LearnExplore/learnExploreData";
import { loadAdminBlogs } from "./adminBlogStorage";
import { stripHtml } from "./htmlContent";

export const HOMEPAGE_CARD_COUNT = 6;

export const BLOG_BADGE_COLORS = {
  MARKETING: "#18E0CC",
  "FEATURED ARTICLE": "#18E0CC",
  GUIDE: "#4D90E3",
  RESEARCH: "#18E0CC",
  "TRENDS REPORT": "#F5B800",
  "INDUSTRY REPORT": "#4D90E3",
  WHITEPAPER: "#3A8D9D",
  "CASE STUDY": "#EF8E29",
};

export const toPublicResource = (blog) => ({
  id: blog.id,
  trackId: blog.trackId,
  badge: blog.category,
  badgeColor: BLOG_BADGE_COLORS[blog.category] || "#3A8D9D",
  title: blog.title,
  description: stripHtml(blog.description),
  date: blog.date || blog.publishedDate,
  url: blog.url || "",
  linkTo: blog.url ? undefined : `/blogs?article=${encodeURIComponent(blog.id)}`,
  isCustom: Boolean(blog.isCustom),
  publishedAt: blog.publishedAt || null,
});

export const getActiveAdminBlogs = () =>
  loadAdminBlogs().filter((blog) => blog.recordStatus === "Published");

export const isHomepageBlog = (blog) =>
  Boolean(
    blog?.showOnHomepage &&
      Number(blog.homepageOrder) >= 1 &&
      Number(blog.homepageOrder) <= HOMEPAGE_CARD_COUNT,
  );

const isMarketingBlog = (blog) =>
  String(blog?.category || blog?.badge || "")
    .trim()
    .toUpperCase() === "MARKETING";

const sortAdminBlogsForHomepage = (left, right) => {
  const leftOrder = Number(left.homepageOrder);
  const rightOrder = Number(right.homepageOrder);
  const leftHasOrder =
    left.showOnHomepage && leftOrder >= 1 && leftOrder <= HOMEPAGE_CARD_COUNT;
  const rightHasOrder =
    right.showOnHomepage && rightOrder >= 1 && rightOrder <= HOMEPAGE_CARD_COUNT;

  if (leftHasOrder && rightHasOrder) return leftOrder - rightOrder;
  if (leftHasOrder) return -1;
  if (rightHasOrder) return 1;

  const leftTime = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
  const rightTime = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;
  if (leftTime !== rightTime) return rightTime - leftTime;

  return String(left.title || "").localeCompare(String(right.title || ""));
};

/**
 * Homepage marketing cards: prefer Published admin blogs (especially MARKETING)
 * so titles/descriptions/dates match /admin/blogs. Fill remaining slots from
 * other published admin blogs, then static defaults only if still empty.
 */
export const getHomepageInsightCards = () => {
  const adminBlogs = getActiveAdminBlogs();
  const slots = Array.from({ length: HOMEPAGE_CARD_COUNT }, () => null);
  const usedIds = new Set();

  adminBlogs.filter(isHomepageBlog).forEach((blog) => {
    const order = Number(blog.homepageOrder);
    if (!slots[order - 1]) {
      slots[order - 1] = toPublicResource(blog);
      usedIds.add(blog.id);
    }
  });

  const marketingFill = [...adminBlogs]
    .filter(isMarketingBlog)
    .filter((blog) => !usedIds.has(blog.id))
    .sort(sortAdminBlogsForHomepage);

  const otherAdminFill = [...adminBlogs]
    .filter((blog) => !isMarketingBlog(blog) && !usedIds.has(blog.id))
    .sort(sortAdminBlogsForHomepage);

  const fillQueue = [...marketingFill, ...otherAdminFill];

  for (let index = 0; index < HOMEPAGE_CARD_COUNT; index += 1) {
    if (slots[index]) continue;
    const next = fillQueue.shift();
    if (!next) break;
    slots[index] = toPublicResource(next);
    usedIds.add(next.id);
  }

  let defaultIndex = 0;
  for (let index = 0; index < HOMEPAGE_CARD_COUNT; index += 1) {
    if (slots[index]) continue;

    while (defaultIndex < defaultHomeInsights.length) {
      const nextDefault = defaultHomeInsights[defaultIndex];
      defaultIndex += 1;
      if (usedIds.has(nextDefault.id)) continue;
      slots[index] = nextDefault;
      usedIds.add(nextDefault.id);
      break;
    }
  }

  return slots.filter(Boolean);
};

export const getLearnExploreResourcesForTrack = (trackId = "all") => {
  const adminBlogs = getActiveAdminBlogs();
  const homepageIds = new Set(
    adminBlogs.filter(isHomepageBlog).map((blog) => blog.id),
  );

  const staticResources =
    trackId === "all"
      ? learnExploreResources
      : learnExploreResources.filter((resource) => resource.trackId === trackId);

  const trackBlogs = adminBlogs.filter(
    (blog) =>
      !isHomepageBlog(blog) && (trackId === "all" || blog.trackId === trackId),
  );

  const merged = [];
  const seen = new Set();

  staticResources.forEach((resource) => {
    if (homepageIds.has(resource.id)) return;

    const adminVersion = trackBlogs.find((blog) => blog.id === resource.id);
    merged.push(adminVersion ? toPublicResource(adminVersion) : resource);
    seen.add(resource.id);
  });

  trackBlogs.forEach((blog) => {
    if (seen.has(blog.id)) return;
    merged.push(toPublicResource(blog));
    seen.add(blog.id);
  });

  return merged;
};

/** Public /blogs hub: all Published admin blogs + seed content (newest first). */
export const getBlogHubResources = () => {
  const adminBlogs = getActiveAdminBlogs();
  const adminById = new Map(adminBlogs.map((blog) => [blog.id, blog]));

  const staticBlogs = getResourcesByCategory("blogs");
  const merged = [];
  const seen = new Set();

  // Custom / newly created Published blogs first so they are visible immediately.
  [...adminBlogs]
    .sort((left, right) => {
      const leftCustom = left.isCustom ? 1 : 0;
      const rightCustom = right.isCustom ? 1 : 0;
      if (leftCustom !== rightCustom) return rightCustom - leftCustom;

      const leftTime = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
      const rightTime = right.publishedAt
        ? new Date(right.publishedAt).getTime()
        : 0;
      return rightTime - leftTime;
    })
    .forEach((blog) => {
      if (seen.has(blog.id)) return;
      merged.push(toPublicResource(blog));
      seen.add(blog.id);
    });

  staticBlogs.forEach((resource) => {
    if (seen.has(resource.id)) return;

    const adminVersion = adminById.get(resource.id);
    merged.push(adminVersion ? toPublicResource(adminVersion) : resource);
    seen.add(resource.id);
  });

  return merged;
};

export const getPublicResourceById = (resourceId) => {
  if (!resourceId) return null;

  const adminBlog = getActiveAdminBlogs().find((blog) => blog.id === resourceId);
  if (adminBlog) return toPublicResource(adminBlog);

  return learnExploreResources.find((resource) => resource.id === resourceId) || null;
};
