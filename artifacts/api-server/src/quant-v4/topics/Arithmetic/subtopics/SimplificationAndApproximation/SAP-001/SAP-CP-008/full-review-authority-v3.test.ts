import assert from "node:assert/strict";
import "./full-review-authority-v2.test";
import "./authority-v3.test";
import { generateSapCp008ReviewRecords as generateCurrent } from "./full-review-v3";
import { generateSapCp008ReviewRecords as generatePrior } from "./full-review-v2";

const current = generateCurrent();
const prior = generatePrior();
assert.equal(current.length, 300);
assert.equal(prior.length, 300);
const positions = [0, 0, 0, 0];

for (let index = 0; index < current.length; index += 1) {
  const now = current[index]!;
  const before = prior[index]!;
  assert.equal(now.questionId, before.questionId);
  assert.equal(now.prototypeId, before.prototypeId);
  assert.equal(now.seed, before.seed);
  assert.equal(now.stem, before.stem);
  assert.equal(now.canonicalAnswer, before.canonicalAnswer);
  assert.equal(now.correctIndex, before.correctIndex);
  assert.deepEqual(now.options.map((option) => option.value), before.options.map((option) => option.value));
  assert.deepEqual(now.explanation.steps, before.explanation.steps);
  assert.equal(now.validation.ok, true, `${now.questionId}: ${now.validation.errors.join("; ")}`);
  assert.ok(now.explanation.coreConcept.length >= 100);
  assert.equal(now.explanation.verification.length, 2);
  const studentText = JSON.stringify({ explanation: now.explanation, options: now.options });
  assert.doesNotMatch(studentText, /oracle|learner route|CP-008|transformed expression|declared policy|state avoids near-cancellation|scaled terms/i);
  positions[now.correctIndex]! += 1;
}

assert.deepEqual(positions, [75, 75, 75, 75]);
console.log("SAP-CP-008 student-facing full-review authority passed: inherited 300-question mathematics/editorial gate plus explanation remediation across the same selected questions, seeds, stems, answers, options and answer positions.");
