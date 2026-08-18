export type DsQlCandidateStatus = "INITIAL_ALLOCATION_READY" | "DEFERRED_FUTURE_CONTRACT";

export interface DsQlBoundaryCandidate {
  readonly candidateId: string;
  readonly permanentQlId: null;
  readonly status: DsQlCandidateStatus;
  readonly statementCount: 2 | 3;
  readonly taskContract: string;
  readonly ruleId: string;
  readonly answerSemantic: string;
  readonly supportedTargetFamilies: readonly string[];
  readonly presentationProfiles: readonly string[];
  readonly adapterPolicy: string;
  readonly rationale: string;
}

/**
 * CP-000 boundary freeze candidate inventory.
 * Candidate IDs are disposable; no DSF-QL-* permanent identity is assigned here.
 */
export const DSF_QL_BOUNDARY_CANDIDATES: readonly DsQlBoundaryCandidate[] = [
  {
    candidateId: "DSF-QL-CAND-001",
    permanentQlId: null,
    status: "INITIAL_ALLOCATION_READY",
    statementCount: 2,
    taskContract: "TWO_STATEMENT_TARGET_DETERMINACY",
    ruleId: "INFORMATION_SUFFICIENCY_TWO_STATEMENT",
    answerSemantic: "SUFFICIENCY_CLASS",
    supportedTargetFamilies: [
      "SCALAR_OR_EXACT_VALUE",
      "BOOLEAN_OR_CATEGORICAL_PROPERTY",
      "RANK_OR_POSITION",
      "IDENTITY",
      "DIRECTION_OR_DISTANCE",
      "RELATION",
      "COMPARISON",
      "COUNT",
    ],
    presentationProfiles: [
      "DS_STANDARD_5",
      "BANK_REORDERED_5",
      "SSC_SOURCE_PROFILE_4",
      "FUTURE_VERIFIED_PUNJAB_PROFILE",
    ],
    adapterPolicy: "Source chapter/domain changes are solve-mode and adapter metadata. They do not create a new QL when statement count, sufficiency semantics and learner task remain unchanged.",
    rationale: "Number System digit/parity, Algebra x+y and Ranking rank prototypes all pass through the same target-projection evaluator. Banking and SSC evidence further shows answer-option order/count is presentation, not a different learner reasoning task.",
  },
  {
    candidateId: "DSF-QL-CAND-002",
    permanentQlId: null,
    status: "DEFERRED_FUTURE_CONTRACT",
    statementCount: 3,
    taskContract: "THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS",
    ruleId: "INFORMATION_SUFFICIENCY_SUBSET_LATTICE",
    answerSemantic: "MINIMAL_SUFFICIENT_STATEMENT_SUBSET",
    supportedTargetFamilies: [
      "SCALAR_OR_EXACT_VALUE",
      "BOOLEAN_OR_CATEGORICAL_PROPERTY",
      "RELATIONAL_TARGETS",
    ],
    presentationProfiles: [
      "NAMED_STATEMENT_SUBSETS",
      "MIXED_MINIMAL_SUBSET_EXPRESSIONS",
    ],
    adapterPolicy: "Reuse the same source-domain adapters, but evaluate every relevant subset of I/II/III and render an exam-specific combination contract.",
    rationale: "IBPS CWE-III source patterns require combinations such as I+II or I plus either II/III. This cannot be represented safely by the two-statement five-class truth table even though both share the same core target-projection concept.",
  },
];

export const DSF_INITIAL_QL_ALLOCATION_PLAN = {
  candidateIds: ["DSF-QL-CAND-001"] as const,
  permanentQlCount: 1,
  deferredCandidateIds: ["DSF-QL-CAND-002"] as const,
  permanentIdsAllocated: false,
  reason: "Freeze one canonical two-statement QL first; expand domain coverage through adapters/solve modes. Add the separate three-statement contract only after its renderer and subset-combination QA are implemented.",
} as const;
