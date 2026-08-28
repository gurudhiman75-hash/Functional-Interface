import {
  generateSpatialProductionStudioQuestionV2,
  type SpatialProductionStudioQuestionV2,
} from "./spatial-question-studio-production-v2";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V3,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  type SpatialQuestionStudioChapterCodeV3,
  type SpatialQuestionStudioDifficultyV3,
  type SpatialQuestionStudioPermanentQlIdV3,
} from "./spatial-question-studio-integration-v3";
import { spatialQuestionStudioDifficultyV1 } from "./spatial-question-studio-integration-v1";
import {
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V5,
  type EmbeddedFigurePermanentQlIdV5,
} from "./spatial-permanent-ql-allocation-v5";
import {
  generateEmbeddedFigureQuestionStudioSeededV1,
  type EmbeddedFigureQuestionStudioQuestionV1,
} from "./embedded-figure-question-studio-seeded-runtime-v1";
import { EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 } from "./embedded-figure-question-studio-product-owner-approval-v1";
import type { SpatialQuestionStudioLanguageV1 } from "./spatial-question-studio-localization-v1";

export function isSpatialEmbeddedFigureQuestionStudioQlIdV3(
  qlId: string,
): qlId is EmbeddedFigurePermanentQlIdV5 {
  return qlId === "SPA-QL-041";
}

type StandardLifecycleV3 = {
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

type WithCurrentIntegrationAuthority<T> = Omit<T, "integrationAuthority"> & {
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V3.integrationAuthority;
};

export type SpatialEmbeddedFigureProductionStudioQuestionV3 =
  Omit<EmbeddedFigureQuestionStudioQuestionV1, "lifecycle"> & {
    mode: "FIXED_ORIENTATION_EMBEDDED_SUBGRAPH";
    questionId: string;
    integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V3.integrationAuthority;
    lifecycle: StandardLifecycleV3;
  };

export type SpatialProductionStudioQuestionV3 =
  | WithCurrentIntegrationAuthority<SpatialProductionStudioQuestionV2>
  | SpatialEmbeddedFigureProductionStudioQuestionV3;

export interface SpatialProductionStudioBatchRequestV3 {
  seed: string;
  count?: number;
  qlId?: SpatialQuestionStudioPermanentQlIdV3;
  chapterCode?: SpatialQuestionStudioChapterCodeV3;
  difficulty?: SpatialQuestionStudioDifficultyV3;
  language?: SpatialQuestionStudioLanguageV1;
}

function standardLifecycleV3(): StandardLifecycleV3 {
  return {
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
  };
}

function generateEmbeddedFigureProductionQuestionV3(input: {
  qlId: EmbeddedFigurePermanentQlIdV5;
  seed: string;
  language: SpatialQuestionStudioLanguageV1;
}): SpatialEmbeddedFigureProductionStudioQuestionV3 {
  if (!EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.governance.questionStudioIntegrationApproved) {
    throw new Error("EMB-001 production adapter requires product-owner Question Studio approval.");
  }
  if (input.qlId !== "SPA-QL-041") {
    throw new Error(`Unsupported EMB-001 permanent QL '${input.qlId}'.`);
  }
  const base = generateEmbeddedFigureQuestionStudioSeededV1({
    seed: input.seed,
    language: input.language,
  });
  return {
    ...base,
    mode: "FIXED_ORIENTATION_EMBEDDED_SUBGRAPH",
    questionId: `emb-001:${base.questionLanguageId}`,
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V3.integrationAuthority,
    lifecycle: standardLifecycleV3(),
  };
}

export function generateSpatialProductionStudioQuestionV3(input: {
  qlId: SpatialQuestionStudioPermanentQlIdV3;
  seed: string;
  language?: SpatialQuestionStudioLanguageV1;
}): SpatialProductionStudioQuestionV3 {
  const language = input.language ?? "en";
  if (isSpatialEmbeddedFigureQuestionStudioQlIdV3(input.qlId)) {
    return generateEmbeddedFigureProductionQuestionV3({
      qlId: input.qlId,
      seed: input.seed,
      language,
    });
  }
  const legacy = generateSpatialProductionStudioQuestionV2({
    qlId: input.qlId as Parameters<typeof generateSpatialProductionStudioQuestionV2>[0]["qlId"],
    seed: input.seed,
    language,
  });
  return {
    ...legacy,
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V3.integrationAuthority,
  } as WithCurrentIntegrationAuthority<SpatialProductionStudioQuestionV2>;
}

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function eligibleAllocations(request: SpatialProductionStudioBatchRequestV3) {
  let allocations = [...SPATIAL_PERMANENT_QL_ALLOCATIONS_V5];
  if (request.qlId) allocations = allocations.filter((entry) => entry.permanentQlId === request.qlId);
  if (request.chapterCode) allocations = allocations.filter((entry) => entry.chapterCode === request.chapterCode);
  if (request.difficulty) {
    allocations = allocations.filter(
      (entry) => spatialQuestionStudioDifficultyV1(entry.baseDifficulty) === request.difficulty,
    );
  }
  if (!allocations.length) throw new Error("No permanent Spatial QLs match the requested filters.");
  return allocations;
}

export function generateSpatialProductionStudioBatchV3(request: SpatialProductionStudioBatchRequestV3) {
  const seed = String(request.seed ?? "").trim();
  if (!seed) throw new Error("Spatial Question Studio batch generation requires an explicit seed.");
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const language = request.language ?? "en";
  const allocations = eligibleAllocations(request)
    .map((entry) => ({ entry, score: hash32(`${seed}:${entry.permanentQlId}:order`) }))
    .sort((left, right) => left.score - right.score || left.entry.permanentQlId.localeCompare(right.entry.permanentQlId))
    .map(({ entry }) => entry);
  const questions: SpatialProductionStudioQuestionV3[] = [];
  const seen = new Set<string>();

  for (let index = 0; index < count; index += 1) {
    const allocation = allocations[index % allocations.length]!;
    let accepted: SpatialProductionStudioQuestionV3 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const question = generateSpatialProductionStudioQuestionV3({
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
      packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V3.packageId,
      generationDomain: SPATIAL_QUESTION_STUDIO_PACKAGE_V3.generationDomain,
      seed,
      count,
      language,
      locale: language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V3.integrationAuthority,
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

export const generateSpatialProductionStudioBatchV1 = generateSpatialProductionStudioBatchV3;
export const generateSpatialProductionStudioQuestionV1 = generateSpatialProductionStudioQuestionV3;
export type SpatialProductionStudioQuestionV1 = SpatialProductionStudioQuestionV3;
