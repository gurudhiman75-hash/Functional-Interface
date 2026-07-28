export type Cp009QlId =
  | "COD-QL-175" | "COD-QL-176" | "COD-QL-177" | "COD-QL-178" | "COD-QL-179"
  | "COD-QL-180" | "COD-QL-181" | "COD-QL-182" | "COD-QL-183" | "COD-QL-184"
  | "COD-QL-185" | "COD-QL-186" | "COD-QL-187" | "COD-QL-188"
  | "COD-QL-189" | "COD-QL-190" | "COD-QL-191" | "COD-QL-192"
  | "COD-QL-193" | "COD-QL-194" | "COD-QL-195" | "COD-QL-196"
  | "COD-QL-197" | "COD-QL-198";

export type Cp009Family =
  | "EXACT_ATOMIC"
  | "EXACT_SET_OR_MISSING"
  | "POSSIBLE_OR_IMPOSSIBLE_ATOMIC"
  | "POSSIBLE_SET"
  | "RESOLVED_COMPOSITION"
  | "COMPLETE_CANDIDATE_SET";

export type Cp009SolveContractId =
  | "CP009-EXACT-WORD-TO-TOKEN-DIRECT"
  | "CP009-EXACT-WORD-TO-TOKEN-CHAINED"
  | "CP009-EXACT-WORD-TO-TOKEN-DIFFERENCE"
  | "CP009-EXACT-WORD-TO-TOKEN-FORKED"
  | "CP009-EXACT-WORD-TO-TOKEN-GLOBAL"
  | "CP009-EXACT-TOKEN-TO-WORD-DIRECT"
  | "CP009-EXACT-TOKEN-TO-WORD-CHAINED"
  | "CP009-EXACT-TOKEN-TO-WORD-DIFFERENCE"
  | "CP009-EXACT-TOKEN-TO-WORD-FORKED"
  | "CP009-EXACT-TOKEN-TO-WORD-GLOBAL"
  | "CP009-EXACT-PHRASE-TO-TOKENS"
  | "CP009-EXACT-TOKENS-TO-PHRASE"
  | "CP009-MISSING-TOKEN"
  | "CP009-MISSING-WORD"
  | "CP009-POSSIBLE-WORD-TO-TOKEN"
  | "CP009-POSSIBLE-TOKEN-TO-WORD"
  | "CP009-IMPOSSIBLE-WORD-TO-TOKEN"
  | "CP009-IMPOSSIBLE-TOKEN-TO-WORD"
  | "CP009-POSSIBLE-WORD-SET-TO-TOKENS"
  | "CP009-POSSIBLE-TOKEN-SET-TO-WORDS"
  | "CP009-RESOLVED-WORDS-TO-TOKENS"
  | "CP009-RESOLVED-TOKENS-TO-WORDS"
  | "CP009-COMPLETE-CODE-CANDIDATE-SET"
  | "CP009-COMPLETE-WORD-CANDIDATE-SET";

export interface Cp009PermanentContract {
  qlId: Cp009QlId;
  checkpointId: "COD-CP-009";
  family: Cp009Family;
  solveContractId: Cp009SolveContractId;
  prototypeId: string;
  topologyKinds: readonly string[];
  status: "ENGLISH_RUNTIME_PROOF";
  publiclyPublishable: false;
  questionStudioVisible: false;
}

const EXACT_TOPOLOGIES = [
  "DIRECT_SINGLE_INTERSECTION",
  "CHAINED_SINGLETON_PROPAGATION",
  "SET_DIFFERENCE_ELIMINATION",
  "FORKED_EVIDENCE_JOIN",
  "GLOBAL_BIJECTION_DEDUCTION",
] as const;

const PARTIAL_TOPOLOGIES = [
  "CONTROLLED_PARTIAL_INFORMATION",
  "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION",
] as const;

export const COD_CP009_PERMANENT_CONTRACTS: readonly Cp009PermanentContract[] = [
  ...EXACT_TOPOLOGIES.map((topologyKind, index) => ({
    qlId: `COD-QL-${175 + index}` as Cp009QlId,
    checkpointId: "COD-CP-009" as const,
    family: "EXACT_ATOMIC" as const,
    solveContractId: [
      "CP009-EXACT-WORD-TO-TOKEN-DIRECT",
      "CP009-EXACT-WORD-TO-TOKEN-CHAINED",
      "CP009-EXACT-WORD-TO-TOKEN-DIFFERENCE",
      "CP009-EXACT-WORD-TO-TOKEN-FORKED",
      "CP009-EXACT-WORD-TO-TOKEN-GLOBAL",
    ][index] as Cp009SolveContractId,
    prototypeId: "COD-CP009-PROT-EXACT-WORD-TO-TOKEN",
    topologyKinds: [topologyKind],
    status: "ENGLISH_RUNTIME_PROOF" as const,
    publiclyPublishable: false as const,
    questionStudioVisible: false as const,
  })),
  ...EXACT_TOPOLOGIES.map((topologyKind, index) => ({
    qlId: `COD-QL-${180 + index}` as Cp009QlId,
    checkpointId: "COD-CP-009" as const,
    family: "EXACT_ATOMIC" as const,
    solveContractId: [
      "CP009-EXACT-TOKEN-TO-WORD-DIRECT",
      "CP009-EXACT-TOKEN-TO-WORD-CHAINED",
      "CP009-EXACT-TOKEN-TO-WORD-DIFFERENCE",
      "CP009-EXACT-TOKEN-TO-WORD-FORKED",
      "CP009-EXACT-TOKEN-TO-WORD-GLOBAL",
    ][index] as Cp009SolveContractId,
    prototypeId: "COD-CP009-PROT-EXACT-TOKEN-TO-WORD",
    topologyKinds: [topologyKind],
    status: "ENGLISH_RUNTIME_PROOF" as const,
    publiclyPublishable: false as const,
    questionStudioVisible: false as const,
  })),
  {
    qlId: "COD-QL-185", checkpointId: "COD-CP-009", family: "EXACT_SET_OR_MISSING",
    solveContractId: "CP009-EXACT-PHRASE-TO-TOKENS", prototypeId: "COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS",
    topologyKinds: ["PHRASE_SET_COMPOSITION"], status: "ENGLISH_RUNTIME_PROOF", publiclyPublishable: false, questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-186", checkpointId: "COD-CP-009", family: "EXACT_SET_OR_MISSING",
    solveContractId: "CP009-EXACT-TOKENS-TO-PHRASE", prototypeId: "COD-CP009-PROT-EXACT-TOKENS-TO-PHRASE",
    topologyKinds: ["PHRASE_SET_COMPOSITION"], status: "ENGLISH_RUNTIME_PROOF", publiclyPublishable: false, questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-187", checkpointId: "COD-CP-009", family: "EXACT_SET_OR_MISSING",
    solveContractId: "CP009-MISSING-TOKEN", prototypeId: "COD-CP009-PROT-MISSING-TOKEN",
    topologyKinds: ["MISSING_MEMBER_COMPLETION"], status: "ENGLISH_RUNTIME_PROOF", publiclyPublishable: false, questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-188", checkpointId: "COD-CP-009", family: "EXACT_SET_OR_MISSING",
    solveContractId: "CP009-MISSING-WORD", prototypeId: "COD-CP009-PROT-MISSING-WORD",
    topologyKinds: ["MISSING_MEMBER_COMPLETION"], status: "ENGLISH_RUNTIME_PROOF", publiclyPublishable: false, questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-189", checkpointId: "COD-CP-009", family: "POSSIBLE_OR_IMPOSSIBLE_ATOMIC",
    solveContractId: "CP009-POSSIBLE-WORD-TO-TOKEN", prototypeId: "COD-CP009-PROT-POSSIBLE-WORD-TO-TOKEN",
    topologyKinds: PARTIAL_TOPOLOGIES, status: "ENGLISH_RUNTIME_PROOF", publiclyPublishable: false, questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-190", checkpointId: "COD-CP-009", family: "POSSIBLE_OR_IMPOSSIBLE_ATOMIC",
    solveContractId: "CP009-POSSIBLE-TOKEN-TO-WORD", prototypeId: "COD-CP009-PROT-POSSIBLE-TOKEN-TO-WORD",
    topologyKinds: PARTIAL_TOPOLOGIES, status: "ENGLISH_RUNTIME_PROOF", publiclyPublishable: false, questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-191", checkpointId: "COD-CP-009", family: "POSSIBLE_OR_IMPOSSIBLE_ATOMIC",
    solveContractId: "CP009-IMPOSSIBLE-WORD-TO-TOKEN", prototypeId: "COD-CP009-PROT-IMPOSSIBLE-WORD-TO-TOKEN",
    topologyKinds: ["CONTROLLED_THREE_WAY_PARTIAL_INFORMATION"], status: "ENGLISH_RUNTIME_PROOF", publiclyPublishable: false, questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-192", checkpointId: "COD-CP-009", family: "POSSIBLE_OR_IMPOSSIBLE_ATOMIC",
    solveContractId: "CP009-IMPOSSIBLE-TOKEN-TO-WORD", prototypeId: "COD-CP009-PROT-IMPOSSIBLE-TOKEN-TO-WORD",
    topologyKinds: ["CONTROLLED_THREE_WAY_PARTIAL_INFORMATION"], status: "ENGLISH_RUNTIME_PROOF", publiclyPublishable: false, questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-193", checkpointId: "COD-CP-009", family: "POSSIBLE_SET",
    solveContractId: "CP009-POSSIBLE-WORD-SET-TO-TOKENS", prototypeId: "COD-CP009-PROT-POSSIBLE-WORD-SET-TO-TOKENS",
    topologyKinds: PARTIAL_TOPOLOGIES, status: "ENGLISH_RUNTIME_PROOF", publiclyPublishable: false, questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-194", checkpointId: "COD-CP-009", family: "POSSIBLE_SET",
    solveContractId: "CP009-POSSIBLE-TOKEN-SET-TO-WORDS", prototypeId: "COD-CP009-PROT-POSSIBLE-TOKEN-SET-TO-WORDS",
    topologyKinds: PARTIAL_TOPOLOGIES, status: "ENGLISH_RUNTIME_PROOF", publiclyPublishable: false, questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-195", checkpointId: "COD-CP-009", family: "RESOLVED_COMPOSITION",
    solveContractId: "CP009-RESOLVED-WORDS-TO-TOKENS", prototypeId: "COD-CP009-PROT-EXACT-RESOLVED-WORDS-TO-TOKENS",
    topologyKinds: ["RESOLVED_COMPONENT_COMPOSITION"], status: "ENGLISH_RUNTIME_PROOF", publiclyPublishable: false, questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-196", checkpointId: "COD-CP-009", family: "RESOLVED_COMPOSITION",
    solveContractId: "CP009-RESOLVED-TOKENS-TO-WORDS", prototypeId: "COD-CP009-PROT-EXACT-RESOLVED-TOKENS-TO-WORDS",
    topologyKinds: ["RESOLVED_COMPONENT_COMPOSITION"], status: "ENGLISH_RUNTIME_PROOF", publiclyPublishable: false, questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-197", checkpointId: "COD-CP-009", family: "COMPLETE_CANDIDATE_SET",
    solveContractId: "CP009-COMPLETE-CODE-CANDIDATE-SET", prototypeId: "COD-CP009-PROT-COMPLETE-CODE-CANDIDATE-SET",
    topologyKinds: PARTIAL_TOPOLOGIES, status: "ENGLISH_RUNTIME_PROOF", publiclyPublishable: false, questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-198", checkpointId: "COD-CP-009", family: "COMPLETE_CANDIDATE_SET",
    solveContractId: "CP009-COMPLETE-WORD-CANDIDATE-SET", prototypeId: "COD-CP009-PROT-COMPLETE-WORD-CANDIDATE-SET",
    topologyKinds: PARTIAL_TOPOLOGIES, status: "ENGLISH_RUNTIME_PROOF", publiclyPublishable: false, questionStudioVisible: false,
  },
] as const;

export function getCp009PermanentContract(qlId: Cp009QlId): Cp009PermanentContract {
  const contract = COD_CP009_PERMANENT_CONTRACTS.find((entry) => entry.qlId === qlId);
  if (!contract) throw new Error(`Unknown COD-CP-009 QL '${qlId}'`);
  return contract;
}
