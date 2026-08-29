import {
  generateSpatialProductionStudioQuestionV3,
  type SpatialProductionStudioQuestionV3,
} from "./spatial-question-studio-production-v3";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V4,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  type SpatialQuestionStudioChapterCodeV4,
  type SpatialQuestionStudioDifficultyV4,
  type SpatialQuestionStudioPermanentQlIdV4,
} from "./spatial-question-studio-integration-v4";
import { spatialQuestionStudioDifficultyV1 } from "./spatial-question-studio-integration-v1";
import {
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V6,
  type CountingFiguresPermanentQlIdV6,
} from "./spatial-permanent-ql-allocation-v6";
import {
  generateCountingFiguresQuestionStudioSeededV1,
  type CountingFiguresQuestionStudioQuestionV1,
} from "./counting-figures-question-studio-seeded-runtime-v1";
import { FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 } from "./counting-figures-question-studio-product-owner-approval-v1";
import type { SpatialQuestionStudioLanguageV1 } from "./spatial-question-studio-localization-v1";

export function isSpatialCountingFiguresQuestionStudioQlIdV4(
  qlId: string,
): qlId is CountingFiguresPermanentQlIdV6 {
  return qlId === "SPA-QL-042";
}

type StandardLifecycleV4 = {
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
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority;
};

export type SpatialCountingFiguresProductionStudioQuestionV4 =
  Omit<CountingFiguresQuestionStudioQuestionV1, "lifecycle"> & {
    mode: "SYSTEMATIC_CLOSED_FIGURE_ENUMERATION";
    questionId: string;
    integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority;
    lifecycle: StandardLifecycleV4;
  };

export type SpatialProductionStudioQuestionV4 =
  | WithCurrentIntegrationAuthority<SpatialProductionStudioQuestionV3>
  | SpatialCountingFiguresProductionStudioQuestionV4;

export interface SpatialProductionStudioBatchRequestV4 {
  seed: string;
  count?: number;
  qlId?: SpatialQuestionStudioPermanentQlIdV4;
  chapterCode?: SpatialQuestionStudioChapterCodeV4;
  difficulty?: SpatialQuestionStudioDifficultyV4;
  language?: SpatialQuestionStudioLanguageV1;
}

function standardLifecycleV4(): StandardLifecycleV4 {
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

function generateCountingFiguresProductionQuestionV4(input: {
  qlId: CountingFiguresPermanentQlIdV6;
  seed: string;
  language: SpatialQuestionStudioLanguageV1;
}): SpatialCountingFiguresProductionStudioQuestionV4 {
  if (!FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.governance.questionStudioIntegrationApproved) {
    throw new Error("FCT-001 production adapter requires product-owner Question Studio approval.");
  }
  if (input.qlId !== "SPA-QL-042") {
    throw new Error(`Unsupported FCT-001 permanent QL '${input.qlId}'.`);
  }
  const base = generateCountingFiguresQuestionStudioSeededV1({
    seed: input.seed,
    language: input.language,
  });
  return {
    ...base,
    mode: "SYSTEMATIC_CLOSED_FIGURE_ENUMERATION",
    questionId: `fct-001:${base.questionLanguageId}`,
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority,
    lifecycle: standardLifecycleV4(),
  };
}

export function generateSpatialProductionStudioQuestionV4(input: {
  qlId: SpatialQuestionStudioPermanentQlIdV4;
  seed: string;
  language?: SpatialQuestionStudioLanguageV1;
}): SpatialProductionStudioQuestionV4 {
  const language = input.language ?? "en";
  if (isSpatialCountingFiguresQuestionStudioQlIdV4(input.qlId)) {
    return generateCountingFiguresProductionQuestionV4({
      qlId: input.qlId,
      seed: input.seed,
      language,
    });
  }
  const legacy = generateSpatialProductionStudioQuestionV3({
    qlId: input.qlId as Parameters<typeof generateSpatialProductionStudioQuestionV3>[0]["qlId"],
    seed: input.seed,
    language,
  });
  return {
    ...legacy,
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority,
  } as WithCurrentIntegrationAuthority<SpatialProductionStudioQuestionV3>;
}

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function eligibleAllocations(request: SpatialProductionStudioBatchRequestV4) {
  let allocations = [...SPATIAL_PERMANENT_QL_ALLOCATIONS_V6];
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

export function generateSpatialProductionStudioBatchV4(request: SpatialProductionStudioBatchRequestV4) {
  const seed = String(request.seed ?? "").trim();
  if (!seed) throw new Error("Spatial Question Studio batch generation requires an explicit seed.");
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const language = request.language ?? "en";
  const allocations = eligibleAllocations(request)
    .map((entry) => ({ entry, score: hash32(`${seed}:${entry.permanentQlId}:order`) }))
    .sort((left, right) => left.score - right.score || left.entry.permanentQlId.localeCompare(right.entry.permanentQlId))
    .map(({ entry }) => entry);
  const questions: SpatialProductionStudioQuestionV4[] = [];
  const seen = new Set<string>();

  for (let index = 0; index < count; index += 1) {
    const allocation = allocations[index % allocations.length]!;
    let accepted: SpatialProductionStudioQuestionV4 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const question = generateSpatialProductionStudioQuestionV4({
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
      packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V4.packageId,
      generationDomain: SPATIAL_QUESTION_STUDIO_PACKAGE_V4.generationDomain,
      seed,
      count,
      language,
      locale: language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority,
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

export const generateSpatialProductionStudioBatchV1 = generateSpatialProductionStudioBatchV4;
export const generateSpatialProductionStudioQuestionV1 = generateSpatialProductionStudioQuestionV4;
export type SpatialProductionStudioQuestionV1 = SpatialProductionStudioQuestionV4;
