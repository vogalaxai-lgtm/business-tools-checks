import test from "node:test";
import assert from "node:assert/strict";
import { interpret } from "../src/js/smart.js";

test("auto-detects formats", () => {
  assert.equal(interpret("$1,250.50").amount, "1,250.50");
  assert.equal(interpret("1.5k").amount, "1500.00");
  assert.equal(interpret("1.250,50").amount, "1250.50");
  assert.equal(interpret("one thousand two hundred fifty and 50/100").amount, "1250.50");
  assert.equal(interpret("seventy-five cents").amount, "0.75");
  assert.equal(interpret("one dollar and one cent").amount, "1.01");
});
test("suggests fixes for likely typos", () => {
  assert.equal(interpret("1250,50").suggestion.value, "1250.50");
  assert.equal(interpret("1.999").suggestion.value, "2.00");
  assert.equal(interpret("-5").suggestion.value, "5");
  assert.equal(interpret("blah blah").kind, "invalid");
  assert.equal(interpret("").kind, "empty");
});
