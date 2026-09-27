import type { ReasoningNoveltyAxisV1 } from "./reasoning-novelty-governance-v1";

export const REASONING_V1_NOVELTY_PROVIDER_REGISTRY_VERSION =
  "REASONING_V1_NOVELTY_PROVIDER_REGISTRY_2026_09_26_V1" as const;

export type ReasoningNoveltyProviderStatusV1 =
  | "APPROVED_RUNTIME"
  | "DISCOVERY_REVIEW_ONLY";

export interface ReasoningNoveltyProviderDescriptorV1 {
  readonly providerId: string;
  readonly chapterId: string;
  readonly topicDirectory: string;
  readonly status: ReasoningNoveltyProviderStatusV1;
  readonly parentQlIds: readonly string[];
  readonly noveltyAxes: readonly ReasoningNoveltyAxisV1[];
  readonly generatorModule: string;
  readonly generatorExport: string;
  readonly supportedLanguages: readonly ("en" | "hi" | "pa")[];
  readonly permanentQlAllocationRequired: false;
  readonly questionStudioNoveltyMixActivated: boolean;
  readonly humanReviewRequired: boolean;
  readonly countsTowardAssemblyNoveltyNow: boolean;
}

export const REASONING_V1_NOVELTY_PROVIDERS_V1: readonly ReasoningNoveltyProviderDescriptorV1[] = [
  {
    providerId: "PFC-001-CONTROLLED-NOVEL",
    chapterId: "PFC-001",
    topicDirectory: "Non-Verbal-Reasoning",
    status: "APPROVED_RUNTIME",
    parentQlIds: [],
    noveltyAxes: [
      "REPRESENTATION_LOGIC",
      "CONSTRAINT_INTERACTION",
    ],
    generatorModule: "../foundation/spatial/paper-folding-content-innovation-envelope-v1",
    generatorExport: "PAPER_FOLDING_CONTENT_INNOVATION_ENVELOPE_V1",
    supportedLanguages: ["en"],
    permanentQlAllocationRequired: false,
    questionStudioNoveltyMixActivated: true,
    humanReviewRequired: false,
    countsTowardAssemblyNoveltyNow: true,
  },
  {
    providerId: "OPS-001-INFER-THEN-FILL",
    chapterId: "OPS-001",
    topicDirectory: "Mathematical-Operations",
    status: "DISCOVERY_REVIEW_ONLY",
    parentQlIds: ["OPS-QL-008", "OPS-QL-028"],
    noveltyAxes: [
      "MULTI_STAGE_COMPOSITION",
      "INFORMATION_DISTRIBUTION",
      "QUERY_DIRECTION",
      "VALID_CROSS_FAMILY_COMPOSITION",
    ],
    generatorModule: "../topics/Mathematical-Operations/OPS-001/ops-001-controlled-novelty-discovery-v1",
    generatorExport: "generateOpsControlledNovelInferThenFillCandidateV1",
    supportedLanguages: ["en"],
    permanentQlAllocationRequired: false,
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
    countsTowardAssemblyNoveltyNow: false,
  },
  {
    providerId: "RNK-001-CROSS-FAMILY-CASELET",
    chapterId: "RNK-001",
    topicDirectory: "Ranking-and-Order",
    status: "DISCOVERY_REVIEW_ONLY",
    parentQlIds: [
      "RNK-QL-027", "RNK-QL-028", "RNK-QL-029",
      "RNK-QL-031", "RNK-QL-032", "RNK-QL-033",
    ],
    noveltyAxes: [
      "CONSTRAINT_INTERACTION",
      "INFORMATION_DISTRIBUTION",
      "VALID_CROSS_FAMILY_COMPOSITION",
    ],
    generatorModule: "../topics/Ranking-and-Order/RNK-001/rnk-001-controlled-novelty-discovery-v1",
    generatorExport: "generateRnkControlledNovelCaseletV1",
    supportedLanguages: ["en"],
    permanentQlAllocationRequired: false,
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
    countsTowardAssemblyNoveltyNow: false,
  },
  {
    providerId: "CLK-001-FAULTY-TIME-ANGLE",
    chapterId: "CLK-001",
    topicDirectory: "Clocks",
    status: "DISCOVERY_REVIEW_ONLY",
    parentQlIds: ["CLK-QL-003", "CLK-QL-010"],
    noveltyAxes: [
      "MULTI_STAGE_COMPOSITION",
      "VALID_CROSS_FAMILY_COMPOSITION",
      "INFORMATION_DISTRIBUTION",
    ],
    generatorModule: "../topics/Clocks/CLK-001/clk-001-controlled-novelty-discovery-v1",
    generatorExport: "generateClockControlledNovelAngleCandidateV1",
    supportedLanguages: ["en"],
    permanentQlAllocationRequired: false,
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
    countsTowardAssemblyNoveltyNow: false,
  },
  {
    providerId: "CAE-001-EDGE-FAMILIES",
    chapterId: "CAE-001",
    topicDirectory: "Cause-and-Effect",
    status: "DISCOVERY_REVIEW_ONLY",
    parentQlIds: ["CAE-QL-008", "CAE-QL-009"],
    noveltyAxes: [
      "RELATION_STRUCTURE",
      "QUERY_DIRECTION",
      "INFORMATION_DISTRIBUTION",
      "MULTI_STAGE_COMPOSITION",
    ],
    generatorModule: "../topics/Cause-and-Effect/CAE-001/cae-001-controlled-novelty-discovery-v1",
    generatorExport: "generateCaeControlledNovelCandidateV1",
    supportedLanguages: ["en", "hi", "pa"],
    permanentQlAllocationRequired: false,
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
    countsTowardAssemblyNoveltyNow: false,
  },
  {
    providerId: "DIR-001-GRAPH-RELATIVE-PATH",
    chapterId: "DIR-001",
    topicDirectory: "Direction-Sense",
    status: "DISCOVERY_REVIEW_ONLY",
    parentQlIds: ["DIR-QL-004", "DIR-QL-041"],
    noveltyAxes: [
      "MULTI_STAGE_COMPOSITION",
      "VALID_CROSS_FAMILY_COMPOSITION",
      "REPRESENTATION_LOGIC",
      "INFORMATION_DISTRIBUTION",
    ],
    generatorModule: "../topics/Direction-Sense/DIR-001/dir-001-controlled-novelty-discovery-v1",
    generatorExport: "generateDirControlledNovelGraphRelativePathCandidateV1",
    supportedLanguages: ["en"],
    permanentQlAllocationRequired: false,
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
    countsTowardAssemblyNoveltyNow: false,
  },
  {
    providerId: "CAL-001-IMPLICIT-RANGE-FREQUENCY",
    chapterId: "CAL-001",
    topicDirectory: "Calendar",
    status: "DISCOVERY_REVIEW_ONLY",
    parentQlIds: ["CAL-QL-005", "CAL-QL-035"],
    noveltyAxes: [
      "INFORMATION_DISTRIBUTION",
      "MULTI_STAGE_COMPOSITION",
      "VALID_CROSS_FAMILY_COMPOSITION",
      "BOUNDARY_CONDITION",
    ],
    generatorModule: "../topics/Calendar/CAL-001/cal-001-controlled-novelty-discovery-v1",
    generatorExport: "generateCalControlledNovelImplicitRangeFrequencyCandidateV1",
    supportedLanguages: ["en"],
    permanentQlAllocationRequired: false,
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
    countsTowardAssemblyNoveltyNow: false,
  },
  {
    providerId: "BLR-001-CODED-FILTERED-COUNT",
    chapterId: "BLR-001",
    topicDirectory: "Blood-Relations",
    status: "DISCOVERY_REVIEW_ONLY",
    parentQlIds: ["BLR-QL-013", "BLR-QL-026"],
    noveltyAxes: [
      "MULTI_STAGE_COMPOSITION",
      "VALID_CROSS_FAMILY_COMPOSITION",
      "INFORMATION_DISTRIBUTION",
      "QUERY_DIRECTION",
    ],
    generatorModule: "../topics/Blood-Relations/BLR-001/blr-001-controlled-novelty-discovery-v1",
    generatorExport: "generateBlrControlledNovelCodedCountCandidateV1",
    supportedLanguages: ["en"],
    permanentQlAllocationRequired: false,
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
    countsTowardAssemblyNoveltyNow: false,
  },
] as const;

export function reasoningNoveltyProviderByIdV1(
  providerId: string,
): ReasoningNoveltyProviderDescriptorV1 {
  const provider = REASONING_V1_NOVELTY_PROVIDERS_V1.find(
    (entry) => entry.providerId === providerId,
  );
  if (!provider) throw new Error("Unknown Reasoning V1 novelty provider: " + providerId);
  return provider;
}

export function reasoningNoveltyProviderSummaryV1() {
  const approved = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
    (entry) => entry.status === "APPROVED_RUNTIME",
  );
  const reviewOnly = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
    (entry) => entry.status === "DISCOVERY_REVIEW_ONLY",
  );
  return {
    version: REASONING_V1_NOVELTY_PROVIDER_REGISTRY_VERSION,
    providerCount: REASONING_V1_NOVELTY_PROVIDERS_V1.length,
    approvedProviderIds: approved.map((entry) => entry.providerId),
    reviewOnlyProviderIds: reviewOnly.map((entry) => entry.providerId),
    assemblyCreditedProviderIds: REASONING_V1_NOVELTY_PROVIDERS_V1
      .filter((entry) => entry.countsTowardAssemblyNoveltyNow)
      .map((entry) => entry.providerId),
  } as const;
}
