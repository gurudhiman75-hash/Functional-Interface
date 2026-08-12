import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateCp003AllFinalNativeReviewCandidates } from "./native-final-candidate";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}

const rows = generateCp003AllFinalNativeReviewCandidates().map(({ source, presentation, finalNativeReview }) => ({
  language: presentation.language,
  locale: presentation.locale,
  permanentQlId: presentation.permanentQlId,
  authorityKey: presentation.authorityKey,
  authorityOwnerCheckpointId: presentation.authorityOwnerCheckpointId,
  sourceQuestionLanguageId: presentation.sourceQuestionLanguageId,
  questionLanguageId: presentation.questionLanguageId,
  solveMode: presentation.solveMode,
  representation: presentation.representation,
  difficulty: presentation.difficulty,
  seed: presentation.seed,
  mathematicalFingerprint: presentation.mathematicalFingerprint,
  english: Object.freeze({
    stem: source.stem,
    options: source.options,
    correctIndex: source.correctIndex,
    answerText: source.answerText,
    explanation: Object.freeze({
      method: source.explanation.keyRule,
      steps: source.explanation.stepByStepSolution,
      examSpeedShortcut: source.explanation.examSpeedShortcut,
      answer: source.explanation.conclusion,
    }),
  }),
  native: Object.freeze({
    stem: presentation.stem,
    options: presentation.options,
    correctIndex: presentation.correctIndex,
    answerText: presentation.answerText,
    explanation: presentation.explanation,
  }),
  finalNativeReview,
  lifecycle: presentation.lifecycle,
}));

const out = resolve(process.cwd(), "dist/quant-v4/tsd-001/cp003-native-final-review");
mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, "tsd-cp003-hi-pa-final-review.json"), JSON.stringify(rows, null, 2));
writeFileSync(resolve(out, "tsd-cp003-hi-pa-final-review.jsonl"), rows.map((row) => JSON.stringify(row)).join("\n") + "\n");

const cards = rows.map((row, index) => {
  const nativeOptions = row.native.options.map((option, optionIndex) => `<li class="${optionIndex === row.native.correctIndex ? "correct" : ""}">${String.fromCharCode(65 + optionIndex)}. ${escapeHtml(option)}</li>`).join("");
  const englishOptions = row.english.options.map((option, optionIndex) => `<li class="${optionIndex === row.english.correctIndex ? "correct" : ""}">${String.fromCharCode(65 + optionIndex)}. ${escapeHtml(option)}</li>`).join("");
  const steps = row.native.explanation.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  return `<article class="card" data-language="${row.language}" data-ql="${row.permanentQlId}" data-mode="${escapeHtml(row.solveMode)}">
<header><strong>${index + 1}. ${row.permanentQlId}</strong> · ${row.locale} · ${escapeHtml(row.solveMode)} · ${escapeHtml(row.difficulty.label)}</header>
<div class="grid"><section><h3>Frozen English authority</h3><p>${escapeHtml(row.english.stem)}</p><ol>${englishOptions}</ol><p><b>Answer:</b> ${escapeHtml(row.english.answerText)}</p></section>
<section><h3>${row.language === "hi" ? "Hindi final review candidate" : "Punjabi final review candidate"}</h3><p class="native">${escapeHtml(row.native.stem)}</p><ol class="native">${nativeOptions}</ol><p class="native"><b>${row.language === "hi" ? "विधि" : "ਵਿਧੀ"}:</b> ${escapeHtml(row.native.explanation.method)}</p><ol class="native">${steps}</ol><p class="native"><b>${row.language === "hi" ? "परीक्षा शॉर्टकट" : "ਪਰੀਖਿਆ ਸ਼ਾਰਟਕੱਟ"}:</b> ${escapeHtml(row.native.explanation.examSpeedShortcut)}</p><p class="native"><b>${escapeHtml(row.native.explanation.answer)}</b></p></section></div>
<details><summary>Identity and lifecycle</summary><code>${escapeHtml(row.questionLanguageId)}</code><br><code>${escapeHtml(row.mathematicalFingerprint)}</code><pre>${escapeHtml(JSON.stringify({finalNativeReview:row.finalNativeReview,lifecycle:row.lifecycle},null,2))}</pre></details></article>`;
}).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TSD CP-003 Final Hindi/Punjabi Review Candidate</title><style>
body{font-family:system-ui,-apple-system,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;margin:0;background:#f5f5f5;color:#1d1d1f}main{max-width:1240px;margin:auto;padding:24px}.notice,.toolbar{background:white;padding:14px;border:1px solid #ddd;border-radius:10px;margin-bottom:16px}.toolbar{position:sticky;top:0;z-index:2}.card{background:white;border:1px solid #ddd;border-radius:12px;padding:18px;margin:16px 0}.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}.native{font-size:1.05rem;line-height:1.65}.correct{font-weight:700}.correct::after{content:" ✓"}ol{padding-left:24px}code,pre{font-size:.8rem;white-space:pre-wrap;word-break:break-all}select,input{padding:8px;margin-right:8px}@media(max-width:760px){.grid{grid-template-columns:1fr}main{padding:10px}}
</style></head><body><main><h1>TSD-CP-003 Final Hindi/Punjabi Review Candidate</h1><div class="notice"><b>Lifecycle:</b> English is frozen. Hindi/Punjabi are ready for product-owner native review but remain UNFROZEN. Final learner explanations contain method, connected steps, exam shortcut and answer only. Option analysis is excluded. Native subject/object nouns must match the English source; rows without an English actor remain object-neutral. Question Studio, storage, tests and public delivery remain locked.</div><div class="toolbar"><select id="lang"><option value="all">All languages</option><option value="hi">Hindi</option><option value="pa">Punjabi</option></select><input id="search" placeholder="QL or solve mode"></div>${cards}<script>const lang=document.getElementById('lang'),search=document.getElementById('search');function apply(){const l=lang.value,q=search.value.toLowerCase();document.querySelectorAll('.card').forEach(c=>{const ok=l==='all'||c.dataset.language===l;const hay=(c.dataset.ql+' '+c.dataset.mode+' '+c.innerText).toLowerCase();c.style.display=ok&&hay.includes(q)?'block':'none';});}lang.addEventListener('change',apply);search.addEventListener('input',apply);</script></main></body></html>`;
writeFileSync(resolve(out, "tsd-cp003-hi-pa-final-review.html"), html);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_HI_PA_FINAL_REVIEW_EXPORT",
  rows: rows.length,
  hindiRows: rows.filter((row) => row.language === "hi").length,
  punjabiRows: rows.filter((row) => row.language === "pa").length,
  explanationContract: "METHOD_STEPS_SHORTCUT_ANSWER",
  optionAnalysisIncluded: false,
  sourceObjectParityEnforced: true,
  productOwnerApprovalRecorded: false,
  multilingualFreezeAuthorized: false,
  outputDirectory: out,
}, null, 2));
