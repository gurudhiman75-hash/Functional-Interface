import assert from "node:assert/strict";

import { getGeneratedItemApprovalDisposition } from "../../../../lib/admin-question-studio-approval-policy";
import { analyzeGeneratedQuestionPayload } from "../../../../lib/question-studio-quality";
import { WOR_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";
import {
  buildWor001QuestionStudioPayload,
  WOR_001_QUESTION_STUDIO_REVISION_POLICY,
} from "./question-studio-payload";
import {
  WOR_001_QUESTION_STUDIO_CATALOG,
  WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewWor001QuestionStudioReview,
} from "./question-studio-review";

assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.questionStudioVisible, false);
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.questionStudioReviewVisible, true);
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.publicReleaseEnabled, false);
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.permanentQlCount, 0);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible, true);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointCount, 5);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.prototypeCount, 24);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 0);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(WOR_001_QUESTION_STUDIO_CATALOG.length, 24);

for (const language of ["en", "hi", "pa"] as const) {
  const result = previewWor001QuestionStudioReview({
    language,
    seed: `studio-audit-${language}`,
    count: 24,
  });
  assert.equal(result.questions.length, 24);
  assert.ok(result.questions.every((question) => question.questionStudioVisible));
  assert.ok(result.questions.every((question) => question.qlId === null));
  assert.ok(result.questions.every((question) => question.validation.valid));
  assert.ok(result.questions.every((question) => question.structuredPrompt.transformedWords === undefined));
  assert.ok(result.questions.every((question) => question.displayStem.includes("\n")));
  assert.ok(result.questions.every((question) => question.options.length === (question.checkpointId === "WOR-CP-005" ? 5 : 4)));
  assert.ok(result.questions.every((question) => question.options[question.correctIndex] === question.answer));
  assert.equal(new Set(result.questions.map((question) => question.prototypeId)).size, 24);
}

const easy = previewWor001QuestionStudioReview({
  language: "en",
  difficulty: "Easy",
  seed: "studio-easy",
  count: 40,
});
assert.ok(easy.questions.every((question) => question.difficultyBand === "Easy"));
assert.ok(easy.questions.every((question) => {
  const catalog = WOR_001_QUESTION_STUDIO_CATALOG.find((entry) => entry.prototypeId === question.prototypeId)!;
  return catalog.supportedDifficulties.includes("Easy");
}));

const cp005 = previewWor001QuestionStudioReview({
  language: "en",
  checkpointId: "WOR-CP-005",
  difficulty: "Hard",
  seed: "studio-banking",
  count: 10,
});
assert.ok(cp005.questions.every((question) => question.checkpointId === "WOR-CP-005"));
assert.ok(cp005.questions.every((question) => question.options.length === 5));
assert.ok(cp005.questions.every((question) => question.source.objectMode === "LETTER_CLUSTER"));

const persistedPayload = buildWor001QuestionStudioPayload(cp005.questions[0]!);
const quality = analyzeGeneratedQuestionPayload(persistedPayload);
assert.equal(quality.readyForApproval, true);
assert.equal(getGeneratedItemApprovalDisposition(persistedPayload).mode, "review_only");
assert.equal(persistedPayload.questionBankStatus, "NOT_STORED");
assert.equal(persistedPayload.questionBankWritable, false);
assert.equal(persistedPayload.testEligibility, "INELIGIBLE");
assert.equal(persistedPayload.publiclyPublishable, false);
assert.equal(persistedPayload.revisionPolicy, WOR_001_QUESTION_STUDIO_REVISION_POLICY);
assert.ok(persistedPayload.text.includes(cp005.questions[0]!.structuredPrompt.words[0]!));

assert.throws(
  () => previewWor001QuestionStudioReview({ prototypeId: "WOR-PROT-021", difficulty: "Easy" }),
  /does not support Easy difficulty/,
);
assert.throws(
  () => previewWor001QuestionStudioReview({ prototypeId: "WOR-PROT-999" }),
  /Unsupported WOR-001 prototype/,
);

console.log("WOR-001 Question Studio review contract passed.", {
  checkpoints: WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointCount,
  prototypes: WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.prototypeCount,
  permanentQlCount: WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount,
  approvalMode: getGeneratedItemApprovalDisposition(persistedPayload).mode,
  qualityScore: quality.score,
});
