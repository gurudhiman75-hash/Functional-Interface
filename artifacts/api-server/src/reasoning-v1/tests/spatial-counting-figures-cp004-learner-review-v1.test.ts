import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  enumerateRectanglesV1,
  enumerateSquaresV1,
  enumerateTrianglesV1,
} from "../foundation/spatial/counting-figures-graph-v1";
import { enumerateSimpleQuadrilateralsV2 } from "../foundation/spatial/counting-figures-graph-v2";
import { FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1 } from "../foundation/spatial/counting-figures-source-saturated-discovery-v1";
import {
  FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1,
  generateCountingFigureCandidateV1,
  type CountingFigureCandidateQuestionV1,
  type CountingFigureDistractorKindV1,
  type CountingFigureTargetShapeV1,
} from "../foundation/spatial/counting-figures-production-generator-v1";

const TARGETS = ["TRIANGLE", "SQUARE", "RECTANGLE", "QUADRILATERAL"] as const;
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;
const DISTRACTOR_KINDS = [
  "SMALLEST_ONLY",
  "OMIT_LARGEST",
  "MISS_COMPOSITE_CLASS",
  "DOUBLE_COUNT_LARGEST",
  "NEAR_MISS",
] as const satisfies readonly CountingFigureDistractorKindV1[];

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function independentCount(question: CountingFigureCandidateQuestionV1): number {
  switch (question.targetShape) {
    case "TRIANGLE": return enumerateTrianglesV1(question.graph).length;
    case "SQUARE": return enumerateSquaresV1(question.graph).length;
    case "RECTANGLE": return enumerateRectanglesV1(question.graph, "INCLUDE_SQUARES").length;
    case "QUADRILATERAL": return enumerateSimpleQuadrilateralsV2(question.graph).length;
  }
}

function svgCoordinates(svg: string): readonly number[] {
  return [...svg.matchAll(/(?:x1|x2|y1|y2)="([0-9.]+)"/g)].map((match) => Number(match[1]));
}

function coverageTokens(question: CountingFigureCandidateQuestionV1): readonly string[] {
  const tokens = [
    `motif:${question.motifFamily}`,
    `target:${question.targetShape}`,
    `difficulty:${question.difficulty}`,
    `stem:${question.stemVariant}`,
    `answerPosition:${question.correctIndex}`,
  ];
  for (const entry of question.optionEvidence) {
    if (entry.kind !== "CORRECT") tokens.push(`distractor:${entry.kind}`);
  }
  if (question.correctCount <= 6) tokens.push("answerRange:low");
  if (question.correctCount >= 25) tokens.push("answerRange:high");
  return tokens;
}

const pool = Object.freeze(Array.from({ length: 720 }, (_, index) => {
  const targetShape: CountingFigureTargetShapeV1 = TARGETS[index % TARGETS.length]!;
  return generateCountingFigureCandidateV1({
    seed: `FCT-CP004-REVIEW-POOL-${index}`,
    targetShape,
  });
}));

const requiredTokens = new Set<string>();
for (const motif of FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.motifFamilies) requiredTokens.add(`motif:${motif}`);
for (const target of TARGETS) requiredTokens.add(`target:${target}`);
for (const difficulty of DIFFICULTIES) requiredTokens.add(`difficulty:${difficulty}`);
for (let stemVariant = 0; stemVariant < 8; stemVariant += 1) requiredTokens.add(`stem:${stemVariant}`);
for (let correctIndex = 0; correctIndex < 4; correctIndex += 1) requiredTokens.add(`answerPosition:${correctIndex}`);
for (const kind of DISTRACTOR_KINDS) requiredTokens.add(`distractor:${kind}`);
requiredTokens.add("answerRange:low");
requiredTokens.add("answerRange:high");

const selected: CountingFigureCandidateQuestionV1[] = [];
const selectedSeeds = new Set<string>();
const uncovered = new Set(requiredTokens);
const add = (question: CountingFigureCandidateQuestionV1 | undefined) => {
  assert.ok(question, "Unable to satisfy FCT-001 learner-review coverage.");
  if (selectedSeeds.has(question.seed)) return;
  selectedSeeds.add(question.seed);
  selected.push(question);
  for (const token of coverageTokens(question)) uncovered.delete(token);
};

while (uncovered.size) {
  let best: CountingFigureCandidateQuestionV1 | undefined;
  let bestScore = -1;
  for (const question of pool) {
    if (selectedSeeds.has(question.seed)) continue;
    const score = coverageTokens(question).filter((token) => uncovered.has(token)).length;
    if (score > bestScore) {
      best = question;
      bestScore = score;
    }
  }
  assert.ok(best && bestScore > 0, `Uncovered FCT review dimensions: ${[...uncovered].join(", ")}`);
  add(best);
}

for (const target of TARGETS) {
  while (selected.filter((question) => question.targetShape === target).length < 5) {
    const seenStructures = new Set(selected.map((question) => question.structuralFingerprint));
    add(pool.find((question) =>
      question.targetShape === target &&
      !selectedSeeds.has(question.seed) &&
      !seenStructures.has(question.structuralFingerprint),
    ) ?? pool.find((question) => question.targetShape === target && !selectedSeeds.has(question.seed)));
  }
}

for (const motif of FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.motifFamilies) {
  while (selected.filter((question) => question.motifFamily === motif).length < 2) {
    add(pool.find((question) => question.motifFamily === motif && !selectedSeeds.has(question.seed)));
  }
}

for (const question of pool) {
  if (selected.length >= 28) break;
  if (selectedSeeds.has(question.seed)) continue;
  const seenStructures = new Set(selected.map((entry) => entry.structuralFingerprint));
  if (!seenStructures.has(question.structuralFingerprint)) add(question);
}
for (const question of pool) {
  if (selected.length >= 28) break;
  if (!selectedSeeds.has(question.seed)) add(question);
}

assert.ok(selected.length >= 28 && selected.length <= 32, `Expected 28-32 review questions, got ${selected.length}.`);
assert.equal(new Set(selected.map((question) => question.motifFamily)).size, 7);
assert.equal(new Set(selected.map((question) => question.targetShape)).size, 4);
assert.equal(new Set(selected.map((question) => question.difficulty)).size, 3);
assert.equal(new Set(selected.map((question) => question.stemVariant)).size, 8);
assert.equal(new Set(selected.map((question) => question.correctIndex)).size, 4);
assert.equal(new Set(selected.flatMap((question) => question.optionEvidence.filter((entry) => entry.kind !== "CORRECT").map((entry) => entry.kind))).size, 5);
assert.ok(Math.min(...selected.map((question) => question.correctCount)) <= 6);
assert.ok(Math.max(...selected.map((question) => question.correctCount)) >= 25);
assert.ok(new Set(selected.map((question) => question.structuralFingerprint)).size >= 16);
for (const target of TARGETS) assert.ok(selected.filter((question) => question.targetShape === target).length >= 5);
for (const motif of FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.motifFamilies) assert.ok(selected.filter((question) => question.motifFamily === motif).length >= 2);

let solverChecks = 0;
let constructionChecks = 0;
let svgBoundsChecks = 0;
let explanationChecks = 0;
let optionChecks = 0;
let maxEdgeCount = 0;
let minEdgeCount = Number.POSITIVE_INFINITY;

for (const question of selected) {
  assert.equal(independentCount(question), question.correctCount);
  solverChecks += 1;
  assert.equal(question.constructionExpectedCount, question.correctCount);
  constructionChecks += 1;
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.correctCount);
  assert.equal(question.optionEvidence.filter((entry) => entry.kind === "CORRECT").length, 1);
  optionChecks += 4;
  assert.ok(question.svg.startsWith("<svg"));
  assert.ok(question.svg.includes('viewBox="0 0 120 120"'));
  assert.ok(question.svg.includes('fill="white"'));
  assert.ok(question.svg.includes('stroke-width="2.2"'));
  assert.ok(!question.svg.includes("NaN"));
  const coordinates = svgCoordinates(question.svg);
  assert.ok(coordinates.length >= 8);
  assert.ok(coordinates.every((coordinate) => coordinate >= 11.999 && coordinate <= 108.001));
  svgBoundsChecks += 1;
  assert.ok(question.explanation.observation.length > 20);
  assert.ok(question.explanation.rule.includes("Count each distinct closed"));
  assert.ok(question.explanation.application.includes(String(question.correctCount)));
  assert.ok(question.explanation.check.includes(String(question.correctCount)));
  explanationChecks += 4;
  maxEdgeCount = Math.max(maxEdgeCount, question.graph.edges.length);
  minEdgeCount = Math.min(minEdgeCount, question.graph.edges.length);
}

const targetCounts = Object.fromEntries(TARGETS.map((target) => [target, selected.filter((question) => question.targetShape === target).length]));
const difficultyCounts = Object.fromEntries(DIFFICULTIES.map((difficulty) => [difficulty, selected.filter((question) => question.difficulty === difficulty).length]));
const motifCounts = Object.fromEntries(FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.motifFamilies.map((motif) => [motif, selected.filter((question) => question.motifFamily === motif).length]));
const answerPositionCounts = [0, 1, 2, 3].map((position) => selected.filter((question) => question.correctIndex === position).length);
const selectedAnswerRange = {
  min: Math.min(...selected.map((question) => question.correctCount)),
  max: Math.max(...selected.map((question) => question.correctCount)),
};

const cards = selected.map((question, index) => {
  const options = question.options.map((option, optionIndex) => `
    <div class="option"><span class="letter">${["A", "B", "C", "D"][optionIndex]}</span><span class="value">${option}</span></div>`).join("");
  const evidence = question.optionEvidence
    .map((entry, optionIndex) => `${["A", "B", "C", "D"][optionIndex]}=${entry.value} (${entry.kind})`)
    .join(" · ");
  return `<article class="card">
    <div class="question-number">Question ${index + 1}</div>
    <p class="stem">${escapeHtml(question.stem)}</p>
    <div class="diagram">${question.svg}</div>
    <div class="options">${options}</div>
    <details>
      <summary>Explanation and operator evidence</summary>
      <div class="explanation">
        <p><b>Observe:</b> ${escapeHtml(question.explanation.observation)}</p>
        <p><b>Rule:</b> ${escapeHtml(question.explanation.rule)}</p>
        <p><b>Apply:</b> ${escapeHtml(question.explanation.application)}</p>
        <p><b>Check:</b> ${escapeHtml(question.explanation.check)}</p>
      </div>
      <div class="operator">
        <p><b>Answer:</b> ${["A", "B", "C", "D"][question.correctIndex]} (${question.correctCount})</p>
        <p>${escapeHtml(question.targetShape)} · ${escapeHtml(question.motifFamily)} · ${question.difficulty} · Stem ${question.stemVariant + 1} · answer position ${question.correctIndex + 1}</p>
        <p>${escapeHtml(evidence)}</p>
        <p>Geometry ${escapeHtml(question.geometryFingerprint)} · Structure ${escapeHtml(question.structuralFingerprint)}</p>
      </div>
    </details>
  </article>`;
}).join("\n");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>FCT-001 Learner Review V1</title>
<style>
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#111827;background:#f6f7f9}*{box-sizing:border-box}body{margin:0}main{max-width:980px;margin:auto;padding:18px}.intro,.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:18px;margin-bottom:16px;box-shadow:0 1px 2px rgba(0,0,0,.03)}h1{font-size:22px;margin:0 0 8px}.intro p{font-size:13px;line-height:1.55;color:#4b5563;margin:6px 0}.question-number{font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#6b7280}.stem{font-size:16px;font-weight:650;line-height:1.5;margin:8px 0 14px}.diagram{display:flex;justify-content:center;align-items:center;min-height:190px;border:1px solid #eef0f2;border-radius:12px;background:#fff;padding:14px}.diagram svg{display:block;width:min(300px,78vw);height:auto}.options{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px}.option{min-height:54px;border:1px solid #d1d5db;border-radius:10px;display:flex;align-items:center;gap:12px;padding:10px 12px;background:#fff}.letter{width:26px;height:26px;border:1px solid #d1d5db;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:700}.value{font-size:16px;font-weight:650}details{margin-top:14px;border-top:1px solid #eef0f2;padding-top:10px}summary{cursor:pointer;font-size:12px;font-weight:650;color:#4b5563}.explanation,.operator{font-size:12px;line-height:1.6;color:#374151}.operator{margin-top:10px;padding:10px;border-radius:9px;background:#f9fafb}.explanation p,.operator p{margin:6px 0}@media(max-width:620px){main{padding:10px}.intro,.card{padding:14px;border-radius:11px}.options{grid-template-columns:repeat(2,1fr)}.diagram{min-height:160px}.stem{font-size:15px}}
</style></head><body><main>
<section class="intro"><h1>FCT-001 · Counting Figures Learner Review V1</h1><p>Coverage-driven review of the deterministic production candidate. The learner-facing surface shows only the stem, figure and options. Answer and operator evidence remain collapsed to avoid visual-answer bias.</p><p>No permanent QL allocation, Question Studio activation, persistence, Question Bank write, test eligibility, public release or automatic publication is enabled at this checkpoint.</p></section>
${cards}
</main></body></html>`;

const evidence = {
  status: "PASS_FCT_001_CP004_LEARNER_VISUAL_REVIEW_CANDIDATE_V1",
  productionAuthority: FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.authorityId,
  sourceRecordCount: FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1.length,
  poolQuestionCount: pool.length,
  reviewQuestionCount: selected.length,
  solverChecks,
  constructionChecks,
  svgBoundsChecks,
  explanationChecks,
  optionChecks,
  coverage: {
    targetCounts,
    motifCounts,
    difficultyCounts,
    stemVariantCount: new Set(selected.map((question) => question.stemVariant)).size,
    answerPositionCounts,
    distractorFamilyCount: new Set(selected.flatMap((question) => question.optionEvidence.filter((entry) => entry.kind !== "CORRECT").map((entry) => entry.kind))).size,
    structuralVariantCount: new Set(selected.map((question) => question.structuralFingerprint)).size,
    geometryUniqueCount: new Set(selected.map((question) => question.geometryFingerprint)).size,
    answerRange: selectedAnswerRange,
    minEdgeCount,
    maxEdgeCount,
  },
  examRealness: {
    directSscSourceRecords: FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1.length,
    sourceBackedTargets: TARGETS,
    allReviewedTargetsDirectlySourceBacked: selected.every((question) => TARGETS.includes(question.targetShape)),
    smallMediumLargeCountsReviewed: selectedAnswerRange.min <= 6 && selected.some((question) => question.correctCount >= 10 && question.correctCount <= 16) && selectedAnswerRange.max >= 25,
  },
  governance: {
    permanentQlAllocated: false,
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    mergeAuthorized: false,
    deploymentPerformed: false,
  },
  nextGate: "DIRECT_DESKTOP_MOBILE_LEARNER_REVIEW_THEN_FCT_001_CP005_QL_ALLOCATION_DECISION",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-fct-001-cp004-learner-review-v1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-fct-001-cp004-learner-review-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
