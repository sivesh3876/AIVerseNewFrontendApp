const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/** Common mistyped email domains that should not submit. */
const BLOCKED_EMAIL_DOMAINS = new Set([
  "gnail.com",
  "gmial.com",
  "gmal.com",
  "gamil.com",
  "gmai.com",
  "hotmial.com",
  "hotmal.com",
  "yaho.com",
  "yahooo.com",
  "outlok.com",
  "outloo.com",
  "icloud.con",
  "gmail.con",
  "gmail.co",
]);

export const normalizePhoneDigits = (value = "") =>
  String(value).replace(/\D/g, "");

/**
 * Valid contact number: optional +, digits only after strip, 10–15 digits.
 */
export const isValidPhone = (value = "") => {
  const trimmed = String(value).trim();
  if (!trimmed) return false;

  // Allow digits, spaces, dashes, parentheses, and a leading +
  if (!/^\+?[\d\s().-]+$/.test(trimmed)) return false;

  const digits = normalizePhoneDigits(trimmed);
  return digits.length >= 10 && digits.length <= 15;
};

/**
 * Stricter email check + blocked typo domains (e.g. gnail.com).
 */
export const isValidEmail = (value = "") => {
  const email = String(value).trim().toLowerCase();
  if (!email || email.includes(" ")) return false;
  if ((email.match(/@/g) || []).length !== 1) return false;
  if (!EMAIL_RE.test(email)) return false;

  const domain = email.split("@")[1] || "";
  if (BLOCKED_EMAIL_DOMAINS.has(domain)) return false;

  const tld = domain.split(".").pop() || "";
  if (tld.length < 2) return false;

  return true;
};

export const EMAIL_VALIDATION_MESSAGE = "Enter a valid email address";
export const PHONE_VALIDATION_MESSAGE =
  "Enter a valid phone number (10–15 digits)";
