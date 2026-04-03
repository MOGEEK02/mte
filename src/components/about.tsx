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
                      Bonjour ! Je suis <strong>Fekhar Moutie</strong>, ingénieur en automatisme et électronique basé en Algérie. Spécialisé dans la programmation PLC, le diagnostic de pannes industrielles et la réparation au niveau composant, je propose des solutions de maintenance complètes pour les cartes de contrôle industriel, les systèmes d'automatisation et les réseaux électroniques.
                      <br /><br />
                      En tant que technicien de terrain indépendant dirigeant une entreprise spécialisée, j'ai développé une expertise approfondie en théorie du contrôle, automatisation des processus et intégration de systèmes. Je m'engage à résoudre les pannes complexes jusqu'au niveau PCB, en garantissant un temps d'arrêt minimal. Je comprends que lorsque vos machines s'arrêtent, votre activité s'arrête aussi.
                      <br /><br />
                      Qu'il s'agisse de mettre en service des systèmes SCADA, de configurer des variateurs de vitesse (VFD) ou de dépanner des entraînements industriels anciens, je fournis des solutions techniques personnalisées, honnêtes et hautement fiables pour maintenir vos opérations à leur efficacité maximale.
                    </p>
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
