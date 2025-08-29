
import Navbar from "./components/Navbar";
import MarqueeDemo from "./components/MarqueeDemo";
import CompanyLogosShowcase from "./components/company";
import AboutUs from "./components/about";
import ExpertiseSection from "./components/ExpertiseSection";

import '@fortawesome/fontawesome-free/css/all.min.css';
function App() {
  return (
    <div> 
      <Navbar />
      {/* Add other sections here */}
     
      <AboutUs/>
       <CompanyLogosShowcase/>
 <MarqueeDemo/> 
 <ExpertiseSection/>

     </div>
  );
}

export default App;
