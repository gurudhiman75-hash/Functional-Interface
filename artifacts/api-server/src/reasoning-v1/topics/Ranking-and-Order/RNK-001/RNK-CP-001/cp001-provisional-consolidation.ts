import { RNK_CP001_PROTOTYPE_IDS, type RnkCp001PrototypeId } from './cp001-foundation';
import {
  RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS,
  type RnkCp001SourceWavePrototypeId,
} from './cp001-source-wave-reviewed';
import {
  RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID,
  type RnkCp001FinalInversePrototypeId,
} from './cp001-final-inverse-gap';

export type RnkCp001DiscoveryPrototypeId =
  | RnkCp001PrototypeId
  | RnkCp001SourceWavePrototypeId
  | RnkCp001FinalInversePrototypeId;

export const RNK_CP001_DISCOVERY_PROTOTYPE_IDS = [
  ...RNK_CP001_PROTOTYPE_IDS,
  ...RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS,
  RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID,
] as const satisfies readonly RnkCp001DiscoveryPrototypeId[];

export const RNK_CP001_PROVISIONAL_AUTHORITY_IDS = [
  'RNK-CP001-AUTH-01-CONVERT-RANK-BETWEEN-ENDS',
  'RNK-CP001-AUTH-02-TOTAL-FROM-BOTH-END-RANKS',
  'RNK-CP001-AUTH-03-SIDE-COUNT-FROM-SAME-SIDE-RANK',
  'RNK-CP001-AUTH-04-OPPOSITE-SIDE-COUNT-FROM-TOTAL-AND-RANK',
  'RNK-CP001-AUTH-05-SAME-SIDE-RANK-FROM-SIDE-COUNT',
  'RNK-CP001-AUTH-06-OPPOSITE-END-RANK-FROM-TOTAL-AND-SIDE-COUNT',
  'RNK-CP001-AUTH-07-EXACT-MIDDLE-RANK-FROM-ODD-TOTAL',
  'RNK-CP001-AUTH-08-ODD-TOTAL-FROM-EXACT-MIDDLE-RANK',
  'RNK-CP001-AUTH-09-TOTAL-FROM-BEFORE-AND-AFTER-COUNTS',
] as const;

export type RnkCp001ProvisionalAuthorityId =
  (typeof RNK_CP001_PROVISIONAL_AUTHORITY_IDS)[number];

export type RnkCp001AuthorityAnswerSemantic = 'RANK' | 'COUNT' | 'TOTAL';
export type RnkCp001AuthoritySideParameter = 'NONE' | 'KNOWN_END' | 'COUNTED_SIDE' | 'REQUESTED_END';

export interface RnkCp001ProvisionalAuthority {
  readonly authorityId: RnkCp001ProvisionalAuthorityId;
  readonly title: string;
  readonly answerSemantic: RnkCp001AuthorityAnswerSemantic;
  readonly evidenceFamily: string;
  readonly governingEquation: string;
  readonly sideParameter: RnkCp001AuthoritySideParameter;
  readonly exactMiddleRequired: boolean;
  readonly sourcePrototypeIds: readonly RnkCp001DiscoveryPrototypeId[];
  readonly permanentQlId: null;
  readonly reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW';
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: 'NOT_STORED';
  readonly testEligibility: 'INELIGIBLE';
  readonly publiclyPublishable: false;
}

export const RNK_CP001_PROVISIONAL_AUTHORITIES: readonly RnkCp001ProvisionalAuthority[] = [
  {
    authorityId: 'RNK-CP001-AUTH-01-CONVERT-RANK-BETWEEN-ENDS',
    title: 'Convert rank between opposite ends',
    answerSemantic: 'RANK',
    evidenceFamily: 'TOTAL_PLUS_INCLUSIVE_RANK_FROM_ONE_END',
    governingEquation: 'oppositeRank = total - knownRank + 1',
    sideParameter: 'KNOWN_END',
    exactMiddleRequired: false,
    sourcePrototypeIds: ['RNK-CP001-PROT-OPPOSITE-END-RANK'],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP001-AUTH-02-TOTAL-FROM-BOTH-END-RANKS',
    title: 'Recover total from ranks at both ends',
    answerSemantic: 'TOTAL',
    evidenceFamily: 'TWO_INCLUSIVE_END_RANKS_FOR_ONE_PERSON',
    governingEquation: 'total = rankFromStart + rankFromEnd - 1',
    sideParameter: 'NONE',
    exactMiddleRequired: false,
    sourcePrototypeIds: ['RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS'],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP001-AUTH-03-SIDE-COUNT-FROM-SAME-SIDE-RANK',
    title: 'Find the exclusive side-count from rank on the same side',
    answerSemantic: 'COUNT',
    evidenceFamily: 'INCLUSIVE_RANK_FROM_NAMED_SIDE',
    governingEquation: 'sideCount = rankFromSameSide - 1',
    sideParameter: 'COUNTED_SIDE',
    exactMiddleRequired: false,
    sourcePrototypeIds: [
      'RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK',
      'RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK',
    ],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP001-AUTH-04-OPPOSITE-SIDE-COUNT-FROM-TOTAL-AND-RANK',
    title: 'Find the opposite side-count from total and one end-rank',
    answerSemantic: 'COUNT',
    evidenceFamily: 'TOTAL_PLUS_INCLUSIVE_RANK_FROM_OPPOSITE_SIDE',
    governingEquation: 'oppositeSideCount = total - suppliedRank',
    sideParameter: 'KNOWN_END',
    exactMiddleRequired: false,
    sourcePrototypeIds: [
      'RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK',
      'RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK',
    ],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP001-AUTH-05-SAME-SIDE-RANK-FROM-SIDE-COUNT',
    title: 'Recover rank from the exclusive count on the same side',
    answerSemantic: 'RANK',
    evidenceFamily: 'EXCLUSIVE_COUNT_ON_REQUESTED_SIDE',
    governingEquation: 'rankFromSameSide = sideCount + 1',
    sideParameter: 'REQUESTED_END',
    exactMiddleRequired: false,
    sourcePrototypeIds: [
      'RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE',
      'RNK-CP001-PROT-END-RANK-FROM-COUNT-AFTER',
    ],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP001-AUTH-06-OPPOSITE-END-RANK-FROM-TOTAL-AND-SIDE-COUNT',
    title: 'Recover opposite-end rank from total and a side-count',
    answerSemantic: 'RANK',
    evidenceFamily: 'TOTAL_PLUS_EXCLUSIVE_COUNT_ON_OPPOSITE_SIDE',
    governingEquation: 'rankFromOppositeEnd = total - suppliedSideCount',
    sideParameter: 'REQUESTED_END',
    exactMiddleRequired: false,
    sourcePrototypeIds: [
      'RNK-CP001-PROT-RANK-FROM-COUNT-AFTER-AND-TOTAL',
      'RNK-CP001-PROT-END-RANK-FROM-COUNT-BEFORE-AND-TOTAL',
    ],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP001-AUTH-07-EXACT-MIDDLE-RANK-FROM-ODD-TOTAL',
    title: 'Find the exact middle rank from an odd total',
    answerSemantic: 'RANK',
    evidenceFamily: 'ODD_TOTAL_PLUS_EXACT_MIDDLE_PREDICATE',
    governingEquation: 'middleRank = (total + 1) / 2',
    sideParameter: 'NONE',
    exactMiddleRequired: true,
    sourcePrototypeIds: ['RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL'],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP001-AUTH-08-ODD-TOTAL-FROM-EXACT-MIDDLE-RANK',
    title: 'Recover the odd total from an exact middle rank',
    answerSemantic: 'TOTAL',
    evidenceFamily: 'EXACT_MIDDLE_RANK_PLUS_SYMMETRY_PREDICATE',
    governingEquation: 'total = 2 * middleRank - 1',
    sideParameter: 'NONE',
    exactMiddleRequired: true,
    sourcePrototypeIds: ['RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK'],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP001-AUTH-09-TOTAL-FROM-BEFORE-AND-AFTER-COUNTS',
    title: 'Recover total from exclusive counts before and after one person',
    answerSemantic: 'TOTAL',
    evidenceFamily: 'TWO_EXCLUSIVE_SIDE_COUNTS_FOR_ONE_PERSON',
    governingEquation: 'total = beforeCount + afterCount + 1',
    sideParameter: 'NONE',
    exactMiddleRequired: false,
    sourcePrototypeIds: ['RNK-CP001-PROT-TOTAL-FROM-BEFORE-AFTER-COUNTS'],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
] as const;

const AUTHORITY_BY_PROTOTYPE = new Map<RnkCp001DiscoveryPrototypeId, RnkCp001ProvisionalAuthority>();
for (const authority of RNK_CP001_PROVISIONAL_AUTHORITIES) {
  for (const prototypeId of authority.sourcePrototypeIds) {
    if (AUTHORITY_BY_PROTOTYPE.has(prototypeId)) {
      throw new Error(`Prototype ${prototypeId} is assigned to more than one provisional authority`);
    }
    AUTHORITY_BY_PROTOTYPE.set(prototypeId, authority);
  }
}

export function authorityForRnkCp001Prototype(
  prototypeId: RnkCp001DiscoveryPrototypeId,
): RnkCp001ProvisionalAuthority {
  const authority = AUTHORITY_BY_PROTOTYPE.get(prototypeId);
  if (!authority) throw new Error(`No provisional authority owns ${prototypeId}`);
  return authority;
}

export function listRnkCp001PrototypeAuthorityRows(): readonly {
  readonly prototypeId: RnkCp001DiscoveryPrototypeId;
  readonly authorityId: RnkCp001ProvisionalAuthorityId;
  readonly answerSemantic: RnkCp001AuthorityAnswerSemantic;
  readonly governingEquation: string;
}[] {
  return RNK_CP001_DISCOVERY_PROTOTYPE_IDS.map((prototypeId) => {
    const authority = authorityForRnkCp001Prototype(prototypeId);
    return {
      prototypeId,
      authorityId: authority.authorityId,
      answerSemantic: authority.answerSemantic,
      governingEquation: authority.governingEquation,
    };
  });
}
