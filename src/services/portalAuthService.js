import { buildApiPath } from "./apiConfig";

const parsePortalAuthResponse = async (response) => {
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(`Server error (${response.status}). Please try again.`);
  }

  if (!response.ok || result.status === "error") {
    throw new Error(result.message || "Invalid email or password.");
  }

  const payload = result.data || result;
  const token = payload.token || result.token;
  if (!token) {
    throw new Error("Login succeeded but no session token was returned.");
  }

  return {
    token,
    user: payload.user || result.user || null,
    role: payload.role || result.role || "",
    permissions: payload.permissions || result.permissions || [],
    expiresAt: payload.expiresAt || result.expiresAt || null,
    portalAudience:
      payload.portalAudience || result.portalAudience || "",
    isAdminPortal: Boolean(
      payload.isAdminPortal ?? result.isAdminPortal ?? false,
    ),
    data: payload,
  };
};

/**
 * Authenticate against the Portal RBAC API (Azure DEV/prod).
 * Returns { token, user, role, permissions, expiresAt } on success.
 */
export const portalLogin = async (email, password) => {
  const response = await fetch(buildApiPath("portal-login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return parsePortalAuthResponse(response);
};

/**
 * Public self-registration as Member; returns the same session shape as portal-login.
 */
export const portalRegister = async ({
  fullName,
  email,
  phone,
  password,
}) => {
  const response = await fetch(buildApiPath("portal-register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName,
      email,
      phone,
      password,
    }),
  });

  return parsePortalAuthResponse(response);
};
