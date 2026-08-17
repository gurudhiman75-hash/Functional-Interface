export type SapCp009FrozenQlId = `SAP-QL-${string}`;

export interface SapCp009FrozenRegistryEntry {
  readonly permanentQlId: SapCp009FrozenQlId;
  readonly packageId: "SAP-002";
  readonly checkpointId: "SAP-CP-009";
  readonly title: string;
  readonly sourceHead: string;
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly englishStatus: "ENGLISH_PRODUCT_OWNER_FREEZE_APPROVED";
  readonly allocationApproval: "PRODUCT_OWNER_APPROVED_CP009_2026_08_13";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

const SOURCE_HEAD = "e5878e942da5dc02920be85d2aa56a10825ef1bf";

const TITLES = [
  "Rounded product estimate",
  "Decimal product estimate",
  "Compatible quotient estimate",
  "Approximate percentage of a quantity",
  "Approximate one quantity as a percentage of another",
  "Percentage-factor product estimate",
  "Product-quotient chain estimate",
  "Coordinated ratio scaling",
  "Cancellation before approximation",
  "Reciprocal-product estimate",
  "Missing approximate factor",
  "Missing approximate divisor",
  "Nearest option for a product or quotient",
  "Compare approximate ratios",
  "Positive product bounds",
  "Positive quotient bounds",
  "Decimal-scale diagnosis",
  "Unsafe ratio-substitution diagnosis",
  "Product overestimate or underestimate classification",
] as const;

export const SAP_CP009_FROZEN_REGISTRY_ENTRIES: readonly SapCp009FrozenRegistryEntry[] = Object.freeze(
  TITLES.map((title, index) => Object.freeze({
    permanentQlId: `SAP-QL-${String(147 + index).padStart(3, "0")}` as SapCp009FrozenQlId,
    packageId: "SAP-002" as const,
    checkpointId: "SAP-CP-009" as const,
    title,
    sourceHead: SOURCE_HEAD,
    allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
    englishStatus: "ENGLISH_PRODUCT_OWNER_FREEZE_APPROVED" as const,
    allocationApproval: "PRODUCT_OWNER_APPROVED_CP009_2026_08_13" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  })),
);

export const SAP_CP009_PRODUCT_OWNER_FREEZE = Object.freeze({
  checkpointId: "SAP-CP-009" as const,
  sourceHead: SOURCE_HEAD,
  reviewVersion: "CP009-EXAM-STANDARD-V3" as const,
  allocatedRange: "SAP-QL-147..SAP-QL-165" as const,
  allocatedCount: SAP_CP009_FROZEN_REGISTRY_ENTRIES.length,
  nextAvailableId: "SAP-QL-166" as const,
  activeQlCount: 0,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
  mergeAuthorization: false,
});
