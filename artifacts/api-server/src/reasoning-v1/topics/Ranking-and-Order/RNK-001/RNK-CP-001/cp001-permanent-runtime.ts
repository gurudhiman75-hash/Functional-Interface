import {
  generateRnkCp001EnglishReviewedAuthorityQuestion,
  type RnkCp001ProvisionalAuthorityReviewQuestion,
} from './cp001-english-review-remediated-runtime';
import type { RnkCp001ProvisionalAuthorityId } from './cp001-provisional-consolidation';

export const RNK_CP001_PERMANENT_QL_IDS = [
  'RNK-QL-001',
  'RNK-QL-002',
  'RNK-QL-003',
  'RNK-QL-004',
  'RNK-QL-005',
  'RNK-QL-006',
  'RNK-QL-007',
  'RNK-QL-008',
  'RNK-QL-009',
] as const;

export type RnkCp001PermanentQlId = (typeof RNK_CP001_PERMANENT_QL_IDS)[number];

export const RNK_CP001_QL_TO_AUTHORITY = {
  'RNK-QL-001': 'RNK-CP001-AUTH-01-CONVERT-RANK-BETWEEN-ENDS',
  'RNK-QL-002': 'RNK-CP001-AUTH-02-TOTAL-FROM-BOTH-END-RANKS',
  'RNK-QL-003': 'RNK-CP001-AUTH-03-SIDE-COUNT-FROM-SAME-SIDE-RANK',
  'RNK-QL-004': 'RNK-CP001-AUTH-04-OPPOSITE-SIDE-COUNT-FROM-TOTAL-AND-RANK',
  'RNK-QL-005': 'RNK-CP001-AUTH-05-SAME-SIDE-RANK-FROM-SIDE-COUNT',
  'RNK-QL-006': 'RNK-CP001-AUTH-06-OPPOSITE-END-RANK-FROM-TOTAL-AND-SIDE-COUNT',
  'RNK-QL-007': 'RNK-CP001-AUTH-07-EXACT-MIDDLE-RANK-FROM-ODD-TOTAL',
  'RNK-QL-008': 'RNK-CP001-AUTH-08-ODD-TOTAL-FROM-EXACT-MIDDLE-RANK',
  'RNK-QL-009': 'RNK-CP001-AUTH-09-TOTAL-FROM-BEFORE-AND-AFTER-COUNTS',
} as const satisfies Readonly<Record<RnkCp001PermanentQlId, RnkCp001ProvisionalAuthorityId>>;

type Reviewed = RnkCp001ProvisionalAuthorityReviewQuestion;
type ReviewedQuestion = Reviewed['question'];

export interface RnkCp001PermanentQuestion {
  readonly packageId: 'RNK-001';
  readonly checkpointId: 'RNK-CP-001';
  readonly qlId: RnkCp001PermanentQlId;
  readonly permanentQlId: RnkCp001PermanentQlId;
  readonly seed: number;
  readonly locale: 'en-IN';
  readonly authorityId: RnkCp001ProvisionalAuthorityId;
  readonly authorityContract: Reviewed['authorityContract'];
  readonly stem: string;
  readonly displayedEvidence: ReviewedQuestion['displayedEvidence'];
  readonly answerSemantic: ReviewedQuestion['answerSemantic'];
  readonly answer: number;
  readonly options: ReviewedQuestion['options'];
  readonly correctIndex: number;
  readonly difficulty: ReviewedQuestion['difficulty'];
  readonly normalizedState: ReviewedQuestion['normalizedState'];
  readonly explanation: ReviewedQuestion['explanation'];
  readonly mathematicalFingerprint: string;
  readonly reviewMetadata: {
    readonly sourcePrototypeId: Reviewed['sourcePrototypeId'];
    readonly sourceVariantIndex: number;
    readonly sourceVariantCount: number;
    readonly discoverySeed: number;
    readonly englishReviewProjectionVersion: 'RNK_CP001_ENGLISH_REVIEW_V1';
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

export function authorityForRnkCp001Ql(
  qlId: RnkCp001PermanentQlId,
): RnkCp001ProvisionalAuthorityId {
  return RNK_CP001_QL_TO_AUTHORITY[qlId];
}

export function generateRnkCp001PermanentQuestion(
  qlId: RnkCp001PermanentQlId,
  seed: number,
): RnkCp001PermanentQuestion {
  const authorityId = authorityForRnkCp001Ql(qlId);
  const reviewed = generateRnkCp001EnglishReviewedAuthorityQuestion(authorityId, seed);
  const question = reviewed.question;

  return {
    packageId: 'RNK-001',
    checkpointId: 'RNK-CP-001',
    qlId,
    permanentQlId: qlId,
    seed,
    locale: 'en-IN',
    authorityId,
    authorityContract: reviewed.authorityContract,
    stem: question.stem,
    displayedEvidence: question.displayedEvidence,
    answerSemantic: question.answerSemantic,
    answer: question.answer,
    options: question.options,
    correctIndex: question.correctIndex,
    difficulty: question.difficulty,
    normalizedState: question.normalizedState,
    explanation: question.explanation,
    mathematicalFingerprint: question.mathematicalFingerprint,
    reviewMetadata: {
      sourcePrototypeId: reviewed.sourcePrototypeId,
      sourceVariantIndex: reviewed.sourceVariantIndex,
      sourceVariantCount: reviewed.sourceVariantCount,
      discoverySeed: reviewed.seed,
      englishReviewProjectionVersion: 'RNK_CP001_ENGLISH_REVIEW_V1',
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
