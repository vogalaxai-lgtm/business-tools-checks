import { formatCheck, parseCheckAmount } from "./check.js";
import { wordsToAmount } from "./parse-words.js";

/** True only when the words are a grammatical check amount equal to the numbers. */
export function verifyCheck(amount, words) {
  const { dollars, cents } = parseCheckAmount(amount);
  const match = wordsToAmount(words) === `${dollars}.${String(cents).padStart(2, "0")}`;
  return { match, expected: formatCheck(amount).words };
}
