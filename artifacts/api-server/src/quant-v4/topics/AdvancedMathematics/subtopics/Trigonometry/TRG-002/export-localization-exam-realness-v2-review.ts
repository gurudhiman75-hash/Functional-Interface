import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS,
  generateExamRealLocalizedTrg002Question,
  type Trg002ExamRealnessLocale,
} from "./localization-exam-realness-v2";

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/localization-exam-realness-v2");
mkdirSync(outDir, { recursive: true });
const locales: readonly Trg002ExamRealnessLocale[] = ["hi-IN", "pa-IN"];

function esc(value: unknown) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const records = TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS.flatMap((qlId, qlIndex) => locales.map((locale) => {
  const seed = `trg002-exam-realness-v2-human-review-${String(qlIndex + 1).padStart(3, "0")}`;
  const question: any = generateExamRealLocalizedTrg002Question(qlId, seed, locale);
  return {
    qlId, cpId: question.cpId, locale, seed, difficulty: question.difficulty,
    lockedFamily: question.lockedFamily, solveMode: question.solveMode, stem: question.stem,
    options: question.options.map((option: any) => ({ label: option.label, display: option.display, isCorrect: option.isCorrect, misconceptionId: option.misconceptionId })),
    answer: question.answer, explanation: question.explanation,
    realnessRemediation: question.realnessRemediation,
    localizationProof: question.localizationProof,
    localizationMetadata: question.localizationMetadata,
    localizationLifecycle: question.localizationLifecycle,
    humanReviewStatus: question.humanReviewStatus,
    freezeStatus: question.freezeStatus,
    activationAuthorized: question.activationAuthorized,
  };
}));
if (records.length !== 192) throw new Error(`Expected 192 bilingual V2 review records, got ${records.length}.`);

const cards = records.map((record) => {
  const options = record.options.map((option: any) => `<li class="${option.isCorrect ? "correct" : ""}"><b>${esc(option.label)}.</b> ${esc(option.display)}${option.isCorrect ? " ✓" : ""}<span>${esc(option.misconceptionId ?? "CORRECT")}</span></li>`).join("");
  const steps = record.explanation.steps.map((step: any) => `<li><b>${esc(step.title)}:</b> ${esc(step.body)}</li>`).join("");
  const badges = [
    record.realnessRemediation.canonicalOverride ? "canonical-realness override" : null,
    record.realnessRemediation.artificialCompoundGivenRemoved ? "compound-given fixed" : null,
    record.realnessRemediation.fractionalMeasurementSurfaceNormalized ? "decimal measurement" : null,
    record.realnessRemediation.ambiguousBuildingDistanceStemRepaired ? "distance wording fixed" : null,
    record.realnessRemediation.slashPlaceholderRemoved ? "placeholder fixed" : null,
  ].filter(Boolean).map((item) => `<span class="badge">${esc(item)}</span>`).join(" ");
  return `<article class="card"><header><div><h2>${esc(record.qlId)} · ${esc(record.locale)} · ${esc(record.difficulty)}</h2><p>${esc(record.lockedFamily)} · ${esc(record.solveMode)}</p></div><div>${badges}</div></header><p class="stem">${esc(record.stem)}</p><div class="grid"><section><h3>Options / Answer</h3><ol>${options}</ol><p><b>Answer:</b> ${esc(record.answer)}</p></section><section><h3>Explanation</h3><p><b>Rule:</b> ${esc(record.explanation.keyRule)}</p><ol>${steps}</ol><p><b>Shortcut:</b> ${esc(record.explanation.shortcut)}</p><p><b>Trap:</b> ${esc(record.explanation.traps.join(" "))}</p></section></div><footer>Human language review: <b>${esc(record.humanReviewStatus)}</b> · Multilingual freeze: <b>NO</b> · Activation: <b>OFF</b></footer></article>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TRG-002 Hindi Punjabi Exam-Realness Remediation V2</title><style>body{font-family:Arial,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;margin:0;background:#f5f5f5;color:#111}.page{max-width:1400px;margin:auto;padding:24px}.summary,.card{background:#fff;border:1px solid #ddd;border-radius:10px;padding:20px;margin-bottom:20px}.card header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.card h2{margin:0 0 6px;font-size:19px}.card header p{margin:0;color:#666}.badge{display:inline-block;border:1px solid #bbb;border-radius:999px;padding:3px 7px;font-size:11px;margin:2px}.stem{font-size:18px;line-height:1.6}.grid{display:grid;grid-template-columns:1fr 1.5fr;gap:24px}.correct{font-weight:700}.card li{line-height:1.5;margin-bottom:6px}.card li span{display:block;color:#777;font-size:12px;margin-left:24px}.card footer{border-top:1px solid #eee;margin-top:16px;padding-top:12px;color:#555;font-size:12px}.summary li{margin:5px 0}@media(max-width:850px){.grid{grid-template-columns:1fr}.page{padding:12px}.card header{display:block}}</style></head><body><main class="page"><section class="summary"><h1>TRG-002 · Hindi/Punjabi Exam-Realness Remediation V2</h1><p><b>Scope:</b> 96 QLs × Hindi/Punjabi = 192 designated human-review records.</p><ul><li>Artificial compound-surd measured givens replaced with natural integer observation/movement givens in the affected canonical V2 variants.</li><li>1.5 m-style learner measurement formatting replaces 3/2 m-style presentation.</li><li>Building-to-building horizontal separation is made explicit.</li><li>Slash placeholders are removed.</li><li>Hindi/Punjabi pole inflections and English prose leakage are remediated.</li><li>Solutions are normalized into learner-facing solution/calculation/answer language.</li></ul><p><b>Governance:</b> REVIEW CANDIDATE V2 · human review PENDING · multilingual freeze OFF · activation OFF.</p></section>${cards}</main></body></html>`;

writeFileSync(join(outDir, "TRG-002-HI-PA-EXAM-REALNESS-REMEDIATION-V2.json"), JSON.stringify(records, null, 2), "utf8");
writeFileSync(join(outDir, "TRG-002-HI-PA-EXAM-REALNESS-REMEDIATION-V2.html"), html, "utf8");
console.log(`TRG002_EXAM_REALNESS_REMEDIATION_V2_REVIEW_EXPORT_PASS records=${records.length} qls=96 locales=2 human=PENDING freeze=NO activation=OFF`);
