export type Di006V2ExamProfile = "SSC_CGL_TIER_I" | "BANKING_PRELIMS";
export type Di006V2Difficulty = "Easy" | "Medium" | "Hard";

export type Di006V2TaskKind =
  | "DIRECT_STATED_VALUE"
  | "SINGLE_RELATION_VALUE"
  | "DIFFERENCE_BETWEEN_VALUES"
  | "COMBINED_TWO_VALUES"
  | "RATIO_OF_TWO_VALUES"
  | "SHARE_OF_TOTAL"
  | "AVERAGE_OF_TWO_VALUES"
  | "CHAINED_RELATION_VALUE"
  | "REMAINDER_FROM_TOTAL"
  | "COMBINED_DERIVED_SHARE"
  | "REMAINDER_TO_DERIVED_RATIO"
  | "RELATIVE_PERCENT_EXCESS";

export type Di006V2Relation = Readonly<{
  targetIndex: number;
  sourceIndex: number;
  numerator: number;
  denominator: number;
  depth: number;
  learnerText: string;
  explanationStep: string;
}>;

export type Di006V2Stimulus = Readonly<{
  kind: "CASELET";
  contextId: string;
  topologyId: string;
  title: string;
  instruction: string;
  learnerText: string;
  categories: readonly string[];
  totalValue: number;
  totalLabel: string;
  unit: string;
  directIndex: number;
  directValue: number;
  relations: readonly Di006V2Relation[];
  remainderIndex: number;
}>;

export type Di006V2Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di006V2Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
}>;

export type Di006V2Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di006V2TaskKind;
  difficulty: Di006V2Difficulty;
  stemSurfaceId: string;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di006V2Option[];
  correctIndex: number;
  answer: string;
  explanation: Di006V2Explanation;
  evidence: Readonly<Record<string, number>>;
}>;

export type Di006V2ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di006V2QuestionSet = Readonly<{
  packageId: "DI-006";
  reviewVersion: "V2";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di006V2ExamProfile;
  optionCount: 4 | 5;
  setDifficulty: "CASELET_MIXED_V2";
  stimulus: Di006V2Stimulus;
  questions: readonly Di006V2Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di006V2ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-006";
    representation: "CASELET";
    parentFoundation: "DI-001";
    setContractVersion: "DI-006-SET-CONTRACT-V2";
    questionLogicVersion: "DI-006-QUESTION-LOGIC-V2";
    arithmeticAuthority: "EXACT_INTEGER_RATIONAL";
    reviewStatus: "UNREVIEWED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    questionBankWritable: false;
    testEligibility: "INELIGIBLE";
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
    productionReleaseAuthorized: false;
  }>;
}>;
