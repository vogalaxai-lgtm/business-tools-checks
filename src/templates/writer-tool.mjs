const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const writerTool = (v = "") => `<section class="card" data-tool="writer" aria-label="Check writer">
<label for="amt">Type the amount</label>
<input id="amt" class="hero-input" data-in="amount" inputmode="decimal" autocomplete="off" placeholder="1250.50" value="${esc(v)}">
<p class="note" data-out="note" aria-live="polite"></p>
<button type="button" class="chip" data-act="suggest" hidden></button>
<p class="err" role="alert" data-out="error"></p>
<h2 class="section-title">Formatting options</h2>
<div class="opts">
<label class="inline"><input type="checkbox" data-opt="dollarsWord"> Add “Dollars”</label>
<select data-opt="letterCase" aria-label="Letter case"><option value="sentence">Sentence case</option><option value="title">Title Case</option><option value="upper">UPPERCASE</option></select>
<select data-opt="cents" aria-label="Cents style"><option value="fraction">Cents as 50/100</option><option value="words">Cents in words</option></select></div>
<h2 class="section-title">Your result</h2>
<div class="check" aria-live="polite"><div class="check-amt" data-out="numeric">$0.00</div>
<div class="check-words"><span data-out="words">Your result appears here.</span></div></div>
<button class="btn" data-act="copy" disabled>Copy words</button>
<h2 class="section-title">Check Your Written Amount</h2>
<p class="hint">Already written your check? Enter the numbers and words to verify they match. The numbers are taken from the amount above.</p>
<input data-in="verify" autocomplete="off" placeholder="Words you wrote on the check">
<p class="verdict" role="status" data-out="result"></p>
</section>`;
