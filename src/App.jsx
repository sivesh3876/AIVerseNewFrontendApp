import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage";
import GetStarted from "./pages/GetStarted";
import ExploreSolutions from "./pages/ExploreSolutions";
import SolutionDetails from "./pages/SolutionDetails";
import Solutions from "./pages/Solutions";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore-solutions/:id" element={<SolutionDetails />} />
        <Route path="/explore-solutions" element={<ExploreSolutions />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/solutions" element={<Solutions />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
