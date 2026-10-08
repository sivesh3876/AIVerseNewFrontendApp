/**
 * Paths that unregistered visitors may open without registration.
 * Everything else (except admin, which uses its own auth) is protected.
 */

const PUBLIC_EXACT = new Set([
  "/",
  "/admin/login",
  "/ai-readiness-assessment",
]);

/** Prefixes that are public including nested paths (e.g. /explore-solutions/:id). */
const PUBLIC_PREFIXES = ["/explore-solutions"];

/**
 * True when pathname is publicly accessible without registration.
 * Admin routes (except login) are not "public" for registration purposes —
 * they use ProtectedAdminRoute instead.
 */
export const isPublicPath = (pathname = "") => {
  const path = String(pathname || "").split("?")[0].split("#")[0] || "/";

  if (PUBLIC_EXACT.has(path)) return true;

  for (const prefix of PUBLIC_PREFIXES) {
    if (path === prefix || path.startsWith(`${prefix}/`)) return true;
  }

  return false;
};

/**
 * True when the path requires registration (or Easy Auth) for end users.
 * Admin tooling (`/admin/*`, `/get-started`) is excluded — handled by admin auth.
 */
export const isRegistrationProtectedPath = (pathname = "") => {
  const path = String(pathname || "").split("?")[0].split("#")[0] || "/";

  if (path.startsWith("/admin")) return false;
  if (path === "/get-started") return false;
  if (isPublicPath(path)) return false;

  return true;
};

/** After registration with no pending protected return URL, show full Home. */
export const DEFAULT_POST_REGISTRATION_PATH = "/";
