import assert from "node:assert/strict";
import {
  generateIop001StandardQuestionStudioBatch,
  getIop001SourceModeDifficulty,
} from "./question-studio-standard-integration.ts";

const easyModes = new Set([
  "QL001_WORD_ALPHA_ASC_LEFT",
  "QL001_WORD_ALPHA_DESC_RIGHT",
  "QL001_NUMBER_ASC_LEFT",
]);
const mediumModes = new Set([
  "QL001_WORD_LENGTH_ASC_LEFT",
  "QL001_NUMBER_DIGIT_SUM_ASC_LEFT",
  "QL001_WORD_LENGTH_DESC_RIGHT",
]);

for (const mode of easyModes) assert.equal(getIop001SourceModeDifficulty(mode), "Easy");
for (const mode of mediumModes) assert.equal(getIop001SourceModeDifficulty(mode), "Medium");
assert.equal(getIop001SourceModeDifficulty("QL002_BLOCKED_001"), "Medium");
assert.equal(getIop001SourceModeDifficulty("QL004_ALTERNATING_003"), "Medium");
assert.equal(getIop001SourceModeDifficulty("QL005_NUM_PARITY_REVERSE_INCREMENT_TWO_ENDED"), "Hard");
assert.equal(getIop001SourceModeDifficulty("QL008_BOX_CROSS_MULTIPLY_COMBINE_DIVIDE_DIFFERENCE"), "Hard");

const ql001Easy = generateIop001StandardQuestionStudioBatch({
  packageId: "IOP-001",
  qlId: "IOP-QL-001",
  difficulty: "Easy",
  language: "en",
  seed: "IOP-QS-QL001-EASY-ROUTING",
  count: 36,
});
assert.ok(ql001Easy.questions.every((question) => question.difficulty === "Easy"));
assert.ok(ql001Easy.questions.every((question) => easyModes.has(question.sourceModeId)));
assert.equal(ql001Easy.generationContext.difficulty, "Easy");

const ql001Medium = generateIop001StandardQuestionStudioBatch({
  packageId: "IOP-001",
  qlId: "IOP-QL-001",
  difficulty: "Medium",
  language: "en",
  seed: "IOP-QS-QL001-MEDIUM-ROUTING",
  count: 36,
});
assert.ok(ql001Medium.questions.every((question) => question.difficulty === "Medium"));
assert.ok(ql001Medium.questions.every((question) => mediumModes.has(question.sourceModeId)));
assert.equal(ql001Medium.generationContext.difficulty, "Medium");

const exactAdvanced = generateIop001StandardQuestionStudioBatch({
  packageId: "IOP-001",
  qlId: "IOP-QL-001",
  sourceModeId: "QL001_NUMBER_DIGIT_SUM_ASC_LEFT",
  difficulty: "Medium",
  language: "en",
  seed: "IOP-QS-QL001-EXACT-MEDIUM",
  count: 8,
});
assert.ok(exactAdvanced.questions.every((question) => question.sourceModeId === "QL001_NUMBER_DIGIT_SUM_ASC_LEFT"));
assert.ok(exactAdvanced.questions.every((question) => question.difficulty === "Medium"));

assert.throws(
  () => generateIop001StandardQuestionStudioBatch({
    packageId: "IOP-001",
    qlId: "IOP-QL-001",
    difficulty: "Hard",
    count: 1,
  }),
  /No IOP Question Studio machine family matches/,
);

console.log("PASS_IOP_001_QUESTION_STUDIO_DIFFICULTY_ROUTING");
console.log(`QL001 easy source modes ${easyModes.size}`);
console.log(`QL001 medium source modes ${mediumModes.size}`);
console.log("No Easy/Medium cross-contamination true");
