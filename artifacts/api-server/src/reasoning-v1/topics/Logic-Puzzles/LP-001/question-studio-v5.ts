import {
  generateLogicPuzzleQuestionStudioBatchV4,
  isLogicPuzzleQuestionStudioRequestV4,
  listLogicPuzzleQuestionStudioPackagesV4,
} from "./question-studio-v4.ts";
import type { LogicPuzzleQuestionStudioRequest } from "./question-studio-v2.ts";
import { LP_006_PROJECTION_ENGLISH_FREEZE_V1 } from "./lp-006-projection-permanent-freeze-v1.ts";
import {
  generateLp006ProjectionLocalizedBatchV1,
  LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1,
  type Lp006ProjectionLocalizedLanguage,
} from "./lp-006-projection-localization-v1.ts";

export const LP_QUESTION_STUDIO_V5 = Object.freeze({
  authorityId: "LP_QUESTION_STUDIO_V5" as const,
  parentAuthorityId: "LP_QUESTION_STUDIO_V4" as const,
  lp006ProjectionLocalizationAuthorityId: LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1.authorityId,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function selector(request: LogicPuzzleQuestionStudioRequest): string {
  return normalize(request.cpId ?? request.canonicalProblemId ?? request.patternId);
}

function isLp006ProjectionRequest(request: LogicPuzzleQuestionStudioRequest): boolean {
  const selected = selector(request);
  return /^lp ql 04[5-6]$/u.test(selected) || selected === "lp cp 006 projection";
}

function normalizeLanguage(value: unknown): "en" | Lp006ProjectionLocalizedLanguage {
  const language = normalize(value || "en");
  if (language === "en" || language === "english") return "en";
  if (language === "hi" || language === "hindi") return "hi";
  if (language === "pa" || language === "punjabi" || language === "panjabi") return "pa";
  throw new Error(`Unsupported LP-006 projection review language: ${String(value)}`);
}

export function isLogicPuzzleQuestionStudioRequestV5(request: LogicPuzzleQuestionStudioRequest): boolean {
  return isLp006ProjectionRequest(request) || isLogicPuzzleQuestionStudioRequestV4(request);
}

export function listLogicPuzzleQuestionStudioPackagesV5() {
  return listLogicPuzzleQuestionStudioPackagesV4().map((pkg: any) => {
    if (pkg.id !== "LP-006-PROJECTION") return pkg;
    return {
      ...pkg,
      supportedLanguages: ["en", "hi", "pa"],
      localizationFreezeStatus: "REVIEW_V1_NOT_FROZEN",
      questionStudioLanguageActivation: "ACTIVE_REVIEW_ONLY",
      localizationAuthorityId: LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1.authorityId,
    };
  });
}

export async function generateLogicPuzzleQuestionStudioBatchV5(request: LogicPuzzleQuestionStudioRequest = {}) {
  if (!isLp006ProjectionRequest(request)) return generateLogicPuzzleQuestionStudioBatchV4(request);
  const language = normalizeLanguage(request.language);
  if (language === "en") return generateLogicPuzzleQuestionStudioBatchV4(request);

  const count = Math.min(12, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = String(request.seed || "question-studio:LP-006-PROJECTION");
  const caselets = generateLp006ProjectionLocalizedBatchV1(language, seed, count);
  const questions = caselets.flatMap((caselet, caseletIndex) => caselet.projectionChildren.map((child, childIndex) => ({
    text: child.stem,
    options: child.options,
    correct: child.correctIndex,
    correctIndex: child.correctIndex,
    answer: child.answer,
    explanation: child.explanation.lines.join("\n\n"),
    packageExplanation: child.explanation,
    difficulty: child.difficultyBand,
    difficultyLabel: child.difficultyBand,
    patternId: child.qlId,
    section: "Reasoning",
    topic: "Puzzles",
    subtopic: "Logic Puzzles",
    generationBackend: "reasoning-v1",
    packageId: "LP-006",
    extensionId: "LP-006-PROJECTION",
    canonicalProblemId: child.qlId,
    questionLanguageId: `${child.qlId}-${language.toUpperCase()}`,
    questionId: child.questionId,
    language,
    seed,
    questionIndex: caseletIndex * 2 + childIndex,
    runtimeMode: "REVIEW_ONLY",
    reviewStatus: "REVIEW_ONLY",
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    traceability: {
      checkpointId: "LP-CP-006-PROJECTION",
      qlId: child.qlId,
      caseletId: caselet.caseletId,
      sourceStatus: LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1.authorityId,
    },
    metadata: {
      packageId: "LP-006",
      extensionId: "LP-006-PROJECTION",
      checkpointId: "LP-CP-006-PROJECTION",
      qlId: child.qlId,
      caseletId: caselet.caseletId,
      language,
      englishAuthorityId: LP_006_PROJECTION_ENGLISH_FREEZE_V1.authorityId,
      localizationAuthorityId: LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1.authorityId,
    },
  })));

  return {
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: "LP-006",
      extensionId: "LP-006-PROJECTION",
      chapterId: "REAS-PUZ",
      seed,
      runtimeMode: "REVIEW_ONLY",
      lifecycleStatus: "REVIEW_ONLY",
      permanentQlCount: 2,
      permanentQlIds: [...LP_006_PROJECTION_ENGLISH_FREEZE_V1.permanentQlIds],
      permanentQlAllocationStatus: "ALLOCATED",
      localizationFreezeStatus: "REVIEW_V1_NOT_FROZEN",
      questionStudioLanguageActivation: "ACTIVE_REVIEW_ONLY",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      language,
      checkpointId: "LP-CP-006-PROJECTION",
    },
    questionPackages: questions,
    questions,
  };
}
