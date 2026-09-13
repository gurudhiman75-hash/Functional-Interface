import {
  generateQuestion as generateQuantV4Question,
  listQuantV4Packages,
} from "../../quant-v4/generation-engine";
import {
  generateStat001QuestionStudioBatch,
  isStat001QuestionStudioRequest,
  stat001QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-001/question-studio-adapter";
import {
  generateStat002QuestionStudioBatch,
  isStat002QuestionStudioRequest,
  stat002QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-002/question-studio-adapter";
import {
  generateStat003QuestionStudioBatch,
  isStat003QuestionStudioRequest,
  stat003QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-003/question-studio-adapter";
import type {
  QuestionStudioDifficulty,
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function asLanguageArray(value: unknown): QuestionStudioLanguage[] {
  const raw = Array.isArray(value) ? value.map(String) : ["en"];
  return raw.filter(
    (entry): entry is QuestionStudioLanguage =>
      entry === "en" || entry === "hi" || entry === "pa",
  );
}

function asDifficultyArray(value: unknown): QuestionStudioDifficulty[] {
  const raw = Array.isArray(value) ? value.map(String) : [];
  const normalized = raw.map((entry) => {
    const lower = entry.trim().toLowerCase();
    if (lower === "easy") return "Easy";
    if (lower === "medium" || lower === "moderate") return "Medium";
    if (lower === "hard") return "Hard";
    return undefined;
  });
  return normalized.filter((entry): entry is QuestionStudioDifficulty => Boolean(entry));
}

function toSharedPackage(pkg: Record<string, unknown>): QuestionStudioPackageDefinition {
  return {
    engineId: "quant-v4",
    packageId: asString(pkg.packageId),
    subject: asString(pkg.subject) || undefined,
    topic: asString(pkg.topic),
    subtopic: asString(pkg.subtopic),
    label: asString(pkg.label) || asString(pkg.packageId),
    enabled: Boolean(pkg.enabled),
    cpIds: asStringArray(pkg.cpIds),
    supportedLanguages: asLanguageArray(pkg.supportedLanguages),
    supportedDifficulties: asDifficultyArray(pkg.supportedDifficulties),
    runtimeMode: asString(pkg.runtimeMode) || undefined,
    supportedRuntimeModes: asStringArray(pkg.supportedRuntimeModes),
    dynamicCandidateCpIds: asStringArray(pkg.dynamicCandidateCpIds),
    questionBankStatus: asString(pkg.questionBankStatus) || undefined,
    questionBankWritable:
      typeof pkg.questionBankWritable === "boolean"
        ? pkg.questionBankWritable
        : undefined,
    testEligibility: asString(pkg.testEligibility) || undefined,
    testEligible:
      typeof pkg.testEligible === "boolean" ? pkg.testEligible : undefined,
    mockTestEligible:
      typeof pkg.mockTestEligible === "boolean"
        ? pkg.mockTestEligible
        : undefined,
    publiclyPublishable:
      typeof pkg.publiclyPublishable === "boolean"
        ? pkg.publiclyPublishable
        : undefined,
    automaticStudentPublication:
      typeof pkg.automaticStudentPublication === "boolean"
        ? pkg.automaticStudentPublication
        : undefined,
    productionReleaseAuthorized:
      typeof pkg.productionReleaseAuthorized === "boolean"
        ? pkg.productionReleaseAuthorized
        : undefined,
    manualApprovalRequired:
      typeof pkg.manualApprovalRequired === "boolean"
        ? pkg.manualApprovalRequired
        : undefined,
  };
}

function normalizeStatExamProfile(value: unknown) {
  const normalized = String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
  if (!normalized) return undefined;
  if (normalized.includes("jso") || normalized.includes("statistics")) return "SSC_CGL_JSO";
  if (normalized.includes("ssc") && normalized.includes("cgl")) return "SSC_CGL_TIER_II";
  return undefined;
}

function toStatRequest(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    questionLanguageId: request.questionLanguageId,
    examProfile: normalizeStatExamProfile(request.exam),
  };
}

export const quantV4QuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "quant-v4",

  listPackages() {
    const packages = listQuantV4Packages().map((pkg) =>
      toSharedPackage(pkg as unknown as Record<string, unknown>),
    );
    if (!packages.some((pkg) => pkg.packageId === "STAT-001")) {
      packages.push(
        toSharedPackage(
          stat001QuestionStudioPackageCard() as unknown as Record<string, unknown>,
        ),
      );
    }
    if (!packages.some((pkg) => pkg.packageId === "STAT-002")) {
      packages.push(
        toSharedPackage(
          stat002QuestionStudioPackageCard() as unknown as Record<string, unknown>,
        ),
      );
    }
    if (!packages.some((pkg) => pkg.packageId === "STAT-003")) {
      packages.push(
        toSharedPackage(
          stat003QuestionStudioPackageCard() as unknown as Record<string, unknown>,
        ),
      );
    }
    return packages.sort((left, right) => left.packageId.localeCompare(right.packageId));
  },

  async generate(
    request: QuestionStudioGenerationRequest,
  ): Promise<QuestionStudioGenerationResult> {
    const statRequest = toStatRequest(request);
    if (isStat003QuestionStudioRequest(statRequest)) {
      return generateStat003QuestionStudioBatch(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat002QuestionStudioRequest(statRequest)) {
      return generateStat002QuestionStudioBatch(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat001QuestionStudioRequest(statRequest)) {
      return generateStat001QuestionStudioBatch(statRequest) as unknown as QuestionStudioGenerationResult;
    }

    const result = await generateQuantV4Question({
      packageId: request.packageId as never,
      patternId: request.patternId,
      topic: request.topic,
      subtopic: request.subtopic,
      difficulty: request.difficulty as never,
      language: request.language,
      seed: request.seed,
      count: request.count,
      runtimeMode: request.runtimeMode as never,
      canonicalProblemId: request.canonicalProblemId,
      questionLanguageId: request.questionLanguageId,
    });

    return result as unknown as QuestionStudioGenerationResult;
  },
};
