import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateFigureMatrixReviewQuestionV1, type FigureMatrixQlIdV1 } from "../foundation/spatial/figure-matrix-review-runtime-v1";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../../../dist/reasoning-v1/spatial");
await mkdir(outDir, { recursive: true });

const reviewCases: readonly { qlId: FigureMatrixQlIdV1; seed: string }[] = [
  { qlId: "SPA-QL-055", seed: "fmt-visual-unary-rotation-01" },
  { qlId: "SPA-QL-055", seed: "fmt-visual-unary-rotation-02" },
  { qlId: "SPA-QL-055", seed: "fmt-visual-unary-rotation-03" },
  { qlId: "SPA-QL-056", seed: "fmt-visual-composition-01" },
  { qlId: "SPA-QL-056", seed: "fmt-visual-composition-02" },
  { qlId: "SPA-QL-056", seed: "fmt-visual-composition-03" },
  { qlId: "SPA-QL-057", seed: "fmt-visual-count-01" },
  { qlId: "SPA-QL-057", seed: "fmt-visual-count-02" },
  { qlId: "SPA-QL-057", seed: "fmt-visual-count-03" },
  { qlId: "SPA-QL-058", seed: "fmt-visual-cycle-01" },
  { qlId: "SPA-QL-058", seed: "fmt-visual-cycle-02" },
  { qlId: "SPA-QL-058", seed: "fmt-visual-cycle-03" },
  { qlId: "SPA-QL-059", seed: "fmt-visual-orthogonal-01" },
  { qlId: "SPA-QL-059", seed: "fmt-visual-orthogonal-02" },
  { qlId: "SPA-QL-059", seed: "fmt-visual-orthogonal-03" },
  { qlId: "SPA-QL-060", seed: "fmt-visual-compound-01" },
  { qlId: "SPA-QL-060", seed: "fmt-visual-compound-02" },
  { qlId: "SPA-QL-060", seed: "fmt-visual-compound-03" },
] as const;

const questions = reviewCases.map((entry) => generateFigureMatrixReviewQuestionV1({ ...entry, language: "en" }));
const cards = questions.map((q, i) => {
  const options = q.optionSvgs.map((svg, index) => `<div class="option ${index === q.correctIndex ? "correct" : ""}"><div class="label">${q.optionLabels[index]}</div>${svg}</div>`).join("");
  const failures = q.explanation.distractorChecks.map((failure) => `<li>${failure}</li>`).join("");
  return `<section class="question">
    <div class="meta"><strong>${i + 1}. ${q.qlId}</strong><span>${q.skillMode}</span><span>${q.difficulty}</span><span>${q.matrixSize}×${q.matrixSize}</span></div>
    <p class="stem">${q.stem}</p>
    <div class="matrix-wrap"><div><div class="caption">Problem matrix</div>${q.matrixSvg}</div></div>
    <div class="options">${options}</div>
    <div class="answer">Answer: <strong>${q.answer}</strong></div>
    <div class="explanation">
      <p><strong>Rule:</strong> ${q.explanation.rule}</p>
      <p><strong>Worked row/column:</strong> ${q.explanation.worked}</p>
      <p><strong>Apply to missing cell:</strong> ${q.explanation.application}</p>
      <div class="solution"><div class="caption">Completed matrix / solution illustration</div>${q.solutionSvg}</div>
      <p><strong>Verification:</strong> ${q.explanation.verification}</p>
      <ul>${failures}</ul>
    </div>
    <details><summary>Semantic solver evidence</summary><pre>${JSON.stringify(q.solveFacts, null, 2)}</pre></details>
  </section>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><title>SPA FMT-001 Visual Review V1</title><style>
*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;background:#f3f4f6;color:#111827}.wrap{max-width:1180px;margin:auto;padding:24px}.intro,.question{background:white;border:1px solid #d1d5db;border-radius:12px;padding:22px;margin:0 0 24px}.meta{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.meta span{background:#f3f4f6;border:1px solid #e5e7eb;border-radius:999px;padding:4px 9px;font-size:12px}.stem{font-size:18px;line-height:1.5}.matrix-wrap{display:flex;justify-content:center;margin:18px 0}.caption,.label{font-weight:700;text-align:center;margin-bottom:8px}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:18px 0}.option{text-align:center;border:1px solid #d1d5db;border-radius:8px;padding:12px;min-height:132px}.option svg{max-width:100%;height:auto}.answer{font-size:18px;margin:14px 0}.explanation{border-top:1px solid #e5e7eb;margin-top:16px;padding-top:12px;line-height:1.5}.solution{text-align:center;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin:14px 0}.solution svg,.matrix-wrap svg{max-width:100%;height:auto}pre{white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:8px}li{margin:5px 0}@media(max-width:800px){.options{grid-template-columns:repeat(2,1fr)}}
</style></head><body><div class="wrap"><section class="intro"><h1>SPA FMT-001 Figure Matrix — Visual Review V1</h1><p>18 review-only questions: three from each permanent QL. Inspect source-real rule variety, matrix scale, option legibility, solution illustration and explanation depth. Question Studio, mock-test, public-release and student-delivery gates remain closed.</p></section>${cards}</div></body></html>`;

const json = questions.map((q) => ({
  qlId: q.qlId,
  proposalId: q.proposalId,
  skillMode: q.skillMode,
  seed: q.seed,
  difficulty: q.difficulty,
  matrixSize: q.matrixSize,
  answer: q.answer,
  operation: q.solveFacts.operation,
  parameter: q.solveFacts.parameter,
  geometryFingerprint: q.geometryFingerprint,
  distractorFailures: q.solveFacts.distractorFailures,
  releaseGates: q.lifecycle,
}));

await writeFile(resolve(outDir, "spa-fmt-001-visual-review-v1.html"), html, "utf8");
await writeFile(resolve(outDir, "spa-fmt-001-visual-review-v1.json"), JSON.stringify(json, null, 2), "utf8");
console.log(`Generated FMT-001 V1 visual review pack with ${questions.length} questions across six permanent QLs.`);
