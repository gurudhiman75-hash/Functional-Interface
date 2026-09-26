import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateClockControlledNovelAngleCandidateV1 } from '../topics/Clocks/CLK-001/clk-001-controlled-novelty-discovery-v1';

test('CLK-001 controlled novel angle lane composes faulty time and hand-angle skills safely', () => {
  const fingerprints = new Set<string>();

  for (let seed = 1; seed <= 30; seed += 1) {
    const candidate = generateClockControlledNovelAngleCandidateV1(seed);

    assert.equal(candidate.provenance, 'CONTROLLED_NOVEL');
    assert.deepEqual(candidate.parentQlIds, ['CLK-QL-003', 'CLK-QL-010']);
    assert.equal(candidate.taskId, 'ANGLE_ON_FAULTY_CLOCK_AT_ACTUAL_TIME');
    assert.equal(candidate.solverAgreement, true);
    assert.equal(candidate.options.length, 4);
    assert.equal(new Set(candidate.options).size, 4);
    assert.ok(candidate.correctIndex >= 0 && candidate.correctIndex < 4);
    assert.equal(candidate.permanentQlAllocated, false);
    assert.equal(candidate.questionStudioActivated, false);
    assert.equal(candidate.humanReviewRequired, true);
    assert.equal(candidate.falsePyqAttribution, false);
    assert.ok(candidate.noveltyAxes.includes('MULTI_STAGE_COMPOSITION'));
    assert.ok(candidate.noveltyAxes.includes('VALID_CROSS_FAMILY_COMPOSITION'));

    assert.doesNotMatch(
      candidate.stem,
      /\b(?:PYQ|previous year|asked in|SSC 20\d\d|IBPS 20\d\d)\b/iu,
    );
    assert.doesNotMatch(
      candidate.stem,
      /\b(?:prototype|authority|fingerprint|semantic key|source audit|controlled novel)\b/iu,
    );
    fingerprints.add(candidate.semanticFingerprint);
  }

  assert.ok(
    fingerprints.size >= 24,
    'Clock controlled-novel lane should expose broad mathematical-state diversity across 30 seeds.',
  );
});
