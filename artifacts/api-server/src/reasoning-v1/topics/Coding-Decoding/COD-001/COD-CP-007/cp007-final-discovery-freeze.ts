export const COD_CP007_FINAL_DISCOVERY_FREEZE_VERSION = "COD_CP007_ENGLISH_DISCOVERY_FREEZE_V1" as const;

export type Cp007CandidateDisposition =
  | "RETAIN"
  | "MERGE_PRESENTATION"
  | "DELEGATE_CP001"
  | "DELEGATE_CP005"
  | "DELEGATE_CP010"
  | "DELEGATE_NUMBER_SYSTEM"
  | "SOURCE_GAP_EXCLUDE";

export interface Cp007CandidateDecision {
  candidateId: string;
  disposition: Cp007CandidateDisposition;
  reason: string;
}

export const COD_CP007_CANDIDATE_DECISIONS: readonly Cp007CandidateDecision[] = [
  {
    candidateId: "UNIFORM_MODULAR_DIGIT_TRANSLATION",
    disposition: "RETAIN",
    reason: "Direct source evidence, material decimal-wrap semantics, leading-zero obligations and a saturated independent solver.",
  },
  {
    candidateId: "DIRECT_DIGIT_SUBSTITUTION",
    disposition: "SOURCE_GAP_EXCLUDE",
    reason: "No recurring standalone target-exam format was recovered; arbitrary character substitution remains CP-001 when the source domain is letters or words.",
  },
  {
    candidateId: "DIGIT_SYMBOL_BIJECTION",
    disposition: "DELEGATE_CP010",
    reason: "Recurring official digit/symbol lookup formats are conditional-matrix questions whose condition evaluation is the student operation.",
  },
  {
    candidateId: "POSITION_DEPENDENT_DIGIT_TRANSLATION",
    disposition: "SOURCE_GAP_EXCLUDE",
    reason: "Recurring digit-manipulation questions state odd/even or positional operations directly but do not establish a standalone coding-decoding inference family.",
  },
  {
    candidateId: "DIGIT_POSITION_PERMUTATION",
    disposition: "DELEGATE_CP005",
    reason: "Pure reversal or transposition has the same hidden state and solver obligation as the existing permutation checkpoint.",
  },
  {
    candidateId: "ALPHANUMERIC_DUAL_CHANNEL_TRANSFORM",
    disposition: "SOURCE_GAP_EXCLUDE",
    reason: "Search results resolve to alphanumeric series or synthetic practice, not recurring target-exam coding transforms with two materially active channels.",
  },
  {
    candidateId: "MIXED_TOKEN_SUBSTITUTION",
    disposition: "DELEGATE_CP001",
    reason: "Unconditional arbitrary token replacement does not create a new solve authority merely because digits or symbols appear among the tokens.",
  },
  {
    candidateId: "TWO_SYMBOL_POSITIONAL_NUMERAL_CODE",
    disposition: "DELEGATE_NUMBER_SYSTEM",
    reason: "The recurring @/% or #/& format is binary place-value conversion and arithmetic, not a CP-007 coding relation.",
  },
] as const;

export type Cp007FrozenSolveContractId =
  | "CP007-UNIFORM-EXPLICIT-FORWARD"
  | "CP007-UNIFORM-INVERSE-DECODE"
  | "CP007-UNIFORM-MISSING-DIGIT"
  | "CP007-UNIFORM-INFERRED-FORWARD";

export interface Cp007FrozenSolveContract {
  solveContractId: Cp007FrozenSolveContractId;
  taskKind: "ENCODE_TARGET" | "DECODE_TARGET" | "RECOVER_MISSING_TOKEN" | "INFER_AND_ENCODE";
  queryDirection: "FORWARD" | "INVERSE";
  ruleDisclosure: "EXPLICIT" | "INFER_FROM_EVIDENCE";
  answerType: "DIGIT_SEQUENCE" | "SINGLE_CODE_TOKEN";
  mergedPrototypeIds: readonly string[];
  permanentQlId: null;
}

export const COD_CP007_FROZEN_SOLVE_CONTRACTS: readonly Cp007FrozenSolveContract[] = [
  {
    solveContractId: "CP007-UNIFORM-EXPLICIT-FORWARD",
    taskKind: "ENCODE_TARGET",
    queryDirection: "FORWARD",
    ruleDisclosure: "EXPLICIT",
    answerType: "DIGIT_SEQUENCE",
    mergedPrototypeIds: ["COD-CP007-PROT-UNIFORM-DIGIT-ENCODE"],
    permanentQlId: null,
  },
  {
    solveContractId: "CP007-UNIFORM-INVERSE-DECODE",
    taskKind: "DECODE_TARGET",
    queryDirection: "INVERSE",
    ruleDisclosure: "INFER_FROM_EVIDENCE",
    answerType: "DIGIT_SEQUENCE",
    mergedPrototypeIds: ["COD-CP007-PROT-UNIFORM-DIGIT-DECODE"],
    permanentQlId: null,
  },
  {
    solveContractId: "CP007-UNIFORM-MISSING-DIGIT",
    taskKind: "RECOVER_MISSING_TOKEN",
    queryDirection: "FORWARD",
    ruleDisclosure: "INFER_FROM_EVIDENCE",
    answerType: "SINGLE_CODE_TOKEN",
    mergedPrototypeIds: ["COD-CP007-PROT-UNIFORM-DIGIT-MISSING"],
    permanentQlId: null,
  },
  {
    solveContractId: "CP007-UNIFORM-INFERRED-FORWARD",
    taskKind: "INFER_AND_ENCODE",
    queryDirection: "FORWARD",
    ruleDisclosure: "INFER_FROM_EVIDENCE",
    answerType: "DIGIT_SEQUENCE",
    mergedPrototypeIds: [
      "COD-CP007-PROT-UNIFORM-DIGIT-INFER-ENCODE",
      "COD-CP007-PROT-UNIFORM-DIGIT-CHOOSE-MATCHING",
    ],
    permanentQlId: null,
  },
] as const;

export const COD_CP007_DISCOVERY_FREEZE = {
  freezeVersion: COD_CP007_FINAL_DISCOVERY_FREEZE_VERSION,
  status: "ENGLISH_DISCOVERY_FROZEN",
  retainedRuleFamilies: ["UNIFORM_MODULAR_DIGIT_TRANSLATION"],
  solveContractCount: COD_CP007_FROZEN_SOLVE_CONTRACTS.length,
  nextAvailableQlId: "COD-QL-169",
  permanentQlCount: 0,
  questionStudioVisible: false,
  publiclyPublishable: false,
  localisationStarted: false,
} as const;
