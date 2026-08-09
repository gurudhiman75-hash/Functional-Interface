import type { NumCp007Wave02PrototypeId } from "./types.ts";

export interface NumCp007Wave02RegistryEntry {
  readonly prototypeId: NumCp007Wave02PrototypeId;
  readonly title: string;
  readonly taskCluster: string;
  readonly answerSemantic: string;
  readonly canonicalRoute: string;
  readonly independentVerifierRoute: string;
  readonly sourceFamily: string;
  readonly ownershipBoundary: string;
}

export const NUM_CP007_WAVE02_PROTOTYPE_REGISTRY = [
  ["NUM-CP007-PROT-009", "Remainder of a difference", "REMAINDER_PROPAGATION", "REMAINDER", "Subtract residues and normalise.", "Direct least-non-negative modulo.", "SSC-REMAINDER-OF-DIFFERENCE", "Simultaneous congruence systems remain NUM-CP-008."],
  ["NUM-CP007-PROT-010", "Remainder after scaling", "REMAINDER_PROPAGATION", "REMAINDER", "Scale the known residue and reduce.", "Direct integer multiplication and modulo.", "SSC-SCALED-REMAINDER", "Power cycles remain NUM-CP-008/009."],
  ["NUM-CP007-PROT-011", "Compatible nested remainder", "NESTED_REMAINDER", "REMAINDER", "Reduce the known remainder because the smaller divisor divides the known divisor.", "Verify divisibility of moduli and reduce directly.", "SSC-COMPATIBLE-NESTED-REMAINDER", "Incompatible nested moduli are not inferred."],
  ["NUM-CP007-PROT-012", "Polynomial remainder from one residue", "REMAINDER_PROPAGATION", "REMAINDER", "Substitute the residue into a bounded polynomial.", "Evaluate the polynomial on the residue and reduce.", "SSC-BOUNDED-POLYNOMIAL-REMAINDER", "Large power/cycle reductions remain NUM-CP-008."],
  ["NUM-CP007-PROT-013", "Linked divisor-quotient reconstruction", "LINKED_DIVISION_STATE", "DIVISOR", "Combine N=dq+r with d=q+c.", "Enumerate all positive divisors and require uniqueness.", "SSC-LINKED-DIVISOR-QUOTIENT-RECONSTRUCTION", "Generic equations without division-state necessity remain Algebra."],
  ["NUM-CP007-PROT-014", "Count bounded dividends with fixed remainder", "BOUNDED_STATE_ENUMERATION", "COUNT", "Count a residue-class arithmetic progression in an interval.", "Enumerate every integer in the rendered range.", "SSC-BOUNDED-DIVIDEND-COUNT", "Multiple independent congruences remain NUM-CP-008."],
  ["NUM-CP007-PROT-015", "Classify bounded solution topology", "SOLUTION_TOPOLOGY", "SOLUTION_CLASS", "Validate remainder then classify zero, one or several bounded states.", "Enumerate the interval independently.", "SSC-DIVISION-STATE-SOLUTION-TOPOLOGY", "Unbounded algebraic solution sets remain Algebra."],
  ["NUM-CP007-PROT-016", "Nearest multiple including tie", "EXACT_DIVISIBILITY_ADJUSTMENT", "NEAREST_MULTIPLE_CLASS", "Compare distances to neighbouring multiples.", "Compute lower and upper multiples independently.", "SSC-NEAREST-MULTIPLE-TIE-CLASSIFICATION", "Frozen n-digit extremum multiples remain NUM-CP-003."],
].map(([prototypeId, title, taskCluster, answerSemantic, canonicalRoute, independentVerifierRoute, sourceFamily, ownershipBoundary]) => ({
  prototypeId,
  title,
  taskCluster,
  answerSemantic,
  canonicalRoute,
  independentVerifierRoute,
  sourceFamily,
  ownershipBoundary,
})) as readonly NumCp007Wave02RegistryEntry[];
