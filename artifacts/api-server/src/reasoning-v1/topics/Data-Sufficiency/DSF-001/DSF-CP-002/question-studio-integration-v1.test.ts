import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import { DSF_CP001_FREEZE_AUTHORITY } from "../DSF-CP-001/cp001-freeze-authority.ts";
import {
  DSF_CP002_DOMAINS,
  DSF_CP002_QUESTION_STUDIO_AUTHORITY,
  DSF_CP002_QUESTION_STUDIO_PACKAGE,
  generateDsfQuestionStudioBatch,
} from "./question-studio-integration-v1.ts";

assert.equal(DSF_CP001_FREEZE_AUTHORITY.status, "FROZEN");
assert.equal(DSF_CP002_QUESTION_STUDIO_PACKAGE.integrationAuthority, DSF_CP002_QUESTION_STUDIO_AUTHORITY);
assert.equal(DSF_CP002_QUESTION_STUDIO_PACKAGE.sourceFreezeAuthority, "DSF_CP001_PRODUCTION_GENERATION_FREEZE_V1");
assert.deepEqual(DSF_CP002_QUESTION_STUDIO_PACKAGE.permanentQlIds, ["DSF-QL-001"]);
assert.equal(DSF_CP002_QUESTION_STUDIO_PACKAGE.nextAvailableQlId, "DSF-QL-002");
assert.equal(DSF_CP002_QUESTION_STUDIO_PACKAGE.domains.length, 4);
assert.equal(DSF_CP002_QUESTION_STUDIO_PACKAGE.solveModeCount, 8);
assert.equal(DSF_CP002_QUESTION_STUDIO_PACKAGE.examSpecificAnswerProfilesImplemented, false);
assert.deepEqual(DSF_CP002_QUESTION_STUDIO_PACKAGE.supportedLanguages, ["en"]);
assert.deepEqual(DSF_CP002_QUESTION_STUDIO_PACKAGE.supportedAnswerProfiles, ["GENERIC_DS_STANDARD_5_EN"]);

const matrix = [];
for (const domain of DSF_CP002_DOMAINS) {
  for (const semanticClass of SUFFICIENCY_CLASSES) {
    const result = generateDsfQuestionStudioBatch({
      seed: `matrix:${domain.id}:${semanticClass}`,
      count: 1,
      domain: domain.id,
      semanticClass,
    });
    const question = result.questions[0]!;
    assert.equal(question.domain, domain.id);
    assert.equal(question.canonicalAnswer, semanticClass);
    assert.equal(question.qlId, "DSF-QL-001");
    assert.equal(question.sourceCheckpointId, "DSF-CP-001");
    assert.equal(question.integrationCheckpointId, "DSF-CP-002");
    assert.equal(question.options.length, 5);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.semanticClass, semanticClass);
    assert.equal(question.validation.valid, true);
    assert.equal(question.validation.sourceFrozen, true);
    assert.equal(question.validation.sourceValidated, true);
    assert.equal(question.validation.qlIdentityPreserved, true);
    assert.equal(question.lifecycle.questionStudioDiscoverable, true);
    assert.equal(question.lifecycle.persistenceAllowed, true);
    assert.equal(question.lifecycle.reviewOnly, true);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.mockTestEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    matrix.push(`${domain.id}:${semanticClass}`);
  }
}

const solveModes = DSF_CP002_DOMAINS.flatMap((domain) => domain.solveModes.map((solveMode) => ({ domain, solveMode })));
for (const { domain, solveMode } of solveModes) {
  const question = generateDsfQuestionStudioBatch({
    seed: `solve-mode:${solveMode}`,
    count: 1,
    domain: domain.id,
    solveMode,
  }).questions[0]!;
  assert.equal(question.solveModeId, solveMode);
  assert.equal(question.domain, domain.id);
}

const first = generateDsfQuestionStudioBatch({ seed: "determinism", count: 24 });
const second = generateDsfQuestionStudioBatch({ seed: "determinism", count: 24 });
assert.deepEqual(first, second);
assert.equal(new Set(first.questions.map((question) => question.sourceGenerationIdentity)).size, 24);
assert(first.questions.every((question) => question.language === "en"));
assert(first.questions.every((question) => question.answerProfile === "GENERIC_DS_STANDARD_5_EN"));

assert.throws(
  () => generateDsfQuestionStudioBatch({ domain: "ALGEBRA", solveMode: "DSF-SM-NUM-MISSING-DIGIT" }),
  /incompatible/,
);

console.log(JSON.stringify({
  status: "PASS_DSF_CP_002_QUESTION_STUDIO_RUNTIME",
  authority: DSF_CP002_QUESTION_STUDIO_AUTHORITY,
  sourceFreezeAuthority: DSF_CP002_QUESTION_STUDIO_PACKAGE.sourceFreezeAuthority,
  matrixCases: matrix.length,
  solveModesProven: solveModes.length,
  deterministicBatchQuestions: first.questions.length,
  permanentQlIds: DSF_CP002_QUESTION_STUDIO_PACKAGE.permanentQlIds,
  nextAvailableQlId: DSF_CP002_QUESTION_STUDIO_PACKAGE.nextAvailableQlId,
  language: "en",
  answerProfile: "GENERIC_DS_STANDARD_5_EN",
  reviewOnly: true,
  downstreamLocked: true,
}, null, 2));
