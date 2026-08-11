import type { RnkCp004AnswerSemantic } from './cp004-foundation';
import { RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID } from './cp004-exam-ready-v14';
import {
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS,
  generateRnkCp004SourceInverseQuestion,
  type RnkCp004RemodelV7PrototypeId,
  type RnkCp004SourceInverseQuestion,
} from './cp004-source-inverse-v1';

export {
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
};
export type { RnkCp004RemodelV7PrototypeId };

export const RNK_CP004_AUTHORITY_CONSOLIDATION_VERSION = 'RNK_CP004_AUTHORITY_CONSOLIDATION_V1' as const;

export const RNK_CP004_CONSOLIDATED_AUTHORITY_IDS = [
  'ENDPOINT_ENTITY',
  'ENTITY_AT_POSITION',
  'RANK_OF_NAMED_ENTITY',
  'COMPLETE_ORDER',
  'RELATIVE_ORDER_OF_PAIR',
  'EXACT_RANK_DIFFERENCE_OF_PAIR',
  'IMMEDIATE_NEIGHBOUR',
  'DEFINITELY_TRUE_RELATION',
  'MISSING_COMPARISON',
] as const;

export type RnkCp004ConsolidatedAuthorityId =
  (typeof RNK_CP004_CONSOLIDATED_AUTHORITY_IDS)[number];

export type RnkCp004ConsolidationDecision =
  | 'MERGE_AS_QUERY_PARAMETER'
  | 'KEEP_AS_DISTINCT_AUTHORITY';

export type RnkCp004AuthorityParameter =
  | 'HIGHEST_ENDPOINT'
  | 'LOWEST_ENDPOINT'
  | 'EXPLICIT_POSITION'
  | 'DERIVED_MIDDLE_POSITION'
  | 'TOP_OR_BOTTOM_RANK_REFERENCE'
  | 'HIGHEST_TO_LOWEST_OR_REVERSED_PRESENTATION'
  | 'PAIR_DIRECTION'
  | 'EXACT_DISTANCE_AND_DIRECTION'
  | 'ABOVE_OR_BELOW_NEIGHBOUR'
  | 'DEFINITELY_TRUE_POLARITY'
  | 'SUFFICIENT_BRIDGE_COMPARISON';

export type RnkCp004ProofContract =
  | 'UNIQUE_ORDER_ENDPOINT_SELECTION'
  | 'UNIQUE_ORDER_POSITION_SELECTION'
  | 'UNIQUE_ORDER_NAMED_RANK_LOOKUP'
  | 'UNIQUE_ORDER_FULL_SEQUENCE'
  | 'DIRECTIONAL_PAIR_PROOF'
  | 'FULL_POSITION_DISTANCE_ARITHMETIC'
  | 'LOCAL_ADJACENCY_PROOF'
  | 'TRANSITIVE_RELATION_PROOF'
  | 'TWO_BLOCK_UNIQUENESS_BRIDGE';

export interface RnkCp004AuthorityConsolidationProfile {
  readonly version: typeof RNK_CP004_AUTHORITY_CONSOLIDATION_VERSION;
  readonly sourcePrototypeId: RnkCp004RemodelV7PrototypeId;
  readonly consolidatedAuthorityId: RnkCp004ConsolidatedAuthorityId;
  readonly decision: RnkCp004ConsolidationDecision;
  readonly parameter: RnkCp004AuthorityParameter;
  readonly proofContract: RnkCp004ProofContract;
  readonly answerSemantic: RnkCp004AnswerSemantic;
  readonly ownership: 'RNK-CP-004';
  readonly permanentQlId: null;
  readonly freezeEligible: false;
}

export type RnkCp004ConsolidatedQuestion = Omit<RnkCp004SourceInverseQuestion, 'reviewMetadata'> & {
  readonly reviewMetadata: RnkCp004SourceInverseQuestion['reviewMetadata'] & {
    readonly authorityConsolidationStatus: 'ACTIVE';
    readonly authorityConsolidationProfile: RnkCp004AuthorityConsolidationProfile;
  };
};

function profileFor(question: RnkCp004SourceInverseQuestion): Omit<
  RnkCp004AuthorityConsolidationProfile,
  'version' | 'sourcePrototypeId' | 'answerSemantic' | 'ownership' | 'permanentQlId' | 'freezeEligible'
> {
  const query = question.displayedEvidence.query;
  if (question.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    return {
      consolidatedAuthorityId: 'EXACT_RANK_DIFFERENCE_OF_PAIR',
      decision: 'KEEP_AS_DISTINCT_AUTHORITY',
      parameter: 'EXACT_DISTANCE_AND_DIRECTION',
      proofContract: 'FULL_POSITION_DISTANCE_ARITHMETIC',
    };
  }
  switch (query.kind) {
    case 'HIGHEST_ENTITY':
      return {
        consolidatedAuthorityId: 'ENDPOINT_ENTITY',
        decision: 'MERGE_AS_QUERY_PARAMETER',
        parameter: 'HIGHEST_ENDPOINT',
        proofContract: 'UNIQUE_ORDER_ENDPOINT_SELECTION',
      };
    case 'LOWEST_ENTITY':
      return {
        consolidatedAuthorityId: 'ENDPOINT_ENTITY',
        decision: 'MERGE_AS_QUERY_PARAMETER',
        parameter: 'LOWEST_ENDPOINT',
        proofContract: 'UNIQUE_ORDER_ENDPOINT_SELECTION',
      };
    case 'ENTITY_AT_EXACT_RANK':
      return {
        consolidatedAuthorityId: 'ENTITY_AT_POSITION',
        decision: 'MERGE_AS_QUERY_PARAMETER',
        parameter: 'EXPLICIT_POSITION',
        proofContract: 'UNIQUE_ORDER_POSITION_SELECTION',
      };
    case 'MIDDLE_ENTITY':
      return {
        consolidatedAuthorityId: 'ENTITY_AT_POSITION',
        decision: 'MERGE_AS_QUERY_PARAMETER',
        parameter: 'DERIVED_MIDDLE_POSITION',
        proofContract: 'UNIQUE_ORDER_POSITION_SELECTION',
      };
    case 'RANK_OF_NAMED_ENTITY':
      return {
        consolidatedAuthorityId: 'RANK_OF_NAMED_ENTITY',
        decision: 'KEEP_AS_DISTINCT_AUTHORITY',
        parameter: 'TOP_OR_BOTTOM_RANK_REFERENCE',
        proofContract: 'UNIQUE_ORDER_NAMED_RANK_LOOKUP',
      };
    case 'COMPLETE_ORDER':
      return {
        consolidatedAuthorityId: 'COMPLETE_ORDER',
        decision: 'KEEP_AS_DISTINCT_AUTHORITY',
        parameter: 'HIGHEST_TO_LOWEST_OR_REVERSED_PRESENTATION',
        proofContract: 'UNIQUE_ORDER_FULL_SEQUENCE',
      };
    case 'RELATIVE_ORDER_OF_PAIR':
      return {
        consolidatedAuthorityId: 'RELATIVE_ORDER_OF_PAIR',
        decision: 'KEEP_AS_DISTINCT_AUTHORITY',
        parameter: 'PAIR_DIRECTION',
        proofContract: 'DIRECTIONAL_PAIR_PROOF',
      };
    case 'IMMEDIATE_NEIGHBOUR':
      return {
        consolidatedAuthorityId: 'IMMEDIATE_NEIGHBOUR',
        decision: 'KEEP_AS_DISTINCT_AUTHORITY',
        parameter: 'ABOVE_OR_BELOW_NEIGHBOUR',
        proofContract: 'LOCAL_ADJACENCY_PROOF',
      };
    case 'VALID_RANK_STATEMENT':
      if (question.reviewMetadata.authorityCandidateId !== RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID) {
        throw new Error(`Unexpected relation authority ${question.reviewMetadata.authorityCandidateId}`);
      }
      return {
        consolidatedAuthorityId: 'DEFINITELY_TRUE_RELATION',
        decision: 'KEEP_AS_DISTINCT_AUTHORITY',
        parameter: 'DEFINITELY_TRUE_POLARITY',
        proofContract: 'TRANSITIVE_RELATION_PROOF',
      };
    case 'MISSING_COMPARISON':
      return {
        consolidatedAuthorityId: 'MISSING_COMPARISON',
        decision: 'KEEP_AS_DISTINCT_AUTHORITY',
        parameter: 'SUFFICIENT_BRIDGE_COMPARISON',
        proofContract: 'TWO_BLOCK_UNIQUENESS_BRIDGE',
      };
  }
}

export function generateRnkCp004ConsolidatedQuestion(
  prototypeId: RnkCp004RemodelV7PrototypeId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp004ConsolidatedQuestion {
  const base = generateRnkCp004SourceInverseQuestion(prototypeId, seed, correctIndexOverride);
  const decision = profileFor(base);
  return {
    ...base,
    mathematicalFingerprint: `${base.mathematicalFingerprint}:${RNK_CP004_AUTHORITY_CONSOLIDATION_VERSION}:${decision.consolidatedAuthorityId}`,
    reviewMetadata: {
      ...base.reviewMetadata,
      authorityConsolidationStatus: 'ACTIVE',
      authorityConsolidationProfile: {
        version: RNK_CP004_AUTHORITY_CONSOLIDATION_VERSION,
        sourcePrototypeId: prototypeId,
        ...decision,
        answerSemantic: base.answerSemantic,
        ownership: 'RNK-CP-004',
        permanentQlId: null,
        freezeEligible: false,
      },
      normalizedSemanticFingerprint: `${base.reviewMetadata.normalizedSemanticFingerprint}|${RNK_CP004_AUTHORITY_CONSOLIDATION_VERSION}:${decision.consolidatedAuthorityId}`,
    },
  };
}

/**
 * Ownership boundary corrected by the later RNK-001 book-to-QL reset and the
 * CP-005 QL-034 ownership audit. The original discovery-era CP-005..008 labels
 * were provisional and are not permanent chapter ownership.
 */
export const RNK_CP004_OWNERSHIP_BOUNDARY = {
  exactUniqueMultiEntityOrder: 'RNK-CP-004',
  presentationLedRowQueueMeritRace: 'CONTEXT_ONLY_SOLVER_DECIDES',
  attributeLedHeightAgeMarksWeight: 'CONTEXT_ONLY_SOLVER_DECIDES',
  partialOrderPossibleImpossibleCannotDetermine: 'RNK-CP-005',
  tiedOrNonStrictRanking: 'RNK-CP-006_SOURCE_AUDIT',
  advancedMixedRankingTransformations: 'RNK-CP-007_FRESH_GAP_AUDIT',
  sharedMultiQuestionRankingSets: 'ASSEMBLY_INFRASTRUCTURE',
  statementDataSufficiencyLabels: 'DATA_SUFFICIENCY',
} as const;

export const RNK_CP004_OPEN_AUTHORITY_CANDIDATES = {
  definitelyFalseRelation: 'COVERED_BY_RNK_CP005_RELATION_TRUTH_STATUS_CANNOT',
  cannotDetermineRelation: 'COVERED_BY_RNK_CP005_RELATION_TRUTH_STATUS_PAIR_STATUS',
  possibleOrImpossibleRelation: 'COVERED_BY_RNK_CP005_RELATION_TRUTH_STATUS',
  minimumOrMaximumPossibleRank: 'COVERED_BY_RNK_CP005_POSSIBLE_RANK_BOUND',
} as const;
