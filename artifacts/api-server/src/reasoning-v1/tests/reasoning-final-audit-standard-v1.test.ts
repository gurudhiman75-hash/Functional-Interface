import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  REASONING_V1_FINAL_AUDIT_STANDARD_V1 as standard,
  assertReasoningFinalAuditCompleteV1,
  type ReasoningFinalAuditDimensionRecordV1,
} from '../shared/reasoning-final-audit-standard-v1';

test('controlled novel capability is mandatory in the Reasoning V1 final audit', () => {
  assert.ok(standard.mandatoryDimensions.includes('CONTROLLED_NOVEL_CAPABILITY'));
  assert.equal(standard.proxyWarnings.exactQuestionUniquenessIsNotNovelty, true);
  assert.equal(standard.proxyWarnings.largeObjectPoolIsNotNovelty, true);
  assert.equal(standard.proxyWarnings.semanticFingerprintExistenceIsNotNovelty, true);
  assert.equal(standard.proxyWarnings.nonPremiseRestatementIsNotNovelty, true);
  assert.equal(standard.proxyWarnings.noveltyDoesNotReplaceSourceCoverage, true);
});

test('final audit cannot close with novelty unknown', () => {
  const records = standard.mandatoryDimensions.map((dimension) => ({
    dimension,
    status: dimension === 'CONTROLLED_NOVEL_CAPABILITY' ? 'UNKNOWN' as const : 'PASS' as const,
    evidence: ['proof'],
  })) satisfies readonly ReasoningFinalAuditDimensionRecordV1[];

  assert.throws(
    () => assertReasoningFinalAuditCompleteV1('TEST-001', records),
    /CONTROLLED_NOVEL_CAPABILITY is UNKNOWN/u,
  );
});

test('review-gated novelty capability can close the technical audit without activating production novelty', () => {
  const records = standard.mandatoryDimensions.map((dimension) => ({
    dimension,
    status: dimension === 'CONTROLLED_NOVEL_CAPABILITY'
      ? 'PASS_WITH_REVIEW_GATE' as const
      : 'PASS' as const,
    evidence: ['proof'],
  })) satisfies readonly ReasoningFinalAuditDimensionRecordV1[];

  assert.doesNotThrow(() => assertReasoningFinalAuditCompleteV1('TEST-001', records));
});
