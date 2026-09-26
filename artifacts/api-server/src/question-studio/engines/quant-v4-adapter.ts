import {
  generateQuestion as generateQuantV4Question,
  listQuantV4Packages,
} from "../../quant-v4/generation-engine";
import {
  di001QuestionStudioPackageCard,
  generateDi001QuestionStudioBatch,
  isDi001QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-001/question-studio-adapter";
import {
  di002QuestionStudioPackageCard,
  generateDi002QuestionStudioBatch,
  isDi002QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-002/question-studio-adapter";
import {
  di003QuestionStudioPackageCard,
  generateDi003QuestionStudioBatch,
  isDi003QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-003/question-studio-adapter";
import {
  di005QuestionStudioPackageCard,
  generateDi005QuestionStudioBatch,
  isDi005QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-005/question-studio-adapter";
import {
  di006QuestionStudioPackageCard,
  generateDi006QuestionStudioBatch,
  isDi006QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-006/question-studio-adapter";
import {
  di007QuestionStudioPackageCard,
  generateDi007QuestionStudioBatch,
  isDi007QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-007/question-studio-adapter";
import {
  di008QuestionStudioPackageCard,
  generateDi008QuestionStudioBatch,
  isDi008QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-008/question-studio-adapter";
import {
  di009QuestionStudioPackageCard,
  generateDi009QuestionStudioBatch,
  isDi009QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-009/question-studio-adapter";
import {
  di010QuestionStudioPackageCard,
  generateDi010QuestionStudioBatch,
  isDi010QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-010/question-studio-adapter";
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
  return raw.filter((entry): entry is QuestionStudioLanguage => entry === "en" || entry === "hi" || entry === "pa");
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
    questionBankWritable: typeof pkg.questionBankWritable === "boolean" ? pkg.questionBankWritable : undefined,
    testEligibility: asString(pkg.testEligibility) || undefined,
    testEligible: typeof pkg.testEligible === "boolean" ? pkg.testEligible : undefined,
    mockTestEligible: typeof pkg.mockTestEligible === "boolean" ? pkg.mockTestEligible : undefined,
    publiclyPublishable: typeof pkg.publiclyPublishable === "boolean" ? pkg.publiclyPublishable : undefined,
    automaticStudentPublication: typeof pkg.automaticStudentPublication === "boolean" ? pkg.automaticStudentPublication : undefined,
    productionReleaseAuthorized: typeof pkg.productionReleaseAuthorized === "boolean" ? pkg.productionReleaseAuthorized : undefined,
    manualApprovalRequired: typeof pkg.manualApprovalRequired === "boolean" ? pkg.manualApprovalRequired : undefined,
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

function toDi001Request(request: QuestionStudioGenerationRequest) {
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

function toDi002Request(request: QuestionStudioGenerationRequest) {
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

function toDi003Request(request: QuestionStudioGenerationRequest) {
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

function toDi005Request(request: QuestionStudioGenerationRequest) {
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

function toDi006Request(request: QuestionStudioGenerationRequest) {
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

function toDi007Request(request: QuestionStudioGenerationRequest) {
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

function toDi008Request(request: QuestionStudioGenerationRequest) {
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

function toDi009Request(request: QuestionStudioGenerationRequest) {
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

function toDi010Request(request: QuestionStudioGenerationRequest) {
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
    const packages = listQuantV4Packages().map((pkg) => toSharedPackage(pkg as unknown as Record<string, unknown>));

    const replaceOrPush = (packageId: string, card: Record<string, unknown>) => {
      const shared = toSharedPackage(card);
      const index = packages.findIndex((pkg) => pkg.packageId === packageId);
      if (index >= 0) packages[index] = shared;
      else packages.push(shared);
    };

    replaceOrPush("DI-001", di001QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-002", di002QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-003", di003QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-005", di005QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-006", di006QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-007", di007QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-008", di008QuestionStudioPackageCard() as unknown as Record<string, unknown>);

    if (!packages.some((pkg) => pkg.packageId === "DI-009")) {
      packages.push(toSharedPackage(di009QuestionStudioPackageCard() as unknown as Record<string, unknown>));
    }
    if (!packages.some((pkg) => pkg.packageId === "DI-010")) {
      packages.push(toSharedPackage(di010QuestionStudioPackageCard() as unknown as Record<string, unknown>));
    }
    if (!packages.some((pkg) => pkg.packageId === "STAT-001")) {
      packages.push(toSharedPackage(stat001QuestionStudioPackageCard() as unknown as Record<string, unknown>));
    }
    if (!packages.some((pkg) => pkg.packageId === "STAT-002")) {
      packages.push(toSharedPackage(stat002QuestionStudioPackageCard() as unknown as Record<string, unknown>));
    }
    return packages.sort((left, right) => left.packageId.localeCompare(right.packageId));
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const di001Request = toDi001Request(request);
    if (isDi001QuestionStudioRequest(di001Request)) {
      return generateDi001QuestionStudioBatch(di001Request) as unknown as QuestionStudioGenerationResult;
    }

    const di002Request = toDi002Request(request);
    if (isDi002QuestionStudioRequest(di002Request)) {
      return generateDi002QuestionStudioBatch(di002Request) as unknown as QuestionStudioGenerationResult;
    }

    const di003Request = toDi003Request(request);
    if (isDi003QuestionStudioRequest(di003Request)) {
      return generateDi003QuestionStudioBatch(di003Request) as unknown as QuestionStudioGenerationResult;
    }

    const di005Request = toDi005Request(request);
    if (isDi005QuestionStudioRequest(di005Request)) {
      return generateDi005QuestionStudioBatch(di005Request) as unknown as QuestionStudioGenerationResult;
    }

    const di006Request = toDi006Request(request);
    if (isDi006QuestionStudioRequest(di006Request)) {
      return generateDi006QuestionStudioBatch(di006Request) as unknown as QuestionStudioGenerationResult;
    }

    const di007Request = toDi007Request(request);
    if (isDi007QuestionStudioRequest(di007Request)) {
      return generateDi007QuestionStudioBatch(di007Request) as unknown as QuestionStudioGenerationResult;
    }

    const di008Request = toDi008Request(request);
    if (isDi008QuestionStudioRequest(di008Request)) {
      return generateDi008QuestionStudioBatch(di008Request) as unknown as QuestionStudioGenerationResult;
    }

    const di010Request = toDi010Request(request);
    if (isDi010QuestionStudioRequest(di010Request)) {
      return generateDi010QuestionStudioBatch(di010Request) as unknown as QuestionStudioGenerationResult;
    }

    const di009Request = toDi009Request(request);
    if (isDi009QuestionStudioRequest(di009Request)) {
      return generateDi009QuestionStudioBatch(di009Request) as unknown as QuestionStudioGenerationResult;
    }

    const statRequest = toStatRequest(request);
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
