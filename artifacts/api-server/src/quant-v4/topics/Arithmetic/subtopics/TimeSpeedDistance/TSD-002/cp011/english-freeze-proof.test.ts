import { TSD_CP011_ENGLISH_REVIEW } from "./english-review-final";
import {
  TSD_CP011_ENGLISH_FREEZE_APPROVAL,
  TSD_CP011_FROZEN_ENGLISH_REVIEW,
} from "./english-freeze-registry";
import { TSD_CP011_NEXT_PERMANENT_QL, TSD_CP011_PERMANENT_QL_IDS } from "./ql-allocation";
import { TSD_CP011_STUDIO_CANDIDATE_PACKAGE } from "./question-studio-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-011 English freeze proof failed: ${message}`);
}
function withoutFreezeTag<T extends { readonly editorialStatus: "FROZEN" }>(value: T) {
  const { editorialStatus: _editorialStatus, ...rest } = value;
  return rest;
}
function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `bigint:${item.toString()}` : item);
}

assert(TSD_CP011_ENGLISH_FREEZE_APPROVAL.status === "PRODUCT_OWNER_APPROVED_ENGLISH_FREEZE", "freeze approval status changed");
assert(TSD_CP011_ENGLISH_FREEZE_APPROVAL.approvalInstruction === "Go — continue TSD chapter in lifecycle order", "approval instruction changed");
assert(TSD_CP011_ENGLISH_FREEZE_APPROVAL.approvedSourceHead === "f50cc416007985ab139dd0d1b28a80003c1619b0", "approved CP011 source head changed");
assert(TSD_CP011_ENGLISH_FREEZE_APPROVAL.approvedReviewWorkflowRun === 66, "approved review workflow changed");
assert(TSD_CP011_ENGLISH_FREEZE_APPROVAL.approvedReviewWorkflowRunId === 33314810827, "approved review workflow run ID changed");
assert(TSD_CP011_ENGLISH_FREEZE_APPROVAL.approvedReviewArtifactId === 9733100290, "approved review artifact changed");
assert(TSD_CP011_ENGLISH_FREEZE_APPROVAL.approvedReviewArtifactDigest === "sha256:c628071d10c9227bb749ed05786c0dd4d6b90bbf6f214b39c32bdf83d7962c3a", "approved review artifact digest changed");
assert(TSD_CP011_PERMANENT_QL_IDS.length === 7, "permanent QL count changed");
assert(TSD_CP011_NEXT_PERMANENT_QL === "TSD-QL-132", "next permanent QL changed");
assert(TSD_CP011_FROZEN_ENGLISH_REVIEW.length === 168, "frozen English family count changed");
assert(new Set(TSD_CP011_FROZEN_ENGLISH_REVIEW.map((question) => question.familyId)).size === 168, "frozen family IDs are no longer unique");
assert(new Set(TSD_CP011_FROZEN_ENGLISH_REVIEW.map((question) => question.stem)).size === 168, "frozen English stems are no longer unique");
assert(TSD_CP011_FROZEN_ENGLISH_REVIEW.every((question) => question.editorialStatus === "FROZEN"), "frozen English row lost FROZEN status");
assert(canonicalJson(TSD_CP011_FROZEN_ENGLISH_REVIEW.map(withoutFreezeTag)) === canonicalJson(TSD_CP011_ENGLISH_REVIEW), "frozen English learner content differs from approved source");

for (const qlId of TSD_CP011_PERMANENT_QL_IDS) {
  assert(TSD_CP011_FROZEN_ENGLISH_REVIEW.filter((question) => question.qlId === qlId).length === 24, `${qlId}: expected 24 frozen English families`);
}

assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.reviewedCombinationsPerLocale === 168, "approved per-locale Studio review contract changed");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.reviewedMultilingualCombinations === 504, "approved multilingual Studio review contract changed");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus === "NOT_REGISTERED", "content freeze must not register Question Studio");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.routeMounted === false, "content freeze must not mount route");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.persistenceAllowed === false, "content freeze must not enable persistence");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.questionBankWritable === false, "content freeze must not enable Question Bank writes");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.testEligible === false, "content freeze must not enable tests");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable === false, "content freeze must not enable publishing");

console.log("TSD-CP-011 ENGLISH FREEZE PROOF: PASS");
console.log(JSON.stringify({
  status: TSD_CP011_ENGLISH_FREEZE_APPROVAL.status,
  approvedSourceHead: TSD_CP011_ENGLISH_FREEZE_APPROVAL.approvedSourceHead,
  qls: TSD_CP011_PERMANENT_QL_IDS.length,
  englishFamilies: TSD_CP011_FROZEN_ENGLISH_REVIEW.length,
  combinationsPerLocale: TSD_CP011_STUDIO_CANDIDATE_PACKAGE.reviewedCombinationsPerLocale,
  multilingualCombinations: TSD_CP011_STUDIO_CANDIDATE_PACKAGE.reviewedMultilingualCombinations,
  questionStudioRegistration: TSD_CP011_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus,
}, null, 2));
