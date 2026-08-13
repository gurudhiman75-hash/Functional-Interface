import {
  generateRnkCp001Question,
  type RnkCp001Question,
  type RnkCp001PrototypeId,
} from './cp001-runtime';
import {
  generateRnkCp001SourceWaveReviewedQuestion,
  type RnkCp001SourceWavePrototypeId,
  type RnkCp001SourceWaveQuestion,
} from './cp001-source-wave-reviewed';
import {
  generateRnkCp001FinalInverseReviewedQuestion,
  RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID,
  type RnkCp001FinalInverseQuestion,
} from './cp001-final-inverse-reviewed';
import {
  authorityForRnkCp001Prototype,
  RNK_CP001_PROVISIONAL_AUTHORITIES,
  RNK_CP001_PROVISIONAL_AUTHORITY_IDS,
  type RnkCp001DiscoveryPrototypeId,
  type RnkCp001ProvisionalAuthority,
  type RnkCp001ProvisionalAuthorityId,
} from './cp001-provisional-consolidation';

export type RnkCp001AuthorityUnderlyingQuestion =
  | RnkCp001Question
  | RnkCp001SourceWaveQuestion
  | RnkCp001FinalInverseQuestion;

export interface RnkCp001ProvisionalAuthorityReviewQuestion {
  readonly packageId: 'RNK-001';
  readonly checkpointId: 'RNK-CP-001';
  readonly provisionalAuthorityId: RnkCp001ProvisionalAuthorityId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: 'en-IN';
  readonly sourcePrototypeId: RnkCp001DiscoveryPrototypeId;
  readonly sourceVariantIndex: number;
  readonly sourceVariantCount: number;
  readonly authorityContract: {
    readonly title: string;
    readonly answerSemantic: 'RANK' | 'COUNT' | 'TOTAL';
    readonly evidenceFamily: string;
    readonly governingEquation: string;
    readonly sideParameter: 'NONE' | 'KNOWN_END' | 'COUNTED_SIDE' | 'REQUESTED_END';
    readonly exactMiddleRequired: boolean;
  };
  readonly reviewStatus: 'ENGLISH_REVIEW_REQUIRED';
  readonly question: RnkCp001AuthorityUnderlyingQuestion;
  readonly lifecycle: {
    readonly questionStudioDiscoverable: false;
    readonly questionBankStatus: 'NOT_STORED';
    readonly testEligibility: 'INELIGIBLE';
    readonly publiclyPublishable: false;
  };
}

const AUTHORITY_BY_ID = new Map<RnkCp001ProvisionalAuthorityId, RnkCp001ProvisionalAuthority>(
  RNK_CP001_PROVISIONAL_AUTHORITIES.map((authority) => [authority.authorityId, authority]),
);

const FOUNDATION_IDS = new Set<RnkCp001DiscoveryPrototypeId>([
  'RNK-CP001-PROT-OPPOSITE-END-RANK',
  'RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS',
  'RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK',
  'RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK',
  'RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE',
  'RNK-CP001-PROT-RANK-FROM-COUNT-AFTER-AND-TOTAL',
]);

const SOURCE_WAVE_IDS = new Set<RnkCp001DiscoveryPrototypeId>([
  'RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL',
  'RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK',
  'RNK-CP001-PROT-TOTAL-FROM-BEFORE-AFTER-COUNTS',
  'RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK',
  'RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK',
  'RNK-CP001-PROT-END-RANK-FROM-COUNT-AFTER',
]);

function generateUnderlyingQuestion(
  prototypeId: RnkCp001DiscoveryPrototypeId,
  seed: number,
): RnkCp001AuthorityUnderlyingQuestion {
  if (FOUNDATION_IDS.has(prototypeId)) {
    return generateRnkCp001Question(prototypeId as RnkCp001PrototypeId, seed);
  }
  if (SOURCE_WAVE_IDS.has(prototypeId)) {
    return generateRnkCp001SourceWaveReviewedQuestion(
      prototypeId as RnkCp001SourceWavePrototypeId,
      seed,
    );
  }
  if (prototypeId === RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID) {
    return generateRnkCp001FinalInverseReviewedQuestion(seed);
  }
  throw new Error(`Unsupported RNK CP-001 source prototype ${prototypeId}`);
}

function authorityById(authorityId: RnkCp001ProvisionalAuthorityId): RnkCp001ProvisionalAuthority {
  const authority = AUTHORITY_BY_ID.get(authorityId);
  if (!authority) throw new Error(`Unknown RNK CP-001 provisional authority ${authorityId}`);
  return authority;
}

export function generateRnkCp001ProvisionalAuthorityReviewQuestion(
  authorityId: RnkCp001ProvisionalAuthorityId,
  seed: number,
): RnkCp001ProvisionalAuthorityReviewQuestion {
  if (!RNK_CP001_PROVISIONAL_AUTHORITY_IDS.includes(authorityId)) {
    throw new Error(`Unknown RNK CP-001 provisional authority ${authorityId}`);
  }
  if (!Number.isInteger(seed)) throw new Error(`Seed must be an integer: ${seed}`);

  const authority = authorityById(authorityId);
  const sourceVariantCount = authority.sourcePrototypeIds.length;
  const authorityIndex = RNK_CP001_PROVISIONAL_AUTHORITY_IDS.indexOf(authorityId);
  const sourceVariantIndex = (Math.abs(seed) + authorityIndex) % sourceVariantCount;
  const sourcePrototypeId = authority.sourcePrototypeIds[sourceVariantIndex];
  const question = generateUnderlyingQuestion(sourcePrototypeId, seed);

  if (question.prototypeId !== sourcePrototypeId) {
    throw new Error(`${authorityId} seed ${seed}: source prototype mismatch`);
  }
  if (authorityForRnkCp001Prototype(sourcePrototypeId).authorityId !== authorityId) {
    throw new Error(`${authorityId} seed ${seed}: ownership mismatch`);
  }
  if (question.answerSemantic !== authority.answerSemantic) {
    throw new Error(`${authorityId} seed ${seed}: answer-semantic mismatch`);
  }

  return {
    packageId: 'RNK-001',
    checkpointId: 'RNK-CP-001',
    provisionalAuthorityId: authorityId,
    permanentQlId: null,
    seed,
    locale: 'en-IN',
    sourcePrototypeId,
    sourceVariantIndex,
    sourceVariantCount,
    authorityContract: {
      title: authority.title,
      answerSemantic: authority.answerSemantic,
      evidenceFamily: authority.evidenceFamily,
      governingEquation: authority.governingEquation,
      sideParameter: authority.sideParameter,
      exactMiddleRequired: authority.exactMiddleRequired,
    },
    reviewStatus: 'ENGLISH_REVIEW_REQUIRED',
    question,
    lifecycle: {
      questionStudioDiscoverable: false,
      questionBankStatus: 'NOT_STORED',
      testEligibility: 'INELIGIBLE',
      publiclyPublishable: false,
    },
  };
}

export function generateRnkCp001ProvisionalAuthorityReviewSet(
  seed: number,
): readonly RnkCp001ProvisionalAuthorityReviewQuestion[] {
  return RNK_CP001_PROVISIONAL_AUTHORITY_IDS.map((authorityId) =>
    generateRnkCp001ProvisionalAuthorityReviewQuestion(authorityId, seed),
  );
}
