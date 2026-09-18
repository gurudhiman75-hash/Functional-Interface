import type { ClsCp001QlId } from "./CLS-CP-001/cp001-permanent-contracts";
import { generateClsCp001Question } from "./CLS-CP-001/cp001-multilingual-runtime";
import { CLS_CP002_QL_ID } from "./CLS-CP-002/cp002-permanent-contract";
import { generateClsCp002Question } from "./CLS-CP-002/cp002-multilingual-runtime";
import type { ClsCp003EnglishQlId } from "./CLS-CP-003/cp003-english-contracts";
import { generateClsCp003EnglishQuestion } from "./CLS-CP-003/cp003-english-runtime";
import { generateClsCp003LocalizedQuestionV5 } from "./CLS-CP-003/cp003-localized-runtime-v5";
import { CLS_CP004_ENGLISH_QL_ID } from "./CLS-CP-004/cp004-english-contract";
import { generateClsCp004EnglishQuestion } from "./CLS-CP-004/cp004-english-runtime";
import { generateClsCp004LocalizedQuestion } from "./CLS-CP-004/cp004-localized-runtime";
import {
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  CLS_CP005_ODD_TUPLE_QL_ID,
  type ClsCp005EnglishQlId,
} from "./CLS-CP-005/cp005-english-contracts";
import { generateClsCp005Question } from "./CLS-CP-005/cp005-multilingual-runtime";
import { generateClsCp005LearnerReviewV2 } from "./CLS-CP-005/cp005-learner-review-v2";
import {
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
  CLS_CP006_ODD_LETTER_QL_ID,
  type ClsCp006EnglishQlId,
} from "./CLS-CP-006/cp006-english-contracts";
import { generateClsCp006Question } from "./CLS-CP-006/cp006-multilingual-runtime";
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
  "CLS-001-CHAPTER-CLOSURE-QUESTION-STUDIO-REVIEW-V1" as const;

export const CLS_001_QUESTION_STUDIO_QL_IDS = [
  "CLS-QL-001", "CLS-QL-002", "CLS-QL-003", "CLS-QL-004", "CLS-QL-005",
  "CLS-QL-006", "CLS-QL-007", "CLS-QL-008", "CLS-QL-009", "CLS-QL-010",
  "CLS-QL-011", "CLS-QL-012", "CLS-QL-013",
] as const;

export type Cls001QuestionStudioQlId = (typeof CLS_001_QUESTION_STUDIO_QL_IDS)[number];
export type Cls001QuestionStudioLocale = "en-IN" | "hi-IN" | "pa-IN";

const QL_SET = new Set<string>(CLS_001_QUESTION_STUDIO_QL_IDS);

export type PreviewCls001QuestionStudioInput = Readonly<{
  qlId: Cls001QuestionStudioQlId | string;
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
  reviewStatus: "MULTILINGUAL_REVIEW_FROZEN_CHAPTER_CLOSED" as const,
  checkpointCount: 8,
  permanentQlCount: CLS_001_QUESTION_STUDIO_QL_IDS.length,
  permanentQlIds: CLS_001_QUESTION_STUDIO_QL_IDS,
  supportedLocales: ["en-IN", "hi-IN", "pa-IN"] as const,
  enabled: true as const,
  questionStudioVisible: true as const,
  questionStudioDiscoverable: true as const,
  reviewOnly: true as const,
  persistenceAllowed: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  manualApprovalRequired: true as const,
});

function normalizeSeed(seed: number | undefined): number {
  if (seed === undefined) return 17;
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`CLS-001 Question Studio seed must be a non-negative safe integer; received '${String(seed)}'.`);
  }
  return seed;
}

function normalizeLocale(locale: Cls001QuestionStudioLocale | undefined): Cls001QuestionStudioLocale {
  return locale ?? "en-IN";
}

function rawQuestion(
  qlId: Cls001QuestionStudioQlId,
  locale: Cls001QuestionStudioLocale,
  seed: number,
): unknown {
  if (qlId === "CLS-QL-001" || qlId === "CLS-QL-002" || qlId === "CLS-QL-003") {
    return generateClsCp001Question(qlId as ClsCp001QlId, locale, seed);
  }
  if (qlId === "CLS-QL-004") {
    return generateClsCp002Question(CLS_CP002_QL_ID, locale, seed);
  }
  if (qlId === "CLS-QL-005" || qlId === "CLS-QL-006") {
    return locale === "en-IN"
      ? generateClsCp003EnglishQuestion(qlId as ClsCp003EnglishQlId, seed)
      : generateClsCp003LocalizedQuestionV5(qlId, locale, seed);
  }
  if (qlId === "CLS-QL-007") {
    return locale === "en-IN"
      ? generateClsCp004EnglishQuestion(CLS_CP004_ENGLISH_QL_ID, seed)
      : generateClsCp004LocalizedQuestion(locale, seed);
  }
  if (qlId === CLS_CP005_ODD_TUPLE_QL_ID || qlId === CLS_CP005_EQUIVALENT_TUPLE_QL_ID) {
    return locale === "en-IN"
      ? generateClsCp005Question(qlId as ClsCp005EnglishQlId, "en-IN", seed)
      : generateClsCp005LearnerReviewV2(qlId as ClsCp005EnglishQlId, locale, seed);
  }
  if (qlId === CLS_CP006_ODD_LETTER_QL_ID || qlId === CLS_CP006_ODD_LETTER_PAIR_QL_ID) {
    return locale === "en-IN"
      ? generateClsCp006Question(qlId as ClsCp006EnglishQlId, "en-IN", seed)
      : generateClsCp006LearnerReviewV2(qlId as ClsCp006EnglishQlId, locale, seed);
  }
  if (qlId === "CLS-QL-012") {
    const prototype = CLS_CP007_PROTOTYPES[seed % CLS_CP007_PROTOTYPES.length]!;
    return locale === "en-IN"
      ? generateClsCp007PermanentClusterQuestion(prototype.prototypeId, seed)
      : generateClsCp007LocalizedClusterQuestionV3(locale, prototype.prototypeId, seed);
  }
  if (qlId === "CLS-QL-013") {
    return locale === "en-IN"
      ? generateClsCp007PermanentClusterPairQuestion(seed)
      : generateClsCp007LocalizedPairQuestionV3(locale, seed);
  }
  throw new Error(`CLS-001 Question Studio does not own '${qlId}'.`);
}

function generateWithRetry(
  qlId: Cls001QuestionStudioQlId,
  locale: Cls001QuestionStudioLocale,
  seed: number,
) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 64; attempt += 1) {
    const resolvedSeed = seed + attempt;
    try {
      return { generated: rawQuestion(qlId, locale, resolvedSeed), resolvedSeed, attempt };
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(
    `CLS-001 Question Studio could not generate ${qlId}/${locale} from seed ${seed}: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
  );
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

export function previewCls001QuestionStudioReview(input: PreviewCls001QuestionStudioInput) {
  if (!QL_SET.has(input.qlId)) {
    throw new Error(`CLS-001 Question Studio does not own '${String(input.qlId)}'.`);
  }
  const qlId = input.qlId as Cls001QuestionStudioQlId;
  const locale = normalizeLocale(input.locale);
  const requestedSeed = normalizeSeed(input.seed);
  const { generated, resolvedSeed, attempt } = generateWithRetry(qlId, locale, requestedSeed);
  const source = asRecord(generated);
  const sourceMetadata = asRecord(source.metadata);
  const sourceLifecycle = asRecord(source.lifecycle);

  const question = Object.freeze({
    ...source,
    qlId: (source.qlId ?? source.permanentQlId ?? qlId) as string,
    permanentQlId: (source.permanentQlId ?? source.qlId ?? qlId) as string,
    locale,
    reviewOnly: true as const,
    questionStudioVisible: true as const,
    publiclyPublishable: false as const,
    metadata: Object.freeze({
      ...sourceMetadata,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      integrationAuthority: CLS_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
      questionBankWritable: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      requestedSeed,
      resolvedSeed,
      retryCount: attempt,
    }),
    lifecycle: Object.freeze({
      ...sourceLifecycle,
      reviewOnly: true as const,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      persistenceAllowed: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });

  return Object.freeze({
    packageId: CLS_001_QUESTION_STUDIO_PACKAGE_ID,
    integrationAuthority: CLS_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    lifecycleStatus: "REVIEW_ONLY" as const,
    reviewOnly: true as const,
    questionStudioVisible: true as const,
    questionStudioDiscoverable: true as const,
    persistenceAllowed: false as const,
    requestedSeed,
    resolvedSeed,
    question,
  });
}

export function assertCls001QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "CLS-001 is registered in Question Studio for review generation only; persistence, Question Bank, tests, mock tests and public/student delivery remain locked.",
  );
}
