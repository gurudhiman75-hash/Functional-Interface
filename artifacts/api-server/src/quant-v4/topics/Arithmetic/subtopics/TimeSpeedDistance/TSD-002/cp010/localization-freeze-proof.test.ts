import {
  TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW,
  TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW,
} from "./exam-paper-review-final-v3-all";
import {
  TSD_CP010_FROZEN_HINDI_REVIEW,
  TSD_CP010_FROZEN_PUNJABI_REVIEW,
  TSD_CP010_LOCALIZATION_FREEZE_APPROVAL,
} from "./localization-freeze-registry";
import { TSD_CP010_NEXT_PERMANENT_QL, TSD_CP010_PERMANENT_QL_IDS } from "./ql-allocation";
import { TSD_CP010_STUDIO_CANDIDATE_PACKAGE } from "./question-studio-candidate-adapter-exam-real";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 localization freeze proof failed: ${message}`);
}

function withoutFreezeTag<T extends { readonly editorialStatus: "FROZEN" }>(value: T) {
  const { editorialStatus: _editorialStatus, ...rest } = value;
  return rest;
}

assert(TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.status === "PRODUCT_OWNER_APPROVED_LOCALIZATION_FREEZE", "localization freeze approval status changed");
assert(TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.approvedSourceHead === "78768014443ca76e606f063b73ead667af86d375", "approved V3 native source head changed");
assert(TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.approvedReviewWorkflowRun === 193, "approved review workflow changed");
assert(TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.approvedReviewWorkflowRunId === 33099009244, "approved review workflow run ID changed");
assert(TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.approvedReviewArtifactId === 9657610728, "approved review artifact changed");
assert(TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.approvedReviewArtifactDigest === "sha256:b930ef54bfd1a10ba6e93cbc6ad825df6734675d3a82ab62f87b706a9b68ce5b", "approved review artifact digest changed");
assert(TSD_CP010_PERMANENT_QL_IDS.length === 10, "permanent QL count changed");
assert(TSD_CP010_NEXT_PERMANENT_QL === "TSD-QL-125", "next permanent QL changed");

for (const [locale, frozen, source] of [
  ["hi-IN", TSD_CP010_FROZEN_HINDI_REVIEW, TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW],
  ["pa-IN", TSD_CP010_FROZEN_PUNJABI_REVIEW, TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW],
] as const) {
  assert(frozen.length === 60, `${locale}: frozen family count changed`);
  assert(new Set(frozen.map((question) => question.stem)).size === 60, `${locale}: frozen stems are no longer unique`);
  assert(frozen.every((question) => question.editorialStatus === "FROZEN"), `${locale}: frozen row lost FROZEN status`);
  assert(JSON.stringify(frozen.map(withoutFreezeTag)) === JSON.stringify(source), `${locale}: frozen learner content differs from approved V3 source`);
  for (const qlId of TSD_CP010_PERMANENT_QL_IDS) {
    assert(frozen.filter((question) => question.qlId === qlId).length === 6, `${locale}/${qlId}: expected six frozen families`);
  }
}

const hindi = JSON.stringify(TSD_CP010_FROZEN_HINDI_REVIEW);
const punjabi = JSON.stringify(TSD_CP010_FROZEN_PUNJABI_REVIEW);
assert(!/[A-Za-z]{4,}/.test(TSD_CP010_FROZEN_HINDI_REVIEW.map((question) => question.stem).join("\n")), "Hindi learner stems contain unexpected Latin prose");
assert(!/[A-Za-z]{4,}/.test(TSD_CP010_FROZEN_PUNJABI_REVIEW.map((question) => question.stem).join("\n")), "Punjabi learner stems contain unexpected Latin prose");
for (const rejected of ["समय-बढ़त", "दूरी-अंतर", "जीत-अंतर", "समय-अंतर"]) assert(!hindi.includes(rejected), `Hindi synthetic wording '${rejected}' returned after freeze`);
for (const rejected of ["ਦੂਰੀ-ਅੰਤਰ", "ਜਿੱਤ-ਅੰਤਰ", "ਸਮਾਂ-ਅੰਤਰ"]) assert(!punjabi.includes(rejected), `Punjabi synthetic wording '${rejected}' returned after freeze`);

assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.compatibleCombinationsPerLocale === 471, "approved native generation contract changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.deterministicMultilingualCombinations === 1413, "approved multilingual generation contract changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus === "NOT_REGISTERED", "content freeze must not silently register Question Studio");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.routeMounted === false, "content freeze must not silently mount a route");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.persistenceAllowed === false, "content freeze must not enable persistence");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.testEligible === false, "content freeze must not enable tests");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable === false, "content freeze must not enable publishing");

console.log("TSD-CP-010 OFFICIAL-PAPER V3 NATIVE LOCALIZATION FREEZE PROOF: PASS");
console.log(JSON.stringify({
  status: TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.status,
  approvedOn: TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.approvedOn,
  approvedSourceHead: TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.approvedSourceHead,
  qls: TSD_CP010_PERMANENT_QL_IDS.length,
  hindiFamilies: TSD_CP010_FROZEN_HINDI_REVIEW.length,
  punjabiFamilies: TSD_CP010_FROZEN_PUNJABI_REVIEW.length,
  combinationsPerLocale: TSD_CP010_STUDIO_CANDIDATE_PACKAGE.compatibleCombinationsPerLocale,
  multilingualCombinations: TSD_CP010_STUDIO_CANDIDATE_PACKAGE.deterministicMultilingualCombinations,
  questionStudioRegistration: TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus,
  questionBankStatus: TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionBankStatus,
  testEligibility: TSD_CP010_STUDIO_CANDIDATE_PACKAGE.testEligibility,
  publiclyPublishable: TSD_CP010_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable,
}, null, 2));
