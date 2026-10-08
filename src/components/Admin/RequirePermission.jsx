import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { isAdminPortalSession } from "../../utils/adminAuth";
import { getAdminLandingPath } from "../../utils/adminLanding";

const RequirePermission = ({ anyOf = [], children }) => {
  const { hasAnyPermission, permissions, session } = useAdminAuth();

  // Defense in depth: normal users never stay on admin routes.
  if (!isAdminPortalSession(session)) {
    return <Navigate to="/" replace />;
  }

  if (!hasAnyPermission(anyOf)) {
    const landing = getAdminLandingPath(permissions);
    return <Navigate to={landing || "/admin/login"} replace />;
  }

  return children;
};

export default RequirePermission;
