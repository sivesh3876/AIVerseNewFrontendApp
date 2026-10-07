import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistrationReminder } from "../context/RegistrationReminderContext";
import { resolveAppAccess } from "../utils/appAccess";
import { setRegistrationReturnUrl } from "../utils/registrationReturnUrl";

const toPathString = (to) => {
  if (typeof to === "string") return to;
  if (to && typeof to === "object") {
    const pathname = to.pathname || "";
    const search = to.search || "";
    const hash = to.hash || "";
    return `${pathname}${search}${hash}`;
  }
  return "/";
};

/**
 * Navigate to a path when the visitor has app access; otherwise open the
 * registration modal and store the destination as the post-registration return URL.
 */
export const useGatedNavigate = () => {
  const navigate = useNavigate();
  const { openRegisterModal } = useRegistrationReminder();

  return useCallback(
    async (to, options) => {
      const path = toPathString(to);
      const access = await resolveAppAccess();

      if (access === "granted") {
        navigate(to, options);
        return;
      }

      setRegistrationReturnUrl(path);
      openRegisterModal("Route gate");
    },
    [navigate, openRegisterModal],
  );
};

export default useGatedNavigate;
