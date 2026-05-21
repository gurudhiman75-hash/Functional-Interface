import type {
  FormulaQuestion,
  GeneratorOptions,
} from "../../lib/core/generator-engine";

export type CorpusSchedulerProfileId =
  | "balanced_mock"
  | "ssc_mock"
  | "banking_mock"
  | "railway_mock"
  | "punjab_state_mock";

export type CorpusSchedulerProfile = {
  id: CorpusSchedulerProfileId;
  label: string;
  description: string;
  maxShare: {
    simpleTemplate: number;
    singleTopologyFamily: number;
    singleExaminerIntent: number;
    singleSemanticAnchor: number;
    singleDistractorTrap: number;
    hardStreak: number;
  };
  minShare: {
    reverseLogic: number;
    relational: number;
    filtered: number;
    hybrid: number;
    multiStep: number;
  };
  difficultyTarget: Record<"easy" | "medium" | "hard", number>;
  preferredMotifRotation: string[];
  maxAttemptsPerSlot: number;
};

export type CorpusSchedulerState = {
  profile: CorpusSchedulerProfile;
  targetCount: number;
  acceptedCount: number;
  topologyCounts: Record<string, number>;
  topologyGroupCounts: Record<string, number>;
  examinerIntentCounts: Record<string, number>;
  semanticAnchorCounts: Record<string, number>;
  distractorTrapCounts: Record<string, number>;
  familyCounts: Record<string, number>;
  difficultyCounts: Record<string, number>;
  fingerprintCounts: Record<string, number>;
  topologyVectorCounts: Record<string, number>;
  operationCounts: Record<string, number>;
  stemOpeningCounts: Record<string, number>;
  answerPatternCounts: Record<string, number>;
  recentExaminerIntents: string[];
  recentTopologyKeys: string[];
  recentSemanticAnchors: string[];
  pacingEvents: string[];
  rejectionReasons: Record<string, number>;
  hardStreak: number;
};

export type CorpusSchedulerCandidateAssessment = {
  accepted: boolean;
  score: number;
  reasons: string[];
  metadata: CorpusSchedulerCandidateMetadata;
};

export type CorpusSchedulerCandidateMetadata = {
  topologyKey: string;
  topologyGroup: string;
  examinerIntent: string;
  semanticAnchor: string;
  distractorTraps: string[];
  difficulty: "easy" | "medium" | "hard";
  fingerprintKey: string;
  topologyVectorKey: string;
  operationFingerprint: string;
  stemOpening: string;
  answerPattern: string;
  familyKey: string;
  multiStep: boolean;
};

export type CorpusSchedulerSummary = {
  profileId: CorpusSchedulerProfileId;
  targetCount: number;
  acceptedCount: number;
  topologyDistribution: Record<string, number>;
  topologyGroupDistribution: Record<string, number>;
  examinerIntentDistribution: Record<string, number>;
  semanticAnchorDistribution: Record<string, number>;
  familyDistribution: Record<string, number>;
  distractorTrapDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  duplicateRisk: {
    repeatedFingerprintCount: number;
    repeatedFingerprintShare: number;
    uniqueFingerprintCount: number;
    repeatedTopologyVectorCount: number;
    repeatedOperationCount: number;
  };
  pacingReport: {
    hardStreakLimit: number;
    events: string[];
  };
  rejectionReasons: Record<string, number>;
  repeatedOpeningWarnings: string[];
  balanceWarnings: string[];
};

export const CORPUS_SCHEDULER_PROFILES: readonly CorpusSchedulerProfile[] = [
  {
    id: "balanced_mock",
    label: "Balanced Mock",
    description: "General-purpose percentage corpus with broad cognitive variety.",
    maxShare: {
      simpleTemplate: 0.1,
      singleTopologyFamily: 0.2,
      singleExaminerIntent: 0.18,
      singleSemanticAnchor: 0.12,
      singleDistractorTrap: 0.28,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.14,
      relational: 0.18,
      filtered: 0.12,
      hybrid: 0.14,
      multiStep: 0.22,
    },
    difficultyTarget: {
      easy: 0.34,
      medium: 0.44,
      hard: 0.22,
    },
    preferredMotifRotation: [
      "perc_relational_chain",
      "perc_vote_election",
      "perc_reverse_find",
      "perc_price_consumption",
      "perc_ratio_percentage_hybrid",
      "perc_mixture_water_add",
      "perc_exam_pass_fail",
      "perc_restore_value",
      "perc_population_growth",
      "perc_salary_hike",
    ],
    maxAttemptsPerSlot: 8,
  },
  {
    id: "ssc_mock",
    label: "SSC Mock",
    description: "Compact arithmetic-heavy pacing with frequent base traps.",
    maxShare: {
      simpleTemplate: 0.12,
      singleTopologyFamily: 0.2,
      singleExaminerIntent: 0.18,
      singleSemanticAnchor: 0.12,
      singleDistractorTrap: 0.3,
      hardStreak: 2,
    },
    minShare: {
      reverseLogic: 0.14,
      relational: 0.16,
      filtered: 0.12,
      hybrid: 0.12,
      multiStep: 0.2,
    },
    difficultyTarget: {
      easy: 0.42,
      medium: 0.42,
      hard: 0.16,
    },
    preferredMotifRotation: [
      "perc_price_consumption",
      "perc_exam_pass_fail",
      "perc_vote_election",
      "perc_reverse_find",
      "perc_relational_chain",
      "perc_salary_hike",
      "perc_restore_value",
      "perc_mixture_water_add",
    ],
    maxAttemptsPerSlot: 8,
  },
  {
    id: "banking_mock",
    label: "Banking Mock",
    description: "Inference-heavy set with layered and relational reasoning.",
    maxShare: {
      simpleTemplate: 0.08,
      singleTopologyFamily: 0.18,
      singleExaminerIntent: 0.16,
      singleSemanticAnchor: 0.1,
      singleDistractorTrap: 0.26,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.16,
      relational: 0.24,
      filtered: 0.15,
      hybrid: 0.18,
      multiStep: 0.28,
    },
    difficultyTarget: {
      easy: 0.2,
      medium: 0.48,
      hard: 0.32,
    },
    preferredMotifRotation: [
      "perc_relational_chain",
      "perc_reverse_relation",
      "perc_ratio_percentage_hybrid",
      "perc_vote_election",
      "perc_price_consumption",
      "perc_mixture_water_add",
      "perc_population_growth",
    ],
    maxAttemptsPerSlot: 9,
  },
  {
    id: "railway_mock",
    label: "Railway Mock",
    description: "Direct but trap-oriented pacing with manageable arithmetic.",
    maxShare: {
      simpleTemplate: 0.14,
      singleTopologyFamily: 0.22,
      singleExaminerIntent: 0.2,
      singleSemanticAnchor: 0.14,
      singleDistractorTrap: 0.3,
      hardStreak: 2,
    },
    minShare: {
      reverseLogic: 0.13,
      relational: 0.16,
      filtered: 0.11,
      hybrid: 0.12,
      multiStep: 0.18,
    },
    difficultyTarget: {
      easy: 0.46,
      medium: 0.4,
      hard: 0.14,
    },
    preferredMotifRotation: [
      "perc_exam_pass_fail",
      "perc_price_consumption",
      "perc_vote_election",
      "perc_successive_hike",
      "perc_restore_value",
      "perc_relational_chain",
      "perc_mixture_water_add",
    ],
    maxAttemptsPerSlot: 8,
  },
  {
    id: "punjab_state_mock",
    label: "Punjab/State Mock",
    description: "Bilingual realism with compact wording and topic spread.",
    maxShare: {
      simpleTemplate: 0.12,
      singleTopologyFamily: 0.2,
      singleExaminerIntent: 0.18,
      singleSemanticAnchor: 0.12,
      singleDistractorTrap: 0.28,
      hardStreak: 2,
    },
    minShare: {
      reverseLogic: 0.14,
      relational: 0.18,
      filtered: 0.13,
      hybrid: 0.14,
      multiStep: 0.22,
    },
    difficultyTarget: {
      easy: 0.38,
      medium: 0.44,
      hard: 0.18,
    },
    preferredMotifRotation: [
      "perc_vote_election",
      "perc_exam_pass_fail",
      "perc_price_consumption",
      "perc_salary_hike",
      "perc_relational_chain",
      "perc_reverse_find",
      "perc_mixture_water_add",
      "perc_population_growth",
    ],
    maxAttemptsPerSlot: 8,
  },
];

function normalizeShare(count: number, total: number) {
  return total <= 0 ? 0 : count / total;
}

function increment(map: Record<string, number>, key: string, amount = 1) {
  map[key] = (map[key] ?? 0) + amount;
}

export function getCorpusSchedulerProfile(id?: string) {
  return (
    CORPUS_SCHEDULER_PROFILES.find((profile) => profile.id === id) ??
    CORPUS_SCHEDULER_PROFILES[0]!
  );
}

export function createCorpusSchedulerState(input: {
  targetCount: number;
  profileId?: CorpusSchedulerProfileId | string;
}) {
  return {
    profile: getCorpusSchedulerProfile(input.profileId),
    targetCount: Math.max(1, Math.floor(input.targetCount)),
    acceptedCount: 0,
    topologyCounts: {},
    topologyGroupCounts: {},
    examinerIntentCounts: {},
    semanticAnchorCounts: {},
    distractorTrapCounts: {},
    familyCounts: {},
    difficultyCounts: {},
    fingerprintCounts: {},
    topologyVectorCounts: {},
    operationCounts: {},
    stemOpeningCounts: {},
    answerPatternCounts: {},
    recentExaminerIntents: [],
    recentTopologyKeys: [],
    recentSemanticAnchors: [],
    pacingEvents: [],
    rejectionReasons: {},
    hardStreak: 0,
  } satisfies CorpusSchedulerState;
}

function quantV2(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 ?? {}) as Record<string, any>;
}

function topologyKey(problem: any, quantPayload: Record<string, any>) {
  const topology = quantPayload.topology ?? problem?.topology;
  if (!topology) return `simple:${problem?.subtype ?? "unknown"}`;
  return `${topology.family ?? "none"}:${topology.variant ?? problem?.subtype ?? "unknown"}`;
}

function topologyGroup(problem: any, graph: any, topology: string) {
  const text = `${problem?.category ?? ""} ${problem?.subtype ?? ""} ${problem?.reasoningPattern ?? ""} ${topology}`;
  if (/ratio|mixture|hybrid|consumption|expenditure/iu.test(text)) {
    return "hybrid";
  }
  if (/reverse|restore|hidden|inverse/iu.test(text)) {
    return "reverse_logic";
  }
  if (/filtered|valid|remaining|layered|election|population/iu.test(text)) {
    return "filtered";
  }
  if (/relational|relation|comparison_bridge|percentage_ratio_hybrid/iu.test(text)) {
    return "relational";
  }
  if ((graph?.steps?.length ?? 0) >= 4 || (graph?.branches?.length ?? 0) >= 2) {
    return "multi_step";
  }
  return "simple_template";
}

const SMALL_BATCH_FAMILY_CAPS: Record<string, number> = {
  election_margin: 15,
  price_consumption: 3,
  salary_revision: 2,
  single_relation: 2,
  two_step_relation_chain: 3,
  mixture_percentage: 3,
  reverse_percentage: 3,
  restore_original: 3,
};

function proportionalFamilyCap(state: CorpusSchedulerState, family: string) {
  if (family === "election_margin") {
    return Math.max(1, Math.floor(state.targetCount * 0.2));
  }
  return undefined;
}

function isElectionFamily(problem: any, topology: string) {
  const text = [
    problem?.subtype,
    problem?.category,
    problem?.reasoningPattern,
    problem?.topology?.family,
    problem?.topology?.variant,
    topology,
  ].join(" ");
  return /election|vote|voter|registered|valid_vote|valid vote|direct_margin|invalid_vote_margin|turnout_margin|filtered_valid_vote_margin|remaining_vote_margin|multi_candidate_margin/iu.test(text);
}

function familyKey(problem: any, topology: string) {
  const subtype = String(problem?.subtype ?? "unknown");
  const variant = String(problem?.topology?.variant ?? topology);
  const relationCount = Math.trunc(Number(problem?.variables?.relationCount ?? 0));

  if (isElectionFamily(problem, topology)) {
    return "election_margin";
  }

  if (subtype === "relational_percentage") {
    if (relationCount <= 1 || variant.includes("single_relation")) {
      return "single_relation";
    }
    if (relationCount === 2 || variant.includes("two_step")) {
      return "two_step_relation_chain";
    }
    return "multi_step_relation_chain";
  }

  return subtype;
}

function smallBatchFamilyCap(state: CorpusSchedulerState, family: string) {
  if (state.targetCount > 60) {
    return proportionalFamilyCap(state, family);
  }
  const fixedCap = SMALL_BATCH_FAMILY_CAPS[family];
  const proportionalCap = proportionalFamilyCap(state, family);
  if (fixedCap === undefined) {
    return proportionalCap;
  }
  if (proportionalCap === undefined) {
    return fixedCap;
  }
  return Math.min(fixedCap, proportionalCap);
}

const MOTIF_FAMILY: Record<string, string> = {
  perc_vote_election: "election_margin",
  perc_price_consumption: "price_consumption",
  perc_salary_hike: "salary_revision",
  perc_income_savings_expense: "salary_revision",
  perc_sales_commission: "salary_revision",
  perc_tax_income: "salary_revision",
  perc_mixture_water_add: "mixture_percentage",
  perc_reverse_find: "reverse_percentage",
  perc_restore_value: "restore_original",
  perc_relational_chain: "two_step_relation_chain",
  perc_reverse_relation: "two_step_relation_chain",
};

function cappedMotif(state: CorpusSchedulerState, motifId: string | undefined) {
  const family = motifId ? MOTIF_FAMILY[motifId] : undefined;
  const cap = family ? smallBatchFamilyCap(state, family) : undefined;
  return cap !== undefined && (state.familyCounts[family!] ?? 0) >= cap;
}

function firstUncappedMotif(state: CorpusSchedulerState, slotIndex: number) {
  const rotation = state.profile.preferredMotifRotation;
  for (let offset = 0; offset < rotation.length; offset += 1) {
    const motif = rotation[(slotIndex + offset) % rotation.length]!;
    if (!cappedMotif(state, motif)) {
      return motif;
    }
  }
  return rotation[slotIndex % rotation.length]!;
}

export function extractCorpusSchedulerMetadata(
  question: FormulaQuestion,
): CorpusSchedulerCandidateMetadata {
  const payload = quantV2(question);
  const problem = payload.canonicalProblem ?? (question.semanticMetadata as any)?.problem;
  const graph = payload.reasoningGraph ?? question.reasoningGraph;
  const semantic = payload.semanticMetadata ?? {};
  const topology = topologyKey(problem, payload);
  const family = familyKey(problem, topology);
  const group = topologyGroup(problem, graph, topology);
  const examinerIntent =
    semantic.examinerIntent?.primaryIntent ??
    payload.examinerIntent?.primaryIntent ??
    (question.examRealismMetadata as any)?.examinerIntent?.primaryIntent ??
    "unknown_intent";
  const canonicalScenario =
    semantic.canonicalScenario ??
    payload.canonicalScenario ??
    (question.semanticMetadata as any)?.canonicalScenario ??
    {};
  const semanticAnchor = [
    canonicalScenario.domain ?? payload.category ?? problem?.category ?? "unknown_domain",
    canonicalScenario.object ?? payload.subtype ?? problem?.subtype ?? "unknown_object",
  ].join(":");
  const distractorTraps =
    semantic.distractorIntelligence?.map((item: any) => String(item.trapType)) ??
    question.optionMetadata
      ?.filter((item) => !item.isCorrect)
      .map((item: any) => String(item.reasoningTrap ?? item.distractorType)) ??
    [];
  const difficulty = String(problem?.difficulty ?? question.difficulty ?? "medium")
    .toLowerCase() as "easy" | "medium" | "hard";
  const fingerprints = semantic.corpusFingerprints ?? payload.corpusFingerprints ?? {};
  const operationFingerprint = String(
    fingerprints.operationFingerprint ??
    (graph?.steps ?? [])
      .map((step: any) => `${step.type}:${step.descriptionKey}`)
      .join(">") ??
    "operation",
  );
  const percentageVectorFingerprint = String(
    fingerprints.percentageVectorFingerprint ?? "vector",
  );
  const fingerprintKey =
    fingerprints.compositeFingerprint ??
    [
      fingerprints.topologyFingerprint ?? topology,
      fingerprints.operationFingerprint ?? "operation",
      fingerprints.percentageVectorFingerprint ?? "vector",
      fingerprints.semanticIntentFingerprint ?? semanticAnchor,
      fingerprints.distractorPatternFingerprint ?? distractorTraps.join("|"),
    ].join("::");
  const stemOpening = String(question.text ?? "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/u)
    .filter(Boolean)
    .slice(0, 6)
    .join(" ")
    .toLowerCase();
  const answerPattern = [
    String(problem?.subtype ?? payload.subtype ?? "unknown"),
    String(question.options?.[question.correct ?? 0] ?? problem?.answer ?? ""),
  ]
    .join(":")
    .replace(/\d+(?:\.\d+)?/gu, "#")
    .toLowerCase();

  return {
    topologyKey: topology,
    topologyGroup: group,
    examinerIntent: String(examinerIntent),
    semanticAnchor,
    distractorTraps,
    difficulty: ["easy", "medium", "hard"].includes(difficulty)
      ? difficulty
      : "medium",
    fingerprintKey: String(fingerprintKey),
    topologyVectorKey: `${topology}::${percentageVectorFingerprint}`,
    operationFingerprint,
    stemOpening,
    answerPattern,
    familyKey: family,
    multiStep: group === "multi_step" || (graph?.steps?.length ?? 0) >= 4,
  };
}

function projectedShare(
  state: CorpusSchedulerState,
  map: Record<string, number>,
  key: string,
) {
  return normalizeShare((map[key] ?? 0) + 1, state.acceptedCount + 1);
}

function deficitBonus(
  currentShare: number,
  targetShare: number,
  weight: number,
) {
  return currentShare < targetShare ? (targetShare - currentShare) * weight : 0;
}

export function assessCorpusSchedulerCandidate(input: {
  state: CorpusSchedulerState;
  question: FormulaQuestion;
  index: number;
}): CorpusSchedulerCandidateAssessment {
  const metadata = extractCorpusSchedulerMetadata(input.question);
  const state = input.state;
  const reasons: string[] = [];
  let score = 100;
  const projectedTotal = state.acceptedCount + 1;

  if (state.fingerprintCounts[metadata.fingerprintKey]) {
    score -= 80;
    reasons.push("fingerprint collision");
  }
  if (state.topologyVectorCounts[metadata.topologyVectorKey]) {
    score -= 70;
    reasons.push("topology plus percentage-vector collision");
  }
  if (
    state.operationCounts[metadata.operationFingerprint] &&
    projectedShare(state, state.operationCounts, metadata.operationFingerprint) > 0.1
  ) {
    score -= 32;
    reasons.push("operation-chain repetition");
  }
  if (
    metadata.stemOpening &&
    state.stemOpeningCounts[metadata.stemOpening] &&
    projectedShare(state, state.stemOpeningCounts, metadata.stemOpening) > 0.04
  ) {
    score -= 35;
    reasons.push("stem opening repetition");
  }
  if (
    state.answerPatternCounts[metadata.answerPattern] &&
    projectedShare(state, state.answerPatternCounts, metadata.answerPattern) > 0.08
  ) {
    score -= 26;
    reasons.push("answer-pattern repetition");
  }
  if (state.recentExaminerIntents.slice(-4).includes(metadata.examinerIntent)) {
    score -= 22;
    reasons.push("examiner intent repeated too close");
  }
  if (state.recentTopologyKeys.slice(-5).includes(metadata.topologyKey)) {
    score -= 26;
    reasons.push("topology repeated too close");
  }
  if (state.recentSemanticAnchors.slice(-5).includes(metadata.semanticAnchor)) {
    score -= 24;
    reasons.push("semantic anchor repeated too close");
  }
  if (
    projectedShare(state, state.topologyCounts, metadata.topologyKey) >
    state.profile.maxShare.singleTopologyFamily
  ) {
    score -= 28;
    reasons.push("topology clustering");
  }
  if (
    projectedShare(state, state.examinerIntentCounts, metadata.examinerIntent) >
    state.profile.maxShare.singleExaminerIntent
  ) {
    score -= 26;
    reasons.push("examiner intent clustering");
  }
  if (
    projectedShare(state, state.semanticAnchorCounts, metadata.semanticAnchor) >
    state.profile.maxShare.singleSemanticAnchor
  ) {
    score -= 30;
    reasons.push("semantic anchor clustering");
  }
  for (const trap of metadata.distractorTraps) {
    if (
      projectedShare(state, state.distractorTrapCounts, trap) >
      state.profile.maxShare.singleDistractorTrap
    ) {
      score -= 8;
      reasons.push(`distractor trap clustering: ${trap}`);
    }
  }
  const familyCap = smallBatchFamilyCap(state, metadata.familyKey);
  if (
    familyCap !== undefined &&
    (state.familyCounts[metadata.familyKey] ?? 0) + 1 > familyCap
  ) {
    score -= 95;
    reasons.push(`family cap exceeded: ${metadata.familyKey}`);
  }
  if (
    metadata.topologyGroup === "simple_template" &&
    normalizeShare(
      (state.topologyGroupCounts.simple_template ?? 0) + 1,
      projectedTotal,
    ) > state.profile.maxShare.simpleTemplate
  ) {
    score -= 44;
    reasons.push("simple-template saturation");
  }
  if (
    metadata.difficulty === "hard" &&
    state.hardStreak >= state.profile.maxShare.hardStreak
  ) {
    score -= 25;
    reasons.push("hard difficulty pacing streak");
  }

  const difficultyShare = normalizeShare(
    state.difficultyCounts[metadata.difficulty] ?? 0,
    Math.max(1, state.acceptedCount),
  );
  score += deficitBonus(
    difficultyShare,
    state.profile.difficultyTarget[metadata.difficulty],
    20,
  );
  score += deficitBonus(
    normalizeShare(state.topologyGroupCounts.reverse_logic ?? 0, state.acceptedCount),
    state.profile.minShare.reverseLogic,
    metadata.topologyGroup === "reverse_logic" ? 35 : 0,
  );
  score += deficitBonus(
    normalizeShare(state.topologyGroupCounts.relational ?? 0, state.acceptedCount),
    state.profile.minShare.relational,
    metadata.topologyGroup === "relational" ? 35 : 0,
  );
  score += deficitBonus(
    normalizeShare(state.topologyGroupCounts.filtered ?? 0, state.acceptedCount),
    state.profile.minShare.filtered,
    metadata.topologyGroup === "filtered" ? 28 : 0,
  );
  score += deficitBonus(
    normalizeShare(state.topologyGroupCounts.hybrid ?? 0, state.acceptedCount),
    state.profile.minShare.hybrid,
    metadata.topologyGroup === "hybrid" ? 28 : 0,
  );
  score += deficitBonus(
    normalizeShare(state.topologyGroupCounts.multi_step ?? 0, state.acceptedCount),
    state.profile.minShare.multiStep,
    metadata.multiStep ? 20 : 0,
  );

  const accepted = score >= 72 || input.index < 2;
  return {
    accepted,
    score: Math.round(score),
    reasons,
    metadata,
  };
}

export function recordCorpusSchedulerCandidate(
  state: CorpusSchedulerState,
  assessment: CorpusSchedulerCandidateAssessment,
) {
  const metadata = assessment.metadata;
  state.acceptedCount += 1;
  increment(state.topologyCounts, metadata.topologyKey);
  increment(state.topologyGroupCounts, metadata.topologyGroup);
  increment(state.examinerIntentCounts, metadata.examinerIntent);
  increment(state.semanticAnchorCounts, metadata.semanticAnchor);
  increment(state.difficultyCounts, metadata.difficulty);
  increment(state.familyCounts, metadata.familyKey);
  increment(state.fingerprintCounts, metadata.fingerprintKey);
  increment(state.topologyVectorCounts, metadata.topologyVectorKey);
  increment(state.operationCounts, metadata.operationFingerprint);
  increment(state.answerPatternCounts, metadata.answerPattern);
  if (metadata.stemOpening) {
    increment(state.stemOpeningCounts, metadata.stemOpening);
  }
  state.recentExaminerIntents = [...state.recentExaminerIntents, metadata.examinerIntent].slice(-8);
  state.recentTopologyKeys = [...state.recentTopologyKeys, metadata.topologyKey].slice(-8);
  state.recentSemanticAnchors = [...state.recentSemanticAnchors, metadata.semanticAnchor].slice(-8);
  for (const trap of metadata.distractorTraps) {
    increment(state.distractorTrapCounts, trap);
  }
  state.hardStreak = metadata.difficulty === "hard" ? state.hardStreak + 1 : 0;
  if (assessment.reasons.includes("hard difficulty pacing streak")) {
    state.pacingEvents.push(`Hard-streak softened near slot ${state.acceptedCount}.`);
  }
}

export function rejectCorpusSchedulerCandidate(
  state: CorpusSchedulerState,
  assessment: CorpusSchedulerCandidateAssessment,
) {
  for (const reason of assessment.reasons) {
    increment(state.rejectionReasons, reason);
  }
}

export function suggestSchedulerMotif(
  state: CorpusSchedulerState,
  slotIndex: number,
) {
  const accepted = Math.max(1, state.acceptedCount);
  const groups = state.topologyGroupCounts;
  if (
    normalizeShare(groups.relational ?? 0, accepted) <
    state.profile.minShare.relational
  ) {
    return cappedMotif(state, "perc_relational_chain")
      ? firstUncappedMotif(state, slotIndex)
      : "perc_relational_chain";
  }
  if (
    normalizeShare(groups.reverse_logic ?? 0, accepted) <
    state.profile.minShare.reverseLogic
  ) {
    const motif = slotIndex % 2 === 0 ? "perc_reverse_find" : "perc_restore_value";
    return cappedMotif(state, motif) ? firstUncappedMotif(state, slotIndex) : motif;
  }
  if (
    normalizeShare(groups.filtered ?? 0, accepted) <
    state.profile.minShare.filtered
  ) {
    const motif = slotIndex % 2 === 0
      ? "perc_vote_election"
      : "perc_population_growth";
    return cappedMotif(state, motif) ? firstUncappedMotif(state, slotIndex) : motif;
  }
  if (
    normalizeShare(groups.hybrid ?? 0, accepted) <
    state.profile.minShare.hybrid
  ) {
    const motif = slotIndex % 2 === 0
      ? "perc_ratio_percentage_hybrid"
      : "perc_price_consumption";
    return cappedMotif(state, motif) ? firstUncappedMotif(state, slotIndex) : motif;
  }
  return firstUncappedMotif(state, slotIndex);
}

export function createScheduledGeneratorOptions(input: {
  state: CorpusSchedulerState;
  index: number;
  attempt: number;
  seedPrefix: string;
  examProfile?: GeneratorOptions["examProfile"];
  forcedMotifId?: string;
}): GeneratorOptions {
  return {
    seed: `${input.seedPrefix}:scheduled:${input.index}:${input.attempt}`,
    examProfile: input.examProfile,
    forcedMotifId:
      input.forcedMotifId ??
      suggestSchedulerMotif(input.state, input.index + input.attempt),
  };
}

export function summarizeCorpusScheduler(
  state: CorpusSchedulerState,
): CorpusSchedulerSummary {
  const total = Math.max(1, state.acceptedCount);
  const repeatedFingerprintCount = Object.values(state.fingerprintCounts).reduce(
    (sum, count) => sum + Math.max(0, count - 1),
    0,
  );
  const repeatedTopologyVectorCount = Object.values(state.topologyVectorCounts).reduce(
    (sum, count) => sum + Math.max(0, count - 1),
    0,
  );
  const repeatedOperationCount = Object.values(state.operationCounts).reduce(
    (sum, count) => sum + Math.max(0, count - 1),
    0,
  );
  const repeatedOpeningWarnings = Object.entries(state.stemOpeningCounts)
    .filter(([, count]) => count > Math.max(2, total * 0.06))
    .sort((left, right) => right[1] - left[1])
    .slice(0, 8)
    .map(([opening, count]) => `Stem opening repeated ${count} times: ${opening}`);
  const groupShare = (key: string) =>
    normalizeShare(state.topologyGroupCounts[key] ?? 0, total);
  const warnings: string[] = [];

  if (groupShare("simple_template") > state.profile.maxShare.simpleTemplate) {
    warnings.push("simple-template share remains above profile target");
  }
  if (groupShare("relational") < state.profile.minShare.relational) {
    warnings.push("relational share remains below profile target");
  }
  if (groupShare("reverse_logic") < state.profile.minShare.reverseLogic) {
    warnings.push("reverse-logic share remains below profile target");
  }
  if (groupShare("filtered") < state.profile.minShare.filtered) {
    warnings.push("filtered reasoning share remains below profile target");
  }
  if (groupShare("hybrid") < state.profile.minShare.hybrid) {
    warnings.push("hybrid reasoning share remains below profile target");
  }
  if (repeatedFingerprintCount / total > 0.24) {
    warnings.push("fingerprint repetition risk is still visible");
  }
  if (repeatedTopologyVectorCount / total > 0.2) {
    warnings.push("topology plus percentage-vector repetition is still visible");
  }
  if (repeatedOpeningWarnings.length > 0) {
    warnings.push("stem opening repetition needs review");
  }

  return {
    profileId: state.profile.id,
    targetCount: state.targetCount,
    acceptedCount: state.acceptedCount,
    topologyDistribution: state.topologyCounts,
    topologyGroupDistribution: state.topologyGroupCounts,
    examinerIntentDistribution: state.examinerIntentCounts,
    semanticAnchorDistribution: state.semanticAnchorCounts,
    familyDistribution: state.familyCounts,
    distractorTrapDistribution: state.distractorTrapCounts,
    difficultyDistribution: state.difficultyCounts,
    duplicateRisk: {
      repeatedFingerprintCount,
      repeatedFingerprintShare: Number((repeatedFingerprintCount / total).toFixed(4)),
      uniqueFingerprintCount: Object.keys(state.fingerprintCounts).length,
      repeatedTopologyVectorCount,
      repeatedOperationCount,
    },
    pacingReport: {
      hardStreakLimit: state.profile.maxShare.hardStreak,
      events: state.pacingEvents,
    },
    rejectionReasons: state.rejectionReasons,
    repeatedOpeningWarnings,
    balanceWarnings: warnings,
  };
}

export function generateScheduledQuestion(input: {
  state: CorpusSchedulerState;
  index: number;
  seedPrefix: string;
  examProfile?: GeneratorOptions["examProfile"];
  forcedMotifId?: string;
  generate: (options: GeneratorOptions) => FormulaQuestion;
}) {
  let best:
    | {
        question: FormulaQuestion;
        assessment: CorpusSchedulerCandidateAssessment;
      }
    | undefined;

  for (let attempt = 0; attempt < input.state.profile.maxAttemptsPerSlot; attempt += 1) {
    const question = input.generate(
      createScheduledGeneratorOptions({
        state: input.state,
        index: input.index,
        attempt,
        seedPrefix: input.seedPrefix,
        examProfile: input.examProfile,
        forcedMotifId: input.forcedMotifId,
      }),
    );
    const assessment = assessCorpusSchedulerCandidate({
      state: input.state,
      question,
      index: input.index,
    });
    if (!best || assessment.score > best.assessment.score) {
      best = { question, assessment };
    }
    if (assessment.accepted) {
      break;
    }
    rejectCorpusSchedulerCandidate(input.state, assessment);
  }

  if (!best) {
    throw new Error("Corpus scheduler failed to generate a candidate.");
  }
  recordCorpusSchedulerCandidate(input.state, best.assessment);
  return {
    question: best.question,
    assessment: best.assessment,
  };
}
