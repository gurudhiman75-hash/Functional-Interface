export type SapFinalCheckpointId =
  | "SAP-CP-004"
  | "SAP-CP-005"
  | "SAP-CP-007"
  | "SAP-CP-010"
  | "SAP-CP-011"
  | "SAP-CP-012";

export type SapFinalPackageId = "SAP-001" | "SAP-002";
export type SapFinalQlId = `SAP-QL-${string}`;

export interface SapFinalFrozenEntry {
  readonly permanentQlId: SapFinalQlId;
  readonly packageId: SapFinalPackageId;
  readonly checkpointId: SapFinalCheckpointId;
  readonly sourceIdentity: string;
  readonly title: string;
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly englishStatus: "ENGLISH_PRODUCT_OWNER_FREEZE_APPROVED";
  readonly allocationApproval: "PRODUCT_OWNER_APPROVED_FINAL_SAP_2026_08_16";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

const CP010: readonly [string, string][] = [
  ["SAP-CP010-PROT-SQRT-INTERVAL", "Square-root interval from nearby perfect squares"],
  ["SAP-CP010-PROT-CBRT-INTERVAL", "Cube-root interval from nearby perfect cubes"],
  ["SAP-CP010-PROT-FOURTH-ROOT-INTERVAL", "Bounded higher-root interval"],
  ["SAP-CP010-PROT-NEAREST-INTEGER-SQRT", "Nearest integer square root"],
  ["SAP-CP010-PROT-NEAREST-INTEGER-CBRT", "Nearest integer cube root"],
  ["SAP-CP010-PROT-INTEGER-ROOT-BOUND", "Greatest lower / least upper integer root bound"],
  ["SAP-CP010-PROT-DECIMAL-POWER-ESTIMATE", "Small decimal power estimate"],
  ["SAP-CP010-PROT-PERCENT-POWER-FACTOR", "Percentage power-factor estimate"],
  ["SAP-CP010-PROT-RECIPROCAL-BENCHMARK", "Reciprocal near an integer benchmark"],
  ["SAP-CP010-PROT-ROOT-PRODUCT", "Approximate product of roots"],
  ["SAP-CP010-PROT-ROOT-QUOTIENT", "Approximate quotient of roots"],
  ["SAP-CP010-PROT-MIXED-POWER-ROOT", "Mixed bounded power-root estimate"],
  ["SAP-CP010-PROT-MISSING-RADICAND", "Missing radicand under nearest-integer root"],
  ["SAP-CP010-PROT-MISSING-POWER-BASE", "Missing base under bounded approximate power"],
  ["SAP-CP010-PROT-NEAREST-OPTION-SPECIAL-FORM", "Nearest option for a power estimate"],
  ["SAP-CP010-PROT-COMPARE-ROOT-POWER", "Compare approximate root and power values"],
  ["SAP-CP010-PROT-WRONG-BENCHMARK-DIAGNOSIS", "Diagnose a wrong root benchmark"],
] as const;

const E1: readonly [SapFinalCheckpointId, SapFinalPackageId, string, string][] = [
  ["SAP-CP-004", "SAP-001", "SAP-CP004-E1-CAND-NESTED-ADDITIVE-EXACT-RADICAL", "Nested additive exact radical chain"],
  ["SAP-CP-005", "SAP-001", "SAP-CP005-E1-CAND-NUMERIC-PARTIAL-FRACTION-TELESCOPING", "Numeric partial-fraction telescoping sum"],
  ["SAP-CP-007", "SAP-002", "SAP-CP007-E1-CAND-ROUND-TO-SIGNIFICANT-FIGURES", "Round a number to declared significant figures"],
  ["SAP-CP-010", "SAP-002", "SAP-CP010-E1-CAND-SUPPLIED-ROOT-SCALING", "Scale a supplied approximate root value"],
] as const;

const CP011: readonly [string, string][] = [
  ["CP011-E2-CLOSEST-MIXED-EXPRESSION", "Closest option for a mixed approximate expression"],
  ["CP011-E2-CLOSEST-FRACTION-PRODUCT", "Closest option for a fraction-product estimate"],
  ["CP011-E2-NEAREST-MULTIPLE-TEN", "Nearest multiple after approximation"],
  ["CP011-E2-CLOSEST-ROOT-OPTION", "Closest option for an approximate root expression"],
  ["CP011-E2-ABSOLUTE-ERROR", "Absolute error of an estimate"],
  ["CP011-E2-PERCENTAGE-ERROR", "Percentage error of an estimate"],
  ["CP011-E2-OVER-UNDER-DIRECTION", "Overestimate / underestimate direction"],
  ["CP011-E2-COMPARE-ESTIMATE-ACCURACY", "Compare the accuracy of two estimates"],
  ["CP011-E2-COMPOSED-ROUNDING-BOUND", "Tight bound from multiple rounded terms"],
  ["CP011-E2-OPTION-WITHIN-TOLERANCE", "Select the option inside a stated tolerance"],
  ["CP011-E2-GUARANTEED-NEAREST-FROM-INTERVAL", "Guaranteed nearest option from an interval"],
  ["CP011-E2-AMBIGUOUS-OPTION-DIAGNOSIS", "Diagnose when no unique nearest option is guaranteed"],
] as const;

const CP012: readonly [string, string][] = [
  ["CP012-E2-MISSING-ADDEND-MIXED", "Approximate missing addend in a mixed equation"],
  ["CP012-E2-MISSING-MULTIPLIER", "Approximate missing multiplier"],
  ["CP012-E2-MISSING-DIVISOR", "Approximate missing divisor"],
  ["CP012-E2-MISSING-SQUARE-ROOT", "Recover a missing value from a square relation"],
  ["CP012-E2-MISSING-CUBE-ROOT", "Recover a missing value from a cube relation"],
  ["CP012-E2-MISSING-ROOT-RATIO", "Reverse a root-ratio approximation"],
  ["CP012-E2-MISSING-PERCENTAGE", "Recover a missing percentage approximately"],
  ["CP012-E2-TWO-SIDED-MIXED-EQUATION", "Reverse a two-sided mixed approximate equation"],
  ["CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE", "Unique integer satisfying an approximation tolerance"],
  ["CP012-E2-COUNT-ADMISSIBLE-INTEGERS", "Count admissible integers in an approximation band"],
  ["CP012-E2-OUTCOME-CLASSIFICATION", "Classify an approximation band as unique / multiple / impossible"],
  ["CP012-E2-ROUNDED-OPERAND-SYNTHESIS", "Recover the exact possible interval of a rounded operand"],
  ["CP012-E2-MIXED-ROOT-POWER-SYNTHESIS", "Mixed root/power reverse-approximation synthesis"],
] as const;

function ql(number: number): SapFinalQlId {
  return `SAP-QL-${String(number).padStart(3, "0")}` as SapFinalQlId;
}

function entry(
  permanentQlId: SapFinalQlId,
  packageId: SapFinalPackageId,
  checkpointId: SapFinalCheckpointId,
  sourceIdentity: string,
  title: string,
): SapFinalFrozenEntry {
  return Object.freeze({
    permanentQlId,
    packageId,
    checkpointId,
    sourceIdentity,
    title,
    allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
    englishStatus: "ENGLISH_PRODUCT_OWNER_FREEZE_APPROVED" as const,
    allocationApproval: "PRODUCT_OWNER_APPROVED_FINAL_SAP_2026_08_16" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });
}

export const SAP_CP010_FINAL_FROZEN_ENTRIES = Object.freeze(CP010.map(([sourceIdentity, title], index) =>
  entry(ql(166 + index), "SAP-002", "SAP-CP-010", sourceIdentity, title),
));

export const SAP_E1_FINAL_FROZEN_ENTRIES = Object.freeze(E1.map(([checkpointId, packageId, sourceIdentity, title], index) =>
  entry(ql(183 + index), packageId, checkpointId, sourceIdentity, title),
));

export const SAP_CP011_FINAL_FROZEN_ENTRIES = Object.freeze(CP011.map(([sourceIdentity, title], index) =>
  entry(ql(187 + index), "SAP-002", "SAP-CP-011", sourceIdentity, title),
));

export const SAP_CP012_FINAL_FROZEN_ENTRIES = Object.freeze(CP012.map(([sourceIdentity, title], index) =>
  entry(ql(199 + index), "SAP-002", "SAP-CP-012", sourceIdentity, title),
));

export const SAP_QL166_211_FINAL_FROZEN_ENTRIES = Object.freeze([
  ...SAP_CP010_FINAL_FROZEN_ENTRIES,
  ...SAP_E1_FINAL_FROZEN_ENTRIES,
  ...SAP_CP011_FINAL_FROZEN_ENTRIES,
  ...SAP_CP012_FINAL_FROZEN_ENTRIES,
]);

export const SAP_FINAL_PRODUCT_OWNER_FREEZE = Object.freeze({
  freezeId: "SAP-QL166-211-FINAL-EN-PRODUCT-OWNER-FREEZE-V1",
  approvalDate: "2026-08-16",
  approvalInstruction: "approved",
  approvedProposalHead: "728f038c194b8868063b0a3c53b9d6f854328dfc",
  sourceSaturationEvidenceHead: "b66075169a8a98f8ee21a920bc755c3673ee54c5",
  sourceSaturation: true,
  priorFrozenThrough: "SAP-QL-165",
  allocatedRange: "SAP-QL-166..SAP-QL-211",
  allocatedCount: SAP_QL166_211_FINAL_FROZEN_ENTRIES.length,
  nextAvailableId: "SAP-QL-212",
  activeQlCount: 0,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
  translationStatus: "NOT_STARTED",
  mergeAuthorization: false,
});
