const escapeHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

export const writerTool = (v = "") => `<section class="card" data-tool="writer" aria-label="Check writer">
<label for="amt">Type the amount</label>
<input id="amt" class="hero-input" data-in="amount" inputmode="decimal" autocomplete="off" placeholder="1250.50" value="${escapeHtml(v)}">
<p class="note" data-out="note" aria-live="polite"></p>
<button type="button" class="chip" data-act="suggest" hidden></button>
<h2 class="result-heading">Your result</h2>
<div class="check" aria-live="polite"><div class="check-amt" data-out="numeric">$0.00</div>
<div class="check-words"><span data-out="words">Your result appears here.</span> <span class="pre">Dollars</span></div></div>
<p class="err" role="alert" data-out="error"></p>
<button class="btn" data-act="copy" disabled>Copy words</button>
<details class="opts-wrap format-options"><summary>Formatting options</summary><div class="opts">
<label class="inline"><input type="checkbox" data-opt="dollarsWord"> Add “Dollars” <span class="hint-inline">(optional)</span></label>
<div class="option-field"><label for="letter-case">Letter case</label><select id="letter-case" data-opt="letterCase"><option value="sentence">Sentence case</option><option value="title">Title Case</option><option value="upper">UPPERCASE</option></select></div>
<div class="option-field"><label for="cents-style">Cents style</label><select id="cents-style" data-opt="cents"><option value="fraction">Cents as 50/100</option><option value="words">Cents in words</option></select></div>
</div></details>
<h2 class="section-title">Check Your Written Amount</h2>
<p class="hint">Already written your check? Enter the numbers and words to verify they match. The numbers are taken from the amount above.</p>
<label for="verify">Words you wrote on the check</label>
<input id="verify" data-in="verify" autocomplete="off" placeholder="e.g. One hundred and 00/100">
<p class="verdict" role="status" data-out="result"></p>
</section>`;
