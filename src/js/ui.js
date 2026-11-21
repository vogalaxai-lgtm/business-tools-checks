import { writerView, checkerView } from "./view-model.js";

const $ = (root, sel) => root.querySelector(sel);
const setVerdict = (box, v) => { box.className = "verdict" + (v ? (v.ok ? " ok" : " bad") : ""); box.textContent = v ? v.text : ""; };

function setWords(el, text) {
  el.textContent = "";
  const m = /^(.*?)(\s?and \d{2}\/100)$/i.exec(text);
  if (!m) { el.textContent = text; return; }
  const keep = document.createElement("span");
  keep.className = "nb"; keep.textContent = m[2];
  el.append(m[1], keep);
}

function writer(root) {
  const input = $(root, "[data-in=amount]"), verify = $(root, "[data-in=verify]");
  const copy = $(root, "[data-act=copy]"), chip = $(root, "[data-act=suggest]");
  const opt = (k) => $(root, `[data-opt=${k}]`);
  let pending = null;
  const run = () => {
    const v = writerView({ amount: input.value, verify: verify.value,
      options: { dollarsWord: opt("dollarsWord").checked, letterCase: opt("letterCase").value, cents: opt("cents").value } });
    setWords($(root, "[data-out=words]"), v.words);
    $(root, "[data-out=numeric]").textContent = v.numeric;
    $(root, "[data-out=note]").textContent = v.note;
    $(root, "[data-out=error]").textContent = v.error;
    chip.hidden = !v.chip; chip.textContent = v.chip?.label ?? ""; pending = v.chip?.value ?? null;
    setVerdict($(root, "[data-out=result]"), v.verdict);
    copy.disabled = !v.canCopy;
  };
  chip.addEventListener("click", () => { if (pending) { input.value = pending; run(); input.focus(); } });
  copy.addEventListener("click", async () => {
    if (copy.disabled) return;
    try { await navigator.clipboard.writeText($(root, "[data-out=words]").textContent); copy.textContent = "Copied!"; }
    catch { copy.textContent = "Copy unavailable"; }
    setTimeout(() => { copy.textContent = "Copy words"; }, 1800);
  });
  root.addEventListener("input", run);
  root.addEventListener("change", run);
  run();
}

function checker(root) {
  const run = () => setVerdict($(root, "[data-out=result]"), checkerView({ amount: $(root, "[data-in=amount]").value, words: $(root, "[data-in=words]").value }));
  root.addEventListener("input", run);
}

document.querySelectorAll("[data-tool]").forEach((r) => ({ writer, checker })[r.dataset.tool]?.(r));
