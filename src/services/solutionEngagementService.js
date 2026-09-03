import { getUsecasesApiBaseUrl } from "./usecasesService";

const API_BASE_URL = getUsecasesApiBaseUrl();

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const assertSuccess = (response, result, fallbackMessage) => {
  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || fallbackMessage || `Server returned ${response.status}.`);
  }
};

const postJsonWithoutPreflight = async (endpoint, payload) => {
  return fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify(payload),
  });
};

export const fetchSolutionEngagement = async (solutionKey, visitorToken) => {
  const params = new URLSearchParams({ solutionKey });
  if (visitorToken) {
    params.set("visitorToken", visitorToken);
  }

  const response = await fetch(`${API_BASE_URL}/get-solution-engagement?${params.toString()}`);
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to load engagement data.");
  return result.data;
};

export const toggleSolutionLikeApi = async (payload) => {
  const response = await postJsonWithoutPreflight("solution-engagement-like", payload);
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to update like.");
  return result.data;
};

export const addSolutionCommentApi = async (payload) => {
  const response = await postJsonWithoutPreflight("solution-engagement-comment", payload);
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to save comment.");
  return result.data;
};

export const recordSolutionShareApi = async (payload) => {
  const response = await postJsonWithoutPreflight("solution-engagement-share", payload);
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to record share.");
  return result.data;
};

export const recordSolutionViewApi = async (payload) => {
  const response = await postJsonWithoutPreflight("solution-engagement-view", payload);
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to record view.");
  return result.data;
};

export const fetchSolutionEngagementSummary = async (limit = 100) => {
  const response = await fetch(
    `${API_BASE_URL}/get-solution-engagement-summary?limit=${encodeURIComponent(limit)}`,
  );
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to load engagement summary.");
  return result.data;
};
