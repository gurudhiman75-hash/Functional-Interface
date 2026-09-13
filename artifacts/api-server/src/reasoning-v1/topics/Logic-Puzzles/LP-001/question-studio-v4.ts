import {
  generateLogicPuzzleQuestionStudioBatchV3,
  isLogicPuzzleQuestionStudioRequestV3,
  listLogicPuzzleQuestionStudioPackagesV3,
} from "./question-studio-v3.ts";
import type { LogicPuzzleQuestionStudioRequest } from "./question-studio-v2.ts";
import { LP_011_REVIEW_PACKAGE } from "./lp-011.ts";
import { LP_011_ENGLISH_FREEZE_V1 } from "./lp-011-permanent-freeze-v1.ts";
import {
  generateLp011LocalizedBatchV1,
  LP_011_HI_PA_LOCALIZATION_REVIEW_V1,
  type Lp011LocalizedLanguage,
} from "./lp-011-localization-v1.ts";

export const LP_QUESTION_STUDIO_V4 = Object.freeze({
  authorityId: "LP_QUESTION_STUDIO_V4" as const,
  parentAuthorityId: "QUESTION_STUDIO_V3" as const,
  lp011LocalizationAuthorityId: LP_011_HI_PA_LOCALIZATION_REVIEW_V1.authorityId,
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

function isLp011Request(request: LogicPuzzleQuestionStudioRequest): boolean {
  const pkg = normalize(request.packageId ?? request.archetypeId);
  const selected = selector(request);
  return pkg === "lp 011" || /^lp ql 04[1-4]$/u.test(selected) || selected === "lp cp 011";
}

function normalizeLanguage(value: unknown): "en" | Lp011LocalizedLanguage {
  const language = normalize(value || "en");
  if (language === "en" || language === "english") return "en";
  if (language === "hi" || language === "hindi") return "hi";
  if (language === "pa" || language === "punjabi" || language === "panjabi") return "pa";
  throw new Error(`Unsupported LP-011 review language: ${String(value)}`);
}

export function isLogicPuzzleQuestionStudioRequestV4(request: LogicPuzzleQuestionStudioRequest): boolean {
  return isLp011Request(request) || isLogicPuzzleQuestionStudioRequestV3(request);
}

export function listLogicPuzzleQuestionStudioPackagesV4() {
  return listLogicPuzzleQuestionStudioPackagesV3().map((pkg: any) => {
    if (pkg.id !== "LP-011") return pkg;
    return {
      ...pkg,
      supportedLanguages: ["en", "hi", "pa"],
      localizationFreezeStatus: "REVIEW_V1_NOT_FROZEN",
      questionStudioLanguageActivation: "ACTIVE_REVIEW_ONLY",
      localizationAuthorityId: LP_011_HI_PA_LOCALIZATION_REVIEW_V1.authorityId,
    };
  });
}

export async function generateLogicPuzzleQuestionStudioBatchV4(request: LogicPuzzleQuestionStudioRequest = {}) {
  if (!isLp011Request(request)) return generateLogicPuzzleQuestionStudioBatchV3(request);
  const language = normalizeLanguage(request.language);
  if (language === "en") return generateLogicPuzzleQuestionStudioBatchV3(request);

  const count = Math.min(12, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = String(request.seed || "question-studio:LP-011");
  const caselets = generateLp011LocalizedBatchV1(language, seed, count);
  const questions = caselets.flatMap((caselet, caseletIndex) => caselet.children.map((child, childIndex) => ({
    text: `${caselet.scenario}\n\n${language === "hi" ? "शर्तें" : "ਸ਼ਰਤਾਂ"}:\n${caselet.clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${child.stem}`,
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
    packageId: "LP-011",
    canonicalProblemId: child.qlId,
    questionLanguageId: `${child.qlId}-${language.toUpperCase()}`,
    questionId: child.questionId,
    language,
    seed,
    questionIndex: caseletIndex * 4 + childIndex,
    runtimeMode: "REVIEW_ONLY",
    reviewStatus: "REVIEW_ONLY",
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    traceability: {
      checkpointId: LP_011_REVIEW_PACKAGE.checkpointId,
      qlId: child.qlId,
      caseletId: caselet.caseletId,
      sourceStatus: LP_011_HI_PA_LOCALIZATION_REVIEW_V1.authorityId,
    },
    metadata: {
      packageId: "LP-011",
      checkpointId: LP_011_REVIEW_PACKAGE.checkpointId,
      qlId: child.qlId,
      caseletId: caselet.caseletId,
      language,
      englishAuthorityId: LP_011_ENGLISH_FREEZE_V1.authorityId,
      localizationAuthorityId: LP_011_HI_PA_LOCALIZATION_REVIEW_V1.authorityId,
    },
    logic: {
      boxes: caselet.boxes,
      positions: caselet.positions,
      attributes: caselet.attributes,
      attributeLabels: caselet.attributeLabels,
      clues: caselet.clues,
      assignment: caselet.assignment,
    },
  })));

  return {
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: "LP-011",
      chapterId: "REAS-PUZ",
      seed,
      runtimeMode: "REVIEW_ONLY",
      lifecycleStatus: "REVIEW_ONLY",
      permanentQlCount: 4,
      permanentQlIds: [...LP_011_ENGLISH_FREEZE_V1.permanentQlIds],
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
      checkpointId: LP_011_REVIEW_PACKAGE.checkpointId,
    },
    questionPackages: questions,
    questions,
  };
}
