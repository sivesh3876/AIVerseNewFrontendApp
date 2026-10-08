import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { isAdminPortalSession } from "../../utils/adminAuth";

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, session } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // Member (normal user) sessions must never see Admin pages.
  if (!isAdminPortalSession(session)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
