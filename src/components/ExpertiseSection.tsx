const cards = [
  {
    title: "Variateurs de Vitesse (VFD)",
    titleAr: "محولات التردد (VFD)",
    description: "Réparation, calibration et remplacement de variateurs AC/DC et contrôleurs de moteurs industriels.",
    descriptionAr: "إصلاح ومعايرة واستبدال محولات التردد ووحدات التحكم في المحركات الصناعية.",
    image: "/images/vfd.jpeg"
  },
  {
    title: "Réparation & Programmation PLC",
    titleAr: "إصلاح وبرمجة PLC",
    description: "Dépannage, programmation et maintenance d'automates programmables industriels.",
    descriptionAr: "تشخيص وبرمجة وصيانة أجهزة التحكم المنطقي القابل للبرمجة.",
    image: "/images/plcprogram.jpg"
  },
  {
    title: "Réparation Électronique",
    titleAr: "إصلاح الإلكترونيات",
    description: "Réparation professionnelle de cartes électroniques industrielles : circuits intégrés, capteurs et systèmes de contrôle.",
    descriptionAr: "إصلاح احترافي للبطاقات الإلكترونية الصناعية: دوائر متكاملة، حساسات وأنظمة تحكم.",
    image: "/images/pcb.jpeg"
  },
  {
    title: "Panneaux HMI & Contrôle",
    titleAr: "شاشات HMI ولوحات التحكم",
    description: "Installation, réparation et configuration d'interfaces homme-machine et panneaux opérateur.",
    descriptionAr: "تركيب وإصلاح وبرمجة واجهات التشغيل ولوحات التحكم.",
    image: "/images/hmipanel.jpeg"
  },
  {
    title: "Alimentations Électriques",
    titleAr: "مصادر التغذية الكهربائية",
    description: "Réparation et remplacement d'alimentations industrielles.",
    descriptionAr: "إصلاح واستبدال وحدات التغذية الكهربائية الصناعية.",
    image: "/images/powersupply.png"
  },
  {
    title: "Capteurs & Transducteurs",
    titleAr: "الحساسات والمحولات",
    description: "Diagnostic et réparation de capteurs industriels : sondes de température, pression et débit.",
    descriptionAr: "تشخيص وإصلاح الحساسات الصناعية: مسابر الحرارة والضغط والتدفق.",
    image: "/images/sensor.avif"
  },
];

export default function ExpertiseSection() {
  return (
    <section id="services" className="bg-gray-100 lg:px-800 pt-5 "> 
      {/* Section Title */}

       <div className="section_title pl-100 pb-50">
                    <h3  className="title ">Nos Services / خدماتنا<br/>
                        <span>  Ce Que Nous Faisons | ماذا نقدم </span>
                    </h3>
                    <p>
                     Nous sommes spécialisés dans la réparation et la maintenance des équipements électroniques industriels. Voici les principaux systèmes que nous traitons.
                    </p>
                    <p dir="rtl" style={{ marginTop: "0.5rem" }}>
                      نحن متخصصون في إصلاح وصيانة المعدات الإلكترونية الصناعية. فيما يلي الأنظمة الرئيسية التي نتعامل معها.
                    </p>
                    </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <div
            key={i}
            className="tw-bg-white- rounded-xl shadow-lg overflow-hidden 
            transform transition duration-300 hover:scale-105 cursor-pointer flex flex-col"
          >
            {/* Title */}
            <h3 className="tw-text-yellow-500 tw-text-2xl font-bold p-4">
              {card.title}
              <br />
              <span dir="rtl" style={{ fontSize: "0.9rem", fontWeight: "normal", opacity: 0.85 }}>{card.titleAr}</span>
            </h3>

            {/* Description */}
            <p className="text-gray-800 text-sm p-4 pt-0 flex-grow">
              {card.description}
              <br />
              <span dir="rtl" style={{ display: "block", marginTop: "0.3rem", opacity: 0.8 }}>{card.descriptionAr}</span>
            </p>
            <img
              src={card.image}
              alt={`${card.title} – ${card.titleAr} | MTE Algérie`}
              className="w-full h-50 object-cover rounded-b-xl"
            />
           
          </div>
        ))}
      </div>
    </section>
  );
}
