import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { generatePfcTpfFinalCombinedEnglishReviewV1_1 } from "../foundation/spatial/paper-folding-final-combined-english-review-v1-1";
import {
  PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_2,
  generatePfcTpfFinalCombinedEnglishReviewV1_2,
  renderPfcTpfFinalCombinedEnglishReviewHtmlV1_2,
} from "../foundation/spatial/paper-folding-final-combined-english-review-v1-2";
import { PFC_001_OPTION_CLARITY_DEFECT_HOLD_V1 } from "../foundation/spatial/paper-folding-option-clarity-defect-hold-v1";

const previous = generatePfcTpfFinalCombinedEnglishReviewV1_1();
const questions = generatePfcTpfFinalCombinedEnglishReviewV1_2();
assert.equal(questions.length, 84);
assert.equal(new Set(questions.map((question) => question.reviewId)).size, 84);

const previousById = new Map(previous.map((question) => [question.reviewId, question]));
for (const question of questions) {
  const old = previousById.get(question.reviewId);
  assert.ok(old, `${question.reviewId} did not exist in V1.1.`);
  assert.equal(question.correctOptionId, old!.correctOptionId, `${question.reviewId} correct answer changed in V1.2.`);
  assert.equal(question.stem, old!.stem, `${question.reviewId} stem changed during option-only remediation.`);
  assert.equal(question.stimulusSvg, old!.stimulusSvg, `${question.reviewId} stimulus changed during option-only remediation.`);
}

const changedQuestionIds = questions
  .filter((question) => JSON.stringify(question.options) !== JSON.stringify(previousById.get(question.reviewId)!.options))
  .map((question) => question.reviewId)
  .sort();
const expectedChanged = [
  "PFC-TPF-REV-012",
  "PFC-HEX-REV-05", "PFC-HEX-REV-06", "PFC-HEX-REV-07", "PFC-HEX-REV-08",
  ...Array.from({ length: 12 }, (_, index) => `PFC-INNOV-REV-${String(index + 1).padStart(2, "0")}`),
].sort();
assert.deepEqual(changedQuestionIds, expectedChanged, "V1.2 must change only the 17 known option-clarity offender questions.");

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
type MarkKind = "CIRCLE" | "POLYGON" | "LINE";
interface MarkCenter { kind: MarkKind; x: number; y: number }

function num(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`\\b${name}="(-?\\d+(?:\\.\\d+)?)"`));
  return match ? Number(match[1]) : null;
}

function svgCount(markup: string): number {
  return (markup.match(/<svg\b/g) ?? []).length;
}

function viewBox(svg: string): [number, number, number, number] | null {
  const values = svg.match(/\bviewBox="([^"]+)"/i)?.[1]?.match(NUMBER_RE)?.map(Number) ?? [];
  return values.length === 4 ? [values[0], values[1], values[2], values[3]] : null;
}

function polygonPoints(tag: string): Array<[number, number]> {
  const values = tag.match(/\bpoints="([^"]+)"/)?.[1]?.match(NUMBER_RE)?.map(Number) ?? [];
  const points: Array<[number, number]> = [];
  for (let index = 0; index + 1 < values.length; index += 2) points.push([values[index], values[index + 1]]);
  return points;
}

function pointSpan(points: readonly [number, number][]): number {
  if (!points.length) return 0;
  const xs = points.map(([x]) => x), ys = points.map(([, y]) => y);
  return Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
}

function normalizedMarkCenters(svg: string): MarkCenter[] {
  const vb = viewBox(svg);
  if (!vb) return [];
  const [vx, vy, vw, vh] = vb;
  const normalize = (x: number, y: number) => ({ x: (x - vx) / vw, y: (y - vy) / vh });
  const centers: MarkCenter[] = [];

  for (const tag of svg.match(/<circle\b[^>]*\/?\s*>/g) ?? []) {
    const cx = num(tag, "cx"), cy = num(tag, "cy"), radius = num(tag, "r");
    if (cx === null || cy === null || radius === null || radius > 9.5) continue;
    const point = normalize(cx, cy);
    centers.push({ kind: "CIRCLE", ...point });
  }
  for (const tag of svg.match(/<polygon\b[^>]*\/?\s*>/g) ?? []) {
    const points = polygonPoints(tag);
    const span = pointSpan(points);
    if (points.length < 3 || span <= 0 || span > 22) continue;
    const cx = points.reduce((sum, [x]) => sum + x, 0) / points.length;
    const cy = points.reduce((sum, [, y]) => sum + y, 0) / points.length;
    const point = normalize(cx, cy);
    centers.push({ kind: "POLYGON", ...point });
  }
  for (const tag of svg.match(/<line\b[^>]*\/?\s*>/g) ?? []) {
    const x1 = num(tag, "x1"), y1 = num(tag, "y1"), x2 = num(tag, "x2"), y2 = num(tag, "y2");
    if ([x1, y1, x2, y2].some((value) => value === null)) continue;
    const length = Math.hypot(x2! - x1!, y2! - y1!);
    if (length <= 0 || length > 22) continue;
    const point = normalize((x1! + x2!) / 2, (y1! + y2!) / 2);
    centers.push({ kind: "LINE", ...point });
  }
  return centers;
}

function signature(points: readonly MarkCenter[]): string {
  const kinds: MarkKind[] = ["CIRCLE", "POLYGON", "LINE"];
  return kinds.map((kind) => `${kind}:${points.filter((point) => point.kind === kind).length}`).join("|");
}

function centroid(points: readonly MarkCenter[]): { x: number; y: number } {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function rmsRadius(points: readonly MarkCenter[], center: { x: number; y: number }): number {
  return Math.sqrt(points.reduce((sum, point) => sum + (point.x - center.x) ** 2 + (point.y - center.y) ** 2, 0) / points.length);
}

function normalizedShape(points: readonly MarkCenter[]): MarkCenter[] {
  const center = centroid(points);
  const radius = rmsRadius(points, center);
  if (radius <= 1e-9) return points.map((point) => ({ ...point, x: 0, y: 0 }));
  return points.map((point) => ({ ...point, x: (point.x - center.x) / radius, y: (point.y - center.y) / radius }));
}

function directedNearestResidual(left: readonly MarkCenter[], right: readonly MarkCenter[]): number[] {
  return left.map((point) => Math.min(...right
    .filter((other) => other.kind === point.kind)
    .map((other) => Math.hypot(point.x - other.x, point.y - other.y))));
}

function sameArrangementExceptSpacing(left: readonly MarkCenter[], right: readonly MarkCenter[]): boolean {
  if (left.length < 2 || left.length !== right.length || signature(left) !== signature(right)) return false;
  const centerLeft = centroid(left), centerRight = centroid(right);
  const centroidShift = Math.hypot(centerLeft.x - centerRight.x, centerLeft.y - centerRight.y);
  const radiusLeft = rmsRadius(left, centerLeft), radiusRight = rmsRadius(right, centerRight);
  if (radiusLeft <= 1e-9 || radiusRight <= 1e-9) return false;
  const scaleRatio = Math.max(radiusLeft / radiusRight, radiusRight / radiusLeft);
  const normalizedLeft = normalizedShape(left), normalizedRight = normalizedShape(right);
  const distances = [
    ...directedNearestResidual(normalizedLeft, normalizedRight),
    ...directedNearestResidual(normalizedRight, normalizedLeft),
  ];
  const residual = Math.sqrt(distances.reduce((sum, value) => sum + value * value, 0) / distances.length);
  return centroidShift < 0.12 && scaleRatio < 2.3 && residual < 0.10;
}

const spacingOnlyOffenders: Array<{ question: string; pair: string; signature: string }> = [];
let sameStructurePairsAudited = 0;
for (const question of questions) {
  if (question.chapterCode !== "PFC-001") continue;
  if (question.options.some((option) => svgCount(option.svg) !== 1)) continue;
  const parsed = question.options.map((option) => ({
    optionId: option.optionId,
    points: normalizedMarkCenters(option.svg),
  }));
  if (parsed.some((option) => option.points.length === 0)) continue;
  for (let left = 0; left < parsed.length; left += 1) {
    for (let right = left + 1; right < parsed.length; right += 1) {
      if (signature(parsed[left].points) !== signature(parsed[right].points)) continue;
      sameStructurePairsAudited += 1;
      if (sameArrangementExceptSpacing(parsed[left].points, parsed[right].points)) {
        spacingOnlyOffenders.push({
          question: question.reviewId,
          pair: `${parsed[left].optionId}/${parsed[right].optionId}`,
          signature: signature(parsed[left].points),
        });
      }
    }
  }
}
assert.deepEqual(spacingOnlyOffenders, [], `V1.2 still contains spacing-only learner choices: ${JSON.stringify(spacingOnlyOffenders)}`);

const PAPER_STROKE_HALF = 0.9;
const PUNCH_STROKE_HALF = 0.85;
const MIN_VISIBLE_BOUNDARY_GAP = 2;
function pointSegmentDistance(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax, dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared <= 1e-12) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
function visibleBoundaryGap(svg: string): number {
  const boundaryTag = (svg.match(/<polygon\b[^>]*fill="white"[^>]*stroke="#111"[^>]*\/?\s*>/) ?? [])[0];
  assert.ok(boundaryTag);
  const boundary = polygonPoints(boundaryTag);
  const punchTags = svg.match(/<circle\b[^>]*data-cutout="transparent"[^>]*\/>/g) ?? [];
  assert.ok(punchTags.length >= 2);
  let minimum = Number.POSITIVE_INFINITY;
  for (const tag of punchTags) {
    const cx = num(tag, "cx")!, cy = num(tag, "cy")!, radius = num(tag, "r")!;
    let centerDistance = Number.POSITIVE_INFINITY;
    for (let index = 0; index < boundary.length; index += 1) {
      const [ax, ay] = boundary[index], [bx, by] = boundary[(index + 1) % boundary.length];
      centerDistance = Math.min(centerDistance, pointSegmentDistance(cx, cy, ax, ay, bx, by));
    }
    minimum = Math.min(minimum, centerDistance - radius - PAPER_STROKE_HALF - PUNCH_STROKE_HALF);
  }
  return minimum;
}

const novel = questions.filter((question) => question.surfaceId === "CONTROLLED_NOVEL_APPROVED");
let minimumNovelCorrectVisibleBoundaryGap = Number.POSITIVE_INFINITY;
const novelStageRatios: number[] = [];
for (const question of novel) {
  const correct = question.options.find((option) => option.optionId === question.correctOptionId)!;
  const gap = visibleBoundaryGap(correct.svg);
  minimumNovelCorrectVisibleBoundaryGap = Math.min(minimumNovelCorrectVisibleBoundaryGap, gap);
  assert.ok(gap + 1e-9 >= MIN_VISIBLE_BOUNDARY_GAP, `${question.reviewId} boundary clearance regressed.`);
  novelStageRatios.push(...[...question.stimulusSvg.matchAll(/data-paper-fill="([0-9.]+)"/g)].map((match) => Number(match[1])));
}
assert.equal(novelStageRatios.length, 26);
assert.ok(Math.max(...novelStageRatios) - Math.min(...novelStageRatios) <= 0.02);

for (const question of questions) {
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.svg)).size, 4, `${question.reviewId} has duplicate option art.`);
  assert.ok(question.options.some((option) => option.optionId === question.correctOptionId));
}
const allMarkup = questions.flatMap((question) => [question.stimulusSvg, ...question.options.map((option) => option.svg)]).join("\n");
assert.ok(!/data-cutout="transparent"[^>]*fill="(?:black|#111|#000)"/i.test(allMarkup));
assert.ok(!/fill="(?:black|#111|#000)"[^>]*data-cutout="transparent"/i.test(allMarkup));

assert.equal(PFC_001_OPTION_CLARITY_DEFECT_HOLD_V1.englishFreezeAllowed, false);
assert.equal(PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_2.hexagonApprovalAuthority, null);
assert.equal(PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_2.controlledNovelApprovalAuthority, null);
assert.equal(PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_2.englishFreezeAllowed, false);
assert.equal(PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_2.questionStudioAllowed, false);

const html = renderPfcTpfFinalCombinedEnglishReviewHtmlV1_2(questions);
assert.ok(html.includes("PFC / TPF Final Combined English Learner Review V1.2"));
assert.ok(html.includes("slight spacing"));
assert.ok(html.includes(PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_2.authorityId));
assert.equal((html.match(/class="question-card"/g) ?? []).length, 84);
assert.equal((html.match(/class="option"/g) ?? []).length, 336);

const evidence = {
  status: "PASS_PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_V1_2_OPTION_CLARITY",
  authority: PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_2,
  defectHoldAuthority: PFC_001_OPTION_CLARITY_DEFECT_HOLD_V1.authorityId,
  reviewQuestionCount: questions.length,
  changedQuestionCount: changedQuestionIds.length,
  changedQuestionIds,
  correctOptionIdsRetainedForAll84: true,
  stemsRetainedForAll84: true,
  stimuliRetainedForAll84: true,
  sameStructurePairsAudited,
  spacingOnlyOffenderCount: spacingOnlyOffenders.length,
  prohibitedUniformScaleDistractors: true,
  prohibitedSmallTranslationCopies: true,
  minimumNovelCorrectVisibleBoundaryGap,
  normalizedNovelStageCount: novelStageRatios.length,
  transparentCutoutsRetained: true,
  governance: {
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_V1_2_HUMAN_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-final-combined-review-v1-2.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-final-combined-review-v1-2-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
