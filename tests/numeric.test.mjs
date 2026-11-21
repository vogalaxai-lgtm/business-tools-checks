import test from "node:test";
import assert from "node:assert/strict";
import { parseCheckAmount, formatCheck } from "../src/js/check.js";
import { interpret } from "../src/js/smart.js";

const ok = (v, d, c) => { const r = parseCheckAmount(v); assert.equal(r.dollars, BigInt(d), v); assert.equal(r.cents, c, v); };
const bad = (v, code) => assert.throws(() => parseCheckAmount(v), { code }, v);

test("accepted amounts", () => {
  ok("1250", 1250, 0); ok("1,250.50", 1250, 50); ok("1250.50", 1250, 50); ok("5.0000", 5, 0); ok("50.05", 50, 5);
  ok("12345.500", 12345, 50); ok("12.34", 12, 34); ok("1,250.500", 1250, 50); ok("1 250", 1250, 0); ok("$125.50", 125, 50); ok("0.01", 0, 1);
  ok("5.000", 5, 0); ok("١٢٣", 123, 0);
  assert.equal(formatCheck("50.05").words, "Fifty and 05/100");
});
test("rejected amounts (never rounded, never guessed)", () => {
  bad("12,50", "FORMAT"); bad("1.250", "AMBIGUOUS"); bad("125.500", "AMBIGUOUS"); bad("12.340", "AMBIGUOUS"); bad("9.990", "AMBIGUOUS"); bad("125.501", "DECIMALS"); bad("125.999", "DECIMALS");
  bad("0.005", "DECIMALS"); bad("-5", "NEGATIVE"); bad("$$125.50", "FORMAT"); bad("1250.", "FORMAT"); bad(".50", "FORMAT");
  bad("12 50", "FORMAT"); bad("1 2 3", "FORMAT"); bad("+5", "FORMAT"); bad("0", "ZERO"); bad("0.00", "ZERO"); bad("0.000", "ZERO"); bad("", "EMPTY");
  bad("1,25", "FORMAT"); bad("1,2345", "FORMAT"); bad("1e3", "FORMAT"); bad("1..5", "FORMAT"); bad("abc", "FORMAT");
});
test("limits", () => {
  ok("999,999,999,999.99", 999999999999, 99);
  bad("1,000,000,000,000", "TOO_LARGE"); bad("999999999999999999999999", "TOO_LARGE");
  assert.match(formatCheck("999999999999.99").words, /^Nine hundred ninety-nine billion .* and 99\/100$/);
});
test("suggestions only fix format, never the value", () => {
  assert.equal(interpret("12,50").suggestion.value, "12.50");
  assert.equal(interpret("1.250,50").suggestion.value, "1250.50");
  for (const v of ["-5", "125.999", ".50", "12 50"]) assert.notEqual(interpret(v).kind, "suggest", v);
});
