import { getAdminSession } from "../utils/adminAuth";

const AUTH_ME_URL = "/.auth/me";

const CLAIM_TYPES = {
  name: [
    "name",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
  ],
  email: [
    "preferred_username",
    "email",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
    "upn",
  ],
};

let cachedUser = null;
let cachedUserPromise = null;

const readClaim = (claims, types) => {
  if (!Array.isArray(claims)) {
    return "";
  }

  for (const type of types) {
    const match = claims.find(
      (claim) => claim?.typ === type || claim?.type === type,
    );
    const value = match?.val ?? match?.value;
    if (value) {
      return String(value).trim();
    }
  }

  return "";
};

const normalizeAuthProfile = (profile) => {
  if (!profile) {
    return null;
  }

  const claims = profile.user_claims || profile.claims || [];
  const name = readClaim(claims, CLAIM_TYPES.name);
  const email = readClaim(claims, CLAIM_TYPES.email);

  if (!name && !email) {
    return null;
  }

  return {
    name: name || email.split("@")[0] || "User",
    email,
    userId: profile.user_id || profile.userId || "",
  };
};

const userFromAdminSession = () => {
  const session = getAdminSession();
  if (!session?.email) {
    return null;
  }

  return {
    name: session.name || session.email.split("@")[0] || "User",
    email: session.email,
    userId: session.email,
  };
};

const isLocalDevHost = () => {
  if (typeof window === "undefined") {
    return Boolean(import.meta.env.DEV);
  }

  const host = window.location.hostname;
  return (
    import.meta.env.DEV ||
    host === "localhost" ||
    host === "127.0.0.1"
  );
};

const toRelativeReturnUrl = (redirectUri) => {
  if (!redirectUri) {
    return "/";
  }

  try {
    if (redirectUri.startsWith("http://") || redirectUri.startsWith("https://")) {
      const url = new URL(redirectUri);
      return `${url.pathname}${url.search}${url.hash}` || "/";
    }
  } catch {
    return "/";
  }

  if (redirectUri.startsWith("/")) {
    return redirectUri;
  }

  return "/";
};

export const getLoginUrl = (redirectUri = window.location.href) => {
  if (typeof window === "undefined") {
    return "/admin/login";
  }

  if (isLocalDevHost()) {
    const returnUrl = toRelativeReturnUrl(redirectUri);
    return `/admin/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  }

  return `/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(redirectUri)}`;
};

export const fetchAuthenticatedUser = async ({ forceRefresh = false } = {}) => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!forceRefresh && cachedUser) {
    return cachedUser;
  }

  if (!forceRefresh && cachedUserPromise) {
    return cachedUserPromise;
  }

  cachedUserPromise = (async () => {
    try {
      const response = await fetch(AUTH_ME_URL, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const payload = await response.json();
        const profile = Array.isArray(payload) ? payload[0] : payload;
        const authUser = normalizeAuthProfile(profile);
        if (authUser) {
          cachedUser = authUser;
          return cachedUser;
        }
      }
    } catch {
      // Fall through to admin session.
    }

    cachedUser = userFromAdminSession();
    return cachedUser;
  })().finally(() => {
    cachedUserPromise = null;
  });

  return cachedUserPromise;
};
