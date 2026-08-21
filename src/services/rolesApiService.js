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
    throw new Error(result.message || fallbackMessage || `Server returned ${response.status}.`);
  }
};

export const fetchRolesApi = async () => {
  const response = await fetch(buildApiPath("get-roles"));
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to fetch roles.");
  return Array.isArray(result.data) ? result.data : [];
};

export const fetchRoleByIdApi = async (roleId) => {
  const response = await fetch(buildApiPath("get-roles", { id: roleId }));
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to fetch role.");
  return result.data;
};

export const createRoleApi = async (payload) => {
  const response = await fetch(buildApiPath("save-role"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to create role.");
  return result.data;
};

export const updateRoleApi = async (payload) => {
  const response = await fetch(buildApiPath("update-role"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to update role.");
  return result.data;
};

export const deleteRoleApi = async (roleId) => {
  const response = await fetch(buildApiPath("delete-role", { id: roleId }), {
    method: "DELETE",
  });
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to delete role.");
  return result.data;
};
