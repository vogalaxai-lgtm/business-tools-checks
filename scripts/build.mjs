import { mkdir, writeFile, cp, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pages } from "../content/pages.mjs";
import { render } from "../src/templates/layout.mjs";

const BASE = process.env.BASE ?? "";          // "/repo-name" on a project site, "" with a custom domain
const SITE = process.env.SITE_URL ?? "https://example.com";
const OUT = "dist";

await rm(OUT, { recursive: true, force: true });
for (const p of pages) {
  const file = p.slug === "404" ? "404.html" : join(p.slug, "index.html");
  await mkdir(dirname(join(OUT, file)), { recursive: true });
  await writeFile(join(OUT, file), render(p, { base: BASE, site: SITE }));
}
await cp("src/js", join(OUT, "assets/js"), { recursive: true });
await cp("src/css/style.css", join(OUT, "assets/style.css"));

const urls = pages.filter((p) => !p.noindex).map((p) => `<url><loc>${SITE}${BASE}${p.slug ? `/${p.slug}/` : "/"}</loc>${p.updated ? `<lastmod>${p.updated}</lastmod>` : ""}</url>`);
await writeFile(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`);
await writeFile(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}${BASE}/sitemap.xml\n`);
console.log(`Built ${pages.length} pages → ${OUT}/`);
