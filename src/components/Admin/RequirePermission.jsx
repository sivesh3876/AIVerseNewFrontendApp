import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { getAdminLandingPath } from "../../utils/adminLanding";

const RequirePermission = ({ anyOf = [], children }) => {
  const { hasAnyPermission, permissions } = useAdminAuth();

  if (!hasAnyPermission(anyOf)) {
    const landing = getAdminLandingPath(permissions);
    return <Navigate to={landing || "/admin/login"} replace />;
  }

  return children;
};

export default RequirePermission;
