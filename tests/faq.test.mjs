import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const OUT = "dist-test-faq";
execFileSync("node", ["scripts/build.mjs"], { env: { ...process.env, BASE: "/bt", SITE_URL: "https://site.test", OUT_DIR: OUT }, stdio: "pipe" });

test("FAQ structured data is valid and matches the visible questions", () => {
  for (const page of ["index.html", "how-to-write-a-check-with-cents/index.html"]) {
    const html = readFileSync(`${OUT}/${page}`, "utf8");
    const m = /<script type="application\/ld\+json">(.*?)<\/script>/s.exec(html);
    assert.ok(m, page);
    const data = JSON.parse(m[1]);
    assert.equal(data["@type"], "FAQPage");
    const summaries = [...html.matchAll(/<summary>(.*?)<\/summary>/g)].map((x) => x[1]);
    assert.equal(data.mainEntity.length, summaries.length - (html.includes("Formatting options") ? 1 : 0), page);
    for (const q of data.mainEntity) { assert.ok(summaries.includes(q.name), q.name); assert.ok(html.includes(q.acceptedAnswer.text), q.name); }
  }
});
test("table cells keep the cents fraction unbreakable", () => {
  assert.match(readFileSync(`${OUT}/index.html`, "utf8"), /<td>One thousand two hundred fifty<span class="nb"> and 50\/100<\/span><\/td>/);
});
