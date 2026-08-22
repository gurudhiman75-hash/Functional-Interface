import {
  DSF_BANK_BOB_2015_ORDER,
  DSF_BANK_STANDARD_ORDER,
  DSF_SSC_CGL_2023_FOUR_ORDER,
  DSF_SSC_CGL_2024_FOUR_ORDER,
} from "../discovery/source-pattern-registry.ts";
import {
  DSF_CP003_ANSWER_PROFILES,
  DSF_CP003_DISABLED_EXAM_FAMILIES,
  DSF_CP003_EXAM_PROFILE_AUTHORITY,
  DSF_CP003_QUESTION_STUDIO_PACKAGE,
  generateDsfExamProfileBatch,
  type DsfExamAnswerProfileId,
} from "./exam-answer-profiles-v1.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertOrder(profileId: DsfExamAnswerProfileId, expected: readonly string[]) {
  const result = generateDsfExamProfileBatch({ answerProfile: profileId, count: 1, seed: `order:${profileId}` });
  const question = result.questions[0]!;
  assert(
    JSON.stringify(question.options.map((option) => option.semanticClass)) === JSON.stringify(expected),
    `${profileId}: rendered semantic order changed`,
  );
  assert(question.options[question.correctIndex]?.semanticClass === question.canonicalAnswer, `${profileId}: correct option lost semantic truth`);
  assert(question.validation.semanticTruthPreserved, `${profileId}: semantic-truth preservation flag missing`);
  assert(question.validation.optionOrderMatchesProfile, `${profileId}: option-order proof flag missing`);
  assert(!question.lifecycle.questionBankWritable, `${profileId}: Question Bank unexpectedly writable`);
  assert(!question.lifecycle.testEligible, `${profileId}: test eligibility unexpectedly opened`);
  assert(!question.lifecycle.publiclyPublishable, `${profileId}: publication unexpectedly opened`);
}

assertOrder("BANKING_STANDARD_5_EN", DSF_BANK_STANDARD_ORDER);
assertOrder("BANKING_BOB_2015_5_EN", DSF_BANK_BOB_2015_ORDER);
assertOrder("SSC_CGL_TIER2_2023_4_EN", DSF_SSC_CGL_2023_FOUR_ORDER);
assertOrder("SSC_CGL_TIER2_2024_4_EN", DSF_SSC_CGL_2024_FOUR_ORDER);

for (const profileId of ["SSC_CGL_TIER2_2023_4_EN", "SSC_CGL_TIER2_2024_4_EN"] as const) {
  const batch = generateDsfExamProfileBatch({ answerProfile: profileId, count: 30, seed: `ssc-eligibility:${profileId}` });
  assert(batch.questions.length === 30, `${profileId}: expected 30 review questions`);
  assert(batch.questions.every((question) => question.options.length === 4), `${profileId}: non-four-option question leaked`);
  assert(
    batch.questions.every((question) => question.canonicalAnswer !== "EACH_STATEMENT_ALONE"),
    `${profileId}: omitted EACH_STATEMENT_ALONE leaked into SSC profile`,
  );
  assert(
    batch.questions.every((question) => question.profileOmittedSemanticClasses.includes("EACH_STATEMENT_ALONE")),
    `${profileId}: omitted-class metadata missing`,
  );

  let rejected = false;
  try {
    generateDsfExamProfileBatch({
      answerProfile: profileId,
      semanticClass: "EACH_STATEMENT_ALONE",
      count: 1,
      seed: "must-reject-each-alone",
    });
  } catch (error) {
    rejected = error instanceof Error && error.message.includes("cannot render EACH_STATEMENT_ALONE");
  }
  assert(rejected, `${profileId}: explicit unrepresentable class was not rejected`);
}

for (const profileId of ["BANKING_STANDARD_5_EN", "BANKING_BOB_2015_5_EN"] as const) {
  const profile = DSF_CP003_ANSWER_PROFILES.find((entry) => entry.id === profileId)!;
  assert(profile.optionCount === 5, `${profileId}: Banking profile must stay five-option`);
  assert(profile.omittedSemanticClasses.length === 0, `${profileId}: Banking profile unexpectedly omits a class`);
  for (const semanticClass of profile.representedSemanticClasses) {
    const result = generateDsfExamProfileBatch({
      answerProfile: profileId,
      semanticClass,
      count: 1,
      seed: `${profileId}:${semanticClass}`,
    });
    assert(result.questions[0]?.canonicalAnswer === semanticClass, `${profileId}: failed to render ${semanticClass}`);
    assert(result.questions[0]?.options.length === 5, `${profileId}: expected five options`);
  }
}

for (const profileId of [
  "GENERIC_DS_STANDARD_5_EN",
  "BANKING_STANDARD_5_EN",
  "BANKING_BOB_2015_5_EN",
  "SSC_CGL_TIER2_2023_4_EN",
  "SSC_CGL_TIER2_2024_4_EN",
] as const) {
  for (const domain of ["NUMBER_SYSTEM", "RATIO_PROPORTION", "PERCENTAGE", "ALGEBRA"] as const) {
    const result = generateDsfExamProfileBatch({ answerProfile: profileId, domain, count: 1, seed: `${profileId}:${domain}` });
    assert(result.questions[0]?.domain === domain, `${profileId}: ${domain} domain filter failed`);
    assert(result.questions[0]?.answerProfile === profileId, `${profileId}: answer profile identity changed`);
    assert(result.questions[0]?.deliveryProfileAuthority === DSF_CP003_EXAM_PROFILE_AUTHORITY, `${profileId}: CP003 authority missing`);
  }
}

const deterministicA = generateDsfExamProfileBatch({
  answerProfile: "SSC_CGL_TIER2_2024_4_EN",
  count: 12,
  seed: "cp003-determinism",
});
const deterministicB = generateDsfExamProfileBatch({
  answerProfile: "SSC_CGL_TIER2_2024_4_EN",
  count: 12,
  seed: "cp003-determinism",
});
assert(
  JSON.stringify(deterministicA.questions.map((question) => ({
    id: question.questionId,
    sourceId: question.sourceQuestionId,
    answer: question.canonicalAnswer,
    options: question.options.map((option) => option.semanticClass),
  }))) === JSON.stringify(deterministicB.questions.map((question) => ({
    id: question.questionId,
    sourceId: question.sourceQuestionId,
    answer: question.canonicalAnswer,
    options: question.options.map((option) => option.semanticClass),
  }))),
  "CP003 exam-profile generation is not deterministic",
);

assert(DSF_CP003_QUESTION_STUDIO_PACKAGE.examSpecificAnswerProfilesImplemented, "Package did not advertise exam profiles");
assert(DSF_CP003_QUESTION_STUDIO_PACKAGE.supportedExamFamilies.includes("BANKING"), "Banking family missing");
assert(DSF_CP003_QUESTION_STUDIO_PACKAGE.supportedExamFamilies.includes("SSC"), "SSC family missing");
assert(
  DSF_CP003_DISABLED_EXAM_FAMILIES.some((entry) => entry.examFamily === "PUNJAB_STATE"),
  "Punjab must remain explicitly disabled pending stronger official evidence",
);
assert(!DSF_CP003_QUESTION_STUDIO_PACKAGE.questionBankWritable, "Question Bank gate opened");
assert(!DSF_CP003_QUESTION_STUDIO_PACKAGE.testEligible, "Test gate opened");
assert(!DSF_CP003_QUESTION_STUDIO_PACKAGE.mockTestEligible, "Mock-test gate opened");
assert(!DSF_CP003_QUESTION_STUDIO_PACKAGE.publiclyPublishable, "Publication gate opened");
assert(DSF_CP003_QUESTION_STUDIO_PACKAGE.nextAvailableQlId === "DSF-QL-002", "Unexpected permanent QL allocation");

console.log(JSON.stringify({
  status: "PASS_DSF_CP_003_EXAM_ANSWER_PROFILES",
  authority: DSF_CP003_EXAM_PROFILE_AUTHORITY,
  profileCount: DSF_CP003_ANSWER_PROFILES.length,
  bankingProfiles: 2,
  sscProfiles: 2,
  sscOptionCount: 4,
  bankingOptionCount: 5,
  sscOmittedClass: "EACH_STATEMENT_ALONE",
  punjabSpecificProfileEnabled: false,
  permanentQlIds: DSF_CP003_QUESTION_STUDIO_PACKAGE.permanentQlIds,
  nextAvailableQlId: DSF_CP003_QUESTION_STUDIO_PACKAGE.nextAvailableQlId,
  downstreamLocked: true,
}, null, 2));
