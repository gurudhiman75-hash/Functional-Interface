import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { generateApprovedOpsQuestion } from "./approved-teaching-canonical";
import {
  localizeApprovedOpsQuestion,
  type ApprovedOpsLocale,
  type LocalizedApprovedOpsQuestion,
} from "./approved-localization-entry";

const CANDIDATES = ["OPS-CAND-017", "OPS-CAND-026", "OPS-CAND-027"] as const;
const SEEDS = [0, 1, 2, 3, 5] as const;
const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly ApprovedOpsLocale[];

type ReviewRecord = LocalizedApprovedOpsQuestion & { reviewId: string };

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function letter(index: number): string {
  return String.fromCharCode(65 + index);
}

function record(question: LocalizedApprovedOpsQuestion): ReviewRecord {
  return {
    ...question,
    reviewId: `${question.candidateId}-${question.locale}-S${String(question.seed).padStart(3, "0")}`,
  };
}

function renderCard(item: ReviewRecord, ordinal: number): string {
  const language = item.locale === "hi-IN" ? "हिंदी" : "ਪੰਜਾਬੀ";
  const optionLabel = item.locale === "hi-IN" ? "विकल्प" : "ਵਿਕਲਪ";
  const answerLabel = item.locale === "hi-IN" ? "सही उत्तर" : "ਸਹੀ ਉੱਤਰ";
  const reviewLabel = item.locale === "hi-IN"
    ? "[ ] विकल्पों में अंग्रेज़ी शेष नहीं है  [ ] अर्थ सही है  [ ] प्रश्न स्वाभाविक है"
    : "[ ] ਵਿਕਲਪਾਂ ਵਿੱਚ ਅੰਗਰੇਜ਼ੀ ਬਾਕੀ ਨਹੀਂ ਹੈ  [ ] ਅਰਥ ਸਹੀ ਹੈ  [ ] ਸਵਾਲ ਸੁਭਾਵਿਕ ਹੈ";
  const options = item.options.map((option, index) =>
    `<li><b>${letter(index)}.</b> ${escapeHtml(option.value)}</li>`
  ).join("");
  return `<article class="card" data-locale="${item.locale}" data-candidate="${item.candidateId}">
<header><b>#${ordinal} ${item.reviewId}</b><span>${language} · ${item.checkpointId}</span></header>
<h2>${escapeHtml(item.stem)}</h2>
<h3>${optionLabel}</h3><ol class="options">${options}</ol>
<p class="answer"><b>${answerLabel}: ${letter(item.correctIndex)} — ${escapeHtml(item.answer)}</b></p>
<p class="review">${reviewLabel}</p>
<label>${item.locale === "hi-IN" ? "टिप्पणी" : "ਟਿੱਪਣੀ"}<textarea rows="3"></textarea></label>
</article>`;
}

function renderHtml(records: readonly ReviewRecord[]): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>OPS-001 Targeted Hindi Punjabi Option Review</title>
<style>
*,*::before,*::after{box-sizing:border-box}:root{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.55;color:#18181b;background:#f4f4f5}body{margin:0}.toolbar{position:sticky;top:0;background:#fff;border-bottom:1px solid #d4d4d8;padding:10px;display:flex;gap:8px;flex-wrap:wrap;z-index:2}.toolbar select{padding:8px}main{max-width:920px;margin:auto;padding:12px}.hero,.card{background:#fff;border:1px solid #d4d4d8;border-radius:10px;padding:16px;margin-bottom:16px}.hero{border-left:5px solid #f59e0b}.card header{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;color:#52525b;border-bottom:1px solid #e4e4e7;padding-bottom:8px}.card h2{font-size:1.08rem}.options{list-style:none;padding:0;display:grid;gap:7px}.options li{border:1px solid #e4e4e7;border-radius:7px;padding:9px;overflow-wrap:anywhere}.answer{background:#ecfdf5;border-left:4px solid #10b981;padding:9px}.review{background:#fffbeb;padding:9px}textarea{display:block;width:100%;margin-top:5px}.hidden{display:none}@media(max-width:390px){main{padding:8px}.card{padding:12px}}@media print{.toolbar{display:none}.card{break-inside:avoid}}
</style></head><body>
<div class="toolbar"><select id="locale"><option value="">Both languages</option><option value="hi-IN">Hindi</option><option value="pa-IN">Punjabi</option></select><select id="candidate"><option value="">All affected contracts</option>${CANDIDATES.map((id)=>`<option>${id}</option>`).join("")}</select><span id="count"></span></div>
<main><section class="hero"><h1>OPS-001 targeted localized-option review</h1><p><b>30 records:</b> 3 affected contracts × 5 seeds × 2 languages.</p><p>Only the distractor-option wording changed. Mathematical symbols, answers, correct indices and solver proofs are unchanged.</p></section>${records.map(renderCard).join("\n")}</main>
<script>const cards=[...document.querySelectorAll('.card')],locale=document.getElementById('locale'),candidate=document.getElementById('candidate'),count=document.getElementById('count');function filter(){let n=0;for(const card of cards){const ok=(!locale.value||card.dataset.locale===locale.value)&&(!candidate.value||card.dataset.candidate===candidate.value);card.classList.toggle('hidden',!ok);if(ok)n++}count.textContent=n+' visible'}locale.addEventListener('change',filter);candidate.addEventListener('change',filter);filter();</script>
</body></html>`;
}

async function main(): Promise<void> {
  const outputDir = resolve(process.argv[2] ?? "ops-001-localized-option-fix-review");
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  const records = LOCALES.flatMap((locale) => CANDIDATES.flatMap((candidateId) =>
    SEEDS.map((seed) => record(localizeApprovedOpsQuestion(generateApprovedOpsQuestion(candidateId, seed), locale)))
  ));
  if (records.length !== 30) throw new Error(`Expected 30 targeted records; found ${records.length}.`);
  await Promise.all([
    writeFile(resolve(outputDir, "OPS-001-HI-PA-TARGETED-OPTION-FIX-30.html"), renderHtml(records), "utf8"),
    writeFile(resolve(outputDir, "OPS-001-HI-PA-TARGETED-OPTION-FIX-30.json"), JSON.stringify({
      generatedAt: new Date().toISOString(),
      candidates: CANDIDATES,
      seeds: SEEDS,
      locales: LOCALES,
      count: records.length,
      records,
    }, null, 2), "utf8"),
    writeFile(resolve(outputDir, "README.md"), "# OPS-001 Targeted Localized Option Review\n\nThis bundle contains only OPS-CAND-017, OPS-CAND-026 and OPS-CAND-027. It verifies corrected Hindi/Punjabi distractor wording. Mathematical answers and solver semantics are unchanged.\n", "utf8"),
  ]);
  console.log("OPS-001 targeted localized option review generated.", { records: records.length, outputDir });
}

await main();
