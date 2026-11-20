import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const BASE = "/bt", SITE = "https://site.test";
execFileSync("node", ["scripts/build.mjs"], { env: { ...process.env, BASE, SITE_URL: SITE }, stdio: "pipe" });
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = walk("dist"), html = files.filter((f) => f.endsWith(".html"));
const resolves = (p) => { const rel = p.slice(BASE.length).split(/[?#]/)[0]; const f = join("dist", rel); return existsSync(f) && (statSync(f).isFile() || existsSync(join(f, "index.html"))); };

test("no placeholder site URL in the build", () => {
  for (const f of files) {
    const t = readFileSync(f, "utf8");
    assert.ok(!/https?:\/\/example\.com/.test(t), f);
    if (t.includes("@example.com")) console.warn(`WARNING: placeholder email still in ${f}`);
  }
});
test("all internal links and assets resolve under the base path", () => {
  for (const f of html) for (const [, u] of readFileSync(f, "utf8").matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    assert.ok(u.startsWith(BASE + "/"), `${f}: root-relative leak ${u}`);
    assert.ok(resolves(u), `${f}: broken ${u}`);
  }
});
test("SEO: canonical, noindex, sitemap, robots", () => {
  for (const f of html) {
    const h = readFileSync(f, "utf8");
    if (f.endsWith("404.html")) assert.ok(h.includes('name="robots" content="noindex"'));
    else assert.ok(new RegExp(`rel="canonical" href="${SITE}${BASE}/`).test(h), f);
  }
  const sm = readFileSync("dist/sitemap.xml", "utf8");
  assert.ok(!sm.includes("404") && sm.includes(`${SITE}${BASE}/how-to-write-a-check-with-cents/`));
  for (const [, u] of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) assert.ok(resolves(u.replace(SITE, "")), u);
  assert.ok(readFileSync("dist/robots.txt", "utf8").includes(`Sitemap: ${SITE}${BASE}/sitemap.xml`));
});
