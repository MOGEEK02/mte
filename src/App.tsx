
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CompanyLogosShowcase from "./components/company";
import AboutUs from "./components/about";
import ExpertiseSection from "./components/ExpertiseSection";
import Contact from "./components/Contact";
import Footer from "./components/footer";
import Portfolio from "./components/Portfolio";
import '@fortawesome/fontawesome-free/css/all.min.css';

function HomePage() {
  return (
    <div>
      <Navbar />
      <AboutUs />
      <CompanyLogosShowcase />
      <ExpertiseSection />
      <Contact />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </Router>
  );
}

export default App;
