// One object per page. Add a page = add an object here (then add its link in src/templates/layout.mjs NAV if needed).
const UPDATED = "2026-11-18";
const WORDS_WIN = `<h2>If the words and numbers disagree</h2><p>Under UCC § 3-114, written words generally prevail over numerals when an instrument contradicts itself. Banks may handle conflicts differently, and this is not legal advice.</p>`;
const DISCLAIMER_NOTE = `<p>Your bank may ask for a slightly different format. When in doubt, ask your bank.</p>`;
const LIST = "0.01,0.75,130.45,150,200,375,1200,1250.50,1400,1500,3000,10000";

export const pages = [
  { slug: "", tool: "writer", updated: UPDATED,
    title: "Check Amount in Words Converter | Free Check Writing Tool",
    description: "Type a dollar amount and get it in the format used on US checks, like One thousand two hundred fifty and 50/100. Free, instant, private.",
    h1: "Check Amount in Words Converter",
    lead: "Type an amount and get the words exactly as written on a US check. Everything runs in your browser; nothing is sent or stored.",
    body: `<h2>How it works</h2><ol><li>Enter the amount in numbers.</li><li>Pick your options: “Dollars”, letter case, cents style.</li><li>Copy the words onto the check line, then draw a line through any empty space.</li></ol>
<h2>Examples</h2>{{examples:${LIST}}}
<h2>Should I write “Dollars”?</h2><p>Most checks already print the word Dollars at the end of the line, so it is off by default. Turn it on if your check doesn't have it.</p>
<h2>Check what you wrote</h2><p>Already wrote a check? <a href="/amount-in-words-checker/">Verify that numbers and words match</a>.</p>${DISCLAIMER_NOTE}` },

  { slug: "how-to-write-a-check-with-cents", tool: "writer", prefill: "130.45", updated: UPDATED,
    title: "How to Write a Check with Cents (Examples + Free Tool)",
    description: "Learn how to write cents on a check as a fraction over 100, with examples from $0.01 to $10,000 and a free converter.",
    h1: "How to Write a Check with Cents",
    body: `<p class="answer">Write the cents as a fraction of 100 after the dollars. For $130.45, write “One hundred thirty and 45/100”. With no cents, write 00/100. In the number box, always use a decimal point and two digits: 130.45.</p>
<h2>Steps</h2><ol><li>Write the amount in the box with a decimal point and two digits.</li><li>On the long line, write the dollars in words.</li><li>Write “and”, then the cents over 100.</li><li>Draw a line through the unused space.</li></ol>
<h2>Examples</h2>{{examples:${LIST}}}
<h2>Special cases</h2><ul><li>No cents: write 00/100.</li><li>Under ten cents: use 01/100 to 09/100.</li><li>Under a dollar: write “Zero and 75/100”, or “Seventy-five cents”.</li></ul>${WORDS_WIN}` },

  { slug: "how-to-write-a-check-for-rent", tool: "writer", prefill: "1250", updated: UPDATED,
    title: "How to Write a Check for Rent (Step-by-Step Example)",
    description: "A step-by-step example of writing a rent check: payee, amount in numbers and words, date and memo.",
    h1: "How to Write a Check for Rent",
    body: `<h2>Before you write</h2><p>Use the payee name exactly as on your lease, and confirm the amount and the date.</p>
<h2>Example: $1,250.00</h2><ul><li>Pay to: your landlord or property manager, as on the lease.</li><li>Amount: 1,250.00</li><li>Words: One thousand two hundred fifty and 00/100</li><li>Memo: March rent – Apt B4</li></ul>
<h2>Common mistakes</h2><ul><li>Leaving space after the words (draw a line through it).</li><li>Words and numbers that disagree.</li><li>Missing signature or date.</li></ul>${WORDS_WIN}` },

  { slug: "how-to-write-a-check-amount-in-words", tool: "writer", prefill: "1400", updated: UPDATED,
    title: "How to Write a Check Amount in Words (Rules + Converter)",
    description: "The rules for writing a check amount in words: hyphens, “and”, cents as a fraction, with examples by range.",
    h1: "How to Write a Check Amount in Words",
    body: `<h2>The rules</h2><ul><li>Write dollars in words, then “and”, then cents over 100.</li><li>Hyphenate compounds from 21 to 99: forty-two.</li><li>Don't use “and” inside the dollar part: write one hundred twenty, not one hundred and twenty.</li><li>Commas are optional and not needed on a check line.</li></ul>
<h2>Examples</h2>{{examples:1.00,15,99.99,100,1400,12345.67,1000000}}${WORDS_WIN}${DISCLAIMER_NOTE}` },

  { slug: "amount-in-words-checker", tool: "checker", updated: UPDATED,
    title: "Check Amount Checker | Do Your Numbers and Words Match?",
    description: "Verify that the amount in numbers on your check matches the amount in words. Free, private, runs in your browser.",
    h1: "Check Amount Checker",
    lead: "Enter the numeric amount and the words you wrote. We compare them, ignoring hyphens, capitals and the word “and”.",
    body: `<p>Both cents styles are accepted: “and 50/100” and “fifty cents”.</p>${WORDS_WIN}` },

  { slug: "about", title: "About BusinessTools", description: "Who runs BusinessTools and how the content is built.", h1: "About",
    body: `<p>BusinessTools provides free, simple tools for everyday work. <!-- TODO: add who is behind the site, without claiming expertise you don't have. --></p>` },
  { slug: "privacy", title: "Privacy | BusinessTools", description: "Amounts you type are processed in your browser and never sent or stored.", h1: "Privacy",
    body: `<p>Amounts and words you type are processed locally in your browser. They are not sent to a server or stored. <!-- TODO: list any analytics explicitly if you add them. --></p>` },
  { slug: "editorial-policy", title: "Editorial Policy | BusinessTools", description: "How content is sourced, reviewed and updated.", h1: "Editorial Policy",
    body: `<p>Each guide shows a last-updated date, uses original examples generated by the tool's tested engine, and names sources for legal references. <!-- TODO: add review cadence. --></p>` },
  { slug: "disclaimer", title: "Disclaimer | BusinessTools", description: "BusinessTools is educational, not legal or banking advice.", h1: "Disclaimer",
    body: `<p>These tools are educational. They are not legal or banking advice and cannot prevent fraud. Ask your bank if you are unsure about a format.</p>` },
  { slug: "contact", title: "Contact | BusinessTools", description: "Report an error or contact BusinessTools.", h1: "Contact",
    body: `<p>Found a mistake? Email <!-- TODO: real address --> hello@example.com.</p>` },
  { slug: "404", noindex: true, title: "Page not found | BusinessTools", description: "Page not found.", h1: "Page not found",
    body: `<p><a href="/">Back to the tool</a></p>` },
];
