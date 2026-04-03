import React from "react";

const AboutUs: React.FC = () => {
  return (
    <>

{/* ABOUT */}
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
                      À PROPOS  <br />   <span> Qui suis-je | من أنا</span>
                    </h3>
                    <p className="mt-4 text-justify">
                      Je suis <strong>Fekhar Moutie</strong>, ingénieur en automatisme et électronique basé en Algérie. Spécialisé dans la programmation PLC, le diagnostic de pannes industrielles et la réparation au niveau composant, je propose des solutions complètes de maintenance pour les cartes de contrôle industriel, les systèmes d'automatisation et les réseaux électroniques.
                      <br /><br />
                      En tant que technicien indépendant, j'ai développé une expertise approfondie en théorie de contrôle, automatisation des processus et intégration de systèmes. Je m'engage à résoudre les pannes complexes directement au niveau PCB, en assurant un temps d'arrêt minimal. Je comprends que lorsque vos machines s'arrêtent, votre activité s'arrête aussi.
                      <br /><br />
                      Qu'il s'agisse de mettre en service des systèmes SCADA, de configurer des variateurs de vitesse ou de dépanner des entraînements industriels, je fournis des solutions techniques personnalisées, honnêtes et fiables pour maintenir vos opérations à leur efficacité maximale.
                    </p>

                    {/* Arabic version */}
                    <div dir="rtl" className="mt-4 text-justify" style={{ fontFamily: "inherit", lineHeight: "1.9" }}>
                      <p>
                        أنا <strong>فخار موتي</strong>، مهندس أتمتة وإلكترونيات في الجزائر. متخصص في برمجة PLC، تشخيص الأعطال الصناعية، وإصلاح البطاقات الإلكترونية على مستوى المكونات.
                        <br /><br />
                        كفني مستقل، طوّرت خبرة عميقة في نظرية التحكم، أتمتة العمليات، وتكامل الأنظمة. أضمن حل الأعطال المعقدة مباشرة على مستوى الـPCB مع تقليل وقت التوقف إلى أدنى حد. أفهم جيداً أنه عندما تتوقف آلاتكم، يتوقف نشاطكم التجاري.
                        <br /><br />
                        سواء تعلق الأمر بتشغيل أنظمة SCADA، ضبط محولات التردد، أو إصلاح المحركات الصناعية، أقدم حلولاً تقنية مخصصة وموثوقة للحفاظ على كفاءة عملياتكم.
                      </p>
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
