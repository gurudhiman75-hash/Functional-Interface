import type {
  AtomicOrder,
  ComparisonConstraint,
  ComparisonRelation,
  PairRelationEvidence,
  SolverAgreementEvidence,
} from "../foundation/types";

export type IneCp001PrototypeId =
  | "INE-CP001-PROT-DIRECT-RELATION"
  | "INE-CP001-PROT-TRANSITIVE-STRICT"
  | "INE-CP001-PROT-STRONGEST-INCLUSIVE"
  | "INE-CP001-PROT-EQUALITY-PROPAGATION"
  | "INE-CP001-PROT-INDETERMINATE-BRANCH";

export type IneCp001AuthorityId =
  | "DETERMINE_DIRECT_RELATION"
  | "DETERMINE_TRANSITIVE_RELATION"
  | "DETERMINE_STRONGEST_DEFINITE_RELATION"
  | "DETERMINE_RELATION_THROUGH_EQUALITY"
  | "DETERMINE_RELATION_OR_INDETERMINATE"
  | "EVALUATE_SINGLE_CONCLUSION"
  | "SELECT_VALID_CONCLUSION"
  | "SELECT_INVALID_CONCLUSION";

export type IneCp001ConclusionPrototypeId =
  | "INE-CP001-PROT-EVALUATE-SINGLE-CONCLUSION"
  | "INE-CP001-PROT-SELECT-VALID-CONCLUSION"
  | "INE-CP001-PROT-SELECT-INVALID-CONCLUSION";

export type IneCp001Difficulty = "EASY" | "MEDIUM" | "HARD";
export type IneCp001AnswerSemantic = ComparisonRelation | "INDETERMINATE";

export interface IneCp001StructuredPrompt {
  statements: readonly ComparisonConstraint[];
  query: { leftId: string; rightId: string };
  entityNames: Readonly<Record<string, string>>;
}

export interface IneCp001Option {
  value: string;
  semanticValue: IneCp001AnswerSemantic;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface IneCp001DistractorExplanation {
  optionValue: string;
  errorLabel: string;
  studentWarning: string;
}

export interface IneCp001Explanation {
  ruleStatement: string;
  normalizedStatements: readonly string[];
  proofSteps: readonly string[];
  modelWitnesses: readonly string[];
  conclusion: string;
  distractorAnalysis: readonly IneCp001DistractorExplanation[];
}

export interface GeneratedIneCp001PrototypeQuestion {
  packageId: "INE-001";
  checkpointId: "INE-CP-001";
  prototypeId: IneCp001PrototypeId;
  authorityId: IneCp001AuthorityId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  seed: number;
  locale: "en-IN";
  difficulty: IneCp001Difficulty;
  renderer: "STRUCTURED_TEXT";
  answerType: "STRONGEST_DEFINITE_RELATION";
  stem: string;
  displayedStatements: readonly string[];
  structuredPrompt: IneCp001StructuredPrompt;
  options: readonly IneCp001Option[];
  correctIndex: number;
  explanation: IneCp001Explanation;
  metadata: {
    runtimeVersion: "ine-cp001-prototype-v1";
    hiddenFingerprint: string;
    topologyId: string;
    statementCount: number;
    proofPathLength: number;
    possibleAtomicRelations: readonly AtomicOrder[];
    strongestDefiniteRelation?: ComparisonRelation;
    independentSolverAgreed: true;
    graphConsistent: true;
    distractorErrorLabels: readonly string[];
  };
}

export interface IneCp001Scenario {
  topologyId: string;
  hiddenValues: Readonly<Record<string, number>>;
  prompt: IneCp001StructuredPrompt;
}

export interface IneCp001ValidationResult {
  valid: boolean;
  errors: readonly string[];
  pairEvidence?: PairRelationEvidence;
  agreementEvidence?: SolverAgreementEvidence;
}

export interface IneCp001ConclusionOption {
  value: string;
  conclusion?: ComparisonConstraint;
  truth?: import("../foundation/types").ConclusionTruth;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface GeneratedIneCp001ConclusionQuestion {
  packageId: "INE-001";
  checkpointId: "INE-CP-001";
  prototypeId: IneCp001ConclusionPrototypeId;
  authorityId:
    | "EVALUATE_SINGLE_CONCLUSION"
    | "SELECT_VALID_CONCLUSION"
    | "SELECT_INVALID_CONCLUSION";
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  seed: number;
  locale: "en-IN";
  difficulty: IneCp001Difficulty;
  renderer: "STRUCTURED_TEXT";
  answerType: "CONCLUSION_TRUTH" | "CONCLUSION_SELECTION";
  stem: string;
  displayedStatements: readonly string[];
  displayedConclusion?: string;
  structuredStatements: readonly ComparisonConstraint[];
  options: readonly IneCp001ConclusionOption[];
  correctIndex: number;
  explanation: IneCp001Explanation;
  metadata: {
    runtimeVersion: "ine-cp001-conclusion-prototype-v1";
    hiddenFingerprint: string;
    conclusionTruths: readonly import("../foundation/types").ConclusionTruth[];
    independentSolverAgreed: true;
    graphConsistent: true;
    distractorErrorLabels: readonly string[];
  };
}
