import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { TRG_002_PRODUCTION_96_IDS } from "./production-96-registry";
import { generateLocalizedTrg002Cp007Question } from "./localization-cp007-v1";
import { generateLocalizedTrg002Cp008QuestionCompat } from "./localization-cp008-v1-compat";
import { generateLocalizedTrg002Cp009QuestionCompat } from "./localization-cp009-v1-compat";
import { generateLocalizedTrg002Cp010Question } from "./localization-cp010-v1";

type Locale = "hi-IN" | "pa-IN";
const LOCALES: readonly Locale[] = ["hi-IN", "pa-IN"];
const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/localization-chapter-v1");
mkdirSync(outDir, { recursive: true });
function qlNumber(qlId: string) { const match = /^TRG-002-QL-(\d{3})$/.exec(qlId); if (!match) throw new Error(`Invalid QL ${qlId}`); return Number(match[1]); }
function localized(qlId: string, seed: string, locale: Locale): any {
  const n = qlNumber(qlId);
  if (n <= 24) return generateLocalizedTrg002Cp007Question(qlId, seed, locale as any);
  if (n <= 48) return generateLocalizedTrg002Cp008QuestionCompat(qlId, seed, locale as any);
  if (n <= 72) return generateLocalizedTrg002Cp009QuestionCompat(qlId, seed, locale as any);
  return generateLocalizedTrg002Cp010Question(qlId, seed, locale as any);
}
function esc(value: unknown) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }

const records = TRG_002_PRODUCTION_96_IDS.flatMap((qlId) => LOCALES.map((locale) => {
  const seed = `trg002-chapter-language-review-${qlId}`;
  const q = localized(qlId, seed, locale);
  return {
    qlId, cpId: q.cpId, locale, seed, difficulty: q.difficulty, lockedFamily: q.lockedFamily, solveMode: q.solveMode,
    stem: q.stem, options: q.options.map((o: any) => ({ label: o.label, display: o.display, isCorrect: o.isCorrect, misconceptionId: o.misconceptionId })),
    answer: q.answer, explanation: q.explanation, localizationProof: q.localizationProof, localizationMetadata: q.localizationMetadata,
    localizationLifecycle: q.localizationLifecycle, humanReviewStatus: q.humanReviewStatus, freezeStatus: q.freezeStatus,
    activationAuthorized: q.activationAuthorized, questionStudioDiscoverable: q.questionStudioDiscoverable,
    questionBankStatus: q.questionBankStatus, testEligibility: q.testEligibility, publiclyPublishable: q.publiclyPublishable,
  };
}));
if (records.length !== 192) throw new Error(`Expected 192 chapter bilingual review records, got ${records.length}.`);

const cards = records.map((record) => {
  const options = record.options.map((option: any) => `<li class="${option.isCorrect ? "correct" : ""}"><b>${esc(option.label)}.</b> ${esc(option.display)}${option.isCorrect ? " ✓" : ""}<span>${esc(option.misconceptionId ?? "CORRECT")}</span></li>`).join("");
  const steps = record.explanation.steps.map((step: any) => `<li><b>${esc(step.title)}:</b> ${esc(step.body)}</li>`).join("");
  return `<article class="card"><header><h2>${esc(record.qlId)} · ${esc(record.locale)} · ${esc(record.difficulty)}</h2><p>${esc(record.cpId)} · ${esc(record.lockedFamily)} · ${esc(record.solveMode)}</p></header><p class="stem">${esc(record.stem)}</p><div class="grid"><section><h3>Options / Answer</h3><ol>${options}</ol><p><b>Answer:</b> ${esc(record.answer)}</p></section><section><h3>Explanation</h3><p><b>Rule:</b> ${esc(record.explanation.keyRule)}</p><ol>${steps}</ol><p><b>Shortcut:</b> ${esc(record.explanation.shortcut)}</p><p><b>Trap:</b> ${esc(record.explanation.traps.join(" "))}</p></section></div><footer>Canonical semantic fingerprint: <code>${esc(record.localizationProof.canonicalSemanticFingerprint)}</code><br>Localization fingerprint: <code>${esc(record.localizationProof.localizationFingerprint)}</code><br>Human language review: <b>${esc(record.humanReviewStatus)}</b> · Multilingual freeze: <b>NO</b> · Activation: <b>OFF</b></footer></article>`;
}).join("\n");
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TRG-002 Hindi Punjabi Chapter Review V1</title><style>body{font-family:Arial,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;margin:0;background:#f5f5f5;color:#111}.page{max-width:1450px;margin:auto;padding:24px}.summary,.card{background:#fff;border:1px solid #ddd;border-radius:10px;padding:20px;margin-bottom:20px}.card h2{margin:0 0 6px;font-size:19px}.card header p{margin:0;color:#666}.stem{font-size:18px;line-height:1.55}.grid{display:grid;grid-template-columns:1fr 1.4fr;gap:24px}.correct{font-weight:700}.card li span{display:block;color:#777;font-size:12px;margin-left:24px}.card footer{border-top:1px solid #eee;margin-top:16px;padding-top:12px;color:#555;font-size:12px;overflow-wrap:anywhere}code{font-size:11px}@media(max-width:850px){.grid{grid-template-columns:1fr}.page{padding:12px}}</style></head><body><main class="page"><section class="summary"><h1>TRG-002 · Full Hindi/Punjabi Chapter Review V1</h1><p><b>Scope:</b> 96 frozen English QLs × Hindi/Punjabi = 192 designated learner-review records across TRG-CP-007...010.</p><p>The four dedicated CP gates cover 2,304 semantic-parity cases. This combined pack is the chapter-level human-language review surface.</p><p>Canonical mathematics, answers, option semantics, correct positions, spatial states and solution diagrams remain frozen English authority.</p><p><b>Status:</b> REVIEW CANDIDATE V1 · human language review PENDING · multilingual freeze NO · Question Studio OFF · product activation OFF.</p></section>${cards}</main></body></html>`;
writeFileSync(join(outDir, "TRG-002-HI-PA-CHAPTER-REVIEW-V1.json"), JSON.stringify(records, null, 2), "utf8");
writeFileSync(join(outDir, "TRG-002-HI-PA-CHAPTER-REVIEW-V1.html"), html, "utf8");
console.log(`TRG002_LOCALIZATION_CHAPTER_REVIEW_EXPORT_PASS records=${records.length} qls=96 locales=2 human=PENDING freeze=NO activation=OFF`);
