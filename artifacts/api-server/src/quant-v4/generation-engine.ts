import {
  generateQuestion as generateLegacyQuestion,
  listQuantV4Packages as listLegacyPackages,
  toQuestionStudioPreview,
  QUANT_V4_PERCENTAGE_ALL_PATTERN_ID,
} from "./generation-engine-legacy";
import type { QuantV4GenerationRequest } from "./generation-engine-legacy";
import {
  generateProbabilityQuestionStudioBatch,
  isProbabilityStandardQuestionStudioRequest,
  listProbabilityStandardQuestionStudioPackages,
  type ProbabilityStandardQuestionStudioRequest,
} from "./topics/Probability/question-studio-integration";

export type {
  QuantV4Difficulty,
  QuantV4GenerationRequest,
  QuantV4Language,
  QuantV4PackageDefinition,
  QuantV4PackageId,
} from "./generation-engine-legacy";
export { QUANT_V4_PERCENTAGE_ALL_PATTERN_ID, toQuestionStudioPreview };

export function listQuantV4Packages() {
  const packages = listLegacyPackages().filter(
    (entry) => entry.packageId !== "PRB-001" && entry.packageId !== "PRB-002",
  );
  return [...packages, ...listProbabilityStandardQuestionStudioPackages()]
    .sort((left, right) => left.packageId.localeCompare(right.packageId));
}

export async function generateQuestion(request: QuantV4GenerationRequest = {}) {
  if (isProbabilityStandardQuestionStudioRequest(request as ProbabilityStandardQuestionStudioRequest)) {
    return generateProbabilityQuestionStudioBatch(request as ProbabilityStandardQuestionStudioRequest);
  }
  return generateLegacyQuestion(request);
}
