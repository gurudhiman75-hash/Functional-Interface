import assert from "node:assert/strict";

import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
  resolveQuestionStudioEngine,
} from "../engine-registry";
import {
  CLS001_GENERATIVE_CP_IDS_V1,
  CLS001_PERMANENT_QL_IDS_V1,
  CLS001_QUESTION_STUDIO_PACKAGE_ID_V1,
  CLS001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  CLS001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
} from "./reasoning-v1-cls001-adapter-v1";

const QL_TO_CP = {
  "CLS-QL-001": "CLS-CP-001",
  "CLS-QL-002": "CLS-CP-001",
  "CLS-QL-003": "CLS-CP-001",
  "CLS-QL-004": "CLS-CP-002",
  "CLS-QL-005": "CLS-CP-003",
  "CLS-QL-006": "CLS-CP-003",
  "CLS-QL-007": "CLS-CP-004",
  "CLS-QL-008": "CLS-CP-005",
  "CLS-QL-009": "CLS-CP-005",
  "CLS-QL-010": "CLS-CP-006",
  "CLS-QL-011": "CLS-CP-006",
  "CLS-QL-012": "CLS-CP-007",
  "CLS-QL-013": "CLS-CP-007",
} as const;

assert.equal(resolveQuestionStudioEngine({ packageId: "CLS-001" }).engineId, "reasoning-v1");

const packageDefinition = listQuestionStudioPackages().find(
  (entry) => entry.packageId === CLS001_QUESTION_STUDIO_PACKAGE_ID_V1,
);
assert.ok(packageDefinition, "CLS-001 must be discoverable in Question Studio.");
assert.deepEqual(packageDefinition, CLS001_STANDARD_REVIEW_ONLY_PACKAGE_V1);
assert.deepEqual(packageDefinition.cpIds, [...CLS001_GENERATIVE_CP_IDS_V1]);
assert.deepEqual(packageDefinition.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(packageDefinition.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(packageDefinition.difficultyFilterSupported, false);
assert.equal(packageDefinition.lifecycleStage, "REVIEW_ONLY");
assert.equal(packageDefinition.questionBankWritable, false);
assert.equal(packageDefinition.testEligible, false);
assert.equal(packageDefinition.mockTestEligible, false);
assert.equal(packageDefinition.publiclyPublishable, false);
assert.equal(packageDefinition.automaticStudentPublication, false);
assert.equal(packageDefinition.productionReleaseAuthorized, false);
assert.equal(packageDefinition.metadata?.registrationAuthorityId, CLS001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1);
assert.equal(packageDefinition.metadata?.qlCount, 13);
assert.equal(packageDefinition.metadata?.ownershipClosureCheckpointId, "CLS-CP-008");
assert.equal(packageDefinition.metadata?.ownershipClosureAllocatedQlCount, 0);

let generatedCount = 0;
for (const language of ["en", "hi", "pa"] as const) {
  for (const qlId of CLS001_PERMANENT_QL_IDS_V1) {
    const result = await generateQuestionStudioQuestions({
      packageId: "CLS-001",
      engineId: "reasoning-v1",
      questionLanguageId: qlId,
      language,
      count: 1,
      seed: `cls-final-closure-${language}-${qlId}`,
    });
    assert.equal(result.questions.length, 1);
    const question = result.questions[0]!;
    assert.equal(question.packageId, "CLS-001");
    assert.equal(question.qlId, qlId);
    assert.equal(question.cpId, QL_TO_CP[qlId]);
    assert.equal(question.language, language);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.readOnly, true);
    assert.equal(question.questionStudioDiscoverable, true);
    assert.equal(question.questionStudioGenerationEnabled, true);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.productionReleaseAuthorized, false);
    assert.equal(question.sourceStateAuthorityPreserved, true);
    assert.ok(["Easy", "Medium", "Hard"].includes(String(question.difficulty)));
    assert.ok(String(question.stem).trim().length > 3);
    assert.ok(String(question.explanation).trim().length > 10);
    assert.doesNotMatch(
      String(question.explanation),
      /examSpeedShortcut|commonTrapWarning|✅|❌|\\operatorname|\\mathbb/u,
    );
    const reviewExplanation = question.reviewExplanation as {
      examSpeedShortcut: unknown[];
      commonTrapWarning: unknown[];
      stepByStep: unknown[];
    };
    assert.deepEqual(reviewExplanation.examSpeedShortcut, []);
    assert.deepEqual(reviewExplanation.commonTrapWarning, []);
    assert.ok(reviewExplanation.stepByStep.length <= 4);
    const options = question.options as string[];
    assert.ok(options.length === 4 || options.length === 5);
    assert.equal(new Set(options).size, options.length);
    assert.equal(options[Number(question.correctIndex)], question.canonicalAnswer);
    generatedCount += 1;
  }
}

const deterministicRequest = {
  packageId: "CLS-001",
  questionLanguageId: "CLS-QL-007",
  language: "pa" as const,
  count: 3,
  seed: "cls-deterministic-punjabi-cp004",
};
const first = await generateQuestionStudioQuestions(deterministicRequest);
const replay = await generateQuestionStudioQuestions(deterministicRequest);
assert.deepEqual(first.questions, replay.questions);

const cp007 = await generateQuestionStudioQuestions({
  packageId: "CLS-001",
  canonicalProblemId: "CLS-CP-007",
  language: "hi",
  count: 8,
  seed: "cls-cp007-scope-proof",
});
assert.equal(cp007.questions.length, 8);
assert.ok(cp007.questions.every((question) => question.cpId === "CLS-CP-007"));
assert.ok(cp007.questions.every((question) => ["CLS-QL-012", "CLS-QL-013"].includes(String(question.qlId))));

await assert.rejects(
  () => generateQuestionStudioQuestions({
    packageId: "CLS-001",
    questionLanguageId: "CLS-QL-007",
    language: "en",
    difficulty: "Hard",
    count: 2,
    seed: "cls-hard-difficulty-proof",
  }),
  /difficulty filtering is intentionally disabled/u,
);

await assert.rejects(
  () => generateQuestionStudioQuestions({
    packageId: "CLS-001",
    canonicalProblemId: "CLS-CP-008",
    count: 1,
  }),
  /zero-allocation ownership checkpoint/u,
);
await assert.rejects(
  () => generateQuestionStudioQuestions({
    packageId: "CLS-001",
    questionLanguageId: "CLS-QL-999",
    count: 1,
  }),
  /Unknown CLS-001 selector/u,
);
await assert.rejects(
  () => generateQuestionStudioQuestions({
    packageId: "CLS-001",
    canonicalProblemId: "CLS-CP-003",
    questionLanguageId: "CLS-QL-007",
    count: 1,
  }),
  /is owned by/u,
);
await assert.rejects(
  () => generateQuestionStudioQuestions({
    packageId: "CLS-001",
    runtimeMode: "bank-only",
    count: 1,
  }),
  /only supports review-only runtime/u,
);

console.log("CLS-001 final chapter-closure Question Studio integration passed.", {
  qlCount: CLS001_PERMANENT_QL_IDS_V1.length,
  localeQlSamples: generatedCount,
  generativeCpCount: CLS001_GENERATIVE_CP_IDS_V1.length,
  ownershipClosure: "CLS-CP-008",
  lifecycleStage: packageDefinition.lifecycleStage,
});
