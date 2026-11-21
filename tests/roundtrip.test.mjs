import test from "node:test";
import assert from "node:assert/strict";
import { formatCheck } from "../src/js/check.js";
import { wordsToAmount } from "../src/js/parse-words.js";
import { verifyCheck } from "../src/js/checker.js";
import { interpret } from "../src/js/smart.js";

const norm = (a) => { const [d, c = ""] = a.replace(/,/g, "").split("."); return `${BigInt(d)}.${c.padEnd(2, "0")}`; };
const combos = [];
for (const cents of ["fraction", "words"]) for (const letterCase of ["sentence", "title", "upper"]) for (const dollarsWord of [false, true]) combos.push({ cents, letterCase, dollarsWord });

function roundTrip(amt) {
  for (const o of combos) {
    const w = formatCheck(amt, o).words;
    assert.equal(wordsToAmount(w), norm(amt), `${amt} ${JSON.stringify(o)} "${w}"`);
    assert.ok(verifyCheck(amt, w).match, `${amt} "${w}"`);
  }
}
test("Writer output is always verified by Checker (every cent up to $300)", () => { for (let c = 1; c <= 30000; c++) roundTrip((c / 100).toFixed(2)); });
test("Writer/Checker agree on large and pseudo-random amounts", () => {
  let seed = 42; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (let i = 0; i < 5000; i++) { const d = BigInt(Math.floor(rnd() * 10 ** (1 + Math.floor(rnd() * 12)))); const c = Math.floor(rnd() * 100); if (d || c) roundTrip(`${d}.${String(c).padStart(2, "0")}`); }
  for (const a of ["999999999999.99", "1000000", "1000000000", "100", "101", "110", "1001", "1010", "100000", "0.01", "0.10", "1.00"]) roundTrip(a);
});
test("fuzz: arbitrary text never crashes the input pipeline", () => {
  const alphabet = "0123456789.,$- +/abcdeiknorstuy\u0661\u066b'\"<>";
  let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (let i = 0; i < 20000; i++) {
    let s = ""; for (let j = Math.floor(rnd() * 14); j >= 0; j--) s += alphabet[Math.floor(rnd() * alphabet.length)];
    const r = interpret(s);
    if (r.amount) { try { formatCheck(r.amount); } catch (e) { assert.equal(e.name, "CheckError", s); } }
  }
});
