import { TSD_CP012_ENGLISH_REVIEW_FINAL } from "./english-review-editorial-final";
import {
  TSD_CP012_ENGLISH_FREEZE_APPROVAL,
  TSD_CP012_FROZEN_ENGLISH_REVIEW,
} from "./english-freeze-registry";
import { TSD_CP012_NEXT_PERMANENT_QL, TSD_CP012_PERMANENT_QL_IDS } from "./ql-allocation";
import { TSD_CP012_STUDIO_CANDIDATE_PACKAGE } from "./question-studio-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-012 English freeze proof failed: ${message}`);
}
function withoutFreezeTag<T extends { readonly editorialStatus: "FROZEN" }>(value: T) {
  const { editorialStatus: _editorialStatus, ...rest } = value;
  return rest;
}
function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `bigint:${item.toString()}` : item);
}

const expectedPerQl = Object.freeze({
  "TSD-QL-132": 26,
  "TSD-QL-133": 24,
  "TSD-QL-134": 26,
  "TSD-QL-135": 26,
  "TSD-QL-136": 24,
  "TSD-QL-137": 24,
  "TSD-QL-138": 24,
  "TSD-QL-139": 24,
  "TSD-QL-140": 24,
  "TSD-QL-141": 24,
  "TSD-QL-142": 24,
} as const);

assert(TSD_CP012_ENGLISH_FREEZE_APPROVAL.status === "PRODUCT_OWNER_APPROVED_ENGLISH_FREEZE", "freeze approval status changed");
assert(TSD_CP012_ENGLISH_FREEZE_APPROVAL.approvalInstruction === "Go — continue TSD chapter in lifecycle order", "approval instruction changed");
assert(TSD_CP012_ENGLISH_FREEZE_APPROVAL.approvedSourceHead === "59391cc03959b6df82256ff91a160ab50c6c6fc9", "approved CP012 source head changed");
assert(TSD_CP012_ENGLISH_FREEZE_APPROVAL.approvedReviewWorkflowRun === 94, "approved review workflow changed");
assert(TSD_CP012_ENGLISH_FREEZE_APPROVAL.approvedReviewWorkflowRunId === 33315106517, "approved review run ID changed");
assert(TSD_CP012_PERMANENT_QL_IDS.length === 11, "permanent QL count changed");
assert(TSD_CP012_NEXT_PERMANENT_QL === "TSD-QL-143", "next permanent QL changed");
assert(TSD_CP012_FROZEN_ENGLISH_REVIEW.length === 270, "frozen English family count changed");
assert(new Set(TSD_CP012_FROZEN_ENGLISH_REVIEW.map((question) => question.familyId)).size === 270, "frozen family IDs are no longer unique");
assert(new Set(TSD_CP012_FROZEN_ENGLISH_REVIEW.map((question) => question.stem)).size === 270, "frozen English stems are no longer unique");
assert(TSD_CP012_FROZEN_ENGLISH_REVIEW.every((question) => question.editorialStatus === "FROZEN"), "frozen English row lost FROZEN status");
assert(canonicalJson(TSD_CP012_FROZEN_ENGLISH_REVIEW.map(withoutFreezeTag)) === canonicalJson(TSD_CP012_ENGLISH_REVIEW_FINAL), "frozen English learner content differs from approved editorial-final source");

for (const qlId of TSD_CP012_PERMANENT_QL_IDS) {
  assert(TSD_CP012_FROZEN_ENGLISH_REVIEW.filter((question) => question.qlId === qlId).length === expectedPerQl[qlId], `${qlId}: frozen family count drifted`);
}
assert(TSD_CP012_FROZEN_ENGLISH_REVIEW.filter((question) => question.difficulty === "EASY").length === 22, "frozen EASY count changed");
assert(TSD_CP012_FROZEN_ENGLISH_REVIEW.filter((question) => question.difficulty === "MEDIUM").length === 248, "frozen MEDIUM count changed");

assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.reviewedCombinationsPerLocale === 270, "approved per-locale Studio review contract changed");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.reviewedMultilingualCombinations === 810, "approved multilingual Studio review contract changed");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus === "NOT_REGISTERED", "content freeze must not register Question Studio");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.routeMounted === false, "content freeze must not mount route");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.persistenceAllowed === false, "content freeze must not enable persistence");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.questionBankWritable === false, "content freeze must not enable Question Bank writes");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.testEligible === false, "content freeze must not enable tests");
assert(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable === false, "content freeze must not enable publishing");

console.log("TSD-CP-012 ENGLISH FREEZE PROOF: PASS");
console.log(JSON.stringify({
  status: TSD_CP012_ENGLISH_FREEZE_APPROVAL.status,
  approvedSourceHead: TSD_CP012_ENGLISH_FREEZE_APPROVAL.approvedSourceHead,
  qls: TSD_CP012_PERMANENT_QL_IDS.length,
  englishFamilies: TSD_CP012_FROZEN_ENGLISH_REVIEW.length,
  difficulty: { EASY: 22, MEDIUM: 248 },
  questionStudioRegistration: TSD_CP012_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus,
}, null, 2));
