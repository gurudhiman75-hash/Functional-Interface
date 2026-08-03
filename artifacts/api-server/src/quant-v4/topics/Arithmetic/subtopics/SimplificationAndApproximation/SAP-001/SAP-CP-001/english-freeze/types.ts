import type { ExpressionNode } from "../../../shared/expression-ast";
import type { EvaluationTraceStep } from "../../../shared/exact-evaluator";
import type { SapCp001Wave02QuestionState } from "../wave02/types";
import type {
  SapCp001EnglishTemplateId,
  SapCp001PrototypeId,
} from "../SAP-CP-001-ENGLISH-TEMPLATE-PROPOSAL";

export type SapCp001EnglishDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface SapCp001EnglishOption {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string | null;
  readonly analysis: string;
}

export interface SapCp001EnglishExplanation {
  readonly coreConcept: string;
  readonly givenDataAndStrategy: string;
  readonly stepByStep: readonly string[];
  readonly examSpeedMethod: string;
  readonly commonTraps: readonly string[];
  readonly finalAnswer: string;
}

export interface SapCp001DifficultyProfile {
  readonly materialDecisionCount: number;
  readonly representationLoad: number;
  readonly signedArithmeticRisk: number;
  readonly diagnosticLoad: number;
  readonly arithmeticLoad: number;
  readonly calibratedScore: number;
  readonly calibrationScope: "WITHIN_SAP_CP001";
}

export interface SapCp001IndependentEvidence {
  readonly label: string;
  readonly value: string;
  readonly rpnTrace: readonly string[];
}

export interface SapCp001EnglishTechnicalDetails {
  readonly originalStem: string;
  readonly expression: ExpressionNode | null;
  readonly questionState: SapCp001Wave02QuestionState | null;
  readonly hiddenState: Readonly<Record<string, string | number | boolean>>;
  readonly mathematicalFingerprint: string;
  readonly canonicalTrace: readonly EvaluationTraceStep[];
  readonly independentEvidence: readonly SapCp001IndependentEvidence[];
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly discoveryValidation: {
    readonly ok: boolean;
    readonly errors: readonly string[];
  };
  readonly lifecycle: {
    readonly permanentQlId: null;
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export interface SapCp001EnglishCandidate {
  readonly packageId: "SAP-001";
  readonly checkpointId: "SAP-CP-001";
  readonly temporaryPrototypeId: SapCp001PrototypeId;
  readonly proposedTemplateId: SapCp001EnglishTemplateId;
  readonly permanentQlId: null;
  readonly locale: "en-IN";
  readonly seed: number;
  readonly difficulty: SapCp001EnglishDifficulty;
  readonly difficultyEvidence: readonly string[];
  readonly difficultyProfile: SapCp001DifficultyProfile;
  readonly taskDirection: string;
  readonly answerSemantic: string;
  readonly stemTemplateId: string;
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly options: readonly SapCp001EnglishOption[];
  readonly correctIndex: number;
  readonly explanation: SapCp001EnglishExplanation;
  readonly editorialStatus: "ENGLISH_MANUAL_FREEZE_APPROVED";
  readonly reviewDecision: "APPROVE_FOR_ID_FREE_TEMPLATE_PROPOSAL";
  readonly reviewComments: readonly string[];
  readonly technicalDetails: SapCp001EnglishTechnicalDetails;
}

export interface SapCp001EnglishReviewItem extends SapCp001EnglishCandidate {
  readonly reviewOrdinal: number;
  readonly samplePurpose: "EASY_SAMPLE" | "MEDIUM_SAMPLE" | "HARD_SAMPLE";
  readonly reviewer: "EXAMTREE_EDITORIAL_AUTHORITY";
}
