import type {
  BlrDifficulty,
  BlrGender,
  BlrRelationId,
  DirectRelationClue,
  FamilyGraph,
} from "../foundation/types";
import type { GenerationRelationId } from "../foundation/family-analysis";

export type BlrCp003PrototypeId =
  | "BLR-CP003-PROT-SHARED-RELATION"
  | "BLR-CP003-PROT-SHARED-MARRIED-PAIR"
  | "BLR-CP003-PROT-SHARED-GENDER"
  | "BLR-CP003-PROT-SHARED-GENERATION"
  | "BLR-CP003-PROT-SHARED-TRUE-CLAIM"
  | "BLR-CP003-PROT-MULTI-ITEM-GROUP";

export type BlrCp003TopologyId =
  | "THREE_GENERATION_TWO_BRANCH"
  | "AFFINAL_CHILD_BRANCH"
  | "TWO_COUPLE_COUSIN_BRANCH";

export type BlrCp003QuestionKind =
  | "RELATION"
  | "MARRIED_PAIR"
  | "GENDER"
  | "GENERATION"
  | "TRUE_CLAIM";

export interface BlrCp003RelationQuestionSpec {
  kind: "RELATION";
  prototypeId: "BLR-CP003-PROT-SHARED-RELATION";
  subjectId: string;
  referenceId: string;
}

export interface BlrCp003MarriedPairQuestionSpec {
  kind: "MARRIED_PAIR";
  prototypeId: "BLR-CP003-PROT-SHARED-MARRIED-PAIR";
  personAId: string;
  personBId: string;
}

export interface BlrCp003GenderQuestionSpec {
  kind: "GENDER";
  prototypeId: "BLR-CP003-PROT-SHARED-GENDER";
  personId: string;
}

export interface BlrCp003GenerationQuestionSpec {
  kind: "GENERATION";
  prototypeId: "BLR-CP003-PROT-SHARED-GENERATION";
  subjectId: string;
  referenceId: string;
}

export interface BlrCp003TrueClaimQuestionSpec {
  kind: "TRUE_CLAIM";
  prototypeId: "BLR-CP003-PROT-SHARED-TRUE-CLAIM";
  subjectId: string;
  referenceId: string;
}

export type BlrCp003QuestionSpec =
  | BlrCp003RelationQuestionSpec
  | BlrCp003MarriedPairQuestionSpec
  | BlrCp003GenderQuestionSpec
  | BlrCp003GenerationQuestionSpec
  | BlrCp003TrueClaimQuestionSpec;

export interface BlrCp003ScenarioTemplate {
  scenarioId: string;
  topologyId: BlrCp003TopologyId;
  hiddenGraph: FamilyGraph;
  clues: readonly DirectRelationClue[];
  questions: readonly BlrCp003QuestionSpec[];
}

export type BlrCp003SemanticAnswer =
  | { kind: "RELATION"; relationId: BlrRelationId }
  | { kind: "PAIR"; personIds: readonly [string, string] }
  | { kind: "GENDER"; gender: Exclude<BlrGender, "UNKNOWN"> }
  | { kind: "GENERATION"; generationRelationId: GenerationRelationId }
  | {
      kind: "CLAIM";
      subjectId: string;
      relationId: BlrRelationId;
      referenceId: string;
    };

export interface BlrCp003Option {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface BlrCp003Explanation {
  strategy: "SHARED_GRAPH_EXACT_CLOSURE";
  familyPlacements: readonly string[];
  queryTrace: readonly string[];
  conclusion: string;
  closestTrapRejection: string;
}

export interface GeneratedBlrCp003Question {
  itemId: string;
  checkpointId: "BLR-CP-003";
  prototypeId: Exclude<BlrCp003PrototypeId, "BLR-CP003-PROT-MULTI-ITEM-GROUP">;
  permanentQlId: null;
  prototypeOnly: true;
  questionKind: BlrCp003QuestionKind;
  stem: string;
  options: readonly BlrCp003Option[];
  correctIndex: number;
  answer: BlrCp003SemanticAnswer;
  explanation: BlrCp003Explanation;
  metadata: {
    independentSolverAgreed: true;
    uniqueAnswer: true;
    optionSemanticsUnique: true;
  };
}

export interface GeneratedBlrCp003QuestionGroup {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-003";
  groupPrototypeId: "BLR-CP003-PROT-MULTI-ITEM-GROUP";
  permanentQlIds: readonly [];
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: "en-IN";
  seed: number;
  scenarioId: string;
  topologyId: BlrCp003TopologyId;
  difficulty: BlrDifficulty;
  sharedPrompt: string;
  structuredClues: readonly DirectRelationClue[];
  personNames: Readonly<Record<string, string>>;
  reconstructedFamily: FamilyGraph;
  questions: readonly GeneratedBlrCp003Question[];
  metadata: {
    runtimeVersion: "blr-cp003-prototype-v1";
    familyGraphValid: true;
    sharedPromptSolvedOnce: true;
    allItemsIndependentlySolved: true;
    everyClueContributes: true;
    clueCount: number;
    itemCount: number;
    semanticFingerprint: string;
  };
}
