import { CALENDAR_PERMANENT_QL_IDS, type CalendarPermanentQlId } from "./permanent-contracts.ts";
import {
  CAL_001_PACKAGE_ID,
  CAL_001_PRODUCTION_RELEASE,
  CAL_001_QUESTION_STUDIO_LANGUAGES,
  generateCal001QuestionStudioBatch,
  type Cal001QuestionStudioDifficulty,
  type Cal001QuestionStudioLanguage,
} from "./question-studio-runtime.ts";

export type Cal001QuestionStudioReviewRequest = Readonly<{
  language?: Cal001QuestionStudioLanguage;
  qlId?: CalendarPermanentQlId;
  difficulty?: Cal001QuestionStudioDifficulty;
  seed?: string;
  count?: number;
}>;

export const CAL_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  id: CAL_001_PACKAGE_ID,
  packageId: CAL_001_PACKAGE_ID,
  type: "reasoning-v1",
  section: "Reasoning",
  domain: "reasoning",
  topic: "Reasoning",
  subtopic: "Calendar",
  chapterId: "CAL-001",
  checkpointId: "CAL-001",
  name: "CAL-001 Calendar — Multilingual Production Review",
  label: "Calendar — 36 Frozen Question Languages",
  generationDomain: "reasoning-v1",
  qlIds: [...CALENDAR_PERMANENT_QL_IDS],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  supportedLanguages: [...CAL_001_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  reviewPreviewAvailable: true,
  runtimeMode: CAL_001_PRODUCTION_RELEASE.runtimeMode,
  reviewStatus: CAL_001_PRODUCTION_RELEASE.reviewStatus,
  questionBankStatus: CAL_001_PRODUCTION_RELEASE.questionBankStatus,
  testEligibility: CAL_001_PRODUCTION_RELEASE.testEligibility,
  publiclyPublishable: CAL_001_PRODUCTION_RELEASE.publiclyPublishable,
  mockTestEligible: CAL_001_PRODUCTION_RELEASE.mockTestEligible,
  persistenceAllowed: true,
  questionStudioVisible: true,
  questionBankEligible: true,
  manualApprovalRequired: true,
  automaticStudentPublication: false,
  releaseAuthority: CAL_001_PRODUCTION_RELEASE.authority,
  bulkSyncSupported: false,
  totalFrozenRecords: null,
} as const);

function localeForLanguage(language: Cal001QuestionStudioLanguage) {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
}

export async function previewCal001QuestionStudioReview(
  request: Cal001QuestionStudioReviewRequest = {},
) {
  const language = request.language ?? "en";
  const result = await generateCal001QuestionStudioBatch({
    packageId: CAL_001_PACKAGE_ID,
    canonicalProblemId: request.qlId,
    language,
    difficulty: request.difficulty,
    seed: request.seed,
    count: request.count,
  });

  const questions = result.questions.map((question, index) => {
    const pkg = result.questionPackages[index]!;
    const lines = [...pkg.explanation.lines];
    const conclusion = lines.at(-1) ?? String(question.answer);
    const steps = lines.length > 1 ? lines.slice(0, -1) : lines;
    const questionLanguageId = question.questionId;

    return {
      archetypeId: CAL_001_PACKAGE_ID,
      packageId: CAL_001_PACKAGE_ID,
      canonicalProblemId: question.canonicalProblemId,
      qlId: question.canonicalProblemId,
      questionId: question.questionId,
      canonicalItemId: question.questionId,
      questionLanguageId,
      explanationId: pkg.explanationId,
      language,
      locale: localeForLanguage(language),
      difficultyBand: pkg.difficultyBand,
      useMode: "GENERATED_SINGLE_QUESTION",
      sharedPrompt: "",
      stem: question.stem,
      options: [...question.options],
      optionDetails: question.options.map((option, optionIndex) => ({
        label: ["A", "B", "C", "D"][optionIndex]!,
        text: option,
        studentExplanation: "",
        isCorrect: optionIndex === question.correctIndex,
        semanticKey: `option-${optionIndex + 1}`,
      })),
      correctIndex: question.correctIndex,
      answer: question.answer,
      decodedStatements: [] as string[],
      explanation: {
        explanationId: pkg.explanationId,
        steps,
        conclusion,
        shortcut: "",
        commonTrap: "",
        optionAnalysis: [],
        familyTree: null,
        diagramProof: null,
      },
      reasoningGraph: question.reasoningGraph,
      renderer: {
        kind: "TEXT",
        familyTreeAvailable: false,
        diagramProofAvailable: false,
        textFallbackAvailable: true,
      },
      parameters: {
        chapterId: "CAL-001",
        checkpointId: pkg.parameters.checkpoint,
        qlId: question.canonicalProblemId,
        seed: question.seed,
        runtimeMode: question.runtimeMode,
        reviewStatus: question.reviewStatus,
        releaseAuthority: question.releaseAuthority,
        questionBankStatus: question.questionBankStatus,
        testEligibility: question.testEligibility,
        publiclyPublishable: question.publiclyPublishable,
        mockTestEligible: question.mockTestEligible,
        persistenceAllowed: true,
      },
      traceability: question.traceability,
      safety: {
        manualApprovalRequired: question.manualApprovalRequired,
        automaticStudentPublication: question.automaticStudentPublication,
      },
      validation: question.validation,
    } as const;
  });

  return {
    generationContext: result.generationContext,
    questions,
  } as const;
}
