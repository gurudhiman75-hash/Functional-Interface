export type IneClosureDecision =
  | "PERMANENT_QL_CANDIDATE"
  | "GUIDED_ONLY";

export interface IneClosureGroup {
  candidateId: string;
  title: string;
  decision: IneClosureDecision;
  authorityIds: readonly string[];
  examScope: string;
  reason: string;
}

export const INE_001_CLOSURE_GROUPS: readonly IneClosureGroup[] = [
  {
    candidateId: "INE-QL-CAND-001",
    title: "Determine a symbolic relation",
    decision: "PERMANENT_QL_CANDIDATE",
    authorityIds: [
      "DETERMINE_DIRECT_RELATION",
      "DETERMINE_TRANSITIVE_RELATION",
      "DETERMINE_STRONGEST_DEFINITE_RELATION",
      "DETERMINE_RELATION_THROUGH_EQUALITY",
      "DETERMINE_LONG_CHAIN_RELATION",
      "DETERMINE_MULTI_ROUTE_RELATION",
      "APPLY_ALTERNATE_PATH_STRICTNESS",
      "DETERMINE_BRANCHED_GRAPH_RELATION",
      "FILTER_IRRELEVANT_STATEMENTS",
      "PROPAGATE_EQUALITY_ACROSS_BRANCHES",
    ],
    examScope: "SSC, Banking, Railways, and Punjab-state practice",
    reason:
      "These authorities share one answer contract; chain length and graph shape are controlled difficulty features.",
  },
  {
    candidateId: "INE-QL-CAND-002",
    title: "Determine a relation or conclude that it cannot be determined",
    decision: "PERMANENT_QL_CANDIDATE",
    authorityIds: [
      "DETERMINE_RELATION_OR_INDETERMINATE",
      "DETERMINE_DISCONNECTED_PAIR_RELATION",
    ],
    examScope: "SSC, Banking, Railways, and Punjab-state practice",
    reason:
      "Both authorities ask for the queried relation and admit an indeterminate answer; disconnectedness is a topology variant.",
  },
  {
    candidateId: "INE-QL-CAND-003",
    title: "Select a pair by whether its relation is definite",
    decision: "PERMANENT_QL_CANDIDATE",
    authorityIds: [
      "IDENTIFY_PAIR_WITH_DEFINITE_RELATION",
      "IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION",
    ],
    examScope: "Advanced reasoning practice",
    reason:
      "The renderer and solve process are identical; a target-definiteness flag changes which pair is selected.",
  },
  {
    candidateId: "INE-QL-CAND-004",
    title: "Select a conclusion by truth status",
    decision: "PERMANENT_QL_CANDIDATE",
    authorityIds: [
      "SELECT_VALID_CONCLUSION",
      "SELECT_INVALID_CONCLUSION",
      "IDENTIFY_DEFINITELY_TRUE_CONCLUSION",
      "IDENTIFY_POSSIBLY_TRUE_CONCLUSION",
      "IDENTIFY_IMPOSSIBLE_CONCLUSION",
      "SELECT_POSSIBLE_NOT_DEFINITE_CONCLUSION",
    ],
    examScope: "Banking and regulatory practice; diagnostic use elsewhere",
    reason:
      "All six select one conclusion from four; the required truth class is a parameter rather than a separate QL.",
  },
  {
    candidateId: "INE-QL-CAND-005",
    title: "Evaluate two conclusions",
    decision: "PERMANENT_QL_CANDIDATE",
    authorityIds: ["EVALUATE_TWO_CONCLUSIONS"],
    examScope: "Banking and regulatory mock format",
    reason:
      "This has the standard only-I, only-II, both, or neither answer contract.",
  },
  {
    candidateId: "INE-QL-CAND-006",
    title: "Evaluate either-or conclusions",
    decision: "PERMANENT_QL_CANDIDATE",
    authorityIds: [
      "RESOLVE_EITHER_OR_CONCLUSIONS",
      "RESOLVE_DEFINITE_PLUS_EITHER_OR",
    ],
    examScope: "Banking and regulatory mock format",
    reason:
      "Both require complementary-exhaustive reasoning; a separately definite conclusion is an optional scenario feature.",
  },
  {
    candidateId: "INE-QL-CAND-007",
    title: "Solve a linguistic inequality chain",
    decision: "PERMANENT_QL_CANDIDATE",
    authorityIds: [
      "SOLVE_LINGUISTIC_CHAIN",
      "SOLVE_MIXED_LINGUISTIC_SYMBOLIC_CHAIN",
    ],
    examScope: "Concept and exam-practice bridge",
    reason:
      "Mixed symbolic wording changes rendering, not the underlying relation query.",
  },
  {
    candidateId: "INE-QL-CAND-008",
    title: "Evaluate contextual linguistic conclusions",
    decision: "PERMANENT_QL_CANDIDATE",
    authorityIds: ["EVALUATE_CONTEXTUAL_LINGUISTIC_CONCLUSIONS"],
    examScope: "Concept and exam-practice bridge",
    reason:
      "This owns the conclusion-set interface after linguistic normalization.",
  },
  {
    candidateId: "INE-QL-CAND-009",
    title: "Solve a fixed-map coded inequality chain",
    decision: "PERMANENT_QL_CANDIDATE",
    authorityIds: ["SOLVE_FIXED_MAP_CODED_CHAIN"],
    examScope: "Banking and regulatory practice",
    reason: "The supplied code map is decoded before the ordinary relation query is solved.",
  },
  {
    candidateId: "INE-QL-CAND-010",
    title: "Evaluate fixed-map coded conclusions",
    decision: "PERMANENT_QL_CANDIDATE",
    authorityIds: ["EVALUATE_FIXED_MAP_CODED_CONCLUSIONS"],
    examScope: "Banking and regulatory practice",
    reason: "This uses a coded evidence renderer with a conclusion-set answer contract.",
  },
  {
    candidateId: "INE-QL-CAND-011",
    title: "Complete a missing inequality operator",
    decision: "PERMANENT_QL_CANDIDATE",
    authorityIds: [
      "COMPLETE_MISSING_CODED_OPERATOR",
      "RECONSTRUCT_MISSING_RELATION",
    ],
    examScope: "Banking and regulatory practice",
    reason:
      "Both are inverse relation tasks; coded and ordinary operators are renderer variants.",
  },
  {
    candidateId: "INE-QL-CAND-012",
    title: "Select an expression that establishes a relation",
    decision: "PERMANENT_QL_CANDIDATE",
    authorityIds: ["SELECT_CODED_EXPRESSION_FOR_RELATION"],
    examScope: "Banking and regulatory practice",
    reason: "The learner selects a whole coded expression rather than one operator.",
  },
  {
    candidateId: "INE-GUIDED-001",
    title: "Classify one conclusion",
    decision: "GUIDED_ONLY",
    authorityIds: [
      "EVALUATE_SINGLE_CONCLUSION",
      "CLASSIFY_SINGLE_CONCLUSION_TRUTH",
      "EVALUATE_INCLUSIVE_CONCLUSION_TRUTH",
    ],
    examScope: "Internal guided diagnostic",
    reason:
      "The three-state truth classifier is useful for teaching but is not exposed as a standard exam MCQ.",
  },
  {
    candidateId: "INE-GUIDED-002",
    title: "List all possible relations",
    decision: "GUIDED_ONLY",
    authorityIds: ["IDENTIFY_ALL_POSSIBLE_RELATIONS"],
    examScope: "Internal guided diagnostic",
    reason: "This explicitly teaches model uncertainty rather than reproducing a standard exam interface.",
  },
  {
    candidateId: "INE-GUIDED-003",
    title: "Recognize complementary pairs",
    decision: "GUIDED_ONLY",
    authorityIds: [
      "CLASSIFY_COMPLEMENTARY_PAIR",
      "IDENTIFY_COMPLEMENTARY_PAIR",
    ],
    examScope: "Internal guided concept practice",
    reason: "These teach the either-or rule used by the exam-facing conclusion QL.",
  },
  {
    candidateId: "INE-GUIDED-004",
    title: "Translate one linguistic inequality",
    decision: "GUIDED_ONLY",
    authorityIds: ["INTERPRET_LINGUISTIC_RELATION"],
    examScope: "Internal guided concept practice",
    reason: "Single-phrase translation is scaffolding for linguistic chain questions.",
  },
  {
    candidateId: "INE-GUIDED-005",
    title: "Decode or encode one fixed-map relation",
    decision: "GUIDED_ONLY",
    authorityIds: [
      "DECODE_FIXED_MAP_RELATION",
      "ENCODE_FIXED_MAP_RELATION",
    ],
    examScope: "Internal guided concept practice",
    reason: "These isolate code-key fluency before full coded chains are attempted.",
  },
  {
    candidateId: "INE-GUIDED-006",
    title: "Recover a coded relation map",
    decision: "GUIDED_ONLY",
    authorityIds: [
      "RECOVER_MISSING_MAP_ENTRY",
      "IDENTIFY_ONLY_CONSISTENT_CODE_MAP",
    ],
    examScope: "Internal guided discovery",
    reason: "Verified mainstream exam evidence is insufficient for an exam-facing label.",
  },
  {
    candidateId: "INE-GUIDED-007",
    title: "Advanced statement synthesis",
    decision: "GUIDED_ONLY",
    authorityIds: [
      "SELECT_SET_ESTABLISHING_RELATION",
      "IDENTIFY_CONTRADICTORY_ADDITION",
    ],
    examScope: "Internal guided advanced practice",
    reason: "These are valid reasoning tasks but are not represented as mainstream exam interfaces.",
  },
] as const;

export const INE_001_PERMANENT_QL_CANDIDATES = INE_001_CLOSURE_GROUPS.filter(
  (group) => group.decision === "PERMANENT_QL_CANDIDATE",
);

export const INE_001_GUIDED_GROUPS = INE_001_CLOSURE_GROUPS.filter(
  (group) => group.decision === "GUIDED_ONLY",
);

export const INE_001_ACTIVATION_STATE = {
  permanentQlIdsAllocated: false,
  questionStudioVisible: false,
  localizationEnabled: false,
  publicReleaseEnabled: false,
} as const;
