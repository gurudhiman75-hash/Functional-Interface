import type { NumCp006Wave01PrototypeId } from "./types.ts";
export interface NumCp006Wave01PrototypeRegistryEntry {
  readonly prototypeId: NumCp006Wave01PrototypeId; readonly title: string; readonly taskCluster: string;
  readonly answerSemantic: string; readonly canonicalRoute: string; readonly independentVerifierRoute: string;
  readonly sourceFamily: string; readonly ownershipBoundary: string;
}
export const NUM_CP006_WAVE01_PROTOTYPE_REGISTRY = [
  ["NUM-CP006-PROT-001", "Direct HCF of two numbers", "DIRECT_HCF_LCM", "HCF", "Prime-exponent minima or Euclidean gcd.", "Exact Euclidean algorithm.", "SSC-HCF-LCM-DIRECT", "Prime factorisation alone remains NUM-CP-004."],
  ["NUM-CP006-PROT-002", "Direct LCM of two numbers", "DIRECT_HCF_LCM", "LCM", "Prime-exponent maxima or product divided by gcd.", "Exact divisibility and minimality.", "SSC-HCF-LCM-DIRECT", "Divisor functions remain NUM-CP-005."],
  ["NUM-CP006-PROT-003", "Direct HCF of three numbers", "DIRECT_HCF_LCM", "HCF", "Minimum exponent across all three numbers.", "Repeated Euclidean gcd.", "SSC-HCF-THREE-NUMBERS", "The third number must be mathematically active."],
  ["NUM-CP006-PROT-004", "Direct LCM of three numbers", "DIRECT_HCF_LCM", "LCM", "Maximum exponent across all three numbers.", "Repeated exact lcm.", "SSC-LCM-THREE-NUMBERS", "No inclusion-exclusion counting is introduced."],
  ["NUM-CP006-PROT-005", "Recover missing number", "INVERSE_PAIR", "INTEGER", "For two positive integers, ab = HCF × LCM.", "Recompute gcd and lcm.", "SSC-HCF-LCM-INVERSE-PAIR", "The two-number identity must not be extended to three numbers."],
  ["NUM-CP006-PROT-006", "Select valid pair", "INVERSE_PAIR", "NUMBER_PAIR", "Write numbers as hx and hy with coprime x,y.", "Evaluate every option pair.", "SSC-HCF-LCM-PAIR-SELECTION", "Only pair validity is tested, not arrangement counting."],
  ["NUM-CP006-PROT-007", "Greatest equal measure", "GROUPING_MEASUREMENT", "MEASURE", "Translate greatest exact common measure into HCF.", "Check division and maximality.", "SSC-HCF-MEASUREMENT-APPLICATION", "Mensuration owns geometry; CP-006 owns common-measure arithmetic."],
  ["NUM-CP006-PROT-008", "Least positive common alignment", "COMMON_MULTIPLES_EVENTS", "EVENT_TIME", "Translate next common repeat into LCM.", "Simulate positive event multiples.", "SSC-LCM-COMMON-EVENT-APPLICATION", "Time zero is excluded when the question asks next."],
].map(([prototypeId, title, taskCluster, answerSemantic, canonicalRoute, independentVerifierRoute, sourceFamily, ownershipBoundary]) => ({
  prototypeId, title, taskCluster, answerSemantic, canonicalRoute, independentVerifierRoute, sourceFamily, ownershipBoundary,
})) as readonly NumCp006Wave01PrototypeRegistryEntry[];
