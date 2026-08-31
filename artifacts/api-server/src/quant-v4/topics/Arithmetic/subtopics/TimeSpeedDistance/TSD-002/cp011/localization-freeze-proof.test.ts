import {
  TSD_CP011_RELEASE_HINDI_REVIEW,
  TSD_CP011_RELEASE_PUNJABI_REVIEW,
} from "./native-review-release";
import {
  TSD_CP011_FROZEN_HINDI_REVIEW,
  TSD_CP011_FROZEN_PUNJABI_REVIEW,
  TSD_CP011_LOCALIZATION_FREEZE_APPROVAL,
} from "./localization-freeze-registry";
import { TSD_CP011_NEXT_PERMANENT_QL, TSD_CP011_PERMANENT_QL_IDS } from "./ql-allocation";
import { TSD_CP011_STUDIO_CANDIDATE_PACKAGE } from "./question-studio-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-011 localization freeze proof failed: ${message}`);
}
function withoutFreezeTag<T extends { readonly editorialStatus: "FROZEN" }>(value: T) {
  const { editorialStatus: _editorialStatus, ...rest } = value;
  return rest;
}
function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `bigint:${item.toString()}` : item);
}

assert(TSD_CP011_LOCALIZATION_FREEZE_APPROVAL.status === "PRODUCT_OWNER_APPROVED_LOCALIZATION_FREEZE", "localization freeze approval status changed");
assert(TSD_CP011_LOCALIZATION_FREEZE_APPROVAL.approvalInstruction === "Go — continue TSD chapter in lifecycle order", "approval instruction changed");
assert(TSD_CP011_LOCALIZATION_FREEZE_APPROVAL.approvedSourceHead === "f50cc416007985ab139dd0d1b28a80003c1619b0", "approved native source head changed");
assert(TSD_CP011_LOCALIZATION_FREEZE_APPROVAL.approvedReviewWorkflowRunId === 33314810827, "approved review run ID changed");
assert(TSD_CP011_LOCALIZATION_FREEZE_APPROVAL.approvedReviewArtifactId === 9733100290, "approved review artifact changed");
assert(TSD_CP011_LOCALIZATION_FREEZE_APPROVAL.ratioPresentation === "STANDARD_A_COLON_B", "native ratio presentation contract changed");
assert(TSD_CP011_PERMANENT_QL_IDS.length === 7, "permanent QL count changed");
assert(TSD_CP011_NEXT_PERMANENT_QL === "TSD-QL-132", "next permanent QL changed");

for (const [locale, frozen, source] of [
  ["hi-IN", TSD_CP011_FROZEN_HINDI_REVIEW, TSD_CP011_RELEASE_HINDI_REVIEW],
  ["pa-IN", TSD_CP011_FROZEN_PUNJABI_REVIEW, TSD_CP011_RELEASE_PUNJABI_REVIEW],
] as const) {
  assert(frozen.length === 168, `${locale}: frozen family count changed`);
  assert(new Set(frozen.map((question) => question.familyId)).size === 168, `${locale}: frozen family IDs are no longer unique`);
  assert(new Set(frozen.map((question) => question.stem)).size === 168, `${locale}: frozen stems are no longer unique`);
  assert(frozen.every((question) => question.editorialStatus === "FROZEN"), `${locale}: frozen row lost FROZEN status`);
  assert(canonicalJson(frozen.map(withoutFreezeTag)) === canonicalJson(source), `${locale}: frozen learner content differs from approved release source`);
  for (const qlId of TSD_CP011_PERMANENT_QL_IDS) {
    assert(frozen.filter((question) => question.qlId === qlId).length === 24, `${locale}/${qlId}: expected 24 frozen families`);
  }
  for (const question of frozen.filter((item) => item.solution.unit === "RATIO")) {
    const ratio = `${question.solution.answer.numerator}:${question.solution.answer.denominator}`;
    assert(question.explanation.conclusion.includes(ratio), `${locale}/${question.familyId}: frozen ratio conclusion lost a:b presentation`);
    assert(question.explanation.steps.some((step) => step.includes(ratio)), `${locale}/${question.familyId}: frozen ratio explanation lost a:b presentation`);
  }
}

assert(!/[A-Za-z]{4,}/.test(TSD_CP011_FROZEN_HINDI_REVIEW.map((question) => question.stem).join("\n")), "Hindi learner stems contain unexpected Latin prose");
assert(!/[A-Za-z]{4,}/.test(TSD_CP011_FROZEN_PUNJABI_REVIEW.map((question) => question.stem).join("\n")), "Punjabi learner stems contain unexpected Latin prose");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus === "NOT_REGISTERED", "content freeze must not register Question Studio");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.routeMounted === false, "content freeze must not mount route");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.persistenceAllowed === false, "content freeze must not enable persistence");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.questionBankWritable === false, "content freeze must not enable bank writes");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.testEligible === false, "content freeze must not enable tests");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable === false, "content freeze must not enable publishing");

console.log("TSD-CP-011 NATIVE LOCALIZATION FREEZE PROOF: PASS");
console.log(JSON.stringify({
  status: TSD_CP011_LOCALIZATION_FREEZE_APPROVAL.status,
  hindiFamilies: TSD_CP011_FROZEN_HINDI_REVIEW.length,
  punjabiFamilies: TSD_CP011_FROZEN_PUNJABI_REVIEW.length,
  ratioPresentation: TSD_CP011_LOCALIZATION_FREEZE_APPROVAL.ratioPresentation,
  questionStudioRegistration: TSD_CP011_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus,
}, null, 2));
