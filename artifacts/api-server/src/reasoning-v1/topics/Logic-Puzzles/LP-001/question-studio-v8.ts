import {
  generateLogicPuzzleQuestionStudioBatchV7,
  isLogicPuzzleQuestionStudioRequestV7,
  listLogicPuzzleQuestionStudioPackagesV7,
} from "./question-studio-v7.ts";
import type { LogicPuzzleQuestionStudioRequest } from "./question-studio-v2.ts";
import { generateLpCp04LocalizedBatchV3 } from "./lp-cp04-localization-v3.ts";
import { LP_CP04_HI_PA_LOCALIZATION_FREEZE_V1 } from "./lp-cp04-localization-freeze-v1.ts";

export const LP_QUESTION_STUDIO_V8 = Object.freeze({
  authorityId: "LP_QUESTION_STUDIO_V8" as const,
  parentAuthorityId: "LP_QUESTION_STUDIO_V7" as const,
  cp04LocalizationAuthorityId: LP_CP04_HI_PA_LOCALIZATION_FREEZE_V1.authorityId,
  permanentQlRange: "LP-QL-001..LP-QL-047" as const,
  localizationFreezeStatus: "FROZEN_THROUGH_LP_QL_047" as const,
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
  const packageId = normalize(request.packageId ?? request.archetypeId);
  const selected = selector(request);
  return packageId === "lp cp04 counterfactual"
    || packageId === "lp cp 04 counterfactual"
    || selected === "lp ql 047"
    || selected === "lp cp 012"
    || selected === "lp cp04 counterfactual"
    || selected === "lp cp04 counterfactual additional condition";
}

function normalizeLanguage(value: unknown): "en" | "hi" | "pa" {
  const language = normalize(value || "en");
  if (language === "en" || language === "english") return "en";
  if (language === "hi" || language === "hindi") return "hi";
  if (language === "pa" || language === "punjabi" || language === "panjabi") return "pa";
  throw new Error(`Unsupported LP-QL-047 review language: ${String(value)}`);
}

export function isLogicPuzzleQuestionStudioRequestV8(request: LogicPuzzleQuestionStudioRequest): boolean {
  return isCp04Request(request) || isLogicPuzzleQuestionStudioRequestV7(request);
}

export function listLogicPuzzleQuestionStudioPackagesV8() {
  return listLogicPuzzleQuestionStudioPackagesV7().map((pkg: any) => {
    if (pkg.id === "LP-006-PROJECTION") {
      return {
        ...pkg,
        packageId: "LP-006-PROJECTION",
        basePackageId: "LP-006",
        extensionId: "LP-006-PROJECTION",
      };
    }
    if (pkg.id !== "LP-CP04-COUNTERFACTUAL") return pkg;
    return {
      ...pkg,
      packageId: "LP-CP04-COUNTERFACTUAL",
      supportedLanguages: ["en", "hi", "pa"],
      localizationFreezeStatus: "FROZEN_V1",
      localizationAuthorityId: LP_CP04_HI_PA_LOCALIZATION_FREEZE_V1.authorityId,
      questionStudioLanguageActivation: "ACTIVE_REVIEW_ONLY",
    };
  });
}

async function generateLogicPuzzleQuestionStudioBatchV8Core(request: LogicPuzzleQuestionStudioRequest = {}) {
  if (!isCp04Request(request)) return generateLogicPuzzleQuestionStudioBatchV7(request);
  const language = normalizeLanguage(request.language);
  if (language === "en") {
    return generateLogicPuzzleQuestionStudioBatchV7({
      ...request,
      language: "en",
      canonicalProblemId: request.canonicalProblemId ?? "LP-QL-047",
    });
  }

  const count = Math.min(12, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = String(request.seed || "question-studio:LP-QL-047");
  const caselets = generateLpCp04LocalizedBatchV3(language, seed, count);
  const questions = caselets.map((caselet, questionIndex) => {
    const child = caselet.counterfactualChild;
    const clueHeading = language === "hi" ? "शर्तें:" : "ਸ਼ਰਤਾਂ:";
    const text = `${caselet.scenario}\n\n${clueHeading}\n${caselet.learnerFacingClues.map((clue) => `- ${clue}`).join("\n")}\n\n${child.stem}`;
    return {
      text,
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
      parentTopology: caselet.parentTopology,
      canonicalProblemId: "LP-QL-047",
      questionLanguageId: `LP-QL-047-${language.toUpperCase()}`,
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
        parentTopology: caselet.parentTopology,
        localizationFreezeAuthorityId: LP_CP04_HI_PA_LOCALIZATION_FREEZE_V1.authorityId,
      },
      metadata: {
        packageId: "LP-CP04-COUNTERFACTUAL",
        checkpointId: "LP-CP-012",
        qlId: "LP-QL-047",
        caseletId: caselet.caseletId,
        language,
        parentTopology: caselet.parentTopology,
        localizationAuthorityId: LP_CP04_HI_PA_LOCALIZATION_FREEZE_V1.authorityId,
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
      localizationFreezeStatus: "FROZEN_V1",
      localizationAuthorityId: LP_CP04_HI_PA_LOCALIZATION_FREEZE_V1.authorityId,
      questionStudioLanguageActivation: "ACTIVE_REVIEW_ONLY",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      language,
      checkpointId: "LP-CP-012",
    },
    questionPackages: questions,
    questions,
  };
}


type LpPublicDifficulty = "Easy" | "Medium" | "Hard";

function normalizeRequestedDifficulty(value: unknown): LpPublicDifficulty | null {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized || normalized === "mixed" || normalized === "all") return null;
  if (normalized === "easy") return "Easy";
  if (normalized === "medium") return "Medium";
  if (normalized === "hard") return "Hard";
  throw new Error(`Unsupported Logic Puzzle difficulty: ${String(value)}`);
}

function caseletKey(question: any): string {
  return String(
    question?.traceability?.caseletId
    ?? question?.metadata?.caseletId
    ?? question?.questionId
    ?? question?.questionIndex
    ?? "",
  );
}

function groupByCaselet(questions: readonly any[]): any[][] {
  const order: string[] = [];
  const groups = new Map<string, any[]>();
  for (const question of questions) {
    const key = caseletKey(question);
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push(question);
  }
  return order.map((key) => groups.get(key)!);
}

export async function generateLogicPuzzleQuestionStudioBatchV8(request: LogicPuzzleQuestionStudioRequest = {}) {
  const requestedDifficulty = normalizeRequestedDifficulty(request.difficulty);
  if (!requestedDifficulty) return generateLogicPuzzleQuestionStudioBatchV8Core(request);

  const requestedCaselets = Math.min(12, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const baseSeed = String(request.seed || "question-studio:logic-puzzles");
  const selectedGroups: any[][] = [];
  let generationContext: any = null;

  for (let attempt = 0; attempt < 36 && selectedGroups.length < requestedCaselets; attempt += 1) {
    const batch: any = await generateLogicPuzzleQuestionStudioBatchV8Core({
      ...request,
      difficulty: undefined,
      seed: `${baseSeed}:difficulty:${requestedDifficulty}:${attempt}`,
      count: requestedCaselets,
    });
    generationContext ??= batch.generationContext;
    for (const group of groupByCaselet(batch.questions ?? [])) {
      if (selectedGroups.length >= requestedCaselets) break;
      if (!group.length) continue;
      if (group.every((question) => question.difficulty === requestedDifficulty)) {
        selectedGroups.push(group);
      }
    }
  }

  if (selectedGroups.length !== requestedCaselets) {
    throw new Error(
      `Unable to generate ${requestedCaselets} Logic Puzzle caselet(s) at difficulty ${requestedDifficulty} within deterministic candidate budget.`,
    );
  }

  const questions = selectedGroups.flat().map((question, questionIndex) => ({
    ...question,
    questionIndex,
    requestedDifficulty,
  }));

  return {
    generationContext: {
      ...generationContext,
      seed: baseSeed,
      requestedDifficulty,
      difficultyFilterAuthority: "LP_V8_STRUCTURAL_DIFFICULTY_FILTER_V1",
      selectedCaseletCount: selectedGroups.length,
    },
    questionPackages: questions,
    questions,
  };
}
