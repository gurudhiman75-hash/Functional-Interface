import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1,
  generatePfcInnovationLearnerReviewV1,
  renderPfcInnovationLearnerReviewHtmlV1,
} from "../foundation/spatial/paper-folding-innovation-learner-review-v1";

const questions = generatePfcInnovationLearnerReviewV1();
assert.equal(questions.length, 12);
assert.equal(new Set(questions.map((question) => question.reviewId)).size, 12);
assert.equal(new Set(questions.map((question) => question.sourceCandidateId)).size, 6);

const countsByCandidate = new Map<string, number>();
for (const question of questions) countsByCandidate.set(question.sourceCandidateId, (countsByCandidate.get(question.sourceCandidateId) ?? 0) + 1);
assert.ok([...countsByCandidate.values()].every((count) => count === 2));
assert.equal(questions.filter((question) => question.substrateProfile === "REGULAR_PENTAGON").length, 6);
assert.equal(questions.filter((question) => question.substrateProfile === "REGULAR_OCTAGON").length, 4);
assert.equal(questions.filter((question) => question.substrateProfile === "SKEWED_CONVEX_POLYGON").length, 2);
assert.equal(questions.filter((question) => question.foldCount === 2).length, 2);

for (const question of questions) {
  assert.equal(question.provenance, "CONTROLLED_NOVEL");
  assert.ok(!/\bPYQ\b/i.test(question.stem), `${question.reviewId} falsely attributes the question as PYQ.`);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.svg)).size, 4, `${question.reviewId} contains duplicate option art.`);
  assert.ok(question.options.some((option) => option.optionId === question.correctOptionId));
  const semantics = new Set(question.options.map((option) => option.semantic));
  assert.deepEqual(semantics, new Set(["FORGOT_TO_UNFOLD", "WRONG_AXIS_MAPPING", "WRONG_DEPTH_MAPPING", "CORRECT_PATTERN"]));
  assert.ok(question.unfoldedPositions.length >= 2);
  assert.equal((question.stimulusSvg.match(/data-crease-clipped="true"/g) ?? []).length, question.foldCount);
}

const GRID = 132;
const MIN_VISIBLE_MARK_DISTANCE = 0.40;
const EXPECTED_STAGE_FILL_RATIO = 1 / 1.30;
const STAGE_FILL_TOLERANCE = 0.015;

function num(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`\\b${name}="(-?\\d+(?:\\.\\d+)?)"`));
  return match ? Number(match[1]) : null;
}

function paint(set: Set<number>, x: number, y: number, radius = 1): void {
  const gx = Math.max(0, Math.min(GRID - 1, Math.round(x * (GRID - 1) / 120)));
  const gy = Math.max(0, Math.min(GRID - 1, Math.round(y * (GRID - 1) / 120)));
  for (let dx = -radius; dx <= radius; dx += 1) {
    for (let dy = -radius; dy <= radius; dy += 1) {
      const xx = gx + dx, yy = gy + dy;
      if (xx >= 0 && xx < GRID && yy >= 0 && yy < GRID) set.add(yy * GRID + xx);
    }
  }
}

function visibleCutMask(svg: string): Set<number> {
  const set = new Set<number>();
  for (const tag of svg.match(/<circle\b[^>]*\/?\s*>/g) ?? []) {
    const cx = num(tag, "cx"), cy = num(tag, "cy"), radius = num(tag, "r");
    if (cx === null || cy === null || radius === null || radius > 8) continue;
    for (let degree = 0; degree < 360; degree += 4) {
      const radians = degree * Math.PI / 180;
      paint(set, cx + radius * Math.cos(radians), cy + radius * Math.sin(radians), 1);
    }
  }
  return set;
}

function jaccardDistance(a: Set<number>, b: Set<number>): number {
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 0;
  let intersection = 0;
  for (const value of a) if (b.has(value)) intersection += 1;
  return 1 - intersection / union.size;
}

let minimumVisibleMarkDistance = 1;
for (const question of questions) {
  const masks = question.options.map((option) => visibleCutMask(option.svg));
  assert.ok(masks.every((mask) => mask.size > 0), `${question.reviewId} has an option without visible punch marks.`);
  for (let left = 0; left < masks.length; left += 1) {
    for (let right = left + 1; right < masks.length; right += 1) {
      minimumVisibleMarkDistance = Math.min(minimumVisibleMarkDistance, jaccardDistance(masks[left], masks[right]));
    }
  }
}
assert.ok(
  minimumVisibleMarkDistance + 1e-9 >= MIN_VISIBLE_MARK_DISTANCE,
  `Controlled-novel choices remain visually near-duplicate at ${minimumVisibleMarkDistance.toFixed(3)}.`,
);

const stageFillRatios: number[] = [];
for (const question of questions) {
  const ratios = [...question.stimulusSvg.matchAll(/data-paper-fill="([0-9.]+)"/g)].map((match) => Number(match[1]));
  assert.equal(ratios.length, question.foldCount + 1, `${question.reviewId} has the wrong number of normalized stage panels.`);
  for (const ratio of ratios) {
    stageFillRatios.push(ratio);
    assert.ok(Math.abs(ratio - EXPECTED_STAGE_FILL_RATIO) <= STAGE_FILL_TOLERANCE, `${question.reviewId} stage fill ${ratio.toFixed(3)} is not normalized.`);
  }
}
assert.equal(stageFillRatios.length, 26);
assert.ok(Math.max(...stageFillRatios) - Math.min(...stageFillRatios) <= 0.02);

const html = renderPfcInnovationLearnerReviewHtmlV1(questions);
assert.ok(html.includes("PFC Controlled-Novel Learner Review V1"));
assert.ok(html.includes("regular pentagon"));
assert.ok(html.includes("regular octagon"));
assert.ok(html.includes("skewed convex paper"));
assert.ok(html.includes("not presented as past-paper questions"));
assert.equal((html.match(/<article class="question-card"/g) ?? []).length, 12);
assert.equal((html.match(/class="option"/g) ?? []).length, 48);
assert.equal((html.match(/data-provenance="CONTROLLED_NOVEL"/g) ?? []).length, 12);
assert.ok(!html.includes('fill="black" data-cutout'));
assert.ok(!html.includes('fill="#111" data-cutout'));
assert.ok(!html.includes('fill="#000" data-cutout'));

const evidence = {
  status: "PASS_PFC_CONTROLLED_NOVEL_LEARNER_REVIEW_V1",
  authority: PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1,
  reviewQuestionCount: questions.length,
  questionsPerDiscoveryCandidate: 2,
  discoveryCandidateCount: countsByCandidate.size,
  substrateCounts: {
    regularPentagon: questions.filter((question) => question.substrateProfile === "REGULAR_PENTAGON").length,
    regularOctagon: questions.filter((question) => question.substrateProfile === "REGULAR_OCTAGON").length,
    skewedConvex: questions.filter((question) => question.substrateProfile === "SKEWED_CONVEX_POLYGON").length,
  },
  twoFoldQuestionCount: questions.filter((question) => question.foldCount === 2).length,
  allQuestionsControlledNovel: true,
  falsePyqAttribution: false,
  optionArtUniqueWithinEveryQuestion: true,
  visibleMarkDistanceGate: MIN_VISIBLE_MARK_DISTANCE,
  minimumVisibleMarkDistance,
  normalizedStageCount: stageFillRatios.length,
  expectedStagePaperFillRatio: EXPECTED_STAGE_FILL_RATIO,
  minStagePaperFillRatio: Math.min(...stageFillRatios),
  maxStagePaperFillRatio: Math.max(...stageFillRatios),
  transparentCutouts: true,
  clippedCreases: true,
  governance: {
    sourceBackedCoreStillRequired: true,
    controlledNovelFamilyHumanReviewRequired: true,
    experimentalStretchPublicByDefault: false,
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_001_CONTROLLED_NOVEL_HUMAN_REVIEW_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-controlled-novel-review-v1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-controlled-novel-review-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
