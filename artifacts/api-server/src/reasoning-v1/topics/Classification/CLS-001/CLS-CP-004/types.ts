export type ClsCp004PrototypeId =
  | "CLS-CP004-PROT-001"
  | "CLS-CP004-PROT-002"
  | "CLS-CP004-PROT-003"
  | "CLS-CP004-PROT-004"
  | "CLS-CP004-PROT-005"
  | "CLS-CP004-PROT-006"
  | "CLS-CP004-PROT-007"
  | "CLS-CP004-PROT-008"
  | "CLS-CP004-PROT-009"
  | "CLS-CP004-PROT-010"
  | "CLS-CP004-PROT-011"
  | "CLS-CP004-PROT-012"
  | "CLS-CP004-PROT-013";

export type ClsCp004RuleId =
  | "DIGIT_COUNT"
  | "PARITY"
  | "PRIMALITY_CLASS"
  | "PERFECT_SQUARE_STATUS"
  | "PERFECT_CUBE_STATUS"
  | "DIVISIBLE_BY_3"
  | "DIVISIBLE_BY_4"
  | "DIVISIBLE_BY_5"
  | "DIVISIBLE_BY_6"
  | "DIVISIBLE_BY_7"
  | "DIVISIBLE_BY_8"
  | "DIVISIBLE_BY_9"
  | "DIVISIBLE_BY_10"
  | "DIVISIBLE_BY_11"
  | "DIVISIBLE_BY_12"
  | "DIVISOR_COUNT"
  | "DIGIT_PARITY_COMPOSITION"
  | "DIGIT_SUM"
  | "DIGIT_PRODUCT"
  | "PALINDROME_STATUS"
  | "NEAR_POWER_CLASS"
  | "TRIANGULAR_STATUS";

export type ClsCp004GenerationProfile =
  | "DIGIT_COUNT_OUTLIER"
  | "PARITY_OUTLIER"
  | "PRIMALITY_OUTLIER"
  | "SQUARE_STATUS_OUTLIER"
  | "CUBE_STATUS_OUTLIER"
  | "DIVISIBILITY_OUTLIER"
  | "DIVISOR_COUNT_OUTLIER"
  | "DIGIT_COMPOSITION_OUTLIER"
  | "DIGIT_SUM_OUTLIER"
  | "DIGIT_PRODUCT_OUTLIER"
  | "PALINDROME_STATUS_OUTLIER"
  | "NEAR_POWER_OUTLIER"
  | "TRIANGULAR_STATUS_OUTLIER";

export type ClsCp004Difficulty = "EASY" | "MEDIUM" | "HARD";
export type ClsCp004AuditResult = "UNIQUE" | "AMBIGUOUS" | "NO_VALID_RULE";
export type ClsCp004Parity = "EVEN" | "ODD";
export type ClsCp004PrimalityClass = "PRIME" | "COMPOSITE";
export type ClsCp004DigitParityComposition = "ALL_EVEN" | "ALL_ODD" | "MIXED";
export type ClsCp004NearPowerClass =
  | "ONE_BELOW_SQUARE"
  | "ONE_ABOVE_SQUARE"
  | "ONE_BELOW_CUBE"
  | "ONE_ABOVE_CUBE"
  | "MULTIPLE_NEAR_POWER_RELATIONS"
  | "NONE";

export type ClsCp004NumberFeatures = {
  readonly value: number;
  readonly digitCount: number;
  readonly parity: ClsCp004Parity;
  readonly primalityClass: ClsCp004PrimalityClass;
  readonly perfectSquare: boolean;
  readonly perfectCube: boolean;
  readonly divisorCount: number;
  readonly digitParityComposition: ClsCp004DigitParityComposition;
  readonly digitSum: number;
  readonly digitProduct: number;
  readonly hasZeroDigit: boolean;
  readonly palindrome: boolean;
  readonly nearPowerClass: ClsCp004NearPowerClass;
  readonly triangular: boolean;
};

export type ClsCp004PrototypeDefinition = {
  readonly prototypeId: ClsCp004PrototypeId;
  readonly title: string;
  readonly generationProfile: ClsCp004GenerationProfile;
  readonly allowedRuleIds: readonly ClsCp004RuleId[];
};

export type ClsCp004RuleSupport = {
  readonly ruleId: ClsCp004RuleId;
  readonly commonValue: string;
  readonly matchingOptionIndexes: readonly number[];
  readonly outlierIndex: number;
};

export type ClsCp004AmbiguityAudit = {
  readonly result: ClsCp004AuditResult;
  readonly outlierIndex: number | null;
  readonly intendedRuleSupported: boolean;
  readonly candidateSupports: readonly ClsCp004RuleSupport[];
  readonly reason: string;
};

export type ClsCp004DifficultyFeatures = {
  readonly optionCount: 4 | 5;
  readonly maximumDigitCount: number;
  readonly computationalDemand: 1 | 2 | 3;
  readonly candidateRuleCount: number;
  readonly requiresFactorisation: boolean;
  readonly requiresPowerCheck: boolean;
  readonly requiresDigitOperation: boolean;
  readonly nearMissDistance: number;
  readonly score: number;
};

export type ClsCp004Explanation = {
  readonly coreConcept: readonly string[];
  readonly stepByStep: readonly string[];
  readonly examSpeedShortcut: readonly string[];
  readonly commonTrapWarning: readonly string[];
};

export type GeneratedClsCp004Question = {
  readonly checkpointId: "CLS-CP-004";
  readonly prototypeId: ClsCp004PrototypeId;
  readonly seed: number;
  readonly task: "FIND_NUMBER_PROPERTY_OUTLIER";
  readonly generationProfile: ClsCp004GenerationProfile;
  readonly stem: string;
  readonly numbers: readonly number[];
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly intendedRuleId: ClsCp004RuleId;
  readonly intendedRuleValue: string;
  readonly evidenceByOption: readonly string[];
  readonly ambiguityAudit: ClsCp004AmbiguityAudit;
  readonly difficulty: ClsCp004Difficulty;
  readonly difficultyFeatures: ClsCp004DifficultyFeatures;
  readonly explanation: ClsCp004Explanation;
  readonly metadata: {
    readonly datasetVersion: "CLS-CP004-NUMBER-DOMAIN-v1";
    readonly runtimeVersion: "cls-cp004-discovery-v1";
    readonly locale: "en-IN";
    readonly optionCount: 4 | 5;
    readonly domainMinimum: 2;
    readonly domainMaximum: 999;
    readonly sourceSaturationStatus: "OPEN_FILE_LIBRARY_RETRY_REQUIRED";
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