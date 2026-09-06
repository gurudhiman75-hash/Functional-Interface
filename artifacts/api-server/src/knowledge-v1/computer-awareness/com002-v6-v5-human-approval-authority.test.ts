import { COM002_V6_V5_HUMAN_APPROVAL_AUTHORITY } from "./com002-v6-v5-human-approval-authority";
import { COM002_LOCALIZATION_VERSION_V5 } from "./com002-localization-v5";
import { COM002_ENGLISH_GENERATOR_VERSION_V6 } from "./com002-review-synthesis-v6";

const authority = COM002_V6_V5_HUMAN_APPROVAL_AUTHORITY;
if (authority.chapterId !== "COM-002") throw new Error("COM-002 approval authority chapter mismatch");
if (!authority.approval.explicitApprovalVerified) throw new Error("V6/V5 explicit approval must be recorded");
if (authority.approval.approvalSource !== "PRODUCT_OWNER_CHAT_EXPLICIT_APPROVAL") {
  throw new Error("V6/V5 approval source mismatch");
}
if (authority.englishGeneratorVersion !== COM002_ENGLISH_GENERATOR_VERSION_V6) {
  throw new Error("approval authority must bind English V6");
}
if (authority.localizationVersion !== COM002_LOCALIZATION_VERSION_V5) {
  throw new Error("approval authority must bind Localization V5");
}
if (!authority.lifecycle.humanReviewAccepted) throw new Error("human review must be accepted");
if (authority.lifecycle.questionStudioActive) throw new Error("approval alone must not activate Question Studio");
if (authority.lifecycle.questionBankWritable) throw new Error("approval alone must not open Question Bank writes");
if (authority.lifecycle.publiclyPublishable) throw new Error("approval alone must not allow public delivery");
if (authority.lifecycle.productionReleaseAuthorized) throw new Error("approval alone must not authorize production release");

console.log("[COM002-V6-V5-HUMAN-APPROVAL] PASS");
