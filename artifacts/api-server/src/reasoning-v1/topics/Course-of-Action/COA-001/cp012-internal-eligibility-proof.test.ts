import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";
import {
  COA_CP008_EITHER_AUTHORITIES,
  COA_CP008_THREE_ACTION_AUTHORITIES,
} from "./cp008-profile-authorities.ts";
import { COA_CURRENT_ENGLISH_AUTHORITIES } from "./english-authorities.ts";
import {
  COA_CP011_CHECKPOINT_ID,
  COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
  COA_CP011_QUESTION_STUDIO_PACKAGE,
  generateCoaCp011QuestionStudioBatch,
} from "./cp011-final-editorial-diversity.ts";
import {
  COA_CP012_CHECKPOINT_ID,
  COA_CP012_ELIGIBILITY_AUTHORITY,
  COA_CP012_ELIGIBILITY_CANDIDATE_PACKAGE,
  COA_CP012_ELIGIBILITY_EVALUATION,
  COA_CP012_STATUS,
  assertCoaCp012LearnerContentIdentity,
  generateCoaCp012EligibilityCandidateBatch,
  getCoaCp012CandidateSafeSemanticCapacity,
  isCoaCp012EligibilityCandidateRequest,
} from "./cp012-internal-eligibility-candidate.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(COA_CP012_CHECKPOINT_ID === "COA-CP-012", "CP012 checkpoint drift");
assert(COA_CP012_STATUS === "TECHNICALLY_QUALIFIED_AWAITING_PRODUCT_OWNER_APPROVAL", "CP012 status drift");
assert(COA_CP012_ELIGIBILITY_EVALUATION.technicalQualificationPassed === true, "technical qualification marker drift");
assert(COA_CP012_ELIGIBILITY_EVALUATION.recommendedInternalQuestionBankEligibility === true, "Question Bank recommendation missing");
assert(COA_CP012_ELIGIBILITY_EVALUATION.recommendedInternalTestEligibility === true, "test recommendation missing");
assert(COA_CP012_ELIGIBILITY_EVALUATION.recommendedInternalMockEligibility === true, "mock recommendation missing");
assert(COA_CP012_ELIGIBILITY_EVALUATION.currentInternalQuestionBankEligibilityAuthorized === false, "Question Bank activated before approval");
assert(COA_CP012_ELIGIBILITY_EVALUATION.currentInternalTestEligibilityAuthorized === false, "test eligibility activated before approval");
assert(COA_CP012_ELIGIBILITY_EVALUATION.currentInternalMockEligibilityAuthorized === false, "mock eligibility activated before approval");
assert(COA_CP012_ELIGIBILITY_EVALUATION.publicReleaseAuthorized === false, "public release opened");
assert(COA_CP012_ELIGIBILITY_EVALUATION.studentDeliveryAuthorized === false, "student delivery opened");

assert(COA_CURRENT_ENGLISH_AUTHORITIES.length === 120, "ordinary English authority count drift");
assert(COA_CURRENT_ENGLISH_AUTHORITIES.filter((x) => x.qlId !== "COA-QL-007").length === 118, "active ordinary authority count drift");
assert(COA_CP008_EITHER_AUTHORITIES.length === 4, "Either authority count drift");
assert(COA_CP008_THREE_ACTION_AUTHORITIES.length === 6, "three-action authority count drift");

assert(isCoaCp012EligibilityCandidateRequest({ cpId: "COA-CP-012" }), "explicit CP012 candidate request not recognized");
assert(!isCoaCp012EligibilityCandidateRequest({ packageId: "COA-001" }), "CP012 candidate became implicit current runtime");
assert(!isCoaCp012EligibilityCandidateRequest({ cpId: "COA-CP-011" }), "CP011 incorrectly treated as CP012 candidate");

const cases = [
  { packageId: "COA-001", cpId: "COA-CP-012", language: "en", count: 20, seed: "CP012-EN-DEFAULT" },
  { packageId: "COA-001", cpId: "COA-CP-012", language: "hi", canonicalProblemId: "COA-QL-003", count: 12, seed: "CP012-HI-QL003" },
  { packageId: "COA-001", cpId: "COA-CP-012", language: "pa", canonicalProblemId: "COA-QL-009", count: 12, seed: "CP012-PA-QL009" },
  { packageId: "COA-001", cpId: "COA-CP-012", language: "en", patternId: "TWO_ACTION_FIVE_CODE", count: 20, seed: "CP012-FIVE" },
  { packageId: "COA-001", cpId: "COA-CP-012", language: "hi", patternId: "THREE_ACTION_COMBINATION", count: 6, seed: "CP012-THREE" },
  { packageId: "COA-001", cpId: "COA-CP-012", language: "pa", difficulty: "Hard", count: 20, seed: "CP012-HARD" },
] as const;

for (const input of cases) {
  const sourceInput = { ...input, cpId: COA_CP011_CHECKPOINT_ID };
  const sourceCapacity = getCoaCp012CandidateSafeSemanticCapacity(input);
  assert(sourceCapacity >= input.count, `candidate case exceeds frozen semantic capacity: ${JSON.stringify(input)}`);

  const source = await generateCoaCp011QuestionStudioBatch(sourceInput);
  const candidate = await generateCoaCp012EligibilityCandidateBatch(input);
  const replay = await generateCoaCp012EligibilityCandidateBatch(input);

  assert(JSON.stringify(candidate) === JSON.stringify(replay), `CP012 candidate replay drift: ${JSON.stringify(input)}`);
  assert(candidate.questions.length === source.questions.length, "CP012 candidate question count drift");
  assert(candidate.checkpointId === COA_CP012_CHECKPOINT_ID, "CP012 candidate checkpoint missing");
  assert(candidate.authority === COA_CP012_ELIGIBILITY_AUTHORITY, "CP012 candidate authority drift");

  for (let index = 0; index < source.questions.length; index += 1) {
    const sourceQuestion = source.questions[index] as Readonly<Record<string, any>>;
    const candidateQuestion = candidate.questions[index] as Readonly<Record<string, any>>;
    assertCoaCp012LearnerContentIdentity(sourceQuestion, candidateQuestion);

    assert(candidateQuestion.checkpointId === COA_CP012_CHECKPOINT_ID, "candidate question checkpoint drift");
    assert(candidateQuestion.sourceFrozenCheckpointId === COA_CP011_CHECKPOINT_ID, "candidate lost CP011 source checkpoint");
    assert(candidateQuestion.sourceQuestionStudioAuthority === COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY, "candidate lost CP011 source authority");
    assert(candidateQuestion.eligibilityEvaluationAuthority === COA_CP012_ELIGIBILITY_AUTHORITY, "candidate eligibility authority drift");
    assert(candidateQuestion.eligibilityEvaluationStatus === COA_CP012_STATUS, "candidate eligibility status drift");

    assert(candidateQuestion.reviewOnly === true, "CP012 candidate left review-only before approval");
    assert(candidateQuestion.manualApprovalRequired === true, "CP012 candidate bypassed product-owner approval");
    assert(candidateQuestion.persistenceAllowed === false, "CP012 candidate enabled canonical persistence before approval");
    assert(candidateQuestion.questionBankWritable === false, "CP012 candidate enabled Question Bank before approval");
    assert(candidateQuestion.testEligible === false, "CP012 candidate enabled test eligibility before approval");
    assert(candidateQuestion.mockTestEligible === false, "CP012 candidate enabled mock eligibility before approval");
    assert(candidateQuestion.publiclyPublishable === false, "CP012 candidate opened public publication");
    assert(candidateQuestion.publicReleaseAuthorized === false, "CP012 candidate opened public release");
    assert(candidateQuestion.studentDeliveryAuthorized === false, "CP012 candidate opened student delivery");
    assert(candidateQuestion.automaticStudentPublication === false, "CP012 candidate opened automatic publication");
    assert(candidateQuestion.learnerRelease === "LOCKED_PENDING_CP012_APPROVAL", "CP012 candidate learner release drift");

    assert(sourceQuestion.checkpointId === COA_CP011_CHECKPOINT_ID, "CP011 source checkpoint was mutated");
    assert(sourceQuestion.currentQuestionStudioAuthority === COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY, "CP011 source authority was mutated");
    assert(sourceQuestion.questionBankWritable === false, "CP011 source lifecycle unexpectedly opened");
  }

  assert(candidate.generationContext.questionBankWritable === false, "candidate context opened Question Bank");
  assert(candidate.generationContext.testEligible === false, "candidate context opened tests");
  assert(candidate.generationContext.mockTestEligible === false, "candidate context opened mocks");
  assert(candidate.generationContext.publiclyPublishable === false, "candidate context opened public publication");
  assert(candidate.generationContext.publicReleaseAuthorized === false, "candidate context opened public release");
}

assert(COA_CP012_ELIGIBILITY_CANDIDATE_PACKAGE.currentQuestionStudioAuthority === COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
  "CP012 candidate replaced current Question Studio authority before approval");
assert(COA_CP012_ELIGIBILITY_CANDIDATE_PACKAGE.questionBankWritable === false, "candidate package opened Question Bank");
assert(COA_CP012_ELIGIBILITY_CANDIDATE_PACKAGE.testEligible === false, "candidate package opened tests");
assert(COA_CP012_ELIGIBILITY_CANDIDATE_PACKAGE.mockTestEligible === false, "candidate package opened mocks");
assert(COA_CP012_ELIGIBILITY_CANDIDATE_PACKAGE.publiclyPublishable === false, "candidate package opened public publication");

const livePackage = reasoningV1QuestionStudioAdapter.listPackages().find((pkg) => pkg.packageId === "COA-001") as any;
assert(livePackage, "live reasoning-v1 package missing COA-001");
assert(livePackage.metadata?.currentQuestionStudioAuthority === COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
  "live registry moved off CP011 before CP012 approval");
assert(livePackage.questionBankWritable === false, "live registry opened Question Bank before approval");
assert(livePackage.testEligible === false, "live registry opened tests before approval");
assert(livePackage.mockTestEligible === false, "live registry opened mocks before approval");

assert(COA_CP011_QUESTION_STUDIO_PACKAGE.questionBankWritable === false, "frozen CP011 package lifecycle drift");
assert(COA_CP011_QUESTION_STUDIO_PACKAGE.testEligible === false, "frozen CP011 test lifecycle drift");
assert(COA_CP011_QUESTION_STUDIO_PACKAGE.mockTestEligible === false, "frozen CP011 mock lifecycle drift");

console.log(JSON.stringify({
  chapter: "COA-001",
  checkpoint: COA_CP012_CHECKPOINT_ID,
  status: COA_CP012_STATUS,
  sourceCheckpoint: COA_CP011_CHECKPOINT_ID,
  sourceAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
  contentMutation: false,
  technicalQualificationPassed: true,
  recommendedInternalQuestionBankEligibility: true,
  recommendedInternalTestEligibility: true,
  recommendedInternalMockEligibility: true,
  activatedBeforeApproval: false,
  liveQuestionStudioAuthorityStillCp011: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publicReleaseAuthorized: false,
  studentDeliveryAuthorized: false,
}, null, 2));
