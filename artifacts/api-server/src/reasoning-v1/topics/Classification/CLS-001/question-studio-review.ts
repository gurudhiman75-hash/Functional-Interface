import { generateClsCp001Question } from "./CLS-CP-001/cp001-multilingual-runtime";
import { generateClsCp002Question } from "./CLS-CP-002/cp002-multilingual-runtime";
import { generateClsCp003EnglishQuestion } from "./CLS-CP-003/cp003-english-runtime";
import { generateClsCp003LocalizedQuestionV5 } from "./CLS-CP-003/cp003-localized-runtime-v5";
import { generateClsCp004EnglishQuestion } from "./CLS-CP-004/cp004-english-runtime";
import { generateClsCp004LocalizedReviewQuestion } from "./CLS-CP-004/cp004-localized-review-runtime";
import { generateClsCp005EnglishQuestion } from "./CLS-CP-005/cp005-english-runtime";
import { generateClsCp005LearnerReviewV2 } from "./CLS-CP-005/cp005-learner-review-v2";
import { generateClsCp006EnglishQuestion } from "./CLS-CP-006/cp006-english-runtime";
import { generateClsCp006LearnerReviewV2 } from "./CLS-CP-006/cp006-learner-review-v2";
import {
  generateClsCp007PermanentClusterPairQuestion,
  generateClsCp007PermanentClusterQuestion,
} from "./CLS-CP-007/cp007-english-contracts";
import { CLS_CP007_PROTOTYPES } from "./CLS-CP-007/cluster-domain";
import {
  generateClsCp007LocalizedClusterQuestionV3,
  generateClsCp007LocalizedPairQuestionV3,
} from "./CLS-CP-007/cp007-localized-runtime-v3";

export const CLS_001_QUESTION_STUDIO_PACKAGE_ID = "CLS-001" as const;
export const CLS_001_QUESTION_STUDIO_REVIEW_AUTHORITY = "CLS-001-FINAL-CHAPTER-CLOSEOUT-REVIEW-V1" as const;
export const CLS_001_QUESTION_STUDIO_LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const;
export type Cls001QuestionStudioLocale = typeof CLS_001_QUESTION_STUDIO_LOCALES[number];

export const CLS_001_QUESTION_STUDIO_QL_IDS = [
  "CLS-QL-001",
  "CLS-QL-002",
  "CLS-QL-003",
  "CLS-QL-004",
  "CLS-QL-005",
  "CLS-QL-006",
  "CLS-QL-007",
  "CLS-QL-008",
  "CLS-QL-009",
  "CLS-QL-010",
  "CLS-QL-011",
  "CLS-QL-012",
  "CLS-QL-013",
] as const;
export type Cls001QuestionStudioQlId = typeof CLS_001_QUESTION_STUDIO_QL_IDS[number];

export const CLS_001_QUESTION_STUDIO_GENERATION_CHECKPOINTS = [
  "CLS-CP-001",
  "CLS-CP-002",
  "CLS-CP-003",
  "CLS-CP-004",
  "CLS-CP-005",
  "CLS-CP-006",
  "CLS-CP-007",
] as const;

const QL_SET = new Set<string>(CLS_001_QUESTION_STUDIO_QL_IDS);
const LOCALE_SET = new Set<string>(CLS_001_QUESTION_STUDIO_LOCALES);

export type PreviewCls001QuestionStudioInput = Readonly<{
  qlId: string;
  locale?: Cls001QuestionStudioLocale;
  seed?: number;
}>;

export const CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: CLS_001_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: "CLS-001" as const,
  label: "Classification / Odd One Out" as const,
  subject: "Reasoning Ability" as const,
  topic: "Reasoning" as const,
  subtopic: "Classification / Odd One Out" as const,
  integrationAuthority: CLS_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  reviewStatus: "MULTILINGUAL_EDITORIAL_APPROVED_REVIEW_ONLY" as const,
  chapterCheckpointCount: 8 as const,
  checkpointCount: CLS_001_QUESTION_STUDIO_GENERATION_CHECKPOINTS.length,
  checkpoints: CLS_001_QUESTION_STUDIO_GENERATION_CHECKPOINTS,
  ownershipCheckpointId: "CLS-CP-008" as const,
  permanentQlCount: CLS_001_QUESTION_STUDIO_QL_IDS.length,
  permanentQlIds: CLS_001_QUESTION_STUDIO_QL_IDS,
  supportedLocales: CLS_001_QUESTION_STUDIO_LOCALES,
  enabled: true as const,
  questionStudioVisible: true as const,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
  reviewOnly: true as const,
  sourceRuntimeQuestionStudioDiscoverable: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  manualApprovalRequired: true as const,
});

function normalizeSeed(seed: number | undefined): number {
  if (seed === undefined) return 1;
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error("CLS-001 Question Studio seed must be a non-negative safe integer: " + String(seed));
  }
  return seed;
}

function optionCountForSeed(seed: number): 4 | 5 {
  return seed % 4 === 0 ? 5 : 4;
}

function asRecord(value: unknown): Readonly<Record<string, unknown>> {
  return value !== null && typeof value === "object"
    ? value as Readonly<Record<string, unknown>>
    : {};
}

function generateApprovedQuestion(
  qlId: Cls001QuestionStudioQlId,
  locale: Cls001QuestionStudioLocale,
  seed: number,
) {
  const optionCount = optionCountForSeed(seed);

  switch (qlId) {
    case "CLS-QL-001":
    case "CLS-QL-002":
    case "CLS-QL-003":
      return generateClsCp001Question(qlId, locale, seed);
    case "CLS-QL-004":
      return generateClsCp002Question(qlId, locale, seed);
    case "CLS-QL-005":
    case "CLS-QL-006":
      return locale === "en-IN"
        ? generateClsCp003EnglishQuestion(qlId, seed, optionCount)
        : generateClsCp003LocalizedQuestionV5(qlId, locale, seed, optionCount);
    case "CLS-QL-007":
      return locale === "en-IN"
        ? generateClsCp004EnglishQuestion(qlId, seed, optionCount)
        : generateClsCp004LocalizedReviewQuestion(locale, seed, optionCount);
    case "CLS-QL-008":
    case "CLS-QL-009":
      return locale === "en-IN"
        ? generateClsCp005EnglishQuestion(qlId, seed, optionCount)
        : generateClsCp005LearnerReviewV2(qlId, locale, seed, optionCount);
    case "CLS-QL-010":
    case "CLS-QL-011":
      return locale === "en-IN"
        ? generateClsCp006EnglishQuestion(qlId, seed, optionCount)
        : generateClsCp006LearnerReviewV2(qlId, locale, seed, optionCount);
    case "CLS-QL-012": {
      const prototypeId = CLS_CP007_PROTOTYPES[seed % CLS_CP007_PROTOTYPES.length]!.prototypeId;
      return locale === "en-IN"
        ? generateClsCp007PermanentClusterQuestion(prototypeId, seed, optionCount)
        : generateClsCp007LocalizedClusterQuestionV3(locale, prototypeId, seed, optionCount);
    }
    case "CLS-QL-013":
      return locale === "en-IN"
        ? generateClsCp007PermanentClusterPairQuestion(seed, optionCount)
        : generateClsCp007LocalizedPairQuestionV3(locale, seed, optionCount);
  }
}

export function previewCls001QuestionStudioReview(input: PreviewCls001QuestionStudioInput) {
  if (!QL_SET.has(input.qlId)) {
    throw new Error("CLS-001 Question Studio does not own '" + input.qlId + "'.");
  }
  const locale = input.locale ?? "en-IN";
  if (!LOCALE_SET.has(locale)) {
    throw new Error("Unsupported CLS-001 Question Studio locale '" + String(locale) + "'.");
  }

  const qlId = input.qlId as Cls001QuestionStudioQlId;
  const seed = normalizeSeed(input.seed);
  const generated = generateApprovedQuestion(qlId, locale, seed);
  const source = generated as unknown as Readonly<Record<string, unknown>>;
  const metadata = asRecord(source.metadata);
  const lifecycle = asRecord(source.lifecycle);
  const sourceRuntimeQuestionStudioDiscoverable =
    metadata.questionStudioDiscoverable === true
    || lifecycle.questionStudioDiscoverable === true
    || source.questionStudioVisible === true;

  const question = Object.freeze({
    ...source,
    qlId,
    permanentQlId: qlId,
    locale,
    reviewOnly: true as const,
    questionStudioVisible: true as const,
    publiclyPublishable: false as const,
    metadata: Object.freeze({
      ...metadata,
      sourceRuntimeQuestionStudioDiscoverable,
      questionStudioDiscoverable: true as const,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
    lifecycle: Object.freeze({
      ...lifecycle,
      permanentQlId: qlId,
      reviewStatus: "QUESTION_STUDIO_REVIEW_ONLY" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      questionStudioDiscoverable: true as const,
    }),
  });

  return Object.freeze({
    packageId: CLS_001_QUESTION_STUDIO_PACKAGE_ID,
    integrationAuthority: CLS_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    lifecycleStatus: "REVIEW_ONLY" as const,
    reviewOnly: true as const,
    questionStudioVisible: true as const,
    question,
  });
}

export function assertCls001QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "CLS-001 is registered in Question Studio for review generation only; Question Bank, persistence, test, mock-test, student and public delivery remain locked.",
  );
}
