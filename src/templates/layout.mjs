import { writerTool } from "./writer-tool.mjs";
import { formatCheck } from "../js/check.js";
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const NAV = [
  ["/", "Tool"],
  ["/how-to-write-a-check-with-cents/", "With cents"],
  ["/how-to-write-a-check-for-rent/", "Rent"],
  ["/how-to-write-a-check-amount-in-words/", "Amount in words"],
  ["/amount-in-words-checker/", "Checker"],
];
const FOOTER = [["/about/", "About"], ["/privacy/", "Privacy"], ["/editorial-policy/", "Editorial policy"], ["/disclaimer/", "Disclaimer"], ["/contact/", "Contact"]];

const TOOLS = {
  writer: (v = "") => writerTool(v),
  checker: () => `<section class="card" data-tool="checker" aria-label="Amount checker">
<label for="c-amt">Amount in numbers</label><input id="c-amt" data-in="amount" inputmode="decimal" autocomplete="off" placeholder="1,250.50">
<label for="c-words">Amount in words</label><input id="c-words" data-in="words" autocomplete="off" placeholder="One thousand two hundred fifty and 50/100">
<p class="verdict" role="status" data-out="result"></p></section>`,
};

function examples(list) {
  const rows = list.split(",").map((a) => {
    const r = formatCheck(a.trim());
    return `<tr><td>$${r.numeric}</td><td>${r.words}</td></tr>`;
  });
  return `<div class="table-wrap"><table><thead><tr><th>Amount</th><th>Write it as</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
}

export function render(p, { base, site }) {
  const url = p.slug === "404" ? "" : p.slug ? `/${p.slug}/` : "/";
  const body = (p.body || "")
    .replace(/\{\{examples:([^}]+)\}\}/g, (_, l) => examples(l))
    .replace(/href="\//g, `href="${base}/`);
  const tool = p.tool ? TOOLS[p.tool](p.prefill) : "";
  const link = ([href, label]) => `<a href="${base}${href}"${href === url ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title><meta name="description" content="${esc(p.description)}">
${p.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${site}${base}${url}">`}
<link rel="stylesheet" href="${base}/assets/style.css"></head>
<body><header class="site-header"><div class="wrap"><a class="brand" href="${base}/">Business<span>Tools</span></a><nav aria-label="Main">${NAV.map(link).join("")}</nav></div></header>
<main class="wrap"><h1>${esc(p.h1)}</h1>${p.lead ? `<p class="lead">${esc(p.lead)}</p>` : ""}${tool}
<article class="prose">${body}</article>${p.updated ? `<p class="meta">Last updated: ${p.updated}</p>` : ""}</main>
<footer class="site-footer"><div class="wrap"><nav aria-label="Footer">${FOOTER.map(link).join("")}</nav><p>Educational tool, not legal or banking advice.</p></div></footer>
${p.tool ? `<script type="module" src="${base}/assets/js/ui.js"></script>` : ""}</body></html>`;
}
