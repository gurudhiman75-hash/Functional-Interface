import type {
  BlrCp006CodeDefinition,
  BlrCp006CodedStatement,
  BlrCp006FamilyTree,
  BlrCp006Graph,
  BlrCp006Relation,
} from "../BLR-CP-006/cp006-model";
import type {
  BlrCp007Authority,
  BlrCp007PrototypeId,
  BlrCp007QlId,
  BlrCp007Query,
} from "./cp007-model";

export const BLR_CP007_EDITORIAL_V2_RUNTIME_VERSION =
  "blr-cp007-coded-construction-editorial-v2" as const;
export const BLR_CP007_EDITORIAL_V2_REVIEW_VERSION =
  "BLR_CP007_ENGLISH_EDITORIAL_REVIEW_V2" as const;
export const BLR_CP007_SUPERSEDED_FREEZE_VERSION =
  "BLR_CP007_ENGLISH_DISCOVERY_FREEZE_V1" as const;

export type BlrCp007V2FailureCode =
  | "WRONG_RELATION"
  | "REVERSED_DIRECTION"
  | "WRONG_GENDER"
  | "WRONG_GENERATION"
  | "BROKEN_CHAIN"
  | "INVALID_FAMILY_GRAPH"
  | "SELF_RELATION"
  | "GENDER_CONTRADICTION"
  | "WRONG_TOKEN_MEANING"
  | "WRONG_TOKEN_DIRECTION"
  | "FIRST_TOKEN_WRONG"
  | "SECOND_TOKEN_WRONG"
  | "BOTH_TOKENS_WRONG"
  | "TOKENS_SWAPPED"
  | "WRONG_PERSON_IDENTITY"
  | "VALID_STATEMENT_NOT_REQUESTED"
  | "INVALID_INTERPRETATION_SELECTED"
  | "CLAIM_RELATION_MISMATCH"
  | "CLAIM_DIRECTION_MISMATCH"
  | "CLAIM_GENDER_MISMATCH";

export type BlrCp007V2ExplanationMode =
  | "DIRECT_LOOKUP_MINIMAL"
  | "DIRECTION_CHECK"
  | "MISSING_TOKEN"
  | "MISSING_PERSON"
  | "TWO_LINK_PATH"
  | "THREE_LINK_OR_AFFINAL_PATH"
  | "INVALID_STATEMENT_CHECK"
  | "VALID_STATEMENT_CHECK";

export interface BlrCp007V2Option {
  text: string;
  semanticKey: string;
  completedStatements: readonly BlrCp006CodedStatement[];
  decodedAssertions: readonly string[];
  graphValidity: "VALID" | "INVALID";
  statementValidity: "VALID" | "INVALID" | "NOT_APPLICABLE";
  targetRelationSatisfied: boolean;
  isCorrectAnswerForTask: boolean;
  failureCode?: BlrCp007V2FailureCode;
  actualRelation?: BlrCp006Relation;
  claimedRelation?: BlrCp006Relation;
  studentExplanation: string;
}

export interface BlrCp007V2DiagramEdge {
  id: string;
  type: "marriage" | "parent-child" | "sibling";
  sourceId: string;
  targetId: string;
  label: string;
  evidence: "CODED" | "INFERRED";
  highlighted: boolean;
}

export interface BlrCp007V2DiagramProof {
  title: string;
  description: string;
  legend: readonly string[];
  siblingPolicy: "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED";
  pathPersonIds: readonly string[];
  edges: readonly BlrCp007V2DiagramEdge[];
  codedEdgeCount: number;
  inferredEdgeCount: number;
}

export interface BlrCp007V2OptionAnalysis {
  optionLabel: "A" | "B" | "C" | "D";
  optionText: string;
  statementValidity: BlrCp007V2Option["statementValidity"];
  isCorrectAnswerForTask: boolean;
  failureCode?: BlrCp007V2FailureCode;
  explanation: string;
}

export interface GeneratedBlrCp007EditorialV2Question {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-007";
  qlId: BlrCp007QlId;
  permanentQlId: BlrCp007QlId;
  solveAuthority: BlrCp007Authority;
  sourcePrototypeId: BlrCp007PrototypeId;
  prototypeOnly: false;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: "en-IN";
  seed: number;
  itemId: string;
  scenarioId: string;
  topologyId: string;
  keyStyle: "SYMBOL" | "LETTER" | "NEUTRAL_WORD";
  codeKey: readonly BlrCp006CodeDefinition[];
  query: BlrCp007Query;
  sharedPrompt: string;
  stem: string;
  answerType:
    | "CODED_EXPRESSION"
    | "CODE_TOKEN"
    | "ORDERED_TOKEN_PAIR"
    | "PERSON_LABEL"
    | "CODED_STATEMENT";
  options: readonly BlrCp007V2Option[];
  correctIndex: number;
  answer: string;
  completedStatements: readonly BlrCp006CodedStatement[];
  decodedStatements: readonly string[];
  graph: BlrCp006Graph;
  explanation: {
    mode: BlrCp007V2ExplanationMode;
    steps: readonly string[];
    conclusion: string;
    shortcut?: string;
    commonTrap?: string;
    optionAnalysis: readonly BlrCp007V2OptionAnalysis[];
    familyTree: BlrCp006FamilyTree;
    diagramProof: BlrCp007V2DiagramProof;
  };
  reviewProof: {
    questionId: string;
    seed: number;
    qlId: BlrCp007QlId;
    prototypeId: BlrCp007PrototypeId;
    taskKind: BlrCp007Query["kind"];
    difficulty: "EASY" | "MEDIUM" | "HARD";
    familyTopologyId: string;
    targetRelation?: BlrCp006Relation;
    targetPath: readonly string[];
    semanticFingerprint: string;
    independentSolverStatus: "AGREED";
    uniqueCorrectOptionCount: 1;
    graphValidityStatus: "VALID";
    rendererValidationStatus: "VALID";
    datasetVersion: typeof BLR_CP007_EDITORIAL_V2_REVIEW_VERSION;
    reviewStatus: "HUMAN_REVIEW_REQUIRED";
    reviewerNote: string;
  };
  metadata: {
    runtimeVersion: typeof BLR_CP007_EDITORIAL_V2_RUNTIME_VERSION;
    reviewVersion: typeof BLR_CP007_EDITORIAL_V2_REVIEW_VERSION;
    supersedesFreezeVersion: typeof BLR_CP007_SUPERSEDED_FREEZE_VERSION;
    editorialStatus: "REMEDIATED_REVIEW_CANDIDATE";
    completeKeyCoverage: true;
    noArithmeticPrecedence: true;
    displayedExpressionParity: true;
    explicitGenderEvidence: true;
    nameBasedGenderAssumptions: 0;
    independentVerifierAgreed: true;
    uniqueAnswer: true;
    siblingPolicy: "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED";
    optionOrderAlgorithm: "SEEDED_FISHER_YATES_V2";
    difficulty: "EASY" | "MEDIUM" | "HARD";
    semanticFingerprint: string;
  };
}

export interface BlrCp007EditorialV2Telemetry {
  recordCount: 168;
  prototypeCount: 21;
  authorityCount: 5;
  permanentQlCount: 5;
  reviewVersion: typeof BLR_CP007_EDITORIAL_V2_REVIEW_VERSION;
  answerPositions: readonly [number, number, number, number];
  qlCounts: Readonly<Record<BlrCp007QlId, number>>;
  failureCodeCounts: Readonly<Record<string, number>>;
  explanationModeCounts: Readonly<Record<string, number>>;
  optionAnalysisCount: 672;
  uniqueQuestionSignatureCount: 168;
  invalidStatementQuestionCount: 16;
  missingPersonCorrectLabelCounts: Readonly<Record<string, number>>;
  semicolonCorrectCount: number;
  semicolonWrongCount: number;
  codedDiagramEdgeCount: number;
  inferredDiagramEdgeCount: number;
  humanReviewRequired: true;
}
