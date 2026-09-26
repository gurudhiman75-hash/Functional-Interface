import assert from 'node:assert/strict';
import { generateMisCp002Question, MIS_CP002_CANDIDATE_IDS } from './generator';
import {
  independentlyEvaluateMisCp002Rule,
  matchingMisCp002Rules,
} from './independent-solver';
import {
  MIS_CP002_RULES,
  misCp002ContextKey,
  misCp002ContextUsesAllInputs,
} from './rule-definitions';

assert.equal(MIS_CP002_RULES.length, 7);
assert.equal(MIS_CP002_CANDIDATE_IDS.length, 7);
assert.equal(new Set(MIS_CP002_CANDIDATE_IDS).size, 7);
assert.deepEqual(
  MIS_CP002_CANDIDATE_IDS,
  Array.from({ length: 7 }, (_, index) => `MIS-CAND-${String(index + 9).padStart(3, '0')}`),
);
for (const rule of MIS_CP002_RULES) {
  assert.ok(rule.contexts.length >= 1);
  assert.ok(rule.contexts.every(misCp002ContextUsesAllInputs), `${rule.ruleId}: every context must use all three displayed inputs`);
}

const answerPositions = [0, 0, 0, 0];
const difficultyCounts = new Map<string, number>();
const evidenceCounts = new Set<number>();
const globalStructuralFingerprints = new Set<string>();
const productAdjustSigns = new Set<number>();
let generatedCount = 0;

for (const candidateId of MIS_CP002_CANDIDATE_IDS) {
  const candidateNumericFingerprints = new Set<string>();
  const candidateContexts = new Set<string>();
  for (let seed = 0; seed < 80; seed += 1) {
    const runtimeSeed = `MIS-CP002-TEST:${candidateId}:${seed}`;
    const first = generateMisCp002Question(candidateId, runtimeSeed);
    const replay = generateMisCp002Question(candidateId, runtimeSeed);

    assert.deepEqual(first, replay, `${candidateId}/${seed}: generation must be deterministic`);
    assert.equal(first.packageId, 'MIS-001');
    assert.equal(first.checkpointId, 'MIS-CP-002');
    assert.equal(first.candidateId, candidateId);
    assert.equal(first.provisionalQl, true);
    assert.equal(first.operandCount, 3);
    assert.equal(first.operationDepth, 2);
    assert.equal(first.missingPosition, 'RESULT_MISSING');
    assert.ok(first.evidenceGroups.length === 2 || first.evidenceGroups.length === 3);
    assert.equal(first.groupCount, first.evidenceGroups.length + 1);
    evidenceCounts.add(first.evidenceGroups.length);

    for (const group of [...first.evidenceGroups, first.target]) {
      assert.equal(new Set([group.first, group.second, group.third]).size, 3);
    }

    assert.equal(first.ambiguityAudit.accepted, true, `${candidateId}/${seed}: ambiguity audit rejected`);
    const matches = matchingMisCp002Rules(first.evidenceGroups);
    assert.equal(
      new Set(matches.map((match) => match.semanticKey)).size,
      1,
      `${candidateId}/${seed}: more than one three-input semantic rule survived`,
    );

    const solvedTarget = independentlyEvaluateMisCp002Rule(
      first.ruleId,
      [first.target.first, first.target.second, first.target.third],
      first.context,
    );
    assert.equal(solvedTarget, first.answer);
    assert.equal(first.target.result, first.answer);
    assert.ok(Number.isInteger(first.answer));
    assert.ok(first.answer > 0 && first.answer <= 999);
    if (first.ruleId === 'PAIR_PRODUCT_DIVIDE_THIRD' || first.ruleId === 'PAIR_SUM_DIVIDE_THIRD') {
      assert.ok(first.answer > 1, `${candidateId}/${seed}: division result 1 is too trivial for CP002`);
    }

    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => option.value)).size, 4);
    assert.equal(first.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(first.options[first.correctIndex]!.value, first.answer);
    for (const option of first.options) {
      if (option.errorLabel === null) continue;
      assert.notEqual(option.value, first.answer);
      assert.doesNotMatch(option.errorLabel, /RANDOM|NEAR_VALUE|OFF_BY_ONE_FALLBACK/i);
    }

    assert.equal(first.renderer, 'TABLE_OR_GROUP');
    assert.ok(first.stem.startsWith('Find the number that will replace the question mark (?).'));
    assert.ok(first.stem.includes('?'));
    assert.ok(first.explanation.includes(String(first.answer)));
    assert.equal(first.solverTrace.length, first.evidenceGroups.length + 1);

    candidateNumericFingerprints.add(first.numericFingerprint);
    candidateContexts.add(misCp002ContextKey(first.context));
    globalStructuralFingerprints.add(first.structuralFingerprint);
    difficultyCounts.set(first.difficulty, (difficultyCounts.get(first.difficulty) ?? 0) + 1);
    answerPositions[first.correctIndex] += 1;
    generatedCount += 1;

    if (first.ruleId === 'PAIR_PRODUCT_ADJUST_THIRD') {
      productAdjustSigns.add(first.context.sign ?? 1);
    }
  }

  assert.ok(candidateNumericFingerprints.size >= 20, `${candidateId}: numeric diversity is too low`);
  const rule = MIS_CP002_RULES.find((entry) => entry.candidateId === candidateId)!;
  if (rule.contexts.length > 1) {
    assert.ok(candidateContexts.size >= 2, `${candidateId}: expected more than one operand-role context`);
  }
}

assert.equal(generatedCount, 560);
assert.ok(answerPositions.every((count) => count > 0));
const minAnswerPosition = Math.min(...answerPositions);
const maxAnswerPosition = Math.max(...answerPositions);
assert.ok(maxAnswerPosition / minAnswerPosition < 1.5, `Answer positions are imbalanced: ${answerPositions.join(', ')}`);
assert.ok((difficultyCounts.get('Easy') ?? 0) > 0);
assert.ok((difficultyCounts.get('Medium') ?? 0) > 0);
assert.deepEqual([...productAdjustSigns].sort(), [-1, 1]);
assert.ok(globalStructuralFingerprints.size >= 12);
assert.ok(evidenceCounts.has(2) || evidenceCounts.has(3));

console.log('MIS-CP-002 executable prototype audit passed.', {
  generatedCount,
  answerPositions,
  difficultyCounts: Object.fromEntries(difficultyCounts),
  evidenceCounts: [...evidenceCounts].sort(),
  structuralFingerprintCount: globalStructuralFingerprints.size,
  productAdjustSigns: [...productAdjustSigns].sort(),
});
