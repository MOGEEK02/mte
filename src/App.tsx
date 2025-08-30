
import Navbar from "./components/Navbar";
import CompanyLogosShowcase from "./components/company";
import AboutUs from "./components/about";
import ExpertiseSection from "./components/ExpertiseSection";
import Preloader from "./components/Preloader";
import Contact from "./components/Contact";
import Footer from "./components/footer"
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <div> 
      
      
      <Navbar/>
   
    
      <AboutUs/>
       <CompanyLogosShowcase/>

 <ExpertiseSection/>
 <Contact/>
<Footer/>
     </div>
  );
}

export default App;
