const cards = [
  {
    title: "Variable Frequency Drives (VFD) & Motor Drives",
    description: "Repair, calibration, and replacement of AC/DC drives and industrial motor controllers.",
    image: "/images/vfd.jpeg"
  },
  {
    title: "PLC & Controller Repair",
    description: "Troubleshooting, programming, and maintenance of industrial PLCs and controllers.",
    image: "/images/plcprogram.jpg"
  },
  {
    title: "Electronic Repair",
    description: "Professional repair and maintenance of industrial electronics, including ICs, PLCs, drives, sensors, and control systems",
    image: "/images/pcb.jpeg"
  },
  {
    title: "HMI & Control Panels",
    description: "Installation, repair, and configuration of Human-Machine Interfaces and operator panels.",
    image: "/images/hmipanel.jpeg"
  },
  {
    title: "Power Supplies",
    description: "Repair and replacement of industrial power supply units.",
    image: "/images/powersupply.png"
  },
  {
    title: "Sensors & Transducers Maintenance",
    description: "Diagnosis and repair of industrial sensors, temperature probes, pressure, and flow transducers.",
    image: "/images/sensor.avif"
  },

];

export default function ExpertiseSection() {
  return (
    <section id="services" className="bg-gray-100 lg:px-800 pt-5 "> 
      {/* Section Title */}

       <div className="section_title pl-100 pb-50">
                    <h3  className="title "> Services ­<br/>
                        <span>  What We Do </span>
                    </h3>
                    <p>
                     We specialize in repairing and maintaining industrial electronics equipment. Below are the main devices and systems we handle.
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
            <h3 className="tw-text-yellow-500 tw-text-2xl font-bold p-4">{card.title}</h3>
            

            {/* Description */}
            <p className="text-gray-800 text-sm p-4 pt-0 flex-grow">{card.description}</p>
 <img
              src={card.image}
              alt={card.title}
              className="w-full h-50 object-cover rounded-b-xl"
            />
           
          </div>
        ))}
      </div>
    </section>
  );
}
