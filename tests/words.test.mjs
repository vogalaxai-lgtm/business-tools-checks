import test from "node:test";
import assert from "node:assert/strict";
import { wordsToAmount as w } from "../src/js/parse-words.js";
import { verifyCheck } from "../src/js/checker.js";

test("valid phrases", () => {
  const good = { "One thousand two hundred fifty and 50/100": "1250.50", "one hundred and fifty and 00/100": "150.00", "ONE HUNDRED AND 00/100": "100.00",
    "Seventy-five cents": "0.75", "five cents": "0.05", "one cent": "0.01", "one dollar and one cent": "1.01", "Zero and 75/100": "0.75",
    "one hundred dollars": "100.00", "two dollars and 05/100": "2.05", "one thousand and five and 00/100": "1005.00",
    "twelve and 05/100 only": "12.05", "one million two thousand and 00/100": "1002000.00" };
  for (const [k, v] of Object.entries(good)) assert.equal(w(k), v, k);
});
test("malformed phrases are rejected", () => {
  for (const bad of ["and twelve", "one and thousand", "one hundred and hundred", "one thousand and million", "twelve and and fifty", "one dollar dollars",
    "fifty cents extra", "one hundred hundred", "hundred", "five and 5/100", "five and 05/100 cents", "fifty and 50/100 and 50/100", "one cents", "fifty cent",
    "one and 50/100 extra", "one hundred and", "thousand", "twenty twenty", "one two", "zero", "and 50/100", "one trillion", "two dollar", "one dollars",
    "constructor", "__proto__ and 05/100", "one thousand thousand", "one million one thousand million", "ten ten", "twenty-zero", "fifty and 100/100"]) assert.equal(w(bad), null, bad);
});
test("checker rejects wrong or padded wording even if an amount is extractable", () => {
  assert.equal(verifyCheck("1250.50", "One thousand two hundred fifty and 50/100").match, true);
  assert.equal(verifyCheck("1250.50", "One thousand two hundred forty and 50/100").match, false);
  assert.equal(verifyCheck("1250.50", "One thousand two hundred fifty and 50/100 extra").match, false);
  assert.equal(verifyCheck("1250.50", "fifty and 12/100 one thousand two hundred fifty and 50/100").match, false);
  assert.throws(() => verifyCheck("-5", "five"), { code: "NEGATIVE" });
});
