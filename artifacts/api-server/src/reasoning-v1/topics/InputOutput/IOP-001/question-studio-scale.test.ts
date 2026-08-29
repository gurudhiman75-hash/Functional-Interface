import assert from "node:assert/strict";
import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import {
  generateIop001StandardQuestionStudioBatch,
  type Iop001QuestionStudioLanguage,
} from "./question-studio-standard-integration.ts";
import type { IopPermanentSolveMode } from "./permanent-authorities.ts";

const languages: readonly Iop001QuestionStudioLanguage[] = ["en", "hi", "pa"] as const;
const questionIds = new Set<string>();
const solveModes = new Set<IopPermanentSolveMode>();
const sourceModes = new Set<string>();
let questionCount = 0;
let minimumExplanationLength = Number.POSITIVE_INFINITY;

for (const language of languages) {
  for (const mode of IOP_ENGLISH_SOURCE_MODES) {
    for (let sample = 0; sample < 2; sample += 1) {
      const batch = generateIop001StandardQuestionStudioBatch({
        packageId: "IOP-001",
        qlId: mode.qlId,
        sourceModeId: mode.sourceModeId,
        language,
        seed: `IOP-QS-SCALE-${language}-${mode.sourceModeId}-${sample}`,
        count: 4,
      });
      assert.equal(batch.questions.length, 4);
      assert.equal(batch.generationContext.questionStudioDiscoverable, true);
      assert.equal(batch.generationContext.persistenceAllowed, false);
      assert.equal(batch.generationContext.questionBankWritable, false);
      assert.equal(batch.generationContext.testEligible, false);
      assert.equal(batch.generationContext.publiclyPublishable, false);
      sourceModes.add(mode.sourceModeId);

      for (const question of batch.questions) {
        questionCount += 1;
        solveModes.add(question.solveMode);
        assert.equal(question.packageId, "IOP-001");
        assert.equal(question.qlId, mode.qlId);
        assert.equal(question.sourceModeId, mode.sourceModeId);
        assert.equal(question.language, language);
        assert.equal(question.options.length, 4);
        assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3);
        assert.equal(question.validation.exactlyOneCorrectOption, true);
        assert.equal(question.validation.englishFrozen, true);
        assert.equal(question.validation.localizationFrozen, true);
        assert.equal(question.questionBankWritable, false);
        assert.equal(question.testEligible, false);
        assert.equal(question.mockTestEligible, false);
        assert.equal(question.publiclyPublishable, false);
        assert.equal(question.automaticStudentPublication, false);
        assert.equal(question.reviewOnly, true);
        assert.equal(questionIds.has(question.localizedQuestionId), false, `Duplicate Question Studio id ${question.localizedQuestionId}`);
        questionIds.add(question.localizedQuestionId);
        minimumExplanationLength = Math.min(minimumExplanationLength, question.explanation.length);
        assert.ok(question.explanation.length >= 140, `${language}/${mode.sourceModeId}/${question.solveMode} explanation is too thin`);
        if (language === "hi") {
          assert.match(question.stem, /[\u0900-\u097F]/);
          assert.match(question.explanation, /[\u0900-\u097F]/);
          assert.match(question.sharedPrompt, /नया इनपुट:/);
        } else if (language === "pa") {
          assert.match(question.stem, /[\u0A00-\u0A7F]/);
          assert.match(question.explanation, /[\u0A00-\u0A7F]/);
          assert.match(question.sharedPrompt, /ਨਵਾਂ ਇਨਪੁੱਟ:/);
        } else {
          assert.match(question.sharedPrompt, /New Input:/);
        }
      }
    }
  }
}

assert.equal(sourceModes.size, 19, "Question Studio scale proof did not cover all source modes");
assert.equal(solveModes.size, 8, "Question Studio scale proof did not cover all solve modes");
assert.equal(questionCount, 19 * 3 * 2 * 4);
assert.equal(questionIds.size, questionCount);

console.log("PASS_IOP_001_QUESTION_STUDIO_SCALE");
console.log(`languages ${languages.join(",")}`);
console.log(`source modes ${sourceModes.size}`);
console.log(`solve modes ${solveModes.size}`);
console.log(`questions ${questionCount}`);
console.log(`unique question ids ${questionIds.size}`);
console.log(`minimum explanation length ${minimumExplanationLength}`);
console.log("Question Studio review-only true");
console.log("Question Bank false");
console.log("test eligible false");
console.log("publicly publishable false");
