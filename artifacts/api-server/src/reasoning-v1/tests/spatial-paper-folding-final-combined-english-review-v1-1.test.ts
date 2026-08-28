import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1,
  generatePfcTpfFinalCombinedEnglishReviewV1,
} from "../foundation/spatial/paper-folding-final-combined-english-review-v1";
import {
  PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_1,
  generatePfcTpfFinalCombinedEnglishReviewV1_1,
  renderPfcTpfFinalCombinedEnglishReviewHtmlV1_1,
} from "../foundation/spatial/paper-folding-final-combined-english-review-v1-1";
import { PFC_001_BOUNDARY_CLEARANCE_DEFECT_HOLD_V1 } from "../foundation/spatial/paper-folding-boundary-clearance-defect-hold-v1";

const previous = generatePfcTpfFinalCombinedEnglishReviewV1();
const questions = generatePfcTpfFinalCombinedEnglishReviewV1_1();
assert.equal(questions.length, 84);
assert.equal(new Set(questions.map((question) => question.reviewId)).size, 84);

const previousRetained = previous.filter((question) => question.surfaceId !== "CONTROLLED_NOVEL_APPROVED");
const currentRetained = questions.filter((question) => question.surfaceId !== "CONTROLLED_NOVEL_APPROVED");
assert.equal(currentRetained.length, 72);
assert.deepEqual(currentRetained, previousRetained, "Core, triangle and hexagon surfaces must remain byte-for-byte immutable in V1.1 composition.");

const previousNovel = previous.filter((question) => question.surfaceId === "CONTROLLED_NOVEL_APPROVED");
const novel = questions.filter((question) => question.surfaceId === "CONTROLLED_NOVEL_APPROVED");
assert.equal(novel.length, 12);
assert.equal(previousNovel.length, 12);
for (let index = 0; index < novel.length; index += 1) {
  assert.equal(novel[index].reviewId, previousNovel[index].reviewId);
  assert.equal(novel[index].sourceRef, previousNovel[index].sourceRef);
  assert.equal(novel[index].proposalId, previousNovel[index].proposalId);
  assert.equal(novel[index].correctOptionId, previousNovel[index].correctOptionId, `${novel[index].reviewId} correct option ID changed during boundary remediation.`);
}

const bySurface = Object.fromEntries(
  ["CORE_MAIN", "TRIANGLE_APPROVED", "HEXAGON_APPROVED", "CONTROLLED_NOVEL_APPROVED"].map((surface) => [
    surface,
    questions.filter((question) => question.surfaceId === surface).length,
  ]),
);
assert.deepEqual(bySurface, {
  CORE_MAIN: 48,
  TRIANGLE_APPROVED: 12,
  HEXAGON_APPROVED: 12,
  CONTROLLED_NOVEL_APPROVED: 12,
});
assert.equal(questions.filter((question) => question.provenance === "SOURCE_BACKED_CORE").length, 72);
assert.equal(questions.filter((question) => question.provenance === "CONTROLLED_NOVEL").length, 12);
assert.equal(questions.filter((question) => question.chapterCode === "TPF-001").length, 8);

for (const question of questions) {
  assert.equal(question.options.length, 4, `${question.reviewId} must have four options.`);
  assert.equal(new Set(question.options.map((option) => option.svg)).size, 4, `${question.reviewId} has duplicate option art.`);
  assert.ok(question.options.some((option) => option.optionId === question.correctOptionId), `${question.reviewId} answer must exist.`);
}

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
const PAPER_STROKE_HALF = 0.9;
const PUNCH_STROKE_HALF = 0.85;
const MIN_VISIBLE_BOUNDARY_GAP = 2;

function num(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`\\b${name}="(-?\\d+(?:\\.\\d+)?)"`));
  return match ? Number(match[1]) : null;
}

function pointSegmentDistance(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax, dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared <= 1e-12) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function visibleBoundaryGap(svg: string): number {
  const polygonTag = (svg.match(/<polygon\b[^>]*fill="white"[^>]*stroke="#111"[^>]*\/?\s*>/) ?? [])[0];
  assert.ok(polygonTag, "Novel correct option must have a polygonal source boundary.");
  const values = polygonTag.match(/\bpoints="([^"]+)"/)?.[1]?.match(NUMBER_RE)?.map(Number) ?? [];
  const boundary: Array<[number, number]> = [];
  for (let index = 0; index + 1 < values.length; index += 2) boundary.push([values[index], values[index + 1]]);
  assert.ok(boundary.length >= 3);

  const punchTags = svg.match(/<circle\b[^>]*data-cutout="transparent"[^>]*\/>/g) ?? [];
  assert.ok(punchTags.length >= 2);
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

let minimumNovelCorrectVisibleBoundaryGap = Number.POSITIVE_INFINITY;
const novelStageRatios: number[] = [];
for (const question of novel) {
  assert.equal(question.provenance, "CONTROLLED_NOVEL");
  assert.ok(!/\b(?:PYQ|SSC|IBPS|SBI|RRB|previous year|past paper)\b/i.test(question.stem), `${question.reviewId} falsely implies historical attribution.`);
  const correct = question.options.find((option) => option.optionId === question.correctOptionId)!;
  const gap = visibleBoundaryGap(correct.svg);
  minimumNovelCorrectVisibleBoundaryGap = Math.min(minimumNovelCorrectVisibleBoundaryGap, gap);
  assert.ok(gap + 1e-9 >= MIN_VISIBLE_BOUNDARY_GAP, `${question.reviewId} interior unfolded punch still appears to touch the paper boundary at ${gap.toFixed(3)} units.`);

  const ratios = [...question.stimulusSvg.matchAll(/data-paper-fill="([0-9.]+)"/g)].map((match) => Number(match[1]));
  novelStageRatios.push(...ratios);
}
assert.equal(novelStageRatios.length, 26);
assert.ok(Math.max(...novelStageRatios) - Math.min(...novelStageRatios) <= 0.02);

const allMarkup = questions.flatMap((question) => [question.stimulusSvg, ...question.options.map((option) => option.svg)]).join("\n");
assert.ok(!/data-cutout="transparent"[^>]*fill="(?:black|#111)"/i.test(allMarkup));
assert.ok(!/fill="(?:black|#111)"[^>]*data-cutout="transparent"/i.test(allMarkup));

assert.equal(PFC_001_BOUNDARY_CLEARANCE_DEFECT_HOLD_V1.englishFreezeAllowed, false);
assert.equal(PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_1.supersedesReviewCandidate, PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1.authorityId);
assert.equal(PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_1.controlledNovelApprovalAuthority, null);
assert.equal(PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_1.englishFreezeAllowed, false);
assert.equal(PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_1.questionStudioAllowed, false);

const html = renderPfcTpfFinalCombinedEnglishReviewHtmlV1_1(questions);
assert.ok(html.includes("PFC / TPF Final Combined English Learner Review V1.1"));
assert.ok(html.includes("Boundary-clearance-remediated controlled-novel constructions"));
assert.ok(html.includes(PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_1.authorityId));
assert.equal((html.match(/class="question-card"/g) ?? []).length, 84);
assert.equal((html.match(/class="option"/g) ?? []).length, 336);
assert.equal((html.match(/class="review-section"/g) ?? []).length, 4);

const evidence = {
  status: "PASS_PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_V1_1_BOUNDARY_CLEARANCE",
  authority: PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_1,
  defectHoldAuthority: PFC_001_BOUNDARY_CLEARANCE_DEFECT_HOLD_V1.authorityId,
  reviewQuestionCount: questions.length,
  surfaceCounts: bySurface,
  retainedCoreTriangleHexagonQuestionsImmutable: true,
  controlledNovelQuestionCount: novel.length,
  controlledNovelCorrectOptionIdsRetained: true,
  minimumVisibleBoundaryGapGate: MIN_VISIBLE_BOUNDARY_GAP,
  minimumNovelCorrectVisibleBoundaryGap,
  normalizedNovelStageCount: novelStageRatios.length,
  minNovelStageFillRatio: Math.min(...novelStageRatios),
  maxNovelStageFillRatio: Math.max(...novelStageRatios),
  transparentCutoutsRetained: true,
  oldFinalCombinedV1Superseded: true,
  oldControlledNovelApprovalNotCarriedForward: true,
  governance: {
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_V1_1_HUMAN_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-final-combined-review-v1-1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-final-combined-review-v1-1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
