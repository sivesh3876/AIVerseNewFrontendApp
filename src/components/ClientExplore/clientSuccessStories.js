const CLIENT_STORY_KEYWORDS = {
  "hh-global": ["hh global"],
  "the-dispute-service": ["dispute service", "tds"],
  canopius: ["canopius", "vave"],
  culina: ["culina", "cullina"],
  inspereX: ["insperex", "inspera"],
  "publicis-groupe": ["publicis"],
};

const normalize = (value = "") => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const storyMatchesClient = (story, client, linkedStoryIds) => {
  if (
    linkedStoryIds.has(story.id) ||
    linkedStoryIds.has(story.slug) ||
    linkedStoryIds.has(story.apiId)
  ) {
    return true;
  }

  const keywords =
    CLIENT_STORY_KEYWORDS[client.id] ??
    client.name
      .split("(")[0]
      .split(/[,/&]/)
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean);

  const storyClient = normalize(story.client);

  return keywords.some((keyword) => {
    const normalizedKeyword = normalize(keyword);
    return (
      storyClient.includes(normalizedKeyword) ||
      normalizedKeyword.includes(storyClient)
    );
  });
};

export const getSuccessStoriesForClient = (client, stories = []) => {
  if (!client) return [];

  const linkedStoryIds = new Set(
    (client.pocs ?? [])
      .map((poc) => poc.storyId)
      .filter(Boolean),
  );

  const matched = stories.filter((story) =>
    storyMatchesClient(story, client, linkedStoryIds),
  );

  const seen = new Set();
  return matched.filter((story) => {
    if (seen.has(story.id)) return false;
    seen.add(story.id);
    return true;
  });
};

export const getStandaloneClientPocs = (client, stories = []) => {
  const linkedStoryIds = new Set(stories.map((story) => story.id));

  return (client.pocs ?? []).filter(
    (poc) => !poc.storyId || !linkedStoryIds.has(poc.storyId),
  );
};
