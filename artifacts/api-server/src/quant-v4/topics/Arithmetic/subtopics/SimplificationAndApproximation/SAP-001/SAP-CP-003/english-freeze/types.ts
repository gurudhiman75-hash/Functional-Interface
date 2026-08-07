import type {
  SapCp003PermanentPackage,
  SapCp003PermanentQlId,
} from "../permanent-runtime/runtime";
import type {
  SapCp003Difficulty,
  SapCp003PrototypeId,
  SapCp003TaskDirection,
} from "../types";

export interface SapCp003FrozenExplanation {
  readonly coreConcept: string;
  readonly givenDataAndStrategy: string;
  readonly stepByStep: readonly string[];
  readonly whyThisWorks: string;
  readonly commonTraps: readonly [string, string, string];
  readonly finalAnswer: string;
}

export interface SapCp003ExplanationValidation {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly learnerLanguagePassed: boolean;
  readonly structurePassed: boolean;
  readonly exactStepsPassed: boolean;
  readonly trapQualityPassed: boolean;
  readonly finalAnswerBindingPassed: boolean;
  readonly lifecyclePassed: boolean;
}

export interface SapCp003EnglishExplanationCandidate
  extends Omit<SapCp003PermanentPackage, "explanation" | "lifecycle"> {
  readonly explanation: SapCp003FrozenExplanation;
  readonly explanationFingerprint: string;
  readonly explanationReviewStatus: "CANDIDATE_READY_FOR_HUMAN_REVIEW";
  readonly explanationValidation: SapCp003ExplanationValidation;
  readonly lifecycle: {
    readonly permanentQlId: SapCp003PermanentQlId;
    readonly identityStatus: "PERMANENT_ID_ALLOCATED";
    readonly contentStatus: "QUESTIONS_AND_ANSWERS_APPROVED_EXPLANATION_REVIEW_PENDING";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export interface SapCp003ExplanationReviewRecord {
  readonly reviewId: string;
  readonly permanentQlId: SapCp003PermanentQlId;
  readonly prototypeId: SapCp003PrototypeId;
  readonly taskDirection: SapCp003TaskDirection;
  readonly difficulty: SapCp003Difficulty;
  readonly stem: string;
  readonly correctAnswer: string;
  readonly explanation: SapCp003FrozenExplanation;
  readonly explanationFingerprint: string;
}
