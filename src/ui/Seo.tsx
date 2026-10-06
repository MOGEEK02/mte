import { Helmet } from "react-helmet-async";
import { SITE_URL } from "../site";

type Props = {
  title: string;
  description: string;
  path?: string;
  image?: string | null;
  type?: "website" | "article";
  noindex?: boolean;
};

const DEFAULT_IMAGE = `${SITE_URL}/images/web/og-default.png`;

/** Per-page title, description, canonical URL and social-preview tags. */
export function Seo({ title, description, path, image, type = "website", noindex }: Props) {
  const url = path !== undefined ? `${SITE_URL}${path}` : undefined;
  const img = image || DEFAULT_IMAGE;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      {url && <link rel="canonical" href={url} />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={img} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
}
