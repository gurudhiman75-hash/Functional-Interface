import { COM002_V6_V5_OPERATIONAL_FREEZE, auditCom002V6V5OperationalFreeze } from "./com002-v6-v5-operational-freeze";

const audit = auditCom002V6V5OperationalFreeze();
if (!audit.valid) throw new Error(`COM-002 V6/V5 operational freeze invalid: ${audit.issues.join(",")}`);

const freeze = COM002_V6_V5_OPERATIONAL_FREEZE;
if (freeze.status !== "FROZEN_APPROVED_CONTENT_AWAITING_STANDARD_REVIEW_ONLY_ADAPTER_AUDIT") {
  throw new Error(`unexpected freeze status ${freeze.status}`);
}
if (!freeze.lifecycle.englishV6Frozen || !freeze.lifecycle.localizationV5Frozen) {
  throw new Error("English V6 and Localization V5 must both be frozen");
}
if (freeze.frozenScope.englishCorpusQuestions !== 520 || freeze.frozenScope.hindiCorpusQuestions !== 520 || freeze.frozenScope.punjabiCorpusQuestions !== 520) {
  throw new Error("frozen corpus counts must be 520 per language");
}
if (freeze.frozenScope.approvedLocalizedReviewSurfaces !== 26) {
  throw new Error("approved localized review surface count must be 26");
}
if (freeze.fingerprintExecution.workflowRunId !== 33315236675 || freeze.fingerprintExecution.workflowJobId !== 99267308124) {
  throw new Error("fingerprint execution evidence mismatch");
}
if (freeze.fingerprintExecution.artifactId !== 9733227660) {
  throw new Error("fingerprint manifest artifact mismatch");
}
if (freeze.lifecycle.questionStudioDiscoverable || freeze.lifecycle.questionStudioRegistrationAllowed) {
  throw new Error("Question Studio remains blocked until adapter audit");
}
if (freeze.lifecycle.reviewRunPersistenceAllowed || freeze.lifecycle.canonicalQuestionPersistenceAllowed) {
  throw new Error("persistence remains blocked until standard lifecycle registration");
}
if (freeze.lifecycle.questionBankWritable || freeze.lifecycle.testEligible || freeze.lifecycle.mockTestEligible || freeze.lifecycle.publiclyPublishable) {
  throw new Error("downstream delivery rights must remain blocked");
}

console.log("[COM002-V6-V5-OPERATIONAL-FREEZE] PASS englishFrozen=true localizationFrozen=true questionStudio=false downstream=false");
