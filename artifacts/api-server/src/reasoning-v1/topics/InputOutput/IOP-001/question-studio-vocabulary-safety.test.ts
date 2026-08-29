import assert from "node:assert/strict";
import {
  generateIop001StandardQuestionStudioBatch,
  IOP_001_QUESTION_STUDIO_BLOCKED_VOCABULARY,
  type Iop001QuestionStudioLanguage,
} from "./question-studio-standard-integration.ts";

const languages: readonly Iop001QuestionStudioLanguage[] = ["en", "hi", "pa"] as const;
const blocked = new Set<string>(IOP_001_QUESTION_STUDIO_BLOCKED_VOCABULARY);
let questions = 0;
let caselets = 0;

for (const language of languages) {
  for (let sample = 0; sample < 12; sample += 1) {
    const batch = generateIop001StandardQuestionStudioBatch({
      packageId: "IOP-001",
      qlId: "IOP-QL-006",
      difficulty: "Hard",
      language,
      seed: `IOP-QS-VOCAB-${language}-${sample}`,
      count: 20,
    });
    assert.equal(batch.questions.length, 20);
    assert.deepEqual(batch.generationContext.blockedExamVocabulary, [...IOP_001_QUESTION_STUDIO_BLOCKED_VOCABULARY]);
    caselets += batch.generationContext.caselets.length;
    for (const question of batch.questions) {
      questions += 1;
      assert.equal(question.validation.examVocabularySafe, true);
      const learnerText = [question.sharedPrompt, question.stem, question.explanation, ...question.options]
        .join(" ")
        .toLowerCase();
      for (const token of blocked) {
        assert.equal(learnerText.includes(token), false, `${language}/${question.questionId} leaked blocked exam vocabulary '${token}'`);
      }
    }
  }
}

assert.equal(questions, 3 * 12 * 20);
console.log("PASS_IOP_001_QUESTION_STUDIO_VOCABULARY_SAFETY");
console.log(`languages ${languages.join(",")}`);
console.log(`QL006 questions ${questions}`);
console.log(`safe caselets ${caselets}`);
console.log(`blocked vocabulary ${[...blocked].join(",")}`);
console.log("Frozen learner hashes unchanged by selection-layer filter");
