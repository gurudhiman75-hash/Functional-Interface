import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { SPATIAL_FGC_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 as approval } from "../foundation/spatial/spatial-fgc-question-studio-product-owner-approval-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(approval.approvalId === "SPA-FGC-001-QUESTION-STUDIO-PRODUCT-OWNER-APPROVAL-V1", "approval id drifted");
assert(approval.chapterCode === "FGC-001", "chapter drifted");
assert(approval.packageId === "SPA-001", "package drifted");
assert(approval.pullRequestNumber === 861, "PR number drifted");
assert(approval.approvedIntegrationHead === "315ba2ef26e4615bd891a75374d85557150345c8", "approved reviewed head drifted");
assert(approval.approvedOperatorReviewId === "SPA-FGC-001-QUESTION-STUDIO-OPERATOR-REVIEW-V1", "operator review authority drifted");
assert(approval.permanentQlRange === "SPA-QL-031..SPA-QL-034", "QL scope drifted");
assert(JSON.stringify(approval.approvedLanguages) === JSON.stringify(["en", "hi", "pa"]), "language scope drifted");
assert(approval.approvalSource === "EXPLICIT_PRODUCT_OWNER_APPROVAL_IN_PROJECT_CHAT", "approval source drifted");
assert(approval.productOwnerVerdict === "APPROVED", "product-owner approval missing");
assert(approval.reviewedEvidence.finalExactHeadCi.result === "SUCCESS", "approved exact-head CI was not successful");
assert(approval.reviewedEvidence.finalExactHeadCi.workflowRunId === 32040861339, "approved CI run drifted");
assert(approval.reviewedEvidence.finalExactHeadCi.artifactId === 9291930499, "approved evidence artifact drifted");
assert(approval.governance.productOwnerApprovalGranted === true, "product-owner approval not recorded");
assert(approval.governance.questionStudioIntegrationApproved === true, "Question Studio integration approval missing");
assert(approval.governance.reviewedLearnerSurfaceApproved === true, "reviewed learner surface approval missing");
assert(approval.governance.futureGeneratedItemsAutomaticallyApproved === false, "future generated items must not be auto-approved");
assert(approval.governance.manualGeneratedItemApprovalStillRequired === true, "manual generated-item approval must remain required");
assert(approval.governance.mergeAuthorizedByThisApproval === false, "chat approval must not silently authorize merge");
assert(approval.governance.deploymentAuthorizedByThisApproval === false, "chat approval must not silently authorize deployment");
assert(approval.governance.automaticStudentPublicationAuthorized === false, "automatic student publication must remain disabled");
assert(approval.nextGate === "STACKED_PR_MERGE_SEQUENCE_WHEN_EXPLICITLY_AUTHORIZED", "next gate drifted");

const evidence = {
  status: "PASS_SPA_FGC_001_PRODUCT_OWNER_QUESTION_STUDIO_APPROVAL_V1",
  approvalId: approval.approvalId,
  approvedIntegrationHead: approval.approvedIntegrationHead,
  approvedOperatorReviewId: approval.approvedOperatorReviewId,
  permanentQlRange: approval.permanentQlRange,
  languages: approval.approvedLanguages,
  approvalSource: approval.approvalSource,
  approvalRecordedAt: approval.approvalRecordedAt,
  productOwnerVerdict: approval.productOwnerVerdict,
  governance: approval.governance,
  nextGate: approval.nextGate,
};

const outDir = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "spa-fgc-question-studio-product-owner-approval-v1-evidence.json"), JSON.stringify(evidence, null, 2) + "\n", "utf8");
console.log(JSON.stringify(evidence, null, 2));
