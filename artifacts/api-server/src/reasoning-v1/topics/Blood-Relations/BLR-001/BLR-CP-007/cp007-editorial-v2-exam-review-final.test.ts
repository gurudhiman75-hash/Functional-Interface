import { strict as assert } from "node:assert";
import {
  buildBlrCp007EditorialV2ExamReviewFinalTelemetry,
  generateBlrCp007EditorialV2ExamReviewFinalBank,
  generateBlrCp007EditorialV2ExamReviewFinalQuestion,
} from "./cp007-editorial-v2-exam-review-final";

const bank = generateBlrCp007EditorialV2ExamReviewFinalBank();
const telemetry = buildBlrCp007EditorialV2ExamReviewFinalTelemetry(bank);

assert.equal(bank.length, 168);
assert.equal(telemetry.recordCount, 168);
assert.equal(telemetry.prototypeCount, 21);
assert.equal(telemetry.authorityCount, 5);
assert.equal(telemetry.permanentQlCount, 5);
assert.deepEqual(telemetry.answerPositions, [41, 45, 42, 40]);
assert.deepEqual(telemetry.missingPersonCorrectLabelCounts, { P: 8, Q: 8, R: 8, S: 8 });
assert.equal(telemetry.optionAnalysisCount, 672);
assert.equal(telemetry.uniqueQuestionSignatureCount, 168);
assert.equal(telemetry.humanReviewRequired, true);

let optionCount = 0;
let wrongOptionCount = 0;
let repairedOptions = 0;
let remodelledKeyQuestions = 0;
let graphFriendlyKeyChanges = 0;
const ids = new Set<string>();
const fingerprints = new Set<string>();

for (const question of bank) {
  assert(!ids.has(question.itemId), `${question.itemId}: duplicate ID`);
  assert(!fingerprints.has(question.metadata.semanticFingerprint), `${question.itemId}: duplicate fingerprint`);
  ids.add(question.itemId);
  fingerprints.add(question.metadata.semanticFingerprint);
  assert.deepEqual(
    generateBlrCp007EditorialV2ExamReviewFinalQuestion(question.sourcePrototypeId, question.seed),
    question,
    `${question.itemId}: deterministic replay`,
  );
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.text)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrectAnswerForTask).length, 1);
  assert.equal(question.options[question.correctIndex]!.text, question.answer);
  assert.equal(question.explanation.optionAnalysis.length, 4);

  if (question.sourcePrototypeId === "BLR-CP007-PROT-MISSING-TOKEN-FIRST-LINK") {
    remodelledKeyQuestions += 1;
    assert(!question.codeKey.some((entry) => entry.relationId === "WIFE"));
    if (question.codeKey.some((entry) => entry.relationId === "HUSBAND")) {
      graphFriendlyKeyChanges += 1;
      assert(/husband/.test(question.sharedPrompt));
      assert(question.options.some((option) =>
        option.semanticKey.startsWith("KEY_REPAIRED::"),
      ));
    }
  }

  question.options.forEach((option, index) => {
    optionCount += 1;
    assert.equal(option.graphValidity, "VALID", `${question.itemId}: invalid option ${index}`);
    assert(!["INVALID_FAMILY_GRAPH", "SELF_RELATION", "GENDER_CONTRADICTION"].includes(option.failureCode ?? ""));
    if (!option.isCorrectAnswerForTask) {
      wrongOptionCount += 1;
      assert(option.failureCode);
      assert(option.studentExplanation.length >= 25);
    }
    if (option.semanticKey.startsWith("REPAIRED::") || option.semanticKey.startsWith("KEY_REPAIRED::")) {
      repairedOptions += 1;
    }
    const analysis = question.explanation.optionAnalysis[index]!;
    assert.equal(analysis.optionText, option.text);
    assert.equal(analysis.failureCode, option.failureCode);
    assert.equal(analysis.explanation, option.studentExplanation);
  });
}

assert.equal(optionCount, 672);
assert.equal(wrongOptionCount, 504);
assert.equal(remodelledKeyQuestions, 8);
assert(graphFriendlyKeyChanges >= 3, `Expected at least three spouse-token key remodellings, got ${graphFriendlyKeyChanges}.`);
assert(repairedOptions >= 20, `Expected at least 20 remediated options, got ${repairedOptions}.`);

console.log(JSON.stringify({
  ...telemetry,
  optionCount,
  wrongOptionCount,
  validWrongGraphOptions: wrongOptionCount,
  invalidGraphOptions: 0,
  repairedOptions,
  remodelledKeyQuestions,
  graphFriendlyKeyChanges,
  verdict: "BLR-CP-007 EDITORIAL V2 FINAL EXAM-REVIEW BANK HAS FOUR GRAPH-VALID OPTIONS PER QUESTION; HUMAN APPROVAL REQUIRED",
}, null, 2));
