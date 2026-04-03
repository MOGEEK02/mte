import React from "react";

const AboutUs: React.FC = () => {
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
                    <p>Au-delà de la réparation, j'accompagne les industriels dans la <strong>rénovation de leurs équipements (rétrofit)</strong>, en modernisant les systèmes de contrôle obsolètes pour prolonger la durée de vie de leurs parcs machines.</p>
                    <br />
                    <p><strong>Mon expertise couvre :</strong></p>
                    <ul style={{ paddingLeft: "1.2rem", marginBottom: "1rem" }}>
                      <li><strong>La réparation au niveau PCB :</strong> Diagnostic et dépannage complexe de cartes de contrôle.</li>
                      <li><strong>L'automatisation et le Rétrofit :</strong> Programmation PLC et renouvellement complet du système de contrôle de vos anciennes machines.</li>
                      <li><strong>Interface et Contrôle :</strong> Configuration d'écrans tactiles (IHM/HMI) et paramétrage de variateurs de vitesse (VFD).</li>
                      <li><strong>Intervention sur équipements spécifiques :</strong> Presses à injection plastique, machines de l'industrie agroalimentaire, presses industrielles, machines à coudre industrielles (fabrication de chaussures), etc.</li>
                    </ul>
                    <p>Mon engagement : vous fournir des solutions techniques sur mesure, transparentes et hautement fiables pour garantir l'efficacité maximale de vos opérations.</p>
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
