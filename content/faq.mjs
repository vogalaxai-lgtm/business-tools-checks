import { formatCheck } from "../src/js/check.js";

const w = (a, o) => formatCheck(a, o).words;
/** Keeps “and 50/100” on one line inside table cells. */
export const nb = (s) => s.replace(/(\s?and \d{2}\/100)$/i, '<span class="nb">$1</span>');

/** Visible FAQ plus matching FAQPage structured data, generated from the same items. */
export function faqBlock(items) {
  const ld = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }).replace(/</g, "\\u003c");
  return `<h2>Frequently asked questions</h2><div class="faq">${items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div><script type="application/ld+json">${ld}</script>`;
}

export const HOME_FAQ = [
  ["How do you write $1,500.00 on a check?", `In the amount box, write 1,500.00. On the long line, write “${w("1500")}”.`],
  ["How do you write cents on a check?", `Write the cents as a fraction of 100 after “and”. For $130.45, write “${w("130.45")}”. With no cents, write 00/100.`],
  ["Do I need to write “Dollars” on a check?", "Most checks already print the word Dollars at the end of the line. If yours does not, add it after the dollar amount."],
  ["What if the words and numbers do not match?", "Under UCC § 3-114 the written words generally prevail over the numerals, but banks may handle a mismatched check differently and state rules vary. Make both agree, or use the checker. This is general information, not legal advice."],
];
export const CENTS_FAQ = [
  ["How do you write $0.75 on a check?", `Write “${w("0.75")}” or “${w("0.75", { cents: "words" })}” on the line, and 0.75 in the amount box.`],
  ["How do you write a check with no cents?", `Write 00/100 after “and”. For $200, write “${w("200")}”.`],
  ["How do you write a check with thousands and cents?", `Write the thousands in words, then the cents as a fraction. $1,250.50 is “${w("1250.50")}”.`],
];
