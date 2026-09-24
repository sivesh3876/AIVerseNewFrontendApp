import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { getAdminLandingPath } from "../../utils/adminLanding";

const RequirePermission = ({ anyOf = [], children }) => {
  const { hasAnyPermission, permissions } = useAdminAuth();

  if (!hasAnyPermission(anyOf)) {
    return <Navigate to={getAdminLandingPath(permissions)} replace />;
  }

  return children;
};

export default RequirePermission;
