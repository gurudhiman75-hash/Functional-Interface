import { WFM_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";
import { WFM_001_CHECKPOINT_IDS, WFM_001_QL_IDS } from "./runtime";
import type {
  WfmDifficulty,
  WfmExamProfile,
  WfmGeneratedQuestion,
  WfmLanguage,
  WfmQlId,
} from "./types";

export const WFM_001_QUESTION_STUDIO_PACKAGE_ID = "WFM-001" as const;
export const WFM_001_QUESTION_STUDIO_REVIEW_AUTHORITY = "WFM-001-QUESTION-STUDIO-REVIEW-V1" as const;

export const WFM_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: WFM_001_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: "WFM-001" as const,
  productCode: "REAS-WFM" as const,
  label: "Word Formation" as const,
  subject: "Reasoning Ability" as const,
  topic: "Reasoning" as const,
  subtopic: "Word Formation" as const,
  family: "SYMBOLIC_SEQUENCE" as const,
  checkpointIds: WFM_001_CHECKPOINT_IDS,
  qlIds: WFM_001_QL_IDS,
  checkpointCount: WFM_001_CHECKPOINT_IDS.length,
  qlCount: WFM_001_QL_IDS.length,
  supportedLanguages: ["en-IN", "hi-IN", "pa-IN"] as const,
  supportedDifficulties: ["EASY", "MEDIUM", "HARD"] as const,
  supportedExamProfiles: ["SSC_CGL_4", "PUNJAB_4"] as const,
  runtimeVersion: "WFM-001-RUNTIME-V2-REVIEW" as const,
  integrationAuthority: WFM_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  taxonomyAuthority: "REASONING-V1-TAXONOMY-AMENDMENT-WFM-001" as const,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
  questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
  questionStudioVisible: true as const,
  reviewOnly: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  manualApprovalRequired: true as const,
  genericPersistenceAllowed: false as const,
});

export interface PreviewWfm001QuestionStudioInput {
  readonly qlId?: WfmQlId;
  readonly difficulty?: WfmDifficulty;
  readonly language?: WfmLanguage;
  readonly examProfile?: WfmExamProfile;
  readonly seed?: number;
  readonly count?: number;
}

export interface Wfm001QuestionStudioReviewQuestion {
  readonly packageId: typeof WFM_001_QUESTION_STUDIO_PACKAGE_ID;
  readonly chapterId: "WFM-001";
  readonly productCode: "REAS-WFM";
  readonly checkpointId: WfmGeneratedQuestion["checkpointId"];
  readonly qlId: WfmQlId;
  readonly task: WfmGeneratedQuestion["task"];
  readonly renderer: WfmGeneratedQuestion["renderer"];
  readonly language: WfmLanguage;
  readonly examProfile: WfmExamProfile;
  readonly difficulty: WfmDifficulty;
  readonly seed: number;
  readonly stem: string;
  readonly sourceWord?: string;
  readonly structuredPrompt: WfmGeneratedQuestion["structuredPrompt"];
  readonly options: readonly WfmGeneratedQuestion["options"][number][];
  readonly correctOptionId: WfmGeneratedQuestion["correctOptionId"];
  readonly explanation: string;
  readonly questionStudioVisible: true;
  readonly lifecycleStatus: "REVIEW_ONLY";
  readonly integrationAuthority: typeof WFM_001_QUESTION_STUDIO_REVIEW_AUTHORITY;
  readonly sourceRuntimeLifecycle: {
    readonly questionStudioVisible: false;
    readonly questionBankStored: false;
    readonly testEligible: false;
    readonly mockTestEligible: false;
    readonly publiclyPublishable: false;
  };
}

function normalizedCount(value: number | undefined): number {
  if (value === undefined) return 5;
  if (!Number.isFinite(value)) throw new Error("WFM-001 Question Studio count must be finite.");
  return Math.min(50, Math.max(1, Math.floor(value)));
}

function stableSeed(seed: number | undefined, index: number): number {
  const base = Number.isFinite(seed) ? Math.trunc(seed as number) : 17001;
  return base + index * 104729;
}

function reviewQuestion(question: WfmGeneratedQuestion): Wfm001QuestionStudioReviewQuestion {
  return {
    packageId: WFM_001_QUESTION_STUDIO_PACKAGE_ID,
    chapterId: "WFM-001",
    productCode: "REAS-WFM",
    checkpointId: question.checkpointId,
    qlId: question.qlId,
    task: question.task,
    renderer: question.renderer,
    language: question.language,
    examProfile: question.examProfile,
    difficulty: question.difficulty,
    seed: question.seed,
    stem: question.stem,
    sourceWord: question.sourceWord,
    structuredPrompt: question.structuredPrompt,
    options: question.options,
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
    questionStudioVisible: true,
    lifecycleStatus: "REVIEW_ONLY",
    integrationAuthority: WFM_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    sourceRuntimeLifecycle: {
      questionStudioVisible: question.metadata.questionStudioVisible,
      questionBankStored: question.metadata.questionBankStored,
      testEligible: question.metadata.testEligible,
      mockTestEligible: question.metadata.mockTestEligible,
      publiclyPublishable: question.metadata.publiclyPublishable,
    },
  };
}

export function previewWfm001QuestionStudioReview(
  input: PreviewWfm001QuestionStudioInput = {},
): {
  readonly questions: readonly Wfm001QuestionStudioReviewQuestion[];
  readonly integrationAuthority: typeof WFM_001_QUESTION_STUDIO_REVIEW_AUTHORITY;
  readonly reviewOnly: true;
  readonly questionStudioVisible: true;
} {
  if (input.qlId && !WFM_001_QL_IDS.includes(input.qlId)) {
    throw new Error(`Unsupported WFM-001 QL '${String(input.qlId)}'.`);
  }
  const count = normalizedCount(input.count);
  const questions = Array.from({ length: count }, (_, index) => reviewQuestion(
    WFM_001_QUESTION_STUDIO_ADAPTER.generate({
      seed: stableSeed(input.seed, index),
      qlId: input.qlId,
      difficulty: input.difficulty,
      language: input.language,
      examProfile: input.examProfile,
    }),
  ));

  return {
    questions,
    integrationAuthority: WFM_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewOnly: true,
    questionStudioVisible: true,
  };
}

export function assertWfm001QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "WFM-001 generic Question Studio persistence is disabled. Review preview is enabled, but Question Bank, test/mock and public release remain locked pending a separate explicit persistence authorization.",
  );
}
