
import assert from 'node:assert/strict';
import { generateMisCp017Question } from './generator';
import { independentlyEvaluateMisCp017Rule, independentlyVerifyMisCp017Group } from './independent-solver';

let total = 0;
const fingerprints = new Set<string>();
const positions = [0, 0, 0, 0];

for (let seed = 0; seed < 100; seed += 1) {
  const itemSeed = 'MIS-CP-017:' + String(seed);
  const question = generateMisCp017Question('MIS-CAND-091', itemSeed);
  const replay = generateMisCp017Question('MIS-CAND-091', itemSeed);

  assert.deepEqual(question, replay);
  assert.equal(question.sourceBacked, true);
  assert.equal(question.createsNewSemanticAuthority, true);
  assert.equal(question.semanticAuthorityCandidateId, 'MIS-CAND-091');
  assert.equal(question.ambiguityAudit.accepted, true);
  assert.deepEqual(
    question.ambiguityAudit.survivingRules,
    ['SECOND_MINUS_HALF_FIRST_PLUS_DIGIT_PRODUCT'],
  );
  assert.ok(question.evidenceGroups.every(independentlyVerifyMisCp017Group));
  assert.equal(
    independentlyEvaluateMisCp017Rule(question.target.first, question.target.second),
    question.answer,
  );
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
  assert.equal(question.options[question.correctIndex]!.value, question.answer);
  assert.equal(question.wholeNumberOrDigitMode, 'MIXED_WHOLE_AND_DIGIT');
  assert.ok(question.explanation.includes('Product of digits'));
  assert.ok(question.explanation.includes('So, ? = ' + String(question.answer) + '.'));

  fingerprints.add(question.numericFingerprint);
  positions[question.correctIndex] += 1;
  total += 1;
}

assert.equal(total, 100);
assert.ok(fingerprints.size >= 50);
assert.ok(Math.max(...positions) / Math.min(...positions) < 1.8);

console.log('MIS-CP-017 SSC CGL mixed digit/whole source audit passed.', {
  total,
  answerPositions: positions,
});
