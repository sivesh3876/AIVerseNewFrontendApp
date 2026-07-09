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

  return session;
};

export const isAdminAuthenticated = () => Boolean(getAdminSession());

export const createAdminSession = (email) => {
  const session = {
    email: String(email).trim().toLowerCase(),
    loggedInAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  return session;
};

export const clearAdminSession = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
};
