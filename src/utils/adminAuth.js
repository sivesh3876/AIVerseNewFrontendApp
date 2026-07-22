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

export const getAdminSession = () => {
  const session = readSession();
  if (!session?.email || !session?.expiresAt) {
    return null;
  }

  if (Date.now() > session.expiresAt) {
    clearAdminSession();
    return null;
  }

  // Older sessions may not have token/name — refresh them in place.
  if (!session.token || !session.name) {
    return createAdminSession(session.email);
  }

  return session;
};

export const isAdminAuthenticated = () => Boolean(getAdminSession());

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
    token: `aiverse.${btoa(unescape(encodeURIComponent(`${normalizedEmail}:${Date.now()}`)))}.${Math.random()
      .toString(36)
      .slice(2, 10)}`,
    loggedInAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  return session;
};

export const getAdminAuthToken = () => getAdminSession()?.token || "";

export const clearAdminSession = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
};
