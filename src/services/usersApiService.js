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

export const fetchUsersApi = async () => {
  const response = await fetch(buildApiPath("get-users"));
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to fetch users.");
  return Array.isArray(result.data) ? result.data : [];
};

export const fetchUserByIdApi = async (userId) => {
  const response = await fetch(buildApiPath("get-users", { id: userId }));
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to fetch user.");
  return result.data;
};

export const createUserApi = async (payload) => {
  const response = await fetch(buildApiPath("save-user"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to create user.");
  return result.data;
};

export const updateUserApi = async (payload) => {
  const response = await fetch(buildApiPath("update-user"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to update user.");
  return result.data;
};

export const deleteUserApi = async (userId) => {
  const response = await fetch(buildApiPath("delete-user", { id: userId }), {
    method: "DELETE",
  });
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to delete user.");
  return result.data;
};

export const resetUserPasswordApi = async (userId) => {
  const response = await fetch(buildApiPath("reset-user-password"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: userId, userId }),
  });
  const result = await parseJson(response);
  assertSuccess(response, result, "Failed to reset password.");
  return result.data;
};
