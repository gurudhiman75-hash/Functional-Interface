import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_001_POLYGON_LEARNER_REVIEW_AUTHORITY_V1,
  generatePfcPolygonLearnerReviewV1,
  renderPfcPolygonLearnerReviewHtmlV1,
} from "../foundation/spatial/paper-folding-polygon-learner-review-v1";

const questions = generatePfcPolygonLearnerReviewV1();
assert.equal(questions.length, 12);
assert.equal(questions.filter((q) => q.task === "FORWARD_UNFOLD").length, 8);
assert.equal(questions.filter((q) => q.task === "REVERSE_INFERENCE").length, 4);
assert.equal(new Set(questions.map((q) => q.reviewId)).size, 12);

for (const question of questions) {
  assert.equal(question.options.length, 4);
  assert.ok(question.options.some((option) => option.optionId === question.correctOptionId));
  assert.equal(new Set(question.options.map((option) => option.svg)).size, 4, `${question.reviewId} contains duplicate option art.`);
  assert.ok(question.stimulusSvg.includes("<svg"));
  if (question.task === "FORWARD_UNFOLD") {
    const semantics = new Set(question.options.map((option) => option.semantic));
    assert.ok(semantics.has("FORGOT_TO_UNFOLD"));
    assert.ok(semantics.has("CORRECT_TWO_LAYER_REFLECTION"));
    assert.ok(semantics.has("WRONG_SYMMETRY_AXIS"));
    assert.ok(semantics.has("FALSE_FOUR_LAYER_PATTERN"));
  }
}

const GRID = 120;
const MIN_FORWARD_VISIBLE_MARK_DISTANCE = 0.40;
const EXPECTED_STAGE_FILL_RATIO = 1 / 1.30;
const STAGE_FILL_TOLERANCE = 0.015;
const NUMBER_RE = /-?\d+(?:\.\d+)?/g;

function num(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`\\b${name}="(-?\\d+(?:\\.\\d+)?)"`));
  return match ? Number(match[1]) : null;
}

function paint(set: Set<number>, x: number, y: number, radius = 1): void {
  const gx = Math.max(0, Math.min(GRID - 1, Math.round(x * (GRID - 1) / 120)));
  const gy = Math.max(0, Math.min(GRID - 1, Math.round(y * (GRID - 1) / 108)));
  for (let dx = -radius; dx <= radius; dx += 1) {
    for (let dy = -radius; dy <= radius; dy += 1) {
      const xx = gx + dx;
      const yy = gy + dy;
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
    const cx = num(tag, "cx");
    const cy = num(tag, "cy");
    const r = num(tag, "r");
    if (cx === null || cy === null || r === null || r > 10) continue;
    for (let degree = 0; degree < 360; degree += 4) {
      const rad = degree * Math.PI / 180;
      paint(set, cx + r * Math.cos(rad), cy + r * Math.sin(rad), 1);
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
    const points: Array<[number, number]> = [];
    for (let index = 0; index + 1 < values.length; index += 2) points.push([values[index], values[index + 1]]);
    if (points.length < 3) continue;
    const xs = points.map(([x]) => x), ys = points.map(([, y]) => y);
    if (Math.max(...xs) - Math.min(...xs) > 20 || Math.max(...ys) - Math.min(...ys) > 20) continue;
    for (let index = 0; index < points.length; index += 1) {
      segment(set, ...points[index], ...points[(index + 1) % points.length]);
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

function minForwardVisibleDistance(question: typeof questions[number]): number {
  const masks = question.options.map((option) => visibleCutMask(option.svg));
  assert.ok(masks.every((mask) => mask.size > 0), `${question.reviewId} has an option with no visible cut marks.`);
  let minimum = 1;
  for (let i = 0; i < masks.length; i += 1) {
    for (let j = i + 1; j < masks.length; j += 1) minimum = Math.min(minimum, jaccardDistance(masks[i], masks[j]));
  }
  return minimum;
}

function largestPaperPolygonSpan(svg: string): number | null {
  let largest = 0;
  for (const tag of svg.match(/<polygon\b[^>]*\/?\s*>/g) ?? []) {
    const values = tag.match(/\bpoints="([^"]+)"/)?.[1]?.match(NUMBER_RE)?.map(Number) ?? [];
    if (values.length < 6) continue;
    const xs: number[] = [];
    const ys: number[] = [];
    for (let index = 0; index + 1 < values.length; index += 2) {
      xs.push(values[index]);
      ys.push(values[index + 1]);
    }
    const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
    if (span > 20) largest = Math.max(largest, span);
  }
  return largest > 0 ? largest : null;
}

function stageFillRatio(svg: string): number | null {
  const viewBox = svg.match(/\bviewBox="([^"]+)"/i)?.[1]?.match(NUMBER_RE)?.map(Number) ?? [];
  if (viewBox.length !== 4) return null;
  const paperSpan = largestPaperPolygonSpan(svg);
  if (paperSpan === null) return null;
  return paperSpan / Math.max(viewBox[2], viewBox[3]);
}

let minimumForwardVisibleDistance = 1;
const stageFillRatios: number[] = [];
for (const question of questions.filter((q) => q.task === "FORWARD_UNFOLD")) {
  const distance = minForwardVisibleDistance(question);
  minimumForwardVisibleDistance = Math.min(minimumForwardVisibleDistance, distance);
  assert.ok(
    distance + 1e-9 >= MIN_FORWARD_VISIBLE_MARK_DISTANCE,
    `${question.reviewId} triangle choices remain visually near-duplicate at ${distance.toFixed(3)}.`,
  );

  const stageSvgs = question.stimulusSvg.match(/<svg\b[\s\S]*?<\/svg>/g) ?? [];
  assert.equal(stageSvgs.length, 2, `${question.reviewId} must contain exactly Fold and Cut/Punch stage SVGs.`);
  for (const svg of stageSvgs) {
    const ratio = stageFillRatio(svg);
    assert.notEqual(ratio, null, `${question.reviewId} has a stage with no measurable paper polygon.`);
    stageFillRatios.push(ratio!);
    assert.ok(
      Math.abs(ratio! - EXPECTED_STAGE_FILL_RATIO) <= STAGE_FILL_TOLERANCE,
      `${question.reviewId} stage paper fill ${ratio!.toFixed(3)} indicates unequal internal diagram scale.`,
    );
  }
}
assert.equal(stageFillRatios.length, 16);
assert.ok(
  Math.max(...stageFillRatios) - Math.min(...stageFillRatios) <= 0.02,
  "Triangle Fold and Cut/Punch stages do not maintain a uniform visual paper scale.",
);

const html = renderPfcPolygonLearnerReviewHtmlV1(questions);
assert.ok(html.includes("PFC-001 Polygon Substrate Gap Review V1"));
assert.ok(html.includes("Triangle source sheet"));
assert.ok(html.includes("review only; no permanent QL"));
assert.ok(html.includes("min-width:max-content"));
assert.ok(!html.includes('fill="black" data-cutout'));
assert.ok(!html.includes('fill="#111" data-cutout'));
assert.equal((html.match(/<article class="question-card">/g) ?? []).length, 12);
assert.equal((html.match(/class="option"/g) ?? []).length, 48);

const evidence = {
  status: "PASS_PFC_POLYGON_TRIANGLE_LEARNER_REVIEW_V1",
  authority: PFC_001_POLYGON_LEARNER_REVIEW_AUTHORITY_V1,
  reviewQuestionCount: questions.length,
  forwardQuestionCount: questions.filter((q) => q.task === "FORWARD_UNFOLD").length,
  reverseQuestionCount: questions.filter((q) => q.task === "REVERSE_INFERENCE").length,
  sourceShape: "TRIANGLE",
  optionArtUniqueWithinEveryQuestion: true,
  forwardVisibleMarkDistanceGate: MIN_FORWARD_VISIBLE_MARK_DISTANCE,
  minimumForwardVisibleMarkDistance: minimumForwardVisibleDistance,
  normalizedForwardStageCount: stageFillRatios.length,
  expectedStagePaperFillRatio: EXPECTED_STAGE_FILL_RATIO,
  minStagePaperFillRatio: Math.min(...stageFillRatios),
  maxStagePaperFillRatio: Math.max(...stageFillRatios),
  conceptualForwardDistractors: ["FORGOT_TO_UNFOLD", "WRONG_SYMMETRY_AXIS", "FALSE_FOUR_LAYER_PATTERN"],
  transparentCutouts: true,
  fixedStageSizing: true,
  packetFittedInternalStageScale: true,
  governance: {
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_001_POLYGON_TRIANGLE_HUMAN_REVIEW_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-polygon-triangle-review-v1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-polygon-triangle-review-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
