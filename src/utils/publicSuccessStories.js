import { homeCarouselStories } from "../components/SuccessStories/successStoriesData";
import { fetchSuccessStories } from "../services/successStoriesApiService";
import { normalizeSuccessStory } from "./successStoryAdminUtils";

const isPublishedStory = (story) => {
  const status =
    story?.status ??
    story?.Status ??
    story?.recordStatus ??
    story?.PublicationStatus;
  return !status || String(status).toLowerCase() === "published";
};

const storyKey = (story) => {
  const slug = String(story?.slug || "").trim().toLowerCase();
  if (slug) return `slug:${slug}`;
  const id = String(story?.id || "").trim().toLowerCase();
  if (id) return `id:${id}`;
  return "";
};

const storySortValue = (story) => {
  const value =
    story?.publishedAt ||
    story?.createdAt ||
    story?.createdDate ||
    story?.CreatedDate ||
    story?.id ||
    0;
  const time = new Date(value).getTime();
  if (!Number.isNaN(time) && time > 0) return time;
  const numericId = Number(story?.id);
  return Number.isFinite(numericId) ? numericId : 0;
};

const sortNewestFirst = (stories) =>
  [...stories].sort((left, right) => storySortValue(right) - storySortValue(left));

const toCarouselStory = (story) => {
  const normalized = normalizeSuccessStory(story);
  return {
    ...story,
    ...normalized,
    industryTag:
      normalized.industryTag ||
      story.industryTag ||
      story.industry ||
      normalized.industry ||
      "",
    description:
      normalized.description ||
      story.description ||
      story.shortDescription ||
      "",
    statValue:
      normalized.statValue || story.statValue || story.keyMetric || "",
    statLabel:
      normalized.statLabel ||
      story.statLabel ||
      story.metricDescription ||
      story.metric ||
      "",
    slug: normalized.slug || story.slug || story.id || "",
  };
};

/**
 * Homepage carousel stories: static catalog (8) with published API overlays.
 * API failures still return the static catalog so the section never empties.
 */
export const loadHomeSuccessStories = async () => {
  const baseStories = homeCarouselStories.map(toCarouselStory);
  const byKey = new Map();

  baseStories.forEach((story) => {
    const key = storyKey(story);
    if (key) byKey.set(key, story);
  });

  try {
    const data = await fetchSuccessStories({ includeUnpublished: false });
    const rows = Array.isArray(data)
      ? data
      : data?.items ?? data?.stories ?? data?.data ?? [];

    const apiStories = rows
      .filter(isPublishedStory)
      .map(toCarouselStory);

    const extras = [];

    apiStories.forEach((apiStory) => {
      const key = storyKey(apiStory);
      if (key && byKey.has(key)) {
        byKey.set(key, { ...byKey.get(key), ...apiStory });
        return;
      }
      extras.push(apiStory);
    });

    return sortNewestFirst([
      ...baseStories.map((story) => {
        const key = storyKey(story);
        return (key && byKey.get(key)) || story;
      }),
      ...extras,
    ]);
  } catch {
    return sortNewestFirst(baseStories);
  }
};
