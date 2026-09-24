import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { getAdminLandingPath } from "../../utils/adminLanding";
import logo from "../../assets/images/logo.svg";
import sliderBg from "../../assets/images/slider1.svg";
import robotIcon from "../../assets/images/robot.svg";
import graphIcon from "../../assets/images/graph.svg";
import searchIcon from "../../assets/images/search-teal.svg";
import dollarIcon from "../../assets/images/dollar.svg";
import "./AdminDashboard.scss";
import "./AdminLogin.scss";

const HUB_NODES = [
  { id: "search", icon: searchIcon, label: "Enterprise Search", position: "top" },
  { id: "graph", icon: graphIcon, label: "AI Analytics", position: "right" },
  { id: "robot", icon: robotIcon, label: "Agentic AI", position: "bottom" },
  { id: "dollar", icon: dollarIcon, label: "Business Value", position: "left" },
];

const resolveSafeReturnUrl = (value) => {
  if (!value || typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  if (trimmed.includes("://")) {
    return null;
  }

  return trimmed;
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, permissions } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const returnUrl = resolveSafeReturnUrl(
    new URLSearchParams(location.search).get("returnUrl"),
  );
  const fallbackLanding = getAdminLandingPath(permissions);
  const redirectPath =
    returnUrl ||
    (location.state?.from && location.state.from !== "/admin"
      ? location.state.from
      : null) ||
    fallbackLanding;

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const resetMessages = () => {
    setError("");
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    const landing =
      returnUrl ||
      (location.state?.from && location.state.from !== "/admin"
        ? location.state.from
        : null) ||
      getAdminLandingPath(result.session?.permissions || []);
    navigate(landing, { replace: true });
  };

  return (
    <div className="admin_login">
      <section className="admin_login__showcase" aria-hidden="false">
        <div
          className="admin_login__showcase-bg"
          style={{ backgroundImage: `url(${sliderBg})` }}
        />
        <div className="admin_login__showcase-overlay" />

        <div className="admin_login__showcase-inner">
          <div className="admin_login__hub" aria-hidden="true">
            <div className="admin_login__hub-ring" />
            <div className="admin_login__hub-center">
              <span>AI</span>
              <strong>Verse</strong>
            </div>
            {HUB_NODES.map((node) => (
              <div
                key={node.id}
                className={`admin_login__hub-node admin_login__hub-node--${node.position}`}
              >
                <div className="admin_login__hub-node-icon">
                  <img src={node.icon} alt="" />
                </div>
              </div>
            ))}
          </div>

          <div className="admin_login__showcase-content">
            <h2>All-in-one AI Workspace</h2>
            <p>
              Explore solutions, manage your catalog, and drive enterprise AI
              transformation. AI Verse brings capabilities, services, and
              insights together in one platform.
            </p>
          </div>

          <p className="admin_login__showcase-footer">
            Espire Infolab Pvt. Ltd.
          </p>
        </div>

        <div className="admin_login__mountains" aria-hidden="true" />
      </section>

      <section className="admin_login__aside">
        <div className="admin_login__panel">
          <div className="admin_login__brand">
            <img src={logo} alt="AI Verse" className="admin_login__logo" />
          </div>

          <p className="admin_login__portal-title">Admin Portal</p>

          <p className="admin_login__subtitle">
            Sign in to manage AI solutions, review submissions, and update the catalog.
          </p>

          <form
            className="admin_login__form"
            onSubmit={handleSignInSubmit}
            noValidate
          >
            {error && (
              <div className="admin_login__error" role="alert">
                {error}
              </div>
            )}

            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <div className="admin_login__actions">
              <button
                type="submit"
                className="admin_login__btn admin_login__btn--primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </button>
            </div>
          </form>

          <Link to="/" className="admin_login__back">
            Back to AI Verse
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
