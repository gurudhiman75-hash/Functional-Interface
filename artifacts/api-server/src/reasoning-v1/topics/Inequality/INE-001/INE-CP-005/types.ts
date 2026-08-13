import type {
  ComparisonConstraint,
  ComparisonRelation,
  ConclusionTruth,
  RelationPhraseKey,
} from "../foundation/types";
import type { IneCp001Explanation } from "../INE-CP-001/types";

export type IneCp005PrototypeId =
  | "INE-CP005-PROT-INTERPRET-LINGUISTIC-RELATION"
  | "INE-CP005-PROT-SOLVE-LINGUISTIC-CHAIN"
  | "INE-CP005-PROT-SOLVE-MIXED-CHAIN"
  | "INE-CP005-PROT-CONTEXTUAL-CONCLUSIONS";

export type IneCp005AuthorityId =
  | "INTERPRET_LINGUISTIC_RELATION"
  | "SOLVE_LINGUISTIC_CHAIN"
  | "SOLVE_MIXED_LINGUISTIC_SYMBOLIC_CHAIN"
  | "EVALUATE_CONTEXTUAL_LINGUISTIC_CONCLUSIONS";

export type IneCp005TaskKind =
  | "INTERPRET_RELATION"
  | "SOLVE_RELATION"
  | "SOLVE_MIXED_RELATION"
  | "EVALUATE_CONCLUSIONS";

export type IneCp005Context =
  | "GENERIC"
  | "MARKS"
  | "SALARY"
  | "HEIGHT"
  | "WEIGHT"
  | "SCORE"
  | "PRICE"
  | "PRODUCTION";

export type IneCp005SurfaceKind = "LINGUISTIC" | "SYMBOLIC";
export type IneCp005AnswerSemantic = ComparisonRelation | "INDETERMINATE";
export type IneCp005ConclusionMask = "ONLY_I" | "ONLY_II" | "BOTH" | "NEITHER";

export interface IneCp005RenderedStatement {
  constraint: ComparisonConstraint;
  surfaceKind: IneCp005SurfaceKind;
  phraseKey?: RelationPhraseKey;
  text: string;
}

export interface IneCp005Scenario {
  scenarioId: string;
  topologyId: string;
  taskKind: IneCp005TaskKind;
  context: IneCp005Context;
  statements: readonly ComparisonConstraint[];
  renderedStatements: readonly IneCp005RenderedStatement[];
  query?: { leftId: string; rightId: string };
  conclusions: readonly ComparisonConstraint[];
  renderedConclusions: readonly IneCp005RenderedStatement[];
  expectedMask?: IneCp005ConclusionMask;
  entityNames: Readonly<Record<string, string>>;
}

export interface IneCp005Option {
  value: string;
  isCorrect: boolean;
  semanticValue?: IneCp005AnswerSemantic;
  conclusionMask?: IneCp005ConclusionMask;
  errorLabel?: string;
}

export interface GeneratedIneCp005Question {
  recordId: string;
  packageId: "INE-001";
  checkpointId: "INE-CP-005";
  prototypeId: IneCp005PrototypeId;
  authorityId: IneCp005AuthorityId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  seed: number;
  locale: "en-IN";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  renderer: "STRUCTURED_TEXT";
  answerType: "RELATION_SELECTION" | "CONCLUSION_MASK";
  stem: string;
  displayedStatements: readonly string[];
  displayedConclusions?: readonly string[];
  structuredScenario: IneCp005Scenario;
  options: readonly IneCp005Option[];
  correctIndex: number;
  explanation: IneCp001Explanation;
  solutions: { mock: string; learning: IneCp001Explanation };
  metadata: {
    runtimeVersion: "ine-cp005-prototype-v1";
    reviewStatus: "CHECKPOINT_ACCEPTED";
    deliveryProfile:
      | "GUIDED_CONCEPT"
      | "EXAM_PRACTICE_PROTOTYPE"
      | "BANKING_MOCK_PROTOTYPE";
    context: IneCp005Context;
    topologyId: string;
    taskKind: IneCp005TaskKind;
    linguisticStatementCount: number;
    symbolicStatementCount: number;
    conclusionTruths: readonly ConclusionTruth[];
    contentHash: string;
    independentSolverAgreed: true;
    graphConsistent: true;
    distractorErrorLabels: readonly string[];
    sourceLedgerIds: readonly string[];
  };
}

export interface IneCp005ValidationResult {
  valid: boolean;
  errors: readonly string[];
}
