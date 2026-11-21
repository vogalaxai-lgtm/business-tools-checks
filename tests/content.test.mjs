import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { pages } from "../content/pages.mjs";

execFileSync("node", ["scripts/build.mjs"], { env: { ...process.env, BASE: "/bt", SITE_URL: "https://site.test", OUT_DIR: "dist-test-content" }, stdio: "pipe" });
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const html = walk("dist-test-content").filter((f) => f.endsWith(".html"));

test("page metadata is unique and sized for search", () => {
  const titles = new Set(), descs = new Set();
  for (const p of pages) {
    assert.ok(p.title && p.description && p.h1, p.slug);
    assert.ok(p.description.length >= 50 && p.description.length <= 160, `${p.slug}: description ${p.description.length}`);
    assert.ok(p.title.length <= 70, `${p.slug}: title ${p.title.length}`);
    assert.ok(!titles.has(p.title) && !descs.has(p.description), `${p.slug}: duplicate`);
    titles.add(p.title); descs.add(p.description);
  }
});
test("no placeholders, unresolved tokens or leftover TODOs ship", () => {
  for (const f of html) {
    const t = readFileSync(f, "utf8");
    assert.ok(!/TODO|\{\{|example\.com|lorem/i.test(t), f);
  }
});
test("Open Graph tags and labelled form controls", () => {
  for (const f of html) {
    const t = readFileSync(f, "utf8");
    assert.ok(t.includes('property="og:title"') && t.includes('property="og:description"'), f);
    for (const [, id] of t.matchAll(/<(?:input|select|textarea)[^>]*\sid="([^"]+)"/g)) assert.ok(t.includes(`for="${id}"`), `${f}: control #${id} has no label`);
  }
});
