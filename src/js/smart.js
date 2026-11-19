import { wordsToAmount } from "./parse-words.js";

const ok = (amount, note) => ({ kind: "amount", amount, note });
const suggest = (label, value) => ({ kind: "suggest", suggestion: { label, value } });

/** Understands what the user typed: amount, shorthand, words, or a likely typo (offered as a suggestion). */
export function interpret(raw) {
  const text = String(raw ?? "").trim();
  if (!text) return { kind: "empty" };
  let s = text.replace(/^\$\s*/, "").replace(/\s+/g, "");
  let m;

  if ((m = /^(\d+(?:\.\d+)?)([km])$/i.exec(s))) {
    const v = (Math.round(parseFloat(m[1]) * (m[2].toLowerCase() === "k" ? 1e3 : 1e6) * 100) / 100).toFixed(2);
    return ok(v, `Read as ${v}`);
  }
  if (/[a-z]/i.test(text)) {
    const a = wordsToAmount(text);
    return a ? { kind: "words", amount: a, note: `Read your words as ${a}` }
             : { kind: "invalid", error: "Couldn't read that. Try a number like 1250.50 or words like one thousand fifty." };
  }
  if (/^\d{1,3}(\.\d{3})+,\d{1,2}$/.test(s)) {
    const v = s.replace(/\./g, "").replace(",", ".");
    return ok(v, `Read as ${v} (comma treated as decimal)`);
  }
  if (/^\d+,\d{1,2}$/.test(s)) { const v = s.replace(",", "."); return suggest(`Did you mean ${v}?`, v); }
  if (s.startsWith("-")) { const v = s.slice(1); return suggest(`Checks can't be negative. Use ${v}?`, v); }
  if ((m = /^([\d,]*)\.(\d+)$/.exec(s)) && m[2].replace(/0+$/, "").length > 2) {
    const v = Number(s.replace(/,/g, "")).toFixed(2);
    return suggest(`Only 2 decimals allowed. Round to ${v}?`, v);
  }
  return ok(s);
}
