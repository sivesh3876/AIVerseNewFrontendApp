import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import logo from "../../assets/images/logo.svg";
import "./AdminDashboard.scss";
import "./AdminLogin.scss";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from || "/admin";

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = login(email, password);

    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="admin_login">
      <div className="admin_login__panel">
        <div className="admin_login__brand">
          <img src={logo} alt="AI Verse" className="admin_login__logo" />
          <div>
            <p className="admin_login__eyebrow">AI Verse</p>
            <h1>Admin Portal</h1>
          </div>
        </div>

        <p className="admin_login__subtitle">
          Sign in to manage AI solutions, review submissions, and update the catalog.
        </p>

        <form className="admin_login__form" onSubmit={handleSubmit} noValidate>
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

          <button
            type="submit"
            className="admin_dashboard__auth-btn admin_dashboard__auth-btn--on-light admin_login__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <Link to="/" className="admin_login__back">
          Back to AI Verse
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
