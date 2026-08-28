import {
  generateSpatialProductionStudioQuestionV1 as generateLegacySpatialProductionStudioQuestionV1,
  type SpatialProductionStudioQuestionV1 as LegacySpatialProductionStudioQuestionV1,
} from "./spatial-question-studio-production-v1";
import {
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  spatialQuestionStudioDifficultyV1,
} from "./spatial-question-studio-integration-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V2,
  type SpatialQuestionStudioChapterCodeV2,
  type SpatialQuestionStudioDifficultyV2,
  type SpatialQuestionStudioPermanentQlIdV2,
} from "./spatial-question-studio-integration-v2";
import {
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V4,
  type PfcTpfPermanentQlIdV4,
} from "./spatial-permanent-ql-allocation-v4";
import {
  generatePfcTpfStudioQuestionV1,
  type PfcTpfStudioQuestionV1,
} from "./paper-folding-question-studio-seeded-runtime-v1";
import { applyPfcTpfStudioEditorialV1_1 } from "./paper-folding-question-studio-editorial-v1-1";
import { remediatePfcTpfStudioQuestionDirectionV1 } from "./paper-folding-question-studio-visual-direction-remediation-v1";
import { PFC_TPF_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 } from "./paper-folding-question-studio-product-owner-approval-v1";
import type { SpatialQuestionStudioLanguageV1 } from "./spatial-question-studio-localization-v1";

const PFC_TPF_QL_IDS = new Set<string>([
  "SPA-QL-035",
  "SPA-QL-036",
  "SPA-QL-037",
  "SPA-QL-038",
  "SPA-QL-039",
  "SPA-QL-040",
]);

export function isSpatialPfcTpfQuestionStudioQlIdV2(qlId: string): qlId is PfcTpfPermanentQlIdV4 {
  return PFC_TPF_QL_IDS.has(qlId);
}

type StandardLifecycleV2 = {
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
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V2.integrationAuthority;
};

export type SpatialPfcTpfProductionStudioQuestionV2 = Omit<PfcTpfStudioQuestionV1, "lifecycle" | "integrationAuthority"> & {
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V2.integrationAuthority;
  lifecycle: StandardLifecycleV2;
};

export type SpatialProductionStudioQuestionV2 =
  | WithCurrentIntegrationAuthority<LegacySpatialProductionStudioQuestionV1>
  | SpatialPfcTpfProductionStudioQuestionV2;

export interface SpatialProductionStudioBatchRequestV2 {
  seed: string;
  count?: number;
  qlId?: SpatialQuestionStudioPermanentQlIdV2;
  chapterCode?: SpatialQuestionStudioChapterCodeV2;
  difficulty?: SpatialQuestionStudioDifficultyV2;
  language?: SpatialQuestionStudioLanguageV1;
}

function standardLifecycleV2(): StandardLifecycleV2 {
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

function generatePfcTpfProductionQuestionV2(input: {
  qlId: PfcTpfPermanentQlIdV4;
  seed: string;
  language: SpatialQuestionStudioLanguageV1;
}): SpatialPfcTpfProductionStudioQuestionV2 {
  if (!PFC_TPF_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.governance.questionStudioIntegrationApproved) {
    throw new Error("PFC/TPF production adapter requires product-owner approval.");
  }
  const base = generatePfcTpfStudioQuestionV1(input);
  const editorial = applyPfcTpfStudioEditorialV1_1(base);
  const remediated = remediatePfcTpfStudioQuestionDirectionV1(editorial);
  return {
    ...remediated,
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V2.integrationAuthority,
    lifecycle: standardLifecycleV2(),
  };
}

export function generateSpatialProductionStudioQuestionV2(input: {
  qlId: SpatialQuestionStudioPermanentQlIdV2;
  seed: string;
  language?: SpatialQuestionStudioLanguageV1;
}): SpatialProductionStudioQuestionV2 {
  const language = input.language ?? "en";
  if (isSpatialPfcTpfQuestionStudioQlIdV2(input.qlId)) {
    return generatePfcTpfProductionQuestionV2({ qlId: input.qlId, seed: input.seed, language });
  }
  const legacy = generateLegacySpatialProductionStudioQuestionV1({
    qlId: input.qlId as Parameters<typeof generateLegacySpatialProductionStudioQuestionV1>[0]["qlId"],
    seed: input.seed,
    language,
  });
  return {
    ...legacy,
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V2.integrationAuthority,
  };
}

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function eligibleAllocations(request: SpatialProductionStudioBatchRequestV2) {
  let allocations = [...SPATIAL_PERMANENT_QL_ALLOCATIONS_V4];
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

export function generateSpatialProductionStudioBatchV2(request: SpatialProductionStudioBatchRequestV2) {
  const seed = String(request.seed ?? "").trim();
  if (!seed) throw new Error("Spatial Question Studio batch generation requires an explicit seed.");
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const language = request.language ?? "en";
  const allocations = eligibleAllocations(request)
    .map((entry) => ({ entry, score: hash32(`${seed}:${entry.permanentQlId}:order`) }))
    .sort((left, right) => left.score - right.score || left.entry.permanentQlId.localeCompare(right.entry.permanentQlId))
    .map(({ entry }) => entry);
  const questions: SpatialProductionStudioQuestionV2[] = [];
  const seen = new Set<string>();

  for (let index = 0; index < count; index += 1) {
    const allocation = allocations[index % allocations.length]!;
    let accepted: SpatialProductionStudioQuestionV2 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const question = generateSpatialProductionStudioQuestionV2({
        qlId: allocation.permanentQlId,
        seed: `${seed}:${index}:R${retry}`,
        language,
      });
      if (seen.has(question.contentFingerprint)) continue;
      seen.add(question.contentFingerprint);
      accepted = question;
    }
    if (!accepted) throw new Error(`${allocation.permanentQlId}: unable to produce a unique batch item at index ${index}.`);
    questions.push(accepted);
  }

  return {
    generationContext: {
      packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V2.packageId,
      generationDomain: SPATIAL_QUESTION_STUDIO_PACKAGE_V2.generationDomain,
      seed,
      count,
      language,
      locale: language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V2.integrationAuthority,
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

// Route-compatible aliases let the existing admin route switch to V2 by module path only.
export const generateSpatialProductionStudioBatchV1 = generateSpatialProductionStudioBatchV2;
export const generateSpatialProductionStudioQuestionV1 = generateSpatialProductionStudioQuestionV2;
export type SpatialProductionStudioQuestionV1 = SpatialProductionStudioQuestionV2;
