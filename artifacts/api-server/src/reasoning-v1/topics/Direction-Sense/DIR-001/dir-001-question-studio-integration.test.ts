import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function source(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

import {
  DIR001_QUESTION_STUDIO_PACKAGE_ID_V1,
  DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  generateDir001QuestionStudioBatch,
  isDir001QuestionStudioRequest,
} from "./dir-001-question-studio-integration";

function assertReviewOnly(question: Record<string, any>) {
  assert.equal(question.packageId, "DIR-001");
  assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(question.questionBankStatus, "NOT_STORED");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligibility, "INELIGIBLE");
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.automaticStudentPublication, false);
  assert.equal(question.productionReleaseAuthorized, false);
  assert.equal(question.manualApprovalRequired, true);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.readOnly, true);
}

assert.equal(DIR001_QUESTION_STUDIO_PACKAGE_ID_V1, "DIR-001");
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.engineId, "reasoning-v1");
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.enabled, true);
assert.deepEqual(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.cpIds, [
  "DIR-CP-001", "DIR-CP-002", "DIR-CP-003", "DIR-CP-004",
  "DIR-CP-005", "DIR-CP-006", "DIR-CP-007", "DIR-CP-008",
]);
assert.deepEqual(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.questionBankWritable, false);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.testEligible, false);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.mockTestEligible, false);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.publiclyPublishable, false);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.productionReleaseAuthorized, false);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata?.permanentQlCount, 44);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata?.checkpointCount, 8);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata?.diagramPolicy, "EXPLANATION_ONLY");

assert.equal(isDir001QuestionStudioRequest({ packageId: "DIR-001" }), true);
assert.equal(isDir001QuestionStudioRequest({ canonicalProblemId: "DIR-QL-044" }), true);
assert.equal(isDir001QuestionStudioRequest({ patternId: "DIR-CP-005" }), true);
assert.equal(isDir001QuestionStudioRequest({ topic: "Direction Sense" }), true);
assert.equal(isDir001QuestionStudioRequest({ subtopic: "Direction & Distance" }), true);
assert.equal(isDir001QuestionStudioRequest({ packageId: "OPS-001" }), false);

const reasoningAdapterSource = source("src/question-studio/engines/reasoning-v1-adapter.ts");
assert.match(reasoningAdapterSource, /DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1/);
assert.match(reasoningAdapterSource, /isDir001QuestionStudioRequest\(request\)/);
assert.match(reasoningAdapterSource, /generateDir001QuestionStudioBatch\(request\)/);

const globalRegistrySource = source("src/question-studio/engine-registry.ts");
assert.match(globalRegistrySource, /reasoningV1QuestionStudioAdapter/);
assert.match(globalRegistrySource, /\[reasoningV1QuestionStudioAdapter\.engineId,\s*reasoningV1QuestionStudioAdapter\]/);

const qlEnglish = await generateDir001QuestionStudioBatch({
  packageId: "DIR-001",
  canonicalProblemId: "DIR-QL-004",
  language: "en",
  count: 3,
  seed: "dir001-question-studio-ql004",
});
assert.equal(qlEnglish.questions.length, 3);
for (const raw of qlEnglish.questions as Array<Record<string, any>>) {
  assert.equal(raw.qlId, "DIR-QL-004");
  assert.equal(raw.checkpointId, "DIR-CP-002");
  assert.equal(raw.options.length, 4);
  assert.equal(new Set(raw.options).size, 4);
  assert.equal(raw.correctIndex >= 0 && raw.correctIndex < 4, true);
  assert.equal(raw.validation.solverVerified, true);
  assert.equal(raw.validation.questionDiagramAbsent, true);
  assert.ok(raw.explanationDiagram?.svg.includes("<svg"), "QL004 explanation diagram must reach Question Studio");
  assertReviewOnly(raw);
}

const qlEnglishReplay = await generateDir001QuestionStudioBatch({
  packageId: "DIR-001",
  canonicalProblemId: "DIR-QL-004",
  language: "en",
  count: 3,
  seed: "dir001-question-studio-ql004",
});
assert.deepEqual(qlEnglishReplay, qlEnglish, "Question Studio generation must replay deterministically");

const cpBatch = await generateDir001QuestionStudioBatch({
  packageId: "DIR-001",
  canonicalProblemId: "DIR-CP-005",
  language: "en",
  count: 7,
  seed: "dir001-question-studio-cp005",
});
assert.equal(cpBatch.questions.length, 7);
assert.ok((cpBatch.questions as Array<Record<string, any>>).every((question) => question.checkpointId === "DIR-CP-005"));
assertReviewOnly(cpBatch.questions[0] as Record<string, any>);

const sharedSeed = "dir001-question-studio-language-parity";
const byLanguage = Object.fromEntries(await Promise.all((["en", "hi", "pa"] as const).map(async (language) => {
  const generated = await generateDir001QuestionStudioBatch({
    packageId: "DIR-001",
    canonicalProblemId: "DIR-QL-025",
    language,
    count: 1,
    seed: sharedSeed,
  });
  return [language, generated.questions[0] as Record<string, any>] as const;
})));

assert.deepEqual(byLanguage.hi.answer, byLanguage.en.answer);
assert.deepEqual(byLanguage.pa.answer, byLanguage.en.answer);
assert.equal(byLanguage.hi.correctIndex, byLanguage.en.correctIndex);
assert.equal(byLanguage.pa.correctIndex, byLanguage.en.correctIndex);
assert.match(byLanguage.hi.stem, /[ऀ-ॿ]/u);
assert.match(byLanguage.pa.stem, /[਀-੿]/u);
assert.equal(byLanguage.hi.validation.answerParityVerified, true);
assert.equal(byLanguage.pa.validation.answerParityVerified, true);
for (const question of Object.values(byLanguage)) assertReviewOnly(question);

const hardShadow = await generateDir001QuestionStudioBatch({
  packageId: "DIR-001",
  canonicalProblemId: "DIR-CP-007",
  language: "en",
  difficulty: "Hard",
  count: 3,
  seed: "dir001-question-studio-hard-cp007",
});
assert.ok((hardShadow.questions as Array<Record<string, any>>).every((question) => question.difficulty === "Hard"));
assert.ok((hardShadow.questions as Array<Record<string, any>>).every((question) => question.requestedDifficultyApplied === true));

await assert.rejects(
  () => generateDir001QuestionStudioBatch({
    packageId: "DIR-001",
    canonicalProblemId: "DIR-QL-030",
    language: "en",
    difficulty: "Hard",
    count: 1,
    seed: "dir001-question-studio-impossible-hard",
  }),
  /could not produce a Hard instance/u,
);

const hybrid = await generateDir001QuestionStudioBatch({
  packageId: "DIR-001",
  canonicalProblemId: "DIR-QL-044",
  language: "en",
  count: 1,
  seed: "dir001-question-studio-ql044",
});
const hybridQuestion = hybrid.questions[0] as Record<string, any>;
assert.equal(hybridQuestion.validation.questionDiagramAbsent, true);
assert.ok(hybridQuestion.explanationDiagram?.svg.includes("<svg"));
assert.equal(hybridQuestion.renderer, "DIRECTION_DIAGRAM");
assert.equal(hybridQuestion.registrationAuthorityId, DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1);
assertReviewOnly(hybridQuestion);

const context = hybrid.generationContext as Record<string, any>;
assert.equal(context.packageId, "DIR-001");
assert.equal(context.permanentQlCount, 44);
assert.equal(context.cpIds.length, 8);
assert.equal(context.questionBankWritable, false);
assert.equal(context.testEligible, false);
assert.equal(context.mockTestEligible, false);
assert.equal(context.publiclyPublishable, false);
assert.equal(context.productionReleaseAuthorized, false);
assert.equal(context.diagramPolicy, "EXPLANATION_ONLY");

console.log(JSON.stringify({
  verdict: "PASS_DIR_001_QUESTION_STUDIO_REVIEW_INTEGRATION_V1",
  packageId: DIR001_QUESTION_STUDIO_PACKAGE_ID_V1,
  authority: DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  qlCount: 44,
  checkpointCount: 8,
  languages: ["en", "hi", "pa"],
  lifecycle: "REVIEW_ONLY",
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
