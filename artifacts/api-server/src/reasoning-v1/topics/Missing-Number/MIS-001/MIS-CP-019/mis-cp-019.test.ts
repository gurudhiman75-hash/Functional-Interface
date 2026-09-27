
import assert from 'node:assert/strict';
import {
  generateMisCp019Question,
  MIS_CP019_CANDIDATE_IDS,
} from './generator';
import {
  independentlyEvaluateMisCp019Rule,
  independentlyVerifyMisCp019Group,
} from './independent-solver';
import { MIS_CP019_RULES } from './rule-definitions';

assert.equal(MIS_CP019_RULES.length, 5);

let total = 0;
const positions = [0, 0, 0, 0];

for (const candidateId of MIS_CP019_CANDIDATE_IDS) {
  const fingerprints = new Set<string>();

  for (let seed = 0; seed < 80; seed += 1) {
    const itemSeed = 'MIS-CP-019:' + candidateId + ':' + String(seed);
    const question = generateMisCp019Question(candidateId, itemSeed);
    const replay = generateMisCp019Question(candidateId, itemSeed);

    assert.deepEqual(question, replay);
    assert.equal(question.sourceBacked, true);
    assert.equal(question.createsNewSemanticAuthority, true);
    assert.equal(question.semanticAuthorityCandidateId, candidateId);
    assert.equal(question.ambiguityAudit.accepted, true);
    assert.equal(question.ambiguityAudit.survivingRules.length, 1);
    assert.equal(question.ambiguityAudit.survivingRules[0], question.ruleId);
    assert.ok(
      question.evidenceGroups.every((group) =>
        independentlyVerifyMisCp019Group(question.ruleId, group, question.context),
      ),
    );
    assert.equal(
      independentlyEvaluateMisCp019Rule(
        question.ruleId,
        question.target.inputs,
        question.context,
      ),
      question.answer,
    );
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(question.options[question.correctIndex]!.value, question.answer);
    assert.ok(question.explanation.includes('So, ? = ' + String(question.answer) + '.'));
    assert.equal(question.forwardOrInverse, 'FORWARD');
    assert.equal(question.missingPosition, 'RESULT');

    if (candidateId === 'MIS-CAND-097') assert.equal(question.context.k, 2);
    if (candidateId === 'MIS-CAND-099') assert.equal(question.context.k, 5);
    if (candidateId === 'MIS-CAND-100') {
      assert.equal(question.context.k, 2);
      assert.equal(question.operandCount, 4);
      assert.ok(question.target.inputs.length === 4);
    }

    fingerprints.add(question.numericFingerprint);
    positions[question.correctIndex] += 1;
    total += 1;
  }

  assert.ok(fingerprints.size >= 35, candidateId + ': low numeric diversity');
}

assert.equal(total, 400);
assert.ok(Math.max(...positions) / Math.min(...positions) < 1.8);

console.log('MIS-CP-019 SSC source-gap audit passed.', {
  total,
  answerPositions: positions,
});
