import test from "node:test";
import assert from "node:assert/strict";
import { writerView, checkerView, PLACEHOLDER } from "../src/js/view-model.js";

const w = (amount, extra = {}) => writerView({ amount, ...extra });
test("empty and invalid inputs never leave a stale result", () => {
  assert.equal(w("1250.50").words, "One thousand two hundred fifty and 50/100");
  for (const bad of ["", "   ", "-5", "125.500", "0.005", "12 50", "abc", "0"]) {
    const v = w(bad);
    assert.equal(v.words, PLACEHOLDER, bad); assert.equal(v.canCopy, false, bad); assert.equal(v.verdict, null, bad);
    assert.equal(v.numeric, "$0.00", bad);
  }
  assert.ok(w("-5").error && w("125.500").error && !w("").error);
});
test("format suggestions: shown, no result until accepted, value-preserving", () => {
  const v = w("12,50");
  assert.equal(v.chip.value, "12.50"); assert.equal(v.canCopy, false); assert.equal(v.words, PLACEHOLDER);
  assert.equal(w(v.chip.value).words, "Twelve and 50/100");
});
test("options update the result immediately and keep the amount", () => {
  assert.equal(w("1250.50", { options: { dollarsWord: true } }).words, "One thousand two hundred fifty dollars and 50/100");
  assert.equal(w("1250.50", { options: { letterCase: "title" } }).words, "One Thousand Two Hundred Fifty and 50/100");
  assert.equal(w("1250.50", { options: { letterCase: "upper" } }).words, "ONE THOUSAND TWO HUNDRED FIFTY AND 50/100");
  assert.equal(w("1250.50", { options: { cents: "words" } }).words, "One thousand two hundred fifty dollars and fifty cents");
  assert.equal(w("1250.50", { options: { cents: "words" } }).numeric, "$1,250.50");
});
test("verification follows both inputs and clears when either is missing or invalid", () => {
  assert.equal(w("1250.50", { verify: "One thousand two hundred fifty and 50/100" }).verdict.ok, true);
  assert.equal(w("1250.50", { verify: "one thousand two hundred forty and 50/100" }).verdict.ok, false);
  assert.equal(w("1250.50", { verify: "" }).verdict, null);
  assert.equal(w("", { verify: "fifty" }).verdict, null);
  assert.equal(w("-5", { verify: "five" }).verdict, null);
});
test("checker page view", () => {
  assert.equal(checkerView({ amount: "1250.50", words: "" }), null);
  assert.equal(checkerView({ amount: "", words: "five" }), null);
  assert.equal(checkerView({ amount: "5", words: "five and 00/100" }).ok, true);
  assert.equal(checkerView({ amount: "5", words: "and twelve and 50/100" }).ok, false);
  assert.equal(checkerView({ amount: "-5", words: "five" }).ok, false);
  assert.match(checkerView({ amount: "12,50", words: "x" }).text, /12\.50/);
});
