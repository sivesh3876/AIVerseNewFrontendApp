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

const toExpiresAtMs = (value) => {
  if (value == null || value === "") {
    return Date.now() + SESSION_DURATION_MS;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const parsed = Date.parse(String(value));
  return Number.isNaN(parsed) ? Date.now() + SESSION_DURATION_MS : parsed;
};

export const getAdminSession = () => {
  const session = readSession();
  if (!session?.email || !session?.token || !session?.expiresAt) {
    if (session) {
      clearAdminSession();
    }
    return null;
  }

  if (Date.now() > session.expiresAt) {
    clearAdminSession();
    return null;
  }

  return session;
};

export const isAdminAuthenticated = () => Boolean(getAdminSession());

export const persistAdminSessionFromPortal = (portalResult = {}) => {
  const user = portalResult.user || {};
  const email = String(
    user.Email || user.email || portalResult.email || "",
  )
    .trim()
    .toLowerCase();
  const token = String(portalResult.token || "").trim();

  if (!email || !token) {
    throw new Error("Portal login did not return a valid session.");
  }

  const nameFromUser =
    user.FullName || user.fullName || user.Name || user.name || "";
  const localName = email.split("@")[0] || "Admin";
  const displayName =
    String(nameFromUser).trim() ||
    localName
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") ||
    "Admin";

  const session = {
    email,
    name: displayName,
    token,
    role: portalResult.role || "",
    permissions: Array.isArray(portalResult.permissions)
      ? portalResult.permissions
      : [],
    loggedInAt: Date.now(),
    expiresAt: toExpiresAtMs(portalResult.expiresAt),
  };

  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  return session;
};

/** @deprecated Use persistAdminSessionFromPortal — local tokens are not accepted by the API. */
export const createAdminSession = (email) => {
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
    token: "",
    loggedInAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  return session;
};

export const getAdminAuthToken = () => getAdminSession()?.token || "";

export const getAdminAuthHeaders = () => {
  const token = getAdminAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const clearAdminSession = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
};
