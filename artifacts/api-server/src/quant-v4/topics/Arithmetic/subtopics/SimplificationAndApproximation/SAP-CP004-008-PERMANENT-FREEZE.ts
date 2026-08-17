export type SapCp004008CheckpointId =
  | "SAP-CP-004"
  | "SAP-CP-005"
  | "SAP-CP-006"
  | "SAP-CP-007"
  | "SAP-CP-008";

export type SapCp004008PackageId = "SAP-001" | "SAP-002";
export type SapCp004008FrozenQlId = `SAP-QL-${string}`;
export type SapCp004008FrozenTemplateId = `SAP-CP00${4 | 5 | 6 | 7 | 8}-FROZEN-AUTHORITY-${string}`;

export interface SapCp004008FrozenRegistryEntry {
  readonly permanentQlId: SapCp004008FrozenQlId;
  readonly packageId: SapCp004008PackageId;
  readonly checkpointId: SapCp004008CheckpointId;
  readonly templateId: SapCp004008FrozenTemplateId;
  readonly title: string;
  readonly solveAuthority: string;
  readonly answerSemantic: string;
  readonly taskDirections: readonly string[];
  readonly representations: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly englishStatus: "ENGLISH_PRODUCT_OWNER_FREEZE_APPROVED";
  readonly allocationApproval: "PRODUCT_OWNER_APPROVED_CP004_CP008_2026_08_12";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

const CP004_TITLES = [
  "Small numeric powers in mixed arithmetic",
  "Zero and one exponent evaluation",
  "Negative numeric base and exponent parity",
  "Powers of exact fractions",
  "Perfect square roots",
  "Perfect cube roots",
  "Bounded exact nth roots",
  "Exact roots of fractions",
  "Exact root followed by mixed arithmetic",
  "Exact power-root cancellation",
  "Bounded nested perfect roots",
  "Small factorial evaluation",
  "Bounded factorial ratios",
  "Factorials in mixed expressions",
  "Missing exponent from bounded candidates",
  "Missing perfect radicand",
  "Comparison of exact power and root expressions",
  "First incorrect power or root step",
  "First incorrect factorial step",
] as const;

const CP005_TITLES = [
  "Multi-fraction product chain",
  "Factor extraction before cancellation",
  "Ratio of products",
  "Consecutive-product ratio",
  "Long factorial ratio",
  "Product of reciprocals",
  "Difference of squares",
  "Numeric conjugate product",
  "Nested reciprocal chain",
  "Bounded telescoping sum",
  "Bounded telescoping product",
  "Product of 1 ± 1/n factors",
  "Missing factor from cancellation state",
  "Illegal cancellation diagnosis",
  "Common factor before multiplication",
  "Repeated common-factor blocks",
  "Symmetric fraction pair",
  "Repeated-block compression",
  "Best first cancellation step",
  "Raw versus structural route",
] as const;

const CP006_TITLES = [
  "Missing mixed addend",
  "Missing mixed factor",
  "Missing mixed divisor",
  "Missing bracket value",
  "Missing decimal in mixed equality",
  "Composed missing exponent",
  "Compare exact expressions",
  "Order mixed exact values",
  "Equivalent exact expression",
  "Correct simplification statement",
  "Candidate substitution",
  "Exact statement combination",
  "Missing mixed minuend",
  "Missing mixed subtrahend",
  "Missing mixed dividend",
  "Cross-family missing fraction denominator",
  "Composed missing radicand",
  "Composed missing factorial input",
  "Two-sided exact equality",
  "Fixed mixed operand missing",
  "Exact-arithmetic data sufficiency",
] as const;

const CP007_TITLES = [
  "Round an integer to a declared place",
  "Round a decimal to the nearest integer",
  "Round a decimal to declared decimal places",
  "Negative halfway rounding under an explicit rule",
  "Identify the deciding place-value digit",
  "Select the correctly rounded precision representation",
  "Reverse an integer rounding interval",
  "Reverse a decimal rounding interval",
  "Least integer rounding to a target",
  "Greatest integer rounding to a target",
  "Missing digit consistent with a rounded result",
  "Absolute error after rounding",
  "Compare results rounded to different precisions",
  "Maximum possible rounding error",
  "Exact relative rounding error",
  "Diagnose premature rounding",
] as const;

const CP008_TITLES = [
  "Approximate integer sum",
  "Approximate integer difference",
  "Signed additive estimate",
  "Bracketed additive estimate",
  "Decimal sum rounded term-wise",
  "Decimal difference rounded term-wise",
  "Compatible rounded addend pair",
  "Additive-dominant add-multiply estimate",
  "Additive-dominant divide-add estimate",
  "Bounded additive BODMAS estimate",
  "Missing rounded addend",
  "Missing rounded subtrahend",
  "Nearest option for an additive estimate",
  "Exact-sum interval from rounded addends",
  "Exact-difference interval from rounded terms",
  "Overestimate or underestimate classification",
  "Compare two additive estimates",
  "Diagnose an invalid rounding direction",
] as const;

const SOURCE_HEAD_BY_CP: Readonly<Record<SapCp004008CheckpointId, string>> = Object.freeze({
  "SAP-CP-004": "87fbcfab53df2c3143fa092a6e323f6ccf0e3ad2",
  "SAP-CP-005": "0294b50b18d0aeb58cfdb35131fe89287823fc07",
  "SAP-CP-006": "2071599b73d6728b7e172e9b71e4af11ffc68cbe",
  "SAP-CP-007": "5c574157e3dead46112d2149c24224bd61430b1f",
  "SAP-CP-008": "f6e448dbd7fb20b256e7163d3fe5069fa03a8ab3",
});

function makeEntries(
  checkpointId: SapCp004008CheckpointId,
  packageId: SapCp004008PackageId,
  startId: number,
  titles: readonly string[],
): readonly SapCp004008FrozenRegistryEntry[] {
  return Object.freeze(titles.map((title, index) => {
    const number = startId + index;
    const ql = `SAP-QL-${String(number).padStart(3, "0")}` as SapCp004008FrozenQlId;
    const cpNumber = Number(checkpointId.slice(-3));
    const templateId = `SAP-CP00${cpNumber}-FROZEN-AUTHORITY-${String(index + 1).padStart(2, "0")}` as SapCp004008FrozenTemplateId;
    return Object.freeze({
      permanentQlId: ql,
      packageId,
      checkpointId,
      templateId,
      title,
      solveAuthority: `Frozen reviewed learner authority for ${title}.`,
      answerSemantic: "PRESERVED_FROM_REVIEWED_CANDIDATE",
      taskDirections: Object.freeze(["PRESERVED_FROM_REVIEWED_CANDIDATE"]),
      representations: Object.freeze(["PRESERVED_FROM_REVIEWED_CANDIDATE"]),
      prototypeAncestry: Object.freeze([
        `reviewed-candidate-coordinate:${ql}`,
        `reviewed-source-head:${SOURCE_HEAD_BY_CP[checkpointId]}`,
      ]),
      allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
      englishStatus: "ENGLISH_PRODUCT_OWNER_FREEZE_APPROVED" as const,
      allocationApproval: "PRODUCT_OWNER_APPROVED_CP004_CP008_2026_08_12" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    });
  }));
}

export const SAP_CP004_FROZEN_ENTRIES = makeEntries("SAP-CP-004", "SAP-001", 53, CP004_TITLES);
export const SAP_CP005_FROZEN_ENTRIES = makeEntries("SAP-CP-005", "SAP-001", 72, CP005_TITLES);
export const SAP_CP006_FROZEN_ENTRIES = makeEntries("SAP-CP-006", "SAP-001", 92, CP006_TITLES);
export const SAP_CP007_FROZEN_ENTRIES = makeEntries("SAP-CP-007", "SAP-002", 113, CP007_TITLES);
export const SAP_CP008_FROZEN_ENTRIES = makeEntries("SAP-CP-008", "SAP-002", 129, CP008_TITLES);

export const SAP_CP004_008_FROZEN_REGISTRY_ENTRIES = Object.freeze([
  ...SAP_CP004_FROZEN_ENTRIES,
  ...SAP_CP005_FROZEN_ENTRIES,
  ...SAP_CP006_FROZEN_ENTRIES,
  ...SAP_CP007_FROZEN_ENTRIES,
  ...SAP_CP008_FROZEN_ENTRIES,
]);

export const SAP_CP004_008_PRODUCT_OWNER_FREEZE = Object.freeze({
  freezeId: "SAP-CP004-008-EN-PRODUCT-OWNER-FREEZE-V1",
  approvalDate: "2026-08-12",
  approvalInstruction: "Freeze any pending cp for now",
  sourceHead: "f6e448dbd7fb20b256e7163d3fe5069fa03a8ab3",
  checkpoints: Object.freeze(["SAP-CP-004", "SAP-CP-005", "SAP-CP-006", "SAP-CP-007", "SAP-CP-008"] as const),
  allocatedRange: "SAP-QL-053..SAP-QL-146",
  allocatedCount: SAP_CP004_008_FROZEN_REGISTRY_ENTRIES.length,
  nextAvailableId: "SAP-QL-147",
  activeQlCount: 0,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
  translationStatus: "NOT_STARTED",
  mergeAuthorization: false,
});
