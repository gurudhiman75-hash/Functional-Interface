export type ClsCp005PrototypeId =
  | "CLS-CP005-PROT-001"
  | "CLS-CP005-PROT-002"
  | "CLS-CP005-PROT-003"
  | "CLS-CP005-PROT-004"
  | "CLS-CP005-PROT-005"
  | "CLS-CP005-PROT-006"
  | "CLS-CP005-PROT-007"
  | "CLS-CP005-PROT-008"
  | "CLS-CP005-PROT-009"
  | "CLS-CP005-PROT-010"
  | "CLS-CP005-PROT-011"
  | "CLS-CP005-PROT-012"
  | "CLS-CP005-PROT-013"
  | "CLS-CP005-PROT-014"
  | "CLS-CP005-PROT-015"
  | "CLS-CP005-PROT-016"
  | "CLS-CP005-PROT-017"
  | "CLS-CP005-PROT-018"
  | "CLS-CP005-PROT-019"
  | "CLS-CP005-PROT-020";

export type ClsCp005PairRuleId =
  | "PAIR_SIGNED_DIFFERENCE"
  | "PAIR_REDUCED_RATIO"
  | "PAIR_SUM"
  | "PAIR_PRODUCT"
  | "PAIR_GCD"
  | "PAIR_LCM"
  | "PAIR_CONSECUTIVE_DIRECTION"
  | "PAIR_SQUARE_DIRECTION"
  | "PAIR_CUBE_DIRECTION"
  | "PAIR_DIGIT_REVERSE_DIRECTION";

export type ClsCp005TripleRuleId =
  | "TRIPLE_SUM_OF_TWO_EQUALS_THIRD"
  | "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD"
  | "TRIPLE_ARITHMETIC_PROGRESSION"
  | "TRIPLE_GEOMETRIC_PROGRESSION"
  | "TRIPLE_PYTHAGOREAN_DIRECTION"
  | "TRIPLE_CONSECUTIVE_DIRECTION"
  | "TRIPLE_SUM"
  | "TRIPLE_PRODUCT";

export type ClsCp005RuleId = ClsCp005PairRuleId | ClsCp005TripleRuleId;
export type ClsCp005Task =
  | "FIND_ODD_NUMBER_PAIR"
  | "FIND_ODD_NUMBER_TRIPLE"
  | "SELECT_EQUIVALENT_NUMBER_SET";
export type ClsCp005Difficulty = "EASY" | "MEDIUM" | "HARD";
export type ClsCp005AuditResult = "UNIQUE" | "AMBIGUOUS" | "NO_VALID_RULE";
export type ClsCp005Arity = 2 | 3;
export type ClsCp005Pair = readonly [number, number];
export type ClsCp005Triple = readonly [number, number, number];
export type ClsCp005Tuple = ClsCp005Pair | ClsCp005Triple;

export type ClsCp005PrototypeDefinition = {
  readonly prototypeId: ClsCp005PrototypeId;
  readonly title: string;
  readonly task: ClsCp005Task;
  readonly arity: ClsCp005Arity;
  readonly allowedRuleIds: readonly ClsCp005RuleId[];
};

export type ClsCp005RuleSignature = {
  readonly ruleId: ClsCp005RuleId;
  readonly value: string;
};

export type ClsCp005RuleSupport = {
  readonly ruleId: ClsCp005RuleId;
  readonly commonValue: string;
  readonly matchingOptionIndexes: readonly number[];
  readonly answerIndex: number;
};

export type ClsCp005AmbiguityAudit = {
  readonly result: ClsCp005AuditResult;
  readonly answerIndex: number | null;
  readonly intendedRuleSupported: boolean;
  readonly candidateSupports: readonly ClsCp005RuleSupport[];
  readonly reason: string;
};

export type ClsCp005DifficultyFeatures = {
  readonly optionCount: 4 | 5;
  readonly arity: ClsCp005Arity;
  readonly maximumValue: number;
  readonly arithmeticDemand: 1 | 2 | 3;
  readonly directionSensitive: boolean;
  readonly competingSupportCount: number;
  readonly referenceTupleRequired: boolean;
  readonly score: number;
};

export type ClsCp005Explanation = {
  readonly coreConcept: readonly string[];
  readonly stepByStep: readonly string[];
  readonly examSpeedShortcut: readonly string[];
  readonly commonTrapWarning: readonly string[];
};

export type GeneratedClsCp005Question = {
  readonly checkpointId: "CLS-CP-005";
  readonly prototypeId: ClsCp005PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly task: ClsCp005Task;
  readonly arity: ClsCp005Arity;
  readonly stem: string;
  readonly referenceTuple: ClsCp005Tuple | null;
  readonly tuples: readonly ClsCp005Tuple[];
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly intendedRuleId: ClsCp005RuleId;
  readonly intendedRuleValue: string;
  readonly evidenceByOption: readonly string[];
  readonly ambiguityAudit: ClsCp005AmbiguityAudit;
  readonly difficulty: ClsCp005Difficulty;
  readonly difficultyFeatures: ClsCp005DifficultyFeatures;
  readonly explanation: ClsCp005Explanation;
  readonly reviewOnly: true;
  readonly questionStudioVisible: false;
  readonly metadata: {
    readonly datasetVersion: "CLS-CP005-TUPLE-DOMAIN-v1";
    readonly runtimeVersion: "cls-cp005-discovery-v1";
    readonly locale: "en-IN";
    readonly optionCount: 4 | 5;
    readonly sourceSaturationStatus: "INITIAL_SOURCE_PASS_COMPLETE__GAP_AUDIT_OPEN";
  };
  readonly lifecycle: {
    readonly permanentQlId: null;
    readonly reviewStatus: "UNREVIEWED_DISCOVERY";
    readonly questionBankStatus: "NOT_STORED";
    readonly testEligibility: "INELIGIBLE";
    readonly publiclyPublishable: false;
    readonly questionStudioDiscoverable: false;
  };
};