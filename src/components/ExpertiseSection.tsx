const cards = [
  {
    title: "AC & DC Drives",
    description: "Repair, maintenance, and replacement of industrial motor drives.",
    image: "/images/vfd.jpeg"
  },
  {
    title: "PLC & I/O Modules",
    description: "Troubleshooting, programming, and repairing PLC systems and I/O cards.",
    image: "/images/plcprogram.jpg"
  },
  {
    title: "Electronic Repair",
    description: "Professional repair and maintenance of industrial electronics, including ICs, PLCs, drives, sensors, and control systems",
    image: "/images/pcb.jpeg"
  },
  {
    title: "Industrial PCs & HMIs",
    description: "Maintenance and repair of industrial PCs, touchscreens, and HMI devices.",
    image: "/images/plcprogram"
  },
  {
    title: "Power Supplies",
    description: "Repair and replacement of industrial power supply units.",
    image: "/images/powersupply.png"
  },
  {
    title: "Valves & Actuators",
    description: "Servicing industrial valves, pneumatic and electric actuators.",
    image: "https://via.placeholder.com/300x200?text=Valves+Actuators"
  },

];

export default function ExpertiseSection() {
  return (
    <section id="services" className="bg-gray-100 lg:px-800 pt-5"> 
      {/* Section Title */}

       <div className="section_title pl-100">
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
