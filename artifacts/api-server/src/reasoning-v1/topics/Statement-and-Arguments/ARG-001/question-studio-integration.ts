import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types.ts";
import {
  ARG_CP014_AUTHORITY,
} from "./cp014-manual-editorial-approval.ts";
import {
  ARG_CP015_CHECKPOINT_ID,
  ARG_CP015_LEARNER_RELEASE,
  ARG_CP015_QUESTION_STUDIO_AUTHORITY,
  ARG_CP015_QUESTION_STUDIO_PACKAGE,
  ARG_CP015_REAL_PAPER_PROFILES,
  ARG_CP015_RUNTIME_MODE,
  generateArgCp015QuestionStudioBatch,
  normalizeArgCp015Profile,
} from "./cp015-perceived-diversity-expansion.ts";
import { ARG_QL_IDS, type ArgQlId } from "./types.ts";

export const ARG_001_STANDARD_PACKAGE_ID = "ARG-001" as const;
export const ARG_001_STANDARD_ADAPTER_AUTHORITY =
  "ARG-001-CP015-STANDARD-REASONING-ADAPTER-2026-10-04" as const;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function languageOf(value: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  const language = value ?? "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`ARG-001 does not support language ${String(value)}`);
}

function countOf(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error("ARG-001 batches require count between 1 and 50");
  }
  return value;
}

function isQlId(value: string): value is ArgQlId {
  return (ARG_QL_IDS as readonly string[]).includes(value);
}

function qlOf(request: QuestionStudioGenerationRequest): ArgQlId | undefined {
  const values = [request.canonicalProblemId, request.patternId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);
  const qls = [...new Set(values.filter(isQlId))];
  if (qls.length > 1) throw new Error(`Conflicting ARG-001 QL selectors: ${qls.join(", ")}`);
  const unknown = values.find((value) => value.startsWith("ARG-QL-") && !isQlId(value));
  if (unknown) throw new Error(`Unknown ARG-001 QL selector ${unknown}`);
  return qls[0];
}

function explicitProfile(request: QuestionStudioGenerationRequest): string {
  const candidates = [request.examProfile, request.patternId]
    .map((value) => text(value))
    .filter(Boolean);
  for (const candidate of candidates) {
    const normalized = normalizeArgCp015Profile(candidate);
    if (
      normalized === "SSC_RECENT_2X4"
      || normalized === "BANKING_CLASSIC_2X5"
      || normalized === "BANKING_COMBO_3X5"
      || normalized === "BANKING_COMBO_4X5"
    ) return normalized;
  }
  return "";
}

function inferredProfile(request: QuestionStudioGenerationRequest): string {
  const explicit = explicitProfile(request);
  if (explicit) return explicit;
  const exam = text(request.exam).toLowerCase();
  if (!exam) return "";
  if (/ibps|sbi|bank|po\b|clerk/u.test(exam)) return "BANKING_CLASSIC_2X5";
  if (/ssc|cgl|chsl|cpo|mts|railway|rrb|punjab|psssb|ppsc/u.test(exam)) return "SSC_RECENT_2X4";
  return "";
}

export function isArg001StandardQuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === ARG_001_STANDARD_PACKAGE_ID;

  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  if (selectors.some((value) => value.startsWith("ARG-QL-") || value.startsWith("ARG-CP-"))) {
    return true;
  }

  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return (
    topic === "statement & arguments"
    || topic === "statement and arguments"
    || subtopic === "statement & arguments"
    || subtopic === "statement and arguments"
  );
}

export const ARG_001_STANDARD_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: ARG_001_STANDARD_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Statement & Arguments",
  subtopic: "Statement & Arguments",
  label: "Reasoning · Statement & Arguments · ARG-001",
  enabled: true,
  cpIds: [...new Set([...ARG_CP015_QUESTION_STUDIO_PACKAGE.cpIds, "ARG-CP-007"])],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: ARG_CP015_RUNTIME_MODE,
  supportedRuntimeModes: [ARG_CP015_RUNTIME_MODE],
  manualApprovalRequired: false,
  questionBankStatus: "WRITABLE",
  questionBankWritable: true,
  questionBankAcceptanceMode: "BANK_ONLY",
  questionBankAcceptanceAuthority: ARG_CP014_AUTHORITY,
  testEligibility: "ELIGIBLE",
  testEligible: true,
  mockTestEligible: true,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  productionReleaseAuthorized: false,
  metadata: {
    registrationAuthorityId: ARG_001_STANDARD_ADAPTER_AUTHORITY,
    currentQuestionStudioAuthority: ARG_CP015_QUESTION_STUDIO_AUTHORITY,
    currentCheckpointId: ARG_CP015_CHECKPOINT_ID,
    permanentQlIds: [...ARG_QL_IDS],
    permanentQlCount: ARG_QL_IDS.length,
    realPaperProfiles: ARG_CP015_REAL_PAPER_PROFILES,
    internalEligibilityApproved: true,
    learnerRelease: ARG_CP015_LEARNER_RELEASE,
    publicReleaseAuthorized: false,
    studentDeliveryAuthorized: false,
    deterministicGeneration: true,
  },
};

export function generateArg001StandardQuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): QuestionStudioGenerationResult {
  if (
    request.runtimeMode
    && request.runtimeMode !== ARG_CP015_RUNTIME_MODE
  ) {
    throw new Error(`ARG-001 supports runtime mode ${ARG_CP015_RUNTIME_MODE}; received ${request.runtimeMode}`);
  }

  const qlId = qlOf(request);
  const profile = inferredProfile(request);
  const difficulty = text(request.difficulty);
  const language = languageOf(request.language);
  const result = generateArgCp015QuestionStudioBatch({
    profileMode: profile ? "real-paper" : "core",
    examProfile: profile || undefined,
    qlId,
    language,
    difficulty: difficulty && difficulty.toLowerCase() !== "mixed" ? difficulty : undefined,
    seed: text(request.seed) || "ARG-001-STANDARD-ADAPTER",
    count: countOf(request.count),
  });

  return {
    questions: result.questions as unknown as Record<string, unknown>[],
    generationContext: {
      ...result.generationContext,
      engineId: "reasoning-v1",
      packageId: ARG_001_STANDARD_PACKAGE_ID,
      standardAdapterAuthority: ARG_001_STANDARD_ADAPTER_AUTHORITY,
      requestedExam: request.exam ?? null,
      requestedExamProfile: request.examProfile ?? null,
      resolvedExamProfile: profile || "CORE",
      requestedQlId: qlId ?? "MIXED",
      requestedDifficulty: request.difficulty ?? "Mixed",
      language,
      questionBankAcceptanceMode: "BANK_ONLY",
      questionBankAcceptanceAuthority: ARG_CP014_AUTHORITY,
      productionReleaseAuthorized: false,
    },
  };
}
