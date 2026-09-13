import {
  generateQuestion as generateQuantV4Question,
  listQuantV4Packages,
} from "../../quant-v4/generation-engine";
import {
  generateStat001QuestionStudioBatch,
  isStat001QuestionStudioRequest,
  stat001QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-001/question-studio-adapter";
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
    supportedDifficulties: asStringArray(pkg.supportedDifficulties).filter(
      (entry): entry is "Easy" | "Medium" | "Hard" =>
        entry === "Easy" || entry === "Medium" || entry === "Hard",
    ),
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
    manualApprovalRequired:
      typeof pkg.manualApprovalRequired === "boolean"
        ? pkg.manualApprovalRequired
        : undefined,
  };
}

function toStat001Request(request: QuestionStudioGenerationRequest) {
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
    examProfile: request.exam,
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
    return packages.sort((left, right) => left.packageId.localeCompare(right.packageId));
  },

  async generate(
    request: QuestionStudioGenerationRequest,
  ): Promise<QuestionStudioGenerationResult> {
    const stat001Request = toStat001Request(request);
    if (isStat001QuestionStudioRequest(stat001Request)) {
      return generateStat001QuestionStudioBatch(stat001Request) as unknown as QuestionStudioGenerationResult;
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
