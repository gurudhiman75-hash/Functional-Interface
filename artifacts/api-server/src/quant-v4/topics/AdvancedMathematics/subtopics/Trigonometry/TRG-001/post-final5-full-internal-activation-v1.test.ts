import assert from "node:assert/strict";
import { TRG_001_POST_FINAL5_FREEZE_V1 } from "./post-final5-freeze-v1";
import { TRG_001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1 } from "./post-final5-question-studio-activation-v1";
import { TRG_001_POST_FINAL5_FULL_INTERNAL_ACTIVATION_V1 } from "./post-final5-full-internal-activation-v1";
import {
  generateQuestion,
  listQuestionStudioPackages,
} from "../../../../../../question-studio/shared-generation-engine-trigonometry";

const activation = TRG_001_POST_FINAL5_FULL_INTERNAL_ACTIVATION_V1;

assert.equal(TRG_001_POST_FINAL5_FREEZE_V1.status, "FROZEN");
assert.equal(TRG_001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1.status, "ACTIVE_INTERNAL_QUESTION_STUDIO");
assert.equal(activation.status, "ACTIVE_INTERNAL_FULL");
assert.equal(activation.execution.fullInternalActivationExecuted, true);
assert.equal(activation.execution.questionStudioEnabled, true);
assert.equal(activation.execution.questionBankWritable, true);
assert.equal(activation.execution.testEligible, true);
assert.equal(activation.execution.testBuilderEligible, true);
assert.equal(activation.execution.mockTestEligible, true);
assert.equal(activation.execution.publiclyPublishable, false);
assert.equal(activation.execution.publicReleaseAuthorized, false);
assert.equal(activation.execution.automaticStudentPublication, false);
assert.equal(activation.execution.contentMutationAuthorized, false);

const capability = listQuestionStudioPackages().find((entry: any) => entry.packageId === "TRG-001") as any;
assert.ok(capability, "TRG-001 capability must be discoverable");
assert.equal(capability.questionBankStatus, "WRITABLE");
assert.equal(capability.questionBankWritable, true);
assert.equal(capability.testEligibility, "ELIGIBLE");
assert.equal(capability.testEligible, true);
assert.equal(capability.testBuilderEligible, true);
assert.equal(capability.mockTestEligible, true);
assert.equal(capability.publiclyPublishable, false);
assert.equal(capability.publicReleaseAuthorized, false);
assert.equal(capability.automaticStudentPublication, false);

for (const language of ["en", "hi", "pa"] as const) {
  const result: any = await generateQuestion({
    packageId: "TRG-001",
    questionLanguageId: "TRG-001-QL-093",
    language,
    seed: `trg001-full-internal-activation-${language}`,
    count: 1,
  });

  assert.equal(result.generationContext.questionBankWritable, true);
  assert.equal(result.generationContext.testBuilderEligible, true);
  assert.equal(result.generationContext.mockTestEligible, true);
  assert.equal(result.generationContext.publiclyPublishable, false);
  assert.equal(result.generationContext.publicReleaseAuthorized, false);
  assert.equal(result.generationContext.automaticStudentPublication, false);

  const question = result.questions[0];
  assert.ok(question, `${language}: generated question missing`);
  assert.equal(question.questionBankStatus, "WRITABLE");
  assert.equal(question.questionBankWritable, true);
  assert.equal(question.testEligibility, "ELIGIBLE");
  assert.equal(question.testEligible, true);
  assert.equal(question.testBuilderEligible, true);
  assert.equal(question.mockTestEligible, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.publicReleaseAuthorized, false);
  assert.equal(question.automaticStudentPublication, false);
  assert.equal(question.proceduralLogic.questionBankWritable, true);
  assert.equal(question.proceduralLogic.testBuilderEligible, true);
  assert.equal(question.proceduralLogic.publicReleaseAuthorized, false);
  assert.equal(question.generationMetadata.questionBankWritable, true);
  assert.equal(question.generationMetadata.testBuilderEligible, true);
  assert.equal(question.generationMetadata.publicReleaseAuthorized, false);
}

console.log(JSON.stringify({
  status: "TRG001_POST_FINAL5_FULL_INTERNAL_ACTIVATION_PASS",
  activationVersion: activation.version,
  questionBankWritable: activation.execution.questionBankWritable,
  testBuilderEligible: activation.execution.testBuilderEligible,
  mockTestEligible: activation.execution.mockTestEligible,
  publicReleaseAuthorized: activation.execution.publicReleaseAuthorized,
}, null, 2));
