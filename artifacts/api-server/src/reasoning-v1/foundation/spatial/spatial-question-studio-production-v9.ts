import {
  generateSpatialProductionStudioQuestionV8,
  type SpatialProductionStudioQuestionV8,
} from "./spatial-question-studio-production-v8";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V9,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  SPATIAL_QUESTION_STUDIO_QLS_V9,
  type SpatialQuestionStudioChapterCodeV9,
  type SpatialQuestionStudioDifficultyV9,
  type SpatialQuestionStudioPermanentQlIdV9,
} from "./spatial-question-studio-integration-v9";
import {
  generateIdenticalFigureQuestionStudioV1,
  type IdenticalFigureQuestionStudioV1,
} from "./identical-figure-question-studio-v1";
import { IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1 } from "./identical-figure-freeze-v1";
import type { SpatialQuestionStudioLanguageV1 } from "./spatial-question-studio-localization-v1";

const IDF_QL_IDS = new Set<string>(["SPA-QL-061", "SPA-QL-062", "SPA-QL-063"]);

export function isIdenticalFigureQuestionStudioQlIdV9(qlId: string): qlId is
  | "SPA-QL-061" | "SPA-QL-062" | "SPA-QL-063" {
  return IDF_QL_IDS.has(qlId);
}

type IdfProductionQuestionV9 = IdenticalFigureQuestionStudioV1 & Readonly<{
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V9.integrationAuthority;
}>;

type PriorProductionQuestionV9 = Omit<SpatialProductionStudioQuestionV8, "integrationAuthority"> & Readonly<{
  integrationAuthority: typeof SPATIAL_QUESTION_STUDIO_PACKAGE_V9.integrationAuthority;
}>;

export type SpatialProductionStudioQuestionV9 = PriorProductionQuestionV9 | IdfProductionQuestionV9;

export interface SpatialProductionStudioBatchRequestV9 {
  seed: string;
  count?: number;
  qlId?: SpatialQuestionStudioPermanentQlIdV9;
  chapterCode?: SpatialQuestionStudioChapterCodeV9;
  difficulty?: SpatialQuestionStudioDifficultyV9;
  language?: SpatialQuestionStudioLanguageV1;
}

function idfLifecycle() {
  return Object.freeze({
    ...IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1,
    registrationStatus: "REGISTERED" as const,
    releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
  });
}

export function generateSpatialProductionStudioQuestionV9(input: Readonly<{
  qlId: SpatialQuestionStudioPermanentQlIdV9;
  seed: string;
  language?: SpatialQuestionStudioLanguageV1;
}>): SpatialProductionStudioQuestionV9 {
  const language = input.language ?? "en";

  if (isIdenticalFigureQuestionStudioQlIdV9(input.qlId)) {
    const approved = generateIdenticalFigureQuestionStudioV1({
      qlId: input.qlId,
      seed: input.seed,
      language,
    });
    return Object.freeze({
      ...approved,
      lifecycle: idfLifecycle(),
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.integrationAuthority,
    }) as IdfProductionQuestionV9;
  }

  const prior = generateSpatialProductionStudioQuestionV8({
    qlId: input.qlId as Parameters<typeof generateSpatialProductionStudioQuestionV8>[0]["qlId"],
    seed: input.seed,
    language,
  });
  return Object.freeze({
    ...prior,
    integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.integrationAuthority,
  }) as PriorProductionQuestionV9;
}

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function eligibleQls(request: SpatialProductionStudioBatchRequestV9) {
  let qls = [...SPATIAL_QUESTION_STUDIO_QLS_V9];
  if (request.qlId) qls = qls.filter((entry) => entry.permanentQlId === request.qlId);
  if (request.chapterCode) qls = qls.filter((entry) => entry.chapterCode === request.chapterCode);
  if (request.difficulty) qls = qls.filter((entry) => entry.difficulty === request.difficulty);
  if (!qls.length) throw new Error("No SPA-001 production QLs match the requested filters.");
  return qls;
}

export function generateSpatialProductionStudioBatchV9(request: SpatialProductionStudioBatchRequestV9) {
  const seed = String(request.seed ?? "").trim();
  if (!seed) throw new Error("Spatial Question Studio batch generation requires an explicit seed.");
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const language = request.language ?? "en";
  const qls = eligibleQls(request)
    .map((entry) => ({ entry, score: hash32(`${seed}:${entry.permanentQlId}:order`) }))
    .sort((left, right) => left.score - right.score || left.entry.permanentQlId.localeCompare(right.entry.permanentQlId))
    .map(({ entry }) => entry);

  const questions: SpatialProductionStudioQuestionV9[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < count; index += 1) {
    const ql = qls[index % qls.length]!;
    let accepted: SpatialProductionStudioQuestionV9 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const question = generateSpatialProductionStudioQuestionV9({
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
      packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.packageId,
      generationDomain: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.generationDomain,
      seed,
      count,
      language,
      locale: language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.integrationAuthority,
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

export const generateSpatialProductionStudioBatchV1 = generateSpatialProductionStudioBatchV9;
export const generateSpatialProductionStudioQuestionV1 = generateSpatialProductionStudioQuestionV9;
export type SpatialProductionStudioQuestionV1 = SpatialProductionStudioQuestionV9;
