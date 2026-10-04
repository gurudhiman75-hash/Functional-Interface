import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";
import {
  ARG_CP015_POST_CLOSURE_ANSWER_PROOF_AUTHORITY,
  assertArgCp015FinalAnswerIntegrity,
} from "./cp015-post-closure-answer-proof.ts";
import {
  ARG_001_STANDARD_ADAPTER_AUTHORITY,
  ARG_001_STANDARD_PACKAGE_ID,
  ARG_001_STANDARD_QUESTION_STUDIO_PACKAGE,
} from "./question-studio-integration.ts";

const packages = reasoningV1QuestionStudioAdapter.listPackages();
const argPackages = packages.filter((pkg) => pkg.packageId === ARG_001_STANDARD_PACKAGE_ID);
assert.equal(argPackages.length, 1, "ARG-001 must be exposed exactly once by the standard reasoning adapter");
assert.equal(ARG_001_STANDARD_QUESTION_STUDIO_PACKAGE.engineId, "reasoning-v1");
assert.equal(ARG_001_STANDARD_QUESTION_STUDIO_PACKAGE.questionBankWritable, true);
assert.equal(ARG_001_STANDARD_QUESTION_STUDIO_PACKAGE.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(ARG_001_STANDARD_QUESTION_STUDIO_PACKAGE.testEligible, true);
assert.equal(ARG_001_STANDARD_QUESTION_STUDIO_PACKAGE.mockTestEligible, true);
assert.equal(ARG_001_STANDARD_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(ARG_001_STANDARD_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);
assert.equal(ARG_001_STANDARD_QUESTION_STUDIO_PACKAGE.productionReleaseAuthorized, false);

async function proveBatch(request: Parameters<typeof reasoningV1QuestionStudioAdapter.generate>[0], expected: {
  qlId: string;
  language: string;
  profile?: string;
  argumentCount?: number;
  optionCount?: number;
}) {
  const result = await reasoningV1QuestionStudioAdapter.generate(request);
  assert.ok(result.questions.length > 0);
  assert.equal(result.generationContext?.engineId, "reasoning-v1");
  assert.equal(result.generationContext?.packageId, "ARG-001");
  assert.equal(result.generationContext?.standardAdapterAuthority, ARG_001_STANDARD_ADAPTER_AUTHORITY);
  assert.equal(result.generationContext?.questionBankWritable, true);
  assert.equal(result.generationContext?.testEligible, true);
  assert.equal(result.generationContext?.mockTestEligible, true);
  assert.equal(result.generationContext?.publiclyPublishable, false);
  assert.equal(result.generationContext?.publicReleaseAuthorized, false);
  assert.equal(result.generationContext?.studentDeliveryAuthorized, false);
  assert.equal(result.generationContext?.automaticStudentPublication, false);
  assert.equal(
    result.generationContext?.postClosureAnswerProofAuthority,
    ARG_CP015_POST_CLOSURE_ANSWER_PROOF_AUTHORITY,
  );
  assert.equal(result.generationContext?.postClosureAnswerProofVerified, true);

  for (const raw of result.questions) {
    const question = raw as Readonly<Record<string, any>>;
    assert.equal(question.qlId, expected.qlId);
    assert.equal(question.language, expected.language);
    assert.equal(question.checkpointId, "ARG-CP-015");
    assert.equal(question.questionBankWritable, true);
    assert.equal(question.testEligible, true);
    assert.equal(question.mockTestEligible, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.publicReleaseAuthorized, false);
    assert.equal(question.studentDeliveryAuthorized, false);
    assert.equal(question.automaticStudentPublication, false);
    if (expected.profile) assert.equal(question.examProfile, expected.profile);
    if (expected.argumentCount !== undefined) assert.equal(question.arguments.length, expected.argumentCount);
    if (expected.optionCount !== undefined) assert.equal(question.options.length, expected.optionCount);
    assertArgCp015FinalAnswerIntegrity(question);
  }
  return result;
}

await proveBatch({
  packageId: "ARG-001",
  canonicalProblemId: "ARG-QL-001",
  language: "en",
  difficulty: "Easy",
  count: 3,
  seed: "arg-standard-core",
}, {
  qlId: "ARG-QL-001",
  language: "en",
});

await proveBatch({
  packageId: "ARG-001",
  canonicalProblemId: "ARG-QL-006",
  examProfile: "BANKING_COMBO_3X5",
  language: "pa",
  difficulty: "Hard",
  count: 3,
  seed: "arg-standard-banking-combo",
}, {
  qlId: "ARG-QL-006",
  language: "pa",
  profile: "BANKING_COMBO_3X5",
  argumentCount: 3,
  optionCount: 5,
});

await proveBatch({
  packageId: "ARG-001",
  canonicalProblemId: "ARG-QL-003",
  exam: "Punjab PSSSB",
  language: "hi",
  difficulty: "Medium",
  count: 2,
  seed: "arg-standard-punjab",
}, {
  qlId: "ARG-QL-003",
  language: "hi",
  profile: "SSC_RECENT_2X4",
  argumentCount: 2,
  optionCount: 4,
});

await assert.rejects(
  () => reasoningV1QuestionStudioAdapter.generate({
    packageId: "ARG-001",
    canonicalProblemId: "ARG-QL-999",
    language: "en",
    count: 1,
  }),
  /Unknown ARG-001 QL selector/i,
);

console.log(JSON.stringify({
  status: "PASS_ARG_001_STANDARD_QUESTION_STUDIO_POST_CLOSURE",
  packageId: ARG_001_STANDARD_PACKAGE_ID,
  adapterAuthority: ARG_001_STANDARD_ADAPTER_AUTHORITY,
  answerProofAuthority: ARG_CP015_POST_CLOSURE_ANSWER_PROOF_AUTHORITY,
  packageCountInReasoningAdapter: argPackages.length,
  lifecycle: {
    questionBankWritable: true,
    questionBankAcceptanceMode: "BANK_ONLY",
    testEligible: true,
    mockTestEligible: true,
    publiclyPublishable: false,
    productionReleaseAuthorized: false,
  },
}, null, 2));
