/**
 * Presently discovered QL candidates, not a chapter freeze. New evidence may
 * split, merge, add, or retire allocations before CAE-001 can be released.
 */
export const CAE_PROVISIONAL_QL_IDS = [
  "CAE-QL-001", "CAE-QL-002", "CAE-QL-003", "CAE-QL-004", "CAE-QL-005",
  "CAE-QL-006", "CAE-QL-007", "CAE-QL-008", "CAE-QL-009",
] as const;
export const CAE_QL_IDS = CAE_PROVISIONAL_QL_IDS;

export const CAE_CHECKPOINT_IDS = [
  "CAE-CP-001", "CAE-CP-002", "CAE-CP-003", "CAE-CP-004", "CAE-CP-005",
  "CAE-CP-006", "CAE-CP-007", "CAE-CP-008", "CAE-CP-009", "CAE-CP-010",
] as const;

export type CaeQlId = (typeof CAE_PROVISIONAL_QL_IDS)[number];
export type CaeCheckpointId = (typeof CAE_CHECKPOINT_IDS)[number];
export type CaeLocale = "en-IN" | "hi-IN" | "pa-IN";
export type CaeDifficulty = "EASY" | "MEDIUM" | "HARD";
export type CaeQuestionProfile = "FOUR_WAY" | "FIVE_WAY";
export type LocalizedText = Readonly<Record<CaeLocale, string>>;
export type CaeDomain = "TRANSPORT" | "WEATHER" | "INFRASTRUCTURE" | "UTILITIES" | "EDUCATION" | "RETAIL" | "MANUFACTURING" | "CIVIC";
export type CaeScope = "PERSON" | "SITE" | "LOCAL" | "CITY" | "REGIONAL";
export type CaeMagnitude = "LOW" | "MODERATE" | "HIGH";
export type CaeTemporalRelation = "IMMEDIATE" | "SAME_DAY" | "SHORT_DELAY" | "DELAYED";
export type CaeCausalStrength = "PRIMARY" | "CONTRIBUTING" | "WEAK";
export type CaeTimeBand = "TRIGGER" | "IMMEDIATE_RESPONSE" | "SAME_SHIFT" | "LATER_OUTCOME";

export type CaeNodeRole = "CAUSE" | "INTERMEDIATE" | "EFFECT" | "CONTEXT" | "COMPETING";
export type CaeNode = Readonly<{
  id: string;
  semanticSlot: string;
  role: CaeNodeRole;
  temporalOrder: number;
  timeBand: CaeTimeBand;
  scope: CaeScope;
  magnitude: CaeMagnitude;
  severity: CaeMagnitude;
  primaryEffect: boolean;
  text: LocalizedText;
}>;
export type CaeScenarioNodeUnit = Omit<CaeNode, "id">;

export type CaeCausalEdge = Readonly<{
  from: string;
  to: string;
  strength: CaeCausalStrength;
  temporalRelation: CaeTemporalRelation;
  directness: "DIRECT";
}>;

/** Complete, locale-neutral state. It may contain facts deliberately hidden from a learner. */
export type CaeCausalWorld = Readonly<{
  id: string;
  scenarioFamilyId: string;
  scenarioVariantId: string;
  domain: CaeDomain;
  nodes: readonly CaeNode[];
  edges: readonly CaeCausalEdge[];
  sourceMode: "CURATED_COMPOSABLE_SCENARIO";
}>;

export type CaeProjectionKind =
  | "DIRECT_RELATIONSHIP" | "COMMON_OR_INDEPENDENT" | "PROBABLE_CAUSE"
  | "PROBABLE_EFFECT" | "COMPETING_EXPLANATION" | "INDIRECT_CAUSAL_CHAIN"
  | "CORRELATION_CHECK" | "MULTI_EVENT_SEQUENCE" | "MISSING_CAUSAL_LINK";

export type CaeRelationship =
  | "FIRST_DIRECT_CAUSES_SECOND" | "SECOND_DIRECT_CAUSES_FIRST"
  | "INDEPENDENT_CAUSES" | "INDEPENDENT_EFFECTS" | "COMMON_CAUSE"
  | "INDIRECT_FIRST_CAUSES_SECOND" | "INDIRECT_SECOND_CAUSES_FIRST" | "NO_CAUSAL_LINK";

export type CaeDistractorRole =
  | "REVERSE_CAUSATION" | "CORRELATION" | "TEMPORAL_VIOLATION" | "WEAK_CAUSE"
  | "WRONG_SCOPE" | "UNRELATED_EVENT" | "COMMON_CAUSE_CONFUSION"
  | "INDIRECTNESS_CONFUSION" | "OVERGENERALISATION" | "MAGNITUDE_MISMATCH";

export type CaeCandidateOrigin = "CANONICAL_WORLD" | "VARIANT_AUTHORED";
export type CaeEditorialPlausibility = "CREDIBLE_ALTERNATIVE" | "CLEAR_REJECT";

/** Semantic applicability is resolved before comparative metadata is scored. */
export type CaeCandidateApplicability = Readonly<{
  id: string;
  applicableProjectionKinds: readonly CaeProjectionKind[];
  eligibleTargetSemanticSlots: readonly string[];
  eligibleReferenceSemanticSlots: readonly string[];
  eligibleRelations: readonly ("CAUSE_OF_TARGET" | "EFFECT_OF_TARGET" | "BRIDGE_TO_TARGET")[];
  /** This status applies only to the exact projection/target/reference/relation combination above. */
  editorialPlausibility: CaeEditorialPlausibility;
}>;

/** A complete event authored for one scenario, never a noun-substitution template. */
export type CaeSemanticCandidateAuthority = Readonly<{
  id: string;
  text: LocalizedText;
  mechanism: CaeDistractorRole;
  temporalOrder: number;
  scope: CaeScope;
  magnitude: CaeMagnitude;
  severity: CaeMagnitude;
  causalDistance: number | null;
  applicability: readonly CaeCandidateApplicability[];
  /** Human-authored explanation of why this is a real scenario event, not metadata filler. */
  editorialRationale: string;
}>;

export type CaeCandidateAuthority = Readonly<CaeSemanticCandidateAuthority & {
  source: CaeCandidateOrigin;
  sourceNodeId?: string;
  applicabilityMatch: CaeCandidateApplicability;
  editorialPlausibility: CaeEditorialPlausibility;
}>;

export type CaeCandidateComparison = Readonly<{
  candidateId: string;
  mechanism: CaeDistractorRole;
  source: CaeCandidateOrigin;
  /** Present only for a candidate reused from a canonical-world node. */
  sourceNodeId?: string;
  applicabilityId: string;
  applicability: CaeCandidateApplicability;
  editorialPlausibility: CaeEditorialPlausibility;
  projectionKind: CaeProjectionKind;
  expectedRelation: "CAUSE_OF_TARGET" | "EFFECT_OF_TARGET" | "BRIDGE_TO_TARGET";
  targetSemanticSlot: string;
  referenceSemanticSlot: string;
  candidateTemporalOrder: number;
  targetTemporalOrder: number;
  referenceTemporalOrder: number;
  candidateScope: CaeScope;
  targetScope: CaeScope;
  referenceScope: CaeScope;
  candidateMagnitude: CaeMagnitude;
  targetMagnitude: CaeMagnitude;
  referenceMagnitude: CaeMagnitude;
  candidateSeverity: CaeMagnitude;
  targetSeverity: CaeMagnitude;
  referenceSeverity: CaeMagnitude;
  timingGap: number;
  /** Difference from the graph-supported proposed answer, kept distinct from the observation gap. */
  expectedTimingGap: number;
  scopeGap: number;
  referenceScopeGap: number;
  magnitudeGap: number;
  referenceMagnitudeGap: number;
  severityGap: number;
  referenceSeverityGap: number;
  causalDistance: number | null;
  plausibilityBurden: number;
  rejectionReason: string;
}>;

export type CaeScenarioVariant = Readonly<{
  id: string;
  /** Neutral setting only; never an automatic rendering of canonical state. */
  backdrop: LocalizedText;
  /** Complete scenario events that could be considered as cause/bridge alternatives. */
  semanticCandidateEvents: readonly CaeSemanticCandidateAuthority[];
  /** Target-specific events that can fill the first hidden bridge of a causal chain. */
  semanticBridgeCandidateEvents: readonly CaeSemanticCandidateAuthority[];
  /** Complete scenario events authored specifically as possible effects. */
  semanticEffectCandidateEvents: readonly CaeSemanticCandidateAuthority[];
  nodes: readonly CaeScenarioNodeUnit[];
  edgeBindings: readonly Readonly<{ from: string; to: string; strength?: CaeCausalStrength; temporalRelation?: CaeTemporalRelation }>[];
}>;

export type CaeRenderingConstraints = Readonly<{
  hiddenCanonicalRoles: readonly CaeNodeRole[];
  contextMustBeNeutral: boolean;
  prohibitAnswerInStem: boolean;
  prohibitIndependenceCue: boolean;
  explanationMustShowStructure: boolean;
}>;

export type CaeScenarioFamilyAuthority = Readonly<{
  id: string;
  domain: CaeDomain;
  topology: "DIRECT_CHAIN" | "BRANCHING_COMMON_CAUSE" | "PARALLEL_CHAINS" | "HIDDEN_CHAIN" | "COMPETING_CAUSES";
  allowedProjectionKinds: readonly CaeProjectionKind[];
  allowedQuestionProfiles: readonly CaeQuestionProfile[];
  renderingConstraints: CaeRenderingConstraints;
  variants: readonly CaeScenarioVariant[];
}>;

/** A plan selects compatible generated states; it is not a finished question. */
export type CaeProjectionAuthority = Readonly<{
  id: string;
  checkpointId: Exclude<CaeCheckpointId, "CAE-CP-010">;
  qlId: CaeQlId;
  kind: CaeProjectionKind;
  compatibleFamilyIds: readonly string[];
  qlAllocationStatus: "PROVISIONAL_PENDING_SOURCE_SATURATION";
  examProfiles: readonly CaeQuestionProfile[];
}>;

export type CaeVisibleContext = Readonly<{
  backdrop: string | null;
  visibleNodeIds: readonly string[];
  hiddenNodeIds: readonly string[];
}>;

export type CaeDifficultyEvidence = Readonly<{
  causalDistance: number;
  hiddenLinks: number;
  topologyComplexity: number;
  plausibleDistractors: number;
  visibleEventCount: number;
  inferenceBurden: number;
  candidatePlausibilityBurden: number;
  score: number;
}>;

export type CaeRenderedOption = Readonly<{
  id: string;
  text: string;
  isCorrect: boolean;
  distractorRole?: CaeDistractorRole;
}>;

export type GeneratedCaeQuestion = Readonly<{
  chapterId: "CAE-001";
  checkpointId: Exclude<CaeCheckpointId, "CAE-CP-010">;
  qlId: CaeQlId;
  projectionId: string;
  scenarioFamilyId: string;
  scenarioVariantId: string;
  /** Graph/substructure state only; does not include candidates, profile, or presentation. */
  causalStateId: string;
  /** Causal state plus candidate set, profile, and rendered presentation. */
  itemVariantId: string;
  /** Backward-compatible alias for itemVariantId. */
  semanticInstanceId: string;
  causalWorldId: string;
  causalStructure: string;
  locale: CaeLocale;
  seed: number;
  difficulty: CaeDifficulty;
  difficultyEvidence: CaeDifficultyEvidence;
  questionProfile: CaeQuestionProfile | null;
  visibleContext: CaeVisibleContext;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answerId: string;
  explanation: string;
  causalTrace: readonly string[];
  distractorMechanisms: readonly CaeDistractorRole[];
  candidateComparisons: readonly CaeCandidateComparison[];
  optionMetadata: readonly CaeRenderedOption[];
  metadata: Readonly<{
    solver: "CAE_CAUSAL_WORLD_SOLVER_V3";
    sourceMode: "CURATED_COMPOSABLE_SCENARIO";
    qlAllocation: "PROVISIONAL_PENDING_SOURCE_SATURATION";
    reviewOnly: true;
    questionBankWritable: false;
    testEligible: false;
    mockEligible: false;
    publicEligible: false;
  }>;
}>;
