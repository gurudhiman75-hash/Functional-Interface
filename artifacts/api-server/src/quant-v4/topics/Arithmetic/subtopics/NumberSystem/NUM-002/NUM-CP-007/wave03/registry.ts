import type { NumCp007Wave03PrototypeId } from "./types.ts";

export interface NumCp007Wave03RegistryEntry {
  readonly prototypeId: NumCp007Wave03PrototypeId;
  readonly title: string;
  readonly taskCluster: string;
  readonly answerSemantic: string;
  readonly canonicalRoute: string;
  readonly independentVerifierRoute: string;
  readonly sourceFamily: string;
  readonly ownershipBoundary: string;
}

export const NUM_CP007_WAVE03_PROTOTYPE_REGISTRY = [
  ["NUM-CP007-PROT-017", "Range-bounded dividend reconstruction", "BOUNDED_STATE_RECONSTRUCTION", "INTEGER", "Enumerate one residue class inside a short interval.", "Direct interval enumeration from rendered divisor and remainder.", "SSC-RANGE-BOUNDED-DIVIDEND-RECONSTRUCTION", "Multiple independent remainder constraints remain NUM-CP-008."],
  ["NUM-CP007-PROT-018", "Complete bounded number set", "BOUNDED_STATE_ENUMERATION", "NUMBER_SET", "Generate the residue-class progression inside the interval.", "Enumerate every integer in the rendered interval.", "SSC-BOUNDED-DIVISION-STATE-SET", "General counting-by-arrangement tasks remain P&C."],
  ["NUM-CP007-PROT-019", "Division state classification", "STATE_VALIDITY", "SOLUTION_CLASS", "Check N=dq+r and the remainder bound separately.", "Recompute identity and bound truth independently.", "SSC-DIVISION-STATE-POSSIBLE-IMPOSSIBLE", "General algebraic consistency without division-state meaning remains Algebra."],
  ["NUM-CP007-PROT-020", "Same-remainder divisor candidate", "CANDIDATE_VERIFICATION", "DIVISOR", "A valid candidate divides the difference and reproduces the same remainder.", "Test each rendered option directly against both numbers.", "SSC-SAME-REMAINDER-DIVISOR-CANDIDATE", "Greatest such divisor and HCF optimisation remain NUM-CP-006."],
  ["NUM-CP007-PROT-021", "Quotient-remainder table interpretation", "TABLE_INTERPRETATION", "DIVISION_STATE", "Compute q=floor(N/d) and r=N-dq.", "Direct integer division from rendered N and d.", "SSC-QUOTIENT-REMAINDER-TABLE", "Terminal-digit tables remain NUM-CP-009."],
  ["NUM-CP007-PROT-022", "Division statement combination", "STATEMENT_FORM", "BOOLEAN_CLAIM", "Check each claim against the division algorithm.", "Recompute each claim truth and derive the combination.", "SSC-DIVISION-ALGORITHM-STATEMENT-COMBINATION", "Multi-congruence claim sets remain NUM-CP-008."],
  ["NUM-CP007-PROT-023", "Division-state data sufficiency", "DATA_SUFFICIENCY", "SUFFICIENCY_CLASS", "Filter the bounded residue-class candidates under each statement.", "Enumerate candidate sets for I, II and I+II independently.", "BANKING-DATA-SUFFICIENCY-DIVISION-STATE", "General equation-system DS remains Algebra."],
  ["NUM-CP007-PROT-024", "Linked division-state mini caselet", "MINI_CASELET", "QUOTIENT", "Use N=(q+c)q+r for the linked divisor-quotient relation.", "Enumerate non-negative q and require one admissible division state.", "SSC-MINI-CASELET-LINKED-DIVISION-STATE", "Generic quadratic equations without division-state necessity remain Algebra."],
].map(([prototypeId, title, taskCluster, answerSemantic, canonicalRoute, independentVerifierRoute, sourceFamily, ownershipBoundary]) => ({
  prototypeId,
  title,
  taskCluster,
  answerSemantic,
  canonicalRoute,
  independentVerifierRoute,
  sourceFamily,
  ownershipBoundary,
})) as readonly NumCp007Wave03RegistryEntry[];
