import { formatCheck } from "./check.js";

/** Lowercase and drop filler so "and", hyphens, "Dollars", punctuation don't cause false mismatches. */
export function normalizeWords(text) {
  return String(text ?? "").toLowerCase()
    .replace(/[-–—_*]/g, " ")
    .replace(/\b(dollars?|cents?|and|only)\b/g, " ")
    .replace(/[^a-z0-9/ ]/g, "")
    .replace(/\s+/g, " ").trim();
}

/** Compares a numeric amount with the words written on a check. Accepts both cents styles. */
export function verifyCheck(amount, words) {
  const variants = ["fraction", "words"].map((cents) => formatCheck(amount, { cents }).words);
  const got = normalizeWords(words);
  return { match: variants.some((v) => normalizeWords(v) === got), expected: variants[0] };
}
