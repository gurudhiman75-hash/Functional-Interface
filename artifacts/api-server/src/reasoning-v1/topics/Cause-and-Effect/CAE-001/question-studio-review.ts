import { generateCaeQuestion } from "./chapter-generator.ts";
import { CAE_001_MANIFEST } from "./chapter-manifest.ts";
import { CAE_001_CAUSAL_WORLDS, CAE_001_PROJECTION_AUTHORITIES } from "./causal-world-authorities.ts";
import type { CaeLocale, CaeQlId, CaeQuestionProfile } from "./types.ts";

export const CAE_001_QUESTION_STUDIO_PACKAGE_ID = "CAE-001-V1-REVIEW" as const;
export const CAE_001_QUESTION_STUDIO_REVIEW_AUTHORITY = "CAE-001-CAUSAL-GRAPH-REVIEW-V1" as const;

export type PreviewCae001QuestionStudioInput = Readonly<{
  qlId: CaeQlId;
  locale: CaeLocale;
  seed: number;
  questionProfile?: CaeQuestionProfile;
}>;

export const CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: CAE_001_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: "CAE-001" as const,
  subjectCode: "REAS-CAE" as const,
  title: "Cause & Effect" as const,
  version: "V1" as const,
  integrationAuthority: CAE_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  reviewStatus: "REVIEW_ONLY_CAUSAL_WORLD_V2_PROOF_GREEN" as const,
  permanentQlCount: CAE_001_MANIFEST.qlIds.length,
  permanentQlIds: CAE_001_MANIFEST.qlIds,
  causalWorldCount: CAE_001_CAUSAL_WORLDS.length,
  projectionAuthorityCount: CAE_001_PROJECTION_AUTHORITIES.length,
  locales: CAE_001_MANIFEST.locales,
  enabled: true as const,
  questionStudioVisible: true as const,
  reviewOnly: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

export function previewCae001QuestionStudioReview(input: PreviewCae001QuestionStudioInput) {
  return Object.freeze({
    packageId: CAE_001_QUESTION_STUDIO_PACKAGE_ID,
    integrationAuthority: CAE_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    lifecycleStatus: "REVIEW_ONLY" as const,
    reviewOnly: true as const,
    question: generateCaeQuestion(input),
  });
}

export function assertCae001QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "CAE-001 is available for Question Studio review only; question-bank, test, mock, and public delivery remain locked until editorial release approval.",
  );
}
