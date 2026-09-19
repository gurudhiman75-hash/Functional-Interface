import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";
import {
  COA_CP011_CHECKPOINT_ID,
  COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
  generateCoaCp011QuestionStudioBatch,
} from "./cp011-final-editorial-diversity.ts";
import {
  COA_CP012_APPROVED_CHECKPOINT_ID,
  COA_CP012_APPROVAL_AUTHORITY,
  COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE,
  COA_CP012_LEARNER_RELEASE,
  COA_CP012_PRODUCT_OWNER_APPROVAL,
  COA_CP012_QUESTION_STUDIO_AUTHORITY,
  assertCoaCp012ApprovedContentIdentity,
  generateCoaCp012ApprovedQuestionStudioBatch,
  getCoaCp012ApprovedSafeSemanticCapacity,
} from "./cp012-internal-eligibility-approved.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(COA_CP012_APPROVED_CHECKPOINT_ID === "COA-CP-012", "CP012 checkpoint drift");
assert(COA_CP012_PRODUCT_OWNER_APPROVAL.approvalStatement === "Approved", "approval statement drift");
assert(COA_CP012_PRODUCT_OWNER_APPROVAL.approvedSourceCheckpointId === COA_CP011_CHECKPOINT_ID, "approval source checkpoint drift");
assert(COA_CP012_PRODUCT_OWNER_APPROVAL.approvedSourceQuestionStudioAuthority === COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY, "approval source authority drift");
assert(COA_CP012_PRODUCT_OWNER_APPROVAL.contentMutationAllowed === false, "approval unexpectedly allows content mutation");
assert(COA_CP012_PRODUCT_OWNER_APPROVAL.internalQuestionBankEligibilityAuthorized === true, "Question Bank authorization missing");
assert(COA_CP012_PRODUCT_OWNER_APPROVAL.internalTestEligibilityAuthorized === true, "test authorization missing");
assert(COA_CP012_PRODUCT_OWNER_APPROVAL.internalMockEligibilityAuthorized === true, "mock authorization missing");
assert(COA_CP012_PRODUCT_OWNER_APPROVAL.publicReleaseAuthorized === false, "public release was authorized");
assert(COA_CP012_PRODUCT_OWNER_APPROVAL.studentDeliveryAuthorized === false, "student delivery was authorized");
assert(COA_CP012_PRODUCT_OWNER_APPROVAL.automaticStudentPublication === false, "automatic publication was authorized");

assert(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.currentQuestionStudioAuthority === COA_CP012_QUESTION_STUDIO_AUTHORITY, "package current authority drift");
assert(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.reviewOnly === false, "approved package remained review-only");
assert(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.manualApprovalRequired === false, "manual approval still required after explicit approval");
assert(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.persistenceAllowed === true, "canonical persistence not enabled");
assert(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.questionBankStatus === "WRITABLE", "Question Bank status drift");
assert(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.questionBankWritable === true, "Question Bank not writable");
assert(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.testEligibility === "ELIGIBLE", "test eligibility status drift");
assert(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.testEligible === true, "tests not eligible");
assert(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.mockTestEligible === true, "mocks not eligible");
assert(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.publiclyPublishable === false, "public publication opened");
assert(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.productionReleaseAuthorized === false, "production release opened");

const cases = [
  { packageId: "COA-001", language: "en", count: 20, seed: "CP012-APPROVED-EN" },
  { packageId: "COA-001", language: "hi", canonicalProblemId: "COA-QL-003", count: 12, seed: "CP012-APPROVED-HI" },
  { packageId: "COA-001", language: "pa", canonicalProblemId: "COA-QL-009", count: 12, seed: "CP012-APPROVED-PA" },
  { packageId: "COA-001", language: "en", patternId: "TWO_ACTION_FIVE_CODE", count: 20, seed: "CP012-APPROVED-FIVE" },
  { packageId: "COA-001", language: "hi", patternId: "THREE_ACTION_COMBINATION", count: 6, seed: "CP012-APPROVED-THREE" },
  { packageId: "COA-001", language: "pa", difficulty: "Hard", count: 20, seed: "CP012-APPROVED-HARD" },
] as const;

for (const input of cases) {
  const capacity = getCoaCp012ApprovedSafeSemanticCapacity(input);
  assert(capacity >= input.count, `approved CP012 case exceeds safe capacity: ${JSON.stringify(input)}`);

  const source = await generateCoaCp011QuestionStudioBatch({ ...input, cpId: COA_CP011_CHECKPOINT_ID });
  const approved = await generateCoaCp012ApprovedQuestionStudioBatch(input);
  const replay = await generateCoaCp012ApprovedQuestionStudioBatch(input);

  assert(JSON.stringify(approved) === JSON.stringify(replay), `approved CP012 replay drift: ${JSON.stringify(input)}`);
  assert(approved.questions.length === source.questions.length, "approved CP012 question count drift");
  assert(approved.checkpointId === COA_CP012_APPROVED_CHECKPOINT_ID, "approved CP012 checkpoint missing");
  assert(approved.authority === COA_CP012_QUESTION_STUDIO_AUTHORITY, "approved CP012 authority drift");

  for (let index = 0; index < source.questions.length; index += 1) {
    const sourceQuestion = source.questions[index] as Readonly<Record<string, any>>;
    const approvedQuestion = approved.questions[index] as Readonly<Record<string, any>>;
    assertCoaCp012ApprovedContentIdentity(sourceQuestion, approvedQuestion);

    assert(approvedQuestion.checkpointId === COA_CP012_APPROVED_CHECKPOINT_ID, "question checkpoint drift");
    assert(approvedQuestion.sourceFrozenCheckpointId === COA_CP011_CHECKPOINT_ID, "source checkpoint lost");
    assert(approvedQuestion.sourceQuestionStudioAuthority === COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY, "source authority lost");
    assert(approvedQuestion.currentQuestionStudioAuthority === COA_CP012_QUESTION_STUDIO_AUTHORITY, "current authority drift");
    assert(approvedQuestion.approvalAuthority === COA_CP012_APPROVAL_AUTHORITY, "approval authority drift");
    assert(approvedQuestion.reviewOnly === false, "approved question remained review-only");
    assert(approvedQuestion.manualApprovalRequired === false, "approved question still requires approval");
    assert(approvedQuestion.persistenceAllowed === true, "persistence not enabled");
    assert(approvedQuestion.canonicalQuestionPersistenceAllowed === true, "canonical persistence not enabled");
    assert(approvedQuestion.questionBankWritable === true, "Question Bank not writable");
    assert(approvedQuestion.testEligible === true, "test eligibility not enabled");
    assert(approvedQuestion.mockTestEligible === true, "mock eligibility not enabled");
    assert(approvedQuestion.publiclyPublishable === false, "public publication opened");
    assert(approvedQuestion.publicReleaseAuthorized === false, "public release opened");
    assert(approvedQuestion.studentDeliveryAuthorized === false, "student delivery opened");
    assert(approvedQuestion.automaticStudentPublication === false, "automatic publication opened");
    assert(approvedQuestion.productionReleased === false, "production release opened");
    assert(approvedQuestion.learnerRelease === COA_CP012_LEARNER_RELEASE, "internal learner lifecycle marker drift");

    assert(sourceQuestion.checkpointId === COA_CP011_CHECKPOINT_ID, "CP011 source mutated");
    assert(sourceQuestion.questionBankWritable === false, "CP011 source lifecycle mutated");
  }

  assert(approved.generationContext.questionBankWritable === true, "approved context did not enable Question Bank");
  assert(approved.generationContext.testEligible === true, "approved context did not enable tests");
  assert(approved.generationContext.mockTestEligible === true, "approved context did not enable mocks");
  assert(approved.generationContext.publiclyPublishable === false, "approved context opened public publication");
  assert(approved.generationContext.publicReleaseAuthorized === false, "approved context opened public release");
  assert(approved.generationContext.studentDeliveryAuthorized === false, "approved context opened student delivery");
}

const livePackage = reasoningV1QuestionStudioAdapter.listPackages().find((pkg) => pkg.packageId === "COA-001") as any;
assert(livePackage, "live reasoning-v1 package missing COA-001");
assert(livePackage.currentQuestionStudioAuthority === COA_CP012_QUESTION_STUDIO_AUTHORITY, "live registry did not promote CP012");
assert(livePackage.questionBankWritable === true, "live registry did not enable Question Bank");
assert(livePackage.testEligible === true, "live registry did not enable tests");
assert(livePackage.mockTestEligible === true, "live registry did not enable mocks");
assert(livePackage.publiclyPublishable === false, "live registry opened public publication");
assert(livePackage.productionReleaseAuthorized === false, "live registry opened production release");

const liveBatch = await reasoningV1QuestionStudioAdapter.generate({
  packageId: "COA-001",
  language: "pa",
  difficulty: "Medium",
  count: 3,
  seed: "CP012-LIVE-ADAPTER",
});
for (const question of liveBatch.questions as readonly Record<string, any>[]) {
  assert(question.checkpointId === COA_CP012_APPROVED_CHECKPOINT_ID, "live adapter did not emit CP012");
  assert(question.currentQuestionStudioAuthority === COA_CP012_QUESTION_STUDIO_AUTHORITY, "live adapter authority drift");
  assert(question.questionBankWritable === true, "live adapter Question Bank flag drift");
  assert(question.testEligible === true, "live adapter test flag drift");
  assert(question.mockTestEligible === true, "live adapter mock flag drift");
  assert(question.publiclyPublishable === false, "live adapter opened public publication");
}

console.log(JSON.stringify({
  chapter: "COA-001",
  checkpoint: COA_CP012_APPROVED_CHECKPOINT_ID,
  status: "APPROVED_INTERNAL_ELIGIBILITY",
  sourceCheckpoint: COA_CP011_CHECKPOINT_ID,
  contentMutation: false,
  currentQuestionStudioAuthority: COA_CP012_QUESTION_STUDIO_AUTHORITY,
  questionBankWritable: true,
  testEligible: true,
  mockTestEligible: true,
  publiclyPublishable: false,
  publicReleaseAuthorized: false,
  studentDeliveryAuthorized: false,
  automaticStudentPublication: false,
}, null, 2));
