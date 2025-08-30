
import Navbar from "./components/Navbar";
import CompanyLogosShowcase from "./components/company";
import AboutUs from "./components/about";
import ExpertiseSection from "./components/ExpertiseSection";
import Preloader from "./components/Preloader";
import Footer from "./components/footer"
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <div> 
      
      <Preloader/>
      
      <Navbar/>
   
    
      <AboutUs/>
       <CompanyLogosShowcase/>

 <ExpertiseSection/>
<Footer/>
     </div>
  );
}

export default App;
