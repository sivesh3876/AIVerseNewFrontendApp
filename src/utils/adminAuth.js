import { getAdminLandingPath } from "./adminLanding";

const ADMIN_SESSION_KEY = "aiVerseAdminSession";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

/** Same-tab notify when portal session is written/cleared (storage event is cross-tab only). */
export const PORTAL_SESSION_CHANGED_EVENT = "aiverse:portal-session-changed";

export const notifyPortalSessionChanged = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PORTAL_SESSION_CHANGED_EVENT));
};

/** Backend Member role (portal self-registration) — not an Admin Portal role. */
export const isMemberRole = (role) =>
  String(role || "")
    .trim()
    .toLowerCase() === "member";

const readSession = () => {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getAdminSession = () => {
  const session = readSession();
  if (!session?.email || !session?.token || !session?.expiresAt) {
    return null;
  }

  if (Date.now() > session.expiresAt) {
    clearAdminSession();
    return null;
  }

  return {
    ...session,
    permissions: Array.isArray(session.permissions) ? session.permissions : [],
  };
};

export const isAdminAuthenticated = () => Boolean(getAdminSession());

/**
 * True when the portal session may enter Admin routes.
 * Prefers backend portalAudience; Member is never allowed even with view permissions.
 */
export const canAccessAdminPortal = (session = getAdminSession()) => {
  if (!session?.token) return false;
  const audience = String(session.portalAudience || "")
    .trim()
    .toLowerCase();
  if (audience === "member") return false;
  if (isMemberRole(session.role)) return false;
  return Boolean(getAdminLandingPath(session.permissions || []));
};

/**
 * Backend portalAudience / isAdminPortal with fallback for older sessions.
 * Used for post-login Home vs Admin Dashboard routing.
 */
export const isAdminPortalSession = (session = getAdminSession()) => {
  if (!session?.token) return false;
  const audience = String(session.portalAudience || "")
    .trim()
    .toLowerCase();
  if (audience === "member") return false;
  if (audience === "admin" || session.isAdminPortal === true) {
    return Boolean(getAdminLandingPath(session.permissions || []));
  }
  return canAccessAdminPortal(session);
};

export const createAdminSessionFromLogin = (result = {}) => {
  const payload = result.data && typeof result.data === "object"
    ? result.data
    : result;
  const user = payload.user || {};
  const permissions = Array.isArray(payload.permissions)
    ? payload.permissions
    : Array.isArray(user.permissions)
      ? user.permissions
      : [];
  const parsedExpiresAt = Number(payload.expiresAt) ||
    Date.parse(payload.expiresAt || "");
  const roleName = payload.role || user.role || user.roleName || "";
  let portalAudience = String(
    payload.portalAudience || result.portalAudience || "",
  )
    .trim()
    .toLowerCase();
  if (!portalAudience) {
    portalAudience = isMemberRole(roleName) ? "member" : "";
  }
  const isAdminPortal =
    portalAudience === "admin" ||
    (portalAudience !== "member" &&
      (payload.isAdminPortal === true || result.isAdminPortal === true));
  const session = {
    email: String(user.email || payload.email || "").trim().toLowerCase(),
    name: user.fullName || user.name || payload.name || "Admin",
    token: payload.token || "",
    role: roleName,
    roleId: user.roleId ?? payload.roleId ?? null,
    permissions,
    userId: user.id ?? user.apiId ?? payload.userId ?? null,
    portalAudience,
    isAdminPortal,
    loggedInAt: Number(payload.loggedInAt) || Date.now(),
    expiresAt: parsedExpiresAt || Date.now() + SESSION_DURATION_MS,
  };

  if (!session.email || !session.token) {
    throw new Error("The login response did not include a valid admin session.");
  }

  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  notifyPortalSessionChanged();
  return session;
};

export const getAdminAuthToken = () => getAdminSession()?.token || "";

const normalizeRequiredPermissions = (permissionId) =>
  (Array.isArray(permissionId) ? permissionId : [permissionId]).filter(Boolean);

export const hasPermission = (permissionId, session = getAdminSession()) => {
  const required = normalizeRequiredPermissions(permissionId);
  return required.length > 0 &&
    required.every((permission) => session?.permissions?.includes(permission));
};

export const hasAnyPermission = (permissionId, session = getAdminSession()) => {
  const required = normalizeRequiredPermissions(permissionId);
  return required.length > 0 &&
    required.some((permission) => session?.permissions?.includes(permission));
};

export const clearAdminSession = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  notifyPortalSessionChanged();
};
