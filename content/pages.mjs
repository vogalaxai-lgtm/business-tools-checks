// One object per page. To add a page: add an object here (and a NAV entry in src/templates/layout.mjs if it needs a menu link).
import { formatCheck } from "../src/js/check.js";

const UPDATED = "2026-11-21";
const table = (list, options = {}) => `<div class="table-wrap"><table><thead><tr><th>Amount</th><th>Write it as</th></tr></thead><tbody>${list.map((a) => {
  const r = formatCheck(a, options); return `<tr><td>$${r.numeric}</td><td>${nb(r.words)}</td></tr>`; }).join("")}</tbody></table></div>`;
const MIX = ["0.01", "0.75", "130.45", "150", "200", "375", "1200", "1250.50", "1400", "1500", "3000", "10000"];
const WORDS_WIN = `<h2>If the words and numbers disagree</h2><p>Under UCC § 3-114 (older versions: § 3-118(c)), when an instrument contradicts itself, the written words generally prevail over the numerals. Versions and court decisions vary by state, and your bank decides how to handle a conflicting check. This is general information, not legal advice. To avoid problems, make the two match, or use the checker.</p>`;
const ASK_BANK = `<p>Banks and employers sometimes ask for a slightly different format. If you are unsure, ask your bank.</p>`;

import { faqBlock, nb, HOME_FAQ, CENTS_FAQ } from "./faq.mjs";
export const pages = [
  { slug: "", tool: "writer", updated: UPDATED,
    title: "Check Amount in Words Converter | Free Check Writing Tool",
    description: "Type a dollar amount and get it in the format used on US checks, like One thousand two hundred fifty and 50/100. Free, instant, private.",
    h1: "Check Amount in Words Converter",
    lead: "Type an amount and get the words as written on a US check. Everything runs in your browser; nothing is sent or stored.",
    body: `<h2>How it works</h2><ol><li>Type the amount in numbers.</li><li>Adjust the formatting options if your check needs them.</li><li>Copy the words onto the check's long line, then draw a line through any empty space.</li></ol>
<h2>Examples</h2>${table(MIX)}
<h2>Should I write “Dollars”?</h2><p>Most checks already print the word Dollars at the end of the line, so it is off by default. Turn it on if your check does not have it.</p>
<h2>Already wrote the check?</h2><p>Use the verification box above, or the <a href="/amount-in-words-checker/">amount checker</a>, to confirm that the numbers and words match.</p>${ASK_BANK}${faqBlock(HOME_FAQ)}` },

  { slug: "how-to-write-a-check-with-cents", tool: "writer", prefill: "130.45", updated: UPDATED,
    title: "How to Write a Check with Cents (Examples + Free Tool)",
    description: "Learn how to write cents on a check as a fraction over 100, with examples from $0.01 to $10,000 and a free converter.",
    h1: "How to Write a Check with Cents",
    body: `<p class="answer">Write the cents as a fraction of 100 after the dollars. For $130.45, write “One hundred thirty and 45/100”. With no cents, write 00/100. In the number box, always use a decimal point and two digits: 130.45.</p>
<h2>Steps</h2><ol><li>In the box, write the amount with a decimal point and two digits.</li><li>On the long line, write the dollars in words.</li><li>Write “and”, then the cents over 100.</li><li>Draw a line through the unused space so nothing can be added.</li></ol>
<h2>Examples</h2>${table(MIX)}
<h2>Special cases</h2><ul><li><strong>No cents:</strong> write 00/100.</li><li><strong>Under ten cents:</strong> keep the zero, as in 05/100.</li><li><strong>Under a dollar:</strong> write “Zero and 75/100”, or spell it out as “Seventy-five cents”.</li><li><strong>Thousands with cents:</strong> $1,250.50 is “One thousand two hundred fifty and 50/100”.</li></ul>
<h2>Cents written in words</h2><p>Some people write the cents out instead of using a fraction. Both are understood, as long as they match the numbers.</p>${table(["0.75", "1.01", "130.45", "1250"], { cents: "words" })}${faqBlock(CENTS_FAQ)}${WORDS_WIN}` },

  { slug: "how-to-write-a-check-for-rent", tool: "writer", prefill: "1250", updated: UPDATED,
    title: "How to Write a Check for Rent (Step-by-Step Example)",
    description: "A step-by-step example of writing a rent check: payee, amount in numbers and words, date and memo.",
    h1: "How to Write a Check for Rent",
    body: `<h2>Before you write</h2><p>Use the payee name exactly as it appears on your lease, and confirm the amount and the due date.</p>
<h2>Example: $1,250.00</h2><ul><li><strong>Pay to:</strong> your landlord or property manager, as written on the lease.</li><li><strong>Amount:</strong> 1,250.00</li><li><strong>Words:</strong> One thousand two hundred fifty and 00/100</li><li><strong>Memo:</strong> for example, “March rent – Apt B4” (an illustration, use your own details).</li></ul>
<h2>Common mistakes</h2><ul><li>Leaving space after the words (draw a line through it).</li><li>Words and numbers that do not match.</li><li>A missing date or signature.</li></ul>
<p>If your landlord prefers another payment method, ask them. A cashier's check or an electronic payment are common alternatives.</p>${WORDS_WIN}` },

  { slug: "how-to-write-a-check-amount-in-words", tool: "writer", prefill: "1400", updated: UPDATED,
    title: "How to Write a Check Amount in Words (Rules + Converter)",
    description: "The rules for writing a check amount in words: hyphens, “and”, cents as a fraction, with examples by range.",
    h1: "How to Write a Check Amount in Words",
    body: `<h2>The rules</h2><ul><li>Write the dollars in words, then “and”, then the cents over 100.</li><li>Hyphenate compounds from 21 to 99: forty-two.</li><li>Do not use “and” inside the dollar part: write one hundred twenty, not one hundred and twenty.</li><li>Commas are not needed on the check line.</li></ul>
<h2>Examples by range</h2>${table(["1", "15", "99.99", "100", "1400", "12345.67", "1000000"])}
<h2>Cents in words</h2>${table(["0.05", "0.75", "42.10", "1000"], { cents: "words" })}${WORDS_WIN}${ASK_BANK}` },

  { slug: "amount-in-words-checker", tool: "checker", updated: UPDATED,
    title: "Check Your Written Amount | Amount in Words Checker",
    description: "Already wrote your check? Verify that the amount in numbers matches the words. Free, private, runs in your browser.",
    h1: "Check Your Written Amount",
    lead: "Already written your check? Enter the numbers and words to verify they match.",
    body: `<p>The checker ignores capital letters and hyphens and accepts both cents styles: “and 50/100” and “fifty cents”. It does not accept extra or misplaced words, such as “and twelve” or a repeated “hundred”.</p>${WORDS_WIN}` },

  { slug: "about", updated: UPDATED, title: "About BusinessTools", description: "What BusinessTools is, how it works and what it does not do.", h1: "About BusinessTools",
    body: `<p>BusinessTools is a small, independent project that provides free tools for everyday paperwork. The first tool writes US check amounts in words and checks that numbers and words agree.</p>
<p>The conversions are done by tested code, not typed by hand. Every rule in the tool has automated tests, and the guides are written to match what the tool produces. We are not a bank, a law firm, or affiliated with any financial institution.</p>
<p>Found a mistake? See the <a href="/contact/">contact page</a>.</p>` },
  { slug: "privacy", updated: UPDATED, title: "Privacy | BusinessTools", description: "Amounts you type are processed in your browser and are never sent or stored by this site.", h1: "Privacy",
    body: `<p>The amounts and words you type are processed only in your browser. This site does not send them to a server, store them, or use cookies.</p>
<p>The site is hosted on GitHub Pages, so GitHub, like any web host, may log technical data such as IP addresses when pages are requested. This site does not run analytics or advertising scripts. If that changes, this page will say so.</p>` },
  { slug: "editorial-policy", updated: UPDATED, title: "Editorial Policy | BusinessTools", description: "How BusinessTools content is written, checked and updated.", h1: "Editorial Policy",
    body: `<h2>How guides are made</h2><p>Examples in each guide are generated by the same tested code that powers the tool, so they cannot drift apart. Legal references are named so you can look them up.</p>
<h2>Corrections and updates</h2><p>Each guide shows a last-updated date. When a reader reports an error, we check it against the tests, fix it, and update the date.</p>
<h2>What we do not do</h2><p>We do not give legal or banking advice, and we do not claim that following a format guarantees a bank will accept a check.</p>` },
  { slug: "disclaimer", updated: UPDATED, title: "Disclaimer | BusinessTools", description: "BusinessTools is educational and is not legal or banking advice.", h1: "Disclaimer",
    body: `<p>BusinessTools is provided for general information. It is not legal, financial or banking advice, and it cannot prevent fraud or guarantee that a check will be accepted.</p>
<p>Check-writing conventions differ between banks and over time. When in doubt, ask your bank. References to the Uniform Commercial Code are general; state versions differ.</p>` },
  { slug: "contact", updated: UPDATED, title: "Contact | BusinessTools", description: "Report an error or suggest an improvement to BusinessTools.", h1: "Contact",
    body: `<p>Found a mistake or have a suggestion? Open an issue on <a href="https://github.com/vogalaxai-lgtm/business-tools-checks/issues">GitHub</a>. Please include the amount you typed, what the tool showed, and what you expected.</p>` },
  { slug: "404", noindex: true, title: "Page not found | BusinessTools", description: "The page you are looking for does not exist. Go back to the BusinessTools check amount converter.", h1: "Page not found",
    body: `<p><a href="/">Back to the tool</a></p>` },
];
