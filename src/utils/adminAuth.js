import { portalLogin } from "../services/portalAuthService";

const ADMIN_SESSION_KEY = "aiVerseAdminSession";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

const parseAdminEmails = (value = "") =>
  String(value)
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const getAdminCredentials = () => {
  const emailsRaw =
    import.meta.env.VITE_ADMIN_EMAILS ||
    import.meta.env.VITE_ADMIN_EMAIL ||
    "sakshi@espire.com,admin@aiverse.com";

  return {
    emails: parseAdminEmails(emailsRaw),
    password: String(import.meta.env.VITE_ADMIN_PASSWORD || "Reset@ma456").trim(),
  };
};

export const validateAdminCredentials = (email, password) => {
  const credentials = getAdminCredentials();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "").trim();

  return (
    credentials.emails.includes(normalizedEmail) &&
    normalizedPassword === credentials.password
  );
};

const readSession = () => {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persistSession = (session) => {
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  return session;
};

export const getAdminSession = () => {
  const session = readSession();
  if (!session?.email || !session?.expiresAt) {
    return null;
  }

  if (Date.now() > session.expiresAt) {
    clearAdminSession();
    return null;
  }

  if (!session.token || !session.name) {
    return createLocalAdminSession(session.email);
  }

  return session;
};

export const isAdminAuthenticated = () => Boolean(getAdminSession());

/** Local-only session (anonymous backend / offline). Fake token is NOT valid on Azure RBAC. */
export const createLocalAdminSession = (email) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const localName = normalizedEmail.split("@")[0] || "Admin";
  const displayName = localName
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const session = {
    email: normalizedEmail,
    name: displayName || "Admin",
    token: `aiverse.${btoa(unescape(encodeURIComponent(`${normalizedEmail}:${Date.now()}`)))}.${Math.random()
      .toString(36)
      .slice(2, 10)}`,
    source: "local",
    loggedInAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  return persistSession(session);
};

/** Prefer this name for callers that previously used createAdminSession. */
export const createAdminSession = createLocalAdminSession;

export const createPortalAdminSession = (email, portalResult) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = portalResult?.user || {};
  const name =
    user.FullName ||
    user.fullName ||
    user.Name ||
    user.name ||
    normalizedEmail.split("@")[0] ||
    "Admin";

  let expiresAt = Date.now() + SESSION_DURATION_MS;
  if (portalResult?.expiresAt) {
    const parsed = Date.parse(portalResult.expiresAt);
    if (!Number.isNaN(parsed)) {
      expiresAt = parsed;
    }
  }

  const session = {
    email: normalizedEmail,
    name,
    token: portalResult.token,
    source: "portal",
    role: portalResult.role || "",
    permissions: portalResult.permissions || [],
    loggedInAt: Date.now(),
    expiresAt,
  };

  return persistSession(session);
};

/**
 * Login: try Azure/local portal-login first (RBAC). If the endpoint is missing
 * (anonymous local Functions), fall back to env credential check.
 */
export const loginAdmin = async (email, password) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "").trim();

  try {
    const portalResult = await portalLogin(normalizedEmail, normalizedPassword);
    const session = createPortalAdminSession(normalizedEmail, portalResult);
    return { success: true, session };
  } catch (error) {
    const message = String(error?.message || "");
    const isMissingEndpoint =
      /404|not found|failed to fetch|networkerror|load failed/i.test(message) ||
      message.includes("Server error (404)");

    if (!isMissingEndpoint) {
      // Real auth rejection from portal-login — do not fall back to fake token.
      return {
        success: false,
        message: message || "Invalid email or password.",
      };
    }
  }

  if (!validateAdminCredentials(normalizedEmail, normalizedPassword)) {
    return { success: false, message: "Invalid email or password." };
  }

  const session = createLocalAdminSession(normalizedEmail);
  return { success: true, session };
};

export const getAdminAuthToken = () => getAdminSession()?.token || "";

/** Headers for Admin Portal APIs that require Bearer tokens on Azure DEV/prod. */
export const getAdminAuthHeaders = (extra = {}) => {
  const token = getAdminAuthToken();
  if (!token) {
    return { ...extra };
  }
  return {
    ...extra,
    Authorization: `Bearer ${token}`,
  };
};

export const clearAdminSession = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
};
