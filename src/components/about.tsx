import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

const AboutUs: React.FC = () => {
  const [resumeLinks, setResumeLinks] = useState({ en: "", fr: "" });

  useEffect(() => {
    async function fetchResume() {
      const { data, error } = await supabase.from("resume_links").select("*").single();
      if (!error && data) {
        setResumeLinks({ en: data.url_en || "", fr: data.url_fr || "" });
      }
    }
    fetchResume();
  }, []);
  return (
    <>

{/* À PROPOS */}
      <section id="about" className="about_area pt-120 30 bg-gray-50">
        <div className="about_wrapper">
          <div
            className="about_image bg_cover"
            style={{ backgroundImage: "url(/images/moutie.png)" }}
          ></div>
          <div className="container">
            <div className="row justify-content-end">
              <div className="col-lg-6">
                <div className="about_content">
                  <div className="section_title">
                    <h3 className="title">
                      À PROPOS  <br />   <span> Qui suis-je et ce que je fais</span>
                    </h3>
                    <p>Lorsque vos machines s'arrêtent, votre activité s'arrête aussi. Je suis <strong>Fekhar Moutie</strong>, ingénieur en automatisme et électronique en Algérie, et ma mission est de relancer votre production dans les plus brefs délais.</p>
                    <br />
                    <p>Contrairement aux approches de maintenance traditionnelles, j'interviens directement au niveau composant (PCB). En tant que technicien indépendant, je maîtrise à la fois la théorie du contrôle, la programmation PLC et la microélectronique. Cette double casquette me permet de diagnostiquer les pannes industrielles les plus complexes et de réparer vos cartes de contrôle à la source.</p>
                    <br />
                    <p>Mon engagement : vous fournir des solutions techniques sur mesure, transparentes et hautement fiables pour garantir l'efficacité maximale de vos opérations.</p>
                    
                    {/* Attractive Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-6 sm:mt-10">
                      {resumeLinks.fr && (
                        <a 
                          href={resumeLinks.fr} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2.5 px-6 sm:px-8 py-3 bg-slate-900 hover:bg-[#ff6600] text-white rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 no-underline"
                        >
                           <i className="fas fa-file-pdf text-lg"></i> Mon CV (Français)
                        </a>
                      )}
                      {resumeLinks.en && (
                        <a 
                          href={resumeLinks.en} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2.5 px-6 sm:px-8 py-3 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-[#ff6600] hover:text-[#ff6600] rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 no-underline"
                        >
                           <i className="fas fa-file-pdf text-lg"></i> Mon CV (Anglais)
                        </a>
                      )}
                    </div>

<div className="flex gap-5 mt-50  justify-center ">
  <a href="https://www.linkedin.com/in/moutie/"
    target="_blank"
    rel="noopener noreferrer"

className="text-primary hover:text-secondary" >
    <i className="fab fa-linkedin fa-2x"></i>
  </a>
  <a href="https://facebook.com/mogeek02"
    target="_blank"
    rel="noopener noreferrer"

className="text-primary hover:text-secondary">
    <i className="fab fa-facebook fa-2x"></i>
  </a>
  <a href="https://github.com/MOGEEK02"
    target="_blank"
    rel="noopener noreferrer"

className="text-primary hover:text-secondary">
    <i className="fab fa-github fa-2x"></i>
  </a>
  <a href="https://wa.me/213778461682" className="text-primary hover:text-secondary">
    <i className="fab fa-whatsapp fa-2x"></i>
  </a>
  
</div>

                  </div>
                 
                </div>

                <div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        </section>

    </>
    );
}
export default AboutUs;
