import type {
  ComparisonConstraint,
  ComparisonRelation,
  ConclusionTruth,
} from "../foundation/types";
import type { IneCp001Explanation } from "../INE-CP-001/types";

export type IneCp006PrototypeId =
  | "INE-CP006-PROT-DECODE-RELATION"
  | "INE-CP006-PROT-SOLVE-CODED-CHAIN"
  | "INE-CP006-PROT-EVALUATE-CODED-CONCLUSIONS"
  | "INE-CP006-PROT-ENCODE-RELATION";

export type IneCp006AuthorityId =
  | "DECODE_FIXED_MAP_RELATION"
  | "SOLVE_FIXED_MAP_CODED_CHAIN"
  | "EVALUATE_FIXED_MAP_CODED_CONCLUSIONS"
  | "ENCODE_FIXED_MAP_RELATION";

export type IneCp006TaskKind =
  | "DECODE_RELATION"
  | "SOLVE_RELATION"
  | "EVALUATE_CONCLUSIONS"
  | "ENCODE_RELATION";

export type IneCp006SymbolProfile =
  | "ASCII_EXAM_PROFILE"
  | "UNICODE_GUIDED_PROFILE";

export type IneCp006ExamApplicability =
  | "BANKING_REGULATORY_PRACTICE_ONLY"
  | "GUIDED_CONCEPT_ONLY";

export type IneCp006AnswerSemantic = ComparisonRelation | "INDETERMINATE";
export type IneCp006ConclusionMask =
  | "ONLY_I"
  | "ONLY_II"
  | "BOTH"
  | "NEITHER"
  | "ONLY_III"
  | "I_AND_II"
  | "I_AND_III"
  | "II_AND_III"
  | "ALL_THREE";

export interface IneCp006CodeMap {
  mapId: string;
  symbolSetId: string;
  symbolByRelation: Readonly<Record<ComparisonRelation, string>>;
}

export interface IneCp006KeyEntry {
  symbol: string;
  relation: ComparisonRelation;
  text: string;
}

export interface IneCp006Scenario {
  scenarioId: string;
  topologyId: string;
  taskKind: IneCp006TaskKind;
  codeMap: IneCp006CodeMap;
  keyEntries: readonly IneCp006KeyEntry[];
  statements: readonly ComparisonConstraint[];
  displayedCodedStatements: readonly string[];
  query?: { leftId: string; rightId: string };
  conclusions: readonly ComparisonConstraint[];
  displayedCodedConclusions: readonly string[];
  ordinaryRelation?: ComparisonConstraint;
  expectedMask?: IneCp006ConclusionMask;
  entityNames: Readonly<Record<string, string>>;
}

export interface IneCp006Option {
  value: string;
  isCorrect: boolean;
  semanticValue?: IneCp006AnswerSemantic;
  conclusionMask?: IneCp006ConclusionMask;
  encodedRelation?: ComparisonRelation;
  errorLabel?: string;
}

export interface GeneratedIneCp006Question {
  recordId: string;
  packageId: "INE-001";
  checkpointId: "INE-CP-006";
  prototypeId: IneCp006PrototypeId;
  authorityId: IneCp006AuthorityId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  seed: number;
  locale: "en-IN";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  renderer: "STRUCTURED_TEXT";
  answerType: "RELATION_SELECTION" | "CONCLUSION_MASK" | "CODE_SELECTION";
  stem: string;
  displayedCodeKey: readonly string[];
  displayedStatements: readonly string[];
  displayedConclusions?: readonly string[];
  structuredScenario: IneCp006Scenario;
  options: readonly IneCp006Option[];
  correctIndex: number;
  explanation: IneCp001Explanation;
  solutions: { mock: string; learning: IneCp001Explanation };
  metadata: {
    runtimeVersion: "ine-cp006-prototype-v3";
    reviewStatus: "CHECKPOINT_ACCEPTED";
    deliveryProfile: "GUIDED_CONCEPT" | "EXAM_PRACTICE_PROTOTYPE";
    symbolProfile: IneCp006SymbolProfile;
    examApplicability: IneCp006ExamApplicability;
    localeReadiness: "ENGLISH_ONLY";
    releaseGate: "MANUAL_REVIEW_REQUIRED";
    topologyId: string;
    taskKind: IneCp006TaskKind;
    symbolSetId: string;
    codeKeySize: 5;
    conclusionTruths: readonly ConclusionTruth[];
    contentHash: string;
    independentSolverAgreed: true;
    graphConsistent: true;
    distractorErrorLabels: readonly string[];
    sourceLedgerIds: readonly string[];
  };
}

export interface IneCp006ValidationResult {
  valid: boolean;
  errors: readonly string[];
}
