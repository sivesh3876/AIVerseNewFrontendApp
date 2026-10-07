import { fetchAuthenticatedUser } from "../services/authUserService";
import { hasCompletedRegistration } from "./registrationStatusStorage";

/**
 * Synchronous fast path — registration form completion only.
 */
export const hasSyncAppAccess = () => hasCompletedRegistration();

/**
 * Resolve whether the visitor may access registration-protected app pages /
 * full Home. Granted via:
 * - successful Registration form completion, or
 * - Azure Easy Auth (`/.auth/me`) profile with email
 *
 * Admin portal session alone does NOT grant end-user access.
 *
 * @returns {Promise<'granted' | 'denied'>}
 */
export const resolveAppAccess = async ({ forceRefresh = false } = {}) => {
  if (hasCompletedRegistration()) {
    return "granted";
  }

  try {
    const user = await fetchAuthenticatedUser({
      forceRefresh,
      allowAdminFallback: false,
    });
    if (user?.email) {
      return "granted";
    }
  } catch {
    // Treat auth lookup failures as denied for end-user routes.
  }

  return "denied";
};
