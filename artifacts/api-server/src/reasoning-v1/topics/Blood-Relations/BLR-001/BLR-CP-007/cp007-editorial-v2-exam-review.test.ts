import { strict as assert } from "node:assert";
import {
  buildBlrCp007EditorialV2ExamReviewTelemetry,
  generateBlrCp007EditorialV2ExamReviewBank,
  generateBlrCp007EditorialV2ExamReviewQuestion,
} from "./cp007-editorial-v2-exam-review";

const bank = generateBlrCp007EditorialV2ExamReviewBank();
const telemetry = buildBlrCp007EditorialV2ExamReviewTelemetry(bank);

assert.equal(bank.length, 168);
assert.equal(telemetry.recordCount, 168);
assert.equal(telemetry.prototypeCount, 21);
assert.equal(telemetry.authorityCount, 5);
assert.equal(telemetry.permanentQlCount, 5);
assert.deepEqual(telemetry.answerPositions, [41, 45, 42, 40]);
assert.deepEqual(telemetry.missingPersonCorrectLabelCounts, {
  P: 8,
  Q: 8,
  R: 8,
  S: 8,
});
assert.equal(telemetry.optionAnalysisCount, 672);
assert.equal(telemetry.uniqueQuestionSignatureCount, 168);
assert.equal(telemetry.invalidStatementQuestionCount, 16);
assert.equal(telemetry.humanReviewRequired, true);

let optionCount = 0;
let wrongOptionCount = 0;
let validWrongGraphCount = 0;
let repairedOptionCount = 0;
const ids = new Set<string>();
const fingerprints = new Set<string>();

for (const question of bank) {
  assert(!ids.has(question.itemId), `${question.itemId}: duplicate ID`);
  assert(!fingerprints.has(question.metadata.semanticFingerprint), `${question.itemId}: duplicate fingerprint`);
  ids.add(question.itemId);
  fingerprints.add(question.metadata.semanticFingerprint);

  const replay = generateBlrCp007EditorialV2ExamReviewQuestion(
    question.sourcePrototypeId,
    question.seed,
  );
  assert.deepEqual(replay, question, `${question.itemId}: deterministic replay`);

  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.text)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrectAnswerForTask).length, 1);
  assert.equal(question.options[question.correctIndex]!.text, question.answer);
  assert.equal(question.explanation.optionAnalysis.length, 4);

  question.options.forEach((option, index) => {
    optionCount += 1;
    assert.equal(option.graphValidity, "VALID", `${question.itemId}: invalid graph at option ${index}`);
    assert(!["INVALID_FAMILY_GRAPH", "SELF_RELATION", "GENDER_CONTRADICTION"].includes(option.failureCode ?? ""),
      `${question.itemId}: impossible-graph failure code survived`);
    if (!option.isCorrectAnswerForTask) {
      wrongOptionCount += 1;
      validWrongGraphCount += 1;
      assert(option.failureCode, `${question.itemId}: wrong option has no exact failure code`);
      assert(option.studentExplanation.length >= 25);
    }
    if (option.semanticKey.startsWith("REPAIRED::")) repairedOptionCount += 1;
    const analysis = question.explanation.optionAnalysis[index]!;
    assert.equal(analysis.optionText, option.text);
    assert.equal(analysis.failureCode, option.failureCode);
    assert.equal(analysis.explanation, option.studentExplanation);
  });
}

assert.equal(optionCount, 672);
assert.equal(wrongOptionCount, 504);
assert.equal(validWrongGraphCount, 504);
assert(repairedOptionCount >= 20, `Expected at least 20 repaired distractors, got ${repairedOptionCount}.`);

console.log(JSON.stringify({
  ...telemetry,
  optionCount,
  wrongOptionCount,
  validWrongGraphCount,
  invalidGraphOptions: 0,
  repairedOptionCount,
  verdict: "BLR-CP-007 EDITORIAL V2 DISTRACTORS ARE ALL GRAPH-VALID AND HUMAN REVIEW REMAINS REQUIRED",
}, null, 2));
