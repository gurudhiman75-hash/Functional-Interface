import { generateCod001Question, type Cod001Locale } from "./multilingual-runtime";

export const COD_001_QUESTION_STUDIO_PACKAGE_ID = "COD-001" as const;
export const COD_001_QUESTION_STUDIO_REVIEW_AUTHORITY = "COD-001-QUESTION-STUDIO-REVIEW-V1" as const;
export const COD_001_QUESTION_STUDIO_LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly Cod001Locale[];
export const COD_001_QUESTION_STUDIO_CHECKPOINTS = Array.from(
  { length: 10 },
  (_, index) => `COD-CP-${String(index + 1).padStart(3, "0")}`,
) as readonly string[];
export const COD_001_QUESTION_STUDIO_QL_IDS = Array.from(
  { length: 203 },
  (_, index) => `COD-QL-${String(index + 1).padStart(3, "0")}`,
) as readonly string[];

const COD_001_QUESTION_STUDIO_QL_SET = new Set(COD_001_QUESTION_STUDIO_QL_IDS);

export type PreviewCod001QuestionStudioInput = Readonly<{
  qlId: string;
  locale?: Cod001Locale;
  seed?: number;
}>;

export const COD_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: COD_001_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: "COD-001" as const,
  label: "Coding–Decoding" as const,
  subject: "Reasoning Ability" as const,
  topic: "Reasoning" as const,
  subtopic: "Coding–Decoding" as const,
  integrationAuthority: COD_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  reviewStatus: "MULTILINGUAL_EDITORIAL_APPROVED_REVIEW_ONLY" as const,
  checkpointCount: COD_001_QUESTION_STUDIO_CHECKPOINTS.length,
  checkpoints: COD_001_QUESTION_STUDIO_CHECKPOINTS,
  permanentQlCount: COD_001_QUESTION_STUDIO_QL_IDS.length,
  permanentQlIds: COD_001_QUESTION_STUDIO_QL_IDS,
  supportedLocales: COD_001_QUESTION_STUDIO_LOCALES,
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
  if (!Number.isFinite(seed)) throw new Error(`Invalid COD-001 Question Studio seed '${String(seed)}'.`);
  return Math.trunc(seed);
}

export function previewCod001QuestionStudioReview(input: PreviewCod001QuestionStudioInput) {
  if (!COD_001_QUESTION_STUDIO_QL_SET.has(input.qlId)) {
    throw new Error(`COD-001 Question Studio does not own '${input.qlId}'.`);
  }
  const locale = input.locale ?? "en-IN";
  if (!COD_001_QUESTION_STUDIO_LOCALES.includes(locale)) {
    throw new Error(`Unsupported COD-001 Question Studio locale '${locale}'.`);
  }
  const seed = normalizeSeed(input.seed);
  const generated = generateCod001Question(input.qlId, locale, seed);
  const metadata = generated.metadata && typeof generated.metadata === "object"
    ? generated.metadata as Readonly<Record<string, unknown>>
    : {};

  const question = Object.freeze({
    ...generated,
    questionStudioVisible: true as const,
    metadata: Object.freeze({
      ...metadata,
      questionStudioDiscoverable: true as const,
      questionBankWritable: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
    }),
  });

  return Object.freeze({
    packageId: COD_001_QUESTION_STUDIO_PACKAGE_ID,
    integrationAuthority: COD_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    lifecycleStatus: "REVIEW_ONLY" as const,
    reviewOnly: true as const,
    questionStudioVisible: true as const,
    question,
  });
}

export function assertCod001QuestionStudioPersistenceAllowed(): never {
  throw new Error("COD-001 is available in Question Studio for review generation only; Question Bank, test, mock-test and public delivery remain locked.");
}
