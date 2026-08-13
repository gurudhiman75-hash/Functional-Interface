import {
  generateRnkCp002Question,
  type RnkCp002Question,
  type RnkCp002PrototypeId,
} from './cp002-foundation';
import {
  generateReviewedRnkCp002SourceQuestion,
} from './cp002-source-wave-reviewed';
import type {
  RnkCp002SourceQuestion,
  RnkCp002SourceWavePrototypeId,
} from './cp002-source-wave';
import {
  authorityForRnkCp002Prototype,
  RNK_CP002_AUTHORITY_IDS,
  type RnkCp002AuthorityId,
  type RnkCp002DiscoveryPrototypeId,
} from './cp002-consolidation';

export type RnkCp002AuthorityReviewQuestion =
  | (RnkCp002Question & {
      readonly authorityId: RnkCp002AuthorityId;
      readonly sourcePrototypeId: RnkCp002PrototypeId;
      readonly authorityReviewStatus: 'ENGLISH_REVIEW_CANDIDATE';
    })
  | (RnkCp002SourceQuestion & {
      readonly authorityId: RnkCp002AuthorityId;
      readonly sourcePrototypeId: RnkCp002SourceWavePrototypeId;
      readonly authorityReviewStatus: 'ENGLISH_REVIEW_CANDIDATE';
    });

const VARIANTS_BY_AUTHORITY: Readonly<Record<RnkCp002AuthorityId, readonly RnkCp002DiscoveryPrototypeId[]>> = {
  'RNK-CP002-AUTH-01-PEOPLE-BETWEEN-NORMALIZED-POSITIONS': [
    'RNK-CP002-PROT-PEOPLE-BETWEEN-SAME-END-RANKS',
    'RNK-CP002-PROT-PEOPLE-BETWEEN-MIXED-END-RANKS',
  ],
  'RNK-CP002-AUTH-02-POSITION-GAP-NORMALIZED-POSITIONS': [
    'RNK-CP002-PROT-POSITION-GAP-SAME-END-RANKS',
    'RNK-CP002-PROT-POSITION-GAP-MIXED-END-RANKS',
    'RNK-CP002-PROT-OFFSET-FROM-SAME-END-RANKS',
  ],
  'RNK-CP002-AUTH-03-TARGET-RANK-FROM-REFERENCE-AND-SEPARATION': [
    'RNK-CP002-PROT-SECOND-RANK-FROM-RELATIVE-OFFSET',
    'RNK-CP002-PROT-TARGET-RANK-FROM-BETWEEN-AND-ORDER',
  ],
  'RNK-CP002-AUTH-04-COMPARE-NORMALIZED-POSITIONS': [
    'RNK-CP002-PROT-COMPARE-SAME-END-RANKS',
    'RNK-CP002-PROT-COMPARE-MIXED-END-RANKS-WITH-TOTAL',
  ],
  'RNK-CP002-AUTH-05-TOTAL-FROM-MIXED-ENDS-KNOWN-ORDER': [
    'RNK-CP002-PROT-TOTAL-FROM-MIXED-END-RANKS-KNOWN-ORDER',
  ],
  'RNK-CP002-AUTH-06-EXTREME-TOTAL-UNKNOWN-ORDER': [
    'RNK-CP002-PROT-EXTREME-TOTAL-FROM-MIXED-END-RANKS-UNKNOWN-ORDER',
  ],
  'RNK-CP002-AUTH-07-EXACT-TOTAL-OR-INDETERMINATE': [
    'RNK-CP002-PROT-EXACT-TOTAL-OR-INDETERMINATE-UNKNOWN-ORDER',
  ],
  'RNK-CP002-AUTH-08-PROPOSED-TOTAL-ORDER-STATUS': [
    'RNK-CP002-PROT-PROPOSED-TOTAL-COMPATIBLE-ORDER',
  ],
};

const BASE_PROTOTYPES = new Set<RnkCp002DiscoveryPrototypeId>([
  'RNK-CP002-PROT-PEOPLE-BETWEEN-SAME-END-RANKS',
  'RNK-CP002-PROT-POSITION-GAP-SAME-END-RANKS',
  'RNK-CP002-PROT-SECOND-RANK-FROM-RELATIVE-OFFSET',
  'RNK-CP002-PROT-PEOPLE-BETWEEN-MIXED-END-RANKS',
  'RNK-CP002-PROT-TOTAL-FROM-MIXED-END-RANKS-KNOWN-ORDER',
  'RNK-CP002-PROT-EXTREME-TOTAL-FROM-MIXED-END-RANKS-UNKNOWN-ORDER',
]);

export function listRnkCp002AuthorityVariants(authorityId: RnkCp002AuthorityId): readonly RnkCp002DiscoveryPrototypeId[] {
  return VARIANTS_BY_AUTHORITY[authorityId];
}

export function generateRnkCp002AuthorityQuestion(
  authorityId: RnkCp002AuthorityId,
  seed: number,
): RnkCp002AuthorityReviewQuestion {
  const variants = VARIANTS_BY_AUTHORITY[authorityId];
  const sourcePrototypeId = variants[Math.abs(seed) % variants.length];
  const owner = authorityForRnkCp002Prototype(sourcePrototypeId);
  if (owner.authorityId !== authorityId) throw new Error(`${sourcePrototypeId} is not owned by ${authorityId}`);

  if (BASE_PROTOTYPES.has(sourcePrototypeId)) {
    const question = generateRnkCp002Question(sourcePrototypeId as RnkCp002PrototypeId, seed);
    return {
      ...question,
      authorityId,
      sourcePrototypeId: sourcePrototypeId as RnkCp002PrototypeId,
      authorityReviewStatus: 'ENGLISH_REVIEW_CANDIDATE',
    };
  }

  const question = generateReviewedRnkCp002SourceQuestion(
    sourcePrototypeId as RnkCp002SourceWavePrototypeId,
    seed,
  );
  return {
    ...question,
    authorityId,
    sourcePrototypeId: sourcePrototypeId as RnkCp002SourceWavePrototypeId,
    authorityReviewStatus: 'ENGLISH_REVIEW_CANDIDATE',
  };
}

export { RNK_CP002_AUTHORITY_IDS };
