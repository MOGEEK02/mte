const cards = [
  {
    title: "Variateurs de Vitesse (VFD) et Entraînements Moteur",
    description: "Réparation, calibration et remplacement de variateurs AC/DC et contrôleurs de moteurs industriels.",
    image: "/images/vfd.jpeg"
  },
  {
    title: "Réparation et Programmation PLC",
    description: "Dépannage, programmation et maintenance d'automates programmables industriels (Siemens, Schneider, Omron, Fatek).",
    image: "/images/plcprogram.jpg"
  },
  {
    title: "Réparation Électronique",
    description: "Réparation professionnelle de cartes électroniques industrielles : circuits intégrés, composants CMS, capteurs et systèmes de contrôle.",
    image: "/images/pcb.jpeg"
  },
  {
    title: "Panneaux HMI et Contrôle",
    description: "Installation, réparation et configuration d'interfaces homme-machine et panneaux opérateur.",
    image: "/images/hmipanel.jpeg"
  },
  {
    title: "Alimentations Électriques",
    description: "Réparation et remplacement d'alimentations industrielles (AC/DC, onduleurs).",
    image: "/images/powersupply.png"
  },
  {
    title: "Capteurs et Transducteurs",
    description: "Diagnostic et réparation de capteurs industriels : sondes de température, pression et débit.",
    image: "/images/sensor.avif"
  },
];

export default function ExpertiseSection() {
  return (
    <section id="services" className="bg-gray-100 lg:px-800 pt-5 "> 
      {/* Titre de la section */}

       <div className="section_title pl-100 pb-50">
                    <h3  className="title ">Nos Services<br/>
                        <span>  Ce que nous faisons</span>
                    </h3>
                    <p>
                     Nous sommes spécialisés dans la réparation et la maintenance d'équipements électroniques industriels. Voici les principaux appareils et systèmes que nous prenons en charge.
                    </p>
                    </div>

      {/* Cartes */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <div
            key={i}
            className="tw-bg-white- rounded-xl shadow-lg overflow-hidden 
            transform transition duration-300 hover:scale-105 cursor-pointer flex flex-col"
          >
            {/* Titre */}
            <h3 className="tw-text-yellow-500 tw-text-2xl font-bold p-4">{card.title}</h3>
            

            {/* Description */}
            <p className="text-gray-800 text-sm p-4 pt-0 flex-grow">{card.description}</p>
 <img
              src={card.image}
              alt={`${card.title} – Réparation électronique industrielle MTE Algérie`}
              className="w-full h-50 object-cover rounded-b-xl"
            />
           
          </div>
        ))}
      </div>
    </section>
  );
}
