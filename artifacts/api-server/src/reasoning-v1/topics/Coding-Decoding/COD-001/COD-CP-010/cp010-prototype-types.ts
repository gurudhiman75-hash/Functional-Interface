export type Cp010PrototypeId = "COD-CP010-PROT-APPLY-CONDITIONAL-TABLE";

export type Cp010Domain = "LETTER" | "DIGIT";

export type Cp010EndpointClass =
  | "VOWEL"
  | "CONSONANT"
  | "ODD"
  | "EVEN";

export type Cp010Action =
  | { kind: "REPLACE_ENDPOINTS_WITH_CONSTANT"; constantCode: string }
  | { kind: "SWAP_ENDPOINT_CODES" }
  | { kind: "COPY_LEFT_CODE_TO_BOTH" }
  | { kind: "COPY_RIGHT_CODE_TO_BOTH" }
  | {
      kind: "REPLACE_MATCHING_CLASS_WITH_DESIGNATED_CODE";
      targetClass: "VOWEL" | "CONSONANT";
      designatedSourceToken: string;
    };

export interface Cp010MappingRow {
  sourceToken: string;
  codeToken: string;
}

export interface Cp010Condition {
  conditionId: string;
  firstClass: Cp010EndpointClass;
  lastClass: Cp010EndpointClass;
  description: string;
  action: Cp010Action;
}

export interface Cp010StructuredPrompt {
  taskKind: "ENCODE_WITH_CONDITION_TABLE";
  domain: Cp010Domain;
  mappingRows: readonly Cp010MappingRow[];
  conditions: readonly Cp010Condition[];
  precedence: "MUTUALLY_EXCLUSIVE";
  sourceTokens: readonly string[];
  sourceDisplay: string;
}

export interface Cp010Option {
  value: string;
  codeTokens: readonly string[];
  isCorrect: boolean;
  errorLabel?:
    | "MISSED_CONDITION"
    | "WRONG_CONDITION"
    | "PARTIAL_OVERRIDE"
    | "WRONG_ENDPOINT_DIRECTION"
    | "REVERSED_OUTPUT";
}

export interface Cp010Explanation {
  referenceAid: readonly string[];
  quickMethod: string;
  ruleStatement: string;
  sourceDemonstration: readonly string[];
  targetApplication: readonly string[];
  conclusion: string;
  commonTrapAlert: string;
}

export interface Cp010SolveTrace {
  baseCodeTokens: readonly string[];
  firstClass: Cp010EndpointClass;
  lastClass: Cp010EndpointClass;
  matchedConditionId: string;
  actionKind: Cp010Action["kind"];
  finalCodeTokens: readonly string[];
}

export interface GeneratedCp010PrototypeQuestion {
  checkpointId: "COD-CP-010";
  prototypeId: Cp010PrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  seed: number;
  locale: "en-IN";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  renderer: "CONDITION_TABLE";
  answerType: "MIXED_CODE_SEQUENCE";
  stem: string;
  structuredPrompt: Cp010StructuredPrompt;
  options: readonly Cp010Option[];
  correctIndex: number;
  explanation: Cp010Explanation;
  metadata: {
    runtimeVersion: "cod-cp010-prototype-v1";
    domain: Cp010Domain;
    endpointSignature: string;
    matchedConditionId: string;
    actionKind: Cp010Action["kind"];
    baseCode: string;
    correctAnswer: string;
    solverAgreement: true;
    mutuallyExclusiveConditions: true;
    precedenceRequired: false;
  };
}
