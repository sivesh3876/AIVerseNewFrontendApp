import { buildApiPath } from "./apiConfig";

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const assertSuccess = (response, result, fallbackMessage) => {
  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || fallbackMessage);
  }
};

export const fetchSuccessStories = async ({
  includeUnpublished = false,
} = {}) => {
  const response = await fetch(
    buildApiPath(
      "get-success-stories",
      includeUnpublished ? { include_unpublished: "true" } : {},
    ),
  );
  const result = await parseJson(response);

  assertSuccess(response, result, "Failed to fetch success stories.");
  if (!Array.isArray(result.data)) {
    throw new Error("The success stories response was invalid.");
  }
  return result.data;
};

export const fetchSuccessStory = async ({
  id,
  slug,
  includeUnpublished = false,
} = {}) => {
  if (!id && !slug) {
    throw new Error("A success story ID or slug is required.");
  }

  const response = await fetch(
    buildApiPath("get-success-stories", {
      id,
      slug,
      include_unpublished: includeUnpublished ? "true" : "",
    }),
  );
  const result = await parseJson(response);

  assertSuccess(response, result, "Failed to fetch the success story.");
  if (!result.data) {
    throw new Error("Success story not found.");
  }
  return Array.isArray(result.data) ? result.data[0] : result.data;
};

const sendMultipart = async (endpoint, formData, method) => {
  const response = await fetch(buildApiPath(endpoint), {
    method,
    body: formData,
  });
  const result = await parseJson(response);

  assertSuccess(response, result, `Failed to ${method === "POST" ? "create" : "update"} success story.`);
  return result.data;
};

export const createSuccessStory = (formData) =>
  sendMultipart("save-success-story", formData, "POST");

export const updateSuccessStory = (formData) =>
  sendMultipart("update-success-story", formData, "PUT");

export const updateSuccessStoryStatus = async (storyId, status) => {
  const response = await fetch(buildApiPath("update-success-story-status"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: storyId, status }),
  });
  const result = await parseJson(response);

  assertSuccess(response, result, "Failed to update success story status.");
  return result.data;
};

export const deleteSuccessStory = async (storyId) => {
  const response = await fetch(
    buildApiPath("delete-success-story", { id: storyId }),
    { method: "DELETE" },
  );
  const result = await parseJson(response);

  assertSuccess(response, result, "Failed to delete success story.");
  return result.data;
};

export const incrementSuccessStoryView = async (
  storyIdOrSlug,
  visitorToken,
) => {
  if (!storyIdOrSlug) return null;

  const response = await fetch(buildApiPath("increment-success-story-view"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: storyIdOrSlug,
      apiId: storyIdOrSlug,
      storyId: storyIdOrSlug,
      story_id: storyIdOrSlug,
      slug: storyIdOrSlug,
      visitorToken,
      visitor_token: visitorToken,
    }),
  });
  const result = await parseJson(response);

  assertSuccess(response, result, "Failed to update success story views.");
  return result.data;
};
