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
import { CLS_CP007_PROTOTYPES } from "./CLS-CP-007/cluster-domain";
import {
  generateClsCp007PermanentClusterPairQuestion,
  generateClsCp007PermanentClusterQuestion,
} from "./CLS-CP-007/cp007-english-contracts";
import {
  generateClsCp007LocalizedClusterQuestionV3,
  generateClsCp007LocalizedPairQuestionV3,
} from "./CLS-CP-007/cp007-localized-runtime-v3";

export const CLS_001_QUESTION_STUDIO_PACKAGE_ID = "CLS-001" as const;
export const CLS_001_QUESTION_STUDIO_REVIEW_AUTHORITY =
  "CLS-001-QUESTION-STUDIO-REVIEW-V1" as const;
export const CLS_001_QUESTION_STUDIO_LOCALES =
  ["en-IN", "hi-IN", "pa-IN"] as const;
export type Cls001QuestionStudioLocale =
  typeof CLS_001_QUESTION_STUDIO_LOCALES[number];

export const CLS_001_QUESTION_STUDIO_QL_IDS = Array.from(
  { length: 13 },
  (_, index) => `CLS-QL-${String(index + 1).padStart(3, "0")}`,
) as readonly string[];

export const CLS_001_QUESTION_STUDIO_CHECKPOINTS = Array.from(
  { length: 8 },
  (_, index) => `CLS-CP-${String(index + 1).padStart(3, "0")}`,
) as readonly string[];

const CLS_001_QUESTION_STUDIO_QL_SET =
  new Set(CLS_001_QUESTION_STUDIO_QL_IDS);

export type PreviewCls001QuestionStudioInput = Readonly<{
  qlId: string;
  locale?: Cls001QuestionStudioLocale;
  seed?: number;
  optionCount?: 4 | 5;
}>;

export const CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: CLS_001_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: "CLS-001" as const,
  label: "Classification / Odd One Out" as const,
  subject: "Reasoning Ability" as const,
  topic: "Reasoning" as const,
  subtopic: "Classification / Odd One Out" as const,
  integrationAuthority: CLS_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  reviewStatus: "CONTENT_REVIEW_CLOSED__MULTILINGUAL_REVIEW_ONLY" as const,
  checkpointCount: CLS_001_QUESTION_STUDIO_CHECKPOINTS.length,
  checkpoints: CLS_001_QUESTION_STUDIO_CHECKPOINTS,
  permanentQlCount: CLS_001_QUESTION_STUDIO_QL_IDS.length,
  permanentQlIds: CLS_001_QUESTION_STUDIO_QL_IDS,
  supportedLocales: CLS_001_QUESTION_STUDIO_LOCALES,
  enabled: true as const,
  questionStudioVisible: true as const,
  reviewOnly: true as const,
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
  if (!Number.isFinite(seed)) {
    throw new Error(`Invalid CLS-001 Question Studio seed '${String(seed)}'.`);
  }
  return Math.trunc(seed);
}

function normalizeLocale(
  locale: Cls001QuestionStudioLocale | undefined,
): Cls001QuestionStudioLocale {
  const resolved = locale ?? "en-IN";
  if (!CLS_001_QUESTION_STUDIO_LOCALES.includes(resolved)) {
    throw new Error(
      `Unsupported CLS-001 Question Studio locale '${String(locale)}'.`,
    );
  }
  return resolved;
}

function normalizeOptionCount(
  optionCount: 4 | 5 | undefined,
  seed: number,
): 4 | 5 {
  if (optionCount === 4 || optionCount === 5) return optionCount;
  return Math.abs(seed) % 4 === 0 ? 5 : 4;
}

function generateApprovedQuestion(
  qlId: string,
  locale: Cls001QuestionStudioLocale,
  seed: number,
  optionCount: 4 | 5,
) {
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
        : generateClsCp003LocalizedQuestionV5(
            qlId,
            locale,
            seed,
            optionCount,
          );

    case "CLS-QL-007":
      return locale === "en-IN"
        ? generateClsCp004EnglishQuestion(qlId, seed, optionCount)
        : generateClsCp004LocalizedReviewQuestion(
            locale,
            seed,
            optionCount,
          );

    case "CLS-QL-008":
    case "CLS-QL-009":
      return locale === "en-IN"
        ? generateClsCp005EnglishQuestion(qlId, seed, optionCount)
        : generateClsCp005LearnerReviewV2(
            qlId,
            locale,
            seed,
            optionCount,
          );

    case "CLS-QL-010":
    case "CLS-QL-011":
      return locale === "en-IN"
        ? generateClsCp006EnglishQuestion(qlId, seed, optionCount)
        : generateClsCp006LearnerReviewV2(
            qlId,
            locale,
            seed,
            optionCount,
          );

    case "CLS-QL-012": {
      const prototype =
        CLS_CP007_PROTOTYPES[
          Math.abs(seed) % CLS_CP007_PROTOTYPES.length
        ]!;
      return locale === "en-IN"
        ? generateClsCp007PermanentClusterQuestion(
            prototype.prototypeId,
            seed,
            optionCount,
          )
        : generateClsCp007LocalizedClusterQuestionV3(
            locale,
            prototype.prototypeId,
            seed,
            optionCount,
          );
    }

    case "CLS-QL-013":
      return locale === "en-IN"
        ? generateClsCp007PermanentClusterPairQuestion(seed, optionCount)
        : generateClsCp007LocalizedPairQuestionV3(
            locale,
            seed,
            optionCount,
          );

    default:
      throw new Error(`CLS-001 Question Studio does not own '${qlId}'.`);
  }
}

function asMetadata(
  value: unknown,
): Readonly<Record<string, unknown>> {
  return value && typeof value === "object"
    ? value as Readonly<Record<string, unknown>>
    : {};
}

export function previewCls001QuestionStudioReview(
  input: PreviewCls001QuestionStudioInput,
) {
  if (!CLS_001_QUESTION_STUDIO_QL_SET.has(input.qlId)) {
    throw new Error(
      `CLS-001 Question Studio does not own '${input.qlId}'.`,
    );
  }

  const locale = normalizeLocale(input.locale);
  const seed = normalizeSeed(input.seed);
  const optionCount = normalizeOptionCount(input.optionCount, seed);
  const generated = generateApprovedQuestion(
    input.qlId,
    locale,
    seed,
    optionCount,
  );
  const generatedRecord =
    generated as unknown as Readonly<Record<string, unknown>>;
  const metadata = asMetadata(generatedRecord.metadata);

  const question = Object.freeze({
    ...generatedRecord,
    qlId: input.qlId,
    permanentQlId:
      generatedRecord.permanentQlId ?? input.qlId,
    questionStudioVisible: true as const,
    reviewOnly: true as const,
    metadata: Object.freeze({
      ...metadata,
      questionStudioDiscoverable: true as const,
      questionBankWritable: false as const,
      mockTestEligible: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      reviewOnly: true as const,
      integrationAuthority:
        CLS_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    }),
  });

  return Object.freeze({
    packageId: CLS_001_QUESTION_STUDIO_PACKAGE_ID,
    integrationAuthority:
      CLS_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    lifecycleStatus: "REVIEW_ONLY" as const,
    reviewOnly: true as const,
    questionStudioVisible: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    question,
  });
}

export function assertCls001QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "CLS-001 is available in Question Studio for review generation only; Question Bank, test, mock-test and public delivery remain locked.",
  );
}
