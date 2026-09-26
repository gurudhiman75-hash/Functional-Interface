import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  REASONING_V1_NOVELTY_GOVERNANCE_V1 as policy,
  auditReasoningNoveltyMixV1,
  validateReasoningNoveltyCandidateV1,
} from '../shared/reasoning-novelty-governance-v1';

test('Reasoning novelty governance fixes the chapter-level 80/20 operating intent', () => {
  assert.equal(policy.chapterMix.sourceBackedOperatingTarget, 0.80);
  assert.equal(policy.chapterMix.controlledNovelOperatingTarget, 0.20);
  assert.deepEqual(policy.chapterMix.controlledNovelAcceptableBand, [0.15, 0.25]);
  assert.equal(policy.chapterMix.perQlNoveltyQuotaRequired, false);
  assert.equal(policy.chapterMix.noveltyMayBeConcentratedInSuitableQls, true);
});

test('cosmetic changes cannot satisfy controlled novelty', () => {
  assert.throws(
    () => validateReasoningNoveltyCandidateV1({
      candidateId: 'COSMETIC-ONLY',
      chapterId: 'TEST-001',
      qlId: 'TEST-QL-001',
      provenance: 'CONTROLLED_NOVEL',
      noveltyAxes: [],
      nonNovelChanges: ['NAME_SUBSTITUTION', 'NUMERIC_RESAMPLING_ONLY'],
      solverVerified: true,
      uniqueCorrectAnswer: true,
      plausibleDistractors: true,
      examNatural: true,
      falseHistoricalAttribution: false,
      humanReviewRequired: true,
    }),
    /without a substantive novelty axis/u,
  );
});

test('valid controlled novelty requires semantic change and safety gates', () => {
  const candidate = validateReasoningNoveltyCandidateV1({
    candidateId: 'VALID-NOVEL',
    chapterId: 'TEST-001',
    qlId: 'TEST-QL-002',
    provenance: 'CONTROLLED_NOVEL',
    noveltyAxes: ['CONSTRAINT_INTERACTION', 'QUERY_DIRECTION'],
    nonNovelChanges: ['NUMERIC_RESAMPLING_ONLY'],
    solverVerified: true,
    uniqueCorrectAnswer: true,
    plausibleDistractors: true,
    examNatural: true,
    falseHistoricalAttribution: false,
    humanReviewRequired: true,
  });
  assert.equal(candidate.provenance, 'CONTROLLED_NOVEL');
  assert.equal(candidate.noveltyAxes.length, 2);
});

test('20 percent controlled novel sits inside the operating band', () => {
  const mix = auditReasoningNoveltyMixV1([
    ...Array.from({ length: 80 }, () => 'SOURCE_BACKED_CORE' as const),
    ...Array.from({ length: 20 }, () => 'CONTROLLED_NOVEL' as const),
  ]);
  assert.equal(mix.controlledNovelShare, 0.20);
  assert.equal(mix.withinOperatingBand, true);
});

test('experimental stretch never pads the controlled-novel target', () => {
  const mix = auditReasoningNoveltyMixV1([
    ...Array.from({ length: 80 }, () => 'SOURCE_BACKED_CORE' as const),
    ...Array.from({ length: 20 }, () => 'EXPERIMENTAL_STRETCH' as const),
  ]);
  assert.equal(mix.controlledNovelShare, 0);
  assert.equal(mix.withinOperatingBand, false);
});
