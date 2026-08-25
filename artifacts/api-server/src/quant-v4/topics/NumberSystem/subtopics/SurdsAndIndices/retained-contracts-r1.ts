import type { SriCheckpointId } from "./discovery-types";

export interface SriRetainedContractR1 {
  readonly retainedGroupId: `SRI-RG-${string}`;
  readonly ownerCheckpointId: SriCheckpointId;
  readonly title: string;
  readonly memberCandidateIds: readonly string[];
  readonly sourceGated: boolean;
}

/**
 * R1 compression authority only. These IDs are NOT permanent solve-mode or QL IDs.
 * Every executable discovery candidate must belong to exactly one group.
 */
export const SRI_RETAINED_CONTRACTS_R1: readonly SriRetainedContractR1[] = [
  { retainedGroupId: "SRI-RG-001", ownerCheckpointId: "SRI-CP-001", title: "same-base exponent combination with product/quotient operator", memberCandidateIds: ["C001-A", "C001-B"], sourceGated: false },
  { retainedGroupId: "SRI-RG-002", ownerCheckpointId: "SRI-CP-001", title: "power raised to a power", memberCandidateIds: ["C001-C"], sourceGated: false },
  { retainedGroupId: "SRI-RG-003", ownerCheckpointId: "SRI-CP-001", title: "multi-law product/quotient exponent compression", memberCandidateIds: ["C001-D"], sourceGated: false },
  { retainedGroupId: "SRI-RG-004", ownerCheckpointId: "SRI-CP-001", title: "zero exponent with non-zero base", memberCandidateIds: ["C001-E"], sourceGated: false },
  { retainedGroupId: "SRI-RG-005", ownerCheckpointId: "SRI-CP-001", title: "same-exponent different-base combination", memberCandidateIds: ["C001-F", "C001-G", "C003-D"], sourceGated: false },
  { retainedGroupId: "SRI-RG-006", ownerCheckpointId: "SRI-CP-001", title: "equivalent-expression selection using index laws", memberCandidateIds: ["C001-H"], sourceGated: false },

  { retainedGroupId: "SRI-RG-007", ownerCheckpointId: "SRI-CP-002", title: "negative integer exponent reciprocal normalization", memberCandidateIds: ["C002-A"], sourceGated: false },
  { retainedGroupId: "SRI-RG-008", ownerCheckpointId: "SRI-CP-002", title: "signed exponent combination", memberCandidateIds: ["C002-B"], sourceGated: false },
  { retainedGroupId: "SRI-RG-009", ownerCheckpointId: "SRI-CP-002", title: "signed fractional exponent on exact integer perfect-power base", memberCandidateIds: ["C002-C", "C002-D", "C002-E"], sourceGated: false },
  { retainedGroupId: "SRI-RG-010", ownerCheckpointId: "SRI-CP-002", title: "signed fractional exponent on exact rational or terminating-decimal base", memberCandidateIds: ["C002-F", "C002-G", "C002-H"], sourceGated: false },
  { retainedGroupId: "SRI-RG-011", ownerCheckpointId: "SRI-CP-002", title: "zero-base undefined edge conditions", memberCandidateIds: ["C002-I"], sourceGated: false },
  { retainedGroupId: "SRI-RG-012", ownerCheckpointId: "SRI-CP-002", title: "negative-base rational exponent with denominator-parity domain proof", memberCandidateIds: ["C002-J", "C002-K"], sourceGated: false },

  { retainedGroupId: "SRI-RG-013", ownerCheckpointId: "SRI-CP-003", title: "rewrite composite or reciprocal expressions to a common base", memberCandidateIds: ["C003-A", "C003-C"], sourceGated: false },
  { retainedGroupId: "SRI-RG-014", ownerCheckpointId: "SRI-CP-003", title: "simplify after base harmonisation including mixed exponents", memberCandidateIds: ["C003-B", "C003-E"], sourceGated: false },
  { retainedGroupId: "SRI-RG-015", ownerCheckpointId: "SRI-CP-003", title: "equivalence decision after power normalization", memberCandidateIds: ["C003-F"], sourceGated: false },

  { retainedGroupId: "SRI-RG-016", ownerCheckpointId: "SRI-CP-004", title: "transform supplied a^x to affine exponent target a^(mx+k)", memberCandidateIds: ["C004-A", "C004-B", "C004-C"], sourceGated: false },
  { retainedGroupId: "SRI-RG-017", ownerCheckpointId: "SRI-CP-004", title: "combine two supplied power relations into one target", memberCandidateIds: ["C004-D"], sourceGated: false },
  { retainedGroupId: "SRI-RG-018", ownerCheckpointId: "SRI-CP-004", title: "recover parameter from transformed power relation", memberCandidateIds: ["C004-E", "C004-F"], sourceGated: false },
  { retainedGroupId: "SRI-RG-019", ownerCheckpointId: "SRI-CP-004", title: "parameter recovery followed by secondary target", memberCandidateIds: ["C004-G"], sourceGated: false },

  { retainedGroupId: "SRI-RG-020", ownerCheckpointId: "SRI-CP-005", title: "same-base linear exponent equation", memberCandidateIds: ["C005-A", "C005-B"], sourceGated: false },
  { retainedGroupId: "SRI-RG-021", ownerCheckpointId: "SRI-CP-005", title: "common or reciprocal-base normalization exponent equation", memberCandidateIds: ["C005-C", "C005-I"], sourceGated: false },
  { retainedGroupId: "SRI-RG-022", ownerCheckpointId: "SRI-CP-005", title: "factor common exponential term in sum or difference equation", memberCandidateIds: ["C005-D", "C005-E"], sourceGated: false },
  { retainedGroupId: "SRI-RG-023", ownerCheckpointId: "SRI-CP-005", title: "quadratic in a^x substitution", memberCandidateIds: ["C005-F"], sourceGated: false },
  { retainedGroupId: "SRI-RG-024", ownerCheckpointId: "SRI-CP-005", title: "chained equal-power relation", memberCandidateIds: ["C005-G"], sourceGated: false },
  { retainedGroupId: "SRI-RG-025", ownerCheckpointId: "SRI-CP-005", title: "solve exponent then evaluate derived target", memberCandidateIds: ["C005-H"], sourceGated: false },

  { retainedGroupId: "SRI-RG-026", ownerCheckpointId: "SRI-CP-006", title: "exact two-quantity power comparison after normalization", memberCandidateIds: ["C006-A", "C006-C", "C006-D", "C006-G"], sourceGated: false },
  { retainedGroupId: "SRI-RG-027", ownerCheckpointId: "SRI-CP-006", title: "order three or more powers", memberCandidateIds: ["C006-B"], sourceGated: false },
  { retainedGroupId: "SRI-RG-028", ownerCheckpointId: "SRI-CP-006", title: "single index-law statement correctness", memberCandidateIds: ["C006-E"], sourceGated: false },
  { retainedGroupId: "SRI-RG-029", ownerCheckpointId: "SRI-CP-006", title: "two-statement index-law truth-set", memberCandidateIds: ["C006-F"], sourceGated: false },

  { retainedGroupId: "SRI-RG-030", ownerCheckpointId: "SRI-CP-007", title: "simplify supported nth root by extracting perfect nth powers", memberCandidateIds: ["C007-A", "C007-B", "C007-C"], sourceGated: false },
  { retainedGroupId: "SRI-RG-031", ownerCheckpointId: "SRI-CP-007", title: "classify radical as rational or surd across supported indices", memberCandidateIds: ["C007-D"], sourceGated: false },
  { retainedGroupId: "SRI-RG-032", ownerCheckpointId: "SRI-CP-007", title: "classify result of exact radical arithmetic", memberCandidateIds: ["C007-E"], sourceGated: false },
  { retainedGroupId: "SRI-RG-033", ownerCheckpointId: "SRI-CP-007", title: "radical and fractional-index representation conversion", memberCandidateIds: ["C007-F"], sourceGated: false },

  { retainedGroupId: "SRI-RG-034", ownerCheckpointId: "SRI-CP-008", title: "simplify if needed then combine like surds", memberCandidateIds: ["C008-A", "C008-B"], sourceGated: false },
  { retainedGroupId: "SRI-RG-035", ownerCheckpointId: "SRI-CP-008", title: "exact product or quotient of supported surds", memberCandidateIds: ["C008-C", "C008-D"], sourceGated: false },
  { retainedGroupId: "SRI-RG-036", ownerCheckpointId: "SRI-CP-008", title: "multiply surd binomials or finite sums including square", memberCandidateIds: ["C008-E", "C008-G"], sourceGated: false },
  { retainedGroupId: "SRI-RG-037", ownerCheckpointId: "SRI-CP-008", title: "conjugate product difference-of-squares identity", memberCandidateIds: ["C008-F"], sourceGated: false },
  { retainedGroupId: "SRI-RG-038", ownerCheckpointId: "SRI-CP-008", title: "rational or irrational result after exact surd arithmetic", memberCandidateIds: ["C008-H"], sourceGated: false },
  { retainedGroupId: "SRI-RG-039", ownerCheckpointId: "SRI-CP-008", title: "condition for exceptional root-sum identity", memberCandidateIds: ["C008-I"], sourceGated: true },

  { retainedGroupId: "SRI-RG-040", ownerCheckpointId: "SRI-CP-009", title: "rationalise supported monomial radical denominator", memberCandidateIds: ["C009-A", "C009-B"], sourceGated: false },
  { retainedGroupId: "SRI-RG-041", ownerCheckpointId: "SRI-CP-009", title: "rationalise two-term quadratic-surd denominator by conjugate", memberCandidateIds: ["C009-C", "C009-D", "C009-E"], sourceGated: false },
  { retainedGroupId: "SRI-RG-042", ownerCheckpointId: "SRI-CP-009", title: "combine multiple rationalised terms to canonical surd form", memberCandidateIds: ["C009-F"], sourceGated: false },
  { retainedGroupId: "SRI-RG-043", ownerCheckpointId: "SRI-CP-009", title: "recover canonical coefficients and optional derived target", memberCandidateIds: ["C009-G", "C009-H"], sourceGated: false },

  { retainedGroupId: "SRI-RG-044", ownerCheckpointId: "SRI-CP-010", title: "denest sqrt(A plus or minus 2sqrt(B))", memberCandidateIds: ["C010-A", "C010-B"], sourceGated: false },
  { retainedGroupId: "SRI-RG-045", ownerCheckpointId: "SRI-CP-010", title: "decide exact denestability", memberCandidateIds: ["C010-C"], sourceGated: false },
  { retainedGroupId: "SRI-RG-046", ownerCheckpointId: "SRI-CP-010", title: "inverse denesting and hidden-parameter recovery", memberCandidateIds: ["C010-D", "C010-E"], sourceGated: false },
  { retainedGroupId: "SRI-RG-047", ownerCheckpointId: "SRI-CP-010", title: "repeating infinite-radical fixed point", memberCandidateIds: ["C010-F"], sourceGated: true },

  { retainedGroupId: "SRI-RG-048", ownerCheckpointId: "SRI-CP-011", title: "compare coefficient-bearing same-index square surds", memberCandidateIds: ["C011-A", "C011-B"], sourceGated: false },
  { retainedGroupId: "SRI-RG-049", ownerCheckpointId: "SRI-CP-011", title: "compare radicals of different indices via common exact power", memberCandidateIds: ["C011-C"], sourceGated: false },
  { retainedGroupId: "SRI-RG-050", ownerCheckpointId: "SRI-CP-011", title: "exact bounds for positive irrational radicals including scaling", memberCandidateIds: ["C011-D", "C011-E"], sourceGated: false },
  { retainedGroupId: "SRI-RG-051", ownerCheckpointId: "SRI-CP-011", title: "conjugate or reciprocal transformed surd values", memberCandidateIds: ["C011-F", "C009-I"], sourceGated: false },
  { retainedGroupId: "SRI-RG-052", ownerCheckpointId: "SRI-CP-011", title: "solve bounded radical equation with original-domain verification", memberCandidateIds: ["C011-G"], sourceGated: false },
  { retainedGroupId: "SRI-RG-053", ownerCheckpointId: "SRI-CP-011", title: "reject extraneous radical-equation candidate after squaring", memberCandidateIds: ["C011-H"], sourceGated: false },
  { retainedGroupId: "SRI-RG-054", ownerCheckpointId: "SRI-CP-011", title: "statement truth-set using exact surd comparison or bounds", memberCandidateIds: ["C011-I"], sourceGated: false },
  { retainedGroupId: "SRI-RG-055", ownerCheckpointId: "SRI-CP-011", title: "compare positive finite surd sums exactly by squaring", memberCandidateIds: ["C011-J"], sourceGated: false },

  { retainedGroupId: "SRI-RG-056", ownerCheckpointId: "SRI-CP-012", title: "bidirectional mixed radical-index simplification", memberCandidateIds: ["C012-A", "C012-B"], sourceGated: false },
  { retainedGroupId: "SRI-RG-057", ownerCheckpointId: "SRI-CP-012", title: "compare radical and index representations", memberCandidateIds: ["C012-C"], sourceGated: false },
  { retainedGroupId: "SRI-RG-058", ownerCheckpointId: "SRI-CP-012", title: "solve short mixed radical-index equation", memberCandidateIds: ["C012-D"], sourceGated: false },
  { retainedGroupId: "SRI-RG-059", ownerCheckpointId: "SRI-CP-012", title: "transformed target requiring surd and index steps", memberCandidateIds: ["C012-E"], sourceGated: false },
] as const;
