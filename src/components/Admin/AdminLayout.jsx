import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import logo from "../../assets/images/logo.svg";
import "./AdminDashboard.scss";
import "./AdminLayout.scss";

const adminNavItems = [
  { label: "Dashboard", to: "/admin", end: true },
  {
    label: "Request Demo",
    to: "/admin/request-demos/solution-info",
    end: false,
  },
  {
    label: "Blogs",
    to: "/admin/blogs",
    end: true,
  },
  {
    label: "Learn & Explore",
    to: "/admin/learn-explore",
    end: false,
  },
  {
    label: "Solution New AI",
    to: "/admin/solution-new-ai",
    end: true,
  },
];
const AdminLayout = () => {
  const navigate = useNavigate();
  const { adminEmail, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin_dashboard">
      <aside className="admin_dashboard__sidebar">
        <div className="admin_dashboard__sidebar-brand">
          <img src={logo} alt="AI Verse" />
          <div>
            <strong>AI Verse</strong>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin_dashboard__nav">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin_dashboard__sidebar-footer">
          {adminEmail && (
            <p className="admin_dashboard__signed-in">
              Signed in <strong>{adminEmail}</strong>
            </p>
          )}
          <button
            type="button"
            className="admin_dashboard__auth-btn"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin_dashboard__main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
