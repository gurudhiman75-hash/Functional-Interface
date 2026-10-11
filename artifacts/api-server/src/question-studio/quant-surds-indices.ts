import {
  generateSriQuestionStudioBatchV1,
  isSriQuestionStudioRequestV1,
  listSriQuestionStudioPackagesV1,
} from "../quant-v4/topics/NumberSystem/subtopics/SurdsAndIndices/question-studio-v1";
import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
} from "./engine-types";

export function sriEnginePackages() {
  return listSriQuestionStudioPackagesV1().map((pkg) => ({
    ...pkg,
    metadata: {
      permanentQlCount: pkg.permanentQlCount,
      permanentQlIds: [...pkg.permanentQlIds],
      releaseId: pkg.releaseId,
      localizationFreezeId: pkg.localizationFreezeId,
      approvedLocalizationArtifactId: pkg.approvedLocalizationArtifactId,
      sourceFacade: "SurdsAndIndices/question-studio-v1",
    },
  }));
}

/** Reuse the approved review runtime; frozen mathematics and release locks stay owned there. */
export async function generateSriEngineBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult | null> {
  const explicitSri = /^SRI(?:-|$)/i.test(String(request.packageId ?? ""))
    || /^SRI-/i.test(String(request.questionLanguageId ?? ""))
    || /^SRI-/i.test(String(request.canonicalProblemId ?? ""));
  if (!explicitSri && !isSriQuestionStudioRequestV1(request)) return null;

  try {
    const count = request.count ?? 5;
    if (!Number.isInteger(count) || count < 1 || count > 50) {
      throw new Error("Question count must be an integer between 1 and 50");
    }
    if (request.runtimeMode && request.runtimeMode !== "QUESTION_STUDIO_ACTIVE") {
      throw new Error(`Unsupported SRI runtime mode ${request.runtimeMode}`);
    }
    const result = await generateSriQuestionStudioBatchV1({ ...request, count });
    return {
      ...result,
      questions: [...result.questions],
      questionPackages: [...result.questionPackages],
      generationContext: { ...result.generationContext, engineId: "quant-v4" },
    };
  } catch (error) {
    throw Object.assign(error instanceof Error ? error : new Error(String(error)), {
      statusCode: 400,
      code: "SRI_REQUEST_INVALID",
    });
  }
}
