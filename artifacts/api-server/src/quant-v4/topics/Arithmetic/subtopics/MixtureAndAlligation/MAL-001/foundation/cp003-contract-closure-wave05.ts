import { MAL_CP003_DISCOVERY_PROTOTYPE_IDS } from "./cp003-types";
import { MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS } from "./cp003-source-contract-wave04";

export const MAL_CP003_WAVE05_ALL_CANDIDATE_IDS = [
  ...MAL_CP003_DISCOVERY_PROTOTYPE_IDS,
  ...MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS,
] as const;

export type MalCp003Wave05CandidateId =
  (typeof MAL_CP003_WAVE05_ALL_CANDIDATE_IDS)[number];

export type MalCp003Wave05Kernel =
  | "SCALAR_EQUAL_STAGE_FORWARD_STATE"
  | "SCALAR_EQUAL_STAGE_INVERSE_STATE"
  | "SCALAR_UNEQUAL_STAGE_PRODUCT"
  | "VECTOR_COMPONENT_STAGE_LEDGER"
  | "CONCENTRATION_TRANSFORMATION_BOUNDARY";

export type MalCp003Wave05EvidenceStatus =
  | "DIRECT_MULTI_SOURCE"
  | "DIRECT_SINGLE_SOURCE"
  | "DIRECT_LEGACY_RUNTIME_ONLY"
  | "REPRESENTATION_CLOSURE_ONLY"
  | "INVERSE_CLOSURE_ONLY"
  | "BOUNDARY_CONSTRUCTION_ONLY"
  | "CROSS_CHECKPOINT_SOURCE_BOUNDARY";

export type MalCp003Wave05Decision =
  | "RETAIN_DISTINCT_SOURCE_BACKED"
  | "RETAIN_PROVISIONAL_PENDING_SOURCE"
  | "MERGE_CANDIDATE_PENDING_SOURCE"
  | "EXCLUDE_TO_MAL_CP004";

export interface MalCp003Wave05ContractDecision {
  candidateId: MalCp003Wave05CandidateId;
  kernel: MalCp003Wave05Kernel;
  evidenceStatus: MalCp003Wave05EvidenceStatus;
  decision: MalCp003Wave05Decision;
  mergeTarget: MalCp003Wave05CandidateId | null;
  learnerContractReason: string;
  remainingFreezeBlockers: readonly string[];
}

export const MAL_CP003_WAVE05_CONTRACT_DECISIONS:
  readonly MalCp003Wave05ContractDecision[] = [
    {
      candidateId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
      kernel: "SCALAR_EQUAL_STAGE_FORWARD_STATE",
      evidenceStatus: "DIRECT_MULTI_SOURCE",
      decision: "RETAIN_DISTINCT_SOURCE_BACKED",
      mergeTarget: null,
      learnerContractReason:
        "Direct legacy runtime, uploaded textbook and internal reviewed-runtime evidence all preserve the final original-component quantity as the requested answer.",
      remainingFreezeBlockers: [
        "chapter-wide source completeness",
        "misconception and distractor audit",
        "final editorial review",
      ],
    },
    {
      candidateId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-FRACTION-EQUAL-REPLACEMENTS",
      kernel: "SCALAR_EQUAL_STAGE_FORWARD_STATE",
      evidenceStatus: "REPRESENTATION_CLOSURE_ONLY",
      decision: "MERGE_CANDIDATE_PENDING_SOURCE",
      mergeTarget:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
      learnerContractReason:
        "The final fraction is the same hidden state divided by the known initial original quantity. No recovered source yet proves a materially separate exam task rather than an answer-format representation.",
      remainingFreezeBlockers: [
        "direct exam-source recovery",
        "answer-format versus QL-identity decision",
      ],
    },
    {
      candidateId:
        "MAL-CP003-PROT-FINAL-REFILL-QUANTITY-EQUAL-REPLACEMENTS",
      kernel: "SCALAR_EQUAL_STAGE_FORWARD_STATE",
      evidenceStatus: "REPRESENTATION_CLOSURE_ONLY",
      decision: "MERGE_CANDIDATE_PENDING_SOURCE",
      mergeTarget:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
      learnerContractReason:
        "The refill quantity is the vessel-volume complement of the final original quantity. It remains a merge candidate until direct source evidence proves that the requested component changes the learner contract enough to require a separate QL.",
      remainingFreezeBlockers: [
        "direct exam-source recovery",
        "requested-component distractor audit",
      ],
    },
    {
      candidateId: "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL",
      kernel: "SCALAR_EQUAL_STAGE_INVERSE_STATE",
      evidenceStatus: "INVERSE_CLOSURE_ONLY",
      decision: "RETAIN_PROVISIONAL_PENDING_SOURCE",
      mergeTarget: null,
      learnerContractReason:
        "The unknown is the initial original-component quantity while vessel volume and final original quantity are supplied. This is algebraically inverse to the forward state but has a distinct unknown-variable contract.",
      remainingFreezeBlockers: [
        "direct exam-source recovery",
        "inverse determinacy audit across non-pure initial states",
      ],
    },
    {
      candidateId: "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL",
      kernel: "SCALAR_EQUAL_STAGE_INVERSE_STATE",
      evidenceStatus: "INVERSE_CLOSURE_ONLY",
      decision: "RETAIN_PROVISIONAL_PENDING_SOURCE",
      mergeTarget: null,
      learnerContractReason:
        "The unknown is the equal amount removed per operation and exact nth-root determinacy is part of the task contract.",
      remainingFreezeBlockers: [
        "direct exam-source recovery",
        "non-exact-root and approximation policy",
        "impossible-state handling",
      ],
    },
    {
      candidateId: "MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL",
      kernel: "SCALAR_EQUAL_STAGE_INVERSE_STATE",
      evidenceStatus: "INVERSE_CLOSURE_ONLY",
      decision: "RETAIN_PROVISIONAL_PENDING_SOURCE",
      mergeTarget: null,
      learnerContractReason:
        "The answer is a discrete count and uniqueness must be proved over the declared operation domain; this is not only a numeric representation of another inverse output.",
      remainingFreezeBlockers: [
        "direct exam-source recovery",
        "maximum-domain authority",
        "no-solution and multiple-solution policy",
      ],
    },
    {
      candidateId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS",
      kernel: "SCALAR_UNEQUAL_STAGE_PRODUCT",
      evidenceStatus: "BOUNDARY_CONSTRUCTION_ONLY",
      decision: "RETAIN_PROVISIONAL_PENDING_SOURCE",
      mergeTarget: null,
      learnerContractReason:
        "Unequal stage removals use a product of distinct retention factors. The equal-stage power is a special case, but the visible stage ledger and calculation burden are materially different.",
      remainingFreezeBlockers: [
        "direct exam-source recovery",
        "stage-order and repeated-amount duplicate audit",
        "difficulty calibration",
      ],
    },
    {
      candidateId: "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION",
      kernel: "VECTOR_COMPONENT_STAGE_LEDGER",
      evidenceStatus: "BOUNDARY_CONSTRUCTION_ONLY",
      decision: "RETAIN_PROVISIONAL_PENDING_SOURCE",
      mergeTarget: null,
      learnerContractReason:
        "Different refill liquids require a full component vector ledger; a scalar original-liquid retention value cannot reconstruct every requested final component.",
      remainingFreezeBlockers: [
        "direct exam-source recovery",
        "component-order representation audit",
        "CP-003 versus multi-vessel ownership review",
      ],
    },
    {
      candidateId:
        "MAL-CP003-PROT-SUCCESSIVE-DILUTION-CONCENTRATION-BOUNDARY",
      kernel: "CONCENTRATION_TRANSFORMATION_BOUNDARY",
      evidenceStatus: "CROSS_CHECKPOINT_SOURCE_BOUNDARY",
      decision: "EXCLUDE_TO_MAL_CP004",
      mergeTarget: null,
      learnerContractReason:
        "Replacing with a liquid that has its own concentration is a conserved-solute transformation, not pure geometric retention of one original component.",
      remainingFreezeBlockers: [],
    },
    {
      candidateId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS",
      kernel: "SCALAR_EQUAL_STAGE_FORWARD_STATE",
      evidenceStatus: "DIRECT_MULTI_SOURCE",
      decision: "RETAIN_DISTINCT_SOURCE_BACKED",
      mergeTarget: null,
      learnerContractReason:
        "Uploaded textbook and internal reviewed-runtime sources both ask for an ordered reduced component ratio. Ratio orientation creates exam-significant answer semantics even though the hidden state is shared with final quantity.",
      remainingFreezeBlockers: [
        "final option-orientation distractor audit",
        "chapter-wide source completeness",
      ],
    },
    {
      candidateId: "MAL-CP003-PROT-VESSEL-VOLUME-FROM-FINAL-RATIO",
      kernel: "SCALAR_EQUAL_STAGE_INVERSE_STATE",
      evidenceStatus: "DIRECT_SINGLE_SOURCE",
      decision: "RETAIN_DISTINCT_SOURCE_BACKED",
      mergeTarget: null,
      learnerContractReason:
        "The uploaded textbook directly asks for vessel capacity from a final original:new-liquid ratio. The final evidence representation and unknown vessel size distinguish it from initial-component reconstruction from a final quantity.",
      remainingFreezeBlockers: [
        "second independent source",
        "non-exact-root and impossible-state policy",
        "final editorial review",
      ],
    },
  ] as const;

export const MAL_CP003_WAVE05_OWNERSHIP_EXCLUSIONS = [
  {
    pattern: "SINGLE_HOMOGENEOUS_REMOVE_REFILL_TO_TARGET_RATIO",
    owner: "MAL-CP-002",
    reason:
      "A single homogeneous remove-and-refill target-ratio transformation is already represented by the CP-002 single-replacement state transition.",
  },
  {
    pattern: "REPLACEMENT_BY_NONZERO_CONCENTRATION_LIQUID",
    owner: "MAL-CP-004",
    reason:
      "A replacement liquid carrying its own solute concentration requires conserved-solute accounting.",
  },
] as const;
