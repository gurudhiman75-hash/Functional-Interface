import type { RnkCp001ProvisionalAuthorityId } from './cp001-provisional-consolidation';

export const RNK_CP001_FINAL_SOURCE_DIMENSIONS = [
  {
    dimensionId: 'END_TO_END_RANK_CONVERSION',
    authorityIds: ['RNK-CP001-AUTH-01-CONVERT-RANK-BETWEEN-ENDS'],
  },
  {
    dimensionId: 'TOTAL_FROM_INCLUSIVE_END_RANKS',
    authorityIds: ['RNK-CP001-AUTH-02-TOTAL-FROM-BOTH-END-RANKS'],
  },
  {
    dimensionId: 'SAME_SIDE_RANK_COUNT_BIJECTION',
    authorityIds: [
      'RNK-CP001-AUTH-03-SIDE-COUNT-FROM-SAME-SIDE-RANK',
      'RNK-CP001-AUTH-05-SAME-SIDE-RANK-FROM-SIDE-COUNT',
    ],
  },
  {
    dimensionId: 'OPPOSITE_SIDE_RANK_COUNT_BIJECTION_WITH_TOTAL',
    authorityIds: [
      'RNK-CP001-AUTH-04-OPPOSITE-SIDE-COUNT-FROM-TOTAL-AND-RANK',
      'RNK-CP001-AUTH-06-OPPOSITE-END-RANK-FROM-TOTAL-AND-SIDE-COUNT',
    ],
  },
  {
    dimensionId: 'EXACT_MIDDLE_BIJECTION',
    authorityIds: [
      'RNK-CP001-AUTH-07-EXACT-MIDDLE-RANK-FROM-ODD-TOTAL',
      'RNK-CP001-AUTH-08-ODD-TOTAL-FROM-EXACT-MIDDLE-RANK',
    ],
  },
  {
    dimensionId: 'TOTAL_FROM_EXCLUSIVE_SIDE_COUNTS',
    authorityIds: ['RNK-CP001-AUTH-09-TOTAL-FROM-BEFORE-AND-AFTER-COUNTS'],
  },
  {
    dimensionId: 'MERIT_ROW_QUEUE_REPRESENTATION_PARITY',
    authorityIds: [
      'RNK-CP001-AUTH-01-CONVERT-RANK-BETWEEN-ENDS',
      'RNK-CP001-AUTH-02-TOTAL-FROM-BOTH-END-RANKS',
      'RNK-CP001-AUTH-03-SIDE-COUNT-FROM-SAME-SIDE-RANK',
      'RNK-CP001-AUTH-04-OPPOSITE-SIDE-COUNT-FROM-TOTAL-AND-RANK',
      'RNK-CP001-AUTH-05-SAME-SIDE-RANK-FROM-SIDE-COUNT',
      'RNK-CP001-AUTH-06-OPPOSITE-END-RANK-FROM-TOTAL-AND-SIDE-COUNT',
      'RNK-CP001-AUTH-07-EXACT-MIDDLE-RANK-FROM-ODD-TOTAL',
      'RNK-CP001-AUTH-08-ODD-TOTAL-FROM-EXACT-MIDDLE-RANK',
      'RNK-CP001-AUTH-09-TOTAL-FROM-BEFORE-AND-AFTER-COUNTS',
    ],
  },
  {
    dimensionId: 'FIRST_LAST_ZERO_ONE_AND_INTERIOR_EDGES',
    authorityIds: [
      'RNK-CP001-AUTH-01-CONVERT-RANK-BETWEEN-ENDS',
      'RNK-CP001-AUTH-03-SIDE-COUNT-FROM-SAME-SIDE-RANK',
      'RNK-CP001-AUTH-04-OPPOSITE-SIDE-COUNT-FROM-TOTAL-AND-RANK',
      'RNK-CP001-AUTH-05-SAME-SIDE-RANK-FROM-SIDE-COUNT',
      'RNK-CP001-AUTH-06-OPPOSITE-END-RANK-FROM-TOTAL-AND-SIDE-COUNT',
      'RNK-CP001-AUTH-09-TOTAL-FROM-BEFORE-AND-AFTER-COUNTS',
    ],
  },
] as const satisfies readonly {
  readonly dimensionId: string;
  readonly authorityIds: readonly RnkCp001ProvisionalAuthorityId[];
}[];

export const RNK_CP001_SOURCE_PATTERN_DISPOSITIONS = [
  { patternId: 'OPPOSITE_END_RANK', disposition: 'CP001_COVERED', owner: 'RNK-CP-001' },
  { patternId: 'TOTAL_FROM_BOTH_END_RANKS', disposition: 'CP001_COVERED', owner: 'RNK-CP-001' },
  { patternId: 'EXACT_MIDDLE_RANK_OR_TOTAL', disposition: 'CP001_COVERED', owner: 'RNK-CP-001' },
  { patternId: 'PEOPLE_BEFORE_AFTER_AND_INVERSE_RANK', disposition: 'CP001_COVERED', owner: 'RNK-CP-001' },
  { patternId: 'PEOPLE_BETWEEN_TWO_PERSONS', disposition: 'DEFERRED', owner: 'RNK-CP-002' },
  { patternId: 'TWO_PERSON_RANK_DIFFERENCE_OR_MIXED_RECOVERY', disposition: 'DEFERRED', owner: 'RNK-CP-002' },
  { patternId: 'MINIMUM_MAXIMUM_TOTAL_UNCERTAIN_RELATIVE_ORDER', disposition: 'DEFERRED', owner: 'RNK-CP-002' },
  { patternId: 'INTERCHANGE_OR_CHANGED_RANK', disposition: 'DEFERRED', owner: 'RNK-CP-003' },
  { patternId: 'MULTI_PERSON_COMPARISON_ORDER', disposition: 'DEFERRED', owner: 'RNK-CP-004' },
  { patternId: 'SHARED_RANKING_PASSAGE', disposition: 'DEFERRED', owner: 'RNK-CP-005' },
  { patternId: 'STATEMENT_WISE_SUFFICIENCY', disposition: 'REASSIGNED', owner: 'REAS-DSF' },
  { patternId: 'SEATING_ADJACENCY_FACING_GEOMETRY', disposition: 'REASSIGNED', owner: 'REAS-LAR/CAR/SQR' },
] as const;

export const RNK_CP001_INVERSE_CLOSURE = [
  {
    forwardAuthorityId: 'RNK-CP001-AUTH-03-SIDE-COUNT-FROM-SAME-SIDE-RANK',
    inverseAuthorityId: 'RNK-CP001-AUTH-05-SAME-SIDE-RANK-FROM-SIDE-COUNT',
  },
  {
    forwardAuthorityId: 'RNK-CP001-AUTH-04-OPPOSITE-SIDE-COUNT-FROM-TOTAL-AND-RANK',
    inverseAuthorityId: 'RNK-CP001-AUTH-06-OPPOSITE-END-RANK-FROM-TOTAL-AND-SIDE-COUNT',
  },
  {
    forwardAuthorityId: 'RNK-CP001-AUTH-07-EXACT-MIDDLE-RANK-FROM-ODD-TOTAL',
    inverseAuthorityId: 'RNK-CP001-AUTH-08-ODD-TOTAL-FROM-EXACT-MIDDLE-RANK',
  },
] as const satisfies readonly {
  readonly forwardAuthorityId: RnkCp001ProvisionalAuthorityId;
  readonly inverseAuthorityId: RnkCp001ProvisionalAuthorityId;
}[];
