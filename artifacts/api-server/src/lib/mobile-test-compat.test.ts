import assert from "node:assert/strict";
import test from "node:test";

import { stablePublishedQuestionId } from "./published-test-runner";
import {
  legacyMobileQuestion,
  legacyMobileSection,
  legacyMobileTest,
  normalizeMobileDifficulty,
  normalizeMobileTestKind,
} from "./mobile-test-compat";

test("canonical test metadata maps to the legacy mobile contract", () => {
  const section = legacyMobileSection({
    id: "44705b5e-1da0-423b-bf3c-c4fb9f89d9a4",
    sectionKey: "section-1",
    name: "Quantitative Aptitude",
  });

  const mapped = legacyMobileTest({
    id: "f804ca83-b1d1-47fe-adc6-8e670312a87b",
    title: "SSC CHSL 1",
    description: "CHSL full mock",
    durationSeconds: 3600,
    questionCount: 14,
    marksPerQuestion: 2,
    negativeMarks: 0.5,
    examFamilyCode: "SSC",
    examFamilyName: "Staff Selection Commission",
    examCode: "SSC_CHSL",
    examName: "SSC CHSL",
    languages: ["en", "hi"],
    paidAccessRequired: false,
    settings: {
      access: "free",
      testType: "full_mock",
      difficulty: "Moderate",
      languageCode: "en",
    },
  }, [section]);

  assert.equal(mapped.id, "f804ca83-b1d1-47fe-adc6-8e670312a87b");
  assert.equal(mapped.categoryId, "SSC");
  assert.equal(mapped.subcategoryId, "SSC_CHSL");
  assert.equal(mapped.access, "free");
  assert.equal(mapped.kind, "full-length");
  assert.equal(mapped.duration, 60);
  assert.equal(mapped.totalQuestions, 14);
  assert.equal(mapped.marksPerQuestion, 2);
  assert.equal(mapped.negativeMarks, 0.5);
  assert.equal(mapped.difficulty, "Medium");
  assert.deepEqual(mapped.languages, ["en", "hi"]);
  assert.equal(mapped.sections.length, 1);
});

test("canonical question rows map to stable integer mobile ids and ordered answers", () => {
  const versionId = "878595e5-58ec-4230-8a47-ba13dbd6f528";
  const mapped = legacyMobileQuestion({
    questionVersionId: versionId,
    publicCode: "Q-20260723-2B0A9F6270",
    sectionName: "Section 1",
    position: 1,
    marks: 2,
    questionType: "mcq_single",
    difficulty: "Medium",
    stem: "Aman and Bhavna start a business...",
    explanation: "Calculate each investment-time product.",
    answerModel: { correctIndex: 3, correctOptionKey: "D" },
    options: [
      { key: "D", text: "60000", sortOrder: 4, isCorrect: true },
      { key: "B", text: "59900", sortOrder: 2, isCorrect: false },
      { key: "A", text: "60100", sortOrder: 1, isCorrect: false },
      { key: "C", text: "60050", sortOrder: 3, isCorrect: false },
    ],
  }, 0);

  assert.equal(mapped.id, stablePublishedQuestionId(versionId));
  assert.ok(Number.isInteger(mapped.id));
  assert.deepEqual(mapped.options, ["60100", "59900", "60050", "60000"]);
  assert.equal(mapped.correct, 3);
  assert.equal(mapped.section, "Section 1");
  assert.equal(mapped.questionType, "text");
  assert.equal(mapped.marks, 2);
});

test("mobile compatibility normalization remains tolerant of canonical vocabulary", () => {
  assert.equal(normalizeMobileDifficulty("Moderate"), "Medium");
  assert.equal(normalizeMobileDifficulty("advanced"), "Hard");
  assert.equal(normalizeMobileTestKind("full_mock"), "full-length");
  assert.equal(normalizeMobileTestKind("sectional_test"), "sectional");
  assert.equal(normalizeMobileTestKind("topic_practice"), "topic-wise");
});
