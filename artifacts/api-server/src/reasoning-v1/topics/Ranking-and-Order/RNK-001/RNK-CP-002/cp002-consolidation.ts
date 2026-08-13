import {
  RNK_CP002_PROTOTYPE_IDS,
  type RnkCp002PrototypeId,
} from './cp002-foundation';
import {
  RNK_CP002_SOURCE_WAVE_PROTOTYPE_IDS,
  type RnkCp002SourceWavePrototypeId,
} from './cp002-source-wave';

export type RnkCp002DiscoveryPrototypeId =
  | RnkCp002PrototypeId
  | RnkCp002SourceWavePrototypeId;

export const RNK_CP002_DISCOVERY_PROTOTYPE_IDS = [
  ...RNK_CP002_PROTOTYPE_IDS,
  ...RNK_CP002_SOURCE_WAVE_PROTOTYPE_IDS,
] as const satisfies readonly RnkCp002DiscoveryPrototypeId[];

export const RNK_CP002_AUTHORITY_IDS = [
  'RNK-CP002-AUTH-01-PEOPLE-BETWEEN-NORMALIZED-POSITIONS',
  'RNK-CP002-AUTH-02-POSITION-GAP-NORMALIZED-POSITIONS',
  'RNK-CP002-AUTH-03-TARGET-RANK-FROM-REFERENCE-AND-SEPARATION',
  'RNK-CP002-AUTH-04-COMPARE-NORMALIZED-POSITIONS',
  'RNK-CP002-AUTH-05-TOTAL-FROM-MIXED-ENDS-KNOWN-ORDER',
  'RNK-CP002-AUTH-06-EXTREME-TOTAL-UNKNOWN-ORDER',
  'RNK-CP002-AUTH-07-EXACT-TOTAL-OR-INDETERMINATE',
  'RNK-CP002-AUTH-08-PROPOSED-TOTAL-ORDER-STATUS',
] as const;

export type RnkCp002AuthorityId = (typeof RNK_CP002_AUTHORITY_IDS)[number];

export interface RnkCp002Authority {
  readonly authorityId: RnkCp002AuthorityId;
  readonly title: string;
  readonly governingContract: string;
  readonly answerSemantic: 'COUNT' | 'RANK' | 'PERSON' | 'TOTAL' | 'TOTAL_OR_INDETERMINATE' | 'ORDER_STATUS';
  readonly sourcePrototypeIds: readonly RnkCp002DiscoveryPrototypeId[];
  readonly permanentQlId: null;
  readonly reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW';
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: 'NOT_STORED';
  readonly testEligibility: 'INELIGIBLE';
  readonly publiclyPublishable: false;
}

export const RNK_CP002_AUTHORITIES: readonly RnkCp002Authority[] = [
  {
    authorityId: 'RNK-CP002-AUTH-01-PEOPLE-BETWEEN-NORMALIZED-POSITIONS',
    title: 'Find people strictly between two normalized positions',
    governingContract: 'between = abs(commonStartRankA - commonStartRankB) - 1',
    answerSemantic: 'COUNT',
    sourcePrototypeIds: [
      'RNK-CP002-PROT-PEOPLE-BETWEEN-SAME-END-RANKS',
      'RNK-CP002-PROT-PEOPLE-BETWEEN-MIXED-END-RANKS',
    ],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP002-AUTH-02-POSITION-GAP-NORMALIZED-POSITIONS',
    title: 'Find the positional gap between two normalized positions',
    governingContract: 'gap = abs(commonStartRankA - commonStartRankB)',
    answerSemantic: 'COUNT',
    sourcePrototypeIds: [
      'RNK-CP002-PROT-POSITION-GAP-SAME-END-RANKS',
      'RNK-CP002-PROT-POSITION-GAP-MIXED-END-RANKS',
      'RNK-CP002-PROT-OFFSET-FROM-SAME-END-RANKS',
    ],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP002-AUTH-03-TARGET-RANK-FROM-REFERENCE-AND-SEPARATION',
    title: 'Recover a target rank from a reference rank and directional separation',
    governingContract: 'targetRank = referenceRank +/- (offset or between + 1), oriented by numbering side',
    answerSemantic: 'RANK',
    sourcePrototypeIds: [
      'RNK-CP002-PROT-SECOND-RANK-FROM-RELATIVE-OFFSET',
      'RNK-CP002-PROT-TARGET-RANK-FROM-BETWEEN-AND-ORDER',
    ],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP002-AUTH-04-COMPARE-NORMALIZED-POSITIONS',
    title: 'Identify which person is nearer a requested end',
    governingContract: 'normalize both positions to one end, then compare toward requested end',
    answerSemantic: 'PERSON',
    sourcePrototypeIds: [
      'RNK-CP002-PROT-COMPARE-SAME-END-RANKS',
      'RNK-CP002-PROT-COMPARE-MIXED-END-RANKS-WITH-TOTAL',
    ],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP002-AUTH-05-TOTAL-FROM-MIXED-ENDS-KNOWN-ORDER',
    title: 'Recover total from mixed-end ranks, between-count and known order',
    governingContract: 'total = startRank + endRank + between when start-ranked person is first; otherwise startRank + endRank - between - 2',
    answerSemantic: 'TOTAL',
    sourcePrototypeIds: ['RNK-CP002-PROT-TOTAL-FROM-MIXED-END-RANKS-KNOWN-ORDER'],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP002-AUTH-06-EXTREME-TOTAL-UNKNOWN-ORDER',
    title: 'Find the minimum or maximum valid total when relative order is unknown',
    governingContract: 'evaluate both order totals, reject invalid reversed branch, choose requested extreme',
    answerSemantic: 'TOTAL',
    sourcePrototypeIds: ['RNK-CP002-PROT-EXTREME-TOTAL-FROM-MIXED-END-RANKS-UNKNOWN-ORDER'],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP002-AUTH-07-EXACT-TOTAL-OR-INDETERMINATE',
    title: 'Resolve exact total or indeterminacy when relative order is unknown',
    governingContract: 'one valid branch gives exact total; two valid branch totals give Cannot be determined',
    answerSemantic: 'TOTAL_OR_INDETERMINATE',
    sourcePrototypeIds: ['RNK-CP002-PROT-EXACT-TOTAL-OR-INDETERMINATE-UNKNOWN-ORDER'],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
  {
    authorityId: 'RNK-CP002-AUTH-08-PROPOSED-TOTAL-ORDER-STATUS',
    title: 'Identify the relative order compatible with a proposed total',
    governingContract: 'match proposed total to valid high/low order branches; no match is impossible',
    answerSemantic: 'ORDER_STATUS',
    sourcePrototypeIds: ['RNK-CP002-PROT-PROPOSED-TOTAL-COMPATIBLE-ORDER'],
    permanentQlId: null,
    reviewStatus: 'PROVISIONAL_CONSOLIDATION_REVIEW',
    questionStudioDiscoverable: false,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
  },
] as const;

const AUTHORITY_BY_PROTOTYPE = new Map<RnkCp002DiscoveryPrototypeId, RnkCp002Authority>();
for (const authority of RNK_CP002_AUTHORITIES) {
  for (const prototypeId of authority.sourcePrototypeIds) {
    if (AUTHORITY_BY_PROTOTYPE.has(prototypeId)) throw new Error(`${prototypeId} has multiple CP-002 authorities`);
    AUTHORITY_BY_PROTOTYPE.set(prototypeId, authority);
  }
}

export function authorityForRnkCp002Prototype(prototypeId: RnkCp002DiscoveryPrototypeId): RnkCp002Authority {
  const authority = AUTHORITY_BY_PROTOTYPE.get(prototypeId);
  if (!authority) throw new Error(`No CP-002 authority owns ${prototypeId}`);
  return authority;
}
