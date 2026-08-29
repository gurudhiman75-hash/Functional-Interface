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
  FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2,
  generateCountingFigureCandidateBatchV2,
  generateCountingFigureCandidateV2,
  type CountingFigureCandidateQuestionV2,
  type CountingFigureMotifFamilyV2,
} from "../foundation/spatial/counting-figures-production-generator-v2";
import type {
  CountingFigureDistractorKindV1,
  CountingFigureTargetShapeV1,
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
const REMEDIATION_FAMILIES = FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.realismRemediationFamilies;
const ALL_MOTIFS = [
  ...FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.legacyMotifFamilies,
  ...REMEDIATION_FAMILIES,
] as const;

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function independentCount(question: CountingFigureCandidateQuestionV2): number {
  switch (question.targetShape) {
    case "TRIANGLE": return enumerateTrianglesV1(question.graph).length;
    case "SQUARE": return enumerateSquaresV1(question.graph).length;
    case "RECTANGLE": return enumerateRectanglesV1(question.graph, "INCLUDE_SQUARES").length;
    case "QUADRILATERAL": return enumerateSimpleQuadrilateralsV2(question.graph).length;
  }
}

function verifyQuestion(question: CountingFigureCandidateQuestionV2): void {
  assert.equal(independentCount(question), question.correctCount, `${question.seed}: solver disagreement`);
  assert.equal(question.constructionExpectedCount, question.correctCount, `${question.seed}: construction disagreement`);
  assert.equal(new Set(question.options).size, 4, `${question.seed}: duplicate option`);
  assert.equal(question.options[question.correctIndex], question.correctCount, `${question.seed}: answer mismatch`);
  assert.equal(question.optionEvidence.filter((entry) => entry.kind === "CORRECT").length, 1);
  assert.ok(question.svg.startsWith("<svg"));
  assert.ok(question.svg.includes('viewBox="0 0 120 120"'));
  assert.ok(question.svg.includes('fill="white"'));
  assert.ok(question.svg.includes('stroke-width="2.2"'));
  assert.ok(!question.svg.includes("NaN"));
  const coordinates = [...question.svg.matchAll(/(?:x1|x2|y1|y2)="([0-9.]+)"/g)].map((match) => Number(match[1]));
  assert.ok(coordinates.length >= 8);
  assert.ok(coordinates.every((coordinate) => coordinate >= 11.999 && coordinate <= 108.001));
  assert.ok(question.explanation.observation.length > 25);
  assert.ok(question.explanation.rule.length > 25);
  assert.ok(question.explanation.application.includes(String(question.correctCount)));
  assert.ok(question.explanation.check.includes(String(question.correctCount)));
}

const scale = Object.freeze(Array.from({ length: 480 }, (_, index) => {
  const targetShape: CountingFigureTargetShapeV1 = TARGETS[index % TARGETS.length]!;
  return generateCountingFigureCandidateV2({ seed: `FCT-CP004-RM-SCALE-${index}`, targetShape });
}));
for (const question of scale) verifyQuestion(question);
assert.equal(new Set(scale.map((question) => question.geometryFingerprint)).size, scale.length);
assert.equal(new Set(scale.map((question) => question.contentFingerprint)).size, scale.length);
assert.equal(new Set(scale.map((question) => question.motifFamily)).size, 11);
assert.equal(new Set(scale.map((question) => question.targetShape)).size, 4);
assert.equal(new Set(scale.map((question) => question.difficulty)).size, 3);
assert.equal(new Set(scale.map((question) => question.stemVariant)).size, 8);
for (const family of REMEDIATION_FAMILIES) assert.ok(scale.some((question) => question.motifFamily === family));

const pool = Object.freeze(Array.from({ length: 960 }, (_, index) => {
  const targetShape: CountingFigureTargetShapeV1 = TARGETS[index % TARGETS.length]!;
  return generateCountingFigureCandidateV2({ seed: `FCT-CP004-RM-POOL-${index}`, targetShape });
}));

function coverageTokens(question: CountingFigureCandidateQuestionV2): readonly string[] {
  const tokens = [
    `motif:${question.motifFamily}`,
    `target:${question.targetShape}`,
    `difficulty:${question.difficulty}`,
    `stem:${question.stemVariant}`,
    `answer:${question.correctIndex}`,
  ];
  for (const entry of question.optionEvidence) if (entry.kind !== "CORRECT") tokens.push(`distractor:${entry.kind}`);
  if (question.correctCount <= 6) tokens.push("range:low");
  if (question.correctCount >= 25) tokens.push("range:high");
  return tokens;
}

const required = new Set<string>();
for (const motif of ALL_MOTIFS) required.add(`motif:${motif}`);
for (const target of TARGETS) required.add(`target:${target}`);
for (const difficulty of DIFFICULTIES) required.add(`difficulty:${difficulty}`);
for (let stem = 0; stem < 8; stem += 1) required.add(`stem:${stem}`);
for (let answer = 0; answer < 4; answer += 1) required.add(`answer:${answer}`);
for (const kind of DISTRACTOR_KINDS) required.add(`distractor:${kind}`);
required.add("range:low");
required.add("range:high");

const selected: CountingFigureCandidateQuestionV2[] = [];
const selectedSeeds = new Set<string>();
const uncovered = new Set(required);
const add = (question: CountingFigureCandidateQuestionV2 | undefined) => {
  assert.ok(question, "Unable to satisfy FCT realism-remediation review coverage.");
  if (selectedSeeds.has(question.seed)) return;
  selectedSeeds.add(question.seed);
  selected.push(question);
  for (const token of coverageTokens(question)) uncovered.delete(token);
};

while (uncovered.size) {
  let best: CountingFigureCandidateQuestionV2 | undefined;
  let score = -1;
  for (const question of pool) {
    if (selectedSeeds.has(question.seed)) continue;
    const candidateScore = coverageTokens(question).filter((token) => uncovered.has(token)).length;
    if (candidateScore > score) {
      best = question;
      score = candidateScore;
    }
  }
  assert.ok(best && score > 0, `Uncovered FCT V2 review dimensions: ${[...uncovered].join(", ")}`);
  add(best);
}

for (const target of TARGETS) {
  while (selected.filter((question) => question.targetShape === target).length < 6) {
    add(pool.find((question) => question.targetShape === target && !selectedSeeds.has(question.seed)));
  }
}
for (const motif of ALL_MOTIFS) {
  while (selected.filter((question) => question.motifFamily === motif).length < 2) {
    add(pool.find((question) => question.motifFamily === motif && !selectedSeeds.has(question.seed)));
  }
}
for (const motif of REMEDIATION_FAMILIES) {
  while (selected.filter((question) => question.motifFamily === motif).length < 3) {
    add(pool.find((question) => question.motifFamily === motif && !selectedSeeds.has(question.seed)));
  }
}
for (const question of pool) {
  if (selected.length >= 32) break;
  if (selectedSeeds.has(question.seed)) continue;
  const seenStructures = new Set(selected.map((entry) => entry.structuralFingerprint));
  if (!seenStructures.has(question.structuralFingerprint)) add(question);
}
for (const question of pool) {
  if (selected.length >= 32) break;
  if (!selectedSeeds.has(question.seed)) add(question);
}

assert.ok(selected.length >= 32 && selected.length <= 36, `Expected 32-36 review questions, got ${selected.length}.`);
for (const question of selected) verifyQuestion(question);
assert.equal(new Set(selected.map((question) => question.motifFamily)).size, 11);
assert.equal(new Set(selected.map((question) => question.targetShape)).size, 4);
assert.equal(new Set(selected.map((question) => question.difficulty)).size, 3);
assert.equal(new Set(selected.map((question) => question.stemVariant)).size, 8);
assert.equal(new Set(selected.map((question) => question.correctIndex)).size, 4);
assert.equal(new Set(selected.flatMap((question) => question.optionEvidence.filter((entry) => entry.kind !== "CORRECT").map((entry) => entry.kind))).size, 5);
assert.ok(Math.min(...selected.map((question) => question.correctCount)) <= 6);
assert.ok(Math.max(...selected.map((question) => question.correctCount)) >= 25);
for (const target of TARGETS) assert.ok(selected.filter((question) => question.targetShape === target).length >= 6);
for (const motif of ALL_MOTIFS) assert.ok(selected.filter((question) => question.motifFamily === motif).length >= 2);
for (const motif of REMEDIATION_FAMILIES) assert.ok(selected.filter((question) => question.motifFamily === motif).length >= 3);

const batch = generateCountingFigureCandidateBatchV2({ seed: "FCT-CP004-RM-BATCH", count: 50 });
assert.equal(batch.length, 50);
assert.equal(new Set(batch.map((question) => question.contentFingerprint)).size, 50);
for (const question of batch) verifyQuestion(question);

const targetCounts = Object.fromEntries(TARGETS.map((target) => [target, selected.filter((question) => question.targetShape === target).length]));
const motifCounts = Object.fromEntries(ALL_MOTIFS.map((motif) => [motif, selected.filter((question) => question.motifFamily === motif).length]));
const difficultyCounts = Object.fromEntries(DIFFICULTIES.map((difficulty) => [difficulty, selected.filter((question) => question.difficulty === difficulty).length]));
const scaleMotifCounts = Object.fromEntries(ALL_MOTIFS.map((motif) => [motif, scale.filter((question) => question.motifFamily === motif).length]));
const remediationReviewCount = selected.filter((question) => (REMEDIATION_FAMILIES as readonly string[]).includes(question.motifFamily)).length;

const cards = selected.map((question, index) => {
  const options = question.options.map((value, optionIndex) => `<div class="option"><span class="letter">${["A", "B", "C", "D"][optionIndex]}</span><span class="value">${value}</span></div>`).join("");
  const optionEvidence = question.optionEvidence.map((entry, optionIndex) => `${["A", "B", "C", "D"][optionIndex]}=${entry.value} (${entry.kind})`).join(" · ");
  return `<article class="card"><div class="qnum">Question ${index + 1}</div><p class="stem">${escapeHtml(question.stem)}</p><div class="diagram">${question.svg}</div><div class="options">${options}</div><details><summary>Explanation and operator evidence</summary><div class="explanation"><p><b>Observe:</b> ${escapeHtml(question.explanation.observation)}</p><p><b>Rule:</b> ${escapeHtml(question.explanation.rule)}</p><p><b>Apply:</b> ${escapeHtml(question.explanation.application)}</p><p><b>Check:</b> ${escapeHtml(question.explanation.check)}</p></div><div class="operator"><p><b>Answer:</b> ${["A", "B", "C", "D"][question.correctIndex]} (${question.correctCount})</p><p>${escapeHtml(question.targetShape)} · ${escapeHtml(question.motifFamily)} · ${question.difficulty} · Stem ${question.stemVariant + 1}</p><p>${escapeHtml(optionEvidence)}</p><p>${escapeHtml(question.geometryFingerprint)} · ${escapeHtml(question.structuralFingerprint)}</p></div></details></article>`;
}).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>FCT-001 Realism Remediation Learner Review V1</title><style>:root{font-family:Inter,system-ui,sans-serif;color:#111827;background:#f6f7f9}*{box-sizing:border-box}body{margin:0}main{max-width:980px;margin:auto;padding:18px}.intro,.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:18px;margin-bottom:16px}.intro h1{font-size:22px;margin:0 0 8px}.intro p{font-size:13px;line-height:1.55;color:#4b5563}.qnum{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#6b7280}.stem{font-size:16px;font-weight:650;line-height:1.5;margin:8px 0 14px}.diagram{display:flex;align-items:center;justify-content:center;min-height:190px;border:1px solid #eef0f2;border-radius:12px;padding:14px;background:#fff}.diagram svg{width:min(310px,78vw);height:auto;display:block}.options{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px}.option{min-height:54px;border:1px solid #d1d5db;border-radius:10px;display:flex;align-items:center;gap:12px;padding:10px 12px}.letter{width:26px;height:26px;border:1px solid #d1d5db;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:700}.value{font-size:16px;font-weight:650}details{margin-top:14px;border-top:1px solid #eef0f2;padding-top:10px}summary{font-size:12px;font-weight:650;color:#4b5563;cursor:pointer}.explanation,.operator{font-size:12px;line-height:1.6;color:#374151}.operator{background:#f9fafb;border-radius:9px;padding:10px;margin-top:10px}.explanation p,.operator p{margin:6px 0}@media(max-width:620px){main{padding:10px}.intro,.card{padding:14px}.options{grid-template-columns:repeat(2,1fr)}.diagram{min-height:160px}.stem{font-size:15px}}</style></head><body><main><section class="intro"><h1>FCT-001 · Realism-remediated learner review</h1><p>This V2 review intentionally adds composite internal lines and denser topology beyond the clean V1 grids/strips. Learner view remains stem + diagram + options; answers and operator metadata are collapsed.</p><p>No permanent QL, Question Studio activation, persistence, Question Bank write, test/public eligibility or automatic publication is enabled.</p></section>${cards}</main></body></html>`;

const evidence = {
  status: "PASS_FCT_001_CP004_REALISM_REMEDIATION_CANDIDATE_V1",
  authority: FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.authorityId,
  baseAuthority: FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.baseAuthorityId,
  directSscSourceRecordCount: FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1.length,
  productionScaleQuestionCount: scale.length,
  productionGeometryUniqueCount: new Set(scale.map((question) => question.geometryFingerprint)).size,
  productionContentUniqueCount: new Set(scale.map((question) => question.contentFingerprint)).size,
  scaleMotifCounts,
  reviewPoolCount: pool.length,
  reviewQuestionCount: selected.length,
  reviewGeometryUniqueCount: new Set(selected.map((question) => question.geometryFingerprint)).size,
  reviewStructuralVariantCount: new Set(selected.map((question) => question.structuralFingerprint)).size,
  coverage: {
    targetCounts,
    motifCounts,
    motifFamilyCount: new Set(selected.map((question) => question.motifFamily)).size,
    realismRemediationFamilyCount: REMEDIATION_FAMILIES.length,
    realismRemediationQuestionCount: remediationReviewCount,
    difficultyCounts,
    stemVariantCount: new Set(selected.map((question) => question.stemVariant)).size,
    answerPositionCount: new Set(selected.map((question) => question.correctIndex)).size,
    distractorFamilyCount: new Set(selected.flatMap((question) => question.optionEvidence.filter((entry) => entry.kind !== "CORRECT").map((entry) => entry.kind))).size,
    answerRange: {
      min: Math.min(...selected.map((question) => question.correctCount)),
      max: Math.max(...selected.map((question) => question.correctCount)),
    },
  },
  validation: {
    productionSolverChecks: scale.length,
    productionConstructionChecks: scale.length,
    reviewSolverChecks: selected.length,
    reviewConstructionChecks: selected.length,
    batchCount: batch.length,
    triangleRotationHeldForNumericalStability: FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.triangleRotationHeldForNumericalStability,
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
  nextGate: "DIRECT_V2_DESKTOP_MOBILE_REVIEW_THEN_CP005_QL_DECISION",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-fct-001-cp004-realism-remediation-v1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-fct-001-cp004-realism-remediation-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
