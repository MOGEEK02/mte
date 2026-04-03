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
                    <p>
                     Je m'appelle Fekhar Moutie, j'ai 24 ans et je dirige une entreprise spécialisée dans la réparation d'électronique industrielle en Algérie. Fort d'une solide formation en électronique et en ingénierie d'automatisation, j'ai des années d'expérience dans la réparation et la maintenance d'automates PLC, de cartes de contrôle industriel, de systèmes d'automatisation et de commandes électroniques.

Je travaille de manière indépendante, en offrant une attention personnalisée, un service honnête et des solutions pratiques à des prix compétitifs. Chaque réparation compte pour moi, car je comprends que lorsque vos machines s'arrêtent, votre activité s'arrête aussi. Qu'il s'agisse de dépanner des variateurs industriels, des capteurs ou des panneaux opérateur, j'assure des solutions fiables qui maintiennent vos opérations en marche. </p>
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
