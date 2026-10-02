import {
  ALP_001_CHECKPOINTS,
  ALP_001_QLS,
} from "./ql-registry";
import {
  ALP_001_QUESTION_STUDIO_REGISTRY,
  type AlpExamProfile,
} from "./question-studio-registry";
import type {
  AlpCheckpointId,
  AlpDifficulty,
  AlpLocale,
} from "./types";

export const ALP_001_QUESTION_STUDIO_PACKAGE_ID = "ALP-001" as const;

export const ALP_001_STANDARD_QUESTION_STUDIO_PACKAGE = Object.freeze({
  engineId: "reasoning-v1",
  packageId: ALP_001_QUESTION_STUDIO_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Alphabet Test",
  subtopic: "Alphabet Test",
  label: "Reasoning · Alphabet Test · ALP-001",
  enabled: true,
  cpIds: ALP_001_CHECKPOINTS.map((entry) => entry.checkpointId),
  qlIds: ALP_001_QLS.map((entry) => entry.qlId),
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
  reviewOnly: true,
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  productionReleaseAuthorized: false,
  metadata: {
    runtimeVersion: ALP_001_QUESTION_STUDIO_REGISTRY.runtimeVersion,
    qlCount: ALP_001_QLS.length,
    checkpointCount: ALP_001_CHECKPOINTS.length,
    deterministicGeneration: true,
    multilingualFreeze: true,
  },
} as const);

export type Alp001QuestionStudioRequest = Readonly<{
  packageId?: string;
  patternId?: string;
  canonicalProblemId?: string;
  questionLanguageId?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: string | number;
  language?: "en" | "hi" | "pa";
  exam?: string;
  seed?: string;
  count?: number;
}>;

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function localeFor(language: "en" | "hi" | "pa"): AlpLocale {
  return language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
}

function difficultyFor(value: unknown): AlpDifficulty | undefined {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "EASY";
  if (normalized === "medium" || normalized === "moderate") return "MEDIUM";
  if (normalized === "hard") return "HARD";
  throw new Error("ALP-001 difficulty must be Easy, Medium, Hard or Mixed.");
}

function difficultyLabel(value: AlpDifficulty): "Easy" | "Medium" | "Hard" {
  return value === "EASY" ? "Easy" : value === "HARD" ? "Hard" : "Medium";
}

function examProfileFor(value: unknown): AlpExamProfile {
  const normalized = String(value ?? "").toLowerCase();
  if (/punjab|psssb|ppsc|patwari|pspcl/u.test(normalized)) {
    return "PUNJAB_STATE_4_OPTION";
  }
  return "SSC_CGL_TIER_I";
}

function explicitSelector(request: Alp001QuestionStudioRequest): string {
  return String(
    request.canonicalProblemId
    ?? request.questionLanguageId
    ?? request.patternId
    ?? "",
  ).trim().toUpperCase();
}

function resolveScope(request: Alp001QuestionStudioRequest): {
  checkpointId?: AlpCheckpointId;
  qlId?: string;
} {
  const selector = explicitSelector(request);
  if (!selector || selector === ALP_001_QUESTION_STUDIO_PACKAGE_ID) return {};
  if (selector.startsWith("ALP-QL-")) return { qlId: selector };
  if (selector.startsWith("ALP-CP-")) return { checkpointId: selector as AlpCheckpointId };
  throw new Error("Unknown ALP-001 selector " + selector);
}

export function isAlp001QuestionStudioRequest(
  request: Alp001QuestionStudioRequest,
): boolean {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === ALP_001_QUESTION_STUDIO_PACKAGE_ID;
  const selector = explicitSelector(request);
  if (selector.startsWith("ALP-QL-") || selector.startsWith("ALP-CP-")) return true;
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  return topic === "alphabet test" || subtopic === "alphabet test";
}

function explanationText(question: ReturnType<typeof ALP_001_QUESTION_STUDIO_REGISTRY.generateControlled>): string {
  return [
    question.explanation.coreConcept,
    ...question.explanation.steps,
    ...question.explanation.visualWorking,
    question.explanation.conclusion,
  ].filter(Boolean).join("\n\n");
}

export async function generateAlp001QuestionStudioBatch(
  request: Alp001QuestionStudioRequest = {},
) {
  const language = request.language ?? "en";
  const locale = localeFor(language);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const difficulty = difficultyFor(request.difficulty);
  const examProfile = examProfileFor(request.exam);
  const scope = resolveScope(request);
  const baseSeed = String(request.seed ?? "alp001-question-studio-v1");
  const questions = Array.from({ length: count }, (_, index) => {
    const seed = hashSeed(baseSeed + ":" + index);
    const generated = ALP_001_QUESTION_STUDIO_REGISTRY.generateControlled({
      seed,
      locale,
      examProfile,
      difficulty,
      checkpointId: scope.checkpointId,
      qlId: scope.qlId,
    });
    const options = generated.options.map((option) => option.value);
    const difficultyBand = difficultyLabel(generated.difficulty);
    const questionId = `ALP-001:${generated.qlId}:${seed}:${language}`;

    return {
      id: questionId,
      questionId,
      packageId: ALP_001_QUESTION_STUDIO_PACKAGE_ID,
      patternId: generated.qlId,
      qlId: generated.qlId,
      cpId: generated.checkpointId,
      checkpointId: generated.checkpointId,
      subject: "Reasoning",
      topic: "Alphabet Test",
      subtopic: "Alphabet Test",
      language,
      locale,
      stem: generated.stem,
      text: generated.stem,
      options,
      correctIndex: generated.correctIndex,
      correct: generated.correctIndex,
      answer: generated.answer,
      canonicalAnswer: generated.answer,
      explanation: explanationText(generated),
      difficulty: difficultyBand,
      difficultyLabel: difficultyBand,
      generationSeed: String(seed),
      numericSeed: seed,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      manualApprovalRequired: true,
      traceability: {
        chapterId: "ALP-001",
        qlId: generated.qlId,
        checkpointId: generated.checkpointId,
        runtimeVersion: generated.metadata.runtimeVersion,
        independentSolverVerified: generated.metadata.independentSolverVerified,
        ambiguityAudit: generated.metadata.ambiguityAudit,
      },
    };
  });

  return {
    questions,
    generationContext: {
      engineId: "reasoning-v1",
      packageId: ALP_001_QUESTION_STUDIO_PACKAGE_ID,
      language,
      requestedDifficulty: difficulty ? difficultyLabel(difficulty) : "Mixed",
      seed: baseSeed,
      count,
      runtimeMode: "review-only",
      reviewOnly: true,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  };
}
