import assert from "node:assert/strict";

import {
  generateQuestionStudioQuestions,
  listQuestionStudioEngines,
  listQuestionStudioPackages,
  resolveQuestionStudioEngine,
} from "../engine-registry";
import {
  OPS001_QUESTION_STUDIO_PACKAGE_ID_V1,
  OPS001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  reasoningV1QuestionStudioAdapter,
} from "./reasoning-v1-adapter";

assert.ok(listQuestionStudioEngines().includes("reasoning-v1"));
assert.equal(resolveQuestionStudioEngine({ packageId: "OPS-001" }).engineId, "reasoning-v1");
assert.equal(reasoningV1QuestionStudioAdapter.engineId, "reasoning-v1");

const packageDefinition = listQuestionStudioPackages().find(
  (entry) => entry.packageId === OPS001_QUESTION_STUDIO_PACKAGE_ID_V1,
);
assert.ok(packageDefinition, "OPS-001 must be discoverable in Question Studio packages.");
assert.equal(packageDefinition.engineId, "reasoning-v1");
assert.equal(packageDefinition.cpIds.length, 9);
assert.deepEqual(packageDefinition.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(packageDefinition.difficultyFilterSupported, false);
assert.equal(packageDefinition.lifecycleStage, "REVIEW_ONLY");
assert.equal(packageDefinition.questionBankWritable, false);
assert.equal(packageDefinition.testEligible, false);
assert.equal(packageDefinition.mockTestEligible, false);
assert.equal(packageDefinition.publiclyPublishable, false);
assert.equal(packageDefinition.automaticStudentPublication, false);
assert.equal(packageDefinition.productionReleaseAuthorized, false);
assert.equal(packageDefinition.metadata?.registrationAuthorityId, OPS001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1);
assert.equal(packageDefinition.metadata?.qlCount, 31);

const request = {
  packageId: "OPS-001",
  engineId: "reasoning-v1" as const,
  count: 12,
  language: "en" as const,
  seed: "ops-forward-port-integration-proof",
  difficulty: "Hard",
  exam: "SSC CGL",
};
const first = await generateQuestionStudioQuestions(request);
const replay = await generateQuestionStudioQuestions(request);
assert.equal(first.engineId, "reasoning-v1");
assert.equal(first.questions.length, 12);
assert.deepEqual(first.questions, replay.questions, "OPS-001 review generation must replay deterministically.");

for (const question of first.questions) {
  assert.equal(question.packageId, "OPS-001");
  assert.match(String(question.qlId), /^OPS-QL-\d{3}$/u);
  assert.match(String(question.cpId), /^OPS-CP-\d{3}$/u);
  assert.equal(question.language, "en");
  assert.equal(question.reviewOnly, true);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.productionReleaseAuthorized, false);
  assert.equal(question.difficulty, "Uncalibrated");
  assert.equal(question.requestedDifficulty, "Hard");
  assert.equal(question.requestedDifficultyApplied, false);
  assert.equal(question.requestedExam, "SSC CGL");
  assert.equal(question.examProfileApplied, false);
  const options = question.options as string[];
  assert.equal(options.length, 4);
  assert.equal(new Set(options).size, 4);
  assert.equal(options[Number(question.correctIndex)], question.canonicalAnswer);
  assert.ok(String(question.explanation).length > 50);
}

const cpScoped = await generateQuestionStudioQuestions({
  packageId: "OPS-001",
  canonicalProblemId: "OPS-CP-005",
  count: 10,
  language: "en",
  seed: "ops-cp005-proof",
});
assert.equal(cpScoped.questions.length, 10);
assert.ok(cpScoped.questions.every((question) => question.cpId === "OPS-CP-005"));

for (const language of ["hi", "pa"] as const) {
  const localized = await generateQuestionStudioQuestions({
    packageId: "OPS-001",
    questionLanguageId: "OPS-QL-004",
    count: 1,
    language,
    seed: `ops-localized-${language}`,
  });
  const question = localized.questions[0]!;
  assert.equal(question.qlId, "OPS-QL-004");
  assert.equal(question.language, language);
  assert.equal(question.reviewOnly, true);
  assert.ok(String(question.stem).length > 10);
  assert.equal((question.options as string[]).length, 4);
}

await assert.rejects(
  () => generateQuestionStudioQuestions({ packageId: "OPS-001", questionLanguageId: "OPS-QL-999", count: 1 }),
  /Unknown OPS-001 selector/u,
);
await assert.rejects(
  () => generateQuestionStudioQuestions({ packageId: "OPS-001", canonicalProblemId: "OPS-CP-001", questionLanguageId: "OPS-QL-031", count: 1 }),
  /is owned by/u,
);
await assert.rejects(
  () => generateQuestionStudioQuestions({ packageId: "OPS-001", runtimeMode: "bank-only", count: 1 }),
  /only supports review-only runtime/u,
);

console.log("OPS-001 current Question Studio forward-port integration passed.", {
  engine: first.engineId,
  qlCount: packageDefinition.metadata?.qlCount,
  cpCount: packageDefinition.cpIds.length,
  sampleCount: first.questions.length,
  lifecycleStage: packageDefinition.lifecycleStage,
});
