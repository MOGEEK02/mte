import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { isLocale } from "../i18n";
import Seo from "./Seo";
import Header from "./Header";
import Hero from "./Hero";
import AboutUs from "./about";
import CompanyLogosShowcase from "./company";
import ExpertiseSection from "./ExpertiseSection";
import Process from "./Process";
import Faq from "./Faq";
import Contact from "./Contact";
import Footer from "./footer";

export default function HomePage() {
  const { lang } = useParams();

  // Guard: /:lang only accepts fr | en, otherwise send to the default locale.
  if (!isLocale(lang)) {
    return <Navigate to="/fr" replace />;
  }

  return (
    <>
      <Seo />
      <Header variant="home" />
      <main>
        <Hero />
        <AboutUs />
        <CompanyLogosShowcase />
        <ExpertiseSection />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
