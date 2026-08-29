import { DSF_CP001_FREEZE_AUTHORITY } from "../DSF-CP-001/cp001-freeze-authority.ts";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import { DSF_CP002_ENGLISH_REVIEW_APPROVAL } from "./english-review-approval-v1.ts";
import { DSF_CP002_QUESTION_STUDIO_PACKAGE } from "./question-studio-integration-v1.ts";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const approval = DSF_CP002_ENGLISH_REVIEW_APPROVAL;
assert(approval.status === "PRODUCT_OWNER_APPROVED", "English review approval is not recorded");
assert(approval.permanentQlId === "DSF-QL-001", "Approval changed permanent QL identity");
assert(approval.nextAvailableQlId === "DSF-QL-002", "Approval consumed next permanent QL");
assert(DSF_CP001_FREEZE_AUTHORITY.status === "FROZEN", "CP-001 source runtime is no longer frozen");
assert(approval.sourceFreezeAuthority === DSF_CP001_FREEZE_AUTHORITY.authorityId, "Approval is not pinned to CP-001 freeze authority");
assert(approval.questionStudioAuthority === DSF_CP002_QUESTION_STUDIO_PACKAGE.integrationAuthority, "Approval is not pinned to CP-002 Studio authority");
assert(approval.reviewedDelivery.questionCount === 40, "Approved review pack size changed");
assert(Object.values(approval.reviewedDelivery.domainCounts).every((count) => count === 10), "Approved review pack lost 10-per-domain balance");
assert(Object.values(approval.reviewedDelivery.canonicalClassCounts).every((count) => count === 8), "Approved review pack lost 8-per-class balance");
assert(Object.keys(approval.reviewedDelivery.canonicalClassCounts).length === SUFFICIENCY_CLASSES.length, "Approval does not cover all canonical classes");
assert(Object.keys(approval.reviewedDelivery.solveModeCounts).length === 8, "Approval does not cover all 8 solve modes");
assert(approval.reviewedDelivery.answerProfile === "GENERIC_DS_STANDARD_5_EN", "Approval silently changed answer profile");
assert(!approval.approvalScope.examSpecificAnswerProfilesApproved, "Exam-specific answer profiles were approved without review");
assert(!approval.approvalScope.hindiApproved && !approval.approvalScope.punjabiApproved, "Unreviewed language was approved");
assert(approval.lifecycleAfterApproval.questionStudioDiscoverable, "Question Studio should remain discoverable");
assert(!approval.lifecycleAfterApproval.questionBankWritable, "Approval must not unlock Question Bank writes");
assert(!approval.lifecycleAfterApproval.testEligible, "Approval must not unlock scored tests");
assert(!approval.lifecycleAfterApproval.mockTestEligible, "Approval must not unlock mock tests");
assert(!approval.lifecycleAfterApproval.publiclyPublishable, "Approval must not unlock public publication");

console.log(JSON.stringify({
  status: "PASS_DSF_CP002_ENGLISH_REVIEW_APPROVAL",
  authorityId: approval.authorityId,
  approvedOn: approval.approvedOn,
  reviewPackId: approval.reviewedDelivery.reviewPackId,
  questions: approval.reviewedDelivery.questionCount,
  domains: approval.reviewedDelivery.domainCounts,
  classes: approval.reviewedDelivery.canonicalClassCounts,
  solveModes: Object.keys(approval.reviewedDelivery.solveModeCounts).length,
  answerProfile: approval.reviewedDelivery.answerProfile,
  downstreamLocked: true,
  nextGate: approval.nextGate,
}, null, 2));
