import { buildApiPath } from "./apiConfig";

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const fetchBlogs = async ({ includeUnpublished = false } = {}) => {
  const response = await fetch(
    buildApiPath(
      "get-blogs",
      includeUnpublished ? { include_unpublished: "true" } : {},
    ),
  );
  const result = await parseJson(response);

  if (!response.ok || result.status !== "success" || !Array.isArray(result.data)) {
    throw new Error(result.message || "Failed to fetch blogs");
  }

  return result.data;
};

export const createBlog = async (payload = {}) => {
  const response = await fetch(buildApiPath("save-blog"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await parseJson(response);

  if (!response.ok || result.status !== "success" || !result.data) {
    throw new Error(result.message || "Failed to create blog");
  }

  return result.data;
};

export const updateBlog = async (payload = {}) => {
  const response = await fetch(buildApiPath("update-blog"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await parseJson(response);

  if (!response.ok || result.status !== "success" || !result.data) {
    throw new Error(result.message || "Failed to update blog");
  }

  return result.data;
};

export const deleteBlog = async (blogId) => {
  const response = await fetch(
    buildApiPath("delete-blog", { id: blogId }),
    { method: "DELETE" },
  );
  const result = await parseJson(response);

  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Failed to delete blog");
  }

  return result.data;
};
