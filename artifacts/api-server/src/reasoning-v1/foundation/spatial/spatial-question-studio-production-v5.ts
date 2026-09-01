import {
  generateSpatialProductionStudioQuestionV4,
  type SpatialProductionStudioQuestionV4,
} from "./spatial-question-studio-production-v4";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V5,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  SPATIAL_QUESTION_STUDIO_QLS_V5,
  type SpatialQuestionStudioChapterCodeV5,
  type SpatialQuestionStudioDifficultyV5,
  type SpatialQuestionStudioPermanentQlIdV5,
} from "./spatial-question-studio-integration-v5";
import {
  generateSpatialFinalHeldGapQuestionStudioV1,
  type SpatialFinalHeldGapQuestionStudioQuestionV1,
} from "./spatial-final-held-gap-question-studio-v1";
import type { SpatialFinalHeldGapQlIdV1 } from "./spatial-final-held-gap-review-runtime-v1";
import type { SpatialQuestionStudioLanguageV1 } from "./spatial-question-studio-localization-v1";

const FINAL_HELD_GAP_QL_IDS = new Set<string>(["SPA-QL-048", "SPA-QL-049", "SPA-QL-050"]);

export function isSpatialFinalHeldGapQuestionStudioQlIdV5(qlId: string): qlId is SpatialFinalHeldGapQlIdV1 {
  return FINAL_HELD_GAP_QL_IDS.has(qlId);
}

type WithCurrentIntegrationAuthority<T> = Omit<T, "integrationAuthority"> & {
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V5.integrationAuthority;
};

export type SpatialProductionStudioQuestionV5 =
  | WithCurrentIntegrationAuthority<SpatialProductionStudioQuestionV4>
  | (SpatialFinalHeldGapQuestionStudioQuestionV1 & {
      integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V5.integrationAuthority;
    });

export interface SpatialProductionStudioBatchRequestV5 {
  seed: string;
  count?: number;
  qlId?: SpatialQuestionStudioPermanentQlIdV5;
  chapterCode?: SpatialQuestionStudioChapterCodeV5;
  difficulty?: SpatialQuestionStudioDifficultyV5;
  language?: SpatialQuestionStudioLanguageV1;
}

export function generateSpatialProductionStudioQuestionV5(input: Readonly<{
  qlId: SpatialQuestionStudioPermanentQlIdV5;
  seed: string;
  language?: SpatialQuestionStudioLanguageV1;
}>): SpatialProductionStudioQuestionV5 {
  const language = input.language ?? "en";
  if (isSpatialFinalHeldGapQuestionStudioQlIdV5(input.qlId)) {
    const current = generateSpatialFinalHeldGapQuestionStudioV1({
      qlId: input.qlId,
      seed: input.seed,
      language,
    });
    return Object.freeze({
      ...current,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.integrationAuthority,
    });
  }

  const legacy = generateSpatialProductionStudioQuestionV4({
    qlId: input.qlId as Parameters<typeof generateSpatialProductionStudioQuestionV4>[0]["qlId"],
    seed: input.seed,
    language,
  });
  return Object.freeze({
    ...legacy,
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.integrationAuthority,
  }) as WithCurrentIntegrationAuthority<SpatialProductionStudioQuestionV4>;
}

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function eligibleQls(request: SpatialProductionStudioBatchRequestV5) {
  let qls = [...SPATIAL_QUESTION_STUDIO_QLS_V5];
  if (request.qlId) qls = qls.filter((entry) => entry.permanentQlId === request.qlId);
  if (request.chapterCode) qls = qls.filter((entry) => entry.chapterCode === request.chapterCode);
  if (request.difficulty) qls = qls.filter((entry) => entry.difficulty === request.difficulty);
  if (!qls.length) throw new Error("No SPA-001 production QLs match the requested filters.");
  return qls;
}

export function generateSpatialProductionStudioBatchV5(request: SpatialProductionStudioBatchRequestV5) {
  const seed = String(request.seed ?? "").trim();
  if (!seed) throw new Error("Spatial Question Studio batch generation requires an explicit seed.");
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const language = request.language ?? "en";
  const qls = eligibleQls(request)
    .map((entry) => ({ entry, score: hash32(`${seed}:${entry.permanentQlId}:order`) }))
    .sort((left, right) => left.score - right.score || left.entry.permanentQlId.localeCompare(right.entry.permanentQlId))
    .map(({ entry }) => entry);

  const questions: SpatialProductionStudioQuestionV5[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < count; index += 1) {
    const ql = qls[index % qls.length]!;
    let accepted: SpatialProductionStudioQuestionV5 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const question = generateSpatialProductionStudioQuestionV5({
        qlId: ql.permanentQlId,
        seed: `${seed}:${index}:R${retry}`,
        language,
      });
      if (seen.has(question.contentFingerprint)) continue;
      seen.add(question.contentFingerprint);
      accepted = question;
    }
    if (!accepted) throw new Error(`${ql.permanentQlId}: unable to produce a unique batch item at index ${index}.`);
    questions.push(accepted);
  }

  return Object.freeze({
    generationContext: Object.freeze({
      packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.packageId,
      generationDomain: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.generationDomain,
      seed,
      count,
      language,
      locale: language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.integrationAuthority,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED" as const,
      persistenceAllowed: true as const,
      questionBankStatus: "READY_FOR_STORAGE" as const,
      questionBankWritable: true as const,
      questionBankAcceptanceMode: "FULL_RELEASE" as const,
      testEligibility: "ELIGIBLE" as const,
      testEligible: true as const,
      testBuilderEligible: true as const,
      // Mixed package uses the strictest aggregate delivery capability.
      mockTestEligible: false as const,
      publiclyPublishable: true as const,
      publicReleaseAuthorized: false as const,
      studentDeliveryAuthorized: false as const,
      manualApprovalRequired: true as const,
      automaticStudentPublication: false as const,
    }),
    questions: Object.freeze(questions),
  });
}

export const generateSpatialProductionStudioBatchV1 = generateSpatialProductionStudioBatchV5;
export const generateSpatialProductionStudioQuestionV1 = generateSpatialProductionStudioQuestionV5;
export type SpatialProductionStudioQuestionV1 = SpatialProductionStudioQuestionV5;
