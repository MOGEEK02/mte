import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { HelmetProvider, type HelmetServerState } from "@dr.pogodin/react-helmet";
import App from "./App";

export { SERVICE_SLUGS } from "./i18n";

/** Render a route to static HTML + collected <head> tags (used by scripts/prerender.mjs). */
export function render(url: string) {
  let helmet: HelmetServerState | undefined;
  const html = renderToString(
    <StrictMode>
      <HelmetProvider onServerState={(state) => (helmet = state)}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>
  );
  return { html, helmet };
}
