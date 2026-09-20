import { SIF_CP_IDS, type SifCpId, type SifLocale, type SifQuestionFormat } from "./types.ts";
import { generateSifQuestion } from "./generator.ts";

export const SIF_001_QUESTION_STUDIO_PACKAGE_ID = "reasoning-v1:sif-001:review-v1" as const;
export const SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE = {
  packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: "SIF-001",
  title: "Statement and Inference",
  runtimeMode: "STRUCTURED_LOGIC_FIRST_V1",
  cpCount: 17,
  cpIds: SIF_CP_IDS,
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  questionStudioVisible: true,
  enabled: true,
  lifecycleStatus: "REVIEW_ONLY",
  multilingualStatus: "REVIEW_CANDIDATE",
  reviewOnly: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  manualEditorialApprovalRequired: true,
} as const;

export interface PreviewSif001QuestionStudioInput {
  readonly cpId: SifCpId;
  readonly locale: SifLocale;
  readonly seed: number;
  readonly format?: SifQuestionFormat;
}

export function previewSif001QuestionStudioReview(input: PreviewSif001QuestionStudioInput) {
  const question = generateSifQuestion(input);
  return {
    packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID,
    chapterId: "SIF-001" as const,
    lifecycleStatus: "REVIEW_ONLY" as const,
    questionStudioVisible: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    manualEditorialApprovalRequired: true as const,
    question,
    payload: {
      text: `${question.instruction}\n\n${question.statement}`,
      instruction: question.instruction,
      statement: question.statement,
      inferences: question.inferences,
      options: question.options,
      correct: question.correctIndex,
      correctIndex: question.correctIndex,
      answerClass: question.answerClass,
      explanation: question.explanation,
      difficulty: question.difficulty,
      format: question.format,
      chapterId: question.chapterId,
      checkpointId: question.cpId,
      canonicalProblemId: question.cpId,
      questionId: `${question.scenarioId}:${question.locale}:${question.seed}`,
      topic: "Reasoning",
      subtopic: "Statement & Inference",
      locale: question.locale,
      seed: question.seed,
      mechanisms: question.mechanisms,
      distractorTypes: question.distractorTypes,
      sourceValidation: question.validation,
      generationContext: {
        generationDomain: "reasoning-v1" as const,
        packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID,
        chapterId: question.chapterId,
        cpId: question.cpId,
        solver: question.metadata.solver,
        generationOrder: question.metadata.generationOrder,
        lifecycleStatus: "REVIEW_ONLY" as const,
        questionBankWritable: false as const,
        testEligible: false as const,
        mockTestEligible: false as const,
        publiclyPublishable: false as const,
        persistenceAllowed: false as const,
        automaticStudentPublication: false as const,
      },
    },
  };
}

export function assertSif001QuestionStudioPersistenceAllowed(): never {
  throw new Error("SIF-001 is review only; Question Bank, test, mock and public delivery remain locked until human editorial approval and chapter freeze.");
}
