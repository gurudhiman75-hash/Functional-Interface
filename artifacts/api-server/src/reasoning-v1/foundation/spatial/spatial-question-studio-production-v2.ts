import {
  generateSpatialProductionStudioQuestionV1 as generateLegacySpatialProductionStudioQuestionV1,
  type SpatialProductionStudioQuestionV1 as LegacySpatialProductionStudioQuestionV1,
} from "./spatial-question-studio-production-v1";
import {
  generateSpatialPfcStudioQuestionV1,
  isSpatialPfcQuestionStudioQlIdV1,
  type SpatialPfcStudioQuestionV1,
} from "./spatial-question-studio-pfc-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  spatialQuestionStudioDifficultyV1,
  type SpatialQuestionStudioChapterCodeV1,
  type SpatialQuestionStudioDifficultyV1,
  type SpatialQuestionStudioPermanentQlIdV1,
} from "./spatial-question-studio-integration-v1";
import type { SpatialQuestionStudioLanguageV1 } from "./spatial-question-studio-localization-v1";
import { SPATIAL_PERMANENT_QL_ALLOCATIONS_V3 } from "./spatial-permanent-ql-allocation-v3";

type ProductionLifecycleV2 = {
  questionStudioDiscoverable: true;
  registrationStatus: "REGISTERED";
  persistenceAllowed: true;
  questionBankStatus: "READY_FOR_STORAGE";
  testEligibility: "ELIGIBLE";
  testEligible: true;
  publiclyPublishable: true;
  mockTestEligible: true;
  manualApprovalRequired: true;
  automaticStudentPublication: false;
  releaseAuthority: typeof SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority;
};

type PromotedPfcQuestionV2 = Omit<SpatialPfcStudioQuestionV1, "lifecycle"> & {
  lifecycle: ProductionLifecycleV2;
};

export type SpatialProductionStudioQuestionV1 =
  | LegacySpatialProductionStudioQuestionV1
  | PromotedPfcQuestionV2;

export interface SpatialProductionStudioBatchRequestV1 {
  seed: string;
  count?: number;
  qlId?: SpatialQuestionStudioPermanentQlIdV1;
  chapterCode?: SpatialQuestionStudioChapterCodeV1;
  difficulty?: SpatialQuestionStudioDifficultyV1;
  language?: SpatialQuestionStudioLanguageV1;
}

function promotePfc(question: SpatialPfcStudioQuestionV1): PromotedPfcQuestionV2 {
  const { lifecycle: _reviewLifecycle, ...content } = question;
  return {
    ...content,
    lifecycle: {
      questionStudioDiscoverable: true,
      registrationStatus: "REGISTERED",
      persistenceAllowed: true,
      questionBankStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
      testEligibility: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
      testEligible: true,
      publiclyPublishable: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
      mockTestEligible: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
      manualApprovalRequired: true,
      automaticStudentPublication: false,
      releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
    },
  };
}

export function generateSpatialProductionStudioQuestionV1(input: {
  qlId: SpatialQuestionStudioPermanentQlIdV1;
  seed: string;
  language?: SpatialQuestionStudioLanguageV1;
}): SpatialProductionStudioQuestionV1 {
  if (isSpatialPfcQuestionStudioQlIdV1(input.qlId)) {
    return promotePfc(generateSpatialPfcStudioQuestionV1({
      qlId: input.qlId,
      seed: input.seed,
      language: input.language ?? "en",
    }));
  }
  return generateLegacySpatialProductionStudioQuestionV1({
    qlId: input.qlId as Exclude<SpatialQuestionStudioPermanentQlIdV1, "SPA-QL-035" | "SPA-QL-036" | "SPA-QL-037" | "SPA-QL-038">,
    seed: input.seed,
    language: input.language,
  });
}

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function eligibleAllocations(request: SpatialProductionStudioBatchRequestV1) {
  let allocations = [...SPATIAL_PERMANENT_QL_ALLOCATIONS_V3];
  if (request.qlId) {
    allocations = allocations.filter((entry) => entry.permanentQlId === request.qlId);
  }
  if (request.chapterCode) {
    allocations = allocations.filter((entry) => entry.chapterCode === request.chapterCode);
  }
  if (request.difficulty) {
    allocations = allocations.filter(
      (entry) => spatialQuestionStudioDifficultyV1(entry.baseDifficulty) === request.difficulty,
    );
  }
  if (!allocations.length) throw new Error("No permanent Spatial QLs match the requested filters.");
  return allocations;
}

export function generateSpatialProductionStudioBatchV1(
  request: SpatialProductionStudioBatchRequestV1,
) {
  const seed = String(request.seed ?? "").trim();
  if (!seed) throw new Error("Spatial Question Studio batch generation requires an explicit seed.");
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const language = request.language ?? "en";
  const allocations = eligibleAllocations(request)
    .map((entry) => ({ entry, score: hash32(`${seed}:${entry.permanentQlId}:order`) }))
    .sort((left, right) => left.score - right.score || left.entry.permanentQlId.localeCompare(right.entry.permanentQlId))
    .map(({ entry }) => entry);
  const questions: SpatialProductionStudioQuestionV1[] = [];
  const seen = new Set<string>();

  for (let index = 0; index < count; index += 1) {
    const allocation = allocations[index % allocations.length]!;
    let accepted: SpatialProductionStudioQuestionV1 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const question = generateSpatialProductionStudioQuestionV1({
        qlId: allocation.permanentQlId,
        seed: `${seed}:${index}:R${retry}`,
        language,
      });
      if (seen.has(question.contentFingerprint)) continue;
      seen.add(question.contentFingerprint);
      accepted = question;
    }
    if (!accepted) {
      throw new Error(`${allocation.permanentQlId}: unable to produce a unique batch item at index ${index}.`);
    }
    questions.push(accepted);
  }

  return {
    generationContext: {
      packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId,
      generationDomain: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.generationDomain,
      seed,
      count,
      language,
      locale: language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
      localizationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.localizationAuthority,
      fgcLocalizationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.fgcLocalizationAuthority,
      pfcLocalizationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.pfcLocalizationAuthority,
      releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED" as const,
      persistenceAllowed: true as const,
      questionBankStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
      testEligibility: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
      testEligible: true as const,
      publiclyPublishable: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
      mockTestEligible: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
      manualApprovalRequired: true as const,
      automaticStudentPublication: false as const,
    },
    questions,
  } as const;
}
