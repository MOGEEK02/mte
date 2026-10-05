import { useParams, Navigate } from "react-router-dom";
import { isLocale } from "../i18n";
import Seo from "./Seo";
import Header from "./Header";
import Hero from "./Hero";
import ServicesOverview from "./ServicesOverview";
import RecentProjects from "./RecentProjects";
import WhyMe from "./WhyMe";
import Process from "./Process";
import AboutUs from "./about";
import CompanyLogosShowcase from "./company";
import Industries from "./Industries";
import Faq from "./Faq";
import Testimonials from "./Testimonials";
import QuoteForm from "./QuoteForm";
import Contact from "./Contact";
import Footer from "./footer";

export default function HomePage() {
  const { lang } = useParams();
  if (!isLocale(lang)) return <Navigate to="/fr" replace />;

  return (
    <>
      <Seo />
      <Header variant="home" />
      <main>
        <Hero />
        <ServicesOverview />
        <RecentProjects />
        <WhyMe />
        <Process />
        <AboutUs />
        <CompanyLogosShowcase />
        <Industries />
        <Faq />
        <Testimonials />
        <QuoteForm />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
