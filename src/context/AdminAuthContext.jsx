import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAdminSession,
  createAdminSessionFromLogin,
  getAdminSession,
  hasAnyPermission as sessionHasAnyPermission,
  hasPermission as sessionHasPermission,
} from "../utils/adminAuth";
import { buildApiPath } from "../services/apiConfig";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => getAdminSession());

  useEffect(() => {
    let active = true;

    const refreshSession = async () => {
      const current = getAdminSession();
      if (!current?.token) {
        if (active) setSession(null);
        return;
      }

      try {
        const response = await fetch(buildApiPath("portal-me"), {
          headers: { Authorization: `Bearer ${current.token}` },
        });
        const result = await response.json();
        if (!response.ok || result.status !== "success") {
          if (response.status === 401) {
            clearAdminSession();
            if (active) setSession(null);
          }
          return;
        }
        const nextSession = createAdminSessionFromLogin({
          ...(result.data || result),
          token: current.token,
          loggedInAt: current.loggedInAt,
        });
        if (active) setSession(nextSession);
      } catch {
        if (active) setSession(getAdminSession());
      }
    };

    const syncSession = () => setSession(getAdminSession());
    refreshSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("focus", refreshSession);

    return () => {
      active = false;
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("focus", refreshSession);
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(buildApiPath("portal-login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const result = await response.json();
      if (!response.ok || result.status !== "success") {
        return {
          success: false,
          message: result.message || "Invalid email or password.",
        };
      }

      const nextSession = createAdminSessionFromLogin(result);
      setSession(nextSession);
      return { success: true, session: nextSession };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to sign in. Please try again.",
      };
    }
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
      permissions: session?.permissions || [],
      role: session?.role || "",
      hasPermission: (permission) => sessionHasPermission(permission, session),
      hasAnyPermission: (permission) =>
        sessionHasAnyPermission(permission, session),
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
