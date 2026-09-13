import {
  generateLogicPuzzleQuestionStudioBatchV6,
  isLogicPuzzleQuestionStudioRequestV6,
  listLogicPuzzleQuestionStudioPackagesV6,
} from "./question-studio-v6.ts";
import type { LogicPuzzleQuestionStudioRequest } from "./question-studio-v2.ts";
import { generateLpCp04PermanentBatch, LP_CP04_ENGLISH_FREEZE_V1 } from "./lp-cp04-permanent-freeze-v1.ts";

export const LP_QUESTION_STUDIO_V7 = Object.freeze({
  authorityId: "LP_QUESTION_STUDIO_V7" as const,
  parentAuthorityId: "LP_QUESTION_STUDIO_V6" as const,
  cp04EnglishAuthorityId: LP_CP04_ENGLISH_FREEZE_V1.authorityId,
  permanentQlRange: "LP-QL-001..LP-QL-047" as const,
  cp04LocalizationStatus: "PENDING" as const,
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

function isCp04Request(request: LogicPuzzleQuestionStudioRequest): boolean {
  const selected = selector(request);
  return selected === "lp ql 047"
    || selected === "lp cp 012"
    || selected === "lp cp04 counterfactual"
    || selected === "lp cp04 counterfactual additional condition";
}

function normalizeEnglishOnly(value: unknown): "en" {
  const language = normalize(value || "en");
  if (language === "en" || language === "english") return "en";
  throw new Error(`LP-QL-047 localization is not frozen yet. Review generation currently supports English only; received ${String(value)}.`);
}

export function isLogicPuzzleQuestionStudioRequestV7(request: LogicPuzzleQuestionStudioRequest): boolean {
  return isCp04Request(request) || isLogicPuzzleQuestionStudioRequestV6(request);
}

export function listLogicPuzzleQuestionStudioPackagesV7() {
  const inherited = listLogicPuzzleQuestionStudioPackagesV6();
  if (inherited.some((pkg: any) => pkg.id === "LP-CP04-COUNTERFACTUAL")) return inherited;
  return [
    ...inherited,
    {
      id: "LP-CP04-COUNTERFACTUAL",
      label: "Logic Puzzles — Additional Condition / Counterfactual",
      checkpointId: "LP-CP-012",
      permanentQlIds: ["LP-QL-047"],
      supportedDifficulties: ["Easy", "Medium", "Hard"],
      supportedLanguages: ["en"],
      englishFreezeStatus: "FROZEN_V1",
      localizationFreezeStatus: "PENDING",
      questionStudioLanguageActivation: "ENGLISH_REVIEW_ONLY",
      englishAuthorityId: LP_CP04_ENGLISH_FREEZE_V1.authorityId,
      runtimeMode: "REVIEW_ONLY",
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  ];
}

export async function generateLogicPuzzleQuestionStudioBatchV7(request: LogicPuzzleQuestionStudioRequest = {}) {
  if (!isCp04Request(request)) return generateLogicPuzzleQuestionStudioBatchV6(request);
  const language = normalizeEnglishOnly(request.language);
  const count = Math.min(12, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = String(request.seed || "question-studio:LP-QL-047");
  const caselets = generateLpCp04PermanentBatch(seed, count);
  const questions = caselets.map((caselet: any, questionIndex) => {
    const child = caselet.counterfactualChild;
    const parentTopology = caselet.parentTopology ?? "LP-001_GROUPING";
    return {
      text: child.stem,
      options: child.options,
      correct: child.correctIndex,
      correctIndex: child.correctIndex,
      answer: child.answer,
      explanation: child.explanation.lines.join("\n\n"),
      packageExplanation: child.explanation,
      difficulty: child.difficultyBand,
      difficultyLabel: child.difficultyBand,
      patternId: "LP-QL-047",
      section: "Reasoning",
      topic: "Puzzles",
      subtopic: "Logic Puzzles",
      generationBackend: "reasoning-v1",
      packageId: "LP-CP04-COUNTERFACTUAL",
      parentTopology,
      canonicalProblemId: "LP-QL-047",
      questionLanguageId: "LP-QL-047-EN",
      questionId: child.questionId,
      language,
      seed,
      questionIndex,
      runtimeMode: "REVIEW_ONLY",
      reviewStatus: "REVIEW_ONLY",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      traceability: {
        checkpointId: "LP-CP-012",
        qlId: "LP-QL-047",
        caseletId: caselet.caseletId,
        parentTopology,
        englishFreezeAuthorityId: LP_CP04_ENGLISH_FREEZE_V1.authorityId,
      },
      metadata: {
        packageId: "LP-CP04-COUNTERFACTUAL",
        checkpointId: "LP-CP-012",
        qlId: "LP-QL-047",
        caseletId: caselet.caseletId,
        language,
        parentTopology,
        englishAuthorityId: LP_CP04_ENGLISH_FREEZE_V1.authorityId,
        localizationStatus: "PENDING",
      },
    };
  });

  return {
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: "LP-CP04-COUNTERFACTUAL",
      chapterId: "REAS-PUZ",
      seed,
      runtimeMode: "REVIEW_ONLY",
      lifecycleStatus: "REVIEW_ONLY",
      permanentQlCount: 1,
      permanentQlIds: ["LP-QL-047"],
      permanentQlAllocationStatus: "ALLOCATED",
      englishFreezeStatus: "FROZEN_V1",
      localizationFreezeStatus: "PENDING",
      questionStudioLanguageActivation: "ENGLISH_REVIEW_ONLY",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      language,
      checkpointId: "LP-CP-012",
      englishAuthorityId: LP_CP04_ENGLISH_FREEZE_V1.authorityId,
    },
    questionPackages: questions,
    questions,
  };
}
