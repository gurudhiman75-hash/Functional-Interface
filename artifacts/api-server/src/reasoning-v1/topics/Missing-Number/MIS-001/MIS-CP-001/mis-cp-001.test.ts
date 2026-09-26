import assert from 'node:assert/strict';
import { generateMisCp001Question, MIS_CP001_CANDIDATE_IDS } from './generator';
import {
  independentlyEvaluateMisCp001Rule,
  matchingMisCp001Rules,
} from './independent-solver';
import { MIS_CP001_RULES } from './rule-definitions';

assert.equal(MIS_CP001_RULES.length, 8);
assert.equal(MIS_CP001_CANDIDATE_IDS.length, 8);
assert.equal(new Set(MIS_CP001_CANDIDATE_IDS).size, 8);
assert.deepEqual(
  MIS_CP001_CANDIDATE_IDS,
  Array.from({ length: 8 }, (_, index) => `MIS-CAND-${String(index + 1).padStart(3, '0')}`),
);

const answerPositions = [0, 0, 0, 0];
const difficultyCounts = new Map<string, number>();
const evidenceCounts = new Set<number>();
const seenNumericFingerprints = new Set<string>();
const seenStructuralFingerprints = new Set<string>();
let generatedCount = 0;

for (const candidateId of MIS_CP001_CANDIDATE_IDS) {
  const candidateFingerprints = new Set<string>();
  for (let seed = 0; seed < 80; seed += 1) {
    const runtimeSeed = `MIS-CP001-TEST:${candidateId}:${seed}`;
    const first = generateMisCp001Question(candidateId, runtimeSeed);
    const replay = generateMisCp001Question(candidateId, runtimeSeed);

    assert.deepEqual(first, replay, `${candidateId}/${seed}: generation must be deterministic`);
    assert.equal(first.packageId, 'MIS-001');
    assert.equal(first.checkpointId, 'MIS-CP-001');
    assert.equal(first.candidateId, candidateId);
    assert.equal(first.provisionalQl, true);
    assert.ok(first.evidenceGroups.length === 2 || first.evidenceGroups.length === 3);
    assert.equal(first.groupCount, first.evidenceGroups.length + 1);
    evidenceCounts.add(first.evidenceGroups.length);

    assert.equal(first.ambiguityAudit.accepted, true, `${candidateId}/${seed}: ambiguity audit rejected`);
    const matches = matchingMisCp001Rules(first.evidenceGroups);
    assert.equal(
      new Set(matches.map((match) => match.semanticKey)).size,
      1,
      `${candidateId}/${seed}: more than one semantic CP001 rule survived`,
    );

    const solvedTarget = independentlyEvaluateMisCp001Rule(
      first.ruleId,
      first.target.first,
      first.target.second,
      first.context,
    );
    assert.equal(solvedTarget, first.answer);
    assert.equal(first.target.result, first.answer);
    assert.ok(Number.isInteger(first.answer));
    assert.ok(first.answer > 0 && first.answer <= 999);

    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => option.value)).size, 4);
    assert.equal(first.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(first.options[first.correctIndex]!.value, first.answer);
    for (const option of first.options) {
      if (option.errorLabel === null) continue;
      assert.notEqual(option.value, first.answer);
      assert.doesNotMatch(option.errorLabel, /RANDOM|NEAR_VALUE|OFF_BY_ONE_FALLBACK/i);
    }

    assert.equal(first.missingPosition, 'RESULT_MISSING');
    assert.equal(first.renderer, 'TABLE_OR_GROUP');
    assert.ok(first.stem.startsWith('Find the number that will replace the question mark (?).'));
    assert.ok(first.stem.includes('?'));
    assert.ok(first.explanation.includes(String(first.answer)));
    assert.ok(first.solverTrace.length === first.evidenceGroups.length + 1);

    answerPositions[first.correctIndex] += 1;
    difficultyCounts.set(first.difficulty, (difficultyCounts.get(first.difficulty) ?? 0) + 1);
    candidateFingerprints.add(first.numericFingerprint);
    seenNumericFingerprints.add(first.numericFingerprint);
    seenStructuralFingerprints.add(first.structuralFingerprint);
    generatedCount += 1;
  }
  assert.ok(candidateFingerprints.size >= 20, `${candidateId}: numeric diversity is too low`);
}

assert.equal(generatedCount, 640);
assert.ok(answerPositions.every((count) => count > 0));
const minAnswerPosition = Math.min(...answerPositions);
const maxAnswerPosition = Math.max(...answerPositions);
assert.ok(maxAnswerPosition / minAnswerPosition < 1.5, `Answer positions are imbalanced: ${answerPositions.join(', ')}`);
assert.ok((difficultyCounts.get('Easy') ?? 0) > 0);
assert.ok((difficultyCounts.get('Medium') ?? 0) > 0);
assert.ok(seenNumericFingerprints.size >= 160);
assert.ok(seenStructuralFingerprints.size >= 8);
assert.ok(evidenceCounts.has(2) || evidenceCounts.has(3));

console.log('MIS-CP-001 executable prototype audit passed.', {
  generatedCount,
  answerPositions,
  difficultyCounts: Object.fromEntries(difficultyCounts),
  evidenceCounts: [...evidenceCounts].sort(),
  numericFingerprintCount: seenNumericFingerprints.size,
  structuralFingerprintCount: seenStructuralFingerprints.size,
});
