import { select } from "./db";
import type { Lang } from "./i18n";
import { createStore } from "./store";

/** Customer reviews, edited in /admin → Avis clients ("testimonials" table). Shown in their own language. */
export type Testimonial = {
  id: number;
  name: string;
  company: string;
  city: string;
  quote: string;
  lang: Lang;
  rating: number | null;
};

export function fetchTestimonials(): Promise<Testimonial[]> {
  return select<Testimonial>("testimonials", {
    select: "id,name,company,city,quote,lang,rating",
    published: "eq.true",
    order: "sort_order.asc,id.asc",
  });
}

export const testimonialsStore = createStore<Testimonial[]>({ key: "testimonials", fallback: [], load: fetchTestimonials });
