const ONES = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const TENS = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
const SCALES = ["","thousand","million","billion"];

export function underThousand(n) {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : "");
  const r = n % 100;
  return ONES[Math.floor(n / 100)] + " hundred" + (r ? " " + underThousand(r) : "");
}

/** Whole numbers 0 .. 999,999,999,999 (BigInt-safe). No "and" inside the integer part. */
export function integerToWords(value) {
  let n = BigInt(value);
  if (n < 0n || n >= 1000n ** BigInt(SCALES.length)) throw new RangeError("Out of range");
  if (n === 0n) return "zero";
  const out = [];
  for (let s = 0; n > 0n; s++, n /= 1000n) {
    const g = Number(n % 1000n);
    if (g) out.unshift(underThousand(g) + (s ? " " + SCALES[s] : ""));
  }
  return out.join(" ");
}
