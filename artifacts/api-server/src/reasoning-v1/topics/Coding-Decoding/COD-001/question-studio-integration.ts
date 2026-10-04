import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";
import { generateCod001Question, type Cod001Locale } from "./multilingual-runtime";
import {
  COD_001_QUESTION_STUDIO_CHECKPOINTS,
  COD_001_QUESTION_STUDIO_QL_IDS,
  COD_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
} from "./question-studio-review";
import { getCodSourceGapPermanentContract } from "./source-gap-permanent-contracts";

export const COD_001_STANDARD_QUESTION_STUDIO_PACKAGE_ID = "COD-001" as const;
export const COD_001_STANDARD_QUESTION_STUDIO_AUTHORITY =
  "COD-001-STANDARD-REASONING-ADAPTER-2026-10-04" as const;
export const COD_001_STANDARD_RUNTIME_MODE = "review-only" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const qlIds = [...COD_001_QUESTION_STUDIO_QL_IDS];
const qlSet = new Set(qlIds);
const cpSet = new Set(COD_001_QUESTION_STUDIO_CHECKPOINTS);

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error("COD-001 review batches require count between 1 and 50");
  }
  return value;
}

function normalizeLanguage(
  value: QuestionStudioGenerationRequest["language"],
): "en" | "hi" | "pa" {
  const language = value ?? "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error("COD-001 supports English, Hindi and Punjabi");
}

function localeFor(language: "en" | "hi" | "pa"): Cod001Locale {
  return language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
}

function normalizeDifficulty(value: unknown): "EASY" | "MEDIUM" | "HARD" | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "EASY";
  if (normalized === "medium" || normalized === "moderate") return "MEDIUM";
  if (normalized === "hard") return "HARD";
  throw new Error("COD-001 difficulty must be Easy, Medium, Hard or Mixed");
}

function difficultyLabel(value: unknown): "Easy" | "Medium" | "Hard" {
  const normalized = String(value ?? "").toUpperCase();
  if (normalized === "EASY") return "Easy";
  if (normalized === "HARD") return "Hard";
  return "Medium";
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function qlNumber(qlId: string): number {
  const match = /^COD-QL-(\d{3})$/u.exec(qlId);
  return match ? Number(match[1]) : Number.NaN;
}

function checkpointForQl(qlId: string): string {
  const number = qlNumber(qlId);
  if (number >= 1 && number <= 24) return "COD-CP-001";
  if (number <= 52) return "COD-CP-002";
  if (number <= 80) return "COD-CP-003";
  if (number <= 112) return "COD-CP-004";
  if (number <= 136) return "COD-CP-005";
  if (number <= 168) return "COD-CP-006";
  if (number <= 172) return "COD-CP-007";
  if (number <= 174) return "COD-CP-008";
  if (number <= 198) return "COD-CP-009";
  if (number === 199) return "COD-CP-010";
  if (number >= 200 && number <= 203) {
    return getCodSourceGapPermanentContract(qlId as "COD-QL-200" | "COD-QL-201" | "COD-QL-202" | "COD-QL-203").checkpointId;
  }
  throw new Error("Unknown COD-001 QL " + qlId);
}

function selectorValues(request: QuestionStudioGenerationRequest): string[] {
  return [
    request.canonicalProblemId,
    request.questionLanguageId,
    request.patternId,
  ].map((value) => text(value).toUpperCase()).filter(Boolean);
}

function resolveQlPool(request: QuestionStudioGenerationRequest): string[] {
  const selectors = selectorValues(request);
  const qlMatches = [...new Set(selectors.filter((value) => qlSet.has(value)))];
  const cpMatches = [...new Set(selectors.filter((value) => cpSet.has(value)))];
  const unknown = selectors.find(
    (value) => (value.startsWith("COD-QL-") || value.startsWith("COD-CP-"))
      && !qlSet.has(value)
      && !cpSet.has(value),
  );
  if (unknown) throw new Error("Unknown COD-001 selector " + unknown);
  if (qlMatches.length > 1) throw new Error("Conflicting COD-001 QL selectors");
  if (cpMatches.length > 1) throw new Error("Conflicting COD-001 checkpoint selectors");

  const qlId = qlMatches[0];
  const cpId = cpMatches[0];
  if (qlId && cpId && checkpointForQl(qlId) !== cpId) {
    throw new Error(qlId + " is not owned by " + cpId);
  }
  if (qlId) return [qlId];
  if (cpId) return qlIds.filter((candidate) => checkpointForQl(candidate) === cpId);
  return [...qlIds];
}

function shuffled(values: readonly string[], seed: string): string[] {
  const next = [...values];
  let state = hash(seed) || 1;
  for (let index = next.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swap = state % (index + 1);
    [next[index], next[swap]] = [next[swap]!, next[index]!];
  }
  return next;
}

function optionValues(options: readonly unknown[]): string[] {
  return options.map((option) => {
    if (typeof option === "string") return option;
    if (option && typeof option === "object" && "value" in option) {
      return String((option as Readonly<Record<string, unknown>>).value ?? "");
    }
    return String(option ?? "");
  });
}

function explanationText(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  const explanation = value as Readonly<Record<string, unknown>>;
  const parts: string[] = [];
  for (const key of [
    "ruleStatement",
    "coreRule",
    "rule",
    "given",
    "sourceDemonstration",
    "targetApplication",
    "stepByStep",
    "steps",
    "working",
    "visualAlignment",
    "conclusion",
    "answer",
    "caution",
  ]) {
    const item = explanation[key];
    if (Array.isArray(item)) {
      parts.push(...item.map(String).filter(Boolean));
    } else if (typeof item === "string" && item.trim()) {
      parts.push(item.trim());
    }
  }
  if (parts.length > 0) return parts.join("\n\n");
  return JSON.stringify(explanation);
}

export const COD_001_STANDARD_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: COD_001_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Coding-Decoding",
  subtopic: "Coding-Decoding",
  label: "Reasoning · Coding-Decoding · COD-001",
  enabled: true,
  cpIds: [...COD_001_QUESTION_STUDIO_CHECKPOINTS],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: COD_001_STANDARD_RUNTIME_MODE,
  supportedRuntimeModes: [COD_001_STANDARD_RUNTIME_MODE],
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
    standardAdapterAuthority: COD_001_STANDARD_QUESTION_STUDIO_AUTHORITY,
    legacyReviewAuthority: COD_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    checkpointCount: COD_001_QUESTION_STUDIO_CHECKPOINTS.length,
    permanentQlCount: qlIds.length,
    permanentQlRange: "COD-QL-001..203",
    deterministicGeneration: true,
    multilingualRuntime: true,
    reviewOnly: true,
  },
};

export function isCod001QuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === COD_001_STANDARD_QUESTION_STUDIO_PACKAGE_ID;
  const selectors = selectorValues(request);
  if (selectors.some((value) => value.startsWith("COD-QL-") || value.startsWith("COD-CP-"))) return true;
  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic === "coding-decoding"
    || topic === "coding decoding"
    || subtopic === "coding-decoding"
    || subtopic === "coding decoding";
}

export async function generateCod001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.runtimeMode && request.runtimeMode !== COD_001_STANDARD_RUNTIME_MODE) {
    throw new Error("COD-001 only supports review-only runtime");
  }

  const count = normalizeCount(request.count);
  const language = normalizeLanguage(request.language);
  const locale = localeFor(language);
  const requestedDifficulty = normalizeDifficulty(request.difficulty);
  const baseSeed = text(request.seed) || "cod001-standard-question-studio-v1";
  const basePool = resolveQlPool(request);
  const pool = shuffled(basePool, baseSeed + ":ql-order");
  const questions: Record<string, unknown>[] = [];
  const candidateBudget = requestedDifficulty ? Math.max(600, count * 180) : count;

  for (let candidateIndex = 0; questions.length < count && candidateIndex < candidateBudget; candidateIndex += 1) {
    const qlId = pool[candidateIndex % pool.length]!;
    const itemSeedText = baseSeed + ":" + qlId + ":" + candidateIndex;
    const numericSeed = hash(itemSeedText) & 0x7fffffff;
    const generated = generateCod001Question(qlId, locale, numericSeed) as Readonly<Record<string, unknown>>;
    const generatedDifficulty = String(generated.difficulty ?? "MEDIUM").toUpperCase() as "EASY" | "MEDIUM" | "HARD";
    if (requestedDifficulty && generatedDifficulty !== requestedDifficulty) continue;

    const rawOptions = Array.isArray(generated.options) ? generated.options : [];
    const options = optionValues(rawOptions);
    const correctIndex = Number(generated.correctIndex);
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
      throw new Error(qlId + " produced an invalid correct option index");
    }
    const checkpointId = String(generated.checkpointId ?? checkpointForQl(qlId));
    if (checkpointId !== checkpointForQl(qlId)) {
      throw new Error(qlId + " checkpoint ownership drift: " + checkpointId);
    }
    const questionId = "COD-001:" + qlId + ":" + language + ":" + numericSeed;
    const difficulty = difficultyLabel(generatedDifficulty);

    questions.push({
      ...lifecycle,
      id: questionId,
      questionId,
      packageId: COD_001_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
      patternId: qlId,
      qlId,
      permanentQlId: qlId,
      cpId: checkpointId,
      checkpointId,
      subject: "Reasoning",
      topic: "Coding-Decoding",
      subtopic: "Coding-Decoding",
      language,
      locale,
      stem: String(generated.stem ?? ""),
      text: String(generated.stem ?? ""),
      structuredPrompt: generated.structuredPrompt,
      options,
      correct: correctIndex,
      correctIndex,
      answer: options[correctIndex],
      canonicalAnswer: options[correctIndex],
      explanation: explanationText(generated.explanation),
      packageExplanation: generated.explanation,
      difficulty,
      difficultyLabel: difficulty,
      renderer: generated.renderer ?? "TEXT",
      generationSeed: itemSeedText,
      numericSeed,
      runtimeMode: COD_001_STANDARD_RUNTIME_MODE,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: COD_001_STANDARD_QUESTION_STUDIO_AUTHORITY,
      traceability: {
        chapterId: "COD-001",
        qlId,
        checkpointId,
        sourceRuntimeVersion: (generated.metadata as Readonly<Record<string, unknown>> | undefined)?.runtimeVersion ?? null,
        sourceGapPermanent: Number(qlNumber(qlId)) >= 200,
      },
      validation: {
        optionCount: options.length,
        uniqueOptions: new Set(options).size === options.length,
        correctIndexInRange: true,
        checkpointOwnershipVerified: true,
        multilingualRuntime: locale !== "en-IN",
        difficultyFilterApplied: requestedDifficulty ? generatedDifficulty === requestedDifficulty : false,
      },
    });
  }

  if (questions.length !== count) {
    throw new Error(
      "Unable to generate " + count + " COD-001 questions matching "
      + String(requestedDifficulty ?? "Mixed") + " within deterministic candidate budget",
    );
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: COD_001_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
      runtimeMode: COD_001_STANDARD_RUNTIME_MODE,
      standardAdapterAuthority: COD_001_STANDARD_QUESTION_STUDIO_AUTHORITY,
      legacyReviewAuthority: COD_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
      permanentQlCount: qlIds.length,
      permanentQlIds: [...qlIds],
      checkpointCount: COD_001_QUESTION_STUDIO_CHECKPOINTS.length,
      language,
      requestedDifficulty: requestedDifficulty ? difficultyLabel(requestedDifficulty) : "Mixed",
      requestedDifficultyApplied: requestedDifficulty !== undefined,
      seed: baseSeed,
      count,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  };
}
