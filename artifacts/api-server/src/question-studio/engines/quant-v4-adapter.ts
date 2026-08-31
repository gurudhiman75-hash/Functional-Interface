import {
  generateQuestion as generateQuantV4Question,
  listQuantV4Packages,
} from "../../quant-v4/generation-engine";
import type {
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
    runtimeMode: asString(pkg.runtimeMode) || undefined,
    supportedRuntimeModes: asStringArray(pkg.supportedRuntimeModes),
    dynamicCandidateCpIds: asStringArray(pkg.dynamicCandidateCpIds),
    questionBankStatus: asString(pkg.questionBankStatus) || undefined,
    testEligibility: asString(pkg.testEligibility) || undefined,
    publiclyPublishable:
      typeof pkg.publiclyPublishable === "boolean"
        ? pkg.publiclyPublishable
        : undefined,
  };
}

export const quantV4QuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "quant-v4",

  listPackages() {
    return listQuantV4Packages().map((pkg) =>
      toSharedPackage(pkg as unknown as Record<string, unknown>),
    );
  },

  async generate(
    request: QuestionStudioGenerationRequest,
  ): Promise<QuestionStudioGenerationResult> {
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
