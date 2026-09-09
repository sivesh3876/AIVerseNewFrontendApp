import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import RegisterModal from "../components/Register/RegisterModal";
import {
  hasCompletedRegistration,
  REGISTRATION_COMPLETED_EVENT,
} from "../utils/registrationStatusStorage";

/** Automatic Registration reminder delay (2 minutes). */
// Temporarily disabled: auto popup after 2 minutes.
// const REMINDER_DELAY_MS = 120000;

const RegistrationReminderContext = createContext({
  openRegisterModal: () => {},
  closeRegisterModal: () => {},
  isRegisterModalOpen: false,
});

export const useRegistrationReminder = () =>
  useContext(RegistrationReminderContext);

/**
 * Global mandatory Registration reminder.
 *
 * Status is driven ONLY by Registration form completion
 * (`hasCompletedRegistration` / `markRegistrationCompleted`).
 * Other forms (Contact Us, Callback, Demo, Newsletter) never stop this cycle.
 */
export const RegistrationReminderProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState("Website Registration");
  const timerRef = useRef(null);
  const isOpenRef = useRef(false);
  const registeredRef = useRef(hasCompletedRegistration());
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminRouteRef = useRef(isAdminRoute);
  isAdminRouteRef.current = isAdminRoute;

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startReminderTimer = useCallback(() => {
    // Auto Register popup after 2 minutes is temporarily disabled.
    clearTimer();
    /*
    // Only Registration form completion stops reminders.
    if (registeredRef.current || hasCompletedRegistration()) {
      registeredRef.current = true;
      return;
    }

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;

      if (registeredRef.current || hasCompletedRegistration()) {
        registeredRef.current = true;
        return;
      }
      if (isOpenRef.current) return;

      // Defer while on admin; keep the reminder cycle alive.
      if (isAdminRouteRef.current) {
        startReminderTimer();
        return;
      }

      setSource("Registration Reminder");
      setIsOpen(true);
      isOpenRef.current = true;
    }, REMINDER_DELAY_MS);
    */
  }, [clearTimer]);

  // Navigating into admin with an open popup: close it and keep the cycle going.
  useEffect(() => {
    if (!isAdminRoute || !isOpenRef.current) return;
    setIsOpen(false);
    isOpenRef.current = false;
    // Auto reminder restart disabled.
    // if (!registeredRef.current && !hasCompletedRegistration()) {
    //   startReminderTimer();
    // }
  }, [isAdminRoute]);

  useEffect(() => {
    registeredRef.current = hasCompletedRegistration();
    // Auto Register popup after 2 minutes is temporarily disabled.
    // if (!registeredRef.current) {
    //   startReminderTimer();
    // }

    const onRegistrationFormCompleted = () => {
      registeredRef.current = true;
      clearTimer();
    };

    window.addEventListener(
      REGISTRATION_COMPLETED_EVENT,
      onRegistrationFormCompleted,
    );
    return () => {
      window.removeEventListener(
        REGISTRATION_COMPLETED_EVENT,
        onRegistrationFormCompleted,
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
    if (registeredRef.current || hasCompletedRegistration()) {
      registeredRef.current = true;
      clearTimer();
      return;
    }

    // Auto Register popup restart after close is temporarily disabled.
    // startReminderTimer();
  }, [clearTimer]);

  const handleRegistered = useCallback(() => {
    // Status is already persisted inside RegisterModal via markRegistrationCompleted.
    registeredRef.current = true;
    clearTimer();
  }, [clearTimer]);

  const value = useMemo(
    () => ({
      openRegisterModal,
      closeRegisterModal,
      isRegisterModalOpen: isOpen,
    }),
    [openRegisterModal, closeRegisterModal, isOpen],
  );

  return (
    <RegistrationReminderContext.Provider value={value}>
      {children}
      <RegisterModal
        open={isOpen}
        onClose={closeRegisterModal}
        onRegistered={handleRegistered}
        source={source}
      />
    </RegistrationReminderContext.Provider>
  );
};
