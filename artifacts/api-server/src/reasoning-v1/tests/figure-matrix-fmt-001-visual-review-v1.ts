import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FMT_V2_SOURCE_VARIANTS, type FigureMatrixQlIdV2 } from "../foundation/spatial/figure-matrix-review-runtime-v2";
import { generateFigureMatrixReviewQuestionV2_1 } from "../foundation/spatial/figure-matrix-review-runtime-v2-1";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../../../dist/reasoning-v1/spatial");
await mkdir(outDir, { recursive: true });

const qls: readonly FigureMatrixQlIdV2[] = ["SPA-QL-055", "SPA-QL-056", "SPA-QL-057", "SPA-QL-058", "SPA-QL-059", "SPA-QL-060"];
const reviewCases = qls.flatMap((qlId) => FMT_V2_SOURCE_VARIANTS[qlId].map((sourceVariant, index) => ({
  qlId,
  seed: `fmt-${qlId}-${index + 1}`,
  expectedSourceVariant: sourceVariant,
})));

const questions = reviewCases.map((entry) => {
  const question = generateFigureMatrixReviewQuestionV2_1({ qlId: entry.qlId, seed: entry.seed, language: "en" });
  if (question.solveFacts.sourceVariant !== entry.expectedSourceVariant) {
    throw new Error(`${entry.qlId}/${entry.seed} expected ${entry.expectedSourceVariant}, got ${question.solveFacts.sourceVariant}.`);
  }
  return question;
});

const cards = questions.map((q, i) => {
  const options = q.optionSvgs.map((svg, index) => `<div class="option"><div class="label">${q.optionLabels[index]}</div>${svg}</div>`).join("");
  const failures = q.explanation.distractorChecks.map((failure) => `<li>${failure}</li>`).join("");
  return `<section class="question">
    <div class="meta"><strong>${i + 1}. ${q.qlId}</strong><span>${q.familyLabel}</span><span>${q.solveFacts.sourceVariant.replaceAll("_", " ")}</span><span>${q.difficulty}</span><span>${q.matrixSize}×${q.matrixSize}</span></div>
    <p class="stem">${q.stem}</p>
    <div class="matrix-wrap"><div><div class="caption">Problem matrix</div>${q.matrixSvg}</div></div>
    <div class="options">${options}</div>
    <div class="answer">Answer: <strong>${q.answer}</strong></div>
    <div class="explanation">
      <p><strong>Rule:</strong> ${q.explanation.rule}</p>
      <p><strong>Worked evidence:</strong> ${q.explanation.worked}</p>
      <p><strong>Apply to the missing cell:</strong> ${q.explanation.application}</p>
      <div class="solution"><div class="caption">Completed matrix / solution illustration</div>${q.solutionSvg}</div>
      <p><strong>Verification:</strong> ${q.explanation.verification}</p>
      <div class="checks"><strong>Why the other options fail:</strong><ul>${failures}</ul></div>
    </div>
    <details><summary>Semantic solver evidence</summary><pre>${JSON.stringify(q.solveFacts, null, 2)}</pre></details>
  </section>`;
}).join("\n");

const sourceSummary = qls.map((qlId) => `<li><strong>${qlId}</strong>: ${FMT_V2_SOURCE_VARIANTS[qlId].map((value) => value.replaceAll("_", " ")).join(" · ")}</li>`).join("");
const html = `<!doctype html><html><head><meta charset="utf-8"><title>SPA FMT-001 Visual Review V2.1</title><style>
*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;background:#f3f4f6;color:#111827}.wrap{max-width:1180px;margin:auto;padding:24px}.intro,.question{background:white;border:1px solid #d1d5db;border-radius:12px;padding:22px;margin:0 0 24px}.intro li{margin:7px 0;line-height:1.45}.meta{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.meta span{background:#f3f4f6;border:1px solid #e5e7eb;border-radius:999px;padding:4px 9px;font-size:12px}.stem{font-size:18px;line-height:1.5}.matrix-wrap{display:flex;justify-content:center;margin:18px 0}.caption,.label{font-weight:700;text-align:center;margin-bottom:8px}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:18px 0}.option{text-align:center;border:1px solid #d1d5db;border-radius:8px;padding:12px;min-height:132px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}.option svg{max-width:100%;height:auto}.answer{font-size:18px;margin:14px 0}.explanation{border-top:1px solid #e5e7eb;margin-top:16px;padding-top:12px;line-height:1.55}.solution{text-align:center;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin:14px 0}.solution svg,.matrix-wrap svg{max-width:100%;height:auto}.checks{background:#f9fafb;border-left:3px solid #9ca3af;padding:10px 14px;margin-top:12px}.checks ul{margin-bottom:0}pre{white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:8px}li{margin:5px 0}@media(max-width:800px){.options{grid-template-columns:repeat(2,1fr)}}
</style></head><body><div class="wrap"><section class="intro"><h1>SPA FMT-001 Figure Matrix — Source-Saturation Visual Review V2.1</h1><p><strong>${questions.length} review questions</strong>, one explicit specimen for every declared source-real runtime variant across the six permanent FMT QLs. This revision adds the source gaps found after V1.1: 2×2 matrices, outer/inner-element deletion, staged line/element removal, reflection/inversion, shading change, directional subtraction, fill cycles and the missing compound-rule families.</p><ul>${sourceSummary}</ul><p>Inspect matrix/option scale, rule recognisability, distractor closeness, source realism, completed-matrix illustration and explanation depth. Review-only: Question Studio, persistence, mock-test, public-release and student-delivery gates remain closed.</p></section>${cards}</div></body></html>`;

const json = questions.map((q) => ({
  version: q.version,
  qlId: q.qlId,
  proposalId: q.proposalId,
  familyLabel: q.familyLabel,
  sourceVariant: q.solveFacts.sourceVariant,
  seed: q.seed,
  difficulty: q.difficulty,
  matrixSize: q.matrixSize,
  answer: q.answer,
  operation: q.solveFacts.operation,
  parameter: q.solveFacts.parameter,
  geometryFingerprint: q.geometryFingerprint,
  contentFingerprint: q.contentFingerprint,
  distractorFailures: q.solveFacts.distractorFailures,
  releaseGates: q.lifecycle,
}));

await writeFile(resolve(outDir, "spa-fmt-001-visual-review-v1.html"), html, "utf8");
await writeFile(resolve(outDir, "spa-fmt-001-visual-review-v1.json"), JSON.stringify(json, null, 2), "utf8");
console.log(`Generated FMT-001 V2.1 source-saturation review pack with ${questions.length} questions across six permanent QLs.`);
