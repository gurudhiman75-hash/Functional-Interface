import { MEN_CP_012_PERMANENT_ALLOCATION } from "./allocation";
import {
  auditMenCp012PermanentEnglishReviewV1,
  buildMenCp012PermanentEnglishReviewV1,
} from "./review-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const review = buildMenCp012PermanentEnglishReviewV1();
const audit = auditMenCp012PermanentEnglishReviewV1();

assert(review.length === 59, `Expected 59 source-complete review records, got ${review.length}.`);
assert(audit.reviewRecordCount === 59, `Review audit count mismatch: ${audit.reviewRecordCount}.`);
assert(audit.permanentQlCount === 13, `Expected all 13 permanent QLs, got ${audit.permanentQlCount}.`);
assert(audit.uniqueStemCount === 59, `All 59 review stems must be distinct; got ${audit.uniqueStemCount}.`);
assert(audit.declaredSourceCount === 42 && audit.coveredSourceCount === 42, `Human review must expose all 42 permanent sources; got ${audit.coveredSourceCount}/${audit.declaredSourceCount}.`);
assert(audit.missingSources.length === 0, `Missing review sources: ${audit.missingSources.join(", ")}`);
assert(audit.everyQlHasAllFourPositions, "Every permanent QL must demonstrate A/B/C/D in the human review.");
assert(audit.answerPositionSpread <= 1, `Review answer positions must be globally balanced; got ${JSON.stringify(audit.correctPositions)}.`);
assert(audit.allVerified, "Every review question must verify.");
assert(audit.allUniqueOptions, "Every review question must have four unique option displays.");
assert(audit.productLocked, "Permanent English review candidate must remain product locked and unfrozen.");

for (const allocation of MEN_CP_012_PERMANENT_ALLOCATION) {
  const slice = review.filter((question) => question.permanentQlId === allocation.qlId);
  assert(slice.length >= 4, `${allocation.qlId}: expected at least four review records.`);
  assert(new Set(slice.map((question) => question.correctIndex)).size === 4, `${allocation.qlId}: A/B/C/D coverage missing.`);
  assert(new Set(slice.map((question) => question.stem)).size === slice.length, `${allocation.qlId}: repeated review stem.`);
  assert(slice.every((question) => question.clusterId === allocation.clusterId), `${allocation.qlId}: cluster drift in review.`);
}

const corrected = review.filter((question) => question.sourceId === "V3-SPHERE-TO-CONE-DIAMETER-HEIGHT-RATIO");
assert(corrected.length >= 1, "Corrected cone-ratio source must appear in human review.");
assert(corrected.every((question) => question.sourceKind === "V4_CORRECTION"), "Human review must use V4 correction for cone-ratio source.");
assert(corrected.every((question) => question.stem.includes("cone of height") && !question.stem.includes("whose base radius")), "Human review cone-ratio semantics are incorrect.");

console.log(JSON.stringify({
  authority: "MEN-CP012-PERMANENT-ENGLISH-REVIEW-V1",
  reviewRecordCount: audit.reviewRecordCount,
  permanentQlCount: audit.permanentQlCount,
  declaredSourceCount: audit.declaredSourceCount,
  coveredSourceCount: audit.coveredSourceCount,
  correctPositions: audit.correctPositions,
  answerPositionSpread: audit.answerPositionSpread,
  englishImplementationFrozen: false,
  productLocked: audit.productLocked,
}, null, 2));
