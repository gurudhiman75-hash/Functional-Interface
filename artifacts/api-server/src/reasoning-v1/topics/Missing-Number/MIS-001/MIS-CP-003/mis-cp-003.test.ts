import assert from 'node:assert/strict';
import { generateMisCp003Question, MIS_CP003_CANDIDATE_IDS } from './generator';
import { independentlyEvaluateMisCp003Rule, matchingMisCp003Rules } from './independent-solver';
import { MIS_CP003_RULES, misCp003ContextKey } from './rule-definitions';

assert.equal(MIS_CP003_RULES.length, 10);
assert.equal(MIS_CP003_CANDIDATE_IDS.length, 10);

const answerPositions = [0, 0, 0, 0];
const difficulties = new Set<string>();
const signsByRule = new Map<string, Set<number>>();
let generatedCount = 0;

for (const candidateId of MIS_CP003_CANDIDATE_IDS) {
  const numeric = new Set<string>();
  const contexts = new Set<string>();
  for (let seed = 0; seed < 80; seed += 1) {
    const runtimeSeed = `MIS-CP003-TEST:${candidateId}:${seed}`;
    const first = generateMisCp003Question(candidateId, runtimeSeed);
    const replay = generateMisCp003Question(candidateId, runtimeSeed);
    assert.deepEqual(first, replay);
    assert.equal(first.ambiguityAudit.accepted, true);
    assert.equal(new Set(matchingMisCp003Rules(first.evidenceGroups).map((m) => m.semanticKey)).size, 1);
    assert.equal(
      independentlyEvaluateMisCp003Rule(first.ruleId, first.target.first, first.target.second, first.context),
      first.answer,
    );
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((o) => o.value)).size, 4);
    assert.equal(first.options.filter((o) => o.errorLabel === null).length, 1);
    assert.equal(first.options[first.correctIndex]!.value, first.answer);
    assert.ok(first.answer > 0 && first.answer <= 999);
    assert.ok(first.stem.includes('?'));
    assert.ok(first.explanation.includes('The same rule is used in every row.'));
    assert.ok(first.explanation.includes('Now apply the same rule to the row with the question mark:'));
    assert.ok(first.explanation.includes(`So, ? = ${first.answer}.`));
    if (first.operandCount === 1) {
      assert.ok(first.evidenceGroups.every((g) => g.second == null));
      assert.equal(first.target.second, null);
    } else {
      assert.ok(first.evidenceGroups.every((g) => g.second != null));
      assert.notEqual(first.target.second, null);
    }
    for (const option of first.options) {
      if (option.errorLabel) assert.doesNotMatch(option.errorLabel, /RANDOM|OFF_BY_ONE|NEAR_VALUE/i);
    }
    numeric.add(first.numericFingerprint);
    contexts.add(misCp003ContextKey(first.context));
    difficulties.add(first.difficulty);
    answerPositions[first.correctIndex] += 1;
    generatedCount += 1;
    if (first.context.sign != null) {
      const set = signsByRule.get(first.ruleId) ?? new Set<number>();
      set.add(first.context.sign);
      signsByRule.set(first.ruleId, set);
    }
  }
  assert.ok(numeric.size >= 20, `${candidateId}: numeric diversity too low`);
  const rule = MIS_CP003_RULES.find((r) => r.candidateId === candidateId)!;
  if (rule.contexts.length > 1) assert.ok(contexts.size >= 2, `${candidateId}: context diversity too low`);
}

assert.equal(generatedCount, 800);
assert.deepEqual([...difficulties].sort(), ['Easy', 'Medium']);
assert.deepEqual([...(signsByRule.get('PAIR_SUM_OR_DIFFERENCE_SQUARE') ?? [])].sort(), [-1, 1]);
assert.deepEqual([...(signsByRule.get('PAIR_SUM_OR_DIFFERENCE_CUBE') ?? [])].sort(), [-1, 1]);
const min = Math.min(...answerPositions);
const max = Math.max(...answerPositions);
assert.ok(max / min < 1.5, `Answer positions imbalanced: ${answerPositions.join(', ')}`);

console.log('MIS-CP-003 executable prototype audit passed.', { generatedCount, answerPositions });
