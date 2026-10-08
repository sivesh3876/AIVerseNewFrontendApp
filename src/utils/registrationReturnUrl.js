const RETURN_URL_KEY = "aiverse_registration_return_url";

const sanitizeReturnUrl = (value) => {
  if (!value || typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return "";
  if (trimmed.startsWith("//")) return "";

  return trimmed;
};

export const getRegistrationReturnUrl = () => {
  try {
    return sanitizeReturnUrl(sessionStorage.getItem(RETURN_URL_KEY) || "");
  } catch {
    return "";
  }
};

export const setRegistrationReturnUrl = (url) => {
  const safe = sanitizeReturnUrl(url);
  if (!safe) return;

  try {
    sessionStorage.setItem(RETURN_URL_KEY, safe);
  } catch {
    // Ignore private-mode / quota errors.
  }
};

export const clearRegistrationReturnUrl = () => {
  try {
    sessionStorage.removeItem(RETURN_URL_KEY);
  } catch {
    // Ignore storage errors.
  }
};
