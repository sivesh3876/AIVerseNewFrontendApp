import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import logo from "../../assets/images/logo.svg";
import "./AdminDashboard.scss";
import "./AdminLayout.scss";

const adminNavItems = [
  { label: "Dashboard", to: "/admin", end: true, permission: "dashboard.view" },
  {
    label: "Leads",
    to: "/admin/contact-requests",
    end: true,
    permission: "leads.view",
  },
  {
    label: "Request Demo",
    to: "/admin/request-demos/solution-info",
    end: false,
    permission: "demo.view",
  },
  {
    label: "Blogs",
    to: "/admin/blogs",
    end: true,
    permission: "blogs.view",
  },
  {
    label: "Success Stories",
    to: "/admin/success-stories",
    end: false,
    permission: "success_stories.view",
  },
  {
    label: "Learn & Explore",
    to: "/admin/learn-explore",
    end: false,
    permission: "learn.view",
  },
  {
    label: "Solution New AI",
    to: "/admin/solution-new-ai",
    end: true,
    permission: "solutions.view",
  },
  {
    label: "Role Management",
    to: "/admin/role-management",
    end: false,
    permission: "roles.view",
  },
  {
    label: "User Management",
    to: "/admin/user-management",
    end: false,
    permission: "users.view",
  },
];
const AdminLayout = () => {
  const navigate = useNavigate();
  const { adminEmail, hasPermission, logout } = useAdminAuth();
  // Only show modules the signed-in role actually grants (including Dashboard).
  const visibleNavItems = adminNavItems.filter((item) =>
    hasPermission(item.permission),
  );

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
          {visibleNavItems.map((item) => (
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
