import React from "react";

const AboutUs: React.FC = () => {
  return (
    <>

{/* ABOUT */}
      <section alt="moutie fekhar in sonatrach algerie " id="about" className="about_area pt-120 30 bg-gray-50">
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
                    <p>
                     My name is Fekhar Moutie, I’m 24 years old, and I run a specialized business in industrial electronics repair in Algeria. With a strong background in electronics and automation engineering, I have years of experience repairing and maintaining PLCs, industrial control boards, automation systems, and electronic controls.

I work independently, providing personalized attention, honest service, and practical solutions at competitive prices. Every repair is important to me, because I understand that when your machines stop, your business stops too. Whether it’s troubleshooting industrial drives, sensors, or operator panels, I ensure reliable solutions that keep your operations running smoothly. </p>
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
