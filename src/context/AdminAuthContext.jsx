import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAdminSession,
  createAdminSession,
  getAdminSession,
  validateAdminCredentials,
} from "../utils/adminAuth";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => getAdminSession());

  useEffect(() => {
    const syncSession = () => {
      setSession(getAdminSession());
    };

    window.addEventListener("storage", syncSession);
    window.addEventListener("focus", syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("focus", syncSession);
    };
  }, []);

  const login = useCallback((email, password) => {
    if (!validateAdminCredentials(email, password)) {
      return { success: false, message: "Invalid email or password." };
    }

    const nextSession = createAdminSession(email);
    setSession(nextSession);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      adminEmail: session?.email || "",
      adminName: session?.name || "",
      authToken: session?.token || "",
      login,
      logout,
    }),
    [session, login, logout],
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }

  return context;
};
