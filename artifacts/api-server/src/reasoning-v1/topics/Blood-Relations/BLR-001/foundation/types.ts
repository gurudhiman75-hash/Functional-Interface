export type BlrLocale = "en-IN" | "hi-IN" | "pa-IN";
export type BlrDifficulty = "EASY" | "MEDIUM" | "HARD";
export type BlrGender = "MALE" | "FEMALE" | "UNKNOWN";
export type BlrRenderer = "STRUCTURED_TEXT" | "FAMILY_TREE_EXPLANATION";

export type DirectRelationId =
  | "FATHER"
  | "MOTHER"
  | "SON"
  | "DAUGHTER"
  | "BROTHER"
  | "SISTER"
  | "HUSBAND"
  | "WIFE";

export type BlrRelationId =
  | DirectRelationId
  | "GRANDFATHER"
  | "GRANDMOTHER"
  | "GRANDSON"
  | "GRANDDAUGHTER"
  | "UNCLE"
  | "AUNT"
  | "NEPHEW"
  | "NIECE"
  | "COUSIN"
  | "FATHER_IN_LAW"
  | "MOTHER_IN_LAW"
  | "SON_IN_LAW"
  | "DAUGHTER_IN_LAW"
  | "BROTHER_IN_LAW"
  | "SISTER_IN_LAW";

export type PrimitivePathStep = "PARENT" | "CHILD" | "SIBLING" | "SPOUSE";

export interface FamilyPerson {
  personId: string;
  name: string;
  gender: BlrGender;
}

export interface ParentEdge {
  parentId: string;
  childId: string;
}

export interface SpouseEdge {
  personAId: string;
  personBId: string;
}

export interface SiblingEdge {
  personAId: string;
  personBId: string;
}

export interface FamilyGraph {
  persons: readonly FamilyPerson[];
  parentEdges: readonly ParentEdge[];
  spouseEdges: readonly SpouseEdge[];
  siblingEdges: readonly SiblingEdge[];
}

export interface DirectRelationClue {
  subjectId: string;
  relationId: DirectRelationId;
  referenceId: string;
}

export interface BlrRelationQuery {
  subjectId: string;
  referenceId: string;
}

export interface BlrStructuredPrompt {
  clues: readonly DirectRelationClue[];
  query: BlrRelationQuery;
  personNames: Readonly<Record<string, string>>;
}

export interface RelationPath {
  personIds: readonly string[];
  steps: readonly PrimitivePathStep[];
}

export interface RelationSolution {
  relationId: BlrRelationId;
  path: RelationPath;
}

export interface GeneratedBlrOption {
  value: string;
  relationId: BlrRelationId;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface BlrDistractorExplanation {
  optionValue: string;
  errorLabel: string;
  studentWarning: string;
}

export interface BlrExplanationTrace {
  ruleStatement: string;
  normalizedClues: readonly string[];
  queryPath: readonly string[];
  conclusion: string;
  closestTrapRejection?: string;
  coreConcept?: readonly string[];
  familyTreeGrid?: string;
  generationAnalysis?: readonly string[];
  examShortcut?: string;
  distractorAnalysis?: readonly BlrDistractorExplanation[];
}

export type BlrCp001PrototypeId =
  | "BLR-CP001-PROT-DIRECT-FORWARD"
  | "BLR-CP001-PROT-DIRECT-REVERSE"
  | "BLR-CP001-PROT-COMPOSED-TWO-EDGE"
  | "BLR-CP001-PROT-COMPOSED-THREE-EDGE";

export interface GeneratedBlrCp001PrototypeQuestion {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-001";
  prototypeId: BlrCp001PrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  ruleId: "BLOOD_GRAPH_RELATION";
  seed: number;
  locale: "en-IN";
  difficulty: BlrDifficulty;
  renderer: BlrRenderer;
  answerType: "RELATION_LABEL";
  stem: string;
  structuredPrompt: BlrStructuredPrompt;
  options: readonly GeneratedBlrOption[];
  correctIndex: number;
  explanation: BlrExplanationTrace;
  metadata: {
    runtimeVersion: "blr-cp001-prototype-v1";
    hiddenFingerprint: string;
    relationId: BlrRelationId;
    reverseRelationId: BlrRelationId | null;
    pathLength: number;
    clueCount: number;
    ambiguityAccepted: true;
    independentSolverAgreed: true;
    familyGraphValid: true;
    distractorErrorLabels: readonly string[];
  };
}
