import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  addContactRequest,
  LEAD_TYPES,
} from "../../utils/contactRequestStorage";
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

const INITIAL_SIGNUP = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAdminAuth();
  const [authMode, setAuthMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupForm, setSignupForm] = useState(INITIAL_SIGNUP);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from || "/admin";
  const isSignIn = authMode === "signin";

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
    setSuccessMessage("");
  };

  const switchToSignUp = () => {
    resetMessages();
    setAuthMode("signup");
  };

  const switchToSignIn = () => {
    resetMessages();
    setSignupForm(INITIAL_SIGNUP);
    setAuthMode("signin");
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    const result = login(email, password);

    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    navigate(redirectPath, { replace: true });
  };

  const handleSignupChange = (event) => {
    const { name, value } = event.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateSignup = () => {
    const next = {};

    if (!signupForm.fullName.trim()) {
      next.form = "Full name is required.";
    } else if (!signupForm.email.trim()) {
      next.form = "Email is required.";
    } else if (!EMAIL_RE.test(signupForm.email.trim())) {
      next.form = "Enter a valid email address.";
    } else if (!signupForm.password) {
      next.form = "Password is required.";
    } else if (signupForm.password.length < 8) {
      next.form = "Password must be at least 8 characters.";
    } else if (signupForm.password !== signupForm.confirmPassword) {
      next.form = "Passwords do not match.";
    }

    return next.form ? next : null;
  };

  const handleSignUpSubmit = (event) => {
    event.preventDefault();
    resetMessages();

    const validationError = validateSignup();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      addContactRequest({
        name: signupForm.fullName.trim(),
        email: signupForm.email.trim(),
        company: "—",
        phone: "—",
        reason: LEAD_TYPES.REGISTER,
        type: LEAD_TYPES.REGISTER,
        source: "Admin Portal Sign Up",
        message: "Admin portal sign-up request from login page.",
      });

      setSignupForm(INITIAL_SIGNUP);
      setSuccessMessage(
        "Your sign-up request has been submitted. Our team will review it and contact you shortly.",
      );
    } catch {
      setError("Something went wrong. Please try again.");
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

          <p className="admin_login__portal-title">
            {isSignIn ? "Admin Portal" : "Create Account"}
          </p>

          <p className="admin_login__subtitle">
            {isSignIn
              ? "Sign in to manage AI solutions, review submissions, and update the catalog."
              : "Sign up to request access to the AI Verse admin portal."}
          </p>

          {successMessage ? (
            <div className="admin_login__success">
              <p>{successMessage}</p>
              <button
                type="button"
                className="admin_login__btn admin_login__btn--primary"
                onClick={switchToSignIn}
              >
                Back to Sign in
              </button>
            </div>
          ) : isSignIn ? (
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
                <button
                  type="button"
                  className="admin_login__btn admin_login__btn--secondary"
                  onClick={switchToSignUp}
                  disabled={isSubmitting}
                >
                  Sign Up
                </button>
              </div>
            </form>
          ) : (
            <form
              className="admin_login__form"
              onSubmit={handleSignUpSubmit}
              noValidate
            >
              {error && (
                <div className="admin_login__error" role="alert">
                  {error}
                </div>
              )}

              <label htmlFor="signup-full-name">Full Name</label>
              <input
                id="signup-full-name"
                type="text"
                name="fullName"
                autoComplete="name"
                placeholder="Enter your full name"
                value={signupForm.fullName}
                onChange={handleSignupChange}
                required
              />

              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email address"
                value={signupForm.email}
                onChange={handleSignupChange}
                required
              />

              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Create a password"
                value={signupForm.password}
                onChange={handleSignupChange}
                required
              />

              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <input
                id="signup-confirm-password"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={signupForm.confirmPassword}
                onChange={handleSignupChange}
                required
              />

              <div className="admin_login__actions">
                <button
                  type="submit"
                  className="admin_login__btn admin_login__btn--primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing up…" : "Sign Up"}
                </button>
                <button
                  type="button"
                  className="admin_login__btn admin_login__btn--secondary"
                  onClick={switchToSignIn}
                  disabled={isSubmitting}
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          <Link to="/" className="admin_login__back">
            Back to AI Verse
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
