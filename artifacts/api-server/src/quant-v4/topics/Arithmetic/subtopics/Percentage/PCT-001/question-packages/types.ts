export const PCT_001_QUESTION_PACKAGE_SCHEMA_VERSION = "1.0.0" as const;
export const PCT_001_QUESTION_PACKAGE_IDS = [
  "Q021", "Q022", "Q023", "Q024", "Q025",
  "Q026", "Q027", "Q028", "Q029", "Q030",
  "Q031", "Q032", "Q033", "Q034", "Q035",
  "Q036", "Q037", "Q038", "Q039", "Q040",
  "Q041", "Q042", "Q043", "Q044", "Q045",
  "Q046", "Q047", "Q048", "Q049", "Q050",
  "Q051", "Q052", "Q053", "Q054", "Q055",
  "Q056", "Q057", "Q058", "Q059", "Q060",
] as const;

export type QuestionPackageId =
  (typeof PCT_001_QUESTION_PACKAGE_IDS)[number];
export type QuestionPackageStatus =
  | "PLACEHOLDER"
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "ACTIVE";
export type QuestionPackageVersion = `${number}.${number}.${number}`;
export type QuestionPackageQlId =
  | "PCT-QL-017"
  | "PCT-QL-117"
  | "PCT-QL-217"
  | "PCT-QL-317"
  | "PCT-QL-417";
export type QuestionPackageAssetKind =
  | "stem"
  | "variables"
  | "explanationPolicies"
  | "hints"
  | "misconceptions"
  | "realism"
  | "validation";

export interface QuestionPackageOwnership {
  stem: "HUMAN";
  variables: "HUMAN";
  explanationPolicies: "HUMAN";
  hints: "HUMAN";
  misconceptions: "HUMAN";
  realism: "HUMAN";
  validation: "HUMAN_WITH_SYSTEM_CONTRACT";
}

export interface QuestionPackageMetadata {
  questionId: QuestionPackageId;
  canonicalProblemId: "PCT-CP-002";
  taskKind: "percentOfKnownNumber";
  qlId: QuestionPackageQlId;
  status: QuestionPackageStatus;
  version: QuestionPackageVersion;
  schemaVersion: typeof PCT_001_QUESTION_PACKAGE_SCHEMA_VERSION;
  ownership: QuestionPackageOwnership;
}

export interface QuestionPackageAssets {
  stem: string | null;
  variables: string | null;
  explanationPolicies: string | null;
  hints: string | null;
  misconceptions: string | null;
  realism: string | null;
  validation: string | null;
}

export interface QuestionPackage {
  metadata: QuestionPackageMetadata;
  assets: QuestionPackageAssets;
  assetPaths: Record<QuestionPackageAssetKind, string>;
  assetPresence: Record<QuestionPackageAssetKind, boolean>;
}

export interface QuestionPackageValidationFailure {
  code:
    | "UNREGISTERED_PACKAGE"
    | "INVALID_METADATA"
    | "MISSING_ASSET"
    | "EMPTY_ASSET"
    | "UNAPPROVED_STATUS";
  asset?: QuestionPackageAssetKind;
  message: string;
}

export interface QuestionPackageValidationResult {
  valid: boolean;
  generationReady: boolean;
  failures: readonly QuestionPackageValidationFailure[];
}

export const HUMAN_QUESTION_PACKAGE_OWNERSHIP = {
  stem: "HUMAN",
  variables: "HUMAN",
  explanationPolicies: "HUMAN",
  hints: "HUMAN",
  misconceptions: "HUMAN",
  realism: "HUMAN",
  validation: "HUMAN_WITH_SYSTEM_CONTRACT",
} as const satisfies QuestionPackageOwnership;

export function defineQuestionPackageMetadata(
  questionId: QuestionPackageId,
  qlId: QuestionPackageQlId,
): QuestionPackageMetadata {
  return {
    questionId,
    canonicalProblemId: "PCT-CP-002",
    taskKind: "percentOfKnownNumber",
    qlId,
    status: "PLACEHOLDER",
    version: "0.0.0",
    schemaVersion: PCT_001_QUESTION_PACKAGE_SCHEMA_VERSION,
    ownership: HUMAN_QUESTION_PACKAGE_OWNERSHIP,
  };
}
