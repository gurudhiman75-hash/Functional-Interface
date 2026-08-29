import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1,
  generatePfcHexagonLearnerReviewV1,
  renderPfcHexagonLearnerReviewHtmlV1,
} from "../foundation/spatial/paper-folding-hexagon-learner-review-v1";

const questions = generatePfcHexagonLearnerReviewV1();
assert.equal(questions.length, 12);
const forward = questions.filter((question) => question.task === "FORWARD_UNFOLD");
const reverse = questions.filter((question) => question.task === "REVERSE_INFERENCE");
assert.equal(forward.length, 8);
assert.equal(reverse.length, 4);
assert.equal(forward.filter((question) => question.family === "HEXAGON_SINGLE_AXIS").length, 4);
assert.equal(forward.filter((question) => question.family === "HEXAGON_SIX_SECTOR_RADIAL").length, 4);
assert.equal(new Set(questions.map((question) => question.reviewId)).size, 12);

for (const question of questions) {
  assert.equal(question.options.length, 4);
  assert.ok(question.options.some((option) => option.optionId === question.correctOptionId));
  assert.equal(new Set(question.options.map((option) => option.svg)).size, 4, `${question.reviewId} contains duplicate option art.`);
}

for (const question of forward) {
  const semantics = new Set(question.options.map((option) => option.semantic));
  assert.ok(semantics.has("FORGOT_TO_UNFOLD"));
  assert.ok(semantics.has("CORRECT_PATTERN"));
  if (question.family === "HEXAGON_SINGLE_AXIS") {
    assert.ok(semantics.has("WRONG_SYMMETRY_AXIS"));
    assert.ok(semantics.has("FALSE_SIX_SECTOR_PATTERN"));
  } else {
    assert.ok(semantics.has("HALF_UNFOLDED_THREE_SECTORS"));
    assert.ok(semantics.has("WRONG_RADIUS_SIX_SECTOR_PATTERN"));
  }
}

const GRID = 120;
const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
const MIN_FORWARD_VISIBLE_MARK_DISTANCE = 0.35;
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

function segment(set: Set<number>, x1: number, y1: number, x2: number, y2: number): void {
  const steps = Math.max(8, Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 3));
  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps;
    paint(set, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 1);
  }
}

function visibleCutMask(svg: string): Set<number> {
  const set = new Set<number>();
  for (const tag of svg.match(/<circle\b[^>]*\/?\s*>/g) ?? []) {
    const cx = num(tag, "cx"), cy = num(tag, "cy"), radius = num(tag, "r");
    if (cx === null || cy === null || radius === null || radius > 10) continue;
    for (let degree = 0; degree < 360; degree += 4) {
      const radians = degree * Math.PI / 180;
      paint(set, cx + radius * Math.cos(radians), cy + radius * Math.sin(radians), 1);
    }
  }
  for (const tag of svg.match(/<line\b[^>]*\/?\s*>/g) ?? []) {
    const x1 = num(tag, "x1"), y1 = num(tag, "y1"), x2 = num(tag, "x2"), y2 = num(tag, "y2");
    if ([x1, y1, x2, y2].some((value) => value === null)) continue;
    if (Math.hypot(x2! - x1!, y2! - y1!) > 20) continue;
    segment(set, x1!, y1!, x2!, y2!);
  }
  for (const tag of svg.match(/<polygon\b[^>]*\/?\s*>/g) ?? []) {
    const values = tag.match(/\bpoints="([^"]+)"/)?.[1]?.match(NUMBER_RE)?.map(Number) ?? [];
    const polygon: Array<[number, number]> = [];
    for (let index = 0; index + 1 < values.length; index += 2) polygon.push([values[index], values[index + 1]]);
    if (polygon.length < 3) continue;
    const xs = polygon.map(([x]) => x), ys = polygon.map(([, y]) => y);
    if (Math.max(...xs) - Math.min(...xs) > 20 || Math.max(...ys) - Math.min(...ys) > 20) continue;
    for (let index = 0; index < polygon.length; index += 1) segment(set, ...polygon[index], ...polygon[(index + 1) % polygon.length]);
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

let minimumForwardVisibleDistance = 1;
for (const question of forward) {
  const masks = question.options.map((option) => visibleCutMask(option.svg));
  assert.ok(masks.every((mask) => mask.size > 0), `${question.reviewId} has an option without visible cut marks.`);
  for (let left = 0; left < masks.length; left += 1) {
    for (let right = left + 1; right < masks.length; right += 1) {
      minimumForwardVisibleDistance = Math.min(minimumForwardVisibleDistance, jaccardDistance(masks[left], masks[right]));
    }
  }
}
assert.ok(
  minimumForwardVisibleDistance + 1e-9 >= MIN_FORWARD_VISIBLE_MARK_DISTANCE,
  `Hexagon choices remain visually near-duplicate at ${minimumForwardVisibleDistance.toFixed(3)}.`,
);

const stageFillRatios: number[] = [];
for (const question of forward) {
  const ratios = [...question.stimulusSvg.matchAll(/data-paper-fill="([0-9.]+)"/g)].map((match) => Number(match[1]));
  assert.equal(ratios.length, 2, `${question.reviewId} must expose two normalized stage panels.`);
  for (const ratio of ratios) {
    stageFillRatios.push(ratio);
    assert.ok(Math.abs(ratio - EXPECTED_STAGE_FILL_RATIO) <= STAGE_FILL_TOLERANCE, `${question.reviewId} stage fill ${ratio.toFixed(3)} is not normalized.`);
  }
}
assert.equal(stageFillRatios.length, 16);
assert.ok(Math.max(...stageFillRatios) - Math.min(...stageFillRatios) <= 0.02);

const sixSector = forward.filter((question) => question.family === "HEXAGON_SIX_SECTOR_RADIAL");
for (const question of sixSector) {
  const correct = question.options.find((option) => option.optionId === question.correctOptionId)!;
  const visibleMarks = visibleCutMask(correct.svg);
  assert.ok(visibleMarks.size > 0);
  assert.ok(question.stimulusSvg.includes("Fold the 6 equal sectors together"));
}

const html = renderPfcHexagonLearnerReviewHtmlV1(questions);
assert.ok(html.includes("PFC-001 Hexagon Substrate Gap Review V1"));
assert.ok(html.includes("regular hexagonal source paper only"));
assert.ok(html.includes("six-sector radial unfolding family"));
assert.ok(!html.includes('fill="black" data-cutout'));
assert.ok(!html.includes('fill="#111" data-cutout'));
assert.equal((html.match(/<article class="question-card">/g) ?? []).length, 12);
assert.equal((html.match(/class="option"/g) ?? []).length, 48);

const evidence = {
  status: "PASS_PFC_HEXAGON_LEARNER_REVIEW_V1",
  authority: PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1,
  reviewQuestionCount: questions.length,
  forwardQuestionCount: forward.length,
  reverseQuestionCount: reverse.length,
  singleAxisForwardCount: forward.filter((question) => question.family === "HEXAGON_SINGLE_AXIS").length,
  sixSectorForwardCount: sixSector.length,
  optionArtUniqueWithinEveryQuestion: true,
  forwardVisibleMarkDistanceGate: MIN_FORWARD_VISIBLE_MARK_DISTANCE,
  minimumForwardVisibleMarkDistance: minimumForwardVisibleDistance,
  normalizedForwardStageCount: stageFillRatios.length,
  expectedStagePaperFillRatio: EXPECTED_STAGE_FILL_RATIO,
  minStagePaperFillRatio: Math.min(...stageFillRatios),
  maxStagePaperFillRatio: Math.max(...stageFillRatios),
  transparentCutouts: true,
  governance: {
    triangleApprovedSeparately: true,
    hexagonHumanReviewRequired: true,
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_001_HEXAGON_HUMAN_REVIEW_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-hexagon-review-v1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-hexagon-review-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
