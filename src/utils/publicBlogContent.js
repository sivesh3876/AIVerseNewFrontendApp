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

export const getBlogHubResources = () => {
  const adminBlogs = getActiveAdminBlogs().filter((blog) => !isHomepageBlog(blog));
  const homepageIds = new Set(
    getActiveAdminBlogs().filter(isHomepageBlog).map((blog) => blog.id),
  );

  const staticBlogs = getResourcesByCategory("blogs").filter(
    (resource) => !homepageIds.has(resource.id),
  );

  const merged = [];
  const seen = new Set();

  staticBlogs.forEach((resource) => {
    const adminVersion = adminBlogs.find((blog) => blog.id === resource.id);
    merged.push(adminVersion ? toPublicResource(adminVersion) : resource);
    seen.add(resource.id);
  });

  adminBlogs.forEach((blog) => {
    if (seen.has(blog.id)) return;
    merged.push(toPublicResource(blog));
  });

  return merged;
};

export const getPublicResourceById = (resourceId) => {
  if (!resourceId) return null;

  const adminBlog = getActiveAdminBlogs().find((blog) => blog.id === resourceId);
  if (adminBlog) return toPublicResource(adminBlog);

  return learnExploreResources.find((resource) => resource.id === resourceId) || null;
};
