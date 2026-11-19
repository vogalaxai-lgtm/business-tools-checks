export const writerTool = (v = "") => `<section class="card" data-tool="writer" aria-label="Check writer">
<label for="amt">Type the amount</label>
<input id="amt" class="hero-input" data-in="amount" inputmode="decimal" autocomplete="off" placeholder="1250.50" value="${v}">
<p class="note" data-out="note" aria-live="polite"></p>
<button type="button" class="chip" data-act="suggest" hidden></button>
<div class="check" aria-live="polite"><div class="check-amt" data-out="numeric">$0.00</div>
<div class="check-words"><span data-out="words">Your result appears here.</span> <span class="pre">Dollars</span></div></div>
<p class="err" role="alert" data-out="error"></p>
<button class="btn" data-act="copy" disabled>Copy words</button>
<details><summary>Options</summary><div class="opts">
<label class="inline"><input type="checkbox" data-opt="dollarsWord"> Add “Dollars”</label>
<select data-opt="letterCase" aria-label="Letter case"><option value="sentence">Sentence case</option><option value="title">Title Case</option><option value="upper">UPPERCASE</option></select>
<select data-opt="cents" aria-label="Cents style"><option value="fraction">Cents as 50/100</option><option value="words">Cents in words</option></select></div></details>
<details><summary>Already wrote it? Verify</summary><input data-in="verify" autocomplete="off" placeholder="Paste the words you wrote"><p class="verdict" data-out="result"></p></details>
</section>`;
