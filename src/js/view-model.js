import { formatCheck } from "./check.js";
import { verifyCheck } from "./checker.js";
import { interpret } from "./smart.js";

export const PLACEHOLDER = "Your result appears here.";
const verdictOf = (v) => ({ ok: v.match, text: v.match ? "✓ The numbers and words match." : `✗ Mismatch. Expected: ${v.expected}` });

/** Pure function: everything the Writer screen shows is derived from its inputs, so no stale state can survive. */
export function writerView({ amount = "", verify = "", options = {} } = {}) {
  const empty = { words: PLACEHOLDER, numeric: "$0.00", note: "", error: "", chip: null, verdict: null, canCopy: false };
  const s = interpret(amount);
  if (s.kind === "empty") return empty;
  if (s.kind === "invalid") return { ...empty, error: s.error };
  if (s.kind === "suggest") return { ...empty, chip: s.suggestion };
  try {
    const r = formatCheck(s.amount, options);
    const verdict = String(verify).trim() ? verdictOf(verifyCheck(s.amount, verify)) : null;
    return { ...empty, words: r.words, numeric: "$" + r.numeric, note: s.note || "", verdict, canCopy: true };
  } catch (e) { return { ...empty, error: e.message }; }
}

export function checkerView({ amount = "", words = "" } = {}) {
  if (!String(amount).trim() || !String(words).trim()) return null;
  const s = interpret(amount);
  try {
    if (!s.amount) throw new Error(s.error || s.suggestion?.label || "Enter a valid amount.");
    return verdictOf(verifyCheck(s.amount, words));
  } catch (e) { return { ok: false, text: e.message }; }
}
