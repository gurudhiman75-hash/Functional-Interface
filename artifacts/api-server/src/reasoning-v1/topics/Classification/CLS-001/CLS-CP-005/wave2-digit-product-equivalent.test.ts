import assert from "node:assert/strict";
import { generateClsCp005DigitProductEquivalentQuestion } from "./wave2-digit-product-equivalent-runtime";

const fingerprints = new Set<string>();
const answerPositions = [0, 0, 0, 0, 0];
let maximumAttempt = 0;

for (let seed = 0; seed < 240; seed += 1) {
  const optionCount = seed % 3 === 0 ? 5 : 4;
  const question = generateClsCp005DigitProductEquivalentQuestion(seed, optionCount);
  const replay = generateClsCp005DigitProductEquivalentQuestion(seed, optionCount);
  assert.deepEqual(question, replay);
  assert.equal(question.task, "SELECT_EQUIVALENT_NUMBER_SET");
  assert.equal(question.options.length, optionCount);
  assert.equal(question.expandedAmbiguityAudit.result, "EXPANDED_UNIQUE");
  assert.equal(question.expandedAmbiguityAudit.answerIndex, question.correctIndex);
  assert.equal(question.presentationQualityAudit.result, "PASS");
  assert.notEqual(question.referenceTuple[0], question.tuples[question.correctIndex]![0]);
  assert.notEqual(question.referenceTuple[1], question.tuples[question.correctIndex]![1]);
  assert.ok(question.explanation.stepByStep[0]!.includes("establishes the reference rule"));
  assert.ok(question.explanation.commonTrapWarning[0]!.includes("match the relation"));
  assert.equal(question.evidenceByOption.filter((line) => line.includes("✅ Matches reference rule.")).length, 1);
  assert.equal(question.evidenceByOption.filter((line) => line.includes("❌ Does not match reference rule.")).length, optionCount - 1);
  assert.ok(question.evidenceByOption.every((line) => line.indexOf("\\(") > line.indexOf(": ")));
  assert.equal(question.metadata.completeRuleCount, 35);
  fingerprints.add(JSON.stringify({ reference: question.referenceTuple, tuples: question.tuples, answer: question.answer }));
  answerPositions[question.correctIndex] += 1;
  maximumAttempt = Math.max(maximumAttempt, question.metadata.sourceAttempt);
}

assert.ok(fingerprints.size >= 220);
assert.ok(answerPositions.every((count) => count > 0));
assert.ok(maximumAttempt < 2000);

console.log("CLS-CP-005 digit-product equivalent-set naturalness audit passed.", {
  generated: 240,
  unique: fingerprints.size,
  answerPositions,
  maximumAttempt,
  completeRuleCount: 35,
});
