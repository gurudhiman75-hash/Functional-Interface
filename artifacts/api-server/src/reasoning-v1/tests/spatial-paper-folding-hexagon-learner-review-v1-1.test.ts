import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  generatePfcHexagonLearnerReviewV1,
} from "../foundation/spatial/paper-folding-hexagon-learner-review-v1";
import {
  PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1_1,
  generatePfcHexagonLearnerReviewV1_1,
  renderPfcHexagonLearnerReviewHtmlV1_1,
} from "../foundation/spatial/paper-folding-hexagon-learner-review-v1-1";

type Point = { x: number; y: number };
const CENTER: Point = { x: 60, y: 60 };
const RADIUS = 48;
const HEXAGON: Point[] = Array.from({ length: 6 }, (_, index) => {
  const angle = -Math.PI / 2 + index * Math.PI / 3;
  return { x: CENTER.x + RADIUS * Math.cos(angle), y: CENTER.y + RADIUS * Math.sin(angle) };
});

const prior = generatePfcHexagonLearnerReviewV1();
const questions = generatePfcHexagonLearnerReviewV1_1();
assert.equal(questions.length, 12);
assert.deepEqual(questions.map((question) => question.correctOptionId), prior.map((question) => question.correctOptionId));
assert.deepEqual(questions.map((question) => question.sourceScenarioId), prior.map((question) => question.sourceScenarioId));
assert.deepEqual(questions.map((question) => question.options.map((option) => option.semantic)), prior.map((question) => question.options.map((option) => option.semantic)));

const priorForward = prior.filter((question) => question.task === "FORWARD_UNFOLD");
const nextForward = questions.filter((question) => question.task === "FORWARD_UNFOLD");
assert.equal(nextForward.length, 8);
assert.deepEqual(
  nextForward.map((question) => question.options.map((option) => option.svg)),
  priorForward.map((question) => question.options.map((option) => option.svg)),
  "V1.1 must not change any forward answer-option art.",
);

function num(tag: string, name: string): number {
  const match = tag.match(new RegExp(`\\b${name}="(-?\\d+(?:\\.\\d+)?)"`));
  if (!match) throw new Error(`Missing ${name} in crease tag.`);
  return Number(match[1]);
}

function cross(a: Point, b: Point, p: Point): number {
  return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
}

function pointOnSegment(point: Point, a: Point, b: Point): boolean {
  if (Math.abs(cross(a, b, point)) > 0.08) return false;
  return point.x >= Math.min(a.x, b.x) - 0.02 && point.x <= Math.max(a.x, b.x) + 0.02 &&
    point.y >= Math.min(a.y, b.y) - 0.02 && point.y <= Math.max(a.y, b.y) + 0.02;
}

function pointOnHexBoundary(point: Point): boolean {
  return HEXAGON.some((vertex, index) => pointOnSegment(point, vertex, HEXAGON[(index + 1) % HEXAGON.length]));
}

const html = renderPfcHexagonLearnerReviewHtmlV1_1(questions);
assert.ok(html.includes("PFC-001 Hexagon Substrate Gap Review V1.1"));
assert.ok(!html.includes('fill="black" data-cutout'));
assert.ok(!html.includes('fill="#111" data-cutout'));
assert.equal((html.match(/<article class="question-card">/g) ?? []).length, 12);
assert.equal((html.match(/class="option"/g) ?? []).length, 48);

const creaseTags = html.match(/<line\b[^>]*stroke="#555"[^>]*stroke-dasharray="4 3"[^>]*\/>/g) ?? [];
assert.equal(creaseTags.length, 12, "Expected four forward creases and eight reverse-option creases.");
for (const tag of creaseTags) {
  const a = { x: num(tag, "x1"), y: num(tag, "y1") };
  const b = { x: num(tag, "x2"), y: num(tag, "y2") };
  assert.ok(pointOnHexBoundary(a), `Crease endpoint ${JSON.stringify(a)} is outside the hexagon edge.`);
  assert.ok(pointOnHexBoundary(b), `Crease endpoint ${JSON.stringify(b)} is outside the hexagon edge.`);
}

const stageFillRatios = nextForward.flatMap((question) => [...question.stimulusSvg.matchAll(/data-paper-fill="([0-9.]+)"/g)].map((match) => Number(match[1])));
assert.equal(stageFillRatios.length, 16);
assert.ok(stageFillRatios.every((ratio) => Math.abs(ratio - 1 / 1.30) <= 0.015));
assert.ok(Math.max(...stageFillRatios) - Math.min(...stageFillRatios) <= 0.02);

const evidence = {
  status: "PASS_PFC_HEXAGON_LEARNER_REVIEW_V1_1",
  authority: PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1_1,
  reviewQuestionCount: questions.length,
  correctOptionIdsRetained: true,
  sourceScenarioIdsRetained: true,
  forwardOptionArtByteIdenticalToGreenV1: true,
  clippedCreaseCount: creaseTags.length,
  allCreaseEndpointsOnHexagonBoundary: true,
  normalizedForwardStageCount: stageFillRatios.length,
  minStagePaperFillRatio: Math.min(...stageFillRatios),
  maxStagePaperFillRatio: Math.max(...stageFillRatios),
  transparentCutouts: true,
  inheritedForwardVisibleMarkDistanceGateFromV1: 0.35,
  governance: {
    hexagonHumanReviewRequired: true,
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_001_HEXAGON_HUMAN_REVIEW_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-hexagon-review-v1-1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-hexagon-review-v1-1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
