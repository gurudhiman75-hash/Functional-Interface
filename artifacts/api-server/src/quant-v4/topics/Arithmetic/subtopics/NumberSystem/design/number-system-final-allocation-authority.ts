export type NumberSystemFinalPackageId = "NUM-001" | "NUM-002";
export type NumberSystemFinalCpId = `NUM-CP-${string}`;

export interface NumberSystemFinalCheckpointAllocation {
  readonly cpId: NumberSystemFinalCpId;
  readonly packageId: NumberSystemFinalPackageId;
  readonly title: string;
  readonly firstQlNumber: number;
  readonly lastQlNumber: number;
  readonly permanentQlCount: number;
  readonly frozenSolveModeCount: number;
  readonly authorityRoute: string;
}

/**
 * Canonical live permanent-allocation truth for the completed Number System chapter.
 *
 * The order is permanent identity order, not CP-number order. CP-003/004 were
 * implemented first, followed by CP-005/006/007, then CP-001/002, and finally
 * CP-008..014. This ordering is intentional because it allows a direct proof
 * that NUM-QL-001..NUM-QL-253 contain no gap or overlap.
 */
export const NUMBER_SYSTEM_FINAL_CHECKPOINT_ALLOCATIONS = Object.freeze([
  Object.freeze({ cpId: "NUM-CP-003", packageId: "NUM-001", title: "Divisibility Rules and Missing-Digit Constraints", firstQlNumber: 1, lastQlNumber: 17, permanentQlCount: 17, frozenSolveModeCount: 7, authorityRoute: "NUM-001/NUM-CP-003/permanent/allocation.ts" }),
  Object.freeze({ cpId: "NUM-CP-004", packageId: "NUM-001", title: "Prime Structure and Factorisation", firstQlNumber: 18, lastQlNumber: 45, permanentQlCount: 28, frozenSolveModeCount: 28, authorityRoute: "NUM-001/NUM-CP-004/permanent/allocation.ts" }),
  Object.freeze({ cpId: "NUM-CP-005", packageId: "NUM-001", title: "Divisors and Divisor Functions", firstQlNumber: 46, lastQlNumber: 69, permanentQlCount: 24, frozenSolveModeCount: 24, authorityRoute: "NUM-001/NUM-CP-005/permanent/allocation.ts" }),
  Object.freeze({ cpId: "NUM-CP-006", packageId: "NUM-001", title: "HCF, LCM and Common-Alignment Applications", firstQlNumber: 70, lastQlNumber: 97, permanentQlCount: 28, frozenSolveModeCount: 28, authorityRoute: "NUM-001/NUM-CP-006/permanent/allocation.ts" }),
  Object.freeze({ cpId: "NUM-CP-007", packageId: "NUM-002", title: "Division Algorithm and Elementary Remainder Transformation", firstQlNumber: 98, lastQlNumber: 123, permanentQlCount: 26, frozenSolveModeCount: 26, authorityRoute: "NUM-002/NUM-CP-007/permanent/allocation.ts" }),
  Object.freeze({ cpId: "NUM-CP-001", packageId: "NUM-001", title: "Number Sets, Order, Parity and Integer Structure", firstQlNumber: 124, lastQlNumber: 144, permanentQlCount: 21, frozenSolveModeCount: 21, authorityRoute: "NUM-001/NUM-CP-001/permanent/allocation.ts" }),
  Object.freeze({ cpId: "NUM-CP-002", packageId: "NUM-001", title: "Fractions, Decimals and Recurring Representations", firstQlNumber: 145, lastQlNumber: 165, permanentQlCount: 21, frozenSolveModeCount: 21, authorityRoute: "NUM-001/NUM-CP-002/permanent/allocation.ts" }),
  Object.freeze({ cpId: "NUM-CP-008", packageId: "NUM-002", title: "Modular Arithmetic and Simultaneous Congruences", firstQlNumber: 166, lastQlNumber: 184, permanentQlCount: 19, frozenSolveModeCount: 19, authorityRoute: "NUM-002/NUM-CP-008/permanent-allocation.ts" }),
  Object.freeze({ cpId: "NUM-CP-009", packageId: "NUM-002", title: "Cyclicity, Unit Digit and Terminal Digits", firstQlNumber: 185, lastQlNumber: 196, permanentQlCount: 12, frozenSolveModeCount: 12, authorityRoute: "NUM-002/NUM-CP-009/permanent-allocation.ts" }),
  Object.freeze({ cpId: "NUM-CP-010", packageId: "NUM-002", title: "Digit Structure, Place Value and Number Reconstruction", firstQlNumber: 197, lastQlNumber: 212, permanentQlCount: 16, frozenSolveModeCount: 16, authorityRoute: "NUM-002/NUM-CP-010/permanent-allocation.ts" }),
  Object.freeze({ cpId: "NUM-CP-011", packageId: "NUM-002", title: "Factorials, Prime Valuations and Trailing Zeroes", firstQlNumber: 213, lastQlNumber: 225, permanentQlCount: 13, frozenSolveModeCount: 13, authorityRoute: "NUM-002/NUM-CP-011/permanent-allocation.ts" }),
  Object.freeze({ cpId: "NUM-CP-012", packageId: "NUM-002", title: "Perfect Squares, Cubes and General Perfect Powers", firstQlNumber: 226, lastQlNumber: 236, permanentQlCount: 11, frozenSolveModeCount: 11, authorityRoute: "NUM-002/NUM-CP-012/permanent-allocation.ts" }),
  Object.freeze({ cpId: "NUM-CP-013", packageId: "NUM-002", title: "Positional Bases and Numeral Conversion", firstQlNumber: 237, lastQlNumber: 247, permanentQlCount: 11, frozenSolveModeCount: 11, authorityRoute: "NUM-002/NUM-CP-013/permanent-allocation.ts" }),
  Object.freeze({ cpId: "NUM-CP-014", packageId: "NUM-002", title: "Mixed Inverse, Optimisation and Number-Theory Synthesis", firstQlNumber: 248, lastQlNumber: 253, permanentQlCount: 6, frozenSolveModeCount: 6, authorityRoute: "NUM-002/NUM-CP-014/permanent-allocation.ts" }),
] as const satisfies readonly NumberSystemFinalCheckpointAllocation[]);

export const NUMBER_SYSTEM_FINAL_PERMANENT_QL_RANGE = Object.freeze({
  first: 1,
  last: 253,
  count: 253,
} as const);

export const NUMBER_SYSTEM_FINAL_NEXT_PERMANENT_QL_NUMBER = 254 as const;
export const NUMBER_SYSTEM_FINAL_CHECKPOINT_COUNT = 14 as const;

export function formatNumberSystemQlId(number: number) {
  return `NUM-QL-${String(number).padStart(3, "0")}` as const;
}

export const NUMBER_SYSTEM_FINAL_PERMANENT_QL_IDS = Object.freeze(
  Array.from({ length: NUMBER_SYSTEM_FINAL_PERMANENT_QL_RANGE.count }, (_, index) =>
    formatNumberSystemQlId(index + NUMBER_SYSTEM_FINAL_PERMANENT_QL_RANGE.first),
  ),
);
