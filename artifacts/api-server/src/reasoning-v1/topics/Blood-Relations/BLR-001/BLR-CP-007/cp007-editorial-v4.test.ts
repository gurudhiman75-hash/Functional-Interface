import { strict as assert } from "node:assert";
import {
  buildBlrCp007EditorialV4Telemetry,
  generateBlrCp007EditorialV4Bank,
} from "./cp007-editorial-v4";
import type { GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";

const bank = generateBlrCp007EditorialV4Bank();
const telemetry = buildBlrCp007EditorialV4Telemetry(bank);

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
  RELEASE_CANDIDATE: 104,
  REMEDIATION_HOLD: 32,
});
assert.deepEqual(telemetry.difficultyCounts, {
  EASY: 32,
  MEDIUM: 118,
  HARD: 18,
});
assert.deepEqual(telemetry.recommendedUseCounts, {
  GUIDED_PRACTICE: 32,
  STANDARD_MOCK: 92,
  ADVANCED_PRACTICE: 12,
  NOT_ELIGIBLE: 32,
});
assert.equal(telemetry.sharedSetCount, 21);
assert.equal(telemetry.sharedSetQuestionCount, 84);
assert.equal(telemetry.standaloneQuestionCount, 84);
assert.equal(telemetry.neutralWordCodeQuestions, 0);
assert.equal(telemetry.colourTokenOccurrences, 0);
assert.equal(telemetry.duplicateStemCount, 0);
assert.equal(telemetry.repeatedStepConclusionCount, 0);
assert(telemetry.maximumExactShortcutRepeat <= 12);
assert(telemetry.maximumExactTrapRepeat <= 12);
assert.equal(telemetry.ql034DisconnectedNetworkCount, 32);

const fingerprints = new Set<string>();
const sets = new Map<string, GeneratedBlrCp007EditorialV4Question[]>();
for (const question of bank) {
  assert(!fingerprints.has(question.metadata.v4EditorialFingerprint));
  fingerprints.add(question.metadata.v4EditorialFingerprint);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.text)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrectAnswerForTask).length, 1);
  assert.equal(question.options[question.correctIndex]!.text, question.answer);
  assert.equal(question.metadata.neutralWordCodesRemoved, true);
  assert.equal(question.metadata.explanationRemodelled, true);
  assert.equal(question.metadata.difficultyRecalibratedByReasoningDepth, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.questionBankEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert(!/\b(?:red|blue|green|white|black|amber|silver|gold)\b/i.test(JSON.stringify(question)));
  assert(!question.explanation.steps.includes(question.explanation.conclusion));
  assert(!/^Therefore\b/i.test(question.explanation.conclusion));
  assert(question.explanation.shortcut);
  assert(question.explanation.commonTrap);
  assert(!/\b(?:WRONG_|CLAIM_|BROKEN_CHAIN|TOKENS_SWAPPED)\b/.test(question.explanation.optionAnalysis.map((analysis) => analysis.explanation).join(" ")));
  question.explanation.optionAnalysis.forEach((analysis, index) => {
    assert.equal(analysis.explanation, question.options[index]!.studentExplanation);
  });

  if (question.delivery.mode === "SHARED_SET") {
    assert.equal(question.delivery.promptPlacement, "SET_HEADER");
    assert.equal(question.delivery.renderSharedPromptOnce, true);
    const setId = question.delivery.setId!;
    sets.set(setId, [...(sets.get(setId) ?? []), question]);
  } else {
    assert.equal(question.delivery.promptPlacement, "ITEM");
    assert.equal(question.delivery.renderSharedPromptOnce, false);
  }

  if (question.metadata.disposition === "FOUNDATION_PRACTICE") {
    assert.equal(question.metadata.recommendedUse, "GUIDED_PRACTICE");
    assert.equal(question.metadata.difficulty, "EASY");
  }
  if (question.metadata.disposition === "RELEASE_CANDIDATE") {
    assert(["STANDARD_MOCK", "ADVANCED_PRACTICE"].includes(question.metadata.recommendedUse));
  }
  if (question.qlId === "BLR-QL-034") {
    assert.equal(question.metadata.disposition, "REMEDIATION_HOLD");
    assert.equal(question.metadata.recommendedUse, "NOT_ELIGIBLE");
    assert((question.metadata.candidateNetworkComponentCount ?? 0) > 1);
    assert(question.metadata.activeEditorialBlockers.includes("DISCONNECTED_CANDIDATE_NETWORK"));
  }
}

assert.equal(sets.size, 21);
for (const questions of sets.values()) {
  assert.equal(questions.length, 4);
  assert.equal(new Set(questions.map((question) => question.sharedPrompt)).size, 1);
  assert.equal(new Set(questions.map((question) => JSON.stringify(question.codeKey))).size, 1);
  assert.deepEqual(questions.map((question) => question.delivery.itemNumber).sort(), [1, 2, 3, 4]);
}

console.log(JSON.stringify({
  ...telemetry,
  verdict: "BLR-CP-007 EDITORIAL V4 WAVE 1 PASSED; 104 RELEASE CANDIDATES, 32 FOUNDATION ITEMS, AND 32 QL-034 REMEDIATION HOLDS; HUMAN APPROVAL REQUIRED",
}, null, 2));
