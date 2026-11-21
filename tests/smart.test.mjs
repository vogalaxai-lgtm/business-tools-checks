import test from "node:test";
import assert from "node:assert/strict";
import { interpret } from "../src/js/smart.js";

test("classification", () => {
  assert.equal(interpret("").kind, "empty");
  assert.equal(interpret("1250.50").kind, "amount");
  assert.equal(interpret("one thousand fifty").amount, "1050.00");
  assert.equal(interpret("seventy-five cents").amount, "0.75");
  assert.equal(interpret("blah blah").kind, "invalid");
  assert.equal(interpret("1.5k").suggestion.value, "1500.00");
});
