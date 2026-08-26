import {
  generateEmbeddedFigureWholeOptionConnectivityQuestionV1,
  type EmbeddedWholeOptionConnectivityQuestionV1,
} from "./embedded-figure-whole-option-connectivity-remediation-v1";
import {
  SPATIAL_EMBEDDED_FIGURE_PERMANENT_QL_ALLOCATIONS_V5,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5,
} from "./spatial-permanent-ql-allocation-v5";
import { EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1 } from "./embedded-figure-product-owner-approval-v1";

export type EmbeddedFigurePermanentEnglishQuestionV1 = Readonly<
  Omit<EmbeddedWholeOptionConnectivityQuestionV1, "qlStatus" | "lifecycle"> & {
    permanentQlId: "SPA-QL-041";
    permanentQlTitle: "Embedded figure identification without rotation";
    language: "en";
    locale: "en-IN";
    qlStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME";
    allocationAuthorityId: typeof SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.authorityId;
    runtimeAuthorityId: "EMB-001-PERMANENT-ENGLISH-RUNTIME-V1";
    lifecycle: Readonly<{
      permanentQlAllocated: true;
      englishRuntimeImplemented: true;
      englishImplementationFrozen: false;
      questionStudioRegistered: false;
      questionBankWritable: false;
      testEligible: false;
      publiclyPublishable: false;
      automaticStudentPublication: false;
    }>;
  }
>;

export const EMBEDDED_FIGURE_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1 = Object.freeze({
  authorityId: "EMB-001-PERMANENT-ENGLISH-RUNTIME-V1" as const,
  chapterCode: "EMB-001" as const,
  proposalId: "EMB-PROP-01" as const,
  permanentQlId: "SPA-QL-041" as const,
  permanentQlTitle: "Embedded figure identification without rotation" as const,
  allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.authorityId,
  productOwnerApprovalAuthorityId: EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  sourceRuntimeAuthorityId: "EMB-001-WHOLE-OPTION-CONNECTIVITY-REMEDIATION-V1" as const,
  learnerReviewAuthorityId: EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1.approvedLearnerReviewAuthorityId,
  equivalencePolicy: "FIXED_ORIENTATION" as const,
  language: "en" as const,
  locale: "en-IN" as const,
  representationPolicy: "DENSITY_SCALE_CROSSINGS_AND_MOTIF_ARE_PARAMETERS_NOT_QLS" as const,
  runtimeStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME_IMPLEMENTED_NOT_YET_FROZEN" as const,
  governance: {
    englishRuntimeImplemented: true,
    englishImplementationFrozen: false,
    localizationGenerationAllowed: false,
    questionStudioRegistrationAuthorized: false,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    mergeAuthorized: false,
    deploymentAuthorized: false,
  },
  nextGate: "EMB_001_PERMANENT_ENGLISH_RUNTIME_V1_EXACT_HEAD_CI_THEN_ENGLISH_FREEZE" as const,
} as const);

const allocation = SPATIAL_EMBEDDED_FIGURE_PERMANENT_QL_ALLOCATIONS_V5[0];
if (allocation.permanentQlId !== "SPA-QL-041" || allocation.proposalId !== "EMB-PROP-01") {
  throw new Error("EMB-001 permanent English runtime is not pinned to SPA-QL-041 / EMB-PROP-01.");
}
if (!EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1.authorization.englishFreezeAllowed) {
  throw new Error("EMB-001 product-owner authority does not allow English freeze progression.");
}

export function generateEmbeddedFigurePermanentEnglishQuestionV1(seed: string): EmbeddedFigurePermanentEnglishQuestionV1 {
  const source = generateEmbeddedFigureWholeOptionConnectivityQuestionV1(seed);
  if (source.chapterCode !== "EMB-001" || source.proposalId !== "EMB-PROP-01") {
    throw new Error(`EMB permanent runtime source trace mismatch for seed ${seed}.`);
  }
  if (source.equivalencePolicy !== "FIXED_ORIENTATION") {
    throw new Error(`EMB permanent runtime policy mismatch for seed ${seed}.`);
  }
  return Object.freeze({
    ...source,
    permanentQlId: "SPA-QL-041",
    permanentQlTitle: "Embedded figure identification without rotation",
    language: "en",
    locale: "en-IN",
    qlStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME",
    allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.authorityId,
    runtimeAuthorityId: EMBEDDED_FIGURE_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.authorityId,
    lifecycle: Object.freeze({
      permanentQlAllocated: true,
      englishRuntimeImplemented: true,
      englishImplementationFrozen: false,
      questionStudioRegistered: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    }),
  });
}

export function generateEmbeddedFigurePermanentEnglishBatchV1(input: Readonly<{ seed: string; count: number }>): readonly EmbeddedFigurePermanentEnglishQuestionV1[] {
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 50) {
    throw new Error("EMB-001 permanent English batch count must be an integer from 1 to 50.");
  }
  const questions: EmbeddedFigurePermanentEnglishQuestionV1[] = [];
  const geometryFingerprints = new Set<string>();
  for (let index = 0; index < input.count; index += 1) {
    let accepted: EmbeddedFigurePermanentEnglishQuestionV1 | null = null;
    for (let retry = 0; retry < 30; retry += 1) {
      const candidate = generateEmbeddedFigurePermanentEnglishQuestionV1(`${input.seed}:${index}:${retry}`);
      if (!geometryFingerprints.has(candidate.geometryFingerprint)) {
        accepted = candidate;
        break;
      }
    }
    if (!accepted) throw new Error(`EMB-001 permanent English batch could not produce geometry-unique item at index ${index}.`);
    geometryFingerprints.add(accepted.geometryFingerprint);
    questions.push(accepted);
  }
  return Object.freeze(questions);
}
