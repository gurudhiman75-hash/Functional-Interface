import type {
  BlrCp006CodeDefinition,
  BlrCp006CodedStatement,
  BlrCp006DirectRelation,
  BlrCp006FamilyTree,
  BlrCp006Graph,
  BlrCp006Relation,
} from "../BLR-CP-006/cp006-model";

export const BLR_CP007_RUNTIME_VERSION = "blr-cp007-coded-construction-v1" as const;
export const BLR_CP007_FREEZE_VERSION = "BLR_CP007_ENGLISH_DISCOVERY_FREEZE_V1" as const;

export type BlrCp007QlId =
  | "BLR-QL-031"
  | "BLR-QL-032"
  | "BLR-QL-033"
  | "BLR-QL-034"
  | "BLR-QL-035";

export type BlrCp007Authority =
  | "SELECT_CODED_EXPRESSION"
  | "COMPLETE_MISSING_CODE_TOKEN"
  | "COMPLETE_ORDERED_CODE_TOKEN_PAIR"
  | "COMPLETE_MISSING_PERSON"
  | "SELECT_CODED_STATEMENT_BY_VALIDITY";

export type BlrCp007PrototypeId =
  | "BLR-CP007-PROT-SELECT-DIRECT-FORWARD"
  | "BLR-CP007-PROT-SELECT-DIRECT-REVERSE"
  | "BLR-CP007-PROT-SELECT-TWO-LINK-FORWARD"
  | "BLR-CP007-PROT-SELECT-TWO-LINK-REVERSE"
  | "BLR-CP007-PROT-SELECT-THREE-LINK"
  | "BLR-CP007-PROT-SELECT-AFFINAL"
  | "BLR-CP007-PROT-MISSING-TOKEN-DIRECT"
  | "BLR-CP007-PROT-MISSING-TOKEN-REVERSE"
  | "BLR-CP007-PROT-MISSING-TOKEN-FIRST-LINK"
  | "BLR-CP007-PROT-MISSING-TOKEN-SECOND-LINK"
  | "BLR-CP007-PROT-MISSING-PAIR-TWO-LINK"
  | "BLR-CP007-PROT-MISSING-PAIR-THREE-LINK"
  | "BLR-CP007-PROT-MISSING-PAIR-AFFINAL"
  | "BLR-CP007-PROT-MISSING-PERSON-DIRECT-LEFT"
  | "BLR-CP007-PROT-MISSING-PERSON-DIRECT-RIGHT"
  | "BLR-CP007-PROT-MISSING-PERSON-INTERNAL"
  | "BLR-CP007-PROT-MISSING-PERSON-ENDPOINT"
  | "BLR-CP007-PROT-VALIDITY-CORRECT-DIRECT"
  | "BLR-CP007-PROT-VALIDITY-INCORRECT-DIRECT"
  | "BLR-CP007-PROT-VALIDITY-CORRECT-DERIVED"
  | "BLR-CP007-PROT-VALIDITY-INCORRECT-DERIVED";

export interface BlrCp007ExpressionCandidate {
  text: string;
  statements: readonly BlrCp006CodedStatement[];
  semanticKey: string;
  claim?: {
    subjectId: string;
    relationId: BlrCp006Relation;
    referenceId: string;
  };
}

export type BlrCp007Query =
  | {
      kind: "SELECT_EXPRESSION";
      target: {
        subjectId: string;
        relationId: BlrCp006Relation;
        referenceId: string;
      };
      candidates: readonly BlrCp007ExpressionCandidate[];
    }
  | {
      kind: "MISSING_TOKEN";
      completeStatements: readonly BlrCp006CodedStatement[];
      blankStatementIndex: number;
      expressionLines: readonly string[];
      candidateTokens: readonly string[];
      target: {
        subjectId: string;
        relationId: BlrCp006Relation;
        referenceId: string;
      };
    }
  | {
      kind: "MISSING_TOKEN_PAIR";
      completeStatements: readonly BlrCp006CodedStatement[];
      blankStatementIndices: readonly [number, number];
      expressionLines: readonly string[];
      candidateTokenPairs: readonly (readonly [string, string])[];
      target: {
        subjectId: string;
        relationId: BlrCp006Relation;
        referenceId: string;
      };
    }
  | {
      kind: "MISSING_PERSON";
      completeStatements: readonly BlrCp006CodedStatement[];
      blankStatementIndex: number;
      blankSide: "LEFT" | "RIGHT";
      expressionLines: readonly string[];
      candidatePersonIds: readonly string[];
      target: {
        subjectId: string;
        relationId: BlrCp006Relation;
        referenceId: string;
      };
    }
  | {
      kind: "SELECT_VALIDITY";
      desiredStatus: "VALID" | "INVALID";
      candidates: readonly BlrCp007ExpressionCandidate[];
    };

export interface BlrCp007Scenario {
  scenarioId: string;
  topologyId: string;
  keyStyle: "SYMBOL" | "LETTER" | "NEUTRAL_WORD";
  codeKey: readonly BlrCp006CodeDefinition[];
  authority: BlrCp007Authority;
  prototypeId: BlrCp007PrototypeId;
  qlId: BlrCp007QlId;
  sharedPrompt: string;
  stem: string;
  query: BlrCp007Query;
}

export interface BlrCp007Option {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface GeneratedBlrCp007Question {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-007";
  qlId: BlrCp007QlId;
  permanentQlId: BlrCp007QlId;
  solveAuthority: BlrCp007Authority;
  sourcePrototypeId: BlrCp007PrototypeId;
  prototypeOnly: false;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: "en-IN";
  seed: number;
  itemId: string;
  scenarioId: string;
  topologyId: string;
  keyStyle: BlrCp007Scenario["keyStyle"];
  codeKey: readonly BlrCp006CodeDefinition[];
  query: BlrCp007Query;
  sharedPrompt: string;
  stem: string;
  answerType: "CODED_EXPRESSION" | "CODE_TOKEN" | "ORDERED_TOKEN_PAIR" | "PERSON_LABEL" | "CODED_STATEMENT";
  options: readonly BlrCp007Option[];
  correctIndex: number;
  answer: string;
  completedStatements: readonly BlrCp006CodedStatement[];
  decodedStatements: readonly string[];
  graph: BlrCp006Graph;
  explanation: {
    coreConcept: readonly string[];
    constructionAudit: readonly string[];
    graphAudit: readonly string[];
    conclusion: string;
    examShortcut: string;
    commonTraps: readonly string[];
    optionAnalysis: readonly {
      optionLabel: "A" | "B" | "C" | "D";
      optionText: string;
      isCorrect: boolean;
      explanation: string;
    }[];
    familyTree: BlrCp006FamilyTree;
  };
  metadata: {
    runtimeVersion: typeof BLR_CP007_RUNTIME_VERSION;
    freezeVersion: typeof BLR_CP007_FREEZE_VERSION;
    completeKeyCoverage: true;
    noArithmeticPrecedence: true;
    displayedExpressionParity: true;
    explicitGenderEvidence: true;
    nameBasedGenderAssumptions: 0;
    independentVerifierAgreed: true;
    uniqueAnswer: true;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    semanticFingerprint: string;
  };
}

export const BLR_CP007_CONTRACTS = [
  { qlId: "BLR-QL-031", solveAuthority: "SELECT_CODED_EXPRESSION", answerType: "CODED_EXPRESSION" },
  { qlId: "BLR-QL-032", solveAuthority: "COMPLETE_MISSING_CODE_TOKEN", answerType: "CODE_TOKEN" },
  { qlId: "BLR-QL-033", solveAuthority: "COMPLETE_ORDERED_CODE_TOKEN_PAIR", answerType: "ORDERED_TOKEN_PAIR" },
  { qlId: "BLR-QL-034", solveAuthority: "COMPLETE_MISSING_PERSON", answerType: "PERSON_LABEL" },
  { qlId: "BLR-QL-035", solveAuthority: "SELECT_CODED_STATEMENT_BY_VALIDITY", answerType: "CODED_STATEMENT" },
] as const;

export function semanticFingerprint(parts: readonly (string | number)[]): string {
  const text = parts.join("¦");
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= code + index;
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  const left = (h1 >>> 0).toString(16).padStart(8, "0");
  const right = (h2 >>> 0).toString(16).padStart(8, "0");
  return `${left}${right}${right}${left}`;
}

export function rotate<T>(values: readonly T[], amount: number): T[] {
  if (!values.length) return [];
  const offset = ((amount % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

export function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return ["A", "B", "C", "D"][index] as "A" | "B" | "C" | "D";
}

export type {
  BlrCp006CodeDefinition,
  BlrCp006CodedStatement,
  BlrCp006DirectRelation,
  BlrCp006Graph,
  BlrCp006Relation,
};
