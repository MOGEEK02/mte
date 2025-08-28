import React from "react";

const expertise = [
  { title: "Drives & Motors", img: "/images/drives.png" },
  { title: "Controllers & PLCs", img: "/images/controllers.png" },
  { title: "Sensors & Transducers", img: "/images/sensors.png" },
  { title: "Power & Circuitry", img: "/images/power.png" },
  { title: "Measurement & Monitoring", img: "/images/measurement.png" },
  { title: "I/O Modules", img: "/images/io.png" },
  { title: "Industrial Computing", img: "/images/computing.png" },
  { title: "Safety & Automation", img: "/images/safety.png" },
  { title: "Miscellaneous Equipment", img: "/images/misc.png" },
];

const ExpertiseGrid: React.FC = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Expertise</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {expertise.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-xl transition"
            >
              <img
                src={item.img}
                alt={item.title}
                className="mx-auto mb-4 h-16 w-16 object-contain"
              />
              <h3 className="text-lg font-semibold">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseGrid;