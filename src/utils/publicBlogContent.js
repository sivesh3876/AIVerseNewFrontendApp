import {
  getResourcesByCategory,
  homeInsights as defaultHomeInsights,
  learnExploreResources,
} from "../components/LearnExplore/learnExploreData";
import { loadAdminBlogs } from "./adminBlogStorage";
import { stripHtml } from "./htmlContent";

export const HOMEPAGE_CARD_COUNT = 6;

export const BLOG_BADGE_COLORS = {
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

export const getHomepageInsightCards = () => {
  const homepageBlogs = getActiveAdminBlogs().filter(isHomepageBlog);
  const slots = Array.from({ length: HOMEPAGE_CARD_COUNT }, () => null);

  homepageBlogs.forEach((blog) => {
    slots[Number(blog.homepageOrder) - 1] = toPublicResource(blog);
  });

  let defaultIndex = 0;
  for (let index = 0; index < HOMEPAGE_CARD_COUNT; index += 1) {
    if (!slots[index] && defaultHomeInsights[defaultIndex]) {
      slots[index] = defaultHomeInsights[defaultIndex];
      defaultIndex += 1;
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
