import assert from "node:assert/strict";

import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { buildBtdFrozenEnglishQuestionV1 } from "../BTD-CP-005/btd-cp005-english-freeze-v1";
import {
  buildBtdCp006QuestionStudioPreview,
  btdCp006DifficultyForQl,
} from "../BTD-CP-006/btd-cp006-question-studio-review-v1";
import {
  BTD_CP009_HI_PA_FREEZE_MANIFEST_V1,
  buildBtdFrozenHiPaQuestionV1,
} from "../BTD-CP-009/btd-cp009-hi-pa-freeze-v1";
import {
  BTD_CP010_LANGUAGES,
  BTD_CP010_QUESTION_STUDIO_BOUNDARY,
  BTD_CP010_QUESTION_STUDIO_PACKAGE,
  BTD_CP010_QUESTION_STUDIO_VERSION,
  buildBtdCp010QuestionStudioPreview,
  generateBtdCp010QuestionStudioBatch,
  isBtdCp010QuestionStudioRequest,
} from "./btd-cp010-multilingual-question-studio-v1";
import { listQuestionStudioPackages as listPreBtdPackages } from "../../../../../../../question-studio/shared-generation-engine-cp014";
import { listQuestionStudioPackages as listBtdPackages } from "../../../../../../../question-studio/shared-generation-engine-btd";

assert.equal(BTD_CP010_QUESTION_STUDIO_VERSION, "BTD-001-CP010-MULTILINGUAL-QUESTION-STUDIO-v1");
assert.equal(BTD_CP010_QUESTION_STUDIO_PACKAGE.permanentQlCount, 20);
assert.deepEqual([...BTD_CP010_QUESTION_STUDIO_PACKAGE.supportedLanguages], ["en", "hi", "pa"]);
assert.equal(BTD_CP010_QUESTION_STUDIO_BOUNDARY.questionStudioDiscoverable, true);
assert.equal(BTD_CP010_QUESTION_STUDIO_BOUNDARY.questionStudioGenerationEnabled, true);
assert.equal(BTD_CP010_QUESTION_STUDIO_BOUNDARY.questionBankWritable, false);
assert.equal(BTD_CP010_QUESTION_STUDIO_BOUNDARY.testEligible, false);
assert.equal(BTD_CP010_QUESTION_STUDIO_BOUNDARY.mockTestEligible, false);
assert.equal(BTD_CP010_QUESTION_STUDIO_BOUNDARY.publiclyPublishable, false);
assert.equal(BTD_CP010_QUESTION_STUDIO_BOUNDARY.automaticStudentPublication, false);
assert.equal(BTD_CP010_QUESTION_STUDIO_BOUNDARY.contentMutationAuthorized, false);

const preBtd = listPreBtdPackages();
const aggregate = listBtdPackages();
assert.equal(aggregate.length, preBtd.length + 1, "BTD multilingual activation must remain additive");
assert.equal(new Set(aggregate.map((pkg: any) => String(pkg.packageId))).size, aggregate.length, "Question Studio aggregate contains duplicate package IDs");
const btdPackages = aggregate.filter((pkg: any) => String(pkg.packageId) === "BTD-001");
assert.equal(btdPackages.length, 1, "BTD-001 must appear exactly once after multilingual activation");
assert.deepEqual([...btdPackages[0].supportedLanguages], ["en", "hi", "pa"]);
for (const previous of preBtd) {
  assert.ok(aggregate.some((pkg: any) => String(pkg.packageId) === String((previous as any).packageId)), `Existing package ${(previous as any).packageId} disappeared after CP010`);
}

assert.equal(isBtdCp010QuestionStudioRequest({ packageId: "BTD-001" }), true);
assert.equal(isBtdCp010QuestionStudioRequest({ patternId: "BTD" }), true);
assert.equal(isBtdCp010QuestionStudioRequest({ cpId: "BTD-CP-002" }), true);
assert.equal(isBtdCp010QuestionStudioRequest({ questionLanguageId: "BTD-QL-019" }), true);
assert.equal(isBtdCp010QuestionStudioRequest({ subtopic: "Banker's Discount & True Discount" }), true);
assert.equal(isBtdCp010QuestionStudioRequest({ packageId: "NUM-002", subtopic: "Number System" }), false);

let studioQuestions = 0;
let frozenLearnerEqualityChecks = 0;
let frozenFingerprintChecks = 0;
let deterministicReplayChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
let jsonChecks = 0;
let englishCompatibilityChecks = 0;
let nativeLanguageChecks = 0;
const questionIds = new Set<string>();
const languageCounts = { en: 0, hi: 0, pa: 0 };
const answerPositions = { en: [0, 0, 0, 0], hi: [0, 0, 0, 0], pa: [0, 0, 0, 0] };

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (const language of BTD_CP010_LANGUAGES) {
    for (let index = 0; index < 100; index += 1) {
      const seed = `btd-cp010-audit:${language}:${entry.qlId}:${String(index + 1).padStart(3, "0")}`;
      const preview = buildBtdCp010QuestionStudioPreview(entry.qlId, seed, language);
      const replay = buildBtdCp010QuestionStudioPreview(entry.qlId, seed, language);

      assert.deepEqual(replay, preview, `${entry.qlId}/${language}/${seed}: Studio replay drift`);
      deterministicReplayChecks += 1;

      if (language === "en") {
        const frozen = buildBtdFrozenEnglishQuestionV1(entry.qlId, seed);
        const cp006 = buildBtdCp006QuestionStudioPreview(entry.qlId, seed);
        assert.equal(preview.stem, frozen.presentation.stem);
        assert.deepEqual(preview.options, frozen.options.map((option) => option.text));
        assert.equal(preview.correctIndex, frozen.correctIndex);
        assert.equal(preview.answer, frozen.correctAnswer);
        assert.deepEqual(preview.packageExplanation, frozen.explanation);
        frozenLearnerEqualityChecks += 5;
        assert.equal(preview.frozenContentFingerprint, frozen.contentFingerprint);
        frozenFingerprintChecks += 1;

        assert.equal(preview.stem, cp006.stem);
        assert.deepEqual(preview.options, cp006.options);
        assert.equal(preview.answer, cp006.answer);
        assert.equal(preview.frozenContentFingerprint, cp006.frozenContentFingerprint);
        assert.deepEqual(preview.packageExplanation, cp006.packageExplanation);
        englishCompatibilityChecks += 5;
      } else {
        const frozen = buildBtdFrozenHiPaQuestionV1(entry.qlId, seed, language);
        assert.equal(preview.stem, frozen.presentation.stem);
        assert.deepEqual(preview.options, frozen.options.map((option: any) => option.text));
        assert.equal(preview.correctIndex, frozen.correctIndex);
        assert.equal(preview.answer, frozen.correctAnswer);
        assert.deepEqual(preview.packageExplanation, frozen.explanation);
        frozenLearnerEqualityChecks += 5;
        assert.equal(preview.frozenContentFingerprint, frozen.contentFingerprint);
        assert.equal(preview.frozenChapterFingerprint, BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.chapterFingerprint);
        frozenFingerprintChecks += 2;

        if (language === "hi") {
          assert.match(preview.stem, /[\u0900-\u097F]/u, `${entry.qlId}/${seed}: Hindi stem lacks Devanagari`);
          assert.match(preview.explanation, /दिया गया|पूछा गया|विधि|उत्तर/u);
        } else {
          assert.match(preview.stem, /[\u0A00-\u0A7F]/u, `${entry.qlId}/${seed}: Punjabi stem lacks Gurmukhi`);
          assert.match(preview.explanation, /ਦਿੱਤਾ ਗਿਆ|ਪੁੱਛਿਆ ਗਿਆ|ਵਿਧੀ|ਉੱਤਰ/u);
        }
        nativeLanguageChecks += 2;
      }

      assert.equal(preview.qlId, entry.qlId);
      assert.equal(preview.cpId, entry.origin);
      assert.equal(preview.semanticSignature, entry.semanticSignature);
      assert.equal(preview.answerSemantic, entry.answerSemantic);
      assert.equal(preview.language, language);
      assert.equal(preview.difficulty, btdCp006DifficultyForQl(entry.qlId));
      assert.equal(preview.options.length, 4);
      assert.equal(new Set(preview.options).size, 4);
      assert.ok(preview.correctIndex >= 0 && preview.correctIndex < 4);
      assert.equal(preview.options[preview.correctIndex], preview.answer);
      optionChecks += 4;
      answerPositions[language][preview.correctIndex] += 1;

      assert.ok(preview.explanation.length > 100);
      assert.ok(preview.packageExplanation.whatGiven.length > 0);
      assert.ok(preview.packageExplanation.whatAsked.length > 0);
      assert.ok(preview.packageExplanation.keyIdea.length > 0);
      assert.ok(preview.packageExplanation.steps.length > 0);
      assert.ok(preview.packageExplanation.finalAnswer.length > 0);
      explanationChecks += 6;

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
      assert.equal(preview.multilingualFrozen, true);
      lifecycleChecks += 12;

      const json = JSON.stringify(preview);
      assert.ok(json.length > 200);
      assert.equal(JSON.stringify(JSON.parse(json)), json);
      jsonChecks += 2;

      assert.equal(questionIds.has(preview.questionId), false, `${entry.qlId}/${language}/${seed}: duplicate Studio identity`);
      questionIds.add(preview.questionId);
      languageCounts[language] += 1;
      studioQuestions += 1;
    }
  }
}

assert.deepEqual(languageCounts, { en: 2000, hi: 2000, pa: 2000 });
assert.equal(questionIds.size, 6000);

for (const language of BTD_CP010_LANGUAGES) {
  const cp001 = generateBtdCp010QuestionStudioBatch({ packageId: "BTD-001", cpId: "BTD-CP-001", language, seed: `cp001-${language}`, count: 40 });
  assert.ok(cp001.questions.every((question) => question.cpId === "BTD-CP-001" && question.language === language));
  const cp002 = generateBtdCp010QuestionStudioBatch({ packageId: "BTD-001", cpId: "BTD-CP-002", language, seed: `cp002-${language}`, count: 40 });
  assert.ok(cp002.questions.every((question) => question.cpId === "BTD-CP-002" && question.language === language));
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const batch = generateBtdCp010QuestionStudioBatch({ packageId: "BTD-001", language, difficulty, seed: `${language}-${difficulty}`, count: 40 });
    assert.ok(batch.questions.every((question) => question.language === language && question.difficulty === difficulty));
  }
}

for (const language of BTD_CP010_LANGUAGES) {
  for (const entry of BTD_PERMANENT_QL_REGISTRY) {
    const direct = generateBtdCp010QuestionStudioBatch({ questionLanguageId: entry.qlId, language, seed: `direct-${language}-${entry.qlId}`, count: 2 });
    assert.ok(direct.questions.every((question) => question.qlId === entry.qlId && question.language === language));
  }
}

assert.throws(() => generateBtdCp010QuestionStudioBatch({ packageId: "BTD-001", language: "fr", seed: "bad-language" }), /Unsupported BTD-001 Question Studio language/iu);
assert.throws(() => generateBtdCp010QuestionStudioBatch({ packageId: "BTD-001", questionLanguageId: "BTD-QL-999", seed: "bad-ql" }), /Unknown BTD-001 question language/iu);

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP010-MULTILINGUAL-QUESTION-STUDIO-AUDIT-v1",
  studioVersion: BTD_CP010_QUESTION_STUDIO_VERSION,
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-010",
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  languages: BTD_CP010_LANGUAGES,
  seedsPerQlPerLanguage: 100,
  studioQuestions,
  frozenLearnerEqualityChecks,
  frozenFingerprintChecks,
  deterministicReplayChecks,
  englishCompatibilityChecks,
  nativeLanguageChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  jsonChecks,
  languageCounts,
  answerPositions,
  uniqueQuestionIds: questionIds.size,
  previousPackageCount: preBtd.length,
  aggregatePackageCount: aggregate.length,
  questionStudioDiscoverable: true,
  questionStudioGenerationEnabled: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_BTD_001_CP010_MULTILINGUAL_QUESTION_STUDIO_AUDIT_V1");
