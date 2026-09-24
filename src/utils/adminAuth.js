const ADMIN_SESSION_KEY = "aiVerseAdminSession";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

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
  const session = {
    email: String(user.email || payload.email || "").trim().toLowerCase(),
    name: user.fullName || user.name || payload.name || "Admin",
    token: payload.token || "",
    role: payload.role || user.role || user.roleName || "",
    roleId: user.roleId ?? payload.roleId ?? null,
    permissions,
    userId: user.id ?? user.apiId ?? payload.userId ?? null,
    loggedInAt: Number(payload.loggedInAt) || Date.now(),
    expiresAt: parsedExpiresAt || Date.now() + SESSION_DURATION_MS,
  };

  if (!session.email || !session.token) {
    throw new Error("The login response did not include a valid admin session.");
  }

  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
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
};
