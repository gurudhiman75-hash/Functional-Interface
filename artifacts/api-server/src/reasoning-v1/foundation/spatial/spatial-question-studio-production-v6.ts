import {
  generateSpatialProductionStudioQuestionV5,
  type SpatialProductionStudioQuestionV5,
} from "./spatial-question-studio-production-v5";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V6,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  SPATIAL_QUESTION_STUDIO_QLS_V6,
  type SpatialQuestionStudioChapterCodeV6,
  type SpatialQuestionStudioDifficultyV6,
  type SpatialQuestionStudioPermanentQlIdV6,
} from "./spatial-question-studio-integration-v6";
import {
  generateFigureFormationQuestionStudioV1,
  type FigureFormationQuestionStudioQuestionV1,
  type FigureFormationLanguageV1,
} from "./figure-formation-question-studio-v1";
import type { FigureFormationPermanentQlIdV10 } from "./spatial-permanent-ql-allocation-v10";
import type { SpatialQuestionStudioLanguageV1 } from "./spatial-question-studio-localization-v1";

const FFM_QL_IDS = new Set<string>(["SPA-QL-051", "SPA-QL-052", "SPA-QL-053"]);

export function isFigureFormationQuestionStudioQlIdV6(qlId: string): qlId is FigureFormationPermanentQlIdV10 {
  return FFM_QL_IDS.has(qlId);
}

type WithCurrentIntegrationAuthority<T> = Omit<T, "integrationAuthority"> & {
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V6.integrationAuthority;
};

export type SpatialProductionStudioQuestionV6 =
  | WithCurrentIntegrationAuthority<SpatialProductionStudioQuestionV5>
  | (FigureFormationQuestionStudioQuestionV1 & {
      integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V6.integrationAuthority;
    });

export interface SpatialProductionStudioBatchRequestV6 {
  seed: string;
  count?: number;
  qlId?: SpatialQuestionStudioPermanentQlIdV6;
  chapterCode?: SpatialQuestionStudioChapterCodeV6;
  difficulty?: SpatialQuestionStudioDifficultyV6;
  language?: SpatialQuestionStudioLanguageV1;
}

export function generateSpatialProductionStudioQuestionV6(input: Readonly<{
  qlId: SpatialQuestionStudioPermanentQlIdV6;
  seed: string;
  language?: SpatialQuestionStudioLanguageV1;
}>): SpatialProductionStudioQuestionV6 {
  const language = input.language ?? "en";
  if (isFigureFormationQuestionStudioQlIdV6(input.qlId)) {
    const current = generateFigureFormationQuestionStudioV1({
      qlId: input.qlId,
      seed: input.seed,
      language: language as FigureFormationLanguageV1,
    });
    return Object.freeze({
      ...current,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V6.integrationAuthority,
    });
  }

  const legacy = generateSpatialProductionStudioQuestionV5({
    qlId: input.qlId as Parameters<typeof generateSpatialProductionStudioQuestionV5>[0]["qlId"],
    seed: input.seed,
    language,
  });
  return Object.freeze({
    ...legacy,
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V6.integrationAuthority,
  }) as WithCurrentIntegrationAuthority<SpatialProductionStudioQuestionV5>;
}

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function eligibleQls(request: SpatialProductionStudioBatchRequestV6) {
  let qls = [...SPATIAL_QUESTION_STUDIO_QLS_V6];
  if (request.qlId) qls = qls.filter((entry) => entry.permanentQlId === request.qlId);
  if (request.chapterCode) qls = qls.filter((entry) => entry.chapterCode === request.chapterCode);
  if (request.difficulty) qls = qls.filter((entry) => entry.difficulty === request.difficulty);
  if (!qls.length) throw new Error("No SPA-001 production QLs match the requested filters.");
  return qls;
}

export function generateSpatialProductionStudioBatchV6(request: SpatialProductionStudioBatchRequestV6) {
  const seed = String(request.seed ?? "").trim();
  if (!seed) throw new Error("Spatial Question Studio batch generation requires an explicit seed.");
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const language = request.language ?? "en";
  const qls = eligibleQls(request)
    .map((entry) => ({ entry, score: hash32(`${seed}:${entry.permanentQlId}:order`) }))
    .sort((left, right) => left.score - right.score || left.entry.permanentQlId.localeCompare(right.entry.permanentQlId))
    .map(({ entry }) => entry);

  const questions: SpatialProductionStudioQuestionV6[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < count; index += 1) {
    const ql = qls[index % qls.length]!;
    let accepted: SpatialProductionStudioQuestionV6 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const question = generateSpatialProductionStudioQuestionV6({
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
      packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V6.packageId,
      generationDomain: SPATIAL_QUESTION_STUDIO_PACKAGE_V6.generationDomain,
      seed,
      count,
      language,
      locale: language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V6.integrationAuthority,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED" as const,
      persistenceAllowed: true as const,
      questionBankStatus: "READY_FOR_STORAGE" as const,
      questionBankWritable: true as const,
      questionBankAcceptanceMode: "FULL_RELEASE" as const,
      testEligibility: "ELIGIBLE" as const,
      testEligible: true as const,
      testBuilderEligible: true as const,
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

export const generateSpatialProductionStudioBatchV1 = generateSpatialProductionStudioBatchV6;
export const generateSpatialProductionStudioQuestionV1 = generateSpatialProductionStudioQuestionV6;
export type SpatialProductionStudioQuestionV1 = SpatialProductionStudioQuestionV6;
