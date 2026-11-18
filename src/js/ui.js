import { formatCheck } from "./check.js";
import { verifyCheck } from "./checker.js";

const $ = (root, sel) => root.querySelector(sel);
const out = (root, key, value) => { $(root, `[data-out=${key}]`).textContent = value; };
const PLACEHOLDER = "Your result appears here.";

function writer(root) {
  const input = $(root, "[data-in=amount]");
  const copy = $(root, "[data-act=copy]");
  const opt = (k) => $(root, `[data-opt=${k}]`);
  const run = () => {
    const options = { dollarsWord: opt("dollarsWord").checked, letterCase: opt("letterCase").value, cents: opt("cents").value };
    $(root, ".pre").hidden = options.dollarsWord || options.cents === "words";
    if (!input.value.trim()) { out(root, "words", PLACEHOLDER); out(root, "numeric", "$0.00"); out(root, "error", ""); copy.disabled = true; return; }
    try {
      const r = formatCheck(input.value, options);
      out(root, "words", r.words); out(root, "numeric", "$" + r.numeric); out(root, "error", ""); copy.disabled = false;
    } catch (e) { out(root, "error", e.message); copy.disabled = true; }
  };
  copy.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($(root, "[data-out=words]").textContent); copy.textContent = "Copied ✓"; }
    catch { copy.textContent = "Copy unavailable"; }
    setTimeout(() => { copy.textContent = "Copy words"; }, 1800);
  });
  root.addEventListener("input", run);
  root.addEventListener("change", run);
  run();
}

function checker(root) {
  const run = () => {
    const a = $(root, "[data-in=amount]").value, w = $(root, "[data-in=words]").value;
    const box = $(root, "[data-out=result]");
    box.className = "verdict";
    if (!a.trim() || !w.trim()) { box.textContent = ""; return; }
    try {
      const r = verifyCheck(a, w);
      box.className = "verdict " + (r.match ? "ok" : "bad");
      box.textContent = r.match ? "✓ The numbers and words match." : `✗ Mismatch. Expected: ${r.expected}`;
    } catch (e) { box.className = "verdict bad"; box.textContent = e.message; }
  };
  root.addEventListener("input", run);
}

document.querySelectorAll("[data-tool]").forEach((r) => ({ writer, checker })[r.dataset.tool]?.(r));
