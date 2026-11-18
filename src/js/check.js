import { integerToWords } from "./words.js";

export const MAX_DOLLARS = 999999999999n;
export const DEFAULTS = Object.freeze({ dollarsWord: false, letterCase: "sentence", cents: "fraction" });

export class CheckError extends Error {
  constructor(code, message) { super(message); this.name = "CheckError"; this.code = code; }
}

export function parseCheckAmount(input) {
  const text = String(input ?? "").trim().replace(/^\$\s*/, "");
  if (!text) throw new CheckError("EMPTY", "Enter an amount.");
  if (text.startsWith("-")) throw new CheckError("NEGATIVE", "Checks can't be written for negative amounts.");
  const m = /^(\d+|[1-9]\d{0,2}(?:,\d{3})+)(?:\.(\d*))?$/.exec(text);
  if (!m) throw new CheckError("FORMAT", "Use commas for thousands and a dot for cents. Example: 1,250.50");
  const frac = (m[2] || "").replace(/0+$/, "");
  if (frac.length > 2) throw new CheckError("DECIMALS", "A check amount has at most 2 decimal places.");
  const dollars = BigInt(m[1].replace(/,/g, ""));
  const cents = Number(frac.padEnd(2, "0"));
  if (dollars === 0n && cents === 0) throw new CheckError("ZERO", "The amount must be greater than zero.");
  if (dollars > MAX_DOLLARS) throw new CheckError("TOO_LARGE", "Maximum amount is $999,999,999,999.99.");
  return { dollars, cents };
}

function applyCase(text, mode) {
  if (mode === "upper") return text.toUpperCase();
  if (mode === "title") return text.replace(/\b[a-z]/g, (c) => c.toUpperCase()).replace(/\bAnd\b/g, "and");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Returns { words, numeric, dollars, cents } in the format used on US checks. */
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
