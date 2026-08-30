import { mkdirSync, writeFileSync } from "node:fs";
import {
  generateCountingFiguresQuestionStudioSeededV1,
  type CountingFiguresQuestionStudioQuestionV1,
} from "../foundation/spatial/counting-figures-question-studio-seeded-runtime-v1";
import type { CountingFigureTargetShapeV1 } from "../foundation/spatial/counting-figures-production-generator-v1";
import type { CountingFigureMotifFamilyV2 } from "../foundation/spatial/counting-figures-production-generator-v2";

const TARGETS: readonly CountingFigureTargetShapeV1[] = ["TRIANGLE", "SQUARE", "RECTANGLE", "QUADRILATERAL"];
const REQUIRED_MOTIFS: readonly CountingFigureMotifFamilyV2[] = [
  "TRIANGLE_FAN",
  "CROSSED_QUADRILATERAL_TRIANGLES",
  "DOUBLE_TRIANGLE_FAN",
  "SQUARE_GRID",
  "ROTATED_SQUARE_GRID",
  "RECTANGULAR_GRID_SQUARES",
  "IRREGULAR_RECTANGLE_GRID",
  "QUADRILATERAL_STRIP",
  "DIAGONAL_SQUARE_GRID",
  "DIAGONAL_RECTANGLE_GRID",
  "QUADRILATERAL_LATTICE",
];
const REVIEW_COUNT = 28;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const pool: CountingFiguresQuestionStudioQuestionV1[] = [];
const seenCandidateIds = new Set<string>();
for (const targetShape of TARGETS) {
  for (let index = 0; index < 360; index += 1) {
    const question = generateCountingFiguresQuestionStudioSeededV1({
      seed: `FCT-EXAM-REVIEW-V1:${targetShape}:${index}`,
      language: "en",
      targetShape,
    });
    const key = `${question.geometryFingerprint}|${question.contentFingerprint}`;
    if (seenCandidateIds.has(key)) continue;
    seenCandidateIds.add(key);
    pool.push(question);
  }
}

const selected: CountingFiguresQuestionStudioQuestionV1[] = [];
const selectedGeometries = new Set<string>();

function take(question: CountingFiguresQuestionStudioQuestionV1): boolean {
  if (selectedGeometries.has(question.geometryFingerprint)) return false;
  selected.push(question);
  selectedGeometries.add(question.geometryFingerprint);
  return true;
}

// First guarantee every approved motif family is visible in the review pack.
for (const motifFamily of REQUIRED_MOTIFS) {
  const candidate = pool.find((question) =>
    question.motifFamily === motifFamily && !selectedGeometries.has(question.geometryFingerprint));
  if (!candidate) throw new Error(`FCT exam-renderer review could not find unique geometry for motif ${motifFamily}.`);
  take(candidate);
}

// Then guarantee all four target shapes and all three difficulty bands are represented.
for (const targetShape of TARGETS) {
  if (selected.some((question) => question.targetShape === targetShape)) continue;
  const candidate = pool.find((question) =>
    question.targetShape === targetShape && !selectedGeometries.has(question.geometryFingerprint));
  if (!candidate) throw new Error(`FCT exam-renderer review missing target ${targetShape}.`);
  take(candidate);
}
for (const difficultyBand of ["Easy", "Medium", "Hard"] as const) {
  if (selected.some((question) => question.difficultyBand === difficultyBand)) continue;
  const candidate = pool.find((question) =>
    question.difficultyBand === difficultyBand && !selectedGeometries.has(question.geometryFingerprint));
  if (!candidate) throw new Error(`FCT exam-renderer review missing difficulty ${difficultyBand}.`);
  take(candidate);
}

// Fill the remainder while favoring underrepresented targets and motifs.
while (selected.length < REVIEW_COUNT) {
  const targetCounts = new Map(TARGETS.map((target) => [target, selected.filter((q) => q.targetShape === target).length] as const));
  const motifCounts = new Map(REQUIRED_MOTIFS.map((motif) => [motif, selected.filter((q) => q.motifFamily === motif).length] as const));
  const candidates = pool
    .filter((question) => !selectedGeometries.has(question.geometryFingerprint))
    .sort((a, b) => {
      const aScore = (targetCounts.get(a.targetShape) ?? 0) * 4 + (motifCounts.get(a.motifFamily as CountingFigureMotifFamilyV2) ?? 0);
      const bScore = (targetCounts.get(b.targetShape) ?? 0) * 4 + (motifCounts.get(b.motifFamily as CountingFigureMotifFamilyV2) ?? 0);
      return aScore - bScore || a.seed.localeCompare(b.seed);
    });
  const candidate = candidates[0];
  if (!candidate) throw new Error(`FCT exam-renderer review exhausted unique displayed geometries at ${selected.length}/${REVIEW_COUNT}.`);
  take(candidate);
}

if (new Set(selected.map((question) => question.geometryFingerprint)).size !== selected.length) {
  throw new Error("FCT exam-renderer review contains duplicate displayed geometry fingerprints.");
}
for (const motifFamily of REQUIRED_MOTIFS) {
  if (!selected.some((question) => question.motifFamily === motifFamily)) {
    throw new Error(`FCT exam-renderer review lost motif coverage for ${motifFamily}.`);
  }
}

const cards = selected.map((question, index) => {
  const options = question.options.map((option, optionIndex) => {
    const label = question.optionLabels[optionIndex];
    const correct = optionIndex === question.correctIndex ? " correct" : "";
    return `<div class="option${correct}"><span>${label}.</span><strong>${option}</strong></div>`;
  }).join("");
  const explanation = [
    question.explanation.observation,
    question.explanation.rule,
    question.explanation.application,
    question.explanation.check,
  ].map((line) => `<p>${escapeHtml(line)}</p>`).join("");
  return `<article class="card">
    <div class="qnum">Question ${index + 1}</div>
    <div class="meta">${escapeHtml(question.targetShape)} · ${escapeHtml(question.motifFamily)} · ${escapeHtml(question.difficultyBand)} · ${escapeHtml(question.geometryFingerprint)}</div>
    <div class="stem">${escapeHtml(question.stem)}</div>
    <div class="diagram">${question.stimulusSvgs[0]}</div>
    <div class="options">${options}</div>
    <details><summary>Answer & explanation</summary><div class="answer">Answer: ${question.answer} (${question.options[question.correctIndex]})</div>${explanation}<div class="seed">Seed: ${escapeHtml(question.seed)}</div></details>
  </article>`;
}).join("\n");

const motifSummary = REQUIRED_MOTIFS.map((motif) =>
  `${motif}: ${selected.filter((question) => question.motifFamily === motif).length}`).join(" · ");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>FCT-001 Exam-Standard Renderer Review V1</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f6f7f9;color:#17202a;font-family:Arial,Helvetica,sans-serif}.wrap{max-width:900px;margin:0 auto;padding:24px 16px 60px}.intro,.card{background:#fff;border:1px solid #dfe3e8;border-radius:10px}.intro{padding:20px;margin-bottom:18px}.intro h1{margin:0 0 8px;font-size:24px}.intro p{margin:6px 0;color:#4b5563;line-height:1.5}.card{padding:20px;margin-bottom:16px}.qnum{font-size:12px;font-weight:700;text-transform:uppercase;color:#6b7280}.meta{font-size:12px;color:#6b7280;margin-top:5px}.stem{font-size:16px;line-height:1.5;margin:16px 0 8px}.diagram{display:flex;align-items:center;justify-content:center;min-height:210px;padding:12px;background:#fff;border:1px solid #edf0f2;border-radius:6px}.diagram svg{width:min(260px,78vw);height:auto;display:block;background:#fff}.options{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}.option{display:flex;gap:10px;align-items:center;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;background:#fff}.option.correct{border-style:dashed}.option span{color:#6b7280}.option strong{font-size:15px}details{margin-top:14px;border-top:1px solid #eef0f2;padding-top:12px}summary{cursor:pointer;font-weight:600}.answer{margin:10px 0;font-weight:700}details p{margin:7px 0;line-height:1.5;color:#374151}.seed{font-size:11px;color:#6b7280;margin-top:8px}@media(max-width:560px){.wrap{padding:14px 10px 40px}.card{padding:16px}.options{grid-template-columns:1fr}.diagram{min-height:180px}.diagram svg{width:min(235px,80vw)}}
</style></head><body><main class="wrap"><section class="intro"><h1>FCT-001 Counting Figures — Exam-Standard Renderer Review V1</h1><p>Freshly generated from the corrected Question Studio runtime. Standard motifs are rendered in canonical upright orientation; ROTATED_SQUARE_GRID is exactly 45°; all figures use a thin 1.35 stroke and rigid whole-graph rotation only.</p><p><strong>${selected.length} questions · ${new Set(selected.map((q) => q.geometryFingerprint)).size} unique displayed geometries · all 11 motif families covered.</strong></p><p>${escapeHtml(motifSummary)}</p></section>${cards}</main></body></html>`;

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-fct-001-exam-renderer-review-v1.html", html);
writeFileSync("dist/reasoning-v1/spatial/spa-fct-001-exam-renderer-review-v1.json", `${JSON.stringify({
  result: "PASS",
  reviewCount: selected.length,
  uniqueDisplayedGeometries: selectedGeometries.size,
  motifCoverage: REQUIRED_MOTIFS.map((motif) => ({ motif, count: selected.filter((question) => question.motifFamily === motif).length })),
  targetCoverage: TARGETS.map((target) => ({ target, count: selected.filter((question) => question.targetShape === target).length })),
  difficultyCoverage: ["Easy", "Medium", "Hard"].map((difficulty) => ({ difficulty, count: selected.filter((question) => question.difficultyBand === difficulty).length })),
  seeds: selected.map((question) => question.seed),
}, null, 2)}\n`);
console.log(JSON.stringify({
  result: "PASS",
  reviewCount: selected.length,
  uniqueDisplayedGeometries: selectedGeometries.size,
  motifsCovered: new Set(selected.map((question) => question.motifFamily)).size,
}, null, 2));
