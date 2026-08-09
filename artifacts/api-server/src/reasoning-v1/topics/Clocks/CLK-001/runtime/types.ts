import type { SerializedExactRational } from "../../../../foundation/temporal";
import type { ClockCheckpointCode, ClockTaskId } from "./catalog";

export type ClockLocale = "en-IN" | "hi-IN" | "pa-IN";
export type ClockDifficulty = "FOUNDATION" | "STANDARD" | "ADVANCED";

export type ClockAnswerKind =
  | "ANGLE"
  | "DURATION"
  | "COUNT"
  | "TIME"
  | "ABSOLUTE_TIME"
  | "RATE"
  | "CLASSIFICATION"
  | "DISTANCE_PI"
  | "RATIO"
  | "BOOLEAN"
  | "TIME_SET"
  | "TIME_PAIR"
  | "DIAGRAM"
  | "POSITION";

export interface ClockSemanticAnswer {
  kind: ClockAnswerKind;
  semanticKey: string;
  display: string;
  exactValue?: SerializedExactRational;
  values?: readonly SerializedExactRational[];
  metadata?: Readonly<Record<string, string | number | boolean>>;
}

export interface ClockMediaAsset {
  id: string;
  role: "PROMPT_DIAGRAM" | "OPTION_DIAGRAM";
  mimeType: "image/svg+xml";
  svg: string;
  ariaLabel: string;
  semanticKey: string;
  fingerprint: string;
}

export interface ClockQuestionMedia {
  prompt?: ClockMediaAsset;
  options?: readonly {
    semanticKey: string;
    asset: ClockMediaAsset;
  }[];
}

export interface ClockQuestionOption {
  display: string;
  semanticKey: string;
  isCorrect: boolean;
  reasonCode: "CORRECT" | string;
  reason: string;
  answer: ClockSemanticAnswer;
}

export interface ClockQuestionExplanation {
  given: string;
  rule: string;
  working: readonly string[];
  validityCheck: string;
  closestTrap: string;
  answer: string;
}

export interface ClockSolveTrace {
  canonicalAnswerKey: string;
  verifierAnswerKey: string;
  agreement: true;
  canonicalTrace: readonly string[];
  verifierTrace: readonly string[];
  proofLevel: "DUAL_ANSWER_ORACLE" | "STRUCTURAL_DISCOVERY_ONLY";
  contractOracle?: string;
  stemScenarioParity?: boolean;
  answerContractVerified?: boolean;
  endpointPolicy?: string;
  roundingPolicy?: string;
  handAngles?: Readonly<Record<string, string>>;
  eventRoots?: readonly string[];
  rateRatio?: string;
  strikeIntervalCount?: number;
  mirrorGeometryAgreement?: boolean;
  rendererFingerprint?: string;
}

export interface ClockQuestionLifecycle {
  discoveryStatus: "OPEN_EXECUTABLE_DISCOVERY";
  editorialStatus: "HUMAN_REVIEW_REQUIRED";
  solverProofStatus:
    | "DUAL_ANSWER_ORACLE_PASSED"
    | "STRUCTURAL_DISCOVERY_ONLY__REMEDIATION_REQUIRED";
  localeStatus: "ENGLISH_DISCOVERY__LOCALISATION_BLOCKED_UNTIL_ENGLISH_FREEZE";
  publicationStatus: "LOCKED";
  permanentQlId: null;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

export interface ClockScenario {
  [key: string]: string | number | boolean | null | readonly string[] | readonly number[];
}

export interface ClockQuestion {
  schemaVersion: "CLK_OPEN_DISCOVERY_V2";
  designAuthority: {
    file: "CLK-001-CLOCKS-MASTER-END-TO-END-DESIGN-V2.md";
    sha256: string;
    policy: "SOLE_AUTHORITY";
  };
  chapterCode: "CLK-001";
  checkpointCode: ClockCheckpointCode;
  taskId: ClockTaskId;
  prototypeId: string;
  locale: ClockLocale;
  seed: string;
  difficulty: ClockDifficulty;
  stem: string;
  media?: ClockQuestionMedia;
  scenario: ClockScenario;
  answer: ClockSemanticAnswer;
  options: readonly ClockQuestionOption[];
  correctOptionIndex: number;
  explanation: ClockQuestionExplanation;
  solveTrace: ClockSolveTrace;
  fingerprint: string;
  lifecycle: ClockQuestionLifecycle;
}

export interface GenerateClockQuestionInput {
  taskId: ClockTaskId;
  seed: string;
  locale?: ClockLocale;
  difficulty?: ClockDifficulty;
  correctOptionIndex?: 0 | 1 | 2 | 3;
}
