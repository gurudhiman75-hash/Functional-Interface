import type { NumCp007Wave04PrototypeId } from "./types.ts";

export interface NumCp007Wave04RegistryEntry {
  readonly prototypeId: NumCp007Wave04PrototypeId;
  readonly title: string;
  readonly taskCluster: string;
  readonly answerSemantic: string;
  readonly canonicalRoute: string;
  readonly independentVerifierRoute: string;
  readonly sourceFamily: string;
  readonly ownershipBoundary: string;
}

export const NUM_CP007_WAVE04_PROTOTYPE_REGISTRY = [
  ["NUM-CP007-PROT-025", "Richer linked division relations", "LINKED_RELATION", "DIVISOR", "Construct an admissible division state under multiplier/gap relations.", "Enumerate all positive divisors and retain only states satisfying both division and rendered linked relations.", "SSC-LINKED-DIVISOR-QUOTIENT-REMAINDER-RELATIONS", "Generic algebra without an essential remainder bound remains Algebra; PROT-013/024 ancestry is retained for later merge."],
  ["NUM-CP007-PROT-026", "Inverse remainder propagation", "INVERSE_REMAINDER", "DIVISOR", "Recover the divisor from one-wrap sum/scaling residue propagation.", "Enumerate all divisors compatible with the rendered residues and explicit one-wrap condition.", "SSC-INVERSE-REMAINDER-PROPAGATION", "Independent multi-modulus systems remain NUM-CP-008."],
  ["NUM-CP007-PROT-027", "Successive quotient-division chain", "SUCCESSIVE_DIVISION", "DIVIDEND_OR_REMAINDER", "Apply the division lemma backwards through two successive quotient divisions.", "Reconstruct both stages independently and reduce the recovered dividend when required.", "SSC-RRB-SUCCESSIVE-QUOTIENT-DIVISION", "This is repeated use of one division engine, not an independent congruence system."],
  ["NUM-CP007-PROT-028", "Reverse successive division order", "SUCCESSIVE_DIVISION_REORDER", "REMAINDER_SEQUENCE", "Recover the original number then execute the reversed divisor order.", "Reconstruct N from the original chain and perform both reversed integer divisions directly.", "SSC-RRB-REVERSED-SUCCESSIVE-DIVISION", "Independent simultaneous congruences remain NUM-CP-008."],
  ["NUM-CP007-PROT-029", "Wrong-divisor correction", "DIVISION_ERROR_CORRECTION", "DIVISION_STATE", "Recover the hidden dividend from the erroneous division, then divide correctly.", "Recompute the hidden dividend and run ordinary integer division with the stated correct divisor.", "SSC-DIVISION-WRONG-DIVISOR-CORRECTION", "Generic percentage/error arithmetic is excluded; both stages must be division states."],
  ["NUM-CP007-PROT-030", "Long-division intermediate-remainder trace", "LONG_DIVISION_TRACE", "DIVISOR", "Match every running prefix remainder to one common divisor.", "Enumerate divisors 2..99 and recompute the complete prefix-remainder trace.", "SSC-LONG-DIVISION-INTERMEDIATE-REMAINDER-TRACE", "This is one long-division trace, distinct from successive quotient division."],
  ["NUM-CP007-PROT-031", "Bounded non-zero-remainder extremum", "RESIDUE_EXTREMUM", "INTEGER_EXTREMUM", "Locate the adjacent member of a non-zero residue class across a strict bound.", "Scan at most one modulus width above/below the rendered bound.", "QUANT-V3-NS-REM-002-NONZERO-REMAINDER-EXTREMUM", "Zero-remainder n-digit/range extremum ownership stays NUM-CP-003."],
  ["NUM-CP007-PROT-032", "Same-remainder bounded divisor reconstruction", "SAME_REMAINDER_RECONSTRUCTION", "DIVISOR", "Use d | (A-B) under an explicit divisor interval.", "Enumerate every divisor in the rendered interval and directly compare both remainders.", "SSC-SAME-REMAINDER-BOUNDED-DIVISOR-RECONSTRUCTION", "Greatest same-remainder divisor stays NUM-CP-006; divisor-count projection remains CP-005/mixed hold."],
].map(([prototypeId, title, taskCluster, answerSemantic, canonicalRoute, independentVerifierRoute, sourceFamily, ownershipBoundary]) => ({
  prototypeId,
  title,
  taskCluster,
  answerSemantic,
  canonicalRoute,
  independentVerifierRoute,
  sourceFamily,
  ownershipBoundary,
})) as readonly NumCp007Wave04RegistryEntry[];
