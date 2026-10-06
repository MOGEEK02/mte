import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { basePath, localePath, useLang, useT } from "../i18n";
import { Seo } from "../ui/Seo";

export default function NotFound() {
  const lang = useLang();
  const { notFound: t, seo } = useT();
  const { pathname } = useLocation();
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-start justify-center pt-28 pb-20">
      <Seo lang={lang} path={basePath(pathname)} title={seo.notFoundTitle} description={seo.notFoundDescription} noindex />
      <p className="eyebrow text-navy-700">{t.eyebrow}</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900">{t.title}</h1>
      <p className="mt-4 max-w-md text-slate-600">{t.text}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to={localePath(lang, "/")} className="btn-primary">{t.home}</Link>
        <Link to={localePath(lang, "/portfolio")} className="btn-outline">{t.work}</Link>
      </div>
    </section>
  );
}
