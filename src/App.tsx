
import Navbar from "./components/Navbar";
import MarqueeDemo from "./components/MarqueeDemo";
import CompanyLogosShowcase from "./components/company";
import AboutUs from "./components/about";
import ExpertiseSection from "./components/ExpertiseSection";
import Preloader from "./components/Preloader";
import HeaderNavbar from "./components/HeaderNavbar";
import '@fortawesome/fontawesome-free/css/all.min.css';
function App() {
  return (
    <div> 
      
      <Preloader/>
      
      <Navbar/>
     
      <AboutUs/>
       <CompanyLogosShowcase/>
 <MarqueeDemo/> 
 <ExpertiseSection/>

     </div>
  );
}

export default App;
