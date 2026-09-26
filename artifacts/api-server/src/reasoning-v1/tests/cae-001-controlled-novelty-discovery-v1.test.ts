import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateCaeControlledNovelCandidateV1 } from '../topics/Cause-and-Effect/CAE-001/cae-001-controlled-novelty-discovery-v1';

test('CAE-001 edge families satisfy shared controlled-novel discovery contract', () => {
  const fingerprints = new Set<string>();
  const structures = new Set<string>();

  for (const qlId of ['CAE-QL-008', 'CAE-QL-009'] as const) {
    for (const locale of ['en-IN', 'hi-IN', 'pa-IN'] as const) {
      for (let seed = 1; seed <= 12; seed += 1) {
        const candidate = generateCaeControlledNovelCandidateV1({
          qlId,
          locale,
          seed: seed + (qlId === 'CAE-QL-009' ? 100 : 0),
        });

        assert.equal(candidate.provenance, 'CONTROLLED_NOVEL');
        assert.equal(candidate.qlId, qlId);
        assert.equal(candidate.options.length, 4);
        assert.equal(new Set(candidate.options).size, 4);
        assert.ok(candidate.correctIndex >= 0 && candidate.correctIndex < 4);
        assert.equal(candidate.permanentQlAllocated, false);
        assert.equal(candidate.questionStudioNoveltyMixActivated, false);
        assert.equal(candidate.humanReviewRequired, true);
        assert.equal(candidate.falsePyqAttribution, false);
        assert.ok(candidate.noveltyAxes.length >= 3);
        assert.doesNotMatch(
          candidate.stem,
          /\b(?:PYQ|previous year|asked in|SSC 20\d\d|IBPS 20\d\d)\b/iu,
        );
        fingerprints.add(candidate.semanticFingerprint);
        structures.add(candidate.causalStructure);
      }
    }
  }

  assert.ok(fingerprints.size >= 18, 'CAE controlled-novel discovery needs broad causal-state diversity.');
  assert.ok(structures.size >= 6, 'CAE controlled-novel discovery should exercise several reasoning structures.');
});
