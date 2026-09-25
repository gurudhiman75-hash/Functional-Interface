import assert from "node:assert/strict";

import { DIR_001_CHECKPOINTS } from "./DIR-001-CHAPTER-MANIFEST";
import { DIR_001_FINAL_AUDIT_CLOSURE_V1 } from "./DIR-001-FINAL-CLOSURE";
import { DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1 } from "./DIR-001-MULTILINGUAL-FREEZE";
import { DIR_001_QLS } from "./chapter-registry";
import {
  DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  generateDir001QuestionStudioBatch,
} from "./dir-001-question-studio-integration";

assert.equal(DIR_001_FINAL_AUDIT_CLOSURE_V1.auditStatus, "FINAL_AUDIT_COMPLETE");
assert.equal(DIR_001_FINAL_AUDIT_CLOSURE_V1.closureStatus, "CLOSURE_CANDIDATE");
assert.equal(DIR_001_FINAL_AUDIT_CLOSURE_V1.permanentQlCount, 44);
assert.equal(DIR_001_FINAL_AUDIT_CLOSURE_V1.checkpointCount, 8);
assert.equal(DIR_001_QLS.length, 44);
assert.equal(DIR_001_CHECKPOINTS.length, 8);

for (const gate of [
  "stemAuditComplete",
  "distractorAuditComplete",
  "explanationAuditComplete",
  "localizationAuditComplete",
  "difficultyAuditComplete",
  "diagramAuditComplete",
  "questionStudioIntegrationComplete",
  "multilingualFreezeComplete",
] as const) {
  assert.equal(DIR_001_FINAL_AUDIT_CLOSURE_V1[gate], true, `${gate} must be complete`);
}

assert.equal(
  DIR_001_FINAL_AUDIT_CLOSURE_V1.multilingualFreezeAuthority,
  DIR_001_MULTILINGUAL_FREEZE_AUTHORITY_V1.authorityId,
);
assert.equal(
  DIR_001_FINAL_AUDIT_CLOSURE_V1.questionStudioAuthority,
  DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
);
assert.equal(DIR_001_FINAL_AUDIT_CLOSURE_V1.humanClosureApprovalRequired, true);

const locked = {
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  productionReleaseAuthorized: false,
  productionPromotionApproved: false,
  studentDeliveryAuthorized: false,
} as const;

for (const [field, expected] of Object.entries(locked)) {
  assert.equal(
    (DIR_001_FINAL_AUDIT_CLOSURE_V1 as Record<string, unknown>)[field],
    expected,
    `closure gate ${field} drifted`,
  );
}

assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.questionBankStatus, "NOT_STORED");
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.questionBankWritable, false);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.testEligible, false);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.mockTestEligible, false);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.publiclyPublishable, false);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.productionReleaseAuthorized, false);

for (const language of ["en", "hi", "pa"] as const) {
  const generated = await generateDir001QuestionStudioBatch({
    packageId: "DIR-001",
    language,
    count: 20,
    seed: `dir001-final-closure:${language}`,
  });
  assert.equal(generated.questions.length, 20);
  for (const raw of generated.questions as Array<Record<string, any>>) {
    assert.equal(raw.packageId, "DIR-001");
    assert.equal(raw.reviewOnly, true);
    assert.equal(raw.readOnly, true);
    assert.equal(raw.questionBankWritable, false);
    assert.equal(raw.testEligible, false);
    assert.equal(raw.mockTestEligible, false);
    assert.equal(raw.publiclyPublishable, false);
    assert.equal(raw.automaticStudentPublication, false);
    assert.equal(raw.productionReleaseAuthorized, false);
    assert.equal(raw.validation.solverVerified, true);
    assert.equal(raw.validation.questionDiagramAbsent, true);
  }

  const context = generated.generationContext as Record<string, any>;
  assert.equal(context.questionBankWritable, false);
  assert.equal(context.testEligible, false);
  assert.equal(context.mockTestEligible, false);
  assert.equal(context.publiclyPublishable, false);
  assert.equal(context.automaticStudentPublication, false);
  assert.equal(context.productionReleaseAuthorized, false);
}

console.log(JSON.stringify({
  verdict: "PASS_DIR_001_FINAL_AUDIT_CLOSURE_V1",
  authority: DIR_001_FINAL_AUDIT_CLOSURE_V1.authorityId,
  auditStatus: DIR_001_FINAL_AUDIT_CLOSURE_V1.auditStatus,
  closureStatus: DIR_001_FINAL_AUDIT_CLOSURE_V1.closureStatus,
  permanentQlCount: DIR_001_QLS.length,
  checkpointCount: DIR_001_CHECKPOINTS.length,
  multilingualFrozen: true,
  questionStudioIntegrated: true,
  humanClosureApprovalRequired: true,
  productionPromotionApproved: false,
  downstreamReleaseLocked: true,
}, null, 2));
