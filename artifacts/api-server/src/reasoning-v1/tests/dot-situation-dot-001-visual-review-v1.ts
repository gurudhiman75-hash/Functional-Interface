import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateDotSituationReviewQuestionV1 } from "../foundation/spatial/dot-situation-review-runtime-v1";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../../../dist/reasoning-v1/spatial");
await mkdir(outDir, { recursive: true });

const reviewSeeds = [
  "dot-review-1",
  "dot-review-2",
  "dot-review-4",
  "dot-review-7",
  "dot-review-11",
  "dot-review-18",
  "dot-review-25",
  "dot-review-36",
  "dot-review-49",
  "dot-review-64",
  "dot-review-71",
  "dot-review-72",
] as const;

const questions = reviewSeeds.map((seed) => generateDotSituationReviewQuestionV1({ seed, language: "en" }));
const cards = questions.map((q, i) => {
  const table = q.explanation.membershipTable.map((row) => `<tr><td>${row.dot}</td><td>${row.inside.join(", ") || "—"}</td><td>${row.outside.join(", ") || "—"}</td><td><code>${row.signature}</code></td></tr>`).join("");
  const options = q.optionSvgs.map((svg, index) => `<div class="option"><div class="label">${q.optionLabels[index]}</div>${svg}</div>`).join("");
  return `<section class="question">
    <h2>${i + 1}. ${q.difficulty} · ${q.solveFacts.shapeCount} shapes · ${q.solveFacts.dotCount} dot(s)</h2>
    <p class="stem">${q.stem}</p>
    <div class="stimulus"><div class="caption">Question figure</div>${q.stimulusSvg}</div>
    <div class="options">${options}</div>
    <div class="answer">Answer: <strong>${q.answer}</strong></div>
    <table><thead><tr><th>Dot</th><th>Inside</th><th>Outside</th><th>Signature</th></tr></thead><tbody>${table}</tbody></table>
    <p><strong>Rule:</strong> ${q.explanation.rule}</p>
    <p><strong>Application:</strong> ${q.explanation.application}</p>
    <p><strong>Check:</strong> ${q.explanation.check}</p>
    <details><summary>Solver evidence</summary><pre>${JSON.stringify(q.solveFacts, null, 2)}</pre></details>
  </section>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><title>SPA DOT-001 Visual Review V1</title><style>
body{font-family:Arial,sans-serif;margin:0;background:#f3f4f6;color:#111827}.wrap{max-width:1180px;margin:auto;padding:24px}.question{background:white;border:1px solid #d1d5db;border-radius:12px;padding:22px;margin:0 0 24px}.stem{font-size:18px;line-height:1.5}.stimulus{text-align:center;margin:16px 0}.caption,.label{font-weight:700}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.option{text-align:center;border:1px solid #d1d5db;border-radius:8px;padding:10px}.option svg,.stimulus svg{max-width:100%;height:auto}.answer{margin:16px 0;font-size:18px}table{border-collapse:collapse;width:100%;margin:14px 0}th,td{border:1px solid #d1d5db;padding:8px;text-align:left}pre{white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:8px}@media(max-width:800px){.options{grid-template-columns:repeat(2,1fr)}}
</style></head><body><div class="wrap"><h1>SPA DOT-001 Visual Review V1</h1><p>Review-only evidence. No Question Studio, mock-test, public-release or student-delivery gate is open.</p>${cards}</div></body></html>`;

const json = questions.map((q) => ({
  seed: q.seed,
  difficulty: q.difficulty,
  shapeCount: q.solveFacts.shapeCount,
  dotCount: q.solveFacts.dotCount,
  answer: q.answer,
  geometryFingerprint: q.geometryFingerprint,
  requiredSignatures: q.solveFacts.requiredSignatures,
  distractorFailures: q.solveFacts.distractorFailures,
  releaseGates: q.lifecycle,
}));

await writeFile(resolve(outDir, "spa-dot-001-visual-review-v1.html"), html, "utf8");
await writeFile(resolve(outDir, "spa-dot-001-visual-review-v1.json"), JSON.stringify(json, null, 2), "utf8");
console.log(`Generated DOT-001 V1 review pack with ${questions.length} questions.`);
