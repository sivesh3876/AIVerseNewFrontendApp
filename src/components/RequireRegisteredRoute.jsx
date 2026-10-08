import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRegistrationReminder } from "../context/RegistrationReminderContext";
import { resolveAppAccess } from "../utils/appAccess";
import { hasCompletedRegistration, REGISTRATION_COMPLETED_EVENT } from "../utils/registrationStatusStorage";
import { setRegistrationReturnUrl } from "../utils/registrationReturnUrl";

/**
 * Blocks registration-protected pages until the visitor has completed
 * registration (or has an Easy Auth profile). Opens the existing RegisterModal
 * and stores a return URL for post-registration navigation.
 */
const RequireRegisteredRoute = ({ children }) => {
  const location = useLocation();
  const { openRegisterModal } = useRegistrationReminder();
  const [access, setAccess] = useState(() =>
    hasCompletedRegistration() ? "granted" : "loading",
  );

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (hasCompletedRegistration()) {
        if (!cancelled) setAccess("granted");
        return;
      }

      if (!cancelled) setAccess("loading");
      const next = await resolveAppAccess({ forceRefresh: true });
      if (!cancelled) setAccess(next);
    };

    check();

    const onRegistrationCompleted = () => {
      if (!cancelled) setAccess("granted");
    };

    window.addEventListener(
      REGISTRATION_COMPLETED_EVENT,
      onRegistrationCompleted,
    );

    return () => {
      cancelled = true;
      window.removeEventListener(
        REGISTRATION_COMPLETED_EVENT,
        onRegistrationCompleted,
      );
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
  // RegistrationReminderContext redirects to `/` if the modal is dismissed
  // without registering, and navigates to the return URL after success.
  return null;
};

export default RequireRegisteredRoute;
