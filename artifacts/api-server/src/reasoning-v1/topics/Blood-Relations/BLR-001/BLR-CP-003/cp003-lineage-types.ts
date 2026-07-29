import type { BlrExactLineageRelationId } from "../BLR-CP-001/lineage-prototype-types";
import type {
  BlrRelationId,
  DirectRelationClue,
  FamilyGraph,
} from "../foundation/types";

export type BlrCp003LineageTopologyId =
  | "DUAL_MATERNAL_PATERNAL_BRANCH"
  | "FOUR_GENERATION_DIRECT_LINE";

export type BlrCp003LineagePrototypeId =
  | "BLR-CP003-PROT-SHARED-EXACT-LINEAGE"
  | "BLR-CP003-PROT-SHARED-IDENTIFY-BY-EXACT-LINEAGE"
  | "BLR-CP003-PROT-SHARED-GREAT-RELATION"
  | "BLR-CP003-PROT-SHARED-IDENTIFY-BY-RELATION"
  | "BLR-CP003-PROT-SHARED-THREE-GENERATION-COMPARE"
  | "BLR-CP003-PROT-SHARED-TRUE-CLAIM";

export type BlrCp003GenerationDistanceId =
  | "SAME_GENERATION"
  | "ONE_GENERATION_ABOVE"
  | "TWO_GENERATIONS_ABOVE"
  | "THREE_GENERATIONS_ABOVE"
  | "ONE_GENERATION_BELOW"
  | "TWO_GENERATIONS_BELOW"
  | "THREE_GENERATIONS_BELOW";

export type BlrCp003LineageQuestionSpec =
  | {
      kind: "EXACT_LINEAGE";
      prototypeId: "BLR-CP003-PROT-SHARED-EXACT-LINEAGE";
      subjectId: string;
      referenceId: string;
    }
  | {
      kind: "IDENTIFY_BY_EXACT_LINEAGE";
      prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-BY-EXACT-LINEAGE";
      exactRelationId: BlrExactLineageRelationId;
      referenceId: string;
    }
  | {
      kind: "RELATION";
      prototypeId: "BLR-CP003-PROT-SHARED-GREAT-RELATION";
      subjectId: string;
      referenceId: string;
    }
  | {
      kind: "IDENTIFY_BY_RELATION";
      prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-BY-RELATION";
      relationId: BlrRelationId;
      referenceId: string;
    }
  | {
      kind: "GENERATION_DISTANCE";
      prototypeId: "BLR-CP003-PROT-SHARED-THREE-GENERATION-COMPARE";
      subjectId: string;
      referenceId: string;
    }
  | {
      kind: "TRUE_CLAIM";
      prototypeId: "BLR-CP003-PROT-SHARED-TRUE-CLAIM";
      subjectId: string;
      referenceId: string;
    };

export interface BlrCp003LineageScenario {
  scenarioId: string;
  topologyId: BlrCp003LineageTopologyId;
  displayRootId: string;
  hiddenGraph: FamilyGraph;
  clues: readonly DirectRelationClue[];
  questions: readonly BlrCp003LineageQuestionSpec[];
}

export type BlrCp003LineageAnswer =
  | { kind: "EXACT_LINEAGE"; relationId: BlrExactLineageRelationId }
  | { kind: "RELATION"; relationId: BlrRelationId }
  | { kind: "PERSON"; personId: string }
  | { kind: "GENERATION_DISTANCE"; relationId: BlrCp003GenerationDistanceId }
  | {
      kind: "CLAIM";
      subjectId: string;
      relationId: BlrRelationId;
      referenceId: string;
    };

export interface BlrCp003LineageOption {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface GeneratedBlrCp003LineageQuestion {
  itemId: string;
  prototypeId: BlrCp003LineagePrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  stem: string;
  options: readonly BlrCp003LineageOption[];
  correctIndex: number;
  answer: BlrCp003LineageAnswer;
  explanation: {
    normalizedClues: readonly string[];
    pathTrace: readonly string[];
    generationRows: readonly string[];
    conclusion: string;
    closestTrapRejection: string;
  };
  metadata: {
    hiddenGraphAnswerAgreed: true;
    exactLineageSolverReused: boolean;
    uniqueAnswer: true;
    optionSemanticsUnique: true;
  };
}

export interface GeneratedBlrCp003LineageGroup {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-003";
  permanentQlIds: readonly [];
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: "en-IN";
  seed: number;
  scenarioId: string;
  topologyId: BlrCp003LineageTopologyId;
  sharedPrompt: string;
  personNames: Readonly<Record<string, string>>;
  reconstructedFamily: FamilyGraph;
  generationRows: readonly string[];
  questions: readonly GeneratedBlrCp003LineageQuestion[];
  metadata: {
    runtimeVersion: "blr-cp003-lineage-saturation-v1";
    hiddenGraphAgreedWithClueGraph: true;
    everyClueContributes: true;
    exactLineageSolverReused: true;
    clueCount: number;
    itemCount: 6;
    maxGenerationSpan: 2 | 3;
    semanticFingerprint: string;
  };
}
