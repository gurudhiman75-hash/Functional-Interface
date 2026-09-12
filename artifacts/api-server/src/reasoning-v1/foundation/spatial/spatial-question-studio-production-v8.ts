import {
  generateSpatialProductionStudioQuestionV7,
  type SpatialProductionStudioQuestionV7,
} from "./spatial-question-studio-production-v7";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V8,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  SPATIAL_QUESTION_STUDIO_QLS_V8,
  type SpatialQuestionStudioChapterCodeV8,
  type SpatialQuestionStudioDifficultyV8,
  type SpatialQuestionStudioPermanentQlIdV8,
} from "./spatial-question-studio-integration-v8";
import {
  generateFigureMatrixQuestionStudioV1,
  type FigureMatrixQuestionStudioV1,
} from "./figure-matrix-question-studio-v1";
import { FIGURE_MATRIX_INTERNAL_ACTIVATION_V1 } from "./figure-matrix-freeze-v1";
import type { SpatialQuestionStudioLanguageV1 } from "./spatial-question-studio-localization-v1";

const FMT_QL_IDS = new Set<string>([
  "SPA-QL-055", "SPA-QL-056", "SPA-QL-057", "SPA-QL-058", "SPA-QL-059", "SPA-QL-060",
]);

export function isFigureMatrixQuestionStudioQlIdV8(qlId: string): qlId is
  | "SPA-QL-055" | "SPA-QL-056" | "SPA-QL-057" | "SPA-QL-058" | "SPA-QL-059" | "SPA-QL-060" {
  return FMT_QL_IDS.has(qlId);
}

type FmtProductionQuestionV8 = FigureMatrixQuestionStudioV1 & Readonly<{
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V8.integrationAuthority;
}>;

type PriorProductionQuestionV8 = Omit<SpatialProductionStudioQuestionV7, "integrationAuthority"> & Readonly<{
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V8.integrationAuthority;
}>;

export type SpatialProductionStudioQuestionV8 = PriorProductionQuestionV8 | FmtProductionQuestionV8;

export interface SpatialProductionStudioBatchRequestV8 {
  seed: string;
  count?: number;
  qlId?: SpatialQuestionStudioPermanentQlIdV8;
  chapterCode?: SpatialQuestionStudioChapterCodeV8;
  difficulty?: SpatialQuestionStudioDifficultyV8;
  language?: SpatialQuestionStudioLanguageV1;
}

function fmtLifecycle() {
  return Object.freeze({
    ...FIGURE_MATRIX_INTERNAL_ACTIVATION_V1,
    registrationStatus: "REGISTERED" as const,
    releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
  });
}

export function generateSpatialProductionStudioQuestionV8(input: Readonly<{
  qlId: SpatialQuestionStudioPermanentQlIdV8;
  seed: string;
  language?: SpatialQuestionStudioLanguageV1;
}>): SpatialProductionStudioQuestionV8 {
  const language = input.language ?? "en";

  if (isFigureMatrixQuestionStudioQlIdV8(input.qlId)) {
    const approved = generateFigureMatrixQuestionStudioV1({
      qlId: input.qlId,
      seed: input.seed,
      language,
    });
    return Object.freeze({
      ...approved,
      lifecycle: fmtLifecycle(),
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V8.integrationAuthority,
    }) as FmtProductionQuestionV8;
  }

  const prior = generateSpatialProductionStudioQuestionV7({
    qlId: input.qlId as Parameters<typeof generateSpatialProductionStudioQuestionV7>[0]["qlId"],
    seed: input.seed,
    language,
  });
  return Object.freeze({
    ...prior,
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V8.integrationAuthority,
  }) as PriorProductionQuestionV8;
}

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function eligibleQls(request: SpatialProductionStudioBatchRequestV8) {
  let qls = [...SPATIAL_QUESTION_STUDIO_QLS_V8];
  if (request.qlId) qls = qls.filter((entry) => entry.permanentQlId === request.qlId);
  if (request.chapterCode) qls = qls.filter((entry) => entry.chapterCode === request.chapterCode);
  if (request.difficulty) qls = qls.filter((entry) => entry.difficulty === request.difficulty);
  if (!qls.length) throw new Error("No SPA-001 production QLs match the requested filters.");
  return qls;
}

export function generateSpatialProductionStudioBatchV8(request: SpatialProductionStudioBatchRequestV8) {
  const seed = String(request.seed ?? "").trim();
  if (!seed) throw new Error("Spatial Question Studio batch generation requires an explicit seed.");
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const language = request.language ?? "en";
  const qls = eligibleQls(request)
    .map((entry) => ({ entry, score: hash32(`${seed}:${entry.permanentQlId}:order`) }))
    .sort((left, right) => left.score - right.score || left.entry.permanentQlId.localeCompare(right.entry.permanentQlId))
    .map(({ entry }) => entry);

  const questions: SpatialProductionStudioQuestionV8[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < count; index += 1) {
    const ql = qls[index % qls.length]!;
    let accepted: SpatialProductionStudioQuestionV8 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const question = generateSpatialProductionStudioQuestionV8({
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
      packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V8.packageId,
      generationDomain: SPATIAL_QUESTION_STUDIO_PACKAGE_V8.generationDomain,
      seed,
      count,
      language,
      locale: language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V8.integrationAuthority,
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

export const generateSpatialProductionStudioBatchV1 = generateSpatialProductionStudioBatchV8;
export const generateSpatialProductionStudioQuestionV1 = generateSpatialProductionStudioQuestionV8;
export type SpatialProductionStudioQuestionV1 = SpatialProductionStudioQuestionV8;
