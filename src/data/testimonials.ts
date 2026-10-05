// Real client testimonials only. Add genuine quotes here and the
// "Témoignages / Testimonials" section will appear automatically.
// Leave empty to hide the section (no fabricated reviews).

export interface Testimonial {
  quote: string;
  author: string;      // e.g. "Karim B."
  role?: string;       // e.g. "Responsable maintenance, Cimenterie X"
  date?: string;       // e.g. "2025"
}

export const testimonials: Testimonial[] = [
  // Example (remove and replace with real ones):
  // {
  //   quote: "Variateur réparé et machine relancée en 48h. Service rapide et sérieux.",
  //   author: "Karim B.",
  //   role: "Responsable maintenance",
  //   date: "2025",
  // },
];
