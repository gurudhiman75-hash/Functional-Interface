import type { GenerationRelationId } from "../foundation/family-analysis";
import type {
  BlrDifficulty,
  BlrExplanationTrace,
  BlrRelationId,
  BlrRenderer,
  DirectRelationClue,
} from "../foundation/types";

export type BlrCp001AdvancedPrototypeId =
  | "BLR-CP001-PROT-IDENTIFY-PERSON"
  | "BLR-CP001-PROT-IDENTIFY-PAIR"
  | "BLR-CP001-PROT-RELATION-CLAIM"
  | "BLR-CP001-PROT-GENERATION-COMPARISON"
  | "BLR-CP001-PROT-BRANCHING-RELATION";

export type BlrCp001AdvancedTaskKind =
  | "IDENTIFY_PERSON_BY_RELATION"
  | "IDENTIFY_ORDERED_PAIR"
  | "SELECT_RELATION_CLAIM"
  | "COMPARE_GENERATIONS"
  | "SOLVE_BRANCHING_RELATION";

export type BlrCp001AdvancedAnswerType =
  | "PERSON_NAME"
  | "ORDERED_PAIR"
  | "RELATION_CLAIM"
  | "GENERATION_LABEL"
  | "RELATION_LABEL";

export type BlrCp001AdvancedRuleId =
  | "BLOOD_GRAPH_IDENTITY"
  | "BLOOD_GRAPH_PAIR"
  | "BLOOD_GRAPH_CLAIM"
  | "BLOOD_GRAPH_GENERATION"
  | "BLOOD_GRAPH_RELATION";

export interface BlrRelationClaim {
  subjectId: string;
  relationId: BlrRelationId;
  referenceId: string;
}

export interface BlrOrderedPair {
  subjectId: string;
  referenceId: string;
}

export type BlrCp001AdvancedQuery =
  | {
      kind: "IDENTIFY_PERSON_BY_RELATION";
      referenceId: string;
      relationId: BlrRelationId;
    }
  | {
      kind: "IDENTIFY_ORDERED_PAIR";
      relationId: BlrRelationId;
      candidatePairs: readonly BlrOrderedPair[];
    }
  | {
      kind: "SELECT_RELATION_CLAIM";
      targetTruth: "TRUE" | "FALSE";
      claims: readonly BlrRelationClaim[];
    }
  | {
      kind: "COMPARE_GENERATIONS";
      subjectId: string;
      referenceId: string;
    }
  | {
      kind: "SOLVE_BRANCHING_RELATION";
      subjectId: string;
      referenceId: string;
    };

export interface BlrCp001AdvancedStructuredPrompt {
  clues: readonly DirectRelationClue[];
  personNames: Readonly<Record<string, string>>;
  query: BlrCp001AdvancedQuery;
}

export interface BlrCp001AdvancedOption {
  value: string;
  answerKey: string;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface GeneratedBlrCp001AdvancedPrototypeQuestion {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-001";
  prototypeId: BlrCp001AdvancedPrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  ruleId: BlrCp001AdvancedRuleId;
  seed: number;
  locale: "en-IN";
  difficulty: BlrDifficulty;
  renderer: BlrRenderer;
  answerType: BlrCp001AdvancedAnswerType;
  stem: string;
  structuredPrompt: BlrCp001AdvancedStructuredPrompt;
  options: readonly BlrCp001AdvancedOption[];
  correctIndex: number;
  explanation: BlrExplanationTrace;
  metadata: {
    runtimeVersion: "blr-cp001-advanced-prototype-v1";
    taskKind: BlrCp001AdvancedTaskKind;
    scenarioId: string;
    correctAnswerKey: string;
    hiddenFingerprint: string;
    clueCount: number;
    personCount: number;
    graphEdgeCount: number;
    pathLength: number | null;
    generationDelta: number | null;
    targetTruth: "TRUE" | "FALSE" | null;
    inferredSiblingRequired: boolean;
    ambiguityAccepted: true;
    independentSolverAgreed: true;
    familyGraphValid: true;
    distractorErrorLabels: readonly string[];
  };
}
