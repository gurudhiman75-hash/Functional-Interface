export type StaLocale = "en-IN";
export type StaCheckpointId = "STA-CP-001" | "STA-CP-002";
export type StaProposedQlId = "STA-QL-001" | "STA-QL-002" | "STA-QL-003" | "STA-QL-004";
export type StaDifficulty = "Easy" | "Medium" | "Hard";
export type StaDiscourseAct =
  | "ASSERTION"
  | "PREDICTION"
  | "RECOMMENDATION"
  | "PROPOSAL"
  | "DECISION"
  | "REQUEST"
  | "INSTRUCTION"
  | "NOTICE"
  | "ADVERTISEMENT"
  | "APPEAL";

export type StaDependencyRelation =
  | "EXISTENCE"
  | "AVAILABILITY"
  | "CAPABILITY"
  | "FEASIBILITY"
  | "PREREQUISITE"
  | "RELEVANCE"
  | "EFFICACY"
  | "BEHAVIOUR"
  | "AWARENESS"
  | "INTENT"
  | "VALUE"
  | "SCOPE"
  | "COMPARABILITY"
  | "MEASUREMENT"
  | "REPRESENTATIVENESS";

export type StaDenialEffect =
  | "BREAKS_FEASIBILITY"
  | "BREAKS_RATIONALE"
  | "BREAKS_RELEVANCE"
  | "BREAKS_INTENDED_MEANING"
  | "BREAKS_COMMUNICATIVE_PURPOSE";

export type StaClassification = "IMPLICIT" | "NOT_IMPLICIT";
export type StaAnswerSet = readonly number[];

export type StaMisconceptionClass =
  | "EXPLICIT_RESTATEMENT"
  | "CONCLUSION_OR_CONSEQUENCE"
  | "PLAUSIBLE_WORLD_FACT"
  | "RELATED_BUT_IRRELEVANT"
  | "SUPPORTIVE_NOT_NECESSARY"
  | "TOO_STRONG_QUANTIFIER"
  | "TOO_WEAK_TO_BE_REQUIRED"
  | "REVERSE_DEPENDENCY"
  | "WRONG_STAKEHOLDER"
  | "WRONG_SCOPE"
  | "WRONG_TIMEFRAME"
  | "WRONG_COMPARISON_BASELINE"
  | "VALUE_JUDGEMENT_NOT_REQUIRED"
  | "EXTERNAL_KNOWLEDGE"
  | "OPPOSITE_OF_REQUIRED_ASSUMPTION"
  | "CAUSE_EFFECT_OVERREACH"
  | "FEASIBILITY_OVERREACH";

export interface StaProposition {
  readonly propositionId: string;
  readonly semanticKey: string;
  readonly oppositeSemanticKey: string;
  readonly polarity: "POSITIVE" | "NEGATIVE";
  readonly entities: readonly string[];
  readonly scope?: string;
  readonly quantifier?: "ALL" | "SOME" | "NONE" | "MOST" | "EXISTS" | "EXACT";
}

export interface StaDependency {
  readonly dependencyId: string;
  readonly propositionId: string;
  readonly relation: StaDependencyRelation;
  readonly requiredFor: readonly string[];
  readonly denialEffect: StaDenialEffect;
}

export interface StaCandidateAuthority {
  readonly candidateId: string;
  readonly propositionId: string;
  readonly textVariants: readonly [string, ...string[]];
  readonly expectedClassification: StaClassification;
  readonly misconceptionClass?: StaMisconceptionClass;
  readonly rationale: string;
}

export interface StaScenarioAuthority {
  readonly scenarioId: string;
  readonly proposedQlId: StaProposedQlId;
  readonly checkpointId: StaCheckpointId;
  readonly sourceProfile: "SSC" | "BANKING" | "PUNJAB_STATE" | "CROSS_EXAM_DISCOVERY";
  readonly discourseAct: StaDiscourseAct;
  readonly objectiveIds: readonly [string, ...string[]];
  readonly statementVariants: readonly [string, ...string[]];
  readonly propositions: readonly StaProposition[];
  readonly explicitPropositionIds: readonly string[];
  readonly hiddenDependencies: readonly StaDependency[];
  readonly candidates: readonly [StaCandidateAuthority, StaCandidateAuthority, ...StaCandidateAuthority[]];
  readonly allowedCandidateCounts: readonly (2 | 3)[];
  readonly difficulty: StaDifficulty;
  readonly sourceStatus: "SOURCE_SUPPORTED_EXECUTABLE_DISCOVERY";
}

export type StaOracleEvidenceCode =
  | "EXPLICIT_RESTATEMENT"
  | "REQUIRED_HIDDEN_DEPENDENCY"
  | "NO_REQUIRED_DEPENDENCY"
  | "DEPENDENCY_NOT_REQUIRED_FOR_OBJECTIVE"
  | "MISSING_SEMANTIC_NEGATION";

export interface StaOracleResult {
  readonly candidateId: string;
  readonly propositionId: string;
  readonly classification: StaClassification;
  readonly evidenceCode: StaOracleEvidenceCode;
  readonly dependencyId?: string;
  readonly dependencyRelation?: StaDependencyRelation;
  readonly denialEffect?: StaDenialEffect;
  readonly denialSemanticKey?: string;
}

export interface StaRenderedCandidate {
  readonly label: "I" | "II" | "III";
  readonly candidateId: string;
  readonly text: string;
  readonly oracle: StaOracleResult;
}

export interface StaOption {
  readonly display: string;
  readonly semanticAnswerSet: StaAnswerSet;
  readonly isCorrect: boolean;
}

export interface StaQuestion {
  readonly questionId: string;
  readonly packageId: "STA-001";
  readonly chapterId: "REAS-STA";
  readonly checkpointId: StaCheckpointId;
  readonly proposedQlId: StaProposedQlId;
  readonly scenarioId: string;
  readonly seed: string;
  readonly locale: StaLocale;
  readonly difficulty: StaDifficulty;
  readonly sourceProfile: StaScenarioAuthority["sourceProfile"];
  readonly statement: string;
  readonly candidates: readonly [StaRenderedCandidate, StaRenderedCandidate] | readonly [StaRenderedCandidate, StaRenderedCandidate, StaRenderedCandidate];
  readonly options: readonly [StaOption, StaOption, StaOption, StaOption];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answerSet: StaAnswerSet;
  readonly explanation: string;
  readonly oracleParity: true;
  readonly lifecycle: StaLifecycle;
}

export interface StaLifecycle {
  readonly maturity: "EXECUTABLE_DISCOVERY_PROOF";
  readonly permanentQlCount: 0;
  readonly proposedQlCount: 4;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
  readonly hindiPunjabiStatus: "NOT_STARTED";
}
