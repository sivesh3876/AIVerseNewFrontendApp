import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer/Footer";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { RegistrationReminderProvider } from "./context/RegistrationReminderContext";
import { ProtectedAdminRoute } from "./components/Admin";
import HomePage from "./pages/HomePage";
import GetStarted from "./pages/GetStarted";
import ExploreSolutions from "./pages/ExploreSolutions";
import LearnExplorePage from "./pages/LearnExplorePage";
import AICapabilitiesPage from "./pages/AICapabilitiesPage";
import AboutUsPage from "./pages/AboutUsPage";
import ClientsPage from "./pages/ClientsPage";
import IndustrySolutionsPage from "./pages/IndustrySolutionsPage";
import SolutionDetails from "./pages/SolutionDetails";
import Solutions from "./pages/Solutions";
import CustomerExperiencePage from "./pages/CustomerExperiencePage";
import EmployeeExperiencePage from "./pages/EmployeeExperiencePage";
import BusinessExperiencePage from "./pages/BusinessExperiencePage";
import TotalExperienceDetailPage from "./pages/TotalExperienceDetailPage";
import ContactPage from "./pages/ContactPage";
import CareersPage from "./pages/CareersPage";
import BlogsPage from "./pages/BlogsPage";
import CertificationDetailsPage from "./pages/CertificationDetailsPage";
import WhitepapersPage from "./pages/WhitepapersPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import SuccessStoriesPage from "./pages/SuccessStoriesPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AIReadinessAssessmentPage from "./pages/AIReadinessAssessmentPage";
import AdminDashboardPage, {
  AdminBlogs,
  AdminCertifications,
  AdminCertificationDetail,
  AdminCertifiedProfessionalsPage,
  AdminLayout,
  AdminRequestDemoSolutionInfo,
  AdminSolutionNewAI,
} from "./pages/AdminDashboardPage";
import UserManagement from "./pages/UserManagement/UserManagement";
import UserDetails from "./pages/UserManagement/UserDetails";
import RoleManagement from "./pages/RoleManagement/RoleManagement";
import RoleDetails from "./pages/RoleManagement/RoleDetails";
import ContactRequests from "./pages/ContactRequests/ContactRequests";
import {
  getHomeScrollBehavior,
  scrollToHomeSectionWhenReady,
  updateHomeHash,
} from "./utils/homeSections";

const RouteScrollManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname, hash, search, state } = location;
  const skipNextTopScrollRef = useRef(false);
  const scrollToSection =
    typeof state?.scrollToSection === "string" ? state.scrollToSection : "";

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const sectionFromHash = hash ? hash.slice(1) : "";
    const sectionId = scrollToSection || sectionFromHash;

    if (pathname === "/" && sectionId) {
      return scrollToHomeSectionWhenReady(sectionId, {
        timeout: 2000,
        onScrolled: () => {
          updateHomeHash(sectionId);

          if (scrollToSection) {
            skipNextTopScrollRef.current = true;
            navigate(
              { pathname: "/", search },
              { replace: true, state: {} },
            );
            updateHomeHash(sectionId);
          }
        },
      });
    }

    if (skipNextTopScrollRef.current) {
      skipNextTopScrollRef.current = false;
      return undefined;
    }

    window.scrollTo({
      top: 0,
      behavior: getHomeScrollBehavior(),
    });

    return undefined;
  }, [pathname, hash, search, scrollToSection, navigate]);

  return null;
};

const AppShell = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <RouteScrollManager />
      {!isAdminRoute && <Navigation />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore-solutions/:id" element={<SolutionDetails />} />
        <Route path="/explore-solutions" element={<ExploreSolutions />} />
        <Route path="/learn-explore" element={<LearnExplorePage />} />
        <Route
          path="/learn-explore/certifications"
          element={<CertificationDetailsPage />}
        />
        <Route
          path="/learn-explore/certifications/:certificationId"
          element={<CertificationDetailsPage />}
        />
        <Route path="/ai-capabilities" element={<AICapabilitiesPage />} />

        <Route
          path="/ai-readiness-assessment"
          element={<AIReadinessAssessmentPage />}
        />

        <Route
          path="/get-started"
          element={
            <ProtectedAdminRoute>
              <GetStarted />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/industry-solutions" element={<IndustrySolutionsPage />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/customer-experience" element={<CustomerExperiencePage />} />
        <Route path="/employee-experience" element={<EmployeeExperiencePage />} />
        <Route path="/business-experience" element={<BusinessExperiencePage />} />
        <Route path="/total-experience" element={<TotalExperienceDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/whitepapers" element={<WhitepapersPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/success-stories" element={<SuccessStoriesPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route
            path="request-demos"
            element={<Navigate to="/admin/request-demos/solution-info" replace />}
          />
          <Route
            path="request-demos/solution-info"
            element={<AdminRequestDemoSolutionInfo />}
          />
          <Route path="contact-requests" element={<ContactRequests />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="learn-explore" element={<AdminCertifications />} />
          <Route
            path="learn-explore/:certificationId/certified-professionals"
            element={<AdminCertifiedProfessionalsPage />}
          />
          <Route
            path="learn-explore/:certificationId"
            element={<AdminCertificationDetail />}
          />
          <Route path="solution-new-ai" element={<AdminSolutionNewAI />} />
          <Route path="role-management" element={<RoleManagement />} />
          <Route path="role-management/:roleId" element={<RoleDetails />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="user-management/:userId" element={<UserDetails />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <RegistrationReminderProvider>
          <AppShell />
        </RegistrationReminderProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
