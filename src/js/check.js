import { integerToWords } from "./words.js";

export const MAX_DOLLARS = 999999999999n;
export const DEFAULTS = Object.freeze({ dollarsWord: false, letterCase: "sentence", cents: "fraction" });

export class CheckError extends Error {
  constructor(code, message) { super(message); this.name = "CheckError"; this.code = code; }
}

export const normalizeDigits = (s) => String(s ?? "")
  .replace(/[\u0660-\u0669]/g, (d) => d.charCodeAt(0) - 0x660)
  .replace(/[\u06f0-\u06f9]/g, (d) => d.charCodeAt(0) - 0x6f0)
  .replace(/\u066b/g, ".").replace(/\u066c/g, ",");

/** Single source of truth for accepting an amount. Never rounds, never guesses. */
export function parseCheckAmount(input) {
  let t = normalizeDigits(input).trim();
  if (t.startsWith("$")) t = t.slice(1).trimStart();
  if (!t) throw new CheckError("EMPTY", "Enter an amount.");
  if (t.startsWith("-")) throw new CheckError("NEGATIVE", "Checks can't be written for negative amounts.");
  if (/^\d{1,3}(\s\d{3})+(\.\d+)?$/.test(t)) t = t.replace(/\s/g, ",");
  const m = /^(\d+|[1-9]\d{0,2}(?:,\d{3})+)(?:\.(\d+))?$/.exec(t);
  if (!m) throw new CheckError("FORMAT", "Use commas for thousands and a dot for cents. Example: 1,250.50");
  const frac = m[2] ?? "";
  const trimmed = frac.replace(/0+$/, "");
  if (trimmed.length > 2) throw new CheckError("DECIMALS", "At most 2 decimal places. Amounts are never rounded.");
  if (!t.includes(",") && /^\d{1,3}\.\d{3}$/.test(t) && frac !== "000")
    throw new CheckError("AMBIGUOUS", `“${t}” is ambiguous (decimal or thousands?). Write it as ${t.replace(".", ",")} or with 2 decimals.`);
  const dollars = BigInt(m[1].replace(/,/g, ""));
  const cents = Number(trimmed.padEnd(2, "0"));
  if (dollars === 0n && cents === 0) throw new CheckError("ZERO", "The amount must be greater than zero.");
  if (dollars > MAX_DOLLARS) throw new CheckError("TOO_LARGE", "Maximum amount is $999,999,999,999.99.");
  return { dollars, cents };
}

function applyCase(text, mode) {
  if (mode === "upper") return text.toUpperCase();
  if (mode === "title") return text.replace(/\b[a-z]/g, (c) => c.toUpperCase()).replace(/\bAnd\b/g, "and");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatCheck(input, options = {}) {
  const o = { ...DEFAULTS, ...options };
  const { dollars, cents } = parseCheckAmount(input);
  const pad = String(cents).padStart(2, "0");
  let words;
  if (o.cents === "words") {
    const d = dollars > 0n ? `${integerToWords(dollars)} ${dollars === 1n ? "dollar" : "dollars"}` : "";
    const c = cents > 0 ? `${integerToWords(BigInt(cents))} ${cents === 1 ? "cent" : "cents"}` : "";
    words = d && c ? `${d} and ${c}` : d || c;
  } else {
    words = `${integerToWords(dollars)}${o.dollarsWord ? (dollars === 1n ? " dollar" : " dollars") : ""} and ${pad}/100`;
  }
  const numeric = dollars.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + pad;
  return { words: applyCase(words, o.letterCase), numeric, dollars, cents };
}
