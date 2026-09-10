import {
  ARG_CP003_SEMANTIC_SURFACE_CAPACITY_PER_QL,
  ARG_CP003_TEMPLATE_COUNT_PER_QL,
  ARG_CP003_VARIANTS_PER_TEMPLATE,
} from "./cp003-generator.ts";
import { generateArgCp004Question } from "./cp004-generator.ts";
import { ARG_QL_IDS, type ArgLocale, type ArgQlId } from "./types.ts";

export const ARG_001_CP005_QUESTION_STUDIO_PACKAGE_ID = "ARG-001-CP005-TRILINGUAL-REVIEW" as const;
export const ARG_001_CP005_QUESTION_STUDIO_AUTHORITY = "ARG-001-QUESTION-STUDIO-CP005" as const;
export const ARG_001_CP005_QUESTION_STUDIO_STATUS = "ARG_CP005_TRILINGUAL_SATURATION_READY_REVIEW_ONLY" as const;

export type PreviewArg001Cp005QuestionStudioInput = Readonly<{
  qlId: ArgQlId;
  locale: ArgLocale;
  seed: number;
  presentationProfile?: "FOUR_WAY";
}>;

export const ARG_001_CP005_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: ARG_001_CP005_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: "ARG-001" as const,
  subjectCode: "REAS-ARG" as const,
  title: "Statement & Arguments — CP005 Trilingual Saturated Review",
  version: "CP005" as const,
  integrationAuthority: ARG_001_CP005_QUESTION_STUDIO_AUTHORITY,
  reviewStatus: ARG_001_CP005_QUESTION_STUDIO_STATUS,
  permanentQlCount: 6 as const,
  permanentQlIds: ARG_QL_IDS,
  templatesPerQl: ARG_CP003_TEMPLATE_COUNT_PER_QL,
  variantsPerTemplate: ARG_CP003_VARIANTS_PER_TEMPLATE,
  semanticSurfaceCapacityPerQl: ARG_CP003_SEMANTIC_SURFACE_CAPACITY_PER_QL,
  fullSemanticSurfaceCountPerLocale: 12288 as const,
  requiredDistinctSurfaceArchetypesPerQl: 8 as const,
  answerClassCountPerQlPerCycle: Object.freeze({
    ONLY_I: 512 as const,
    ONLY_II: 512 as const,
    BOTH: 512 as const,
    NEITHER: 512 as const,
  }),
  antiGamingScheduler: "ARG_CP003_BIJECTIVE_2048_SURFACE" as const,
  locales: Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const),
  localizationStatus: "TRILINGUAL_TEMPLATE_PARITY_CP004_CERTIFIED" as const,
  presentationProfiles: Object.freeze(["FOUR_WAY"] as const),
  currentGenerationReady: true as const,
  enabled: true as const,
  questionStudioVisible: true as const,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
  reviewOnly: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  manualReleaseApprovalRequired: true as const,
});

export function previewArg001Cp005QuestionStudioReview(input: PreviewArg001Cp005QuestionStudioInput) {
  if (input.presentationProfile && input.presentationProfile !== "FOUR_WAY") {
    throw new Error("ARG-001 CP005 exposes only the FOUR_WAY Statement & Arguments profile.");
  }

  const base = generateArgCp004Question({
    qlId: input.qlId,
    locale: input.locale,
    seed: input.seed,
  });

  const question = Object.freeze({
    ...base,
    checkpointId: "ARG-CP-005" as const,
    version: "CP005" as const,
    metadata: Object.freeze({
      ...base.metadata,
      questionStudioRegistered: true as const,
      reviewOnly: true as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockEligible: false as const,
      publicEligible: false as const,
      automaticStudentPublication: false as const,
    }),
  });

  return Object.freeze({
    packageId: ARG_001_CP005_QUESTION_STUDIO_PACKAGE_ID,
    integrationAuthority: ARG_001_CP005_QUESTION_STUDIO_AUTHORITY,
    reviewStatus: ARG_001_CP005_QUESTION_STUDIO_STATUS,
    lifecycleStatus: "REVIEW_ONLY" as const,
    reviewOnly: true as const,
    generationReady: true as const,
    localizationStatus: ARG_001_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.localizationStatus,
    presentationProfile: "FOUR_WAY" as const,
    question,
  });
}

export function assertArg001Cp005QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "ARG-001 CP005 is generation-ready inside Question Studio review, but Question Bank/test/mock/public/automatic learner delivery remains locked until separate explicit learner-release approval.",
  );
}
