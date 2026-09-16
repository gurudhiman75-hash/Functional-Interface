import assert from "node:assert/strict";
import { SCI_CP011_REVIEW_V1, validateSciCp011ReviewV1 } from "./sci-cp011-review-v1";

const validation = validateSciCp011ReviewV1();

assert.equal(validation.valid, true, validation.errors.join("; "));
assert.equal(validation.totalQuestions, 60);
assert.deepEqual(validation.difficultyCounts, { Easy: 18, Medium: 30, Hard: 12 });
assert.deepEqual(validation.answerPositionCounts, { A: 15, B: 15, C: 15, D: 15 });
assert.equal(new Set(SCI_CP011_REVIEW_V1.map((question) => question.questionId)).size, 60);
assert.equal(new Set(SCI_CP011_REVIEW_V1.map((question) => question.stem)).size, 60);
assert.ok(SCI_CP011_REVIEW_V1.every((question) => question.reviewOnly));
assert.ok(SCI_CP011_REVIEW_V1.every((question) => !question.runtimeRegistered));
assert.ok(SCI_CP011_REVIEW_V1.every((question) => question.options.length === 4));
assert.ok(SCI_CP011_REVIEW_V1.every((question) => new Set(question.options).size === 4));
assert.ok(SCI_CP011_REVIEW_V1.every((question) => question.options[question.correctIndex] === question.canonicalAnswer));
assert.ok(SCI_CP011_REVIEW_V1.every((question) => question.sourceIds.length > 0 && question.sourceFactIds.length > 0));
