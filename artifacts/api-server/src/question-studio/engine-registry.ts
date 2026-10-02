import type {
  QuestionStudioEngineAdapter,
  QuestionStudioEngineId,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "./engine-types";
import { knowledgeV1QuestionStudioAdapter } from "./engines/knowledge-v1-adapter";
import { languageV1QuestionStudioAdapter } from "./engines/language-v1-adapter";
import { quantV4QuestionStudioAdapter } from "./engines/quant-v4-adapter";
import { reasoningV1QuestionStudioAdapter } from "./engines/reasoning-v1-adapter";
import { enrichQuestionStudioPackageCpTitles } from "./package-metadata";

const adapters = new Map<QuestionStudioEngineId, QuestionStudioEngineAdapter>([
  [quantV4QuestionStudioAdapter.engineId, quantV4QuestionStudioAdapter],
  [knowledgeV1QuestionStudioAdapter.engineId, knowledgeV1QuestionStudioAdapter],
  [languageV1QuestionStudioAdapter.engineId, languageV1QuestionStudioAdapter],
  [reasoningV1QuestionStudioAdapter.engineId, reasoningV1QuestionStudioAdapter],
]);

const VALID_LANGUAGES = new Set(["en", "hi", "pa"]);
const VALID_DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);

export function validateQuestionStudioPackage(
  pkg: QuestionStudioPackageDefinition,
): QuestionStudioPackageDefinition {
  if (!pkg.enabled) return pkg;

  const fail = (message: string): never => {
    throw new Error(`Question Studio package ${pkg.packageId || "<missing>"} is invalid: ${message}`);
  };

  if (!pkg.packageId.trim()) fail("packageId is required.");
  if (!pkg.label.trim()) fail("label is required.");
  if (!pkg.topic.trim() && !pkg.subtopic.trim()) {
    fail("topic or subtopic is required.");
  }

  const visibleCpIds = [
    ...new Set([
      ...pkg.cpIds.map((value) => value.trim()).filter(Boolean),
      ...(pkg.dynamicCandidateCpIds ?? []).map((value) => value.trim()).filter(Boolean),
    ]),
  ];
  if (visibleCpIds.length === 0) {
    fail("at least one CP or dynamic candidate CP is required.");
  }
  if (new Set(pkg.cpIds).size !== pkg.cpIds.length) {
    fail("cpIds must not contain duplicates.");
  }

  if (pkg.supportedLanguages.length === 0) {
    fail("at least one supported language is required.");
  }
  const invalidLanguage = pkg.supportedLanguages.find(
    (language) => !VALID_LANGUAGES.has(language),
  );
  if (invalidLanguage) fail(`unsupported language ${invalidLanguage}.`);

  const supportsDifficultyFiltering = pkg.difficultyFilterSupported !== false;
  if (supportsDifficultyFiltering && (pkg.supportedDifficulties?.length ?? 0) === 0) {
    fail("difficulty filtering is enabled but supportedDifficulties is empty.");
  }
  const invalidDifficulty = pkg.supportedDifficulties?.find(
    (difficulty) => !VALID_DIFFICULTIES.has(difficulty),
  );
  if (invalidDifficulty) fail(`unsupported difficulty ${invalidDifficulty}.`);

  if (
    pkg.runtimeMode
    && (pkg.supportedRuntimeModes?.length ?? 0) > 0
    && !pkg.supportedRuntimeModes!.includes(pkg.runtimeMode)
  ) {
    fail(`runtimeMode ${pkg.runtimeMode} is not listed in supportedRuntimeModes.`);
  }

  const declaresManagedLifecycle =
    Boolean(pkg.lifecycleId)
    || Boolean(pkg.lifecycleStage)
    || pkg.questionBankWritable !== undefined
    || pkg.testEligible !== undefined
    || pkg.mockTestEligible !== undefined
    || pkg.publiclyPublishable !== undefined
    || pkg.productionReleaseAuthorized !== undefined;

  if (declaresManagedLifecycle && !pkg.lifecycleStage) {
    fail("packages that declare lifecycle gates must declare lifecycleStage.");
  }

  if (pkg.lifecycleStage === "REVIEW_ONLY") {
    if (pkg.questionBankWritable === true) fail("REVIEW_ONLY cannot be Question Bank writable.");
    if (pkg.testEligible === true) fail("REVIEW_ONLY cannot be test eligible.");
    if (pkg.mockTestEligible === true) fail("REVIEW_ONLY cannot be mock-test eligible.");
    if (pkg.publiclyPublishable === true) fail("REVIEW_ONLY cannot be publicly publishable.");
    if (pkg.productionReleaseAuthorized === true) fail("REVIEW_ONLY cannot authorize production release.");
  }

  if (pkg.lifecycleStage === "BANK_ONLY") {
    if (pkg.questionBankWritable !== true) fail("BANK_ONLY must be Question Bank writable.");
    if (pkg.questionBankAcceptanceMode && pkg.questionBankAcceptanceMode !== "BANK_ONLY") {
      fail("BANK_ONLY must use BANK_ONLY question-bank acceptance.");
    }
    if (pkg.testEligible === true) fail("BANK_ONLY cannot be test eligible.");
    if (pkg.mockTestEligible === true) fail("BANK_ONLY cannot be mock-test eligible.");
    if (pkg.publiclyPublishable === true) fail("BANK_ONLY cannot be publicly publishable.");
    if (pkg.productionReleaseAuthorized === true) fail("BANK_ONLY cannot authorize production release.");
  }

  return pkg;
}

export function listQuestionStudioEngines(): QuestionStudioEngineId[] {
  return [...adapters.keys()];
}

export function getQuestionStudioEngine(
  engineId: QuestionStudioEngineId,
): QuestionStudioEngineAdapter {
  const adapter = adapters.get(engineId);
  if (!adapter) {
    throw new Error(`Question Studio engine ${engineId} is not registered.`);
  }
  return adapter;
}

export function listQuestionStudioPackages(): QuestionStudioPackageDefinition[] {
  const packages = [...adapters.values()]
    .flatMap((adapter) => adapter.listPackages())
    .map(enrichQuestionStudioPackageCpTitles)
    .map(validateQuestionStudioPackage);

  const owners = new Map<string, QuestionStudioEngineId[]>();
  for (const pkg of packages) {
    const packageOwners = owners.get(pkg.packageId) ?? [];
    packageOwners.push(pkg.engineId);
    owners.set(pkg.packageId, packageOwners);
  }

  const duplicate = [...owners.entries()].find(([, engineIds]) => engineIds.length > 1);
  if (duplicate) {
    const [packageId, engineIds] = duplicate;
    throw new Error(
      `Question Studio package ${packageId} is registered by multiple engines: ${engineIds.join(", ")}.`,
    );
  }

  return packages.sort((left, right) =>
    left.packageId.localeCompare(right.packageId),
  );
}

export function resolveQuestionStudioEngine(
  request: QuestionStudioGenerationRequest,
): QuestionStudioEngineAdapter {
  if (request.packageId) {
    const pkg = listQuestionStudioPackages().find(
      (candidate) => candidate.packageId === request.packageId,
    );
    if (!pkg) {
      throw new Error(
        `Question Studio package ${request.packageId} is not registered.`,
      );
    }
    if (request.engineId && request.engineId !== pkg.engineId) {
      throw new Error(
        `Question Studio package ${request.packageId} belongs to ${pkg.engineId}, not ${request.engineId}.`,
      );
    }
    return getQuestionStudioEngine(pkg.engineId);
  }

  if (request.engineId) {
    return getQuestionStudioEngine(request.engineId);
  }

  // Backward-compatible default for legacy requests that provide neither
  // an engine nor a package. Explicit package IDs never fall through here.
  return quantV4QuestionStudioAdapter;
}

export async function generateQuestionStudioQuestions(
  request: QuestionStudioGenerationRequest,
): Promise<
  QuestionStudioGenerationResult & { engineId: QuestionStudioEngineId }
> {
  const adapter = resolveQuestionStudioEngine(request);
  const result = await adapter.generate(request);
  return {
    ...result,
    engineId: adapter.engineId,
  };
}
