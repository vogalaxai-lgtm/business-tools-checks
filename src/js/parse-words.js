const SMALL = Object.fromEntries("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ").map((w, i) => [w, i]));
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const SCALE = { thousand: 1e3, million: 1e6, billion: 1e9 };

function num(tokens) {
  let total = 0, cur = 0;
  for (const t of tokens) {
    if (t in SMALL) cur += SMALL[t];
    else if (t in TENS) cur += TENS[t];
    else if (t === "hundred") cur = (cur || 1) * 100;
    else if (t in SCALE) { total += (cur || 1) * SCALE[t]; cur = 0; }
    else return null;
  }
  return total + cur;
}

/** "One thousand two hundred fifty and 50/100" -> "1250.50". Returns null if unreadable. */
export function wordsToAmount(text) {
  let t = String(text).toLowerCase().replace(/[-,*]/g, " ");
  let cents = null;
  const f = /(\d{1,2})\s*\/\s*100/.exec(t);
  if (f) { cents = Number(f[1]); t = t.replace(f[0], " "); }
  const toks = t.split(/\s+/).filter((x) => x && x !== "and" && x !== "only");
  const ci = toks.findIndex((x) => /^cents?$/.test(x));
  const di = toks.findIndex((x) => /^dollars?$/.test(x));
  let dTok = toks;
  if (ci >= 0) {
    const cTok = toks.slice(di >= 0 ? di + 1 : 0, ci);
    dTok = di >= 0 ? toks.slice(0, di) : [];
    cents = num(cTok);
  } else if (di >= 0) dTok = toks.slice(0, di);
  const dollars = num(dTok);
  if (dollars === null || (cents !== null && (cents < 0 || cents > 99))) return null;
  if (dollars === 0 && !cents) return null;
  return `${dollars}.${String(cents ?? 0).padStart(2, "0")}`;
}
