import type {
  Cp003AnswerSemantic,
  Cp003ContextClass,
  Cp003Difficulty,
  Cp003MathematicalState,
  Cp003QuestionContract,
  Cp003Representation,
  IntCp003QlId,
  Rational,
} from "./cp003-exam-model";
import type { Cp003SolveContract } from "./cp003-math-authority";
import type { Cp003SolutionMethodId, Cp003SolutionTrace } from "./cp003-solution-trace";

export interface Cp003PresentationTable {
  readonly headers: readonly string[];
  readonly rows: readonly (readonly string[])[];
}

export interface Cp003RenderedPresentation {
  readonly representation: Cp003Representation;
  readonly stemFamilyId: string;
  readonly leadText?: string;
  readonly table?: Cp003PresentationTable;
  readonly prompt: string;
  readonly markdown: string;
}

export interface Cp003Option {
  readonly text: string;
  readonly value: Rational;
  readonly misconceptionId: string;
  readonly calculation: string;
  readonly studentFeedback: string;
  readonly isCorrect: boolean;
}

export interface Cp003ExplanationLayer {
  readonly steps: readonly string[];
  readonly sourceStepIds: readonly string[];
}

export interface Cp003StudentExplanation {
  readonly traceVersion: string;
  readonly methodId: Cp003SolutionMethodId;
  readonly keyIdea: string;
  readonly steps: readonly string[];
  readonly sourceStepIds: readonly string[];
  readonly finalAnswer: string;
  readonly shortcut?: Readonly<{
    title: string;
    steps: readonly string[];
    sourceStepIds: readonly string[];
  }>;
  readonly commonMistake?: string;
  readonly verification?: Readonly<{
    method: string;
    steps: readonly string[];
    sourceStepIds: readonly string[];
  }>;
  readonly depths: Readonly<{
    exam: Cp003ExplanationLayer;
    student: Cp003ExplanationLayer;
    foundation: Cp003ExplanationLayer;
  }>;
}

export interface IntCp003ExamQuestion {
  readonly packageId: "INT-001";
  readonly canonicalProblemId: "INT-CP-003";
  readonly checkpointId: "INT-CP-003-EXAM-READINESS-REMEDIATION";
  readonly permanentQlId: IntCp003QlId;
  readonly qlId: IntCp003QlId;
  readonly solveContract: Cp003SolveContract;
  readonly authorityVersion: string;
  readonly generatorVersion: string;
  readonly solverVersion: string;
  readonly verifierVersion: string;
  readonly seed: string;
  readonly mathematicalState: Cp003MathematicalState;
  readonly mathematicalFingerprint: string;
  readonly numericFamilyKey: string;
  readonly rateProfileId: string;
  readonly normalizedTemplateKey: string;
  readonly contextClass: Cp003ContextClass;
  readonly presentation: Cp003RenderedPresentation;
  readonly difficulty: Cp003Difficulty;
  readonly difficultyProfile: Cp003QuestionContract["difficultyProfile"];
  readonly answerSemantic: Cp003AnswerSemantic;
  readonly options: readonly Cp003Option[];
  readonly correctIndex: number;
  readonly correctAnswer: string;
  readonly solution: Rational;
  readonly solutionTrace: Cp003SolutionTrace;
  readonly explanation: Cp003StudentExplanation;
  readonly editorialStatus: "SECOND_REMEDIATION_REVIEW_CANDIDATE";
  readonly approvalStatus: "WITHDRAWN_PENDING_REAUDIT";
  readonly enabled: false;
  readonly stagingStatus: "NOT_STAGED";
  readonly registrationStatus: "NOT_REGISTERED";
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}
