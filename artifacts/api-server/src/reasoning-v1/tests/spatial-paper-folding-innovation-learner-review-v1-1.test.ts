import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1_1,
  generatePfcInnovationLearnerReviewV1_1,
  renderPfcInnovationLearnerReviewHtmlV1_1,
} from "../foundation/spatial/paper-folding-innovation-learner-review-v1-1";

const questions = generatePfcInnovationLearnerReviewV1_1();
assert.equal(questions.length, 12);
assert.equal(new Set(questions.map((question) => question.reviewId)).size, 12);
assert.equal(new Set(questions.map((question) => question.sourceCandidateId)).size, 6);
assert.equal(questions.filter((question) => question.substrateProfile === "REGULAR_PENTAGON").length, 6);
assert.equal(questions.filter((question) => question.substrateProfile === "REGULAR_OCTAGON").length, 4);
assert.equal(questions.filter((question) => question.substrateProfile === "SKEWED_CONVEX_POLYGON").length, 2);
assert.equal(questions.filter((question) => question.foldCount === 2).length, 2);

const MIN_VISIBLE_MARK_DISTANCE = 0.40;
const EXPECTED_STAGE_FILL_RATIO = 1 / 1.30;
const STAGE_FILL_TOLERANCE = 0.015;
const MIN_CENTER_BOUNDARY_CLEARANCE = 6;
const MIN_VISIBLE_BOUNDARY_GAP = 2;
const PUNCH_RADIUS = 2.2;
const PAPER_STROKE_HALF = 0.9;
const PUNCH_STROKE_HALF = 0.85;
const GRID = 132;
const NUMBER_RE = /-?\d+(?:\.\d+)?/g;

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

function pointSegmentDistance(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax, dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared <= 1e-12) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function correctOptionVisibleBoundaryGap(svg: string): number {
  const polygonTag = (svg.match(/<polygon\b[^>]*fill="white"[^>]*stroke="#111"[^>]*\/?\s*>/) ?? [])[0];
  assert.ok(polygonTag, "Correct novel option must expose a polygonal source boundary.");
  const values = polygonTag.match(/\bpoints="([^"]+)"/)?.[1]?.match(NUMBER_RE)?.map(Number) ?? [];
  assert.ok(values.length >= 6);
  const boundary: Array<[number, number]> = [];
  for (let index = 0; index + 1 < values.length; index += 2) boundary.push([values[index], values[index + 1]]);

  const punchTags = svg.match(/<circle\b[^>]*data-cutout="transparent"[^>]*\/>/g) ?? [];
  assert.ok(punchTags.length >= 2, "Correct unfolded option must contain every mapped punch mark.");
  let minimum = Number.POSITIVE_INFINITY;
  for (const tag of punchTags) {
    const cx = num(tag, "cx"), cy = num(tag, "cy"), radius = num(tag, "r");
    assert.notEqual(cx, null); assert.notEqual(cy, null); assert.notEqual(radius, null);
    let centerDistance = Number.POSITIVE_INFINITY;
    for (let index = 0; index < boundary.length; index += 1) {
      const [ax, ay] = boundary[index];
      const [bx, by] = boundary[(index + 1) % boundary.length];
      centerDistance = Math.min(centerDistance, pointSegmentDistance(cx!, cy!, ax, ay, bx, by));
    }
    minimum = Math.min(minimum, centerDistance - radius! - PAPER_STROKE_HALF - PUNCH_STROKE_HALF);
  }
  return minimum;
}

let minimumVisibleMarkDistance = 1;
let minimumReportedPacketClearance = Number.POSITIVE_INFINITY;
let minimumReportedSourceClearance = Number.POSITIVE_INFINITY;
let minimumReportedVisibleGap = Number.POSITIVE_INFINITY;
let minimumIndependentVisibleGap = Number.POSITIVE_INFINITY;
const stageFillRatios: number[] = [];

for (const question of questions) {
  assert.equal(question.provenance, "CONTROLLED_NOVEL");
  assert.ok(!/\b(?:PYQ|previous year|past paper)\b/i.test(question.stem), `${question.reviewId} falsely attributes history.`);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.svg)).size, 4, `${question.reviewId} contains duplicate option art.`);
  assert.ok(question.options.some((option) => option.optionId === question.correctOptionId));
  assert.equal((question.stimulusSvg.match(/data-crease-clipped="true"/g) ?? []).length, question.foldCount);

  minimumReportedPacketClearance = Math.min(minimumReportedPacketClearance, question.clearanceAudit.foldedPacketCenterClearance);
  minimumReportedSourceClearance = Math.min(minimumReportedSourceClearance, question.clearanceAudit.unfoldedSourceCenterClearance);
  minimumReportedVisibleGap = Math.min(minimumReportedVisibleGap, question.clearanceAudit.unfoldedVisibleGap);
  assert.ok(question.clearanceAudit.foldedPacketCenterClearance + 1e-9 >= MIN_CENTER_BOUNDARY_CLEARANCE, `${question.reviewId} folded punch is too close to a packet edge.`);
  assert.ok(question.clearanceAudit.unfoldedSourceCenterClearance + 1e-9 >= MIN_CENTER_BOUNDARY_CLEARANCE, `${question.reviewId} mapped punch is too close to the source edge.`);
  assert.ok(question.clearanceAudit.unfoldedVisibleGap + 1e-9 >= MIN_VISIBLE_BOUNDARY_GAP, `${question.reviewId} mapped punch visually touches the source boundary.`);

  const correct = question.options.find((option) => option.optionId === question.correctOptionId)!;
  const independentGap = correctOptionVisibleBoundaryGap(correct.svg);
  minimumIndependentVisibleGap = Math.min(minimumIndependentVisibleGap, independentGap);
  assert.ok(independentGap + 1e-9 >= MIN_VISIBLE_BOUNDARY_GAP, `${question.reviewId} correct option independently measures only ${independentGap.toFixed(3)} visible boundary gap.`);

  const masks = question.options.map((option) => visibleCutMask(option.svg));
  assert.ok(masks.every((mask) => mask.size > 0), `${question.reviewId} has an option without visible punch marks.`);
  for (let left = 0; left < masks.length; left += 1) {
    for (let right = left + 1; right < masks.length; right += 1) {
      minimumVisibleMarkDistance = Math.min(minimumVisibleMarkDistance, jaccardDistance(masks[left], masks[right]));
    }
  }

  const ratios = [...question.stimulusSvg.matchAll(/data-paper-fill="([0-9.]+)"/g)].map((match) => Number(match[1]));
  assert.equal(ratios.length, question.foldCount + 1, `${question.reviewId} has wrong normalized stage count.`);
  for (const ratio of ratios) {
    stageFillRatios.push(ratio);
    assert.ok(Math.abs(ratio - EXPECTED_STAGE_FILL_RATIO) <= STAGE_FILL_TOLERANCE, `${question.reviewId} stage fill ${ratio.toFixed(3)} is not normalized.`);
  }
}

assert.ok(minimumVisibleMarkDistance + 1e-9 >= MIN_VISIBLE_MARK_DISTANCE, `V1.1 choices remain visually near-duplicate at ${minimumVisibleMarkDistance.toFixed(3)}.`);
assert.equal(stageFillRatios.length, 26);
assert.ok(Math.max(...stageFillRatios) - Math.min(...stageFillRatios) <= 0.02);

const html = renderPfcInnovationLearnerReviewHtmlV1_1(questions);
assert.ok(html.includes("PFC Controlled-Novel Learner Review V1.1"));
assert.ok(html.includes("interior punch remains visibly interior"));
assert.equal((html.match(/<article class="question-card"/g) ?? []).length, 12);
assert.equal((html.match(/class="option"/g) ?? []).length, 48);
assert.ok(!html.includes('fill="black" data-cutout'));
assert.ok(!html.includes('fill="#111" data-cutout'));

const evidence = {
  status: "PASS_PFC_CONTROLLED_NOVEL_LEARNER_REVIEW_V1_1_BOUNDARY_CLEARANCE",
  authority: PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1_1,
  reviewQuestionCount: questions.length,
  minimumCenterBoundaryClearance: MIN_CENTER_BOUNDARY_CLEARANCE,
  minimumReportedFoldedPacketCenterClearance: minimumReportedPacketClearance,
  minimumReportedUnfoldedSourceCenterClearance: minimumReportedSourceClearance,
  minimumVisibleBoundaryGapGate: MIN_VISIBLE_BOUNDARY_GAP,
  minimumReportedUnfoldedVisibleGap: minimumReportedVisibleGap,
  minimumIndependentlyMeasuredCorrectOptionVisibleGap: minimumIndependentVisibleGap,
  visibleChoiceDistanceGate: MIN_VISIBLE_MARK_DISTANCE,
  minimumVisibleChoiceDistance: minimumVisibleMarkDistance,
  normalizedStageCount: stageFillRatios.length,
  minStagePaperFillRatio: Math.min(...stageFillRatios),
  maxStagePaperFillRatio: Math.max(...stageFillRatios),
  priorV1ApprovalSupersededForBoundaryClearanceDefect: true,
  correctOptionIdsRetained: true,
  transparentCutouts: true,
  governance: {
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_V1_1_REMEDIATION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-controlled-novel-review-v1-1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-controlled-novel-review-v1-1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
