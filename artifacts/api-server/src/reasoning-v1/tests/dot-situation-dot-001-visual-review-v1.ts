import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateDotSituationReviewQuestionV1_1 } from "../foundation/spatial/dot-situation-review-runtime-v1-1";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../../../dist/reasoning-v1/spatial");
await mkdir(outDir, { recursive: true });

const pool = Array.from({ length: 72 }, (_, index) =>
  generateDotSituationReviewQuestionV1_1({ seed: `dot-review-${index + 1}`, language: "en" }),
);

const chosenFingerprints = new Set<string>();
function takeDifficulty(difficulty: "EASY" | "MODERATE" | "HARD", count: number) {
  const selected = [] as typeof pool;
  const usedShapeSets = new Set<string>();
  const candidates = pool.filter((q) => q.difficulty === difficulty);

  // First pass prefers different primitive combinations so the review sheet exposes
  // actual source variety instead of twelve cosmetic variants of one figure family.
  for (const q of candidates) {
    const shapeSet = q.solveFacts.shapeKinds.join("+");
    if (chosenFingerprints.has(q.geometryFingerprint) || usedShapeSets.has(shapeSet)) continue;
    selected.push(q);
    chosenFingerprints.add(q.geometryFingerprint);
    usedShapeSets.add(shapeSet);
    if (selected.length === count) return selected;
  }
  for (const q of candidates) {
    if (chosenFingerprints.has(q.geometryFingerprint)) continue;
    selected.push(q);
    chosenFingerprints.add(q.geometryFingerprint);
    if (selected.length === count) return selected;
  }
  throw new Error(`DOT-001 visual review could not select ${count} ${difficulty} questions.`);
}

const questions = [
  ...takeDifficulty("EASY", 3),
  ...takeDifficulty("MODERATE", 4),
  ...takeDifficulty("HARD", 5),
];

const cards = questions.map((q, i) => {
  const table = q.explanation.membershipTable.map((row) => `<tr><td>${row.dot}</td><td>${row.inside.join(", ") || "—"}</td><td>${row.outside.join(", ") || "—"}</td><td><code>${row.signature}</code></td></tr>`).join("");
  const options = q.optionSvgs.map((svg, index) => `<div class="option"><div class="label">${q.optionLabels[index]}</div>${svg}</div>`).join("");
  return `<section class="question">
    <h2>${i + 1}. ${q.difficulty} · ${q.solveFacts.shapeCount} shapes · ${q.solveFacts.dotCount} dot(s)</h2>
    <div class="meta">${q.solveFacts.shapeKinds.join(" · ")} · seed ${q.seed}</div>
    <p class="stem">${q.stem}</p>
    <div class="stimulus"><div class="caption">Question figure</div>${q.stimulusSvg}</div>
    <div class="options">${options}</div>
    <div class="answer">Answer: <strong>${q.answer}</strong></div>
    <table><thead><tr><th>Dot</th><th>Inside</th><th>Outside</th><th>Signature</th></tr></thead><tbody>${table}</tbody></table>
    <div class="solution"><div><div class="caption">One valid placement in option ${q.answer}</div>${q.solutionSvg}</div><div class="working"><p><strong>Observation:</strong> ${q.explanation.observation}</p><p><strong>Rule:</strong> ${q.explanation.rule}</p><p><strong>Application:</strong> ${q.explanation.application}</p><p><strong>Option check:</strong> ${q.explanation.check}</p></div></div>
    <details><summary>Solver evidence</summary><pre>${JSON.stringify(q.solveFacts, null, 2)}</pre></details>
  </section>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><title>SPA DOT-001 Visual Review V1.1</title><style>
body{font-family:Arial,sans-serif;margin:0;background:#f3f4f6;color:#111827}.wrap{max-width:1180px;margin:auto;padding:24px}.question{background:white;border:1px solid #d1d5db;border-radius:12px;padding:22px;margin:0 0 24px}.stem{font-size:18px;line-height:1.5}.meta{font-size:13px;color:#4b5563;margin-top:-8px}.stimulus{text-align:center;margin:16px 0}.caption,.label{font-weight:700}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.option{text-align:center;border:1px solid #d1d5db;border-radius:8px;padding:10px}.option svg,.stimulus svg,.solution svg{max-width:100%;height:auto}.answer{margin:16px 0;font-size:18px}table{border-collapse:collapse;width:100%;margin:14px 0}th,td{border:1px solid #d1d5db;padding:8px;text-align:left}.solution{display:grid;grid-template-columns:220px 1fr;gap:22px;align-items:start;margin:18px 0;padding:16px;border:1px solid #d1d5db;border-radius:8px;background:#f9fafb}.solution>div:first-child{text-align:center}.working p{margin:0 0 12px;line-height:1.55}pre{white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:8px}@media(max-width:800px){.options{grid-template-columns:repeat(2,1fr)}.solution{grid-template-columns:1fr}}
</style></head><body><div class="wrap"><h1>SPA DOT-001 Visual Review V1.1</h1><p>Balanced review slice: 3 easy, 4 moderate and 5 hard questions. Editorial V1.1 removes machine-like stem phrasing while preserving the same semantic geometry. Review-only evidence; no Question Studio, mock-test, public-release or student-delivery gate is open.</p>${cards}</div></body></html>`;

const json = questions.map((q) => ({
  version: q.version,
  seed: q.seed,
  difficulty: q.difficulty,
  shapeCount: q.solveFacts.shapeCount,
  shapeKinds: q.solveFacts.shapeKinds,
  dotCount: q.solveFacts.dotCount,
  stem: q.stem,
  answer: q.answer,
  geometryFingerprint: q.geometryFingerprint,
  contentFingerprint: q.contentFingerprint,
  requiredSignatures: q.solveFacts.requiredSignatures,
  distractorFailures: q.solveFacts.distractorFailures,
  distractorMissingCounts: q.solveFacts.distractorMissingCounts,
  solutionIllustrationIncluded: q.validation.solutionIllustrationIncluded,
  releaseGates: q.lifecycle,
}));

await writeFile(resolve(outDir, "spa-dot-001-visual-review-v1.html"), html, "utf8");
await writeFile(resolve(outDir, "spa-dot-001-visual-review-v1.json"), JSON.stringify(json, null, 2), "utf8");
console.log(`Generated DOT-001 V1.1 balanced review pack with ${questions.length} questions.`);
