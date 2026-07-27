import type { SentenceCodeTopologyKind } from "./topology-generator";

export type Cp009CandidateId = `COD-CP009-CAND-${string}`;

export type Cp009GeneratorFamily =
  | "EXACT_ATOMIC"
  | "EXACT_INVARIANT_SET"
  | "MISSING_MEMBER"
  | "POSSIBLE_ATOMIC"
  | "IMPOSSIBLE_ATOMIC"
  | "POSSIBLE_MIXED_SET"
  | "RESOLVED_COMPOSITION"
  | "COMPLETE_CANDIDATE_SET";

export interface Cp009QlCandidate {
  candidateId: Cp009CandidateId;
  prototypeId: string;
  generatorFamily: Cp009GeneratorFamily;
  queryDirection:
    | "WORD_TO_TOKEN"
    | "TOKEN_TO_WORD"
    | "WORDS_TO_TOKEN_SET"
    | "TOKEN_SET_TO_WORDS"
    | "MISSING_TOKEN"
    | "MISSING_WORD"
    | "WORD_TO_ALL_TOKENS"
    | "TOKEN_TO_ALL_WORDS";
  answerSemantics: "EXACT" | "POSSIBLE" | "IMPOSSIBLE" | "COMPLETE_CANDIDATE_SET";
  answerType: "CODE_TOKEN" | "WORD" | "CODE_TOKEN_SET" | "WORD_SET";
  solveMode: string;
  fixedTopology?: SentenceCodeTopologyKind | "RESOLVED_COMPONENT_COMPOSITION";
  parameterTopologies?: readonly SentenceCodeTopologyKind[];
  renderer: "STATEMENT_CODE_GRID";
  localeMode: "LANGUAGE_ADAPTED";
  status: "DISCOVERY_FROZEN";
}

const EXACT_TOPOLOGIES = [
  ["DIRECT_SINGLE_INTERSECTION", "DIRECT_INTERSECTION"],
  ["CHAINED_SINGLETON_PROPAGATION", "CHAINED_ELIMINATION"],
  ["SET_DIFFERENCE_ELIMINATION", "SET_DIFFERENCE"],
  ["FORKED_EVIDENCE_JOIN", "FORKED_BRANCH_ELIMINATION"],
  ["GLOBAL_BIJECTION_DEDUCTION", "GLOBAL_BIJECTION"],
] as const;

function exactAtomicCandidates(
  start: number,
  prototypeId: string,
  queryDirection: "WORD_TO_TOKEN" | "TOKEN_TO_WORD",
  answerType: "CODE_TOKEN" | "WORD",
): Cp009QlCandidate[] {
  return EXACT_TOPOLOGIES.map(([fixedTopology, solveMode], index) => ({
    candidateId: `COD-CP009-CAND-${String(start + index).padStart(3, "0")}` as Cp009CandidateId,
    prototypeId,
    generatorFamily: "EXACT_ATOMIC",
    queryDirection,
    answerSemantics: "EXACT",
    answerType,
    solveMode,
    fixedTopology,
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  }));
}

const PARTIAL_TOPOLOGIES = [
  "CONTROLLED_PARTIAL_INFORMATION",
  "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION",
] as const;

export const CP009_QL_CANDIDATES: readonly Cp009QlCandidate[] = [
  ...exactAtomicCandidates(
    1,
    "COD-CP009-PROT-EXACT-WORD-TO-TOKEN",
    "WORD_TO_TOKEN",
    "CODE_TOKEN",
  ),
  ...exactAtomicCandidates(
    6,
    "COD-CP009-PROT-EXACT-TOKEN-TO-WORD",
    "TOKEN_TO_WORD",
    "WORD",
  ),
  {
    candidateId: "COD-CP009-CAND-011",
    prototypeId: "COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS",
    generatorFamily: "EXACT_INVARIANT_SET",
    queryDirection: "WORDS_TO_TOKEN_SET",
    answerSemantics: "EXACT",
    answerType: "CODE_TOKEN_SET",
    solveMode: "INVARIANT_AMBIGUOUS_SET",
    fixedTopology: "PHRASE_SET_COMPOSITION",
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  },
  {
    candidateId: "COD-CP009-CAND-012",
    prototypeId: "COD-CP009-PROT-EXACT-TOKENS-TO-PHRASE",
    generatorFamily: "EXACT_INVARIANT_SET",
    queryDirection: "TOKEN_SET_TO_WORDS",
    answerSemantics: "EXACT",
    answerType: "WORD_SET",
    solveMode: "INVARIANT_AMBIGUOUS_SET",
    fixedTopology: "PHRASE_SET_COMPOSITION",
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  },
  {
    candidateId: "COD-CP009-CAND-013",
    prototypeId: "COD-CP009-PROT-MISSING-TOKEN",
    generatorFamily: "MISSING_MEMBER",
    queryDirection: "MISSING_TOKEN",
    answerSemantics: "EXACT",
    answerType: "CODE_TOKEN",
    solveMode: "MISSING_MEMBER_RECONSTRUCTION",
    fixedTopology: "MISSING_MEMBER_COMPLETION",
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  },
  {
    candidateId: "COD-CP009-CAND-014",
    prototypeId: "COD-CP009-PROT-MISSING-WORD",
    generatorFamily: "MISSING_MEMBER",
    queryDirection: "MISSING_WORD",
    answerSemantics: "EXACT",
    answerType: "WORD",
    solveMode: "MISSING_MEMBER_RECONSTRUCTION",
    fixedTopology: "MISSING_MEMBER_COMPLETION",
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  },
  {
    candidateId: "COD-CP009-CAND-015",
    prototypeId: "COD-CP009-PROT-POSSIBLE-WORD-TO-TOKEN",
    generatorFamily: "POSSIBLE_ATOMIC",
    queryDirection: "WORD_TO_TOKEN",
    answerSemantics: "POSSIBLE",
    answerType: "CODE_TOKEN",
    solveMode: "PARTIAL_RELATION_EXISTENCE",
    parameterTopologies: PARTIAL_TOPOLOGIES,
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  },
  {
    candidateId: "COD-CP009-CAND-016",
    prototypeId: "COD-CP009-PROT-POSSIBLE-TOKEN-TO-WORD",
    generatorFamily: "POSSIBLE_ATOMIC",
    queryDirection: "TOKEN_TO_WORD",
    answerSemantics: "POSSIBLE",
    answerType: "WORD",
    solveMode: "PARTIAL_RELATION_EXISTENCE",
    parameterTopologies: PARTIAL_TOPOLOGIES,
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  },
  {
    candidateId: "COD-CP009-CAND-017",
    prototypeId: "COD-CP009-PROT-IMPOSSIBLE-WORD-TO-TOKEN",
    generatorFamily: "IMPOSSIBLE_ATOMIC",
    queryDirection: "WORD_TO_TOKEN",
    answerSemantics: "IMPOSSIBLE",
    answerType: "CODE_TOKEN",
    solveMode: "PARTIAL_RELATION_EXCLUSION",
    fixedTopology: "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION",
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  },
  {
    candidateId: "COD-CP009-CAND-018",
    prototypeId: "COD-CP009-PROT-IMPOSSIBLE-TOKEN-TO-WORD",
    generatorFamily: "IMPOSSIBLE_ATOMIC",
    queryDirection: "TOKEN_TO_WORD",
    answerSemantics: "IMPOSSIBLE",
    answerType: "WORD",
    solveMode: "PARTIAL_RELATION_EXCLUSION",
    fixedTopology: "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION",
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  },
  {
    candidateId: "COD-CP009-CAND-019",
    prototypeId: "COD-CP009-PROT-POSSIBLE-WORD-SET-TO-TOKENS",
    generatorFamily: "POSSIBLE_MIXED_SET",
    queryDirection: "WORDS_TO_TOKEN_SET",
    answerSemantics: "POSSIBLE",
    answerType: "CODE_TOKEN_SET",
    solveMode: "MIXED_SET_EXISTENCE",
    parameterTopologies: PARTIAL_TOPOLOGIES,
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  },
  {
    candidateId: "COD-CP009-CAND-020",
    prototypeId: "COD-CP009-PROT-POSSIBLE-TOKEN-SET-TO-WORDS",
    generatorFamily: "POSSIBLE_MIXED_SET",
    queryDirection: "TOKEN_SET_TO_WORDS",
    answerSemantics: "POSSIBLE",
    answerType: "WORD_SET",
    solveMode: "MIXED_SET_EXISTENCE",
    parameterTopologies: PARTIAL_TOPOLOGIES,
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  },
  {
    candidateId: "COD-CP009-CAND-021",
    prototypeId: "COD-CP009-PROT-EXACT-RESOLVED-WORDS-TO-TOKENS",
    generatorFamily: "RESOLVED_COMPOSITION",
    queryDirection: "WORDS_TO_TOKEN_SET",
    answerSemantics: "EXACT",
    answerType: "CODE_TOKEN_SET",
    solveMode: "RESOLVED_COMPONENT_COMPOSITION",
    fixedTopology: "RESOLVED_COMPONENT_COMPOSITION",
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  },
  {
    candidateId: "COD-CP009-CAND-022",
    prototypeId: "COD-CP009-PROT-EXACT-RESOLVED-TOKENS-TO-WORDS",
    generatorFamily: "RESOLVED_COMPOSITION",
    queryDirection: "TOKEN_SET_TO_WORDS",
    answerSemantics: "EXACT",
    answerType: "WORD_SET",
    solveMode: "RESOLVED_COMPONENT_COMPOSITION",
    fixedTopology: "RESOLVED_COMPONENT_COMPOSITION",
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  },
  {
    candidateId: "COD-CP009-CAND-023",
    prototypeId: "COD-CP009-PROT-COMPLETE-CODE-CANDIDATE-SET",
    generatorFamily: "COMPLETE_CANDIDATE_SET",
    queryDirection: "WORD_TO_ALL_TOKENS",
    answerSemantics: "COMPLETE_CANDIDATE_SET",
    answerType: "CODE_TOKEN_SET",
    solveMode: "COMPLETE_CANDIDATE_DOMAIN",
    parameterTopologies: PARTIAL_TOPOLOGIES,
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  },
  {
    candidateId: "COD-CP009-CAND-024",
    prototypeId: "COD-CP009-PROT-COMPLETE-WORD-CANDIDATE-SET",
    generatorFamily: "COMPLETE_CANDIDATE_SET",
    queryDirection: "TOKEN_TO_ALL_WORDS",
    answerSemantics: "COMPLETE_CANDIDATE_SET",
    answerType: "WORD_SET",
    solveMode: "COMPLETE_CANDIDATE_DOMAIN",
    parameterTopologies: PARTIAL_TOPOLOGIES,
    renderer: "STATEMENT_CODE_GRID",
    localeMode: "LANGUAGE_ADAPTED",
    status: "DISCOVERY_FROZEN",
  },
] as const;

export const CP009_DISCOVERED_TASK_CONTRACT_COUNT = new Set(
  CP009_QL_CANDIDATES.map((candidate) => candidate.prototypeId),
).size;

export const CP009_DISCOVERED_QL_CANDIDATE_COUNT = CP009_QL_CANDIDATES.length;
