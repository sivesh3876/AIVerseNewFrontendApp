import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { buildApiPath } from "../services/apiConfig";
import {
  clearAdminSession,
  getAdminAuthHeaders,
  getAdminSession,
  persistAdminSessionFromPortal,
} from "../utils/adminAuth";

const AdminAuthContext = createContext(null);

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

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

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(buildApiPath("portal-login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(email || "").trim(),
          password: String(password || ""),
          expectedPortal: "admin",
        }),
      });

      const result = await parseJsonSafe(response);
      const payload = result.data && typeof result.data === "object" ? result.data : result;

      if (!response.ok || result.status === "error" || !payload?.token) {
        return {
          success: false,
          message:
            result.message ||
            payload?.message ||
            "Invalid email or password.",
        };
      }

      const nextSession = persistAdminSessionFromPortal(payload);
      setSession(nextSession);
      return { success: true };
    } catch {
      return {
        success: false,
        message: "Unable to reach the login service. Please try again.",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    const headers = getAdminAuthHeaders();
    if (headers.Authorization) {
      try {
        await fetch(buildApiPath("portal-logout"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        });
      } catch {
        // Clear local session even if logout API fails.
      }
    }

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
