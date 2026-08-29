import assert from "node:assert/strict";
import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { buildBtdFrozenEnglishQuestionV1 } from "../BTD-CP-005/btd-cp005-english-freeze-v1";
import {
  BTD_CP006_QUESTION_STUDIO_BOUNDARY,
  BTD_CP006_QUESTION_STUDIO_PACKAGE,
  BTD_CP006_QUESTION_STUDIO_VERSION,
  btdCp006DifficultyForQl,
  buildBtdCp006QuestionStudioPreview,
  generateBtdCp006QuestionStudioBatch,
  isBtdCp006QuestionStudioRequest,
} from "./btd-cp006-question-studio-review-v1";
import { listQuestionStudioPackages as listPreBtdPackages } from "../../../../../../question-studio/shared-generation-engine-cp014";
import { listQuestionStudioPackages as listBtdPackages } from "../../../../../../question-studio/shared-generation-engine-btd";

assert.equal(BTD_CP006_QUESTION_STUDIO_VERSION, "BTD-001-CP006-QUESTION-STUDIO-REVIEW-v1");
assert.equal(BTD_CP006_QUESTION_STUDIO_PACKAGE.permanentQlCount, 20);
assert.equal(BTD_CP006_QUESTION_STUDIO_PACKAGE.supportedLanguages.join(","), "en");
assert.equal(BTD_CP006_QUESTION_STUDIO_BOUNDARY.questionStudioDiscoverable, true);
assert.equal(BTD_CP006_QUESTION_STUDIO_BOUNDARY.questionStudioGenerationEnabled, true);
assert.equal(BTD_CP006_QUESTION_STUDIO_BOUNDARY.questionBankWritable, false);
assert.equal(BTD_CP006_QUESTION_STUDIO_BOUNDARY.testEligible, false);
assert.equal(BTD_CP006_QUESTION_STUDIO_BOUNDARY.mockTestEligible, false);
assert.equal(BTD_CP006_QUESTION_STUDIO_BOUNDARY.publiclyPublishable, false);
assert.equal(BTD_CP006_QUESTION_STUDIO_BOUNDARY.automaticStudentPublication, false);

const preBtd = listPreBtdPackages();
const aggregate = listBtdPackages();
assert.equal(aggregate.length, preBtd.length + 1, "BTD must extend rather than replace the existing Question Studio aggregate");
assert.equal(new Set(aggregate.map((pkg: any) => String(pkg.packageId))).size, aggregate.length, "Question Studio aggregate contains duplicate package IDs");
assert.equal(aggregate.filter((pkg: any) => String(pkg.packageId) === "BTD-001").length, 1, "BTD-001 must appear exactly once in capabilities");
for (const previous of preBtd) {
  const preserved = aggregate.find((pkg: any) => String(pkg.packageId) === String((previous as any).packageId));
  assert.ok(preserved, `Existing package ${(previous as any).packageId} disappeared after BTD extension`);
}

assert.equal(isBtdCp006QuestionStudioRequest({ packageId: "BTD-001" }), true);
assert.equal(isBtdCp006QuestionStudioRequest({ patternId: "BTD" }), true);
assert.equal(isBtdCp006QuestionStudioRequest({ cpId: "BTD-CP-002" }), true);
assert.equal(isBtdCp006QuestionStudioRequest({ questionLanguageId: "BTD-QL-019" }), true);
assert.equal(isBtdCp006QuestionStudioRequest({ subtopic: "Banker's Discount & True Discount" }), true);
assert.equal(isBtdCp006QuestionStudioRequest({ packageId: "NUM-002", subtopic: "Number System" }), false);

const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
for (const entry of BTD_PERMANENT_QL_REGISTRY) difficultyCounts[btdCp006DifficultyForQl(entry.qlId)] += 1;
assert.deepEqual(difficultyCounts, { Easy: 4, Medium: 13, Hard: 3 });

let generatedQuestions = 0;
let frozenEqualityChecks = 0;
let fingerprintChecks = 0;
let deterministicReplayChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
let jsonChecks = 0;
const answerPositions = [0, 0, 0, 0];
const questionIds = new Set<string>();

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `btd-cp006-audit:${entry.qlId}:${String(index + 1).padStart(3, "0")}`;
    const frozen = buildBtdFrozenEnglishQuestionV1(entry.qlId, seed);
    const preview = buildBtdCp006QuestionStudioPreview(entry.qlId, seed);
    const replay = buildBtdCp006QuestionStudioPreview(entry.qlId, seed);

    assert.equal(preview.stem, frozen.presentation.stem, `${entry.qlId}/${seed}: Studio stem drifted from frozen authority`);
    assert.deepEqual(preview.options, frozen.options.map((option) => option.text), `${entry.qlId}/${seed}: Studio options drifted`);
    assert.equal(preview.correctIndex, frozen.correctIndex, `${entry.qlId}/${seed}: correct index drifted`);
    assert.equal(preview.answer, frozen.correctAnswer, `${entry.qlId}/${seed}: answer drifted`);
    assert.deepEqual(preview.packageExplanation, frozen.explanation, `${entry.qlId}/${seed}: explanation drifted`);
    frozenEqualityChecks += 5;

    assert.equal(preview.frozenContentFingerprint, frozen.contentFingerprint, `${entry.qlId}/${seed}: frozen content fingerprint drifted`);
    fingerprintChecks += 1;
    assert.deepEqual(replay, preview, `${entry.qlId}/${seed}: Studio preview is not deterministic`);
    deterministicReplayChecks += 1;

    assert.equal(preview.qlId, entry.qlId);
    assert.equal(preview.cpId, entry.origin);
    assert.equal(preview.semanticSignature, entry.semanticSignature);
    assert.equal(preview.answerSemantic, entry.answerSemantic);
    assert.equal(preview.language, "en");
    assert.equal(preview.difficulty, btdCp006DifficultyForQl(entry.qlId));
    assert.equal(preview.options.length, 4);
    assert.equal(new Set(preview.options).size, 4);
    assert.ok(preview.correctIndex >= 0 && preview.correctIndex < 4);
    assert.equal(preview.options[preview.correctIndex], preview.answer);
    optionChecks += 4;
    answerPositions[preview.correctIndex] += 1;

    assert.ok(preview.explanation.includes("Given:"));
    assert.ok(preview.explanation.includes("Asked:"));
    assert.ok(preview.explanation.includes("Method:"));
    assert.ok(preview.explanation.includes("Answer:"));
    assert.ok(preview.explanation.length > 100);
    explanationChecks += 5;

    assert.equal(preview.activationAuthorized, true);
    assert.equal(preview.questionStudioDiscoverable, true);
    assert.equal(preview.questionStudioGenerationEnabled, true);
    assert.equal(preview.questionBankStatus, "NOT_STORED");
    assert.equal(preview.questionBankWritable, false);
    assert.equal(preview.testEligibility, "INELIGIBLE");
    assert.equal(preview.testEligible, false);
    assert.equal(preview.mockTestEligible, false);
    assert.equal(preview.publiclyPublishable, false);
    assert.equal(preview.automaticStudentPublication, false);
    assert.equal(preview.contentMutationAuthorized, false);
    lifecycleChecks += 11;

    const json = JSON.stringify(preview);
    assert.ok(json.length > 200);
    assert.equal(JSON.stringify(JSON.parse(json)), json);
    jsonChecks += 2;

    assert.equal(questionIds.has(preview.questionId), false, `${entry.qlId}/${seed}: duplicate Studio question identity`);
    questionIds.add(preview.questionId);
    generatedQuestions += 1;
  }
}

const cp001 = generateBtdCp006QuestionStudioBatch({ packageId: "BTD-001", cpId: "BTD-CP-001", seed: "cp001-routing", count: 40 });
assert.ok(cp001.questions.every((question) => question.cpId === "BTD-CP-001"));
const cp002 = generateBtdCp006QuestionStudioBatch({ packageId: "BTD-001", cpId: "BTD-CP-002", seed: "cp002-routing", count: 40 });
assert.ok(cp002.questions.every((question) => question.cpId === "BTD-CP-002"));
for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const batch = generateBtdCp006QuestionStudioBatch({ packageId: "BTD-001", difficulty, seed: `difficulty-${difficulty}`, count: 40 });
  assert.ok(batch.questions.every((question) => question.difficulty === difficulty), `${difficulty}: difficulty routing leaked another band`);
}
for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  const direct = generateBtdCp006QuestionStudioBatch({ questionLanguageId: entry.qlId, seed: `direct-${entry.qlId}`, count: 3 });
  assert.ok(direct.questions.every((question) => question.qlId === entry.qlId), `${entry.qlId}: direct QL routing drift`);
}
assert.throws(() => generateBtdCp006QuestionStudioBatch({ packageId: "BTD-001", language: "hi", seed: "language-lock" }), /English only/iu);
assert.throws(() => generateBtdCp006QuestionStudioBatch({ packageId: "BTD-001", questionLanguageId: "BTD-QL-999", seed: "unknown-ql" }), /Unknown BTD-001 question language/iu);

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP006-QUESTION-STUDIO-REVIEW-AUDIT-v1",
  studioVersion: BTD_CP006_QUESTION_STUDIO_VERSION,
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-006",
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  seedsPerQl: 100,
  generatedQuestions,
  frozenEqualityChecks,
  fingerprintChecks,
  deterministicReplayChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  jsonChecks,
  answerPositions,
  uniqueQuestionIds: questionIds.size,
  difficultyCounts,
  previousPackageCount: preBtd.length,
  aggregatePackageCount: aggregate.length,
  questionStudioDiscoverable: true,
  questionStudioGenerationEnabled: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_BTD_001_CP006_QUESTION_STUDIO_REVIEW_AUDIT_V1");
