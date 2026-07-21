import assert from "node:assert/strict";
import test from "node:test";

import { ContentReviewError } from "./admin-content-review";
import {
  computeChapterReadiness,
  contentIntelligenceReportHash,
  duplicatePairKey,
  findDuplicateCandidates,
  hasUnresolvedPlaceholder,
  lexicalSemanticSimilarity,
  normalizeChapterFreezeInput,
  normalizeDuplicateDecisionInput,
  normalizeQuestionTemplate,
  type IntelligenceQuestionSnapshot,
} from "./admin-content-intelligence";

const baseQuestion: IntelligenceQuestionSnapshot = {
  id: "11111111-1111-4111-8111-111111111111",
  publicCode: "Q-001",
  status: "approved",
  versionId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  stem: "A shopkeeper increases the price of an article from ₹500 to ₹650. Find the percentage increase.",
  explanation: "Increase is ₹150. Percentage increase is 150/500 × 100 = 30%.",
  questionType: "mcq_single",
  difficulty: "easy",
  options: [{ text: "30%", isCorrect: true }],
  updatedAt: "2026-07-21T00:00:00.000Z",
  testUsageCount: 1,
};

function question(overrides: Partial<IntelligenceQuestionSnapshot>): IntelligenceQuestionSnapshot {
  return { ...baseQuestion, ...overrides };
}

test("template normalization replaces changing numeric values", () => {
  assert.equal(
    normalizeQuestionTemplate("Price rises from ₹500 to ₹650, an increase of 30%."),
    "price rises from {money} to {money} an increase of {percent}",
  );
});

test("duplicate scan identifies exact, template and near-semantic pairs", () => {
  const exact = question({
    id: "22222222-2222-4222-8222-222222222222",
    publicCode: "Q-002",
  });
  const template = question({
    id: "33333333-3333-4333-8333-333333333333",
    publicCode: "Q-003",
    stem: "A shopkeeper increases the price of an article from ₹800 to ₹1040. Find the percentage increase.",
    explanation: "Increase is ₹240 and the percentage increase is 30%.",
  });
  const semantic = question({
    id: "44444444-4444-4444-8444-444444444444",
    publicCode: "Q-004",
    stem: "The price of an article sold by a shopkeeper rises from ₹500 to ₹650. What is the percentage rise?",
  });
  const candidates = findDuplicateCandidates([baseQuestion, exact, template, semantic]);
  assert.equal(candidates.some((candidate) => candidate.kind === "exact"), true);
  assert.equal(candidates.some((candidate) => candidate.kind === "template"), true);
  assert.equal(candidates.some((candidate) => candidate.kind === "semantic"), true);
  assert.equal(lexicalSemanticSimilarity(baseQuestion.stem, semantic.stem) >= 0.78, true);
});

test("resolved editorial variants do not change deterministic pair identity", () => {
  assert.equal(
    duplicatePairKey("22222222-2222-4222-8222-222222222222", "11111111-1111-4111-8111-111111111111"),
    "11111111-1111-4111-8111-111111111111:22222222-2222-4222-8222-222222222222",
  );
});

test("chapter readiness blocks critical quality failures", () => {
  const readiness = computeChapterReadiness({
    questionCount: 10,
    approvedQuestionCount: 8,
    targetCoverage: 12,
    unresolvedPlaceholderCount: 1,
    unresolvedCriticalDuplicateCount: 2,
    unresolvedWarningDuplicateCount: 3,
    openCommentCount: 1,
    testUsageCount: 0,
    scanTruncated: false,
  });
  assert.equal(readiness.ready, false);
  assert.deepEqual(
    readiness.blockers.map((blocker) => blocker.code),
    ["COVERAGE_SHORTFALL", "QUESTIONS_NOT_APPROVED", "UNRESOLVED_PLACEHOLDERS", "CRITICAL_DUPLICATES", "OPEN_REVIEW_COMMENTS"],
  );
  assert.equal(readiness.warnings.some((warning) => warning.code === "NEAR_DUPLICATES"), true);
});

test("clean approved chapters become freeze ready", () => {
  assert.deepEqual(computeChapterReadiness({
    questionCount: 20,
    approvedQuestionCount: 20,
    targetCoverage: 20,
    unresolvedPlaceholderCount: 0,
    unresolvedCriticalDuplicateCount: 0,
    unresolvedWarningDuplicateCount: 0,
    openCommentCount: 0,
    testUsageCount: 5,
    scanTruncated: false,
  }), { ready: true, blockers: [], warnings: [] });
});

test("placeholder detection covers supported unresolved token styles", () => {
  assert.equal(hasUnresolvedPlaceholder("Find {{answer}} from the data."), true);
  assert.equal(hasUnresolvedPlaceholder("Find ${value} from the data."), true);
  assert.equal(hasUnresolvedPlaceholder("Find [[VALUE]] from the data."), true);
  assert.equal(hasUnresolvedPlaceholder("Find the value from the data."), false);
});

test("decision and freeze inputs require audited reasons", () => {
  assert.throws(
    () => normalizeDuplicateDecisionInput({
      chapterNodeId: baseQuestion.id,
      leftQuestionId: baseQuestion.id,
      rightQuestionId: "22222222-2222-4222-8222-222222222222",
      decision: "duplicate",
      canonicalQuestionId: baseQuestion.id,
      reason: "x",
    }),
    (error) => error instanceof ContentReviewError && error.code === "DUPLICATE_REASON_REQUIRED",
  );
  assert.deepEqual(normalizeChapterFreezeInput({ action: "freeze", reason: "All blocking checks passed" }), {
    action: "freeze",
    reason: "All blocking checks passed",
  });
});

test("report hashes are stable across object key order", () => {
  assert.equal(contentIntelligenceReportHash({ b: 2, a: 1 }), contentIntelligenceReportHash({ a: 1, b: 2 }));
});
