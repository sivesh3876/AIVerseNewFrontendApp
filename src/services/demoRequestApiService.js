import { buildApiPath } from "./apiConfig";

const EMAIL_API_KEY = import.meta.env.VITE_EMAIL_API_KEY || "";

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const withApiKey = (endpoint, query = {}) =>
  buildApiPath(endpoint, {
    ...query,
    ...(EMAIL_API_KEY ? { code: EMAIL_API_KEY } : {}),
  });

export const updateDemoRequestApi = async (demoId, updates = {}) => {
  const numericId = Number(String(demoId).replace(/^api-/, ""));
  if (!Number.isFinite(numericId) || numericId <= 0) {
    return null;
  }

  const response = await fetch(withApiKey("update-demo-request"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: numericId,
      ID: numericId,
      ...updates,
    }),
  });

  const result = await parseJson(response);
  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Failed to update demo request.");
  }

  return result.data;
};
