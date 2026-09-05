import {
  generateSpatialProductionStudioQuestionV6,
  type SpatialProductionStudioQuestionV6,
} from "./spatial-question-studio-production-v6";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V7,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  SPATIAL_QUESTION_STUDIO_QLS_V7,
  type SpatialQuestionStudioChapterCodeV7,
  type SpatialQuestionStudioDifficultyV7,
  type SpatialQuestionStudioPermanentQlIdV7,
} from "./spatial-question-studio-integration-v7";
import { generateDotSituationQuestionStudioV1 } from "./dot-situation-question-studio-v1";
import { DOT_SITUATION_INTERNAL_ACTIVATION_V1 } from "./dot-situation-freeze-v1";
import type { SpatialQuestionStudioLanguageV1 } from "./spatial-question-studio-localization-v1";

const DOT_QL_IDS = new Set<string>(["SPA-QL-054"]);

export function isDotSituationQuestionStudioQlIdV7(qlId: string): qlId is "SPA-QL-054" {
  return DOT_QL_IDS.has(qlId);
}

type DotProductionQuestionV7 = ReturnType<typeof generateDotSituationQuestionStudioV1> & {
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V7.integrationAuthority;
};

type LegacyProductionQuestionV7 = Omit<SpatialProductionStudioQuestionV6, "integrationAuthority"> & {
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V7.integrationAuthority;
};

export type SpatialProductionStudioQuestionV7 = LegacyProductionQuestionV7 | DotProductionQuestionV7;

export interface SpatialProductionStudioBatchRequestV7 {
  seed: string;
  count?: number;
  qlId?: SpatialQuestionStudioPermanentQlIdV7;
  chapterCode?: SpatialQuestionStudioChapterCodeV7;
  difficulty?: SpatialQuestionStudioDifficultyV7;
  language?: SpatialQuestionStudioLanguageV1;
}

function dotLifecycle() {
  return Object.freeze({
    ...DOT_SITUATION_INTERNAL_ACTIVATION_V1,
    registrationStatus: "REGISTERED" as const,
    releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
  });
}

export function generateSpatialProductionStudioQuestionV7(input: Readonly<{
  qlId: SpatialQuestionStudioPermanentQlIdV7;
  seed: string;
  language?: SpatialQuestionStudioLanguageV1;
}>): SpatialProductionStudioQuestionV7 {
  const language = input.language ?? "en";
  if (isDotSituationQuestionStudioQlIdV7(input.qlId)) {
    const approved = generateDotSituationQuestionStudioV1({
      qlId: input.qlId,
      seed: input.seed,
      language,
    });
    return Object.freeze({
      ...approved,
      lifecycle: dotLifecycle(),
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V7.integrationAuthority,
    }) as DotProductionQuestionV7;
  }

  const legacy = generateSpatialProductionStudioQuestionV6({
    qlId: input.qlId as Parameters<typeof generateSpatialProductionStudioQuestionV6>[0]["qlId"],
    seed: input.seed,
    language,
  });
  return Object.freeze({
    ...legacy,
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V7.integrationAuthority,
  }) as LegacyProductionQuestionV7;
}

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function eligibleQls(request: SpatialProductionStudioBatchRequestV7) {
  let qls = [...SPATIAL_QUESTION_STUDIO_QLS_V7];
  if (request.qlId) qls = qls.filter((entry) => entry.permanentQlId === request.qlId);
  if (request.chapterCode) qls = qls.filter((entry) => entry.chapterCode === request.chapterCode);
  if (request.difficulty) qls = qls.filter((entry) => entry.difficulty === request.difficulty);
  if (!qls.length) throw new Error("No SPA-001 production QLs match the requested filters.");
  return qls;
}

export function generateSpatialProductionStudioBatchV7(request: SpatialProductionStudioBatchRequestV7) {
  const seed = String(request.seed ?? "").trim();
  if (!seed) throw new Error("Spatial Question Studio batch generation requires an explicit seed.");
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const language = request.language ?? "en";
  const qls = eligibleQls(request)
    .map((entry) => ({ entry, score: hash32(`${seed}:${entry.permanentQlId}:order`) }))
    .sort((left, right) => left.score - right.score || left.entry.permanentQlId.localeCompare(right.entry.permanentQlId))
    .map(({ entry }) => entry);

  const questions: SpatialProductionStudioQuestionV7[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < count; index += 1) {
    const ql = qls[index % qls.length]!;
    let accepted: SpatialProductionStudioQuestionV7 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const question = generateSpatialProductionStudioQuestionV7({
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
      packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V7.packageId,
      generationDomain: SPATIAL_QUESTION_STUDIO_PACKAGE_V7.generationDomain,
      seed,
      count,
      language,
      locale: language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V7.integrationAuthority,
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

export const generateSpatialProductionStudioBatchV1 = generateSpatialProductionStudioBatchV7;
export const generateSpatialProductionStudioQuestionV1 = generateSpatialProductionStudioQuestionV7;
export type SpatialProductionStudioQuestionV1 = SpatialProductionStudioQuestionV7;
