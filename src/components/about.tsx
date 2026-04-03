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
                      ABOUT ME  <br />   <span> Who I Am & What I Do</span>
                    </h3>
                    <p className="mt-4 text-justify">
                      Hello! I'm <strong>Fekhar Moutie</strong>, an Automation and Electronics Engineer based in Algeria. Specializing in PLC programming, industrial fault diagnosis, and component-level repair, I deliver comprehensive maintenance solutions for industrial control boards, automation systems, and electronic networks.
                      <br /><br />
                      Running a specialized business as an independent field technician, I have developed a deep expertise in control theory, process automation, and system integration. I pride myself on resolving complex faults right down to the PCB level, ensuring minimal downtime. I understand that when your machines stop, your business stops too.
                      <br /><br />
                      Whether it involves commissioning SCADA systems, configuring VFDs, or troubleshooting legacy industrial drives, I provide customized, honest, and highly reliable technical solutions to keep your operations running at peak efficiency.
                    </p>
                    <div className="flex gap-5 mt-50  justify-center ">
                      <a href="https://github.com/your-username"
                        target="_blank"
                        rel="noopener noreferrer"

                        className="text-primary hover:text-secondary" >
                        <i className="fab fa-linkedin fa-2x"></i>
                      </a>
                      <a href="https://github.com/your-username"
                        target="_blank"
                        rel="noopener noreferrer"

                        className="text-primary hover:text-secondary">
                        <i className="fab fa-facebook fa-2x"></i>
                      </a>
                      <a href="https://github.com/your-username"
                        target="_blank"
                        rel="noopener noreferrer"

                        className="text-primary hover:text-secondary">
                        <i className="fab fa-github fa-2x"></i>
                      </a>
                      <a href="www.w.app/213778461682" className="text-primary hover:text-secondary">
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
