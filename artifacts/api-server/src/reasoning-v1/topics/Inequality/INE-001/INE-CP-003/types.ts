import type {
  AtomicOrder,
  ComparisonConstraint,
  ConclusionTruth,
} from "../foundation/types";
import type { IneCp001Explanation } from "../INE-CP-001/types";

export type IneCp003PrototypeId =
  | "INE-CP003-PROT-CLASSIFY-SINGLE-CONCLUSION"
  | "INE-CP003-PROT-SELECT-DEFINITE-CONCLUSION"
  | "INE-CP003-PROT-SELECT-POSSIBLE-CONCLUSION"
  | "INE-CP003-PROT-SELECT-IMPOSSIBLE-CONCLUSION"
  | "INE-CP003-PROT-IDENTIFY-POSSIBLE-RELATIONS"
  | "INE-CP003-PROT-EVALUATE-INCLUSIVE-CONCLUSION"
  | "INE-CP003-PROT-EVALUATE-TWO-CONCLUSIONS";

export type IneCp003AuthorityId =
  | "CLASSIFY_SINGLE_CONCLUSION_TRUTH"
  | "IDENTIFY_DEFINITELY_TRUE_CONCLUSION"
  | "IDENTIFY_POSSIBLY_TRUE_CONCLUSION"
  | "IDENTIFY_IMPOSSIBLE_CONCLUSION"
  | "IDENTIFY_ALL_POSSIBLE_RELATIONS"
  | "EVALUATE_INCLUSIVE_CONCLUSION_TRUTH"
  | "EVALUATE_TWO_CONCLUSIONS";

export type IneCp003TaskKind =
  | "CLASSIFY_CONCLUSION"
  | "SELECT_CONCLUSION"
  | "SELECT_RELATION_SET"
  | "EVALUATE_CONCLUSION_SET";

export type IneCp003ExplanationKind =
  | "TRUTH_CLASSIFICATION"
  | "CONCLUSION_AUDIT"
  | "POSSIBLE_RELATION_SET"
  | "INCLUSIVE_TRUTH_CLASSIFICATION"
  | "CONCLUSION_SET_AUDIT";

export type IneCp003ReleaseTier =
  | "GUIDED_CONCEPT"
  | "DIAGNOSTIC_PRACTICE"
  | "MOCK_FORMAT_PROTOTYPE";

export type IneCp003ConclusionMask = "ONLY_I" | "ONLY_II" | "NEITHER" | "BOTH";

export interface IneCp003Scenario {
  scenarioId: string;
  topologyId: string;
  taskKind: IneCp003TaskKind;
  explanationKind: IneCp003ExplanationKind;
  statements: readonly ComparisonConstraint[];
  conclusions: readonly ComparisonConstraint[];
  query?: { leftId: string; rightId: string };
  targetTruth?: ConclusionTruth;
  entityNames: Readonly<Record<string, string>>;
}

export interface IneCp003Option {
  value: string;
  isCorrect: boolean;
  errorLabel?: string;
  truth?: ConclusionTruth;
  conclusion?: ComparisonConstraint;
  atomicRelations?: readonly AtomicOrder[];
  conclusionMask?: IneCp003ConclusionMask;
}

export interface GeneratedIneCp003Question {
  recordId: string;
  packageId: "INE-001";
  checkpointId: "INE-CP-003";
  prototypeId: IneCp003PrototypeId;
  authorityId: IneCp003AuthorityId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  seed: number;
  locale: "en-IN";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  renderer: "STRUCTURED_TEXT";
  answerType:
    | "CONCLUSION_TRUTH"
    | "CONCLUSION_SELECTION"
    | "POSSIBLE_RELATION_SET"
    | "CONCLUSION_MASK";
  stem: string;
  displayedStatements: readonly string[];
  displayedConclusion?: string;
  displayedConclusions?: readonly string[];
  structuredScenario: IneCp003Scenario;
  options: readonly IneCp003Option[];
  correctIndex: number;
  explanation: IneCp001Explanation;
  solutions: { mock: string; learning: IneCp001Explanation };
  metadata: {
    runtimeVersion: "ine-cp003-prototype-v2";
    competency: "CONCLUSION_CERTAINTY_REASONING";
    reviewStatus: "CHECKPOINT_ACCEPTED";
    releaseTier: IneCp003ReleaseTier;
    topologyId: string;
    structuralFingerprint: string;
    taskKind: IneCp003TaskKind;
    explanationMode: IneCp003ExplanationKind;
    statementCount: number;
    conclusionCount: number;
    nodeCount: number;
    conclusionTruths: readonly ConclusionTruth[];
    possibleAtomicRelations?: readonly AtomicOrder[];
    contentHash: string;
    independentSolverAgreed: true;
    graphConsistent: true;
    distractorErrorLabels: readonly string[];
    sourceLedgerIds: readonly string[];
  };
}

export interface IneCp003ValidationResult {
  valid: boolean;
  errors: readonly string[];
}
