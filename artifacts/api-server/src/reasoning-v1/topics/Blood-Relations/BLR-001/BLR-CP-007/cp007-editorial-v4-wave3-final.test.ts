import { strict as assert } from "node:assert";
import {
  BLR_CP007_V4_WAVE3_FINAL_REVIEW_AUTHORITY,
  buildBlrCp007EditorialV4Wave3FinalTelemetry,
  generateBlrCp007EditorialV4Wave3FinalBank,
} from "./cp007-editorial-v4-wave3-final";

const bank = generateBlrCp007EditorialV4Wave3FinalBank();
const telemetry = buildBlrCp007EditorialV4Wave3FinalTelemetry(bank);
const answerPositions = [0, 1, 2, 3].map((index) =>
  bank.filter((question) => question.correctIndex === index).length,
);
const sharedSets = new Map<string, typeof bank[number][]>();

assert.equal(BLR_CP007_V4_WAVE3_FINAL_REVIEW_AUTHORITY, "BLR_CP007_V4_WAVE3_FINAL_HUMAN_REVIEW_CANDIDATE");
assert.equal(bank.length, 168);
assert.deepEqual(answerPositions, [42, 42, 42, 42]);
assert.equal(telemetry.semanticAmbiguityCount, 0);
assert.equal(telemetry.malformedLearnerExplanationCount, 0);
assert.equal(telemetry.ql032BlankMeaningMismatchCount, 0);
assert.equal(telemetry.learnerTokenWordOccurrences, 0);
assert.equal(telemetry.codePersonCollisionCount, 0);
assert.equal(telemetry.ql031SinglePositionDerivedDistractorCount, 0);
assert.equal(telemetry.ql033FixedBlankOptionCount, 0);
assert.equal(telemetry.ql034DistinctDecisiveStructureCount, 18);
assert.equal(telemetry.ql034BroadTargetCount, 0);
assert.equal(telemetry.ql034DisconnectedNetworkCount, 0);
assert(telemetry.ql034MaximumStatementCount <= 7);
assert(telemetry.ql034AverageStatementCount <= 6.5);
assert(telemetry.maximumExactShortcutRepeat <= 8);
assert(telemetry.maximumExactTrapRepeat <= 8);
assert(telemetry.averageDisplayedCodeKeySize < 8);
assert(telemetry.maximumDisplayedCodeKeySize <= 8);
assert.equal(telemetry.duplicateStemCount, 0);
assert.equal(telemetry.repeatedStepConclusionCount, 0);

const fingerprints = new Set<string>();
const stems = new Set<string>();
for (const question of bank) {
  assert(!fingerprints.has(question.metadata.v4EditorialFingerprint));
  fingerprints.add(question.metadata.v4EditorialFingerprint);
  assert(!stems.has(question.stem));
  stems.add(question.stem);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.text)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrectAnswerForTask).length, 1);
  assert.equal(question.options[question.correctIndex]!.text, question.answer);
  assert.equal(question.explanation.optionAnalysis.length, 4);
  question.options.forEach((option, index) => {
    assert.equal(question.explanation.optionAnalysis[index]!.optionText, option.text);
    assert.equal(question.explanation.optionAnalysis[index]!.explanation, option.studentExplanation);
  });
  if (question.qlId !== "BLR-QL-035") {
    assert.equal(
      question.options.filter((option) => option.targetRelationSatisfied).length,
      1,
      `${question.itemId}: multiple semantically target-satisfying options`,
    );
    assert.equal(question.options[question.correctIndex]!.targetRelationSatisfied, true);
  }
  const displayedTokens = new Set(question.codeKey.map((entry) => entry.token));
  for (const option of question.options) {
    for (const statement of option.completedStatements) {
      assert(displayedTokens.has(statement.token), `${question.itemId}: ${statement.token} missing from displayed key`);
    }
  }
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.questionBankEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.deepEqual(question.metadata.activeEditorialBlockers, ["HUMAN_EDITORIAL_APPROVAL_PENDING"]);
  const learnerText = JSON.stringify({
    sharedPrompt: question.sharedPrompt,
    stem: question.stem,
    options: question.options.map((option) => ({ text: option.text, explanation: option.studentExplanation })),
    steps: question.explanation.steps,
    conclusion: question.explanation.conclusion,
    shortcut: question.explanation.shortcut,
    commonTrap: question.explanation.commonTrap,
  });
  assert(!/\btoken(?:s)?\b/i.test(learnerText));
  assert(!/\b(?:red|blue|green|white|black|amber|silver|gold)\b/i.test(learnerText));
  assert(!/\bso\s+[A-Z]+\s+is\b[^.]*\bis not established\b/i.test(learnerText));
  assert(!/\bthat\s+[A-Z]+\s+is\b[^.]*\bis not established\b/i.test(learnerText));
  if (question.delivery.mode === "SHARED_SET") {
    const setId = question.delivery.setId!;
    sharedSets.set(setId, [...(sharedSets.get(setId) ?? []), question]);
  }
}

assert.equal(fingerprints.size, 168);
assert.equal(stems.size, 168);
assert.equal(sharedSets.size, 21);
for (const questions of sharedSets.values()) {
  assert.equal(questions.length, 4);
  assert.equal(new Set(questions.map((question) => JSON.stringify(question.codeKey))).size, 1);
  assert.equal(new Set(questions.map((question) => question.sharedPrompt)).size, 1);
}

console.log(JSON.stringify({
  ...telemetry,
  answerPositions,
  uniqueStemCount: stems.size,
  uniqueFingerprintCount: fingerprints.size,
  verdict: "BLR-CP-007 V4 WAVE 3 FINAL CORPUS PASSED; PRODUCT-OWNER APPROVAL REQUIRED",
}, null, 2));
