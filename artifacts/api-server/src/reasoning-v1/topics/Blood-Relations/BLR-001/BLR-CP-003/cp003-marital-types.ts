import type {
  BlrRelationId,
  DirectRelationClue,
  FamilyGraph,
} from "../foundation/types";

export type BlrCp003MaritalStatus = "MARRIED" | "UNMARRIED";

export interface BlrCp003MaritalFact {
  personId: string;
  status: BlrCp003MaritalStatus;
  evidence: "EXPLICIT_STATEMENT";
}

export type BlrCp003MaritalPrototypeId =
  | "BLR-CP003-PROT-SHARED-MARITAL-STATUS"
  | "BLR-CP003-PROT-SHARED-IDENTIFY-BY-MARITAL-STATUS";

export type BlrCp003MaritalQuestionSpec =
  | {
      kind: "MARITAL_STATUS";
      prototypeId: "BLR-CP003-PROT-SHARED-MARITAL-STATUS";
      personId: string;
    }
  | {
      kind: "IDENTIFY_BY_MARITAL_STATUS";
      prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-BY-MARITAL-STATUS";
      status: BlrCp003MaritalStatus;
    }
  | {
      kind: "RELATION";
      prototypeId: "BLR-CP003-PROT-SHARED-RELATION";
      subjectId: string;
      referenceId: string;
    }
  | {
      kind: "SIBLING_PAIR";
      prototypeId: "BLR-CP003-PROT-SHARED-SIBLING-PAIR";
      personAId: string;
      personBId: string;
    }
  | {
      kind: "PARENT_CHILD_PAIR";
      prototypeId: "BLR-CP003-PROT-SHARED-PARENT-CHILD-PAIR";
      parentId: string;
      childId: string;
    };

export interface BlrCp003MaritalScenario {
  scenarioId: "BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH";
  topologyId: "EXPLICIT_UNMARRIED_BRANCH";
  hiddenGraph: FamilyGraph;
  clues: readonly DirectRelationClue[];
  maritalFacts: readonly BlrCp003MaritalFact[];
  questions: readonly BlrCp003MaritalQuestionSpec[];
}

export type BlrCp003MaritalAnswer =
  | { kind: "MARITAL_STATUS"; status: BlrCp003MaritalStatus }
  | { kind: "PERSON"; personId: string }
  | { kind: "RELATION"; relationId: BlrRelationId }
  | { kind: "PAIR"; personIds: readonly [string, string] };

export interface BlrCp003MaritalOption {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface GeneratedBlrCp003MaritalQuestion {
  itemId: string;
  prototypeId:
    | BlrCp003MaritalPrototypeId
    | "BLR-CP003-PROT-SHARED-RELATION"
    | "BLR-CP003-PROT-SHARED-SIBLING-PAIR"
    | "BLR-CP003-PROT-SHARED-PARENT-CHILD-PAIR";
  permanentQlId: null;
  prototypeOnly: true;
  stem: string;
  options: readonly BlrCp003MaritalOption[];
  correctIndex: number;
  answer: BlrCp003MaritalAnswer;
  explanation: {
    normalizedFacts: readonly string[];
    decisiveTrace: readonly string[];
    conclusion: string;
    closestTrapRejection: string;
  };
  metadata: {
    hiddenGraphAnswerAgreed: true;
    explicitStatusRequired: boolean;
    uniqueAnswer: true;
    optionSemanticsUnique: true;
  };
}

export interface GeneratedBlrCp003MaritalGroup {
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
  scenarioId: "BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH";
  topologyId: "EXPLICIT_UNMARRIED_BRANCH";
  sharedPrompt: string;
  personNames: Readonly<Record<string, string>>;
  reconstructedFamily: FamilyGraph;
  maritalFacts: readonly BlrCp003MaritalFact[];
  questions: readonly GeneratedBlrCp003MaritalQuestion[];
  metadata: {
    runtimeVersion: "blr-cp003-marital-prototype-v1";
    hiddenGraphAgreedWithClueGraph: true;
    unsupportedStatusInferenceRejected: true;
    contradictoryStatusRejected: true;
    everyClueAndStatusFactContributes: true;
    clueCount: 7;
    maritalFactCount: 1;
    itemCount: 6;
    semanticFingerprint: string;
  };
}
