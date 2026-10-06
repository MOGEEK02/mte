import { Link } from "react-router-dom";
import { Seo } from "../ui/Seo";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-start justify-center pt-28 pb-20">
      <Seo title="Page introuvable | MTE" description="Cette page n’existe pas ou a été déplacée." noindex />
      <p className="eyebrow text-navy-700">Erreur 404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900">Page introuvable</h1>
      <p className="mt-4 max-w-md text-slate-600">Cette page n’existe pas ou a été déplacée.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/" className="btn-primary">Retour à l’accueil</Link>
        <Link to="/portfolio" className="btn-outline">Voir les réalisations</Link>
      </div>
    </section>
  );
}
