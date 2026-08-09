import type {
  BlrGender,
  BlrRelationId,
  DirectRelationClue,
  FamilyGraph,
} from "../foundation/types";

export type BlrCp003SourceGapPrototypeId =
  | "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON-BY-GENDER"
  | "BLR-CP003-PROT-SHARED-RELATION"
  | "BLR-CP003-PROT-SHARED-MARRIED-PAIR";

export type BlrCp003SourceGapQuestionSpec =
  | {
      kind: "IDENTIFY_PERSON_BY_GENDER";
      prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON-BY-GENDER";
      gender: Exclude<BlrGender, "UNKNOWN">;
      candidatePersonIds: readonly [string, string, string, string];
    }
  | {
      kind: "RELATION";
      prototypeId: "BLR-CP003-PROT-SHARED-RELATION";
      subjectId: string;
      referenceId: string;
    }
  | {
      kind: "MARRIED_PAIR";
      prototypeId: "BLR-CP003-PROT-SHARED-MARRIED-PAIR";
      personAId: string;
      personBId: string;
    };

export interface BlrCp003SourceGapScenario {
  scenarioId: "BLR-CP003-SCN-COMPACT-JOINT-PARENT-PASSAGE";
  topologyId: "COMPACT_JOINT_PARENT_PASSAGE";
  hiddenGraph: FamilyGraph;
  clues: readonly DirectRelationClue[];
  questions: readonly BlrCp003SourceGapQuestionSpec[];
}

export type BlrCp003SourceGapAnswer =
  | { kind: "PERSON"; personId: string }
  | { kind: "RELATION"; relationId: BlrRelationId }
  | { kind: "PAIR"; personIds: readonly [string, string] };

export interface BlrCp003SourceGapOption {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface GeneratedBlrCp003SourceGapQuestion {
  itemId: string;
  prototypeId: BlrCp003SourceGapPrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  stem: string;
  options: readonly BlrCp003SourceGapOption[];
  correctIndex: number;
  answer: BlrCp003SourceGapAnswer;
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

export interface GeneratedBlrCp003SourceGapGroup {
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
  scenarioId: "BLR-CP003-SCN-COMPACT-JOINT-PARENT-PASSAGE";
  topologyId: "COMPACT_JOINT_PARENT_PASSAGE";
  sharedPrompt: string;
  personNames: Readonly<Record<string, string>>;
  reconstructedFamily: FamilyGraph;
  questions: readonly GeneratedBlrCp003SourceGapQuestion[];
  metadata: {
    runtimeVersion: "blr-cp003-source-gap-v1";
    hiddenGraphAgreedWithClueGraph: true;
    everyClueContributes: true;
    compactJointParentRenderer: true;
    coParenthoodExplicitlyModelled: true;
    clueCount: 8;
    itemCount: 8;
    semanticFingerprint: string;
  };
}
