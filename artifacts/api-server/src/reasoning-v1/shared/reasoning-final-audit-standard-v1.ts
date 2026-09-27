import { REASONING_V1_NOVELTY_GOVERNANCE_V1 } from './reasoning-novelty-governance-v1';

export const REASONING_V1_FINAL_AUDIT_STANDARD_V1 = Object.freeze({
  authorityId: 'REASONING_V1_FINAL_AUDIT_STANDARD_V1' as const,
  mandatoryDimensions: [
    'SOURCE_AND_EXAM_COVERAGE',
    'SEMANTIC_OWNERSHIP_AND_QL_BOUNDARIES',
    'SOLVER_VALIDITY_AND_UNIQUE_ANSWER',
    'EXAM_NATURAL_STEMS',
    'PLAUSIBLE_DISTRACTORS',
    'BEGINNER_FRIENDLY_EXPLANATIONS',
    'GENERATED_INSTANCE_DIFFICULTY',
    'EN_HI_PA_LANGUAGE_QUALITY_AND_PARITY',
    'DIVERSITY_AND_SATURATION',
    'CONTROLLED_NOVEL_CAPABILITY',
    'QUESTION_STUDIO_ROUTING_AND_LIFECYCLE',
    'RUNTIME_AND_AUDIT_PERFORMANCE',
  ] as const,
  noveltyAuthorityId: REASONING_V1_NOVELTY_GOVERNANCE_V1.authorityId,
  completionRule:
    'A chapter is not final-audit complete while any mandatory dimension is UNKNOWN, FAILED or represented only by a weaker proxy.' as const,
  proxyWarnings: {
    exactQuestionUniquenessIsNotNovelty: true,
    largeObjectPoolIsNotNovelty: true,
    numericResamplingIsNotNovelty: true,
    semanticFingerprintExistenceIsNotNovelty: true,
    nonPremiseRestatementIsNotNovelty: true,
    sourceCoverageIsNotNovelty: true,
    noveltyDoesNotReplaceSourceCoverage: true,
  },
  noveltyCompletionStates: [
    'NOT_APPLICABLE_WITH_DOCUMENTED_NARROW_AUTHORITY',
    'CAPABILITY_PROVEN_REVIEW_GATED',
    'APPROVED_CONTROLLED_NOVEL_RUNTIME',
  ] as const,
} as const);

export type ReasoningFinalAuditDimensionV1 =
  (typeof REASONING_V1_FINAL_AUDIT_STANDARD_V1.mandatoryDimensions)[number];

export type ReasoningAuditDimensionStatusV1 =
  | 'PASS'
  | 'PASS_WITH_REVIEW_GATE'
  | 'NOT_APPLICABLE_WITH_DOCUMENTED_REASON'
  | 'UNKNOWN'
  | 'FAIL';

export interface ReasoningFinalAuditDimensionRecordV1 {
  readonly dimension: ReasoningFinalAuditDimensionV1;
  readonly status: ReasoningAuditDimensionStatusV1;
  readonly evidence: readonly string[];
}

export function assertReasoningFinalAuditCompleteV1(
  chapterId: string,
  records: readonly ReasoningFinalAuditDimensionRecordV1[],
): void {
  const byDimension = new Map(records.map((record) => [record.dimension, record]));
  for (const dimension of REASONING_V1_FINAL_AUDIT_STANDARD_V1.mandatoryDimensions) {
    const record = byDimension.get(dimension);
    if (!record) throw new Error(chapterId + ': missing mandatory final-audit dimension ' + dimension + '.');
    if (record.status === 'UNKNOWN' || record.status === 'FAIL') {
      throw new Error(
        chapterId + ': final audit cannot close while ' + dimension + ' is ' + record.status + '.',
      );
    }
    if (record.evidence.length === 0) {
      throw new Error(chapterId + ': ' + dimension + ' has no audit evidence.');
    }
  }
}
