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
import {
  generateBlr001StandardQuestionStudioBatch,
  isBlr001StandardQuestionStudioRequest,
  listBlr001StandardQuestionStudioPackages,
  type Blr001StandardQuestionStudioRequest,
} from "../reasoning-v1/topics/Blood-Relations/BLR-001/question-studio-standard-integration";
import {
  generateIop001StandardQuestionStudioBatch,
  isIop001StandardQuestionStudioRequest,
  listIop001StandardQuestionStudioPackages,
  type Iop001QuestionStudioRequest,
} from "../reasoning-v1/topics/InputOutput/IOP-001/question-studio-standard-integration";

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
  return [
    ...packages,
    ...listProbabilityStandardQuestionStudioPackages(),
    ...listBlr001StandardQuestionStudioPackages(),
    ...listIop001StandardQuestionStudioPackages(),
  ].sort((left, right) => left.packageId.localeCompare(right.packageId));
}

export async function generateQuestion(request: QuantV4GenerationRequest = {}) {
  if (isIop001StandardQuestionStudioRequest(request as Iop001QuestionStudioRequest)) {
    return generateIop001StandardQuestionStudioBatch(request as Iop001QuestionStudioRequest);
  }
  if (isBlr001StandardQuestionStudioRequest(request as Blr001StandardQuestionStudioRequest)) {
    return generateBlr001StandardQuestionStudioBatch(request as Blr001StandardQuestionStudioRequest);
  }
  if (isProbabilityStandardQuestionStudioRequest(request as ProbabilityStandardQuestionStudioRequest)) {
    return generateProbabilityQuestionStudioBatch(request as ProbabilityStandardQuestionStudioRequest);
  }
  return generateLegacyQuestion(request);
}
