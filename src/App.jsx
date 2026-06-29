import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer/Footer";
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
import ContactPage from "./pages/ContactPage";
import CareersPage from "./pages/CareersPage";
import BlogsPage from "./pages/BlogsPage";
import WhitepapersPage from "./pages/WhitepapersPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import SuccessStoriesPage from "./pages/SuccessStoriesPage";
import { scrollToHomeSection } from "./utils/homeSections";

const RouteScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const sectionId = hash.slice(1);
      const timer = window.setTimeout(() => {
        scrollToHomeSection(sectionId);
      }, 100);

      return () => window.clearTimeout(timer);
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <RouteScrollManager />
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore-solutions/:id" element={<SolutionDetails />} />
        <Route path="/explore-solutions" element={<ExploreSolutions />} />
        <Route path="/learn-explore" element={<LearnExplorePage />} />
        <Route path="/ai-capabilities" element={<AICapabilitiesPage />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/industry-solutions" element={<IndustrySolutionsPage />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/customer-experience" element={<CustomerExperiencePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/whitepapers" element={<WhitepapersPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/success-stories" element={<SuccessStoriesPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
