import { MEN_CP_012_PERMANENT_ALLOCATION } from "./allocation";
import {
  auditMenCp012PermanentEnglishReviewV2,
  buildMenCp012PermanentEnglishReviewV2,
} from "./review-v2";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const review = buildMenCp012PermanentEnglishReviewV2();
const audit = auditMenCp012PermanentEnglishReviewV2();

assert(review.length === 59, `Expected 59 V2 review records, got ${review.length}.`);
assert(audit.permanentQlCount === 13, `Expected 13 permanent QLs, got ${audit.permanentQlCount}.`);
assert(audit.uniqueStemCount === 59, `Expected 59 unique V2 stems, got ${audit.uniqueStemCount}.`);
assert(audit.declaredSourceCount === 42 && audit.coveredSourceCount === 42, `V2 review source coverage must be 42/42; got ${audit.coveredSourceCount}/${audit.declaredSourceCount}.`);
assert(audit.missingSources.length === 0, `Missing V2 review sources: ${audit.missingSources.join(", ")}`);
assert(audit.everyQlHasAllFourPositions, "Every QL must expose A/B/C/D in V2 review.");
assert(audit.answerPositionSpread <= 1, `V2 review answer positions must be balanced; got ${JSON.stringify(audit.correctPositions)}.`);
assert(audit.allVerified && audit.allUniqueOptions, "Every V2 review question must verify and have unique options.");
assert(audit.noSpacedPercent, "V2 review must not contain spaces before percentage signs.");
assert(audit.productLocked, "V2 review must remain unfrozen and product locked.");

for (const allocation of MEN_CP_012_PERMANENT_ALLOCATION) {
  const slice = review.filter((question) => question.permanentQlId === allocation.qlId);
  assert(slice.length >= 4, `${allocation.qlId}: expected at least four review records.`);
  assert(new Set(slice.map((question) => question.correctIndex)).size === 4, `${allocation.qlId}: A/B/C/D coverage missing.`);
  assert(slice.every((question) => question.explanation.steps.length >= 4 && question.explanation.traps.length >= 2), `${allocation.qlId}: teaching depth insufficient.`);
  assert(slice.every((question) => question.explanation.steps.every((step) => ![
    "Write total usable source volume equal to total target volume.",
    "Keep all dimensions in consistent units before evaluating the conservation relation.",
    "Convert linear units before applying powers; apply any loss/yield fraction to material volume.",
  ].includes(step.body))), `${allocation.qlId}: generic source filler survived in human review.`);
}

const countReview = review.filter((question) =>
  /^(\d+)\s+(spheres|cubes|cylinders|coins)$/.test(question.answer) ||
  (question.clusterId === "RECAST_COUNT_DIRECT" && /^\d+$/.test(question.answer)),
);
assert(countReview.length > 0, "V2 review must exercise count-option realism.");
for (const question of countReview) {
  const answer = Number.parseInt(question.answer, 10);
  const wrong = question.options.filter((option) => !option.isCorrect).map((option) => Number.parseInt(option.display, 10));
  assert(wrong.every((value) =>
    value * 2 === answer || value * 3 === answer || value * 4 === answer ||
    value === answer * 2 || value === answer * 3 || value === answer * 4),
  `${question.permanentQlId}/${question.sourceId}: count distractors are not volume-ratio based: ${wrong.join(", ")}.`);
}

const secondary = review.filter((question) => question.permanentQlId === "MEN-002-QL-162");
assert(secondary.length === 4, `QL-162 should have four review states, got ${secondary.length}.`);
assert(new Set(secondary.map((question) => question.stem)).size === 4, "QL-162 review stems must be distinct.");
assert(new Set(secondary.map((question) => question.answer)).size === 4, `QL-162 must expose four distinct percentage answers; got ${[...new Set(secondary.map((question) => question.answer))].join(", ")}.`);
assert(secondary.every((question) => /^\d+\.\d{2}%$/.test(question.answer)), "QL-162 answers must use explicit two-decimal percentage precision.");

console.log(JSON.stringify({
  authority: "MEN-CP012-PERMANENT-ENGLISH-REVIEW-V2-SETTER-HARDENED",
  reviewRecordCount: audit.reviewRecordCount,
  permanentQlCount: audit.permanentQlCount,
  sourceCoverage: `${audit.coveredSourceCount}/${audit.declaredSourceCount}`,
  correctPositions: audit.correctPositions,
  ql162DistinctAnswers: new Set(secondary.map((question) => question.answer)).size,
  noSpacedPercent: audit.noSpacedPercent,
  productLocked: audit.productLocked,
}, null, 2));
