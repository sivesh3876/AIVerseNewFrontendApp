import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RegisterModal from "../components/Register/RegisterModal";
import { resolveAppAccess, hasSyncAppAccess } from "../utils/appAccess";
import {
  clearAdminSession,
  PORTAL_SESSION_CHANGED_EVENT,
} from "../utils/adminAuth";
import { isRegistrationProtectedPath } from "../utils/publicRoutes";
import {
  clearRegistrationReturnUrl,
  getRegistrationReturnUrl,
} from "../utils/registrationReturnUrl";
import {
  clearRegistrationCompleted,
  hasCompletedRegistration,
  REGISTRATION_COMPLETED_EVENT,
} from "../utils/registrationStatusStorage";

/** Automatic Registration reminder delay (2 minutes). */
// Temporarily disabled: auto popup after 2 minutes.
// const REMINDER_DELAY_MS = 120000;

const BLOCKED_NORMAL_TARGETS = new Set([
  "/login",
  "/register",
  "/admin/login",
]);

/**
 * Normal users may only land on non-admin app paths.
 * Default and preferred post-auth target is `/`.
 */
const resolveSafeNormalTarget = (target = "/") => {
  const raw = String(target || "/").split("?")[0].split("#")[0] || "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  if (raw.startsWith("/admin")) return "/";
  if (BLOCKED_NORMAL_TARGETS.has(raw)) return "/";
  return raw;
};

const RegistrationReminderContext = createContext({
  openRegisterModal: () => {},
  closeRegisterModal: () => {},
  logoutAppUser: () => {},
  finalizeNormalUserAccess: () => {},
  isRegisterModalOpen: false,
  isAppAccessGranted: false,
});

export const useRegistrationReminder = () =>
  useContext(RegistrationReminderContext);

/**
 * Global mandatory Registration reminder + public app-access state.
 *
 * Access is granted by Registration/Login form completion, portal session,
 * or Easy Auth. Other lead forms never grant access.
 */
export const RegistrationReminderProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState("Website Registration");
  const [isAppAccessGranted, setIsAppAccessGranted] = useState(() =>
    hasSyncAppAccess(),
  );
  const timerRef = useRef(null);
  const isOpenRef = useRef(false);
  const registeredRef = useRef(hasSyncAppAccess());
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoginRoute = location.pathname === "/login";
  const hideRegisterModal = isAdminRoute || isLoginRoute;

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Navigating into admin/login with an open popup: close it.
  useEffect(() => {
    if (!hideRegisterModal || !isOpenRef.current) return;
    setIsOpen(false);
    isOpenRef.current = false;
  }, [hideRegisterModal]);

  useEffect(() => {
    registeredRef.current = hasSyncAppAccess();
    setIsAppAccessGranted(hasSyncAppAccess());

    let cancelled = false;
    const refreshAccess = () => {
      resolveAppAccess().then((state) => {
        if (cancelled) return;
        const granted = state === "granted";
        setIsAppAccessGranted(granted);
        if (granted) registeredRef.current = true;
      });
    };

    refreshAccess();

    // Grant only — navigation is handled by finalizeNormalUserAccess so
    // Home always sees isAppAccessGranted=true before/with the route change.
    const onRegistrationFormCompleted = () => {
      registeredRef.current = true;
      setIsAppAccessGranted(true);
      clearTimer();
    };

    const onPortalSessionChanged = () => {
      const granted = hasSyncAppAccess();
      registeredRef.current = granted;
      setIsAppAccessGranted(granted);
      if (!granted) {
        refreshAccess();
      }
    };

    window.addEventListener(
      REGISTRATION_COMPLETED_EVENT,
      onRegistrationFormCompleted,
    );
    window.addEventListener(PORTAL_SESSION_CHANGED_EVENT, onPortalSessionChanged);
    return () => {
      cancelled = true;
      window.removeEventListener(
        REGISTRATION_COMPLETED_EVENT,
        onRegistrationFormCompleted,
      );
      window.removeEventListener(
        PORTAL_SESSION_CHANGED_EVENT,
        onPortalSessionChanged,
      );
      clearTimer();
    };
  }, [clearTimer]);

  const openRegisterModal = useCallback(
    (nextSource = "Hero Registration") => {
      if (isOpenRef.current) return;
      clearTimer();
      setSource(nextSource);
      setIsOpen(true);
      isOpenRef.current = true;
    },
    [clearTimer],
  );

  const closeRegisterModal = useCallback(() => {
    setIsOpen(false);
    isOpenRef.current = false;

    // Closing without Registration form submit must NOT mark registered.
    if (registeredRef.current || hasCompletedRegistration() || hasSyncAppAccess()) {
      registeredRef.current = true;
      clearTimer();
      return;
    }

    // Dismissed while trying to reach a protected page → send home.
    const pending = getRegistrationReturnUrl();
    clearRegistrationReturnUrl();
    if (pending && isRegistrationProtectedPath(location.pathname)) {
      navigate("/", { replace: true });
    }
  }, [clearTimer, location.pathname, navigate]);

  /**
   * Grant app access synchronously, then navigate to Full Home (`/`).
   * Call only after portal session is already written.
   */
  const finalizeNormalUserAccess = useCallback(
    (target = "/") => {
      registeredRef.current = true;
      setIsAppAccessGranted(true);
      clearTimer();
      clearRegistrationReturnUrl();

      setIsOpen(false);
      isOpenRef.current = false;

      const safeTarget = resolveSafeNormalTarget(target);
      navigate(safeTarget, { replace: true });
    },
    [clearTimer, navigate],
  );

  const logoutAppUser = useCallback(() => {
    clearAdminSession();
    clearRegistrationCompleted();
    registeredRef.current = false;
    setIsAppAccessGranted(false);
    clearTimer();
    navigate("/", { replace: true });
  }, [clearTimer, navigate]);

  const value = useMemo(
    () => ({
      openRegisterModal,
      closeRegisterModal,
      logoutAppUser,
      finalizeNormalUserAccess,
      isRegisterModalOpen: isOpen,
      isAppAccessGranted,
    }),
    [
      openRegisterModal,
      closeRegisterModal,
      logoutAppUser,
      finalizeNormalUserAccess,
      isOpen,
      isAppAccessGranted,
    ],
  );

  return (
    <RegistrationReminderContext.Provider value={value}>
      {children}
      <RegisterModal
        open={isOpen}
        onClose={closeRegisterModal}
        onRegistered={() => finalizeNormalUserAccess("/")}
        source={source}
      />
    </RegistrationReminderContext.Provider>
  );
};
