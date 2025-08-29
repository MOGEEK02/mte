
import Navbar from "./components/Navbar";
import MarqueeDemo from "./components/MarqueeDemo";
import CompanyLogosShowcase from "./components/company";
import AboutUs from "./components/about";
import './assets/css/animate.css';
import './assets/css/nice-select.css';

import './assets/css/default.css';
import './assets/css/style.css';
import './App.css';
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
