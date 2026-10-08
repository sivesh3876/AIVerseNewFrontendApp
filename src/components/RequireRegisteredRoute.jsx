import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRegistrationReminder } from "../context/RegistrationReminderContext";
import { hasSyncAppAccess, resolveAppAccess } from "../utils/appAccess";
import { PORTAL_SESSION_CHANGED_EVENT } from "../utils/adminAuth";
import {
  REGISTRATION_COMPLETED_EVENT,
} from "../utils/registrationStatusStorage";
import { setRegistrationReturnUrl } from "../utils/registrationReturnUrl";

/**
 * Blocks registration-protected pages until the visitor has app access via:
 * registration completion, portal session (Login-first), or Easy Auth.
 * Opens the existing RegisterModal and stores a return URL.
 */
const RequireRegisteredRoute = ({ children }) => {
  const location = useLocation();
  const { openRegisterModal } = useRegistrationReminder();
  const [access, setAccess] = useState(() =>
    hasSyncAppAccess() ? "granted" : "loading",
  );

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (hasSyncAppAccess()) {
        if (!cancelled) setAccess("granted");
        return;
      }

      if (!cancelled) setAccess("loading");
      const next = await resolveAppAccess({ forceRefresh: true });
      if (!cancelled) setAccess(next);
    };

    check();

    const onAccessGranted = () => {
      if (!cancelled && hasSyncAppAccess()) setAccess("granted");
    };

    window.addEventListener(REGISTRATION_COMPLETED_EVENT, onAccessGranted);
    window.addEventListener(PORTAL_SESSION_CHANGED_EVENT, onAccessGranted);

    return () => {
      cancelled = true;
      window.removeEventListener(REGISTRATION_COMPLETED_EVENT, onAccessGranted);
      window.removeEventListener(PORTAL_SESSION_CHANGED_EVENT, onAccessGranted);
    };
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (access !== "denied") return;

    const returnUrl = `${location.pathname}${location.search}${location.hash}`;
    setRegistrationReturnUrl(returnUrl);
    openRegisterModal("Route gate");
  }, [
    access,
    location.pathname,
    location.search,
    location.hash,
    openRegisterModal,
  ]);

  if (access === "granted") {
    return children;
  }

  // Loading / denied: do not render protected content.
  return null;
};

export default RequireRegisteredRoute;
