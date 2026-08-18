import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  TRG_002_CP009_LOCALIZATION_QL_IDS,
  type Trg002Cp009LocalizedLocale,
} from "./localization-cp009-v1";
import { generateLocalizedTrg002Cp009QuestionCompat } from "./localization-cp009-v1-compat";

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/localization-cp009-v1");
mkdirSync(outDir, { recursive: true });
const locales: readonly Trg002Cp009LocalizedLocale[] = ["hi-IN", "pa-IN"];

function esc(value: unknown) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const records = TRG_002_CP009_LOCALIZATION_QL_IDS.flatMap((qlId, qlIndex) => locales.map((locale) => {
  const seed = `trg002-cp009-language-review-${String(qlIndex + 1).padStart(2, "0")}`;
  const question: any = generateLocalizedTrg002Cp009QuestionCompat(qlId, seed, locale);
  return {
    qlId, cpId: question.cpId, locale, seed, difficulty: question.difficulty,
    lockedFamily: question.lockedFamily, solveMode: question.solveMode, stem: question.stem,
    options: question.options.map((option: any) => ({ label: option.label, display: option.display, isCorrect: option.isCorrect, misconceptionId: option.misconceptionId })),
    answer: question.answer, explanation: question.explanation, localizationProof: question.localizationProof,
    localizationMetadata: question.localizationMetadata, localizationLifecycle: question.localizationLifecycle,
    humanReviewStatus: question.humanReviewStatus, freezeStatus: question.freezeStatus, activationAuthorized: question.activationAuthorized,
  };
}));
if (records.length !== 48) throw new Error(`Expected 48 CP009 bilingual review records, got ${records.length}.`);

const cards = records.map((record) => {
  const options = record.options.map((option: any) => `<li class="${option.isCorrect ? "correct" : ""}"><b>${esc(option.label)}.</b> ${esc(option.display)}${option.isCorrect ? " ✓" : ""}<span>${esc(option.misconceptionId ?? "CORRECT")}</span></li>`).join("");
  const steps = record.explanation.steps.map((step: any) => `<li><b>${esc(step.title)}:</b> ${esc(step.body)}</li>`).join("");
  return `<article class="card"><header><h2>${esc(record.qlId)} · ${esc(record.locale)} · ${esc(record.difficulty)}</h2><p>${esc(record.lockedFamily)} · ${esc(record.solveMode)}</p></header><p class="stem">${esc(record.stem)}</p><div class="grid"><section><h3>Options / Answer</h3><ol>${options}</ol><p><b>Answer:</b> ${esc(record.answer)}</p></section><section><h3>Explanation</h3><p><b>Rule:</b> ${esc(record.explanation.keyRule)}</p><ol>${steps}</ol><p><b>Shortcut:</b> ${esc(record.explanation.shortcut)}</p><p><b>Trap:</b> ${esc(record.explanation.traps.join(" "))}</p></section></div><footer>Canonical semantic fingerprint: <code>${esc(record.localizationProof.canonicalSemanticFingerprint)}</code><br>Human language review: <b>${esc(record.humanReviewStatus)}</b> · Multilingual freeze: <b>NO</b> · Activation: <b>OFF</b></footer></article>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TRG-002 CP009 Hindi Punjabi Localization Review V1</title><style>body{font-family:Arial,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;margin:0;background:#f5f5f5;color:#111}.page{max-width:1400px;margin:auto;padding:24px}.summary,.card{background:#fff;border:1px solid #ddd;border-radius:10px;padding:20px;margin-bottom:20px}.card h2{margin:0 0 6px;font-size:19px}.card header p{margin:0;color:#666}.stem{font-size:18px;line-height:1.55}.grid{display:grid;grid-template-columns:1fr 1.4fr;gap:24px}.correct{font-weight:700}.card li span{display:block;color:#777;font-size:12px;margin-left:24px}.card footer{border-top:1px solid #eee;margin-top:16px;padding-top:12px;color:#555;font-size:12px;overflow-wrap:anywhere}code{font-size:11px}@media(max-width:850px){.grid{grid-template-columns:1fr}.page{padding:12px}}</style></head><body><main class="page"><section class="summary"><h1>TRG-002 · TRG-CP-009 · Hindi/Punjabi Localization Review V1</h1><p><b>Scope:</b> 24 frozen English QLs × 2 localized learner surfaces = 48 designated review records.</p><p>Families covered: same-side two observations, moving closer, moving farther, original-distance recovery, movement/separation recovery and controlled two-object comparisons.</p><p>English answers, option semantics, canonical spatial state and solution diagrams are preserved. This pack is for <b>human language review</b>; it does not grant multilingual freeze or activation.</p><p><b>Status:</b> REVIEW CANDIDATE V1 · human language review PENDING · multilingual freeze NO · activation OFF.</p></section>${cards}</main></body></html>`;
writeFileSync(join(outDir, "TRG-002-CP009-HI-PA-LOCALIZATION-REVIEW-V1.json"), JSON.stringify(records, null, 2), "utf8");
writeFileSync(join(outDir, "TRG-002-CP009-HI-PA-LOCALIZATION-REVIEW-V1.html"), html, "utf8");
console.log(`TRG002_CP009_LOCALIZATION_REVIEW_EXPORT_PASS records=${records.length} qls=24 locales=2 human=PENDING freeze=NO activation=OFF`);
