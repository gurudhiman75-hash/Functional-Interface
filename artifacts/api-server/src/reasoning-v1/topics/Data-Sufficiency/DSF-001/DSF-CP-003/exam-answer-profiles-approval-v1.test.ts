import { DSF_CP001_FREEZE_AUTHORITY } from "../DSF-CP-001/cp001-freeze-authority.ts";
import { DSF_CP002_QUESTION_STUDIO_PACKAGE } from "../DSF-CP-002/question-studio-integration-v1.ts";
import {
  DSF_CP003_ANSWER_PROFILES,
  DSF_CP003_EXAM_PROFILE_AUTHORITY,
} from "./exam-answer-profiles-v1.ts";
import {
  DSF_CP003_APPROVED_EXAM_PROFILE_IDS,
  DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL,
} from "./exam-answer-profiles-approval-v1.ts";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const approval = DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL;
assert(approval.status === "PRODUCT_OWNER_APPROVED", "CP-003 profile review approval is not recorded");
assert(approval.permanentQlId === "DSF-QL-001", "Approval changed permanent QL identity");
assert(approval.nextAvailableQlId === "DSF-QL-002", "Approval consumed next permanent QL");
assert(DSF_CP001_FREEZE_AUTHORITY.status === "FROZEN", "CP-001 source runtime is no longer frozen");
assert(approval.sourceFreezeAuthority === DSF_CP001_FREEZE_AUTHORITY.authorityId, "Approval is not pinned to CP-001 freeze authority");
assert(approval.questionStudioAuthority === DSF_CP002_QUESTION_STUDIO_PACKAGE.integrationAuthority, "Approval is not pinned to CP-002 Question Studio authority");
assert(approval.profileDeliveryAuthority === DSF_CP003_EXAM_PROFILE_AUTHORITY, "Approval is not pinned to CP-003 profile delivery authority");
assert(approval.reviewedDelivery.questionCount === 50, "Approved CP-003 review pack size changed");
assert(Object.values(approval.reviewedDelivery.profileCounts).reduce((sum, count) => sum + count, 0) === 50, "Profile counts do not sum to 50");
assert(Object.values(approval.reviewedDelivery.domainCounts).reduce((sum, count) => sum + count, 0) === 50, "Domain counts do not sum to 50");
assert(Object.values(approval.reviewedDelivery.canonicalClassCounts).reduce((sum, count) => sum + count, 0) === 50, "Class counts do not sum to 50");
assert(Object.values(approval.reviewedDelivery.solveModeCounts).reduce((sum, count) => sum + count, 0) === 50, "Solve-mode counts do not sum to 50");
assert(Object.keys(approval.reviewedDelivery.solveModeCounts).length === 8, "Approval does not cover all 8 solve modes");
assert(DSF_CP003_APPROVED_EXAM_PROFILE_IDS.length === 4, "Expected exactly four approved exam-specific profiles");
assert(approval.evidenceBoundary.approvedProfileDefinitionCount === 4, "Approved profile definitions are incomplete");

for (const profileId of DSF_CP003_APPROVED_EXAM_PROFILE_IDS) {
  const profile = DSF_CP003_ANSWER_PROFILES.find((entry) => entry.id === profileId);
  assert(profile, `Approved profile ${profileId} is missing from CP-003 runtime`);
  assert(profile.enabledInQuestionStudio, `${profileId} is not enabled in Question Studio`);
  assert(!profile.studentPublicationEligible, `${profileId} improperly unlocked student publication`);
}

for (const profile of DSF_CP003_ANSWER_PROFILES.filter((entry) => entry.examFamily === "SSC")) {
  assert(profile.optionCount === 4, `${profile.id} must remain four-option`);
  assert(profile.omittedSemanticClasses.includes("EACH_STATEMENT_ALONE"), `${profile.id} lost SSC eligibility restriction`);
  assert(!profile.representedSemanticClasses.includes("EACH_STATEMENT_ALONE"), `${profile.id} illegally represents EACH_STATEMENT_ALONE`);
}

assert(approval.approvalScope.bankingProfilesApproved, "Banking profiles were not approved");
assert(approval.approvalScope.sscProfilesApproved, "SSC profiles were not approved");
assert(!approval.approvalScope.punjabSpecificProfileApproved, "Punjab profile was approved without sufficient evidence");
assert(approval.approvalScope.sscUnrepresentableClassRemappingForbidden, "SSC semantic remapping guard was lost");
assert(!approval.approvalScope.hindiApproved && !approval.approvalScope.punjabiApproved, "Unreviewed language was approved");
assert(approval.evidenceBoundary.productApprovalDoesNotUpgradeSourceEvidenceLevel, "Product approval improperly upgrades source evidence");
assert(approval.lifecycleAfterApproval.questionStudioDiscoverable, "Question Studio should remain discoverable");
assert(!approval.lifecycleAfterApproval.questionBankWritable, "Approval must not unlock Question Bank writes");
assert(!approval.lifecycleAfterApproval.testEligible, "Approval must not unlock scored tests");
assert(!approval.lifecycleAfterApproval.mockTestEligible, "Approval must not unlock mock tests");
assert(!approval.lifecycleAfterApproval.publiclyPublishable, "Approval must not unlock public publication");

console.log(JSON.stringify({
  status: "PASS_DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL",
  authorityId: approval.authorityId,
  approvedOn: approval.approvedOn,
  reviewPackId: approval.reviewedDelivery.reviewPackId,
  questions: approval.reviewedDelivery.questionCount,
  approvedProfiles: approval.reviewedDelivery.approvedProfileIds,
  profileCounts: approval.reviewedDelivery.profileCounts,
  domains: approval.reviewedDelivery.domainCounts,
  classes: approval.reviewedDelivery.canonicalClassCounts,
  solveModes: Object.keys(approval.reviewedDelivery.solveModeCounts).length,
  punjabSpecificProfileApproved: approval.approvalScope.punjabSpecificProfileApproved,
  downstreamLocked: true,
  nextGate: approval.nextGate,
}, null, 2));
