import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1,
  generatePfcTpfFinalCombinedEnglishReviewV1,
  renderPfcTpfFinalCombinedEnglishReviewHtmlV1,
} from "../foundation/spatial/paper-folding-final-combined-english-review-v1";
import { PFC_001_TRIANGLE_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/paper-folding-triangle-product-owner-approval-v1";
import { PFC_001_HEXAGON_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/paper-folding-hexagon-product-owner-approval-v1";
import { PFC_001_CONTROLLED_NOVEL_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/paper-folding-controlled-novel-product-owner-approval-v1";

const questions = generatePfcTpfFinalCombinedEnglishReviewV1();
assert.equal(questions.length, 84);
assert.equal(new Set(questions.map((question) => question.reviewId)).size, 84, "Final review IDs must be unique.");

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

const sourceBacked = questions.filter((question) => question.provenance === "SOURCE_BACKED_CORE");
const controlledNovel = questions.filter((question) => question.provenance === "CONTROLLED_NOVEL");
assert.equal(sourceBacked.length, 72);
assert.equal(controlledNovel.length, 12);
assert.equal(questions.filter((question) => question.chapterCode === "TPF-001").length, 8);
assert.equal(questions.filter((question) => question.representation === "TRIANGLE").length, 12);
assert.equal(questions.filter((question) => question.representation.startsWith("REGULAR_HEXAGON")).length, 12);
assert.equal(controlledNovel.filter((question) => question.representation === "REGULAR_PENTAGON").length, 6);
assert.equal(controlledNovel.filter((question) => question.representation === "REGULAR_OCTAGON").length, 4);
assert.equal(controlledNovel.filter((question) => question.representation === "SKEWED_CONVEX_POLYGON").length, 2);

for (const question of questions) {
  assert.equal(question.options.length, 4, `${question.reviewId} must have four options.`);
  assert.ok(question.options.some((option) => option.optionId === question.correctOptionId), `${question.reviewId} answer must exist.`);
  assert.equal(new Set(question.options.map((option) => option.svg)).size, 4, `${question.reviewId} has duplicate option art.`);
  assert.ok(question.stimulusSvg.includes("<svg") || question.stimulusSvg.includes("class=\"sequence\""), `${question.reviewId} lacks diagram stimulus.`);
}

for (const question of controlledNovel) {
  assert.equal(question.surfaceId, "CONTROLLED_NOVEL_APPROVED");
  assert.ok(!/\b(?:PYQ|SSC|IBPS|SBI|RRB|previous year|past paper)\b/i.test(question.stem), `${question.reviewId} falsely implies historical attribution.`);
}

const allMarkup = questions.flatMap((question) => [question.stimulusSvg, ...question.options.map((option) => option.svg)]).join("\n");
assert.ok(!/data-cutout="transparent"[^>]*fill="(?:black|#111)"/i.test(allMarkup));
assert.ok(!/fill="(?:black|#111)"[^>]*data-cutout="transparent"/i.test(allMarkup));

const novelStageRatios = controlledNovel.flatMap((question) => [...question.stimulusSvg.matchAll(/data-paper-fill="([0-9.]+)"/g)].map((match) => Number(match[1])));
assert.equal(novelStageRatios.length, 26, "Controlled-novel surface must retain all 26 normalized Fold/Cut panels.");
assert.ok(Math.max(...novelStageRatios) - Math.min(...novelStageRatios) <= 0.02, "Controlled-novel stage scale spread regressed.");

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
const EXPECTED_STAGE_FILL_RATIO = 1 / 1.30;
const STAGE_FILL_TOLERANCE = 0.015;

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

function polygonStageFillRatio(svg: string): number | null {
  const viewBox = svg.match(/\bviewBox="([^"]+)"/i)?.[1]?.match(NUMBER_RE)?.map(Number) ?? [];
  if (viewBox.length !== 4) return null;
  const paperSpan = largestPaperPolygonSpan(svg);
  if (paperSpan === null) return null;
  return paperSpan / Math.max(viewBox[2], viewBox[3]);
}

const triangleForward = questions.filter((question) => question.surfaceId === "TRIANGLE_APPROVED" && /completely opened/i.test(question.stem));
assert.equal(triangleForward.length, 8, "Final composition must retain all eight approved triangle forward questions.");
const triangleStageRatios: number[] = [];
for (const question of triangleForward) {
  const stageSvgs = question.stimulusSvg.match(/<svg\b[\s\S]*?<\/svg>/g) ?? [];
  assert.equal(stageSvgs.length, 2, `${question.reviewId} must retain Fold and Cut/Punch triangle stages.`);
  for (const svg of stageSvgs) {
    const ratio = polygonStageFillRatio(svg);
    assert.notEqual(ratio, null, `${question.reviewId} has an unmeasurable triangle stage.`);
    triangleStageRatios.push(ratio!);
    assert.ok(
      Math.abs(ratio! - EXPECTED_STAGE_FILL_RATIO) <= STAGE_FILL_TOLERANCE,
      `${question.reviewId} triangle stage scale regressed to ${ratio!.toFixed(3)}.`,
    );
  }
}
assert.equal(triangleStageRatios.length, 16, "Final composition must retain all 16 approved triangle Fold/Cut panels.");
assert.ok(Math.max(...triangleStageRatios) - Math.min(...triangleStageRatios) <= 0.02, "Triangle stage scale spread regressed in final composition.");

const hexagonForward = questions.filter((question) => question.surfaceId === "HEXAGON_APPROVED" && /completely opened/i.test(question.stem));
const hexagonStageRatios = hexagonForward.flatMap((question) => [...question.stimulusSvg.matchAll(/data-paper-fill="([0-9.]+)"/g)].map((match) => Number(match[1])));
assert.ok(hexagonStageRatios.length >= 16, "Hexagon normalized stage metadata must survive final composition.");

assert.equal(PFC_001_TRIANGLE_PRODUCT_OWNER_APPROVAL_V1.authorityId, "PFC-001-TRIANGLE-PRODUCT-OWNER-APPROVAL-V1");
assert.equal(PFC_001_TRIANGLE_PRODUCT_OWNER_APPROVAL_V1.authorization.mergeTriangleIntoMainSourceSaturatedReviewAllowed, true);
assert.equal(PFC_001_HEXAGON_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(PFC_001_CONTROLLED_NOVEL_PRODUCT_OWNER_APPROVAL_V1.approved, true);

const html = renderPfcTpfFinalCombinedEnglishReviewHtmlV1(questions);
assert.ok(html.includes("PFC / TPF Final Combined English Learner Review V1"));
assert.ok(html.includes("PYQ_COVERAGE_IS_THE_FLOOR_NOT_THE_CEILING") === false);
assert.ok(html.includes("Controlled-novel questions are explicitly labelled"));
assert.equal((html.match(/class="question-card"/g) ?? []).length, 84);
assert.equal((html.match(/class="option"/g) ?? []).length, 336);
assert.equal((html.match(/class="review-section"/g) ?? []).length, 4);
assert.ok(html.includes("Part A — Source-backed core"));
assert.ok(html.includes("Part B — Approved triangular"));
assert.ok(html.includes("Part C — Approved regular-hexagon"));
assert.ok(html.includes("Part D — Approved controlled-novel"));

const evidence = {
  status: "PASS_PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_V1",
  authority: PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1,
  reviewQuestionCount: questions.length,
  surfaceCounts: bySurface,
  sourceBackedCoreCount: sourceBacked.length,
  controlledNovelCount: controlledNovel.length,
  transparentTpfCount: questions.filter((question) => question.chapterCode === "TPF-001").length,
  representationCounts: {
    triangle: questions.filter((question) => question.representation === "TRIANGLE").length,
    regularHexagon: questions.filter((question) => question.representation.startsWith("REGULAR_HEXAGON")).length,
    regularPentagonNovel: controlledNovel.filter((question) => question.representation === "REGULAR_PENTAGON").length,
    regularOctagonNovel: controlledNovel.filter((question) => question.representation === "REGULAR_OCTAGON").length,
    skewedConvexNovel: controlledNovel.filter((question) => question.representation === "SKEWED_CONVEX_POLYGON").length,
  },
  optionArtUniqueWithinEveryQuestion: true,
  normalizedNovelStageCount: novelStageRatios.length,
  minNovelStageFillRatio: Math.min(...novelStageRatios),
  maxNovelStageFillRatio: Math.max(...novelStageRatios),
  normalizedTriangleStageCount: triangleStageRatios.length,
  minTriangleStageFillRatio: Math.min(...triangleStageRatios),
  maxTriangleStageFillRatio: Math.max(...triangleStageRatios),
  normalizedHexagonStageCount: hexagonStageRatios.length,
  transparentCutoutsRetained: true,
  approvals: {
    triangle: PFC_001_TRIANGLE_PRODUCT_OWNER_APPROVAL_V1.authorityId,
    hexagon: PFC_001_HEXAGON_PRODUCT_OWNER_APPROVAL_V1.authorityId,
    controlledNovel: PFC_001_CONTROLLED_NOVEL_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  },
  governance: {
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_TPF_FINAL_COMBINED_ENGLISH_HUMAN_REVIEW_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-final-combined-review-v1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-final-combined-review-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
