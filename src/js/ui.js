import { formatCheck } from "./check.js";
import { verifyCheck } from "./checker.js";
import { interpret } from "./smart.js";

const $ = (root, sel) => root.querySelector(sel);
const out = (root, key, value) => { $(root, `[data-out=${key}]`).textContent = value; };
const PLACEHOLDER = "Your result appears here.";

function setWords(root, text) {
  const el = $(root, "[data-out=words]");
  el.textContent = "";
  const m = /^(.*?)(\s?and \d{2}\/100)$/i.exec(text);
  if (!m) { el.textContent = text; return; }
  el.append(m[1]);
  const keep = document.createElement("span");
  keep.className = "nb"; keep.textContent = m[2];
  el.append(keep);
}

function writer(root) {
  const input = $(root, "[data-in=amount]"), verify = $(root, "[data-in=verify]");
  const copy = $(root, "[data-act=copy]"), chip = $(root, "[data-act=suggest]");
  const opt = (k) => $(root, `[data-opt=${k}]`);
  let pending = null;

  const view = (words, numeric, note, error, verdict) => {
    setWords(root, words); out(root, "numeric", numeric); out(root, "note", note); out(root, "error", error);
    const box = $(root, "[data-out=result]");
    box.className = "verdict " + (verdict?.ok ? "ok" : "bad"); box.textContent = verdict?.text ?? "";
    copy.disabled = words === PLACEHOLDER || !!error;
  };
  const run = () => {
    const s = interpret(input.value);
    chip.hidden = true; pending = null;
    if (s.kind === "empty") return view(PLACEHOLDER, "$0.00", "", "");
    if (s.kind === "invalid") return view(PLACEHOLDER, "$0.00", "", s.error);
    if (s.kind === "suggest") { chip.textContent = s.suggestion.label; chip.hidden = false; pending = s.suggestion.value; return view(PLACEHOLDER, "$0.00", "", ""); }
    const options = { dollarsWord: opt("dollarsWord").checked, letterCase: opt("letterCase").value, cents: opt("cents").value };
    try {
      const r = formatCheck(s.amount, options);
      let verdict = null;
      if (verify.value.trim()) { const v = verifyCheck(s.amount, verify.value); verdict = { ok: v.match, text: v.match ? "✓ The numbers and words match." : `✗ Mismatch. Expected: ${v.expected}` }; }
      view(r.words, "$" + r.numeric, s.note || "", "", verdict);
    } catch (e) { view(PLACEHOLDER, "$0.00", "", e.message); }
  };
  chip.addEventListener("click", () => { if (pending) { input.value = pending; run(); input.focus(); } });
  copy.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($(root, "[data-out=words]").textContent); copy.textContent = "Copied!"; }
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
    box.className = "verdict"; box.textContent = "";
    if (!a.trim() || !w.trim()) return;
    const s = interpret(a);
    try {
      if (!s.amount) throw new Error(s.error || s.suggestion?.label || "Enter a valid amount.");
      const r = verifyCheck(s.amount, w);
      box.className = "verdict " + (r.match ? "ok" : "bad");
      box.textContent = r.match ? "✓ The numbers and words match." : `✗ Mismatch. Expected: ${r.expected}`;
    } catch (e) { box.className = "verdict bad"; box.textContent = e.message; }
  };
  root.addEventListener("input", run);
}

document.querySelectorAll("[data-tool]").forEach((r) => ({ writer, checker })[r.dataset.tool]?.(r));
