export type ClsCp002PrototypeId =
  | "CLS-CP002-PROT-001"
  | "CLS-CP002-PROT-002"
  | "CLS-CP002-PROT-003"
  | "CLS-CP002-PROT-004"
  | "CLS-CP002-PROT-005";

export type ClsCp002RelationFamily =
  | "DIRECTIONAL_SEMANTIC"
  | "LEXICAL"
  | "CLASS_COHESION";

export type ClsCp002GenerationProfile =
  | "CONTRAST_RELATION"
  | "LEXICAL_POLARITY"
  | "REVERSED_DIRECTION"
  | "CATEGORY_SAFE_FALSE_PAIR"
  | "CLASS_PAIR_CONTRAST";

export type ClsCp002Difficulty = "EASY" | "MEDIUM" | "HARD";

export type ClsCp002AmbiguityResult = "UNIQUE" | "AMBIGUOUS" | "NO_VALID_RULE";

export type ClsCp002Pair = {
  readonly left: string;
  readonly right: string;
};

export type ClsCp002RelationDefinition = {
  readonly relationId: string;
  readonly label: string;
  readonly family: ClsCp002RelationFamily;
  readonly ruleStatement: string;
  readonly directionSensitive: boolean;
  readonly sourceCategory: string;
  readonly answerCategory: string;
  readonly qualityRank: number;
  readonly contrastGroup: string;
};

export type ClsCp002RelationFact = {
  readonly factId: string;
  readonly relationId: string;
  readonly left: string;
  readonly right: string;
  readonly sourceCategory: string;
  readonly answerCategory: string;
  readonly predicate: string;
  readonly difficulty: ClsCp002Difficulty;
  readonly factRisk: "LOW" | "MEDIUM";
  readonly sourceLibrary: "ANA-CP-001" | "ANA-CP-002" | "CLS-CP-001" | "CLS-CP-002";
};

export type ClsCp002PrototypeDefinition = {
  readonly prototypeId: ClsCp002PrototypeId;
  readonly title: string;
  readonly generationProfile: ClsCp002GenerationProfile;
  readonly family: ClsCp002RelationFamily;
  readonly eligibleRelationIds: readonly string[];
};

export type ClsCp002RelationSupport = {
  readonly relationId: string;
  readonly relationLabel: string;
  readonly matchingOptionIndexes: readonly number[];
  readonly outlierIndexes: readonly number[];
  readonly qualityRank: number;
};

export type ClsCp002AmbiguityAudit = {
  readonly result: ClsCp002AmbiguityResult;
  readonly winningRelationId: string | null;
  readonly winningOutlierIndex: number | null;
  readonly candidateSupports: readonly ClsCp002RelationSupport[];
  readonly reason: string;
};

export type ClsCp002DifficultyFeatures = {
  readonly optionCount: 4 | 5;
  readonly directionSensitive: boolean;
  readonly reversedDirection: boolean;
  readonly categorySafeFalsePair: boolean;
  readonly lexicalPolarity: boolean;
  readonly classMultiMembershipCount: number;
  readonly candidateRelationCount: number;
  readonly semanticDemand: 1 | 2 | 3;
  readonly score: number;
};

export type ClsCp002Explanation = {
  readonly coreConcept: readonly string[];
  readonly stepByStep: readonly string[];
  readonly examSpeedShortcut: readonly string[];
  readonly commonTrapWarning: readonly string[];
};

export type GeneratedClsCp002Question = {
  readonly checkpointId: "CLS-CP-002";
  readonly prototypeId: ClsCp002PrototypeId;
  readonly seed: number;
  readonly task: "FIND_ODD_PAIR";
  readonly generationProfile: ClsCp002GenerationProfile;
  readonly family: ClsCp002RelationFamily;
  readonly stem: string;
  readonly pairs: readonly ClsCp002Pair[];
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly intendedRelationId: string;
  readonly intendedRelationLabel: string;
  readonly evidenceByOption: readonly string[];
  readonly ambiguityAudit: ClsCp002AmbiguityAudit;
  readonly difficulty: ClsCp002Difficulty;
  readonly difficultyFeatures: ClsCp002DifficultyFeatures;
  readonly explanation: ClsCp002Explanation;
  readonly metadata: {
    readonly datasetVersion: "CLS-CP002-RELATION-DISCOVERY-v1";
    readonly runtimeVersion: "cls-cp002-discovery-v1";
    readonly locale: "en-IN";
    readonly optionCount: 4 | 5;
    readonly sourceRelationFactIds: readonly string[];
    readonly oddPairKind: "CONTRAST_RELATION" | "REVERSED_DIRECTION" | "FALSE_PAIR" | "CLASS_CONTRAST";
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
