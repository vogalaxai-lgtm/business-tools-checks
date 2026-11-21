import { normalizeDigits } from "./check.js";
import { wordsToAmount } from "./parse-words.js";

const suggest = (label, value) => ({ kind: "suggest", suggestion: { label, value } });

/** Classifies input. Only value-preserving format fixes are ever suggested; nothing is rounded or guessed silently. */
export function interpret(raw) {
  const s = normalizeDigits(String(raw ?? "")).trim();
  if (!s) return { kind: "empty" };
  let m;
  if (/[a-z]/i.test(s)) {
    if ((m = /^\$?(\d+(?:\.\d+)?)\s*([km])$/i.exec(s))) {
      const v = (Math.round(parseFloat(m[1]) * (m[2].toLowerCase() === "k" ? 1e3 : 1e6) * 100) / 100).toFixed(2);
      return suggest(`Did you mean ${v}?`, v);
    }
    const a = wordsToAmount(s);
    return a ? { kind: "words", amount: a, note: `Read your words as ${a}` }
             : { kind: "invalid", error: "Couldn't read that. Try a number like 1250.50 or words like one thousand fifty." };
  }
  if (/^\$?\d{1,3}(\.\d{3})+,\d{1,2}$/.test(s)) { const v = s.replace(/^\$/, "").replace(/\./g, "").replace(",", "."); return suggest(`Did you mean ${v}?`, v); }
  if (/^\$?\d+,\d{1,2}$/.test(s)) { const v = s.replace(/^\$/, "").replace(",", "."); return suggest(`Did you mean ${v}?`, v); }
  return { kind: "amount", amount: s };
}
