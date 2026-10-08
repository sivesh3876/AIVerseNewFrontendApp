import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { portalLogin } from "../../services/portalAuthService";
import {
  createAdminSessionFromLogin,
  getAdminSession,
  isAdminPortalSession,
} from "../../utils/adminAuth";
import { getAdminLandingPath } from "../../utils/adminLanding";
import { markRegistrationCompleted } from "../../utils/registrationStatusStorage";
import { useRegistrationReminder } from "../../context/RegistrationReminderContext";
import logo from "../../assets/images/logo.svg";
import sliderBg from "../../assets/images/slider1.svg";
import robotIcon from "../../assets/images/robot.svg";
import graphIcon from "../../assets/images/graph.svg";
import searchIcon from "../../assets/images/search-teal.svg";
import dollarIcon from "../../assets/images/dollar.svg";
import "../Admin/AdminDashboard.scss";
import "../Admin/AdminLogin.scss";

const HUB_NODES = [
  { id: "search", icon: searchIcon, label: "Enterprise Search", position: "top" },
  { id: "graph", icon: graphIcon, label: "AI Analytics", position: "right" },
  { id: "robot", icon: robotIcon, label: "Agentic AI", position: "bottom" },
  { id: "dollar", icon: dollarIcon, label: "Business Value", position: "left" },
];

const UserLogin = () => {
  const navigate = useNavigate();
  const { finalizeNormalUserAccess } = useRegistrationReminder();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingSession = getAdminSession();

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  if (existingSession?.token) {
    if (isAdminPortalSession(existingSession)) {
      const adminLanding =
        getAdminLandingPath(existingSession.permissions) || "/admin";
      return <Navigate to={adminLanding} replace />;
    }
    return <Navigate to="/" replace />;
  }

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const auth = await portalLogin(email.trim(), password);
      const session = createAdminSessionFromLogin({
        token: auth.token,
        user: auth.user,
        role: auth.role,
        permissions: auth.permissions,
        expiresAt: auth.expiresAt,
        portalAudience: auth.portalAudience,
        isAdminPortal: auth.isAdminPortal,
        data: auth.data,
      });

      // Backend portalAudience decides landing — never email or a UI role field.
      if (isAdminPortalSession(session)) {
        const adminLanding =
          getAdminLandingPath(session.permissions) || "/admin";
        navigate(adminLanding, { replace: true });
        return;
      }

      // Login-first Member: session + Full Home (Register not required first).
      markRegistrationCompleted();
      finalizeNormalUserAccess("/");
    } catch (err) {
      setError(err?.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
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

          <p className="admin_login__portal-title">Login</p>

          <p className="admin_login__subtitle">
            Sign in to unlock full access to AI Verse solutions, resources, and
            insights.
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

            <label htmlFor="user-login-email">Email</label>
            <input
              id="user-login-email"
              type="email"
              autoComplete="username"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="user-login-password">Password</label>
            <input
              id="user-login-password"
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

export default UserLogin;
