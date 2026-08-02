import {
  listRnkCp002AuthorityVariants,
} from './cp002-authority-runtime';
import {
  generateEnglishReviewedRnkCp002AuthorityQuestion,
  type RnkCp002EnglishReviewedAuthorityQuestion,
} from './cp002-english-reviewed-authority-runtime';
import type { RnkCp002AuthorityId } from './cp002-consolidation';

export const RNK_CP002_PERMANENT_QL_IDS = [
  'RNK-QL-010',
  'RNK-QL-011',
  'RNK-QL-012',
  'RNK-QL-013',
  'RNK-QL-014',
  'RNK-QL-015',
  'RNK-QL-016',
  'RNK-QL-017',
] as const;

export type RnkCp002PermanentQlId = (typeof RNK_CP002_PERMANENT_QL_IDS)[number];

export const RNK_CP002_QL_TO_AUTHORITY = {
  'RNK-QL-010': 'RNK-CP002-AUTH-01-PEOPLE-BETWEEN-NORMALIZED-POSITIONS',
  'RNK-QL-011': 'RNK-CP002-AUTH-02-POSITION-GAP-NORMALIZED-POSITIONS',
  'RNK-QL-012': 'RNK-CP002-AUTH-03-TARGET-RANK-FROM-REFERENCE-AND-SEPARATION',
  'RNK-QL-013': 'RNK-CP002-AUTH-04-COMPARE-NORMALIZED-POSITIONS',
  'RNK-QL-014': 'RNK-CP002-AUTH-05-TOTAL-FROM-MIXED-ENDS-KNOWN-ORDER',
  'RNK-QL-015': 'RNK-CP002-AUTH-06-EXTREME-TOTAL-UNKNOWN-ORDER',
  'RNK-QL-016': 'RNK-CP002-AUTH-07-EXACT-TOTAL-OR-INDETERMINATE',
  'RNK-QL-017': 'RNK-CP002-AUTH-08-PROPOSED-TOTAL-ORDER-STATUS',
} as const satisfies Readonly<Record<RnkCp002PermanentQlId, RnkCp002AuthorityId>>;

type Reviewed = RnkCp002EnglishReviewedAuthorityQuestion;

export interface RnkCp002PermanentQuestion {
  readonly packageId: 'RNK-001';
  readonly checkpointId: 'RNK-CP-002';
  readonly qlId: RnkCp002PermanentQlId;
  readonly permanentQlId: RnkCp002PermanentQlId;
  readonly seed: number;
  readonly locale: 'en-IN';
  readonly authorityId: RnkCp002AuthorityId;
  readonly contextId: Reviewed['contextId'];
  readonly firstName: string;
  readonly secondName: string;
  readonly stem: string;
  readonly displayedEvidence: Reviewed['displayedEvidence'];
  readonly answerSemantic: Reviewed['answerSemantic'];
  readonly answer: Reviewed['answer'];
  readonly options: Reviewed['options'];
  readonly correctIndex: number;
  readonly difficulty: Reviewed['difficulty'];
  readonly normalizedState: Reviewed['normalizedState'];
  readonly explanation: Reviewed['explanation'];
  readonly mathematicalFingerprint: string;
  readonly reviewMetadata: {
    readonly sourcePrototypeId: string;
    readonly sourceVariantIndex: number;
    readonly sourceVariantCount: number;
    readonly discoverySeed: number;
    readonly canonicalAnswer: string | number;
    readonly canonicalOptionValues: readonly (string | number)[];
    readonly englishReviewProjectionVersion: 'RNK_CP002_ENGLISH_REVIEW_V1';
  };
  readonly lifecycle: {
    readonly reviewStatus: 'ENGLISH_DISCOVERY_FROZEN';
    readonly englishReviewOnly: true;
    readonly questionStudioDiscoverable: false;
    readonly questionBankStatus: 'NOT_STORED';
    readonly testEligibility: 'INELIGIBLE';
    readonly publiclyPublishable: false;
  };
}

export function authorityForRnkCp002Ql(qlId: RnkCp002PermanentQlId): RnkCp002AuthorityId {
  return RNK_CP002_QL_TO_AUTHORITY[qlId];
}

export function generateRnkCp002PermanentQuestion(
  qlId: RnkCp002PermanentQlId,
  seed: number,
): RnkCp002PermanentQuestion {
  const authorityId = authorityForRnkCp002Ql(qlId);
  const reviewed = generateEnglishReviewedRnkCp002AuthorityQuestion(authorityId, seed);
  const variants = listRnkCp002AuthorityVariants(authorityId);
  const sourceVariantIndex = variants.indexOf(reviewed.sourcePrototypeId as never);
  if (sourceVariantIndex < 0) throw new Error(`${reviewed.sourcePrototypeId} is not owned by ${authorityId}`);

  return {
    packageId: 'RNK-001',
    checkpointId: 'RNK-CP-002',
    qlId,
    permanentQlId: qlId,
    seed,
    locale: 'en-IN',
    authorityId,
    contextId: reviewed.contextId,
    firstName: reviewed.firstName,
    secondName: reviewed.secondName,
    stem: reviewed.stem,
    displayedEvidence: reviewed.displayedEvidence,
    answerSemantic: reviewed.answerSemantic,
    answer: reviewed.answer,
    options: reviewed.options,
    correctIndex: reviewed.correctIndex,
    difficulty: reviewed.difficulty,
    normalizedState: reviewed.normalizedState,
    explanation: reviewed.explanation,
    mathematicalFingerprint: reviewed.mathematicalFingerprint,
    reviewMetadata: {
      sourcePrototypeId: reviewed.sourcePrototypeId,
      sourceVariantIndex,
      sourceVariantCount: variants.length,
      discoverySeed: seed,
      canonicalAnswer: reviewed.reviewMetadata.canonicalAnswer,
      canonicalOptionValues: reviewed.reviewMetadata.canonicalOptionValues,
      englishReviewProjectionVersion: 'RNK_CP002_ENGLISH_REVIEW_V1',
    },
    lifecycle: {
      reviewStatus: 'ENGLISH_DISCOVERY_FROZEN',
      englishReviewOnly: true,
      questionStudioDiscoverable: false,
      questionBankStatus: 'NOT_STORED',
      testEligibility: 'INELIGIBLE',
      publiclyPublishable: false,
    },
  };
}
