import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  generateRnkControlledNovelCaseletV1,
  solveRnkControlledNovelCaseletV1,
} from '../topics/Ranking-and-Order/RNK-001/rnk-001-controlled-novelty-discovery-v1';

test('RNK-001 controlled novel caselets combine existing ranking skills without allocating RNK-QL-043', () => {
  const fingerprints = new Set<string>();

  for (let seed = 1; seed <= 40; seed += 1) {
    const candidate = generateRnkControlledNovelCaseletV1(seed);
    assert.equal(candidate.provenance, 'CONTROLLED_NOVEL');
    assert.equal(candidate.permanentQlAllocated, false);
    assert.equal(candidate.nextAvailableQl, 'RNK-QL-043');
    assert.equal(candidate.falsePyqAttribution, false);
    assert.equal(candidate.humanReviewRequired, true);
    assert.deepEqual(candidate.mappedQlIds, [
      'RNK-QL-027',
      'RNK-QL-028',
      'RNK-QL-029',
      'RNK-QL-031',
      'RNK-QL-032',
      'RNK-QL-033',
    ]);
    assert.ok(candidate.noveltyAxes.includes('CONSTRAINT_INTERACTION'));
    assert.ok(candidate.noveltyAxes.includes('VALID_CROSS_FAMILY_COMPOSITION'));
    assert.equal(candidate.entities.length, 6);
    assert.equal(new Set(candidate.entities).size, 6);

    const solutions = solveRnkControlledNovelCaseletV1(
      candidate.entities,
      candidate.constraints,
    );
    assert.equal(solutions.length, 1);
    assert.deepEqual(solutions[0], candidate.hiddenOrder);

    const visible = candidate.clueTexts.join(' ');
    assert.doesNotMatch(visible, /\b(?:PYQ|previous year|asked in|SSC 20\d\d|IBPS 20\d\d)\b/iu);
    fingerprints.add(candidate.semanticFingerprint);
  }

  assert.ok(
    fingerprints.size >= 30,
    'RNK controlled-novel discovery should produce broad semantic state diversity across 40 seeds.',
  );
});
