import type {
  AtomicOrder,
  ComparisonConstraint,
  ComparisonRelation,
} from "../foundation/types";
import type {
  IneCp001AnswerSemantic,
  IneCp001Explanation,
} from "../INE-CP-001/types";

export type IneCp002PrototypeId =
  | "INE-CP002-PROT-LONG-CHAIN"
  | "INE-CP002-PROT-MULTIPLE-ROUTES"
  | "INE-CP002-PROT-ALTERNATE-STRICT-PATH"
  | "INE-CP002-PROT-BRANCHED-GRAPH"
  | "INE-CP002-PROT-IRRELEVANT-EVIDENCE"
  | "INE-CP002-PROT-SELECT-DEFINITE-PAIR"
  | "INE-CP002-PROT-SELECT-INDETERMINATE-PAIR"
  | "INE-CP002-PROT-DISCONNECTED-COMPONENTS"
  | "INE-CP002-PROT-EQUALITY-SPANNING-BRANCHES";

export type IneCp002AuthorityId =
  | "DETERMINE_LONG_CHAIN_RELATION"
  | "DETERMINE_MULTI_ROUTE_RELATION"
  | "APPLY_ALTERNATE_PATH_STRICTNESS"
  | "DETERMINE_BRANCHED_GRAPH_RELATION"
  | "FILTER_IRRELEVANT_STATEMENTS"
  | "IDENTIFY_PAIR_WITH_DEFINITE_RELATION"
  | "IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION"
  | "DETERMINE_DISCONNECTED_PAIR_RELATION"
  | "PROPAGATE_EQUALITY_ACROSS_BRANCHES";

export type IneCp002TaskKind =
  | "RELATION"
  | "SELECT_DEFINITE_PAIR"
  | "SELECT_INDETERMINATE_PAIR";

export type IneCp002ReleaseTier =
  | "SSC_STANDARD_MOCK"
  | "BANKING_PRELIMS"
  | "ADVANCED_PRACTICE";

export type IneCp002ExplanationKind =
  | "LONG_CHAIN"
  | "MULTIPLE_ROUTES"
  | "ALTERNATE_STRICT_PATH"
  | "BRANCHED_GRAPH"
  | "IRRELEVANT_EVIDENCE"
  | "PAIR_SELECTION"
  | "DISCONNECTED_COMPONENTS"
  | "EQUALITY_SPANNING_BRANCHES";

export interface IneCp002PairCandidate {
  pairId: string;
  leftId: string;
  rightId: string;
}

export interface IneCp002Scenario {
  scenarioId: string;
  topologyId: string;
  taskKind: IneCp002TaskKind;
  explanationKind: IneCp002ExplanationKind;
  hiddenValues: Readonly<Record<string, number>>;
  entityNames: Readonly<Record<string, string>>;
  statements: readonly ComparisonConstraint[];
  query?: { leftId: string; rightId: string };
  candidatePairs?: readonly IneCp002PairCandidate[];
  proofRoutes: readonly (readonly string[])[];
  irrelevantStatementIds: readonly string[];
}

export interface IneCp002Option {
  value: string;
  isCorrect: boolean;
  errorLabel?: string;
  semanticRelation?: IneCp001AnswerSemantic;
  pair?: IneCp002PairCandidate;
  pairIsDefinite?: boolean;
}

export interface IneCp002StructuredPrompt {
  statements: readonly ComparisonConstraint[];
  entityNames: Readonly<Record<string, string>>;
  query?: { leftId: string; rightId: string };
  candidatePairs?: readonly IneCp002PairCandidate[];
}

export interface GeneratedIneCp002Question {
  recordId: string;
  packageId: "INE-001";
  checkpointId: "INE-CP-002";
  prototypeId: IneCp002PrototypeId;
  authorityId: IneCp002AuthorityId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  seed: number;
  locale: "en-IN";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  renderer: "STRUCTURED_TEXT";
  answerType: "DEFINITELY_ESTABLISHED_RELATION" | "PAIR_SELECTION";
  stem: string;
  displayedStatements: readonly string[];
  structuredPrompt: IneCp002StructuredPrompt;
  options: readonly IneCp002Option[];
  correctIndex: number;
  explanation: IneCp001Explanation;
  solutions: {
    mock: string;
    learning: IneCp001Explanation;
  };
  metadata: {
    runtimeVersion: "ine-cp002-prototype-v4";
    competency: "MULTI_LINK_INEQUALITY_REASONING";
    reviewStatus: "CHECKPOINT_ACCEPTED";
    releaseTier: IneCp002ReleaseTier;
    difficultyBasis:
      | "SHORT_SINGLE_PATH"
      | "STANDARD_GRAPH_REASONING"
      | "ADVANCED_GRAPH_REASONING"
      | "PAIR_AUDIT";
    contentHash: string;
    topologyId: string;
    graphFingerprint: string;
    hiddenFingerprint: string;
    taskKind: IneCp002TaskKind;
    explanationMode: IneCp002ExplanationKind;
    nodeCount: number;
    statementCount: number;
    relevantStatementCount: number;
    routeCount: number;
    irrelevantStatementCount: number;
    equalityStatementCount: number;
    strictStatementCount: number;
    answerRelation?: IneCp001AnswerSemantic;
    optionRoles: readonly {
      index: number;
      role: "CORRECT" | "DISTRACTOR";
      errorLabel?: string;
    }[];
    possibleAtomicRelations?: readonly AtomicOrder[];
    strongestDefiniteRelation?: ComparisonRelation;
    candidatePairDefiniteness?: Readonly<Record<string, boolean>>;
    independentSolverAgreed: true;
    graphConsistent: true;
    distractorErrorLabels: readonly string[];
  };
}

export interface IneCp002ValidationResult {
  valid: boolean;
  errors: readonly string[];
}
