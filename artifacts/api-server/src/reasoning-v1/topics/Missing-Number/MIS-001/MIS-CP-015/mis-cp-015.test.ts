
import assert from 'node:assert/strict';
import {
  generateMisCp015Question,
  MIS_CP015_CANDIDATE_IDS,
} from './generator';
import {
  independentlyEvaluateMisCp015Rule,
  independentlySolveMisCp015Missing,
} from './independent-solver';
import { MIS_CP015_RULES } from './rule-definitions';

assert.equal(MIS_CP015_RULES.length, 3);

let total = 0;
const positions = [0, 0, 0, 0];
const inversePositions = new Set<string>();

for (const candidateId of MIS_CP015_CANDIDATE_IDS) {
  const numeric = new Set<string>();

  for (let seed = 0; seed < 80; seed += 1) {
    const itemSeed = 'CP015:' + candidateId + ':' + String(seed);
    const question = generateMisCp015Question(candidateId, itemSeed);
    const replay = generateMisCp015Question(candidateId, itemSeed);

    assert.deepEqual(question, replay);
    assert.equal(question.sourceBacked, true);
    assert.equal(question.createsNewSemanticAuthority, true);
    assert.equal(question.semanticAuthorityCandidateId, candidateId);
    assert.equal(question.ambiguityAudit.accepted, true);
    assert.equal(question.ambiguityAudit.survivingRules.length, 1);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(question.options[question.correctIndex]!.value, question.answer);
    assert.ok(question.explanation.includes('So, ? = ' + String(question.answer) + '.'));

    if (question.missingPosition === 'RESULT') {
      assert.equal(
        independentlyEvaluateMisCp015Rule(question.ruleId, question.target.inputs),
        question.answer,
      );
    } else {
      const index =
        question.missingPosition === 'FIRST_INPUT' ? 0 :
        question.missingPosition === 'SECOND_INPUT' ? 1 : 2;
      const visible = question.target.inputs.map((value, inputIndex) =>
        inputIndex === index ? null : value,
      );
      const solved = independentlySolveMisCp015Missing(
        question.ruleId,
        visible,
        question.target.result,
        question.missingPosition,
        2,
        25,
      );
      assert.deepEqual(solved, [question.answer]);
      inversePositions.add(question.missingPosition);
    }

    numeric.add(question.numericFingerprint);
    positions[question.correctIndex] += 1;
    total += 1;
  }

  assert.ok(numeric.size >= 30, candidateId + ': low numeric diversity');
}

assert.equal(total, 240);
assert.ok(
  inversePositions.size >= 2,
  'MIS-CAND-089 should exercise multiple inverse input positions.',
);
assert.ok(Math.max(...positions) / Math.min(...positions) < 1.8);

console.log('MIS-CP-015 SSC source-gap audit passed.', {
  total,
  answerPositions: positions,
  inversePositions: [...inversePositions],
});
