import test from "node:test";
import assert from "node:assert/strict";
import { formatCheck, parseCheckAmount } from "../src/js/check.js";
import { verifyCheck } from "../src/js/checker.js";

const words = (a, o) => formatCheck(a, o).words;

test("fraction style", () => {
  assert.equal(words("0.01"), "Zero and 01/100");
  assert.equal(words("130.45"), "One hundred thirty and 45/100");
  assert.equal(words("1,250.50"), "One thousand two hundred fifty and 50/100");
  assert.equal(words("100"), "One hundred and 00/100");
  assert.equal(words("$1,000,000"), "One million and 00/100");
  assert.equal(words("12.340"), "Twelve and 34/100");
  assert.equal(words("999,999,999,999.99"), "Nine hundred ninety-nine billion nine hundred ninety-nine million nine hundred ninety-nine thousand nine hundred ninety-nine and 99/100");
});

test("options", () => {
  assert.equal(words("75.10", { dollarsWord: true }), "Seventy-five dollars and 10/100");
  assert.equal(words("0.75", { cents: "words" }), "Seventy-five cents");
  assert.equal(words("1.01", { cents: "words" }), "One dollar and one cent");
  assert.equal(words("42", { letterCase: "title" }), "Forty-Two and 00/100");
  assert.equal(words("42", { letterCase: "upper" }), "FORTY-TWO AND 00/100");
});

test("rejects invalid input", () => {
  for (const [v, code] of [["", "EMPTY"], ["-5", "NEGATIVE"], ["0", "ZERO"], ["0.00", "ZERO"], ["12.345", "DECIMALS"], ["1,25", "FORMAT"], ["abc", "FORMAT"], ["1,000,000,000,000", "TOO_LARGE"]]) {
    assert.throws(() => parseCheckAmount(v), { code }, v);
  }
});

test("checker", () => {
  assert.equal(verifyCheck("1250.50", "one thousand two hundred and fifty and 50/100").match, true);
  assert.equal(verifyCheck("0.75", "Seventy-five cents").match, true);
  assert.equal(verifyCheck("1250.50", "One thousand two hundred forty and 50/100").match, false);
});
