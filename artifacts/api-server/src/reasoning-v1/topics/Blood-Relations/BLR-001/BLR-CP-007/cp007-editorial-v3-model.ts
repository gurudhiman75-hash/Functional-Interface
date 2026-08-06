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
import type {
  BlrCp007V2DiagramProof,
  BlrCp007V2FailureCode,
  BlrCp007V2OptionAnalysis,
} from "./cp007-editorial-v2-model";

export const BLR_CP007_EDITORIAL_V3_RUNTIME_VERSION =
  "blr-cp007-coded-construction-editorial-v3" as const;
export const BLR_CP007_EDITORIAL_V3_REVIEW_VERSION =
  "BLR_CP007_ENGLISH_EDITORIAL_REVIEW_V3" as const;

export type BlrCp007V3DeliveryMode = "STANDALONE" | "SHARED_SET";
export type BlrCp007V3DiagramPolicy = "HIDDEN_DIRECT" | "OPTIONAL" | "REQUIRED";
export type BlrCp007V3Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface BlrCp007V3Option {
  text: string;
  semanticKey: string;
  completedStatements: readonly BlrCp006CodedStatement[];
  decodedAssertions: readonly string[];
  graphValidity: "VALID";
  statementValidity: "VALID" | "INVALID" | "NOT_APPLICABLE";
  targetRelationSatisfied: boolean;
  isCorrectAnswerForTask: boolean;
  failureCode?: BlrCp007V2FailureCode;
  actualRelation?: BlrCp006Relation;
  claimedRelation?: BlrCp006Relation;
  studentExplanation: string;
}

export interface GeneratedBlrCp007EditorialV3Question {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-007";
  qlId: BlrCp007QlId;
  permanentQlId: BlrCp007QlId;
  solveAuthority: BlrCp007Authority;
  sourcePrototypeId: BlrCp007PrototypeId;
  semanticScenarioId: string;
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
  options: readonly BlrCp007V3Option[];
  correctIndex: number;
  answer: string;
  completedStatements: readonly BlrCp006CodedStatement[];
  decodedStatements: readonly string[];
  graph: BlrCp006Graph;
  delivery: {
    mode: BlrCp007V3DeliveryMode;
    setId?: string;
    itemNumber?: number;
    itemCount?: number;
  };
  explanation: {
    steps: readonly string[];
    conclusion: string;
    shortcut?: string;
    commonTrap?: string;
    optionAnalysis: readonly BlrCp007V2OptionAnalysis[];
    familyTree: BlrCp006FamilyTree;
    diagramProof: BlrCp007V2DiagramProof;
    diagramPolicy: BlrCp007V3DiagramPolicy;
  };
  reviewProof: {
    questionId: string;
    seed: number;
    qlId: BlrCp007QlId;
    prototypeId: BlrCp007PrototypeId;
    semanticScenarioId: string;
    taskKind: BlrCp007Query["kind"];
    difficulty: BlrCp007V3Difficulty;
    familyTopologyId: string;
    targetRelation?: BlrCp006Relation;
    targetPath: readonly string[];
    semanticFingerprint: string;
    independentSolverStatus: "AGREED";
    uniqueCorrectOptionCount: 1;
    graphValidityStatus: "VALID";
    rendererValidationStatus: "VALID";
    datasetVersion: typeof BLR_CP007_EDITORIAL_V3_REVIEW_VERSION;
    reviewStatus: "HUMAN_REVIEW_REQUIRED";
    reviewerNote: string;
  };
  metadata: {
    runtimeVersion: typeof BLR_CP007_EDITORIAL_V3_RUNTIME_VERSION;
    reviewVersion: typeof BLR_CP007_EDITORIAL_V3_REVIEW_VERSION;
    supersedesReviewVersion: "BLR_CP007_ENGLISH_EDITORIAL_REVIEW_V2";
    editorialStatus: "SEMANTIC_REMODEL_REVIEW_CANDIDATE";
    completeKeyCoverage: true;
    uniqueTokenMeanings: true;
    noArithmeticPrecedence: true;
    displayedExpressionParity: true;
    explicitGenderEvidence: true;
    nameBasedGenderAssumptions: 0;
    independentVerifierAgreed: true;
    uniqueAnswer: true;
    siblingPolicy: "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED";
    optionOrderAlgorithm: "SEEDED_FISHER_YATES_V3";
    difficulty: BlrCp007V3Difficulty;
    semanticFingerprint: string;
    semanticScenarioFingerprint: string;
    allCandidatesMeaningful: boolean;
    shortcutResistant: boolean;
    studentVisibleDiagnosticCodes: false;
  };
}

export interface BlrCp007EditorialV3Telemetry {
  recordCount: 168;
  prototypeCount: 21;
  authorityCount: 5;
  permanentQlCount: 5;
  optionAnalysisCount: 672;
  uniqueQuestionSignatureCount: 168;
  semanticScenarioCount: 168;
  minimumSemanticScenariosPerPrototype: 8;
  answerPositions: readonly [number, number, number, number];
  qlCounts: Readonly<Record<BlrCp007QlId, number>>;
  keyStyleCounts: Readonly<Record<GeneratedBlrCp007EditorialV3Question["keyStyle"], number>>;
  difficultyCounts: Readonly<Record<BlrCp007V3Difficulty, number>>;
  deliveryModeCounts: Readonly<Record<BlrCp007V3DeliveryMode, number>>;
  targetGenderClassCounts: Readonly<Record<"MALE" | "FEMALE" | "NEUTRAL", number>>;
  targetRelationCounts: Readonly<Record<string, number>>;
  invalidGraphOptions: 0;
  validWrongGraphOptions: 504;
  duplicateCodeMeaningQuestions: 0;
  ql033DeepConstructionQuestions: 24;
  ql034MeaningfulCandidateQuestions: 32;
  ql034ShortcutFailures: 0;
  thereforePrefixDuplications: 0;
  studentVisibleDiagnosticCodes: 0;
  humanReviewRequired: true;
}
