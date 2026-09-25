import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";
import { DIR_001_QLS, generateDirectionQuestion } from "./chapter-registry";
import { generateDirectionQuestionHindi, generateDirectionQuestionPunjabi } from "./localization";

export const DIR001_QUESTION_STUDIO_PACKAGE_ID_V1 = "DIR-001" as const;
export const DIR001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 =
  "DIR-001-FINAL-AUDIT-WAVE-09-QUESTION-STUDIO-V1" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const qlIds = DIR_001_QLS.map((entry) => entry.qlId);
const cpIds = [...new Set(DIR_001_QLS.map((entry) => entry.checkpointId))];

type DirDifficulty = "EASY" | "MEDIUM" | "HARD";

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error("DIR-001 review batches require count between 1 and 50");
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  const language = value ?? "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`DIR-001 does not support language ${String(value)}`);
}

function normalizeDifficulty(value: unknown): DirDifficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "EASY";
  if (normalized === "medium" || normalized === "moderate") return "MEDIUM";
  if (normalized === "hard") return "HARD";
  throw new Error(`DIR-001 difficulty must be Easy, Medium, Hard or Mixed; received ${String(value)}`);
}

function displayDifficulty(value: DirDifficulty): "Easy" | "Medium" | "Hard" {
  return value === "EASY" ? "Easy" : value === "MEDIUM" ? "Medium" : "Hard";
}

function isQlId(value: string): boolean {
  return qlIds.includes(value as (typeof qlIds)[number]);
}

function isCheckpointId(value: string): boolean {
  return cpIds.includes(value as (typeof cpIds)[number]);
}

function resolveQlPool(request: QuestionStudioGenerationRequest): string[] {
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);

  const qlMatches = [...new Set(selectors.filter(isQlId))];
  const cpMatches = [...new Set(selectors.filter(isCheckpointId))];
  const allowed = new Set<string>([DIR001_QUESTION_STUDIO_PACKAGE_ID_V1, ...qlIds, ...cpIds]);
  const unknown = selectors.find((selector) => selector.startsWith("DIR-") && !allowed.has(selector));
  if (unknown) throw new Error(`Unknown DIR-001 selector ${unknown}`);
  if (qlMatches.length > 1) throw new Error(`Conflicting DIR-001 QL selectors ${qlMatches.join(", ")}`);
  if (cpMatches.length > 1) throw new Error(`Conflicting DIR-001 checkpoint selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const checkpointId = cpMatches[0];
  if (qlId && checkpointId) {
    const owner = DIR_001_QLS.find((entry) => entry.qlId === qlId)!;
    if (owner.checkpointId !== checkpointId) {
      throw new Error(`${qlId} is owned by ${owner.checkpointId}, not ${checkpointId}`);
    }
  }
  if (qlId) return [qlId];
  if (checkpointId) return DIR_001_QLS.filter((entry) => entry.checkpointId === checkpointId).map((entry) => entry.qlId);
  return [...qlIds];
}

function generateLocalized(qlId: string, seed: number, language: QuestionStudioLanguage): Record<string, any> {
  if (language === "hi") return generateDirectionQuestionHindi(qlId, seed) as Record<string, any>;
  if (language === "pa") return generateDirectionQuestionPunjabi(qlId, seed) as Record<string, any>;
  return generateDirectionQuestion(qlId, seed) as Record<string, any>;
}

function explanationText(question: Record<string, any>): string {
  const explanation = question.explanation ?? {};
  return [
    explanation.given,
    ...(Array.isArray(explanation.steps) ? explanation.steps : []),
    explanation.resultLine,
    explanation.conclusion,
  ].filter((value) => typeof value === "string" && value.trim()).join("\n\n");
}

function resolveInstance(
  preferredQl: string,
  pool: readonly string[],
  baseSeed: string,
  index: number,
  language: QuestionStudioLanguage,
  requestedDifficulty: DirDifficulty | undefined,
) {
  const candidates = [preferredQl, ...pool.filter((qlId) => qlId !== preferredQl)];
  const attemptLimit = requestedDifficulty ? 180 : 1;
  for (const qlId of candidates) {
    for (let attempt = 0; attempt < attemptLimit; attempt += 1) {
      const itemSeed = `${baseSeed}:${qlId}:${index}:attempt:${attempt}`;
      const numericSeed = hash(itemSeed);
      const generated = generateLocalized(qlId, numericSeed, language);
      if (!requestedDifficulty || generated.difficulty === requestedDifficulty) {
        return { qlId, generated, itemSeed, numericSeed, attempt };
      }
    }
  }
  throw new Error(
    requestedDifficulty
      ? `DIR-001 could not produce a ${displayDifficulty(requestedDifficulty)} instance inside the selected QL/checkpoint scope without relabelling difficulty.`
      : "DIR-001 could not produce a valid deterministic instance for the requested scope.",
  );
}

export function isDir001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === DIR001_QUESTION_STUDIO_PACKAGE_ID_V1;

  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  if (selectors.some((selector) => selector.startsWith("DIR-QL-") || selector.startsWith("DIR-CP-"))) return true;

  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic === "direction sense"
    || topic === "direction and distance"
    || subtopic === "direction sense"
    || subtopic === "direction & distance"
    || subtopic === "direction and distance";
}

export const DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: DIR001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Reasoning",
  topic: "Direction Sense",
  subtopic: "Direction & Distance",
  label: "Reasoning · Direction Sense · DIR-001",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: DIR001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [DIR001_QUESTION_STUDIO_RUNTIME_MODE_V1],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible,
  mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable,
  automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  metadata: {
    registrationAuthorityId: DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
    permanentQlCount: qlIds.length,
    permanentQlRange: "DIR-QL-001..DIR-QL-044",
    checkpointCount: cpIds.length,
    deterministicGeneration: true,
    multilingualParityVerified: true,
    difficultyCalibrationStatus: "GENERATED_INSTANCE_AUDITED_V1",
    diagramPolicy: "EXPLANATION_ONLY",
    reviewOnly: true,
  },
};

export async function generateDir001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.runtimeMode && request.runtimeMode !== DIR001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
    throw new Error(`DIR-001 only supports ${DIR001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime during final audit`);
  }

  const language = normalizeLanguage(request.language);
  const count = normalizeCount(request.count);
  const requestedDifficulty = normalizeDifficulty(request.difficulty);
  const pool = resolveQlPool(request);
  const baseSeed = text(request.seed) || "dir001-question-studio-final-audit-v1";
  const start = hash(`${baseSeed}:ql-start`) % pool.length;
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const preferredQl = pool[(start + index) % pool.length]!;
    const { qlId, generated, itemSeed, numericSeed, attempt } = resolveInstance(
      preferredQl,
      pool,
      baseSeed,
      index,
      language,
      requestedDifficulty,
    );

    if (generated.questionDiagram) {
      throw new Error(`${qlId} violated DIR-001 explanation-only diagram policy`);
    }

    const difficulty = displayDifficulty(generated.difficulty as DirDifficulty);
    const options = generated.options.map((option: Record<string, any>) => option.label);
    const correctLabel = options[generated.correctIndex];
    const questionId = `DIR-001:${qlId}:${numericSeed}:${language}`;

    questions.push({
      ...lifecycle,
      lifecycleStage: lifecycle.stage,
      id: questionId,
      questionId,
      packageId: DIR001_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: qlId,
      qlId,
      cpId: generated.checkpointId,
      checkpointId: generated.checkpointId,
      ruleId: generated.ruleId,
      subject: "Reasoning",
      topic: "Direction Sense",
      subtopic: "Direction & Distance",
      language,
      locale: language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN",
      stem: generated.stem,
      text: generated.stem,
      options,
      optionRecords: generated.options,
      correctIndex: generated.correctIndex,
      correct: generated.correctIndex,
      answer: generated.correctAnswer,
      canonicalAnswer: correctLabel,
      explanation: explanationText(generated),
      packageExplanation: generated.explanation,
      explanationDiagram: generated.explanation?.diagram ?? null,
      renderer: generated.explanation?.diagram ? "DIRECTION_DIAGRAM" : "TEXT",
      difficulty,
      difficultyLabel: difficulty,
      requestedDifficulty: request.difficulty ?? null,
      requestedDifficultyApplied: requestedDifficulty ? generated.difficulty === requestedDifficulty : false,
      difficultySearchAttempts: attempt + 1,
      requestedExam: request.exam ?? null,
      examProfileApplied: false,
      generationSeed: itemSeed,
      numericSeed,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      structuredPrompt: generated.structuredPrompt,
      traceability: {
        packageId: DIR001_QUESTION_STUDIO_PACKAGE_ID_V1,
        qlId,
        checkpointId: generated.checkpointId,
        ruleId: generated.ruleId,
        seed: numericSeed,
        sourceLocale: "en-IN",
      },
      validation: {
        solverVerified: generated.metadata?.solverVerified === true,
        solveMode: generated.metadata?.solveMode ?? null,
        answerParityVerified: language === "en" ? true : generated.metadata?.answerParityVerified === true,
        difficultyDerivedFromGeneratedInstance: true,
        questionDiagramAbsent: generated.questionDiagram == null,
      },
    });
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      lifecycleStage: lifecycle.stage,
      engineId: "reasoning-v1",
      packageId: DIR001_QUESTION_STUDIO_PACKAGE_ID_V1,
      runtimeMode: DIR001_QUESTION_STUDIO_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: DIR001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
      permanentQlCount: qlIds.length,
      permanentQlIds: [...qlIds],
      cpIds: [...cpIds],
      language,
      requestedDifficulty: requestedDifficulty ? displayDifficulty(requestedDifficulty) : "Mixed",
      difficultyFilterApplied: Boolean(requestedDifficulty),
      difficultyCalibrationStatus: "GENERATED_INSTANCE_AUDITED_V1",
      diagramPolicy: "EXPLANATION_ONLY",
      requestedExam: request.exam ?? null,
      examProfileApplied: false,
      seed: baseSeed,
      count,
    },
  };
}
