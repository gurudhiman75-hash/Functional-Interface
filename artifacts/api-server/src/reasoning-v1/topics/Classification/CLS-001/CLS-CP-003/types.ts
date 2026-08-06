export type ClsCp003PrototypeId =
  | "CLS-CP003-PROT-001"
  | "CLS-CP003-PROT-002"
  | "CLS-CP003-PROT-003"
  | "CLS-CP003-PROT-004"
  | "CLS-CP003-PROT-005"
  | "CLS-CP003-PROT-006"
  | "CLS-CP003-PROT-007";

export type ClsCp003RuleId =
  | "WORD_LENGTH"
  | "VOWEL_COUNT"
  | "REPEATED_LETTER_TOPOLOGY"
  | "PALINDROME_STATUS"
  | "BOUNDARY_LETTER_CLASS"
  | "PRIMARY_AFFIX";

export type ClsCp003GenerationProfile =
  | "EXACT_LENGTH_OUTLIER"
  | "VOWEL_COUNT_OUTLIER"
  | "REPEATED_TOPOLOGY_OUTLIER"
  | "PALINDROME_STATUS_OUTLIER"
  | "BOUNDARY_CLASS_OUTLIER"
  | "AFFIX_FAMILY_OUTLIER"
  | "JUMBLED_SEMANTIC_OUTLIER";

export type ClsCp003Task =
  | "FIND_WORD_STRUCTURE_OUTLIER"
  | "RESOLVE_JUMBLES_AND_FIND_OUTLIER";

export type ClsCp003Difficulty = "EASY" | "MEDIUM" | "HARD";
export type ClsCp003AuditResult = "UNIQUE" | "AMBIGUOUS" | "NO_VALID_RULE";

export type ClsCp003RepeatedTopology =
  | "ALL_UNIQUE"
  | "ONE_REPEATED_LETTER"
  | "MULTIPLE_REPEATED_LETTERS"
  | "TRIPLE_OR_MORE";

export type ClsCp003BoundaryClass = "VOWEL_VOWEL" | "VOWEL_CONSONANT" | "CONSONANT_VOWEL" | "CONSONANT_CONSONANT";

export type ClsCp003WordEntry = {
  readonly word: string;
  readonly primaryAffix: string;
  readonly sourceStatus: "CURATED";
};

export type ClsCp003JumbleEntry = {
  readonly canonicalWord: string;
  readonly semanticClass: string;
  readonly sourceStatus: "CURATED";
};

export type ClsCp003WordFeatures = {
  readonly normalized: string;
  readonly length: number;
  readonly vowelCount: number;
  readonly consonantCount: number;
  readonly repeatedTopology: ClsCp003RepeatedTopology;
  readonly palindrome: boolean;
  readonly boundaryClass: ClsCp003BoundaryClass;
  readonly primaryAffix: string;
};

export type ClsCp003PrototypeDefinition = {
  readonly prototypeId: ClsCp003PrototypeId;
  readonly title: string;
  readonly task: ClsCp003Task;
  readonly generationProfile: ClsCp003GenerationProfile;
  readonly intendedRuleId: ClsCp003RuleId | "RESOLVED_SEMANTIC_CLASS";
};

export type ClsCp003RuleSupport = {
  readonly ruleId: ClsCp003RuleId;
  readonly commonValue: string;
  readonly matchingOptionIndexes: readonly number[];
  readonly outlierIndex: number;
};

export type ClsCp003AmbiguityAudit = {
  readonly result: ClsCp003AuditResult;
  readonly outlierIndex: number | null;
  readonly intendedRuleSupported: boolean;
  readonly candidateSupports: readonly ClsCp003RuleSupport[];
  readonly reason: string;
};

export type ClsCp003DifficultyFeatures = {
  readonly optionCount: 4 | 5;
  readonly structuralDemand: 1 | 2 | 3;
  readonly candidateRuleCount: number;
  readonly nearMissDistance: number;
  readonly requiresResolution: boolean;
  readonly governedMorphology: boolean;
  readonly score: number;
};

export type ClsCp003Explanation = {
  readonly coreConcept: readonly string[];
  readonly stepByStep: readonly string[];
  readonly examSpeedShortcut: readonly string[];
  readonly commonTrapWarning: readonly string[];
};

export type GeneratedClsCp003Question = {
  readonly checkpointId: "CLS-CP-003";
  readonly prototypeId: ClsCp003PrototypeId;
  readonly seed: number;
  readonly task: ClsCp003Task;
  readonly generationProfile: ClsCp003GenerationProfile;
  readonly stem: string;
  readonly options: readonly string[];
  readonly canonicalWords: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly intendedRuleId: ClsCp003RuleId | "RESOLVED_SEMANTIC_CLASS";
  readonly intendedRuleValue: string;
  readonly evidenceByOption: readonly string[];
  readonly ambiguityAudit: ClsCp003AmbiguityAudit;
  readonly difficulty: ClsCp003Difficulty;
  readonly difficultyFeatures: ClsCp003DifficultyFeatures;
  readonly explanation: ClsCp003Explanation;
  readonly metadata: {
    readonly datasetVersion: "CLS-CP003-WORD-STRUCTURE-EN-v1";
    readonly runtimeVersion: "cls-cp003-discovery-v1";
    readonly locale: "en-IN";
    readonly optionCount: 4 | 5;
    readonly sourceWordCount: number;
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