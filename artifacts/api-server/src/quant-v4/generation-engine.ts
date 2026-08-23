import {
  generateQuestion as generateBaseQuestion,
  listQuantV4Packages as listBasePackages,
  type QuantV4GenerationRequest as BaseQuantV4GenerationRequest,
} from "./generation-engine-base";

export * from "./generation-engine-base";

import {
  TRG_002_V4_QUESTION_STUDIO_PACKAGE,
  generateTrg002V4QuestionStudioBatch,
  isTrg002V4GenerationRequest,
  type Trg002V4QuestionStudioRequest,
} from "./topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/question-studio-v4-runtime";

export type QuantV4GenerationRequest = Omit<
  BaseQuantV4GenerationRequest,
  "packageId" | "archetypeId"
> & {
  packageId?: BaseQuantV4GenerationRequest["packageId"] | "TRG-002";
  archetypeId?: BaseQuantV4GenerationRequest["archetypeId"] | "TRG-002";
};

export function listQuantV4Packages() {
  const packages = listBasePackages().filter(
    (pkg: any) => String(pkg.packageId) !== "TRG-002",
  );
  return [...packages, TRG_002_V4_QUESTION_STUDIO_PACKAGE].sort((left: any, right: any) =>
    String(left.packageId).localeCompare(String(right.packageId)),
  );
}

export async function generateQuestion(request: QuantV4GenerationRequest = {}) {
  if (isTrg002V4GenerationRequest(request as Trg002V4QuestionStudioRequest)) {
    return generateTrg002V4QuestionStudioBatch(request as Trg002V4QuestionStudioRequest);
  }
  return generateBaseQuestion(request as BaseQuantV4GenerationRequest);
}
