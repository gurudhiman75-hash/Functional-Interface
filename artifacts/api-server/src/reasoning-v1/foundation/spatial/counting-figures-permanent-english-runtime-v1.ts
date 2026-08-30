import {
  FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2,
  generateCountingFigureCandidateV2,
  type CountingFigureCandidateQuestionV2,
} from "./counting-figures-production-generator-v2";
import {
  SPATIAL_COUNTING_FIGURES_PERMANENT_QL_ALLOCATIONS_V6,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6,
} from "./spatial-permanent-ql-allocation-v6";
import { FCT_001_PRODUCT_OWNER_APPROVAL_V1 } from "./counting-figures-product-owner-approval-v1";
import type { CountingFigureTargetShapeV1 } from "./counting-figures-production-generator-v1";
import {
  countingFigureExamGeometryFingerprintV1,
  renderCountingFigureExamSvgV1,
} from "./counting-figures-exam-renderer-v1";

export type CountingFiguresPermanentEnglishQuestionV1 = Readonly<
  CountingFigureCandidateQuestionV2 & {
    permanentQlId: "SPA-QL-042";
    permanentQlTitle: "Systematic counting of closed figures";
    language: "en";
    locale: "en-IN";
    qlStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME";
    allocationAuthorityId: typeof SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.authorityId;
    runtimeAuthorityId: "FCT-001-PERMANENT-ENGLISH-RUNTIME-V1";
    lifecycle: Readonly<{
      permanentQlAllocated: true;
      englishRuntimeImplemented: true;
      englishImplementationFrozen: false;
      questionStudioRegistered: false;
      persistenceAllowed: false;
      questionBankWritable: false;
      testEligible: false;
      publiclyPublishable: false;
      automaticStudentPublication: false;
    }>;
  }
>;

export const FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1 = Object.freeze({
  authorityId: "FCT-001-PERMANENT-ENGLISH-RUNTIME-V1" as const,
  chapterCode: "FCT-001" as const,
  candidateId: "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION" as const,
  permanentQlId: "SPA-QL-042" as const,
  permanentQlTitle: "Systematic counting of closed figures" as const,
  allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.authorityId,
  productOwnerApprovalAuthorityId: FCT_001_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  sourceRuntimeAuthorityId: FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.authorityId,
  equivalencePolicy: "TARGET_SHAPE_PARAMETERIZED" as const,
  language: "en" as const,
  locale: "en-IN" as const,
  representationPolicy: "TARGET_SHAPE_LAYOUT_MOTIF_DENSITY_AND_ROTATION_ARE_PARAMETERS_NOT_QLS" as const,
  runtimeStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME_IMPLEMENTED_NOT_YET_FROZEN" as const,
  governance: {
    englishRuntimeImplemented: true,
    englishImplementationFrozen: false,
    localizationGenerationAllowed: false,
    questionStudioRegistrationAuthorized: false,
    persistenceAllowed: false,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    mergeAuthorized: false,
    deploymentAuthorized: false,
  },
  nextGate: "FCT_001_PERMANENT_ENGLISH_RUNTIME_V1_EXACT_HEAD_CI_THEN_ENGLISH_FREEZE" as const,
} as const);

const allocation = SPATIAL_COUNTING_FIGURES_PERMANENT_QL_ALLOCATIONS_V6[0];
if (
  allocation.permanentQlId !== "SPA-QL-042" ||
  allocation.proposalId !== "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION"
) {
  throw new Error("FCT-001 permanent English runtime is not pinned to SPA-QL-042 / FCT closed-polygon enumeration.");
}
if (!FCT_001_PRODUCT_OWNER_APPROVAL_V1.authorization.englishRuntimeImplementationAllowed) {
  throw new Error("FCT-001 product-owner authority does not allow permanent English runtime implementation.");
}

export function generateCountingFiguresPermanentEnglishQuestionV1(input: Readonly<{
  seed: string;
  targetShape?: CountingFigureTargetShapeV1;
}>): CountingFiguresPermanentEnglishQuestionV1 {
  const source = generateCountingFigureCandidateV2(input);
  if (
    source.chapterCode !== "FCT-001" ||
    source.candidateId !== "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION" ||
    source.authority !== FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.authorityId
  ) {
    throw new Error(`FCT permanent English runtime source trace mismatch for seed ${input.seed}.`);
  }
  return Object.freeze({
    ...source,
    svg: renderCountingFigureExamSvgV1(source.graph, source.motifFamily),
    geometryFingerprint: countingFigureExamGeometryFingerprintV1(source.graph, source.motifFamily),
    permanentQlId: "SPA-QL-042",
    permanentQlTitle: "Systematic counting of closed figures",
    language: "en",
    locale: "en-IN",
    qlStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME",
    allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.authorityId,
    runtimeAuthorityId: FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.authorityId,
    lifecycle: Object.freeze({
      permanentQlAllocated: true,
      englishRuntimeImplemented: true,
      englishImplementationFrozen: false,
      questionStudioRegistered: false,
      persistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    }),
  });
}

export function generateCountingFiguresPermanentEnglishBatchV1(input: Readonly<{
  seed: string;
  count: number;
  targetShape?: CountingFigureTargetShapeV1;
}>): readonly CountingFiguresPermanentEnglishQuestionV1[] {
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 50) {
    throw new Error("FCT-001 permanent English batch count must be an integer from 1 to 50.");
  }
  const questions: CountingFiguresPermanentEnglishQuestionV1[] = [];
  const geometryFingerprints = new Set<string>();
  for (let index = 0; index < input.count; index += 1) {
    let accepted: CountingFiguresPermanentEnglishQuestionV1 | null = null;
    for (let retry = 0; retry < 30; retry += 1) {
      const candidate = generateCountingFiguresPermanentEnglishQuestionV1({
        seed: `${input.seed}:${index}:${retry}`,
        targetShape: input.targetShape,
      });
      if (!geometryFingerprints.has(candidate.geometryFingerprint)) {
        accepted = candidate;
        break;
      }
    }
    if (!accepted) {
      throw new Error(`FCT-001 permanent English batch could not produce display-geometry-unique item at index ${index}.`);
    }
    geometryFingerprints.add(accepted.geometryFingerprint);
    questions.push(accepted);
  }
  return Object.freeze(questions);
}
