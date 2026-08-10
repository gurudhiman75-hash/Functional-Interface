import type {
  BlrRelationId,
  DirectRelationClue,
  FamilyGraph,
} from "../foundation/types";

export type BlrCp003ExtendedPrototypeId =
  | "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON"
  | "BLR-CP003-PROT-SHARED-SIBLING-PAIR"
  | "BLR-CP003-PROT-SHARED-PARENT-CHILD-PAIR"
  | "BLR-CP003-PROT-SHARED-FALSE-CLAIM"
  | "BLR-CP003-PROT-SHARED-MEMBER-SET";

export type BlrCp003ExtendedQuestionSpec =
  | {
      kind: "IDENTIFY_PERSON";
      prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON";
      relationId: BlrRelationId;
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
    }
  | {
      kind: "FALSE_CLAIM";
      prototypeId: "BLR-CP003-PROT-SHARED-FALSE-CLAIM";
      subjectId: string;
      falseRelationId: BlrRelationId;
      referenceId: string;
    }
  | {
      kind: "MEMBER_SET";
      prototypeId: "BLR-CP003-PROT-SHARED-MEMBER-SET";
      relationId: BlrRelationId;
      referenceId: string;
    };

export interface BlrCp003ExtendedScenario {
  scenarioId: "BLR-CP003-SCN-SIBLING-SET-BRANCH";
  topologyId: "SIBLING_SET_BRANCH";
  hiddenGraph: FamilyGraph;
  clues: readonly DirectRelationClue[];
  questions: readonly BlrCp003ExtendedQuestionSpec[];
}

export type BlrCp003ExtendedAnswer =
  | { kind: "PERSON"; personId: string }
  | { kind: "PAIR"; personIds: readonly [string, string] }
  | {
      kind: "CLAIM";
      subjectId: string;
      relationId: BlrRelationId;
      referenceId: string;
    }
  | { kind: "PERSON_SET"; personIds: readonly string[] };

export interface BlrCp003ExtendedOption {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface GeneratedBlrCp003ExtendedQuestion {
  itemId: string;
  prototypeId: BlrCp003ExtendedPrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  stem: string;
  options: readonly BlrCp003ExtendedOption[];
  correctIndex: number;
  answer: BlrCp003ExtendedAnswer;
  explanation: {
    normalizedClues: readonly string[];
    decisiveTrace: readonly string[];
    conclusion: string;
    closestTrapRejection: string;
  };
  metadata: {
    hiddenGraphAnswerAgreed: true;
    uniqueAnswer: true;
    optionSemanticsUnique: true;
  };
}

export interface GeneratedBlrCp003ExtendedGroup {
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
  scenarioId: "BLR-CP003-SCN-SIBLING-SET-BRANCH";
  topologyId: "SIBLING_SET_BRANCH";
  sharedPrompt: string;
  personNames: Readonly<Record<string, string>>;
  reconstructedFamily: FamilyGraph;
  questions: readonly GeneratedBlrCp003ExtendedQuestion[];
  metadata: {
    runtimeVersion: "blr-cp003-extended-prototype-v1";
    hiddenGraphAgreedWithClueGraph: true;
    everyClueContributes: true;
    clueCount: 6;
    itemCount: 7;
    semanticFingerprint: string;
  };
}
