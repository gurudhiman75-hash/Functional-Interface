import { strict as assert } from "node:assert";
import {
  buildBlrCp007EditorialV4Wave2Telemetry,
  generateBlrCp007EditorialV4Wave2Bank,
} from "./cp007-editorial-v4-wave2";

const bank = generateBlrCp007EditorialV4Wave2Bank();
const telemetry = buildBlrCp007EditorialV4Wave2Telemetry(bank);
const answerPositions = [0, 1, 2, 3].map((index) =>
  bank.filter((question) => question.correctIndex === index).length,
);
const sharedSets = new Map<string, typeof bank[number][]>();
const visibleText = (question: typeof bank[number]): string => JSON.stringify({
  sharedPrompt: question.sharedPrompt,
  stem: question.stem,
  options: question.options.map((option) => ({
    text: option.text,
    explanation: option.studentExplanation,
  })),
  explanation: {
    steps: question.explanation.steps,
    conclusion: question.explanation.conclusion,
    shortcut: question.explanation.shortcut,
    commonTrap: question.explanation.commonTrap,
    optionAnalysis: question.explanation.optionAnalysis.map((analysis) => analysis.explanation),
    familySummary: question.explanation.familyTree.accessibleSummary,
    familyAscii: question.explanation.familyTree.asciiFallback,
  },
});

assert.equal(bank.length, 168);
assert.deepEqual(telemetry.qlCounts, {
  "BLR-QL-031": 48,
  "BLR-QL-032": 32,
  "BLR-QL-033": 24,
  "BLR-QL-034": 32,
  "BLR-QL-035": 32,
});
assert.deepEqual(telemetry.keyStyleCounts, { SYMBOL: 139, LETTER: 29 });
assert.deepEqual(telemetry.dispositionCounts, {
  FOUNDATION_PRACTICE: 32,
  RELEASE_CANDIDATE: 136,
  REMEDIATION_HOLD: 0,
});
assert.equal(telemetry.sharedSetCount, 21);
assert.equal(telemetry.sharedSetQuestionCount, 84);
assert.equal(telemetry.standaloneQuestionCount, 84);
assert.equal(telemetry.neutralWordCodeQuestions, 0);
assert.equal(telemetry.colourTokenOccurrences, 0);
assert.equal(telemetry.ql034DisconnectedNetworkCount, 0);
assert.equal(telemetry.duplicateStemCount, 0);
assert.equal(telemetry.repeatedStepConclusionCount, 0);
assert.deepEqual(answerPositions, [42, 42, 42, 42]);

const itemIds = new Set<string>();
const editorialFingerprints = new Set<string>();
for (const question of bank) {
  assert(!itemIds.has(question.itemId));
  itemIds.add(question.itemId);
  assert(!editorialFingerprints.has(question.metadata.v4EditorialFingerprint));
  editorialFingerprints.add(question.metadata.v4EditorialFingerprint);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.text)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrectAnswerForTask).length, 1);
  assert.equal(question.options[question.correctIndex]!.text, question.answer);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.questionBankEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.metadata.activeEditorialBlockers.includes("HUMAN_EDITORIAL_APPROVAL_PENDING"), true);
  assert.equal(question.explanation.optionAnalysis.length, 4);
  question.options.forEach((option, index) => {
    assert.equal(question.explanation.optionAnalysis[index]!.explanation, option.studentExplanation);
  });
  assert(!question.explanation.steps.includes(question.explanation.conclusion));

  const learnerText = visibleText(question);
  assert(!/\b(?:red|blue|green|white|black|amber|silver|gold)\b/i.test(learnerText));
  assert(!/\b(?:WRONG_|CLAIM_|BROKEN_CHAIN|TOKENS_SWAPPED|FIRST_TOKEN_WRONG|SECOND_TOKEN_WRONG)\b/.test(learnerText));
  assert(!/<strong>Therefore:<\/strong>\s*Therefore/i.test(learnerText));
  assert(!/\bto make\s+[A-Z]+\s+is\b/i.test(question.stem));
  assert(!/\binferred parent\b/i.test(learnerText));

  if (question.metadata.disposition === "FOUNDATION_PRACTICE") {
    assert.equal(question.metadata.recommendedUse, "GUIDED_PRACTICE");
    assert.equal(question.metadata.difficulty, "EASY");
  } else {
    assert.equal(question.metadata.disposition, "RELEASE_CANDIDATE");
    assert(["STANDARD_MOCK", "ADVANCED_PRACTICE"].includes(question.metadata.recommendedUse));
  }

  if (question.qlId === "BLR-QL-034") {
    assert.equal(question.metadata.candidateNetworkComponentCount, 1);
    assert.equal(question.options.every((option) => option.graphValidity === "VALID"), true);
    assert(question.explanation.steps.length >= 2);
  }

  if (question.delivery.mode === "SHARED_SET") {
    assert.equal(question.delivery.promptPlacement, "SET_HEADER");
    assert.equal(question.delivery.renderSharedPromptOnce, true);
    const setId = question.delivery.setId!;
    sharedSets.set(setId, [...(sharedSets.get(setId) ?? []), question]);
  } else {
    assert.equal(question.delivery.promptPlacement, "ITEM");
    assert.equal(question.delivery.renderSharedPromptOnce, false);
  }
}

assert.equal(itemIds.size, 168);
assert.equal(editorialFingerprints.size, 168);
assert.equal(sharedSets.size, 21);
for (const questions of sharedSets.values()) {
  assert.equal(questions.length, 4);
  assert.equal(new Set(questions.map((question) => question.sharedPrompt)).size, 1);
  assert.equal(new Set(questions.map((question) => JSON.stringify(question.codeKey))).size, 1);
  assert.deepEqual(questions.map((question) => question.delivery.itemNumber).sort(), [1, 2, 3, 4]);
}

console.log(JSON.stringify({
  ...telemetry,
  answerPositions,
  finalReviewRecordCount: bank.length,
  finalReviewUniqueStemCount: new Set(bank.map((question) => question.stem)).size,
  finalReviewUniqueEditorialFingerprintCount: editorialFingerprints.size,
  verdict: "BLR-CP-007 EDITORIAL V4 FINAL 168-QUESTION REVIEW PACK PASSED; HUMAN APPROVAL REQUIRED",
}, null, 2));
