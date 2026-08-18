import assert from "node:assert/strict";
import {
  generateIop001StandardQuestionStudioBatch,
  IOP_001_QUESTION_STUDIO_PACKAGE,
  isIop001StandardQuestionStudioRequest,
  listIop001StandardQuestionStudioPackages,
} from "./question-studio-standard-integration.ts";

assert.equal(IOP_001_QUESTION_STUDIO_PACKAGE.packageId, "IOP-001");
assert.equal(IOP_001_QUESTION_STUDIO_PACKAGE.examProfile, "BANKING");
assert.equal(IOP_001_QUESTION_STUDIO_PACKAGE.examProfileScope, "BANKING_INPUT_OUTPUT_GENERIC");
assert.equal(IOP_001_QUESTION_STUDIO_PACKAGE.qlIds.length, 8);
assert.equal(IOP_001_QUESTION_STUDIO_PACKAGE.sourceModes.length, 19);
assert.deepEqual(IOP_001_QUESTION_STUDIO_PACKAGE.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(IOP_001_QUESTION_STUDIO_PACKAGE.questionBankStatus, "NOT_STORED");
assert.equal(IOP_001_QUESTION_STUDIO_PACKAGE.testEligibility, "INELIGIBLE");
assert.equal(IOP_001_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(listIop001StandardQuestionStudioPackages().length, 1);
assert.equal(isIop001StandardQuestionStudioRequest({ packageId: "IOP-001" }), true);
assert.equal(isIop001StandardQuestionStudioRequest({ canonicalProblemId: "IOP-QL-005" }), true);
assert.equal(isIop001StandardQuestionStudioRequest({ subtopic: "Input Output" }), true);
assert.equal(isIop001StandardQuestionStudioRequest({ subtopic: "Syllogism" }), false);

const english = generateIop001StandardQuestionStudioBatch({
  packageId: "IOP-001",
  exam: "Banking — Machine Input–Output",
  qlId: "IOP-QL-001",
  language: "en",
  seed: "IOP-QS-ENGLISH-SMOKE",
  count: 8,
});
assert.equal(english.questions.length, 8);
assert.equal(english.generationContext.examProfile, "BANKING");
assert.equal(english.generationContext.requestedExam, "Banking — Machine Input–Output");
assert.equal(english.generationContext.questionStudioDiscoverable, true);
assert.equal(english.generationContext.questionStudioGeneratable, true);
assert.equal(english.generationContext.persistenceAllowed, false);
assert.equal(english.generationContext.questionBankWritable, false);
assert.equal(english.generationContext.testEligible, false);
assert.equal(english.generationContext.publiclyPublishable, false);
for (const question of english.questions) {
  assert.equal(question.qlId, "IOP-QL-001");
  assert.equal(question.language, "en");
  assert.equal(question.examProfile, "BANKING");
  assert.equal(question.validation.examProfileApproved, true);
  assert.match(question.sharedPrompt, /Illustration:/);
  assert.match(question.sharedPrompt, /New Input:/);
  assert.equal(question.options.length, 4);
  assert.equal(question.validation.exactlyOneCorrectOption, true);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.reviewOnly, true);
  assert.ok(question.explanation.length >= 140);
}

const hindi = generateIop001StandardQuestionStudioBatch({
  packageId: "IOP-001",
  exam: "IBPS PO Mains",
  qlId: "IOP-QL-005",
  language: "hi",
  seed: "IOP-QS-HINDI-SMOKE",
  count: 4,
});
assert.equal(hindi.questions.length, 4);
for (const question of hindi.questions) {
  assert.equal(question.qlId, "IOP-QL-005");
  assert.equal(question.locale, "hi-IN");
  assert.equal(question.examProfile, "BANKING");
  assert.match(question.stem, /[\u0900-\u097F]/);
  assert.match(question.explanation, /[\u0900-\u097F]/);
  assert.match(question.sharedPrompt, /नया इनपुट:/);
  assert.doesNotMatch(question.stem, /Which of the following/i);
  assert.equal(question.traceability.localizationFreezeSha256, "5636b216409fa487a3cbdd41f79bdc3606c411298b266b717d51aeba3fbf2213");
}

const punjabi = generateIop001StandardQuestionStudioBatch({
  packageId: "IOP-001",
  exam: "SBI PO Mains",
  qlId: "IOP-QL-007",
  language: "pa",
  seed: "IOP-QS-PUNJABI-SMOKE",
  count: 4,
});
assert.equal(punjabi.questions.length, 4);
for (const question of punjabi.questions) {
  assert.equal(question.qlId, "IOP-QL-007");
  assert.equal(question.locale, "pa-IN");
  assert.equal(question.examProfile, "BANKING");
  assert.match(question.stem, /[\u0A00-\u0A7F]/);
  assert.match(question.explanation, /[\u0A00-\u0A7F]/);
  assert.match(question.sharedPrompt, /ਨਵਾਂ ਇਨਪੁੱਟ:/);
  assert.doesNotMatch(question.stem, /Which of the following/i);
}

const exactMode = generateIop001StandardQuestionStudioBatch({
  packageId: "IOP-001",
  qlId: "IOP-QL-001",
  sourceModeId: "QL001_NUMBER_DIGIT_SUM_ASC_LEFT",
  language: "en",
  seed: "IOP-QS-MODE-SMOKE",
  count: 4,
});
assert.ok(exactMode.questions.every((question) => question.sourceModeId === "QL001_NUMBER_DIGIT_SUM_ASC_LEFT"));

const missingStepOnly = generateIop001StandardQuestionStudioBatch({
  packageId: "IOP-001",
  qlId: "IOP-QL-003",
  solveMode: "MISSING_STEP",
  language: "en",
  seed: "IOP-QS-MISSING-SMOKE",
  count: 5,
});
assert.equal(missingStepOnly.questions.length, 5);
assert.ok(missingStepOnly.questions.every((question) => question.solveMode === "MISSING_STEP"));

assert.throws(
  () => generateIop001StandardQuestionStudioBatch({ packageId: "IOP-001", exam: "SSC CGL Tier 1", count: 1 }),
  /Banking exam profiles only/,
);
assert.throws(
  () => generateIop001StandardQuestionStudioBatch({ packageId: "IOP-001", exam: "Punjab PSSSB Clerk", count: 1 }),
  /Banking exam profiles only/,
);
assert.throws(
  () => generateIop001StandardQuestionStudioBatch({ packageId: "IOP-001", exam: "RRB NTPC CBT 1", count: 1 }),
  /Banking exam profiles only/,
);
assert.throws(
  () => generateIop001StandardQuestionStudioBatch({ packageId: "IOP-001", qlId: "IOP-QL-001", difficulty: "Hard", count: 1 }),
  /No IOP Question Studio machine family matches/,
);
assert.throws(
  () => generateIop001StandardQuestionStudioBatch({ packageId: "IOP-001", qlId: "IOP-QL-008", solveMode: "ELEMENT_AT_POSITION", count: 1 }),
  /No IOP Question Studio machine family matches/,
);

console.log("PASS_IOP_001_QUESTION_STUDIO_STANDARD_INTEGRATION");
console.log(`packages ${listIop001StandardQuestionStudioPackages().length}`);
console.log(`QLs ${IOP_001_QUESTION_STUDIO_PACKAGE.qlIds.length}`);
console.log(`source modes ${IOP_001_QUESTION_STUDIO_PACKAGE.sourceModes.length}`);
console.log("exam profile BANKING");
console.log("non-banking exam tags fail closed");
console.log("languages en,hi,pa");
console.log("Question Studio discoverable true");
console.log("Question Bank false");
console.log("test eligible false");
console.log("publicly publishable false");
