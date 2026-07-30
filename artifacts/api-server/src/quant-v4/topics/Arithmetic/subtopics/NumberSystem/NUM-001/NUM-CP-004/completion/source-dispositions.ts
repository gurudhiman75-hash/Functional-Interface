export type NumCp004SourceDisposition =
  | "RETAIN"
  | "MERGE_DIRECTION_PARAMETER"
  | "MERGE_RELATION_PARAMETER"
  | "MERGE_AS_REPRESENTATION_PARAMETER"
  | "MERGE_INTO_CLAIM_AUTHORITIES"
  | "SPLIT_FROM_EXPONENT"
  | "SPLIT_FROM_PRIME"
  | "SPLIT_BY_ANSWER_SEMANTIC"
  | "RETAIN_REPRESENTATION_CHANGES_EVIDENCE"
  | "RETAIN_REPRESENTATION_CHANGES_INFERENCE"
  | "RETAIN_OPTIMISATION"
  | "ADVANCED_ENRICHMENT_HOLD"
  | "REASSIGN_NUM_CP005"
  | "REASSIGN_NUM_CP006"
  | "REASSIGN_NUM_CP012"
  | "REASSIGN_P_AND_C";

export interface NumCp004SourceDispositionRow {
  readonly sourceFamily: string;
  readonly disposition: NumCp004SourceDisposition;
  readonly retainedTemplateRefs: readonly string[];
  readonly rationale: string;
}

export const NUM_CP004_SOURCE_DISPOSITIONS = [
  { sourceFamily: "classify prime/composite/unit/neither", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-01"], rationale: "Distinct four-class domain including zero, one and negative inputs." },
  { sourceFamily: "find primes in bounded interval", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-02"], rationale: "Complete-set answer requires exhaustive bounded enumeration." },
  { sourceFamily: "count primes in bounded interval", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-03"], rationale: "Count projection has a different answer semantic and distractor space from set enumeration." },
  { sourceFamily: "least/greatest/next/previous prime", disposition: "MERGE_DIRECTION_PARAMETER", retainedTemplateRefs: ["NUM-CP004-QLT-04"], rationale: "Same bounded prime-location invariant; direction is a live parameter." },
  { sourceFamily: "select prime under digit/range constraint", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-05"], rationale: "Combines digit evidence with unique bounded primality." },
  { sourceFamily: "verify prime claim", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-06"], rationale: "Statement evaluation changes the evidence and truth-value answer semantic." },
  { sourceFamily: "prime factorisation", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-07"], rationale: "Complete decomposition is the central CP invariant." },
  { sourceFamily: "smallest/largest prime factor", disposition: "MERGE_DIRECTION_PARAMETER", retainedTemplateRefs: ["NUM-CP004-QLT-08"], rationale: "Both project an extremum from the same factor support." },
  { sourceFamily: "distinct prime-factor count", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-09"], rationale: "Counts support rather than multiplicity." },
  { sourceFamily: "total prime-factor count with multiplicity", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-10"], rationale: "Multiplicity count has a materially different misconception profile." },
  { sourceFamily: "recover integer from factorisation", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-11"], rationale: "Reverse multiplication direction is distinct from factorising an integer." },
  { sourceFamily: "compare prime-exponent structures", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-12"], rationale: "Table comparison asks a structural relation rather than a numerical projection." },
  { sourceFamily: "complete missing prime", disposition: "SPLIT_FROM_EXPONENT", retainedTemplateRefs: ["NUM-CP004-QLT-13"], rationale: "Missing base prime uses primality and divisibility evidence." },
  { sourceFamily: "complete missing exponent", disposition: "SPLIT_FROM_PRIME", retainedTemplateRefs: ["NUM-CP004-QLT-14"], rationale: "Missing exponent uses repeated division or power comparison." },
  { sourceFamily: "select co-prime pair", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-15"], rationale: "Pair selection has option-owned pairwise gcd traps." },
  { sourceFamily: "complete bounded co-prime set", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-16"], rationale: "Requires all valid candidates, not one example." },
  { sourceFamily: "count bounded co-prime values", disposition: "SPLIT_BY_ANSWER_SEMANTIC", retainedTemplateRefs: ["NUM-CP004-QLT-17"], rationale: "Count projection is distinct from returning the complete set." },
  { sourceFamily: "recover co-prime unknown", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-18"], rationale: "Inverse candidate recovery is a separate direction." },
  { sourceFamily: "pairwise versus collectively co-prime", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-19"], rationale: "The pairwise/collective distinction is a required edge topology." },
  { sourceFamily: "verify co-prime claim", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-20"], rationale: "Claim truth is not equivalent to selecting a pair or set." },
  { sourceFamily: "prime pair from sum/difference/product", disposition: "MERGE_RELATION_PARAMETER", retainedTemplateRefs: ["NUM-CP004-QLT-21"], rationale: "Relation changes but bounded pair reconstruction algorithm remains one authority." },
  { sourceFamily: "bounded prime triple", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-22"], rationale: "Three-prime reconstruction has a distinct state and answer semantic." },
  { sourceFamily: "least prime divisor", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-23"], rationale: "First-factor detection is not full factorisation." },
  { sourceFamily: "prime divisor of constructed expression", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-24"], rationale: "Expression construction changes visible evidence and targeted divisor inference." },
  { sourceFamily: "possible/impossible prime structure", disposition: "RETAIN", retainedTemplateRefs: ["NUM-CP004-QLT-25"], rationale: "Feasibility classification covers no-solution and boundary logic." },
  { sourceFamily: "factor-tree completion", disposition: "RETAIN_REPRESENTATION_CHANGES_EVIDENCE", retainedTemplateRefs: ["NUM-CP004-QLT-26"], rationale: "The tree exposes parent-child products unavailable in plain factorisation prose." },
  { sourceFamily: "prime data sufficiency", disposition: "RETAIN_REPRESENTATION_CHANGES_INFERENCE", retainedTemplateRefs: ["NUM-CP004-QLT-27"], rationale: "Sufficiency requires statement ablation and four-class evidence evaluation." },
  { sourceFamily: "minimum adjustment to nearest prime", disposition: "RETAIN_OPTIMISATION", retainedTemplateRefs: ["NUM-CP004-QLT-28"], rationale: "Nearest-prime optimisation includes one-answer and tie sets." },
  { sourceFamily: "prime-exponent table", disposition: "MERGE_AS_REPRESENTATION_PARAMETER", retainedTemplateRefs: ["NUM-CP004-QLT-12"], rationale: "Table is retained where it changes comparison evidence, not as duplicate layout." },
  { sourceFamily: "statement set", disposition: "MERGE_INTO_CLAIM_AUTHORITIES", retainedTemplateRefs: ["NUM-CP004-QLT-06", "NUM-CP004-QLT-20", "NUM-CP004-QLT-25"], rationale: "Statement representation is owned by the relevant prime, co-prime or feasibility inference." },
  { sourceFamily: "Euler totient", disposition: "ADVANCED_ENRICHMENT_HOLD", retainedTemplateRefs: [], rationale: "Outside current SSC-facing elementary CP boundary." },
  { sourceFamily: "formula-led co-prime count", disposition: "ADVANCED_ENRICHMENT_HOLD", retainedTemplateRefs: [], rationale: "Bounded explicit enumeration is retained; totient shortcut remains held." },
  { sourceFamily: "special prime theorems", disposition: "ADVANCED_ENRICHMENT_HOLD", retainedTemplateRefs: [], rationale: "Not source-saturated for the target exam scope." },
  { sourceFamily: "divisor count/sum/product", disposition: "REASSIGN_NUM_CP005", retainedTemplateRefs: [], rationale: "Final target is a divisor function." },
  { sourceFamily: "HCF/LCM target", disposition: "REASSIGN_NUM_CP006", retainedTemplateRefs: [], rationale: "Final target is HCF or LCM rather than prime structure." },
  { sourceFamily: "perfect-power completion", disposition: "REASSIGN_NUM_CP012", retainedTemplateRefs: [], rationale: "Final target is perfect-square/cube/general-power completion." },
  { sourceFamily: "arrangements of prime selections", disposition: "REASSIGN_P_AND_C", retainedTemplateRefs: [], rationale: "Prime status is a filter; arrangement/selection is the governing inference." },
] as const satisfies readonly NumCp004SourceDispositionRow[];
