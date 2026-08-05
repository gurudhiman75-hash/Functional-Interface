import type {
  BlrCp006CodeDefinition,
  BlrCp006CodedStatement,
  BlrCp006Graph,
  BlrCp006Relation,
} from "../BLR-CP-006/cp006-model";
import type {
  BlrCp007Authority,
  BlrCp007PrototypeId,
  BlrCp007QlId,
  BlrCp007Query,
  BlrCp007Scenario,
} from "./cp007-model";
import { BLR_CP007_PROTOTYPES } from "./cp007-prototypes";

export const BLR_CP007_V2_RUNTIME_VERSION =
  "blr-cp007-exam-pedagogy-remediation-v2" as const;
export const BLR_CP007_V2_DATASET_VERSION =
  "BLR_CP007_EXAM_PEDAGOGY_REMEDIATION_V2" as const;

export type BlrCp007V2FailureCode =
  | "WRONG_RELATION"
  | "REVERSED_DIRECTION"
  | "WRONG_GENDER"
  | "WRONG_GENERATION"
  | "DISCONNECTED_PATH"
  | "FIRST_TOKEN_WRONG"
  | "SECOND_TOKEN_WRONG"
  | "BOTH_TOKENS_WRONG"
  | "TOKENS_SWAPPED"
  | "WRONG_TOKEN_MEANING"
  | "WRONG_PERSON_IDENTITY"
  | "VALID_STATEMENT_NOT_REQUESTED"
  | "INVALID_INTERPRETATION_SELECTED";

export type BlrCp007V2ExplanationMode =
  | "DIRECT_LOOKUP_MINIMAL"
  | "TWO_LINK_PATH"
  | "THREE_LINK_OR_AFFINAL_PATH"
  | "MISSING_TOKEN"
  | "ORDERED_TOKEN_PAIR"
  | "MISSING_PERSON"
  | "VALID_STATEMENT_CHECK"
  | "INVALID_STATEMENT_CHECK";

export interface BlrCp007V2Option {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
  failureCode?: BlrCp007V2FailureCode;
  graphValidity: "VALID";
  targetSatisfied?: boolean;
  statementValidity?: "VALID" | "INVALID";
  decodedAssertions: readonly string[];
  actualRelation?: BlrCp006Relation;
  statements: readonly BlrCp006CodedStatement[];
  claim?: {
    subjectId: string;
    relationId: BlrCp006Relation;
    referenceId: string;
  };
  completionValue:
    | { kind: "EXPRESSION" }
    | { kind: "TOKEN"; token: string }
    | { kind: "TOKEN_PAIR"; tokens: readonly [string, string] }
    | { kind: "PERSON"; personId: string }
    | { kind: "VALIDITY" };
}

export interface BlrCp007V2FamilyTree {
  kind: "blood-relation-family-tree-v2";
  version: 2;
  title: string;
  description: string;
  nodes: readonly {
    id: string;
    label: string;
    gender: "male" | "female" | "unknown";
    generation: number;
    isQueryEndpoint: boolean;
    isOnDecisivePath: boolean;
  }[];
  edges: readonly {
    id: string;
    type: "marriage" | "parent-child" | "sibling";
    sourceId: string;
    targetId: string;
    directed: boolean;
    relationLabel: string;
    evidence: "CODED" | "INFERRED";
    isOnDecisivePath: boolean;
  }[];
  query: {
    subjectId?: string;
    referenceId?: string;
    answerLabel: string;
    pathPersonIds: readonly string[];
  };
  legend: readonly string[];
  accessibleSummary: string;
  asciiFallback: string;
}

export interface BlrCp007V2Question {
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
  answerType:
    | "CODED_EXPRESSION"
    | "CODE_TOKEN"
    | "ORDERED_TOKEN_PAIR"
    | "PERSON_LABEL"
    | "CODED_STATEMENT";
  options: readonly BlrCp007V2Option[];
  correctIndex: number;
  answer: string;
  completedStatements: readonly BlrCp006CodedStatement[];
  decodedStatements: readonly string[];
  graph: BlrCp006Graph;
  explanation: {
    mode: BlrCp007V2ExplanationMode;
    steps: readonly string[];
    conclusion: string;
    shortcut?: string;
    optionAnalysis: readonly {
      optionLabel: "A" | "B" | "C" | "D";
      optionText: string;
      isCorrect: boolean;
      statementValidity?: "VALID" | "INVALID";
      failureCode?: BlrCp007V2FailureCode;
      explanation: string;
    }[];
    familyTree: BlrCp007V2FamilyTree;
  };
  adminProof: {
    questionId: string;
    seed: number;
    qlId: BlrCp007QlId;
    prototypeId: BlrCp007PrototypeId;
    taskKind: BlrCp007Query["kind"];
    difficulty: "EASY" | "MEDIUM" | "HARD";
    tokenMapId: string;
    familyTopologyId: string;
    targetRelation?: BlrCp006Relation;
    targetPath: readonly string[];
    semanticFingerprint: string;
    independentSolverStatus: "AWAITING_EXTERNAL_VERIFIER" | "AGREED";
    uniqueCorrectOptionCount: 1;
    allOptionGraphsValid: true;
    rendererValidationStatus: "AWAITING_EXPORT_VALIDATION" | "PASSED";
    datasetVersion: typeof BLR_CP007_V2_DATASET_VERSION;
    runtimeVersion: typeof BLR_CP007_V2_RUNTIME_VERSION;
    siblingPolicy: "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED";
    halfRelationsInScope: false;
    reviewStatus: "HUMAN_REVIEW_REQUIRED";
    reviewerNote: "";
  };
}

export function positiveModulo(value: number, modulus: number): number {
  return ((Math.trunc(value) % modulus) + modulus) % modulus;
}

export function hash32(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function shuffled<T>(values: readonly T[], salt: string): T[] {
  const output = [...values];
  let state = hash32(salt) || 0x9e3779b9;
  for (let index = output.length - 1; index > 0; index -= 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const swapIndex = (state >>> 0) % (index + 1);
    [output[index], output[swapIndex]] = [output[swapIndex]!, output[index]!];
  }
  return output;
}

function isPeriodic(values: readonly number[]): boolean {
  for (const period of [1, 2, 4]) {
    if (
      values.every(
        (value, index) => index < period || value === values[index - period],
      )
    ) return true;
  }
  return false;
}

export const BLR_CP007_V2_ANSWER_POSITION_PATTERNS: ReadonlyMap<
  BlrCp007PrototypeId,
  readonly number[]
> = (() => {
  const used = new Set<string>();
  const result = new Map<BlrCp007PrototypeId, readonly number[]>();
  BLR_CP007_PROTOTYPES.forEach((prototype, prototypeIndex) => {
    let salt = 0;
    while (true) {
      const pattern = shuffled(
        [0, 0, 1, 1, 2, 2, 3, 3],
        `${prototype.prototypeId}|${prototypeIndex}|${salt}|answer-position-v2`,
      );
      const key = pattern.join("");
      if (!isPeriodic(pattern) && !used.has(key)) {
        used.add(key);
        result.set(prototype.prototypeId, pattern);
        break;
      }
      salt += 1;
    }
  });
  return result;
})();
