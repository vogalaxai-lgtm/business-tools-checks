const ONES = new Map(Object.entries({ one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 }));
const TENS = new Map(Object.entries({ twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 }));
const SCALES = new Map([["thousand", 1], ["million", 2], ["billion", 3]]);
const FRACTION = /^\d{2}\/100$/;

function below100(t) {
  if (t.length === 1) return ONES.get(t[0]) ?? TENS.get(t[0]) ?? null;
  if (t.length === 2 && TENS.has(t[0]) && ONES.has(t[1]) && ONES.get(t[1]) < 10) return TENS.get(t[0]) + ONES.get(t[1]);
  return null;
}

function group(t, allowAnd) {
  let i = 0, v = 0;
  if (allowAnd && t[0] === "and") i = 1;
  else if (ONES.has(t[0]) && ONES.get(t[0]) < 10 && t[1] === "hundred") {
    v = ONES.get(t[0]) * 100; i = 2;
    if (t[2] === "and" && t.length > 3) i = 3;
  }
  const rest = t.slice(i);
  let r = 0;
  if (rest.length) { r = below100(rest); if (r === null) return null; }
  else if (i < 2) return null;
  return v + r || null;
}

function parseInteger(toks) {
  let total = 0n, last = 4, cur = [], seen = false;
  const take = (scale) => {
    const g = group(cur, seen && scale === 0);
    if (g === null) return false;
    total += BigInt(g) * 1000n ** BigInt(scale); cur = []; seen = true; return true;
  };
  for (const t of toks) {
    if (SCALES.has(t)) {
      if (SCALES.get(t) >= last || !cur.length || !take(SCALES.get(t))) return null;
      last = SCALES.get(t);
    } else cur.push(t);
  }
  if (cur.length) { if (!take(0)) return null; } else if (!seen) return null;
  return total;
}

/** Strict grammar: "One thousand two hundred fifty and 50/100" -> "1250.50"; anything malformed -> null. */
export function wordsToAmount(text) {
  const raw = String(text).toLowerCase();
  if (/[^a-z0-9\s\-,*/]/.test(raw)) return null;
  let toks = raw.replace(/[-,*]/g, " ").trim().split(/\s+/).filter(Boolean);
  if (toks.at(-1) === "only") toks.pop();
  let cents = null, viaWords = false;
  const last = toks.at(-1) ?? "";
  if (FRACTION.test(last)) {
    cents = Number(last.slice(0, 2)); toks.pop();
    if (toks.at(-1) === "and") toks.pop();
  } else if (last === "cent" || last === "cents") {
    toks.pop(); viaWords = true;
    const di = toks.findIndex((x) => x === "dollar" || x === "dollars");
    let seg = toks;
    if (di >= 0) { seg = toks.slice(di + 1); toks = toks.slice(0, di + 1); if (seg.shift() !== "and") return null; } else toks = [];
    cents = below100(seg);
    if (cents === null || (last === "cent") !== (cents === 1)) return null;
  }
  let dollarTok = null;
  if (toks.at(-1) === "dollar" || toks.at(-1) === "dollars") dollarTok = toks.pop();
  let dollars;
  if (toks.length === 1 && toks[0] === "zero") dollars = 0n;
  else if (!toks.length) { if (!viaWords) return null; dollars = 0n; if (dollarTok) return null; }
  else dollars = parseInteger(toks);
  if (dollars === null) return null;
  if (dollarTok && (dollarTok === "dollar") !== (dollars === 1n)) return null;
  cents ??= 0;
  if (dollars === 0n && cents === 0) return null;
  return `${dollars}.${String(cents).padStart(2, "0")}`;
}
