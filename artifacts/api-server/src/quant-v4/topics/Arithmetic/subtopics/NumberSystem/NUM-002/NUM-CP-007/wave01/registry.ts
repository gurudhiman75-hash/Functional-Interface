import type { NumCp007Wave01PrototypeId } from "./types.ts";

export interface NumCp007Wave01PrototypeRegistryEntry {
  readonly prototypeId: NumCp007Wave01PrototypeId;
  readonly title: string;
  readonly taskCluster: string;
  readonly answerSemantic: string;
  readonly canonicalRoute: string;
  readonly independentVerifierRoute: string;
  readonly sourceFamily: string;
  readonly ownershipBoundary: string;
}

export const NUM_CP007_WAVE01_PROTOTYPE_REGISTRY = [
  ["NUM-CP007-PROT-001", "Recover the remainder", "DIRECT_DIVISION_LEMMA", "REMAINDER", "N − dq", "Reconstruct and check 0 ≤ r < d.", "SSC-DIVISION-LEMMA-MISSING-REMAINDER", "Power and simultaneous congruence remainders remain NUM-CP-008."],
  ["NUM-CP007-PROT-002", "Recover the dividend", "DIRECT_DIVISION_LEMMA", "DIVIDEND", "dq + r", "Rebuild the identity and compare the rendered givens.", "SSC-DIVISION-LEMMA-MISSING-DIVIDEND", "General linear equations remain Algebra unless the division state is essential."],
  ["NUM-CP007-PROT-003", "Recover the divisor", "INVERSE_DIVISION_LEMMA", "DIVISOR", "(N − r) ÷ q", "Substitute the answer and validate the identity and remainder bound.", "SSC-DIVISION-LEMMA-MISSING-DIVISOR", "Same-remainder greatest-divisor optimisation remains NUM-CP-006."],
  ["NUM-CP007-PROT-004", "Recover the quotient", "INVERSE_DIVISION_LEMMA", "QUOTIENT", "(N − r) ÷ d", "Substitute the answer and validate exact reconstruction.", "SSC-DIVISION-LEMMA-MISSING-QUOTIENT", "Digit-divisibility reconstruction remains NUM-CP-003."],
  ["NUM-CP007-PROT-005", "Select a valid division state", "VALIDITY_CLASSIFICATION", "DIVISION_STATE", "Check N = dq + r and 0 ≤ r < d.", "Evaluate every option independently.", "SSC-DIVISION-STATE-VALIDATION", "This does not create a general statement-reasoning authority."],
  ["NUM-CP007-PROT-006", "Remainder of a sum", "REMAINDER_PROPAGATION", "REMAINDER", "(r₁ + r₂) mod d", "Construct bounded representatives and divide their sum.", "SSC-REMAINDER-OF-SUM", "Independent congruence systems remain NUM-CP-008."],
  ["NUM-CP007-PROT-007", "Remainder of a product", "REMAINDER_PROPAGATION", "REMAINDER", "(r₁r₂) mod d", "Construct bounded representatives and divide their product.", "SSC-REMAINDER-OF-PRODUCT", "Terminal-digit outputs remain NUM-CP-009."],
  ["NUM-CP007-PROT-008", "Minimum divisibility adjustment", "EXACT_DIVISIBILITY_ADJUSTMENT", "ADJUSTMENT_AMOUNT", "Use r for subtraction and (d − r) mod d for addition.", "Check the adjusted number and prove no smaller non-negative adjustment works.", "SSC-MINIMUM-ADDITION-SUBTRACTION-DIVISIBILITY", "The frozen n-digit extremum-multiple contract remains NUM-CP-003."],
].map(([prototypeId, title, taskCluster, answerSemantic, canonicalRoute, independentVerifierRoute, sourceFamily, ownershipBoundary]) => ({
  prototypeId,
  title,
  taskCluster,
  answerSemantic,
  canonicalRoute,
  independentVerifierRoute,
  sourceFamily,
  ownershipBoundary,
})) as readonly NumCp007Wave01PrototypeRegistryEntry[];
