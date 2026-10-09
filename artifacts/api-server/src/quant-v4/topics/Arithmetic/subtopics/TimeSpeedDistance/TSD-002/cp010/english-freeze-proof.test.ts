import { TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW } from "./exam-paper-review-final-v3-all";
import {
  TSD_CP010_ENGLISH_FREEZE_APPROVAL,
  TSD_CP010_FROZEN_ENGLISH_REVIEW,
} from "./english-freeze-registry";
import { TSD_CP010_NEXT_PERMANENT_QL, TSD_CP010_PERMANENT_QL_IDS } from "./ql-allocation";
import { TSD_CP010_STUDIO_CANDIDATE_PACKAGE } from "./question-studio-candidate-adapter-exam-real";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 English freeze proof failed: ${message}`);
}

function withoutFreezeTag<T extends { readonly editorialStatus: "FROZEN" }>(value: T) {
  const { editorialStatus: _editorialStatus, ...rest } = value;
  return rest;
}
function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `bigint:${item.toString()}` : item);
}

assert(TSD_CP010_ENGLISH_FREEZE_APPROVAL.status === "PRODUCT_OWNER_APPROVED_ENGLISH_FREEZE", "freeze approval status changed");
assert(TSD_CP010_ENGLISH_FREEZE_APPROVAL.approvedSourceHead === "78768014443ca76e606f063b73ead667af86d375", "approved V3 source head changed");
assert(TSD_CP010_ENGLISH_FREEZE_APPROVAL.approvedReviewWorkflowRun === 193, "approved review workflow changed");
assert(TSD_CP010_ENGLISH_FREEZE_APPROVAL.approvedReviewWorkflowRunId === 33099009244, "approved review workflow run ID changed");
assert(TSD_CP010_ENGLISH_FREEZE_APPROVAL.approvedReviewArtifactId === 9657610728, "approved review artifact changed");
assert(TSD_CP010_ENGLISH_FREEZE_APPROVAL.approvedReviewArtifactDigest === "sha256:b930ef54bfd1a10ba6e93cbc6ad825df6734675d3a82ab62f87b706a9b68ce5b", "approved review artifact digest changed");
assert(TSD_CP010_PERMANENT_QL_IDS.length === 10, "permanent QL count changed");
assert(TSD_CP010_NEXT_PERMANENT_QL === "TSD-QL-125", "next permanent QL changed");
assert(TSD_CP010_FROZEN_ENGLISH_REVIEW.length === 60, "frozen English family count changed");
assert(new Set(TSD_CP010_FROZEN_ENGLISH_REVIEW.map((question) => question.stem)).size === 60, "frozen English stems are no longer unique");
assert(TSD_CP010_FROZEN_ENGLISH_REVIEW.every((question) => question.editorialStatus === "FROZEN"), "frozen English row lost FROZEN status");

const sourceJson = canonicalJson(TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW);
const frozenJson = canonicalJson(TSD_CP010_FROZEN_ENGLISH_REVIEW.map(withoutFreezeTag));
assert(frozenJson === sourceJson, "frozen English learner content differs from approved V3 source");

for (const qlId of TSD_CP010_PERMANENT_QL_IDS) {
  assert(TSD_CP010_FROZEN_ENGLISH_REVIEW.filter((question) => question.qlId === qlId).length === 6, `${qlId}: expected six frozen English families`);
}

assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.compatibleCombinationsPerLocale === 471, "approved per-locale generation contract changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.deterministicMultilingualCombinations === 1413, "approved multilingual generation contract changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.stemAuthoringPolicy === "SSC_BANK_PUNJAB_OFFICIAL_PAPER_RACE_LANGUAGE", "approved official-paper stem policy changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.representationPolicy === "CAPABILITY_BEATS_BY_START_RATIO_TWO_RACE_EVIDENCE", "approved representation policy changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus === "NOT_REGISTERED", "content freeze must not silently register Question Studio");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.routeMounted === false, "content freeze must not silently mount a route");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.persistenceAllowed === false, "content freeze must not enable persistence");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.testEligible === false, "content freeze must not enable tests");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable === false, "content freeze must not enable publishing");

console.log("TSD-CP-010 OFFICIAL-PAPER V3 ENGLISH FREEZE PROOF: PASS");
console.log(JSON.stringify({
  status: TSD_CP010_ENGLISH_FREEZE_APPROVAL.status,
  approvedOn: TSD_CP010_ENGLISH_FREEZE_APPROVAL.approvedOn,
  approvedSourceHead: TSD_CP010_ENGLISH_FREEZE_APPROVAL.approvedSourceHead,
  qls: TSD_CP010_PERMANENT_QL_IDS.length,
  englishFamilies: TSD_CP010_FROZEN_ENGLISH_REVIEW.length,
  combinationsPerLocale: TSD_CP010_STUDIO_CANDIDATE_PACKAGE.compatibleCombinationsPerLocale,
  multilingualCombinations: TSD_CP010_STUDIO_CANDIDATE_PACKAGE.deterministicMultilingualCombinations,
  questionStudioRegistration: TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus,
  questionBankStatus: TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionBankStatus,
  testEligibility: TSD_CP010_STUDIO_CANDIDATE_PACKAGE.testEligibility,
  publiclyPublishable: TSD_CP010_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable,
}, null, 2));
