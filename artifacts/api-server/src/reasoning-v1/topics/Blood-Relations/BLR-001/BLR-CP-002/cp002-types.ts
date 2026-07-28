import type {
  BlrDifficulty,
  BlrExplanationTrace,
  BlrRelationId,
  BlrRoleId,
  FamilyGraph,
} from "../foundation/types";

export type BlrCp002PrototypeId =
  | "BLR-CP002-PROT-POINTED-TO-SPEAKER"
  | "BLR-CP002-PROT-SPEAKER-TO-POINTED"
  | "BLR-CP002-PROT-NESTED-QUERY-ENDPOINT"
  | "BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION"
  | "BLR-CP002-PROT-THREE-ANCHOR-INTRODUCTION"
  | "BLR-CP002-PROT-SELF-IDENTITY";

export type BlrCp002Presentation =
  | "POINTING"
  | "PHOTOGRAPH"
  | "INTRODUCTION"
  | "STAGE"
  | "CONVERSATION";

export type BlrCp002Anchor = "SPEAKER" | "LISTENER" | "POINTED_PERSON";
export type BlrCp002AnswerId = BlrRelationId | "SELF";

export interface BlrRoleStep {
  relationId: BlrRoleId;
  quantifier: "ANY" | "ONLY";
}

export type BlrEntityExpression =
  | {
      kind: "ANCHOR";
      anchor: BlrCp002Anchor;
    }
  | {
      kind: "ROLE_CHAIN";
      anchor: BlrCp002Anchor;
      steps: readonly BlrRoleStep[];
    };

export type BlrRoleAssertionRelation =
  | {
      kind: "SAME_PERSON";
    }
  | {
      kind: "KINSHIP";
      relationId: BlrRoleId;
      quantifier: "ANY" | "ONLY";
    };

export interface BlrRoleAssertion {
  subject: BlrEntityExpression;
  relation: BlrRoleAssertionRelation;
  reference: BlrEntityExpression;
}

export interface BlrRoleCardinalityConstraint {
  reference: BlrEntityExpression;
  relationId: BlrRoleId;
  cardinality: "NONE";
}

export interface BlrCp002Query {
  subject: BlrEntityExpression;
  reference: BlrEntityExpression;
}

export interface BlrCp002StructuredPrompt {
  presentation: BlrCp002Presentation;
  speakerId: string;
  listenerId?: string;
  pointedPersonId?: string;
  personNames: Readonly<Record<string, string>>;
  familyGraph: FamilyGraph;
  constraints: readonly BlrRoleCardinalityConstraint[];
  assertion: BlrRoleAssertion;
  query: BlrCp002Query;
}

export interface BlrCp002SolvedExpression {
  expression: BlrEntityExpression;
  candidateIds: readonly string[];
  resolvedPersonId: string;
  trace: readonly string[];
  onlyConstraintCount: number;
}

export interface BlrCp002Solution {
  answerId: BlrCp002AnswerId;
  querySubjectId: string;
  queryReferenceId: string;
  pathPersonIds: readonly string[];
  pathLength: number;
  constraintsVerified: true;
  constraintTrace: readonly string[];
  assertionVerified: true;
  subjectExpression: BlrCp002SolvedExpression;
  referenceExpression: BlrCp002SolvedExpression;
}

export interface GeneratedBlrCp002Option {
  value: string;
  answerId: BlrCp002AnswerId;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface GeneratedBlrCp002PrototypeQuestion {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-002";
  prototypeId: BlrCp002PrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  ruleId: "BLOOD_ROLE_CHAIN_RELATION";
  seed: number;
  locale: "en-IN";
  difficulty: BlrDifficulty;
  renderer: "DIALOGUE_STRUCTURED_TEXT";
  answerType: "RELATION_LABEL_OR_SELF";
  stem: string;
  structuredPrompt: BlrCp002StructuredPrompt;
  options: readonly GeneratedBlrCp002Option[];
  correctIndex: number;
  explanation: BlrExplanationTrace;
  metadata: {
    runtimeVersion: "blr-cp002-prototype-v1";
    scenarioId: string;
    hiddenFingerprint: string;
    answerId: BlrCp002AnswerId;
    presentation: BlrCp002Presentation;
    assertionRoleDepth: number;
    queryRoleDepth: number;
    onlyConstraintCount: number;
    negativeConstraintCount: number;
    pathLength: number;
    selfIdentity: boolean;
    familyGraphValid: true;
    constraintsVerified: true;
    assertionVerified: true;
    independentSolverAgreed: true;
    ambiguityAccepted: true;
    distractorErrorLabels: readonly string[];
  };
}
