import type {
  QuestionStudioEngineAdapter,
  QuestionStudioEngineId,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "./engine-types";
import { knowledgeV1QuestionStudioAdapter } from "./engines/knowledge-v1-adapter";
import { quantV4QuestionStudioAdapter } from "./engines/quant-v4-adapter";

const adapters = new Map<QuestionStudioEngineId, QuestionStudioEngineAdapter>([
  [quantV4QuestionStudioAdapter.engineId, quantV4QuestionStudioAdapter],
  [knowledgeV1QuestionStudioAdapter.engineId, knowledgeV1QuestionStudioAdapter],
]);

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
  return [...adapters.values()]
    .flatMap((adapter) => adapter.listPackages())
    .sort((left, right) =>
      left.packageId.localeCompare(right.packageId),
    );
}

export function resolveQuestionStudioEngine(
  request: QuestionStudioGenerationRequest,
): QuestionStudioEngineAdapter {
  if (request.engineId) {
    return getQuestionStudioEngine(request.engineId);
  }

  if (request.packageId) {
    const matches = [...adapters.values()].filter((adapter) =>
      adapter.listPackages().some(
        (pkg) => pkg.packageId === request.packageId,
      ),
    );

    if (matches.length === 1) return matches[0]!;
    if (matches.length > 1) {
      throw new Error(
        `Question Studio package ${request.packageId} is registered by multiple engines.`,
      );
    }
  }

  // Backward-compatible default while the existing admin route remains
  // Quant-V4-first. New engines are selected explicitly or by registered
  // package ownership so existing Quant traffic is not stolen.
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
