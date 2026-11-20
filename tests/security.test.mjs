import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { render } from "../src/templates/layout.mjs";

const PAYLOADS = ['"><img src=x onerror=alert(1)>', "<script>alert(1)</script>", '"><svg onload=alert(1)>'];
test("template escapes every dynamic field", () => {
  for (const x of PAYLOADS) {
    const html = render({ slug: "x", title: x, description: x, h1: x, lead: x, prefill: x, tool: "writer", body: "" }, { base: "/b", site: "https://s.test" });
    assert.ok(!html.includes(x), x);
    assert.ok(!/<img|<svg|<script>alert/.test(html), x);
    assert.equal((html.match(/<script/g) || []).length, 1, "only the module tag");
  }
});
test("UI never uses innerHTML", () => {
  assert.ok(!/innerHTML|outerHTML|insertAdjacentHTML|document\.write/.test(readFileSync(new URL("../src/js/ui.js", import.meta.url), "utf8")));
});
