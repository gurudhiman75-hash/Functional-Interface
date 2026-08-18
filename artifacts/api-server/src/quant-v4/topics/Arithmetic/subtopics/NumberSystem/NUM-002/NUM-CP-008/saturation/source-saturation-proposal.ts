import { NUM_CP008_WAVE01_PROTOTYPE_IDS } from "../wave01/types.ts";
import { NUM_CP008_WAVE02_PROTOTYPE_IDS } from "../wave02/types.ts";
import { NUM_CP008_WAVE03_PROTOTYPE_IDS } from "../wave03/types.ts";
import { NUM_CP008_WAVE04_PROTOTYPE_IDS } from "../wave04/types.ts";

export const NUM_CP008_DISCOVERED_PROTOTYPE_IDS = [
  ...NUM_CP008_WAVE01_PROTOTYPE_IDS,
  ...NUM_CP008_WAVE02_PROTOTYPE_IDS,
  ...NUM_CP008_WAVE03_PROTOTYPE_IDS,
  ...NUM_CP008_WAVE04_PROTOTYPE_IDS,
] as const;

export type NumCp008DiscoveredPrototypeId = (typeof NUM_CP008_DISCOVERED_PROTOTYPE_IDS)[number];

export type NumCp008CandidateAuthority = Readonly<{
  candidateId: `NUM-CP008-CAND-${string}`;
  label: string;
  prototypeAncestry: readonly NumCp008DiscoveredPrototypeId[];
  disposition: "SINGLETON_AUTHORITY" | "MERGED_PARAMETER_AUTHORITY";
  permanentQlId: null;
}>;

export const NUM_CP008_PROPOSED_AUTHORITIES: readonly NumCp008CandidateAuthority[] = Object.freeze([
  { candidateId: "NUM-CP008-CAND-001", label: "Modular operations, signed normalisation and direct residue reconstruction", prototypeAncestry: ["NUM-CP008-PROT-001", "NUM-CP008-PROT-002", "NUM-CP008-PROT-017"], disposition: "MERGED_PARAMETER_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-002", label: "Power remainder by exact modular exponentiation", prototypeAncestry: ["NUM-CP008-PROT-003"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-003", label: "Linear congruence with one residue class", prototypeAncestry: ["NUM-CP008-PROT-004"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-004", label: "Linear congruence multiple-class count", prototypeAncestry: ["NUM-CP008-PROT-005"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-005", label: "Linear congruence no-solution classification", prototypeAncestry: ["NUM-CP008-PROT-006"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-006", label: "Compatible multi-congruence system, least positive solution", prototypeAncestry: ["NUM-CP008-PROT-007", "NUM-CP008-PROT-015", "NUM-CP008-PROT-020"], disposition: "MERGED_PARAMETER_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-007", label: "Incompatible multi-congruence system classification", prototypeAncestry: ["NUM-CP008-PROT-008", "NUM-CP008-PROT-016"], disposition: "MERGED_PARAMETER_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-008", label: "Bounded extremum representative of one residue class", prototypeAncestry: ["NUM-CP008-PROT-009"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-009", label: "Bounded count in one residue class", prototypeAncestry: ["NUM-CP008-PROT-010"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-010", label: "Complete bounded solution set of a compatible system", prototypeAncestry: ["NUM-CP008-PROT-011"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-011", label: "Missing modular coefficient reconstruction", prototypeAncestry: ["NUM-CP008-PROT-012"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-012", label: "Missing modulus reconstruction", prototypeAncestry: ["NUM-CP008-PROT-013"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-013", label: "Structured or geometric-sum remainder", prototypeAncestry: ["NUM-CP008-PROT-014"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-014", label: "Nested modular expression remainder", prototypeAncestry: ["NUM-CP008-PROT-018"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-015", label: "Candidate verification against a complete congruence system", prototypeAncestry: ["NUM-CP008-PROT-019"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-016", label: "Modular statement-combination evaluation", prototypeAncestry: ["NUM-CP008-PROT-021"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-017", label: "Bounded modular Data Sufficiency", prototypeAncestry: ["NUM-CP008-PROT-022"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-018", label: "Repeated numeral or repeated-block remainder recurrence", prototypeAncestry: ["NUM-CP008-PROT-023", "NUM-CP008-PROT-026"], disposition: "MERGED_PARAMETER_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-019", label: "Bounded compatible-system count and no/one/many projection", prototypeAncestry: ["NUM-CP008-PROT-024", "NUM-CP008-PROT-028"], disposition: "MERGED_PARAMETER_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-020", label: "Least repeated-digit length giving divisibility", prototypeAncestry: ["NUM-CP008-PROT-025"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
  { candidateId: "NUM-CP008-CAND-021", label: "Greatest bounded solution of a compatible congruence system", prototypeAncestry: ["NUM-CP008-PROT-027"], disposition: "SINGLETON_AUTHORITY", permanentQlId: null },
]);

export const NUM_CP008_ADVANCED_HOLDS = Object.freeze([
  { id: "ABSTRACT_MODULAR_INVERSE_TARGET", status: "ADVANCED_ENRICHMENT_HOLD" as const },
  { id: "UNRESTRICTED_GENERAL_CRT", status: "ADVANCED_ENRICHMENT_HOLD" as const },
  { id: "FERMAT_EULER_EXPONENT_REDUCTION", status: "ADVANCED_ENRICHMENT_HOLD" as const },
  { id: "WILSON_THEOREM_REMAINDER", status: "ADVANCED_ENRICHMENT_HOLD" as const },
]);

export const NUM_CP008_PROTECTED_NON_MERGES = Object.freeze([
  ["NUM-CP008-PROT-004", "NUM-CP008-PROT-005"],
  ["NUM-CP008-PROT-005", "NUM-CP008-PROT-006"],
  ["NUM-CP008-PROT-009", "NUM-CP008-PROT-010"],
  ["NUM-CP008-PROT-011", "NUM-CP008-PROT-024"],
  ["NUM-CP008-PROT-024", "NUM-CP008-PROT-027"],
  ["NUM-CP008-PROT-012", "NUM-CP008-PROT-013"],
  ["NUM-CP008-PROT-003", "NUM-CP008-PROT-014"],
  ["NUM-CP008-PROT-014", "NUM-CP008-PROT-018"],
  ["NUM-CP008-PROT-021", "NUM-CP008-PROT-022"],
] as const satisfies readonly (readonly [NumCp008DiscoveredPrototypeId, NumCp008DiscoveredPrototypeId])[]);

export const NUM_CP008_SATURATION_PROPOSAL = Object.freeze({
  checkpointId: "NUM-CP-008" as const,
  discoveredPrototypeCount: 28,
  proposedAuthorityCount: 21,
  prototypeReduction: 7,
  routineSourceGaps: 0,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-166" as const,
  proposalStatus: "AWAITING_EXPLICIT_COUNT_APPROVAL" as const,
  sourceSaturation: "PROPOSED_AFTER_WAVE04_GREEN" as const,
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});
