import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateIdenticalFigureReviewQuestionV1 } from "../foundation/spatial/identical-figure-review-runtime-v1";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../../../dist/reasoning-v1/spatial");
await mkdir(outDir, { recursive: true });

const reviewPlan = [
  ["SPA-QL-061", "idf-review-1"],
  ["SPA-QL-061", "idf-review-2"],
  ["SPA-QL-061", "idf-review-3"],
  ["SPA-QL-061", "idf-review-8"],
  ["SPA-QL-061", "idf-review-15"],
  ["SPA-QL-062", "idf-review-4"],
  ["SPA-QL-062", "idf-review-9"],
  ["SPA-QL-062", "idf-review-17"],
  ["SPA-QL-062", "idf-review-26"],
  ["SPA-QL-062", "idf-review-41"],
  ["SPA-QL-063", "idf-review-5"],
  ["SPA-QL-063", "idf-review-12"],
  ["SPA-QL-063", "idf-review-23"],
  ["SPA-QL-063", "idf-review-37"],
  ["SPA-QL-063", "idf-review-64"],
] as const;

const questions = reviewPlan.map(([qlId, seed]) => generateIdenticalFigureReviewQuestionV1({ qlId, seed, language: "en" }));

const familyLabel = (qlId: string) => qlId === "SPA-QL-061"
  ? "Component identity grouping"
  : qlId === "SPA-QL-062" ? "Topology grouping" : "Transform-equivalence grouping";

const cards = questions.map((q, index) => {
  const options = q.options.map((option, optionIndex) => `<div class="option ${optionIndex === q.correctIndex ? "correct" : ""}"><div class="label">${q.optionLabels[optionIndex]}</div><div class="option-text">${option.text}</div></div>`).join("");
  const table = q.explanation.groupTable.map((row, groupIndex) => `<tr><td>${groupIndex + 1}</td><td>${row.members}</td><td>${row.reason}</td><td><code>${row.semanticKey}</code></td></tr>`).join("");
  const failures = q.solveFacts.distractorFailures.map((failure) => `<li>Option ${failure.option}: mixed group (${failure.mixedGroup.join(", ")})</li>`).join("");
  return `<section class="question">
    <div class="meta"><strong>${index + 1}. ${q.qlId}</strong> · ${familyLabel(q.qlId)} · ${q.difficulty}${q.solveFacts.transformPolicy ? ` · ${q.solveFacts.transformPolicy}` : ""}</div>
    <p class="stem">${q.stem}</p>
    <div class="stimulus"><div class="caption">Numbered figure bank</div>${q.stimulusSvg}</div>
    <div class="options">${options}</div>
    <div class="answer">Answer: <strong>${q.answer}</strong> · ${q.options[q.correctIndex].text}</div>
    <table><thead><tr><th>Group</th><th>Members</th><th>Why they belong together</th><th>Semantic key</th></tr></thead><tbody>${table}</tbody></table>
    <div class="explanation">
      <p><strong>Observation:</strong> ${q.explanation.observation}</p>
      <p><strong>Rule:</strong> ${q.explanation.rule}</p>
      <p><strong>Application:</strong> ${q.explanation.application}</p>
      <p><strong>Distractor check:</strong> ${q.explanation.check}</p>
      <ul>${failures}</ul>
    </div>
    <div class="solution"><div class="caption">Solution: figures arranged in the three correct groups</div>${q.explanation.solutionSvg}</div>
    <details><summary>Solver evidence</summary><pre>${JSON.stringify(q.solveFacts, null, 2)}</pre></details>
  </section>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><title>SPA IDF-001 Visual Review V1</title><style>
body{font-family:Arial,sans-serif;margin:0;background:#f3f4f6;color:#111827}.wrap{max-width:1180px;margin:auto;padding:24px}.question{background:white;border:1px solid #d1d5db;border-radius:12px;padding:22px;margin:0 0 26px}.meta{font-size:14px;color:#374151}.stem{font-size:18px;line-height:1.5}.stimulus,.solution{text-align:center;margin:18px 0}.caption{font-weight:700;margin:0 0 8px}.options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.option{border:1px solid #d1d5db;border-radius:8px;padding:12px}.option.correct{border-width:2px}.label{font-weight:700}.option-text{font-size:16px;margin-top:6px}.answer{margin:16px 0;font-size:18px}table{border-collapse:collapse;width:100%;margin:14px 0}th,td{border:1px solid #d1d5db;padding:8px;text-align:left;vertical-align:top}.explanation{line-height:1.45}pre{white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:8px}svg{max-width:100%;height:auto}@media(max-width:760px){.options{grid-template-columns:1fr}.wrap{padding:10px}.question{padding:14px}}
</style></head><body><div class="wrap"><h1>SPA IDF-001 Identical Figure / Figure Grouping — Visual Review V1</h1><p>Source-saturated review checkpoint. The numbered-bank grouping surface is retained. Question Studio, mock-test, public-release and student-delivery gates remain closed.</p>${cards}</div></body></html>`;

const json = questions.map((q) => ({
  qlId: q.qlId,
  seed: q.seed,
  difficulty: q.difficulty,
  transformPolicy: q.solveFacts.transformPolicy,
  answer: q.answer,
  correctPartition: q.solveFacts.correctPartition,
  geometryFingerprint: q.geometryFingerprint,
  semanticKeysByFigure: q.solveFacts.semanticKeysByFigure,
  distractorFailures: q.solveFacts.distractorFailures,
  releaseGates: q.lifecycle,
}));

await writeFile(resolve(outDir, "spa-idf-001-visual-review-v1.html"), html, "utf8");
await writeFile(resolve(outDir, "spa-idf-001-visual-review-v1.json"), JSON.stringify(json, null, 2), "utf8");
console.log(`Generated IDF-001 V1 visual review pack with ${questions.length} questions.`);
