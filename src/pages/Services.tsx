import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { STEPS } from "../site";
import { ServiceCards } from "../ui/ServiceCards";
import { Seo } from "../ui/Seo";

export default function Services() {
  return (
    <>
      <Seo
        title="Services – programmation PLC, dépannage d’armoires, rétrofit, variateurs | MTE Algérie"
        description="Programmation d’automates et d’écrans IHM, diagnostic et dépannage d’armoires de commande, conception et rétrofit, paramétrage de variateurs. Médéa et toute l’Algérie."
        path="/services"
      />

      <section className="bg-grid bg-navy-950 pt-32 pb-14 sm:pt-36 sm:pb-16">
        <div className="container-page">
          <p className="eyebrow text-brand">Services</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            L’automatisme de vos machines, du programme à l’armoire
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            Programmation d’automates, recherche de pannes, modernisation d’armoires et mise en service de variateurs :
            nous intervenons sur toute la partie commande de vos machines, sur site partout en Algérie.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-14 sm:py-20">
        <div className="container-page">
          <ServiceCards />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">Comment nous travaillons</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="border-t-2 border-brand pt-4">
                <span className="font-display text-sm font-semibold tracking-widest text-navy-700">ÉTAPE {i + 1}</span>
                <h3 className="mt-1 font-semibold text-navy-900">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-xl bg-navy-900 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="text-lg font-semibold text-white">Une machine à l’arrêt ou un projet d’automatisme ?</h2>
              <p className="mt-1 text-sm text-slate-300">Décrivez votre besoin : nous revenons vers vous rapidement.</p>
            </div>
            <Link to="/#contact" className="btn-primary shrink-0">
              Demander un devis
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
