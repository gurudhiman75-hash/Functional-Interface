import assert from 'node:assert/strict';
import { generateMisCp004Question, MIS_CP004_CANDIDATE_IDS } from './generator';
import { independentlyEvaluateMisCp004Rule, matchingMisCp004Rules } from './independent-solver';
import { MIS_CP004_RULES } from './rule-definitions';

assert.equal(MIS_CP004_RULES.length, 9);
assert.equal(MIS_CP004_CANDIDATE_IDS.length, 9);
assert.deepEqual(
  MIS_CP004_CANDIDATE_IDS,
  Array.from({ length: 9 }, (_, index) => `MIS-CAND-${String(index + 26).padStart(3, '0')}`),
);

const answerPositions = [0, 0, 0, 0];
const difficulties = new Set<string>();
const evidenceCounts = new Set<number>();
const structural = new Set<string>();
let generatedCount = 0;

for (const candidateId of MIS_CP004_CANDIDATE_IDS) {
  const rule = MIS_CP004_RULES.find((entry) => entry.candidateId === candidateId)!;
  const numeric = new Set<string>();

  for (let seed = 0; seed < 80; seed += 1) {
    const runtimeSeed = `MIS-CP004-TEST:${candidateId}:${seed}`;
    const first = generateMisCp004Question(candidateId, runtimeSeed);
    const replay = generateMisCp004Question(candidateId, runtimeSeed);

    assert.deepEqual(first, replay, `${candidateId}/${seed}: generation must be deterministic`);
    assert.equal(first.packageId, 'MIS-001');
    assert.equal(first.checkpointId, 'MIS-CP-004');
    assert.equal(first.provisionalQl, true);
    assert.equal(first.candidateId, candidateId);
    assert.equal(first.operandCount, rule.operandCount);
    assert.equal(first.operationDepth, rule.operationDepth);
    assert.equal(first.sourceThin, Boolean(rule.sourceThin));
    assert.equal(first.missingPosition, 'RESULT_MISSING');
    assert.ok(first.evidenceGroups.length === 2 || first.evidenceGroups.length === 3);
    assert.equal(first.groupCount, first.evidenceGroups.length + 1);

    assert.equal(first.ambiguityAudit.accepted, true, `${candidateId}/${seed}: ambiguity audit rejected`);
    assert.equal(
      new Set(matchingMisCp004Rules(first.evidenceGroups).map((match) => match.semanticKey)).size,
      1,
      `${candidateId}/${seed}: multiple CP004 semantic rules survived`,
    );
    assert.equal(
      independentlyEvaluateMisCp004Rule(first.ruleId, first.target.first, first.target.second),
      first.answer,
    );

    if (first.operandCount === 1) {
      assert.ok(first.evidenceGroups.every((group) => group.second == null));
      assert.equal(first.target.second, null);
    } else {
      assert.ok(first.evidenceGroups.every((group) => group.second != null));
      assert.notEqual(first.target.second, null);
    }

    assert.ok(Number.isInteger(first.answer));
    assert.ok(first.answer > 0 && first.answer <= 999);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => option.value)).size, 4);
    assert.equal(first.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(first.options[first.correctIndex]!.value, first.answer);
    for (const option of first.options) {
      if (!option.errorLabel) continue;
      assert.notEqual(option.value, first.answer);
      assert.doesNotMatch(option.errorLabel, /RANDOM|NEAR_VALUE|OFF_BY_ONE_FALLBACK/i);
    }

    assert.ok(first.stem.startsWith('Find the number that will replace the question mark (?).'));
    assert.ok(first.explanation.includes('The same rule is used in every row.'));
    assert.ok(first.explanation.includes('Look at Row 1:'));
    assert.ok(first.explanation.includes('Now apply the same rule to the row with the question mark:'));
    assert.ok(first.explanation.includes(`So, ? = ${first.answer}.`));
    assert.equal(first.solverTrace.length, first.evidenceGroups.length + 1);

    numeric.add(first.numericFingerprint);
    structural.add(first.structuralFingerprint);
    difficulties.add(first.difficulty);
    evidenceCounts.add(first.evidenceGroups.length);
    answerPositions[first.correctIndex] += 1;
    generatedCount += 1;
  }

  const minimumNumericDiversity = rule.sourceThin ? 12 : 20;
  assert.ok(
    numeric.size >= minimumNumericDiversity,
    `${candidateId}: numeric diversity too low (${numeric.size} < ${minimumNumericDiversity})`,
  );
}

assert.equal(generatedCount, 720);
assert.deepEqual([...difficulties].sort(), ['Easy', 'Medium']);
assert.ok(evidenceCounts.has(2) || evidenceCounts.has(3));
assert.ok(structural.size >= 9);
assert.ok(answerPositions.every((count) => count > 0));
const minPosition = Math.min(...answerPositions);
const maxPosition = Math.max(...answerPositions);
assert.ok(maxPosition / minPosition < 1.5, `Answer positions imbalanced: ${answerPositions.join(', ')}`);

console.log('MIS-CP-004 executable prototype audit passed.', {
  generatedCount,
  answerPositions,
  evidenceCounts: [...evidenceCounts].sort(),
  structuralFingerprintCount: structural.size,
});
