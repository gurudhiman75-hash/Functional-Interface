export type ClsCp007PrototypeId =
  | "CLS-CP007-PROT-001"
  | "CLS-CP007-PROT-002"
  | "CLS-CP007-PROT-003"
  | "CLS-CP007-PROT-004"
  | "CLS-CP007-PROT-005"
  | "CLS-CP007-PROT-006"
  | "CLS-CP007-PROT-007"
  | "CLS-CP007-PROT-008"
  | "CLS-CP007-PROT-009"
  | "CLS-CP007-PROT-010"
  | "CLS-CP007-PROT-011"
  | "CLS-CP007-PROT-012"
  | "CLS-CP007-PROT-013";

export type ClsCp007RuleId =
  | "CLUSTER_SIGNED_GAP_VECTOR"
  | "CLUSTER_ABSOLUTE_GAP_VECTOR"
  | "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO"
  | "CLUSTER_GAP_EQUALITY_PATTERN"
  | "CLUSTER_VOWEL_COUNT"
  | "CLUSTER_REPEAT_PATTERN"
  | "CLUSTER_POSITION_SUM"
  | "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS"
  | "CLUSTER_HALF_SUM_DIFFERENCE"
  | "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS"
  | "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS"
  | "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE"
  | "CLUSTER_CENTRAL_ABSOLUTE_GAP";

export type ClsCp007Task = "FIND_ODD_LETTER_CLUSTER";
export type ClsCp007Length = 3 | 4 | 5;
export type ClsCp007Difficulty = "EASY" | "MEDIUM" | "HARD";
export type ClsCp007AuditResult = "UNIQUE" | "AMBIGUOUS" | "NO_VALID_RULE";

export type ClsCp007ClusterItem = {
  readonly kind: "LETTER_CLUSTER";
  readonly letters: readonly string[];
};

export type ClsCp007PrototypeDefinition = {
  readonly prototypeId: ClsCp007PrototypeId;
  readonly title: string;
  readonly task: ClsCp007Task;
  readonly allowedRuleIds: readonly ClsCp007RuleId[];
  readonly allowedLengths: readonly ClsCp007Length[];
};

export type ClsCp007RuleSupport = {
  readonly ruleId: ClsCp007RuleId;
  readonly commonValue: string;
  readonly outlierValue: string;
  readonly matchingOptionIndexes: readonly number[];
  readonly answerIndex: number;
};

export type ClsCp007AmbiguityAudit = {
  readonly result: ClsCp007AuditResult;
  readonly answerIndex: number | null;
  readonly intendedRuleSupported: boolean;
  readonly candidateSupports: readonly ClsCp007RuleSupport[];
  readonly reason: string;
};

export type ClsCp007DifficultyFeatures = {
  readonly optionCount: 4 | 5;
  readonly clusterLength: ClsCp007Length;
  readonly arithmeticDemand: 1 | 2 | 3;
  readonly structuralLayers: 1 | 2 | 3;
  readonly directionSensitive: boolean;
  readonly competingSupportCount: number;
  readonly maximumPosition: number;
  readonly score: number;
};

export type ClsCp007Explanation = {
  readonly coreConcept: readonly string[];
  readonly stepByStep: readonly string[];
  readonly examSpeedShortcut: readonly string[];
  readonly commonTrapWarning: readonly string[];
};

export type GeneratedClsCp007Question = {
  readonly checkpointId: "CLS-CP-007";
  readonly prototypeId: ClsCp007PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly task: ClsCp007Task;
  readonly clusterLength: ClsCp007Length;
  readonly stem: string;
  readonly items: readonly ClsCp007ClusterItem[];
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly intendedRuleId: ClsCp007RuleId;
  readonly intendedRuleValue: string;
  readonly evidenceByOption: readonly string[];
  readonly ambiguityAudit: ClsCp007AmbiguityAudit;
  readonly difficulty: ClsCp007Difficulty;
  readonly difficultyFeatures: ClsCp007DifficultyFeatures;
  readonly explanation: ClsCp007Explanation;
  readonly reviewOnly: true;
  readonly questionStudioVisible: false;
  readonly metadata: {
    readonly datasetVersion: "CLS-CP007-LETTER-CLUSTER-DOMAIN-v1";
    readonly runtimeVersion: "cls-cp007-discovery-v1";
    readonly locale: "en-IN";
    readonly optionCount: 4 | 5;
    readonly sourcePrototypeSeed: number;
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
