const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const writerTool = (v = "") => `<section class="card" data-tool="writer" aria-label="Check writer">
<label for="amt">Type the amount</label>
<input id="amt" class="hero-input" data-in="amount" inputmode="decimal" autocomplete="off" placeholder="1250.50" value="${esc(v)}">
<p class="note" data-out="note" aria-live="polite"></p>
<button type="button" class="chip" data-act="suggest" hidden></button>
<p class="err" role="alert" data-out="error"></p>
<h2 class="section-title">Your result</h2>
<div class="check" aria-live="polite"><div class="check-amt" data-out="numeric">$0.00</div>
<div class="check-words"><span data-out="words">Your result appears here.</span></div></div>
<button class="btn" data-act="copy" disabled>Copy words</button>
<details class="opts-wrap"><summary>Formatting options</summary><div class="opts">
<label class="inline"><input type="checkbox" data-opt="dollarsWord"> Add “Dollars” <span class="hint-inline">(optional)</span></label>
<div><label for="letterCase">Letter case</label><select id="letterCase" data-opt="letterCase"><option value="sentence">Sentence case</option><option value="title">Title Case</option><option value="upper">UPPERCASE</option></select></div>
<div><label for="centsStyle">Cents style</label><select id="centsStyle" data-opt="cents"><option value="fraction">Fraction (50/100)</option><option value="words">In words (fifty cents)</option></select></div>
</div></details>
<h2 class="section-title">Check Your Written Amount</h2>
<p class="hint">Already written your check? Enter the numbers and words to verify they match. The numbers are taken from the amount above.</p>
<label for="verify">Words you wrote on the check</label>
<input id="verify" data-in="verify" autocomplete="off" placeholder="e.g. One hundred and 00/100">
<p class="verdict" role="status" data-out="result"></p>
</section>`;
