import { fetchAuthenticatedUser } from "../services/authUserService";
import { getAdminSession } from "./adminAuth";
import { hasCompletedRegistration } from "./registrationStatusStorage";

/**
 * Synchronous fast path — registration completion or portal session.
 */
export const hasSyncAppAccess = () =>
  hasCompletedRegistration() || Boolean(getAdminSession()?.token);

/**
 * Resolve whether the visitor may access registration-protected app pages /
 * full Home. Granted via:
 * - successful Registration / Login form completion, or
 * - valid portal session (Member or Admin), or
 * - Azure Easy Auth (`/.auth/me`) profile with email
 *
 * @returns {Promise<'granted' | 'denied'>}
 */
export const resolveAppAccess = async ({ forceRefresh = false } = {}) => {
  if (hasCompletedRegistration()) {
    return "granted";
  }

  if (getAdminSession()?.token) {
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
