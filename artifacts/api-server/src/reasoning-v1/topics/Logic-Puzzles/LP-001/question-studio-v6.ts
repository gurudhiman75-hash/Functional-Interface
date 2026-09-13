import {
  generateLogicPuzzleQuestionStudioBatchV5,
  isLogicPuzzleQuestionStudioRequestV5,
  listLogicPuzzleQuestionStudioPackagesV5,
} from "./question-studio-v5.ts";
import type { LogicPuzzleQuestionStudioRequest } from "./question-studio-v2.ts";
import {
  LP_011_HI_PA_LOCALIZATION_FREEZE_V1,
  LP_006_PROJECTION_HI_PA_LOCALIZATION_FREEZE_V1,
} from "./lp-post-046-localization-freeze-v1.ts";

export const LP_QUESTION_STUDIO_V6 = Object.freeze({
  authorityId: "LP_QUESTION_STUDIO_V6" as const,
  parentAuthorityId: "LP_QUESTION_STUDIO_V5" as const,
  lp011LocalizationAuthorityId: LP_011_HI_PA_LOCALIZATION_FREEZE_V1.authorityId,
  lp006ProjectionLocalizationAuthorityId: LP_006_PROJECTION_HI_PA_LOCALIZATION_FREEZE_V1.authorityId,
  localizationFreezeStatus: "FROZEN_THROUGH_LP_QL_046" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export function isLogicPuzzleQuestionStudioRequestV6(request: LogicPuzzleQuestionStudioRequest): boolean {
  return isLogicPuzzleQuestionStudioRequestV5(request);
}

export function listLogicPuzzleQuestionStudioPackagesV6() {
  return listLogicPuzzleQuestionStudioPackagesV5().map((pkg: any) => {
    if (pkg.id === "LP-011") return {
      ...pkg,
      supportedLanguages: ["en", "hi", "pa"],
      localizationFreezeStatus: "FROZEN_V1",
      localizationAuthorityId: LP_011_HI_PA_LOCALIZATION_FREEZE_V1.authorityId,
      questionStudioLanguageActivation: "ACTIVE_REVIEW_ONLY",
    };
    if (pkg.id === "LP-006-PROJECTION") return {
      ...pkg,
      supportedLanguages: ["en", "hi", "pa"],
      localizationFreezeStatus: "FROZEN_V1",
      localizationAuthorityId: LP_006_PROJECTION_HI_PA_LOCALIZATION_FREEZE_V1.authorityId,
      questionStudioLanguageActivation: "ACTIVE_REVIEW_ONLY",
    };
    return pkg;
  });
}

export async function generateLogicPuzzleQuestionStudioBatchV6(request: LogicPuzzleQuestionStudioRequest = {}) {
  const batch: any = await generateLogicPuzzleQuestionStudioBatchV5(request);
  const qls = new Set<string>(batch.questions?.map((question: any) => question.patternId) ?? []);
  const language = String(batch.generationContext?.language ?? request.language ?? "en").toLowerCase();
  const localized = language === "hi" || language === "pa" || language === "hindi" || language === "punjabi" || language === "panjabi";
  let freezeAuthority: string | null = null;
  if (localized && [...qls].some((id) => /^LP-QL-04[1-4]$/u.test(id))) freezeAuthority = LP_011_HI_PA_LOCALIZATION_FREEZE_V1.authorityId;
  if (localized && [...qls].some((id) => /^LP-QL-04[5-6]$/u.test(id))) freezeAuthority = LP_006_PROJECTION_HI_PA_LOCALIZATION_FREEZE_V1.authorityId;
  if (!freezeAuthority) return batch;

  const questions = batch.questions.map((question: any) => ({
    ...question,
    traceability: { ...question.traceability, localizationFreezeAuthorityId: freezeAuthority },
    metadata: { ...question.metadata, localizationAuthorityId: freezeAuthority },
  }));
  return {
    ...batch,
    generationContext: {
      ...batch.generationContext,
      localizationFreezeStatus: "FROZEN_V1",
      localizationAuthorityId: freezeAuthority,
      runtimeMode: "REVIEW_ONLY",
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
    questionPackages: questions,
    questions,
  };
}
