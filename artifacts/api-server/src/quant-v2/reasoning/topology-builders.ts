import type {
  CanonicalPercentageProblem,
  Difficulty,
  PercentageCategory,
  PercentageSubtype,
  ReasoningPattern,
  Trap,
} from "../canonical/percentage-types";
import {
  generateDeterministicDistractors,
  type TrapCandidate,
} from "../canonical/distractor-engine";
import {
  applyPercentage,
  createSeededRandom,
  percentageOf,
  reversePercentage,
  sanitizeValue,
  type SeededRandom,
} from "../utils/math-utils";
import {
  humanizedElectionTotal,
  humanizedExamTotal,
  humanizedPopulationTotal,
} from "../realism/humanized-number-pools";
import { beautifyCanonicalValues } from "../realism/value-beautifier";
import { sanitizeEquation } from "./equation-utils";
import type {
  ReasoningBranch,
  ReasoningGraph,
  ReasoningStep,
  ReasoningStepType,
} from "./reasoning-graph-types";
import type {
  ElectionTopology,
  FilteringChain,
  MisconceptionDistractor,
  PassFailTopology,
  PopulationTopology,
  TopologyBuildResult,
  TopologyFamily,
  TopologyMetadata,
  TopologyVariant,
} from "./topology-types";

type ProblemData = {
  id: string;
  category: PercentageCategory;
  subtype: PercentageSubtype;
  reasoningPattern: ReasoningPattern;
  variables: Record<string, number>;
  answer: number;
  traps: Trap[];
  difficulty: Difficulty;
  topology: TopologyMetadata;
};

type GraphData = {
  subtype: PercentageSubtype;
  reasoningPattern: ReasoningPattern;
  insightKey: string;
  steps: ReasoningStep[];
  finalEquation: string;
  shortcutEquation?: string;
  trapSummary: string;
  branches?: ReasoningBranch[];
};

type BuildContext = {
  rng: SeededRandom;
  seedText: string;
  serial: number;
};

const TRAP_BY_MISCONCEPTION = {
  ignoring_invalid_votes: "ignoring_invalid_votes",
  using_wrong_denominator: "wrong_denominator",
  mapping_winner_percentage_directly: "direct_percentage_mapping",
  forgetting_filtering_stage: "forgetting_filtering_stage",
  additive_instead_of_multiplicative: "additive_instead_of_multiplicative",
  ignoring_remaining_component: "ignoring_remaining_component",
  ratio_confusion: "ratio_confusion",
  using_stated_base_as_effective_base: "wrong_base",
} as const satisfies Record<
  MisconceptionDistractor["misconception"],
  Trap
>;

function serialFromSeed(seed: number | string | undefined): number {
  if (typeof seed === "number" && Number.isFinite(seed)) {
    return Math.max(1, Math.trunc(Math.abs(seed)));
  }

  const text = String(seed ?? 1);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) % 997 + 1;
}

function context(seed: number | string | undefined): BuildContext {
  const seedText = String(seed ?? 1);
  return {
    rng: createSeededRandom(seedText),
    seedText,
    serial: serialFromSeed(seed),
  };
}

function step(input: {
  id: string;
  type: ReasoningStepType;
  descriptionKey: string;
  inputVariables: string[];
  outputVariable?: string;
  equation?: string;
  trapWarning?: string;
}): ReasoningStep {
  return {
    ...input,
    equation: input.equation
      ? sanitizeEquation(input.equation)
      : undefined,
  };
}

function finalStep(inputVariables: string[]): ReasoningStep {
  return step({
    id: "final",
    type: "final_answer",
    descriptionKey: "confirm_final_answer",
    inputVariables,
    equation: "answer = {answer}",
  });
}

function branch(
  branchId: string,
  branchType: ReasoningBranch["branchType"],
  steps: ReasoningStep[],
): ReasoningBranch {
  return {
    branchId,
    branchType,
    steps,
  };
}

function graph(data: GraphData): ReasoningGraph {
  const branches = data.branches ?? [
    branch("standard", "standard", data.steps),
  ];

  return {
    subtype: data.subtype,
    reasoningPattern: data.reasoningPattern,
    insightKey: data.insightKey,
    steps: data.steps,
    branches,
    finalEquation: sanitizeEquation(data.finalEquation),
    shortcutEquation: data.shortcutEquation
      ? sanitizeEquation(data.shortcutEquation)
      : undefined,
    trapSummary: data.trapSummary,
  };
}

function problem(data: ProblemData): CanonicalPercentageProblem {
  const misconceptionCandidates: TrapCandidate[] =
    data.topology.misconceptionDistractors.map((item) => ({
      trap: TRAP_BY_MISCONCEPTION[item.misconception],
      value: item.value,
    }));

  return beautifyCanonicalValues({
    id: data.id,
    concept: "percentage",
    category: data.category,
    subtype: data.subtype,
    reasoningPattern: data.reasoningPattern,
    variables: data.variables,
    answer: sanitizeValue(data.answer),
    distractors: generateDeterministicDistractors({
      answer: data.answer,
      candidates: misconceptionCandidates,
    }),
    traps: data.traps,
    difficulty: data.difficulty,
    topology: data.topology,
  });
}

function topology(
  family: TopologyFamily,
  variant: TopologyVariant,
  misconceptionDistractors: MisconceptionDistractor[],
  extra: Omit<
    TopologyMetadata,
    "family" | "variant" | "misconceptionDistractors"
  > = {},
): TopologyMetadata {
  return {
    family,
    variant,
    misconceptionDistractors,
    ...extra,
  };
}

function filteringChain(
  chainId: string,
  baseVariable: string,
  targetVariable: string,
  stages: FilteringChain["stages"],
): FilteringChain {
  return {
    chainId,
    baseVariable,
    targetVariable,
    stages,
  };
}

function electionPercents(ctx: BuildContext) {
  const winnerOptions = [55, 60, 62.5, 65, 70] as const;
  const winnerPercent =
    winnerOptions[ctx.serial % winnerOptions.length]!;
  const loserPercent = sanitizeValue(100 - winnerPercent);
  const gapPercent = sanitizeValue(winnerPercent - loserPercent);

  return {
    winnerPercent,
    loserPercent,
    gapPercent,
  };
}

function totalBase(ctx: BuildContext, offset = 0) {
  return humanizedElectionTotal(ctx.serial, offset);
}

function cleanMargin(total: number, gapPercent: number) {
  return percentageOf(total, gapPercent);
}

function directMargin(ctx: BuildContext): TopologyBuildResult {
  const { winnerPercent, loserPercent, gapPercent } = electionPercents(ctx);
  const totalVotes = totalBase(ctx);
  const margin = cleanMargin(totalVotes, gapPercent);
  const metadata = topology(
    "direct_mapping",
    "direct_margin",
    [
      {
        misconception: "mapping_winner_percentage_directly",
        value: reversePercentage(margin, winnerPercent),
      },
      {
        misconception: "using_wrong_denominator",
        value: reversePercentage(margin, loserPercent),
      },
      {
        misconception: "ratio_confusion",
        value: sanitizeValue(margin * gapPercent),
      },
    ],
    {
      conservationGroups: [
        {
          groupId: "two_candidate_vote_share",
          totalPercent: 100,
          partVariables: ["winnerPercent", "loserPercent"],
        },
      ],
    },
  );
  const canonical = problem({
    id: "election_margin",
    category: "election",
    subtype: "election_margin",
    reasoningPattern: "margin_mapping",
    variables: {
      totalVotes,
      winnerPercent,
      loserPercent,
      gapPercent,
      margin,
    },
    answer: totalVotes,
    traps: [
      "margin_confusion",
      "wrong_denominator",
      "direct_percentage_mapping",
    ],
    difficulty: gapPercent <= 15 ? "medium" : "easy",
    topology: metadata,
  });
  const steps = [
    step({
      id: "derive_gap",
      type: "derive_percentage_gap",
      descriptionKey: "derive_vote_gap",
      inputVariables: ["winnerPercent", "loserPercent"],
      outputVariable: "gapPercent",
      equation: "gapPercent = {winnerPercent} - {loserPercent}",
      trapWarning: "margin_confusion",
    }),
    step({
      id: "map_gap_to_total",
      type: "map_percentage_to_value",
      descriptionKey: "map_difference_to_total",
      inputVariables: ["margin", "gapPercent"],
      outputVariable: "totalVotes",
      equation: "totalVotes = {margin} * 100 / gapPercent",
      trapWarning: "wrong_denominator",
    }),
    finalStep(["totalVotes", "answer"]),
  ];

  return {
    problem: canonical,
    graph: graph({
      subtype: "election_margin",
      reasoningPattern: "margin_mapping",
      insightKey: "vote_gap_maps_to_margin",
      steps,
      finalEquation: "answer = {totalVotes}",
      shortcutEquation: "{gapPercent}% = {margin}; 100% = {answer}",
      trapSummary: canonical.traps.join("|"),
      branches: [
        branch("standard", "standard", steps),
        branch("unitary_gap", "unitary", [
          step({
            id: "one_percent_votes",
            type: "map_percentage_to_value",
            descriptionKey: "derive_one_percent_votes",
            inputVariables: ["margin", "gapPercent"],
            outputVariable: "onePercentVotes",
            equation: "onePercentVotes = {margin} / {gapPercent}",
          }),
          step({
            id: "scale_to_total",
            type: "map_percentage_to_value",
            descriptionKey: "scale_one_percent_to_total",
            inputVariables: ["onePercentVotes"],
            outputVariable: "totalVotes",
            equation: "totalVotes = onePercentVotes * 100",
          }),
          finalStep(["totalVotes", "answer"]),
        ]),
      ],
    }),
  };
}

function invalidVoteMargin(ctx: BuildContext): TopologyBuildResult {
  const { winnerPercent, loserPercent, gapPercent } = electionPercents(ctx);
  const totalVotes = totalBase(ctx, 40);
  const invalidPercent = [10, 20][ctx.serial % 2]!;
  const validPercent = sanitizeValue(100 - invalidPercent);
  const validVotes = percentageOf(totalVotes, validPercent);
  const margin = cleanMargin(validVotes, gapPercent);
  const chain = filteringChain(
    "total_to_valid_votes",
    "totalVotes",
    "validVotes",
    [
      {
        stageId: "remove_invalid_votes",
        kind: "remaining_percentage",
        inputVariable: "totalVotes",
        outputVariable: "validVotes",
        percentVariable: "validPercent",
        equation: "validVotes = {totalVotes} * {validPercent} / 100",
        hidden: true,
      },
    ],
  );
  const metadata = topology(
    "filtered_base",
    "invalid_vote_margin",
    [
      {
        misconception: "ignoring_invalid_votes",
        value: reversePercentage(margin, gapPercent),
      },
      {
        misconception: "mapping_winner_percentage_directly",
        value: reversePercentage(margin, winnerPercent),
      },
      {
        misconception: "using_wrong_denominator",
        value: reversePercentage(margin, validPercent),
      },
    ],
    {
      filteringChain: chain,
      hiddenBase: {
        baseVariable: "totalVotes",
        knownVariable: "validVotes",
        percentVariable: "validPercent",
      },
      conservationGroups: [
        {
          groupId: "valid_invalid_vote_share",
          totalPercent: 100,
          partVariables: ["invalidPercent", "validPercent"],
        },
        {
          groupId: "two_candidate_valid_share",
          totalPercent: 100,
          partVariables: ["winnerPercent", "loserPercent"],
        },
      ],
    },
  );
  const canonical = problem({
    id: "election_margin",
    category: "election",
    subtype: "election_margin",
    reasoningPattern: "margin_mapping",
    variables: {
      totalVotes,
      invalidPercent,
      validPercent,
      validVotes,
      winnerPercent,
      loserPercent,
      gapPercent,
      margin,
    },
    answer: totalVotes,
    traps: [
      "ignoring_invalid_votes",
      "wrong_denominator",
      "direct_percentage_mapping",
    ],
    difficulty: "medium",
    topology: metadata,
  });
  const steps = [
    step({
      id: "derive_valid_vote_gap",
      type: "derive_percentage_gap",
      descriptionKey: "derive_valid_vote_gap",
      inputVariables: ["winnerPercent", "loserPercent"],
      outputVariable: "gapPercent",
      equation: "gapPercent = {winnerPercent} - {loserPercent}",
      trapWarning: "margin_confusion",
    }),
    step({
      id: "reconstruct_valid_votes",
      type: "reverse_calculation",
      descriptionKey: "reconstruct_valid_votes_from_margin",
      inputVariables: ["margin", "gapPercent"],
      outputVariable: "validVotes",
      equation: "validVotes = {margin} * 100 / gapPercent",
      trapWarning: "wrong_denominator",
    }),
    step({
      id: "reconstruct_total_votes",
      type: "reconstruct_component",
      descriptionKey: "reconstruct_total_before_invalid_filter",
      inputVariables: ["validVotes", "validPercent"],
      outputVariable: "totalVotes",
      equation: "totalVotes = validVotes * 100 / {validPercent}",
      trapWarning: "ignoring_invalid_votes",
    }),
    finalStep(["totalVotes", "answer"]),
  ];

  return {
    problem: canonical,
    graph: graph({
      subtype: "election_margin",
      reasoningPattern: "margin_mapping",
      insightKey: "valid_vote_gap_reconstructs_hidden_total",
      steps,
      finalEquation: "answer = {totalVotes}",
      shortcutEquation:
        "{gapPercent}% validVotes = {margin}; {validPercent}% totalVotes = validVotes; answer = {answer}",
      trapSummary: canonical.traps.join("|"),
      branches: [
        branch("standard", "standard", steps),
        branch("reverse_filter_first", "reverse", [
          step({
            id: "valid_votes_from_margin",
            type: "reverse_calculation",
            descriptionKey: "reconstruct_valid_votes_from_margin",
            inputVariables: ["margin", "gapPercent"],
            outputVariable: "validVotes",
            equation: "validVotes = {margin} * 100 / {gapPercent}",
          }),
          step({
            id: "invalid_votes_from_valid",
            type: "reverse_calculation",
            descriptionKey: "derive_invalid_votes_from_valid_share",
            inputVariables: ["validVotes", "validPercent", "invalidPercent"],
            outputVariable: "invalidVotes",
            equation:
              "invalidVotes = validVotes * {invalidPercent} / {validPercent}",
          }),
          step({
            id: "sum_total_votes",
            type: "aggregate_components",
            descriptionKey: "sum_valid_and_invalid_votes",
            inputVariables: ["validVotes", "invalidVotes"],
            outputVariable: "totalVotes",
            equation: "totalVotes = validVotes + invalidVotes",
          }),
          finalStep(["totalVotes", "answer"]),
        ]),
      ],
    }),
  };
}

function turnoutMargin(ctx: BuildContext): TopologyBuildResult {
  const { winnerPercent, loserPercent, gapPercent } = electionPercents(ctx);
  const registeredVoters = totalBase(ctx, 80);
  const turnoutPercent = [60, 80][ctx.serial % 2]!;
  const votedVotes = percentageOf(registeredVoters, turnoutPercent);
  const invalidPercent = [10, 20][ctx.serial % 2]!;
  const validPercent = sanitizeValue(100 - invalidPercent);
  const validVotes = percentageOf(votedVotes, validPercent);
  const margin = cleanMargin(validVotes, gapPercent);
  const chain = filteringChain(
    "registered_to_valid_votes",
    "registeredVoters",
    "validVotes",
    [
      {
        stageId: "apply_turnout",
        kind: "percentage_filter",
        inputVariable: "registeredVoters",
        outputVariable: "votedVotes",
        percentVariable: "turnoutPercent",
        equation: "votedVotes = {registeredVoters} * {turnoutPercent} / 100",
        hidden: true,
      },
      {
        stageId: "remove_invalid_votes",
        kind: "remaining_percentage",
        inputVariable: "votedVotes",
        outputVariable: "validVotes",
        percentVariable: "validPercent",
        equation: "validVotes = votedVotes * {validPercent} / 100",
        hidden: true,
      },
    ],
  );
  const metadata = topology(
    "successive_filtering",
    "turnout_margin",
    [
      {
        misconception: "forgetting_filtering_stage",
        value: reversePercentage(margin, gapPercent),
      },
      {
        misconception: "ignoring_invalid_votes",
        value: reversePercentage(
          reversePercentage(margin, gapPercent),
          turnoutPercent,
        ),
      },
      {
        misconception: "using_wrong_denominator",
        value: reversePercentage(margin, winnerPercent),
      },
    ],
    {
      filteringChain: chain,
      hiddenBase: {
        baseVariable: "registeredVoters",
        knownVariable: "votedVotes",
        percentVariable: "turnoutPercent",
      },
      conservationGroups: [
        {
          groupId: "valid_invalid_vote_share",
          totalPercent: 100,
          partVariables: ["invalidPercent", "validPercent"],
        },
        {
          groupId: "two_candidate_valid_share",
          totalPercent: 100,
          partVariables: ["winnerPercent", "loserPercent"],
        },
      ],
    },
  );
  const canonical = problem({
    id: "election_margin",
    category: "election",
    subtype: "election_margin",
    reasoningPattern: "margin_mapping",
    variables: {
      registeredVoters,
      turnoutPercent,
      votedVotes,
      invalidPercent,
      validPercent,
      validVotes,
      winnerPercent,
      loserPercent,
      gapPercent,
      margin,
    },
    answer: registeredVoters,
    traps: [
      "forgetting_filtering_stage",
      "ignoring_invalid_votes",
      "wrong_denominator",
    ],
    difficulty: "hard",
    topology: metadata,
  });
  const steps = [
    step({
      id: "derive_valid_vote_gap",
      type: "derive_percentage_gap",
      descriptionKey: "derive_valid_vote_gap",
      inputVariables: ["winnerPercent", "loserPercent"],
      outputVariable: "gapPercent",
      equation: "gapPercent = {winnerPercent} - {loserPercent}",
      trapWarning: "margin_confusion",
    }),
    step({
      id: "reconstruct_valid_votes",
      type: "reverse_calculation",
      descriptionKey: "reconstruct_valid_votes_from_margin",
      inputVariables: ["margin", "gapPercent"],
      outputVariable: "validVotes",
      equation: "validVotes = {margin} * 100 / gapPercent",
    }),
    step({
      id: "reconstruct_voted_votes",
      type: "reconstruct_component",
      descriptionKey: "reconstruct_voted_votes_before_invalid_filter",
      inputVariables: ["validVotes", "validPercent"],
      outputVariable: "votedVotes",
      equation: "votedVotes = validVotes * 100 / {validPercent}",
      trapWarning: "ignoring_invalid_votes",
    }),
    step({
      id: "reconstruct_registered_voters",
      type: "reconstruct_component",
      descriptionKey: "reconstruct_registered_voters_before_turnout_filter",
      inputVariables: ["votedVotes", "turnoutPercent"],
      outputVariable: "registeredVoters",
      equation: "registeredVoters = votedVotes * 100 / {turnoutPercent}",
      trapWarning: "forgetting_filtering_stage",
    }),
    finalStep(["registeredVoters", "answer"]),
  ];

  return {
    problem: canonical,
    graph: graph({
      subtype: "election_margin",
      reasoningPattern: "margin_mapping",
      insightKey: "successive_filters_reconstruct_registered_base",
      steps,
      finalEquation: "answer = {registeredVoters}",
      trapSummary: canonical.traps.join("|"),
      branches: [
        branch("standard", "standard", steps),
        branch("effective_percentage", "proportional", [
          step({
            id: "derive_effective_gap_percent",
            type: "filter_subset",
            descriptionKey: "derive_gap_over_registered_voters",
            inputVariables: ["gapPercent", "turnoutPercent", "validPercent"],
            outputVariable: "effectiveGapPercent",
            equation:
              "effectiveGapPercent = {gapPercent} * {turnoutPercent} * {validPercent} / 10000",
          }),
          step({
            id: "map_effective_gap_to_registered",
            type: "map_percentage_to_value",
            descriptionKey: "map_effective_gap_to_registered_voters",
            inputVariables: ["margin", "effectiveGapPercent"],
            outputVariable: "registeredVoters",
            equation:
              "registeredVoters = {margin} * 100 / effectiveGapPercent",
          }),
          finalStep(["registeredVoters", "answer"]),
        ]),
      ],
    }),
  };
}

function multiCandidateMargin(ctx: BuildContext): TopologyBuildResult {
  const totalVotes = totalBase(ctx, 120);
  const winnerPercent = [45, 48, 50, 52][ctx.serial % 4]!;
  const thirdPercent = [12, 15, 18, 20][ctx.serial % 4]!;
  const runnerPercent = sanitizeValue(100 - winnerPercent - thirdPercent);
  const gapPercent = sanitizeValue(winnerPercent - runnerPercent);
  const margin = cleanMargin(totalVotes, gapPercent);
  const metadata = topology(
    "multi_entity_distribution",
    "multi_candidate_margin",
    [
      {
        misconception: "ignoring_remaining_component",
        value: reversePercentage(margin, winnerPercent - thirdPercent),
      },
      {
        misconception: "mapping_winner_percentage_directly",
        value: reversePercentage(margin, winnerPercent),
      },
      {
        misconception: "ratio_confusion",
        value: sanitizeValue(margin * runnerPercent),
      },
    ],
    {
      conservationGroups: [
        {
          groupId: "three_candidate_vote_share",
          totalPercent: 100,
          partVariables: ["winnerPercent", "runnerPercent", "thirdPercent"],
        },
      ],
      remainingComponent: {
        remainingVariable: "runnerPercent",
        totalPercent: 100,
        knownPercentVariables: ["winnerPercent", "thirdPercent"],
      },
    },
  );
  const canonical = problem({
    id: "election_margin",
    category: "election",
    subtype: "election_margin",
    reasoningPattern: "margin_mapping",
    variables: {
      totalVotes,
      winnerPercent,
      runnerPercent,
      thirdPercent,
      gapPercent,
      margin,
    },
    answer: totalVotes,
    traps: [
      "ignoring_remaining_component",
      "direct_percentage_mapping",
      "ratio_confusion",
    ],
    difficulty: "medium",
    topology: metadata,
  });
  const steps = [
    step({
      id: "derive_runner_percent",
      type: "derive_remaining_component",
      descriptionKey: "derive_runner_share_from_remaining_distribution",
      inputVariables: ["winnerPercent", "thirdPercent"],
      outputVariable: "runnerPercent",
      equation: "runnerPercent = 100 - {winnerPercent} - {thirdPercent}",
      trapWarning: "ignoring_remaining_component",
    }),
    step({
      id: "derive_winner_runner_gap",
      type: "derive_percentage_gap",
      descriptionKey: "derive_winner_runner_gap",
      inputVariables: ["winnerPercent", "runnerPercent"],
      outputVariable: "gapPercent",
      equation: "gapPercent = {winnerPercent} - runnerPercent",
    }),
    step({
      id: "map_gap_to_total",
      type: "map_percentage_to_value",
      descriptionKey: "map_difference_to_total",
      inputVariables: ["margin", "gapPercent"],
      outputVariable: "totalVotes",
      equation: "totalVotes = {margin} * 100 / gapPercent",
    }),
    finalStep(["totalVotes", "answer"]),
  ];

  return {
    problem: canonical,
    graph: graph({
      subtype: "election_margin",
      reasoningPattern: "margin_mapping",
      insightKey: "remaining_candidate_share_changes_margin_gap",
      steps,
      finalEquation: "answer = {totalVotes}",
      trapSummary: canonical.traps.join("|"),
      branches: [
        branch("standard", "standard", steps),
        branch("component_votes", "proportional", [
          step({
            id: "runner_percent",
            type: "derive_remaining_component",
            descriptionKey: "derive_runner_share_from_remaining_distribution",
            inputVariables: ["winnerPercent", "thirdPercent"],
            outputVariable: "runnerPercent",
            equation: "runnerPercent = 100 - {winnerPercent} - {thirdPercent}",
          }),
          step({
            id: "one_percent_votes",
            type: "map_percentage_to_value",
            descriptionKey: "derive_one_percent_votes",
            inputVariables: ["margin", "winnerPercent", "runnerPercent"],
            outputVariable: "onePercentVotes",
            equation:
              "onePercentVotes = {margin} / ({winnerPercent} - runnerPercent)",
          }),
          step({
            id: "scale_total_votes",
            type: "map_percentage_to_value",
            descriptionKey: "scale_one_percent_to_total",
            inputVariables: ["onePercentVotes"],
            outputVariable: "totalVotes",
            equation: "totalVotes = onePercentVotes * 100",
          }),
          finalStep(["totalVotes", "answer"]),
        ]),
      ],
    }),
  };
}

function remainingVoteMargin(ctx: BuildContext): TopologyBuildResult {
  const totalVotes = totalBase(ctx, 160);
  const winnerPercent = [54, 56, 58, 60][ctx.serial % 4]!;
  const knownOtherPercent = [12, 16, 20, 24][ctx.serial % 4]!;
  const remainingPercent = sanitizeValue(
    100 - winnerPercent - knownOtherPercent,
  );
  const gapPercent = sanitizeValue(winnerPercent - remainingPercent);
  const margin = cleanMargin(totalVotes, gapPercent);
  const metadata = topology(
    "remaining_component",
    "remaining_vote_margin",
    [
      {
        misconception: "ignoring_remaining_component",
        value: reversePercentage(margin, winnerPercent - knownOtherPercent),
      },
      {
        misconception: "mapping_winner_percentage_directly",
        value: reversePercentage(margin, winnerPercent),
      },
      {
        misconception: "using_wrong_denominator",
        value: reversePercentage(margin, remainingPercent),
      },
    ],
    {
      conservationGroups: [
        {
          groupId: "remaining_candidate_vote_share",
          totalPercent: 100,
          partVariables: [
            "winnerPercent",
            "knownOtherPercent",
            "remainingPercent",
          ],
        },
      ],
      remainingComponent: {
        remainingVariable: "remainingPercent",
        totalPercent: 100,
        knownPercentVariables: ["winnerPercent", "knownOtherPercent"],
      },
    },
  );
  const canonical = problem({
    id: "election_margin",
    category: "election",
    subtype: "election_margin",
    reasoningPattern: "margin_mapping",
    variables: {
      totalVotes,
      winnerPercent,
      knownOtherPercent,
      remainingPercent,
      gapPercent,
      margin,
    },
    answer: totalVotes,
    traps: [
      "ignoring_remaining_component",
      "direct_percentage_mapping",
      "wrong_denominator",
    ],
    difficulty: "medium",
    topology: metadata,
  });
  const steps = [
    step({
      id: "derive_remaining_percent",
      type: "derive_remaining_component",
      descriptionKey: "derive_unstated_candidate_share",
      inputVariables: ["winnerPercent", "knownOtherPercent"],
      outputVariable: "remainingPercent",
      equation: "remainingPercent = 100 - {winnerPercent} - {knownOtherPercent}",
      trapWarning: "ignoring_remaining_component",
    }),
    step({
      id: "derive_gap_against_remaining",
      type: "derive_percentage_gap",
      descriptionKey: "derive_gap_against_remaining_candidate",
      inputVariables: ["winnerPercent", "remainingPercent"],
      outputVariable: "gapPercent",
      equation: "gapPercent = {winnerPercent} - remainingPercent",
    }),
    step({
      id: "map_gap_to_total",
      type: "map_percentage_to_value",
      descriptionKey: "map_difference_to_total",
      inputVariables: ["margin", "gapPercent"],
      outputVariable: "totalVotes",
      equation: "totalVotes = {margin} * 100 / gapPercent",
    }),
    finalStep(["totalVotes", "answer"]),
  ];

  return {
    problem: canonical,
    graph: graph({
      subtype: "election_margin",
      reasoningPattern: "margin_mapping",
      insightKey: "remaining_vote_share_must_be_reconstructed",
      steps,
      finalEquation: "answer = {totalVotes}",
      trapSummary: canonical.traps.join("|"),
    }),
  };
}

function filteredValidVoteMargin(ctx: BuildContext): TopologyBuildResult {
  const winnerPercent = [55, 60, 65, 70][ctx.serial % 4]!;
  const loserPercent = sanitizeValue(100 - winnerPercent);
  const gapPercent = sanitizeValue(winnerPercent - loserPercent);
  const registeredVoters = totalBase(ctx, 200);
  const turnoutPercent = [60, 75, 80][ctx.serial % 3]!;
  const votedVotes = percentageOf(registeredVoters, turnoutPercent);
  const validPercent = 80;
  const invalidPercent = sanitizeValue(100 - validPercent);
  const validVotes = percentageOf(votedVotes, validPercent);
  const winnerVotes = percentageOf(validVotes, winnerPercent);
  const margin = cleanMargin(validVotes, gapPercent);
  const chain = filteringChain(
    "registered_to_winner_votes",
    "registeredVoters",
    "winnerVotes",
    [
      {
        stageId: "apply_turnout",
        kind: "percentage_filter",
        inputVariable: "registeredVoters",
        outputVariable: "votedVotes",
        percentVariable: "turnoutPercent",
        equation: "votedVotes = {registeredVoters} * {turnoutPercent} / 100",
      },
      {
        stageId: "keep_valid_votes",
        kind: "percentage_filter",
        inputVariable: "votedVotes",
        outputVariable: "validVotes",
        percentVariable: "validPercent",
        equation: "validVotes = votedVotes * {validPercent} / 100",
      },
      {
        stageId: "map_winner_votes",
        kind: "percentage_filter",
        inputVariable: "validVotes",
        outputVariable: "winnerVotes",
        percentVariable: "winnerPercent",
        equation: "winnerVotes = validVotes * {winnerPercent} / 100",
      },
    ],
  );
  const metadata = topology(
    "effective_percentage",
    "filtered_valid_vote_margin",
    [
      {
        misconception: "using_stated_base_as_effective_base",
        value: percentageOf(registeredVoters, winnerPercent),
      },
      {
        misconception: "forgetting_filtering_stage",
        value: percentageOf(votedVotes, winnerPercent),
      },
      {
        misconception: "ignoring_invalid_votes",
        value: percentageOf(votedVotes, winnerPercent),
      },
    ],
    {
      filteringChain: chain,
      conservationGroups: [
        {
          groupId: "valid_invalid_vote_share",
          totalPercent: 100,
          partVariables: ["invalidPercent", "validPercent"],
        },
        {
          groupId: "two_candidate_valid_share",
          totalPercent: 100,
          partVariables: ["winnerPercent", "loserPercent"],
        },
      ],
      multiEntity: {
        totalVariable: "validVotes",
        componentVariables: ["winnerVotes", "loserVotes"],
      },
    },
  );
  const loserVotes = percentageOf(validVotes, loserPercent);
  const canonical = problem({
    id: "election_margin",
    category: "election",
    subtype: "election_margin",
    reasoningPattern: "margin_mapping",
    variables: {
      registeredVoters,
      turnoutPercent,
      votedVotes,
      invalidPercent,
      validPercent,
      validVotes,
      winnerPercent,
      loserPercent,
      loserVotes,
      winnerVotes,
      gapPercent,
      margin,
    },
    answer: winnerVotes,
    traps: [
      "wrong_base",
      "forgetting_filtering_stage",
      "ignoring_invalid_votes",
    ],
    difficulty: "hard",
    topology: metadata,
  });
  const steps = [
    step({
      id: "reconstruct_valid_votes",
      type: "reverse_calculation",
      descriptionKey: "reconstruct_valid_votes_from_margin",
      inputVariables: ["margin", "gapPercent"],
      outputVariable: "validVotes",
      equation: "validVotes = {margin} * 100 / {gapPercent}",
    }),
    step({
      id: "map_valid_votes_to_winner",
      type: "map_percentage_to_value",
      descriptionKey: "map_valid_votes_to_winner_votes",
      inputVariables: ["validVotes", "winnerPercent"],
      outputVariable: "winnerVotes",
      equation: "winnerVotes = validVotes * {winnerPercent} / 100",
      trapWarning: "wrong_base",
    }),
    finalStep(["winnerVotes", "answer"]),
  ];

  return {
    problem: canonical,
    graph: graph({
      subtype: "election_margin",
      reasoningPattern: "margin_mapping",
      insightKey: "target_component_lives_after_filter_chain",
      steps,
      finalEquation: "answer = {winnerVotes}",
      trapSummary: canonical.traps.join("|"),
      branches: [
        branch("standard", "standard", steps),
        branch("registered_effective_share", "proportional", [
          step({
            id: "derive_effective_winner_percent",
            type: "filter_subset",
            descriptionKey: "derive_winner_share_of_registered_voters",
            inputVariables: ["turnoutPercent", "validPercent", "winnerPercent"],
            outputVariable: "effectiveWinnerPercent",
            equation:
              "effectiveWinnerPercent = {turnoutPercent} * {validPercent} * {winnerPercent} / 10000",
          }),
          step({
            id: "map_registered_to_winner_votes",
            type: "map_percentage_to_value",
            descriptionKey: "map_registered_voters_to_winner_votes",
            inputVariables: ["registeredVoters", "effectiveWinnerPercent"],
            outputVariable: "winnerVotes",
            equation:
              "winnerVotes = {registeredVoters} * effectiveWinnerPercent / 100",
          }),
          finalStep(["winnerVotes", "answer"]),
        ]),
      ],
    }),
  };
}

function simpleShortfall(ctx: BuildContext): TopologyBuildResult {
  const totalMarks = humanizedExamTotal(ctx.serial);
  const scoredPercent = [30, 35, 40, 45][ctx.serial % 4]!;
  const gapPercent = [5, 10, 15, 20][ctx.serial % 4]!;
  const passPercent = scoredPercent + gapPercent;
  const shortBy = percentageOf(totalMarks, gapPercent);
  const metadata = topology(
    "direct_mapping",
    "simple_shortfall",
    [
      {
        misconception: "mapping_winner_percentage_directly",
        value: reversePercentage(shortBy, passPercent),
      },
      {
        misconception: "using_wrong_denominator",
        value: reversePercentage(shortBy, scoredPercent),
      },
      {
        misconception: "ratio_confusion",
        value: sanitizeValue(shortBy * gapPercent),
      },
    ],
  );
  const canonical = problem({
    id: "pass_fail",
    category: "comparison",
    subtype: "pass_fail",
    reasoningPattern: "difference_mapping",
    variables: {
      totalMarks,
      scoredPercent,
      passPercent,
      gapPercent,
      shortBy,
    },
    answer: totalMarks,
    traps: ["margin_confusion", "wrong_denominator", "ratio_confusion"],
    difficulty: gapPercent <= 5 ? "medium" : "easy",
    topology: metadata,
  });
  const steps = [
    step({
      id: "derive_shortfall_percent",
      type: "derive_percentage_gap",
      descriptionKey: "derive_pass_mark_gap",
      inputVariables: ["passPercent", "scoredPercent"],
      outputVariable: "gapPercent",
      equation: "gapPercent = {passPercent} - {scoredPercent}",
    }),
    step({
      id: "map_shortfall_to_total",
      type: "map_percentage_to_value",
      descriptionKey: "map_shortfall_to_total_marks",
      inputVariables: ["shortBy", "gapPercent"],
      outputVariable: "totalMarks",
      equation: "totalMarks = {shortBy} * 100 / gapPercent",
    }),
    finalStep(["totalMarks", "answer"]),
  ];

  return {
    problem: canonical,
    graph: graph({
      subtype: "pass_fail",
      reasoningPattern: "difference_mapping",
      insightKey: "score_gap_maps_to_shortfall",
      steps,
      finalEquation: "answer = {totalMarks}",
      shortcutEquation: "{gapPercent}% = {shortBy}; 100% = {answer}",
      trapSummary: canonical.traps.join("|"),
    }),
  };
}

function passFailGap(ctx: BuildContext): TopologyBuildResult {
  const totalMarks = humanizedExamTotal(ctx.serial, 4);
  const scoredPercent = [30, 35, 40, 45][ctx.serial % 4]!;
  const highScorePercent = [60, 65, 70, 75][ctx.serial % 4]!;
  const passPercent = [45, 50, 55, 60][ctx.serial % 4]!;
  const shortBy = percentageOf(totalMarks, passPercent - scoredPercent);
  const excessBy = percentageOf(totalMarks, highScorePercent - passPercent);
  const combinedGapPercent = sanitizeValue(highScorePercent - scoredPercent);
  const combinedMarks = sanitizeValue(shortBy + excessBy);
  const metadata = topology(
    "hidden_total",
    "pass_fail_gap",
    [
      {
        misconception: "using_wrong_denominator",
        value: reversePercentage(combinedMarks, passPercent),
      },
      {
        misconception: "forgetting_filtering_stage",
        value: reversePercentage(shortBy, passPercent - scoredPercent),
      },
      {
        misconception: "ratio_confusion",
        value: sanitizeValue(combinedMarks * combinedGapPercent),
      },
    ],
  );
  const canonical = problem({
    id: "pass_fail",
    category: "comparison",
    subtype: "pass_fail",
    reasoningPattern: "difference_mapping",
    variables: {
      totalMarks,
      scoredPercent,
      highScorePercent,
      passPercent,
      shortBy,
      excessBy,
      combinedGapPercent,
      combinedMarks,
    },
    answer: totalMarks,
    traps: ["wrong_denominator", "forgetting_filtering_stage", "ratio_confusion"],
    difficulty: "medium",
    topology: metadata,
  });
  const steps = [
    step({
      id: "aggregate_mark_gap",
      type: "aggregate_components",
      descriptionKey: "combine_shortfall_and_excess_marks",
      inputVariables: ["shortBy", "excessBy"],
      outputVariable: "combinedMarks",
      equation: "combinedMarks = {shortBy} + {excessBy}",
    }),
    step({
      id: "derive_combined_percent_gap",
      type: "derive_percentage_gap",
      descriptionKey: "derive_gap_between_two_scores",
      inputVariables: ["highScorePercent", "scoredPercent"],
      outputVariable: "combinedGapPercent",
      equation: "combinedGapPercent = {highScorePercent} - {scoredPercent}",
    }),
    step({
      id: "map_combined_gap_to_total",
      type: "map_percentage_to_value",
      descriptionKey: "map_combined_gap_to_total_marks",
      inputVariables: ["combinedMarks", "combinedGapPercent"],
      outputVariable: "totalMarks",
      equation: "totalMarks = combinedMarks * 100 / combinedGapPercent",
    }),
    finalStep(["totalMarks", "answer"]),
  ];

  return {
    problem: canonical,
    graph: graph({
      subtype: "pass_fail",
      reasoningPattern: "difference_mapping",
      insightKey: "two_offsets_reveal_hidden_total_marks",
      steps,
      finalEquation: "answer = {totalMarks}",
      trapSummary: canonical.traps.join("|"),
      branches: [
        branch("standard", "standard", steps),
        branch("pass_mark_anchor", "reverse", [
          step({
            id: "derive_below_gap",
            type: "derive_percentage_gap",
            descriptionKey: "derive_pass_mark_gap",
            inputVariables: ["passPercent", "scoredPercent"],
            outputVariable: "belowGapPercent",
            equation: "belowGapPercent = {passPercent} - {scoredPercent}",
          }),
          step({
            id: "map_below_gap_to_total",
            type: "map_percentage_to_value",
            descriptionKey: "map_shortfall_to_total_marks",
            inputVariables: ["shortBy", "belowGapPercent"],
            outputVariable: "totalMarks",
            equation: "totalMarks = {shortBy} * 100 / belowGapPercent",
          }),
          finalStep(["totalMarks", "answer"]),
        ]),
      ],
    }),
  };
}

function successiveMarkAdjustment(ctx: BuildContext): TopologyBuildResult {
  const totalMarks = humanizedExamTotal(ctx.serial, 8);
  const rawPercent = [30, 35, 40, 45][ctx.serial % 4]!;
  const bonusPercent = [5, 10, 15, 20][ctx.serial % 4]!;
  const adjustedPercent = sanitizeValue(rawPercent + bonusPercent);
  const passPercent = adjustedPercent + [5, 10, 15][ctx.serial % 3]!;
  const gapPercent = sanitizeValue(passPercent - adjustedPercent);
  const shortBy = percentageOf(totalMarks, gapPercent);
  const metadata = topology(
    "base_shift",
    "successive_mark_adjustment",
    [
      {
        misconception: "forgetting_filtering_stage",
        value: reversePercentage(shortBy, passPercent - rawPercent),
      },
      {
        misconception: "additive_instead_of_multiplicative",
        value: sanitizeValue(shortBy * gapPercent),
      },
      {
        misconception: "using_wrong_denominator",
        value: reversePercentage(shortBy, passPercent),
      },
    ],
  );
  const canonical = problem({
    id: "pass_fail",
    category: "comparison",
    subtype: "pass_fail",
    reasoningPattern: "difference_mapping",
    variables: {
      totalMarks,
      rawPercent,
      bonusPercent,
      adjustedPercent,
      passPercent,
      gapPercent,
      shortBy,
    },
    answer: totalMarks,
    traps: [
      "forgetting_filtering_stage",
      "additive_instead_of_multiplicative",
      "wrong_denominator",
    ],
    difficulty: "medium",
    topology: metadata,
  });
  const steps = [
    step({
      id: "derive_adjusted_percent",
      type: "apply_multiplier",
      descriptionKey: "derive_adjusted_score_percent",
      inputVariables: ["rawPercent", "bonusPercent"],
      outputVariable: "adjustedPercent",
      equation: "adjustedPercent = {rawPercent} + {bonusPercent}",
      trapWarning: "forgetting_filtering_stage",
    }),
    step({
      id: "derive_adjusted_gap",
      type: "derive_percentage_gap",
      descriptionKey: "derive_pass_gap_after_adjustment",
      inputVariables: ["passPercent", "adjustedPercent"],
      outputVariable: "gapPercent",
      equation: "gapPercent = {passPercent} - adjustedPercent",
    }),
    step({
      id: "map_gap_to_total",
      type: "map_percentage_to_value",
      descriptionKey: "map_shortfall_to_total_marks",
      inputVariables: ["shortBy", "gapPercent"],
      outputVariable: "totalMarks",
      equation: "totalMarks = {shortBy} * 100 / gapPercent",
    }),
    finalStep(["totalMarks", "answer"]),
  ];

  return {
    problem: canonical,
    graph: graph({
      subtype: "pass_fail",
      reasoningPattern: "difference_mapping",
      insightKey: "score_adjustment_changes_shortfall_gap",
      steps,
      finalEquation: "answer = {totalMarks}",
      trapSummary: canonical.traps.join("|"),
    }),
  };
}

function remainingMarksRequired(ctx: BuildContext): TopologyBuildResult {
  const totalMarks = humanizedExamTotal(ctx.serial, 12);
  const completedPercent = [40, 50, 60, 75][ctx.serial % 4]!;
  const scoredOnCompletedPercent = [50, 60, 70, 80][ctx.serial % 4]!;
  const requiredOverallPercent = [55, 60, 65, 70][ctx.serial % 4]!;
  const completedMarks = percentageOf(totalMarks, completedPercent);
  const scoredMarks = percentageOf(completedMarks, scoredOnCompletedPercent);
  const requiredMarks = percentageOf(totalMarks, requiredOverallPercent);
  const remainingMarksRequired = sanitizeValue(requiredMarks - scoredMarks);
  const effectiveScoredPercent = sanitizeValue(
    (completedPercent * scoredOnCompletedPercent) / 100,
  );
  const gapPercent = sanitizeValue(
    requiredOverallPercent - effectiveScoredPercent,
  );
  const directCompletionGapPercent =
    Math.abs(requiredOverallPercent - scoredOnCompletedPercent) < 1
      ? requiredOverallPercent
      : requiredOverallPercent - scoredOnCompletedPercent;
  const additiveGapPercent =
    Math.abs(
      requiredOverallPercent - completedPercent - scoredOnCompletedPercent,
    ) < 1
      ? gapPercent + 5
      : Math.abs(
          requiredOverallPercent -
            completedPercent -
            scoredOnCompletedPercent,
        );
  const chain = filteringChain(
    "total_to_scored_marks",
    "totalMarks",
    "scoredMarks",
    [
      {
        stageId: "completed_marks",
        kind: "percentage_filter",
        inputVariable: "totalMarks",
        outputVariable: "completedMarks",
        percentVariable: "completedPercent",
        equation: "completedMarks = {totalMarks} * {completedPercent} / 100",
      },
      {
        stageId: "scored_completed_marks",
        kind: "percentage_filter",
        inputVariable: "completedMarks",
        outputVariable: "scoredMarks",
        percentVariable: "scoredOnCompletedPercent",
        equation:
          "scoredMarks = completedMarks * {scoredOnCompletedPercent} / 100",
      },
    ],
  );
  const metadata = topology(
    "successive_filtering",
    "remaining_marks_required",
    [
      {
        misconception: "forgetting_filtering_stage",
        value: reversePercentage(
          remainingMarksRequired,
          Math.abs(directCompletionGapPercent),
        ),
      },
      {
        misconception: "using_wrong_denominator",
        value: reversePercentage(remainingMarksRequired, requiredOverallPercent),
      },
      {
        misconception: "additive_instead_of_multiplicative",
        value: reversePercentage(
          remainingMarksRequired,
          additiveGapPercent,
        ),
      },
    ],
    {
      filteringChain: chain,
      hiddenBase: {
        baseVariable: "totalMarks",
        knownVariable: "remainingMarksRequired",
        percentVariable: "gapPercent",
      },
    },
  );
  const canonical = problem({
    id: "pass_fail",
    category: "comparison",
    subtype: "pass_fail",
    reasoningPattern: "difference_mapping",
    variables: {
      totalMarks,
      completedPercent,
      scoredOnCompletedPercent,
      completedMarks,
      scoredMarks,
      requiredOverallPercent,
      requiredMarks,
      remainingMarksRequired,
      effectiveScoredPercent,
      gapPercent,
    },
    answer: totalMarks,
    traps: [
      "forgetting_filtering_stage",
      "wrong_denominator",
      "additive_instead_of_multiplicative",
    ],
    difficulty: "hard",
    topology: metadata,
  });
  const steps = [
    step({
      id: "derive_effective_scored_percent",
      type: "filter_subset",
      descriptionKey: "derive_scored_percent_over_total_marks",
      inputVariables: ["completedPercent", "scoredOnCompletedPercent"],
      outputVariable: "effectiveScoredPercent",
      equation:
        "effectiveScoredPercent = {completedPercent} * {scoredOnCompletedPercent} / 100",
      trapWarning: "additive_instead_of_multiplicative",
    }),
    step({
      id: "derive_remaining_required_gap",
      type: "derive_percentage_gap",
      descriptionKey: "derive_remaining_required_percent_gap",
      inputVariables: ["requiredOverallPercent", "effectiveScoredPercent"],
      outputVariable: "gapPercent",
      equation: "gapPercent = {requiredOverallPercent} - effectiveScoredPercent",
    }),
    step({
      id: "map_remaining_marks_to_total",
      type: "map_percentage_to_value",
      descriptionKey: "map_remaining_marks_required_to_total",
      inputVariables: ["remainingMarksRequired", "gapPercent"],
      outputVariable: "totalMarks",
      equation: "totalMarks = {remainingMarksRequired} * 100 / gapPercent",
    }),
    finalStep(["totalMarks", "answer"]),
  ];

  return {
    problem: canonical,
    graph: graph({
      subtype: "pass_fail",
      reasoningPattern: "difference_mapping",
      insightKey: "remaining_requirement_depends_on_effective_scored_share",
      steps,
      finalEquation: "answer = {totalMarks}",
      trapSummary: canonical.traps.join("|"),
      branches: [
        branch("standard", "standard", steps),
        branch("unitary_gap", "unitary", [
          step({
            id: "derive_effective_scored_percent",
            type: "filter_subset",
            descriptionKey: "derive_scored_percent_over_total_marks",
            inputVariables: ["completedPercent", "scoredOnCompletedPercent"],
            outputVariable: "effectiveScoredPercent",
            equation:
              "effectiveScoredPercent = {completedPercent} * {scoredOnCompletedPercent} / 100",
          }),
          step({
            id: "derive_remaining_required_gap",
            type: "derive_percentage_gap",
            descriptionKey: "derive_remaining_required_percent_gap",
            inputVariables: ["requiredOverallPercent", "effectiveScoredPercent"],
            outputVariable: "gapPercent",
            equation: "gapPercent = {requiredOverallPercent} - effectiveScoredPercent",
          }),
          step({
            id: "one_percent_marks",
            type: "map_percentage_to_value",
            descriptionKey: "derive_one_percent_marks",
            inputVariables: ["remainingMarksRequired", "gapPercent"],
            outputVariable: "onePercentMarks",
            equation: "onePercentMarks = {remainingMarksRequired} / gapPercent",
          }),
          step({
            id: "scale_total_marks",
            type: "map_percentage_to_value",
            descriptionKey: "scale_one_percent_to_total_marks",
            inputVariables: ["onePercentMarks"],
            outputVariable: "totalMarks",
            equation: "totalMarks = onePercentMarks * 100",
          }),
          finalStep(["totalMarks", "answer"]),
        ]),
      ],
    }),
  };
}

function singleGrowth(ctx: BuildContext): TopologyBuildResult {
  const population = humanizedPopulationTotal(ctx.serial);
  const rate = [10, 20][ctx.serial % 2]!;
  const years = 2;
  const projectedPopulation = sanitizeValue(
    population * (1 + rate / 100) ** years,
  );
  const metadata = topology(
    "direct_mapping",
    "single_growth",
    [
      {
        misconception: "additive_instead_of_multiplicative",
        value: sanitizeValue(population * (1 + (rate * years) / 100)),
      },
      {
        misconception: "using_wrong_denominator",
        value: applyPercentage(population, rate),
      },
      {
        misconception: "ratio_confusion",
        value: sanitizeValue(population + rate * years),
      },
    ],
  );
  const canonical = problem({
    id: "population_growth",
    category: "population",
    subtype: "population_growth",
    reasoningPattern: "population_projection",
    variables: {
      population,
      rate,
      years,
      projectedPopulation,
    },
    answer: projectedPopulation,
    traps: ["additive_instead_of_multiplicative", "wrong_base"],
    difficulty: rate >= 20 ? "medium" : "easy",
    topology: metadata,
  });
  const steps = [
    step({
      id: "growth_multiplier",
      type: "apply_multiplier",
      descriptionKey: "convert_growth_rate_to_multiplier",
      inputVariables: ["rate"],
      outputVariable: "growthMultiplier",
      equation: "growthMultiplier = (100 + {rate}) / 100",
    }),
    step({
      id: "project_population",
      type: "population_projection",
      descriptionKey: "project_population_across_years",
      inputVariables: ["population", "growthMultiplier", "years"],
      outputVariable: "projectedPopulation",
      equation: "projectedPopulation = {population} * growthMultiplier ^ {years}",
      trapWarning: "additive_instead_of_multiplicative",
    }),
    finalStep(["projectedPopulation", "answer"]),
  ];

  return {
    problem: canonical,
    graph: graph({
      subtype: "population_growth",
      reasoningPattern: "population_projection",
      insightKey: "population_projects_by_compound_multiplier",
      steps,
      finalEquation: "answer = {projectedPopulation}",
      trapSummary: canonical.traps.join("|"),
    }),
  };
}

function growthThenDecay(ctx: BuildContext): TopologyBuildResult {
  const population = humanizedPopulationTotal(ctx.serial, 4);
  const growthRate = [10, 20, 25, 40][ctx.serial % 4]!;
  const decayRate = [5, 10, 20, 25][ctx.serial % 4]!;
  const afterGrowth = applyPercentage(population, growthRate);
  const finalPopulation = applyPercentage(afterGrowth, -decayRate);
  const metadata = topology(
    "base_shift",
    "growth_then_decay",
    [
      {
        misconception: "additive_instead_of_multiplicative",
        value: sanitizeValue(population * (1 + (growthRate - decayRate) / 100)),
      },
      {
        misconception: "using_wrong_denominator",
        value: applyPercentage(population, -decayRate),
      },
      {
        misconception: "forgetting_filtering_stage",
        value: afterGrowth,
      },
    ],
  );
  const canonical = problem({
    id: "population_growth",
    category: "population",
    subtype: "population_growth",
    reasoningPattern: "population_projection",
    variables: {
      population,
      growthRate,
      decayRate,
      afterGrowth,
      finalPopulation,
    },
    answer: finalPopulation,
    traps: [
      "additive_instead_of_multiplicative",
      "wrong_base",
      "forgetting_filtering_stage",
    ],
    difficulty: "medium",
    topology: metadata,
  });
  const steps = [
    step({
      id: "apply_growth",
      type: "apply_multiplier",
      descriptionKey: "apply_growth_rate",
      inputVariables: ["population", "growthRate"],
      outputVariable: "afterGrowth",
      equation: "afterGrowth = {population} * (100 + {growthRate}) / 100",
    }),
    step({
      id: "apply_decay_on_shifted_base",
      type: "apply_multiplier",
      descriptionKey: "apply_decay_to_updated_population",
      inputVariables: ["afterGrowth", "decayRate"],
      outputVariable: "finalPopulation",
      equation: "finalPopulation = afterGrowth * (100 - {decayRate}) / 100",
      trapWarning: "wrong_base",
    }),
    finalStep(["finalPopulation", "answer"]),
  ];

  return {
    problem: canonical,
    graph: graph({
      subtype: "population_growth",
      reasoningPattern: "population_projection",
      insightKey: "decay_uses_population_after_growth",
      steps,
      finalEquation: "answer = {finalPopulation}",
      trapSummary: canonical.traps.join("|"),
      branches: [
        branch("standard", "standard", steps),
        branch("net_multiplier", "shortcut", [
          step({
            id: "derive_net_multiplier",
            type: "apply_multiplier",
            descriptionKey: "derive_successive_population_multiplier",
            inputVariables: ["growthRate", "decayRate"],
            outputVariable: "netMultiplier",
            equation:
              "netMultiplier = (100 + {growthRate}) * (100 - {decayRate}) / 10000",
          }),
          step({
            id: "apply_net_multiplier",
            type: "population_projection",
            descriptionKey: "apply_net_multiplier_to_population",
            inputVariables: ["population", "netMultiplier"],
            outputVariable: "finalPopulation",
            equation: "finalPopulation = {population} * netMultiplier",
          }),
          finalStep(["finalPopulation", "answer"]),
        ]),
      ],
    }),
  };
}

function migrationAdjustedPopulation(ctx: BuildContext): TopologyBuildResult {
  const population = humanizedPopulationTotal(ctx.serial, 8);
  const growthRate = [5, 10, 15, 20][ctx.serial % 4]!;
  const migrationPercent = [2, 4, 5, 8][ctx.serial % 4]!;
  const afterGrowth = applyPercentage(population, growthRate);
  const migration = percentageOf(population, migrationPercent);
  const finalPopulation = sanitizeValue(afterGrowth + migration);
  const metadata = topology(
    "layered_population",
    "migration_adjusted_population",
    [
      {
        misconception: "using_wrong_denominator",
        value: sanitizeValue(afterGrowth + percentageOf(afterGrowth, migrationPercent)),
      },
      {
        misconception: "forgetting_filtering_stage",
        value: afterGrowth,
      },
      {
        misconception: "additive_instead_of_multiplicative",
        value: sanitizeValue(population * (1 + (growthRate + migrationPercent) / 100)),
      },
    ],
  );
  const canonical = problem({
    id: "population_growth",
    category: "population",
    subtype: "population_growth",
    reasoningPattern: "population_projection",
    variables: {
      population,
      growthRate,
      migrationPercent,
      afterGrowth,
      migration,
      finalPopulation,
    },
    answer: finalPopulation,
    traps: [
      "wrong_base",
      "forgetting_filtering_stage",
      "additive_instead_of_multiplicative",
    ],
    difficulty: "medium",
    topology: metadata,
  });
  const steps = [
    step({
      id: "apply_population_growth",
      type: "population_projection",
      descriptionKey: "apply_population_growth_rate",
      inputVariables: ["population", "growthRate"],
      outputVariable: "afterGrowth",
      equation: "afterGrowth = {population} * (100 + {growthRate}) / 100",
    }),
    step({
      id: "derive_migration_component",
      type: "map_percentage_to_value",
      descriptionKey: "derive_migration_component_from_original_population",
      inputVariables: ["population", "migrationPercent"],
      outputVariable: "migration",
      equation: "migration = {population} * {migrationPercent} / 100",
      trapWarning: "wrong_base",
    }),
    step({
      id: "aggregate_population",
      type: "aggregate_components",
      descriptionKey: "aggregate_growth_and_migration",
      inputVariables: ["afterGrowth", "migration"],
      outputVariable: "finalPopulation",
      equation: "finalPopulation = afterGrowth + migration",
    }),
    finalStep(["finalPopulation", "answer"]),
  ];

  return {
    problem: canonical,
    graph: graph({
      subtype: "population_growth",
      reasoningPattern: "population_projection",
      insightKey: "migration_component_uses_original_population_base",
      steps,
      finalEquation: "answer = {finalPopulation}",
      trapSummary: canonical.traps.join("|"),
    }),
  };
}

function maleFemalePopulationShift(ctx: BuildContext): TopologyBuildResult {
  const totalPopulation = humanizedPopulationTotal(ctx.serial, 12);
  const malePercent = [45, 50, 55, 60][ctx.serial % 4]!;
  const femalePercent = sanitizeValue(100 - malePercent);
  const maleGrowthRate = [10, 20, 25, 40][ctx.serial % 4]!;
  const femaleDecayRate = [5, 10, 15, 20][ctx.serial % 4]!;
  const malePopulation = percentageOf(totalPopulation, malePercent);
  const femalePopulation = percentageOf(totalPopulation, femalePercent);
  const shiftedMalePopulation = applyPercentage(malePopulation, maleGrowthRate);
  const shiftedFemalePopulation = applyPercentage(
    femalePopulation,
    -femaleDecayRate,
  );
  const finalPopulation = sanitizeValue(
    shiftedMalePopulation + shiftedFemalePopulation,
  );
  const metadata = topology(
    "layered_population",
    "male_female_population_shift",
    [
      {
        misconception: "additive_instead_of_multiplicative",
        value: sanitizeValue(
          totalPopulation *
            (1 + (maleGrowthRate - femaleDecayRate) / 100),
        ),
      },
      {
        misconception: "using_wrong_denominator",
        value: sanitizeValue(
          applyPercentage(totalPopulation, maleGrowthRate) -
            percentageOf(totalPopulation, femaleDecayRate),
        ),
      },
      {
        misconception: "ignoring_remaining_component",
        value: shiftedMalePopulation,
      },
    ],
    {
      conservationGroups: [
        {
          groupId: "gender_population_share",
          totalPercent: 100,
          partVariables: ["malePercent", "femalePercent"],
        },
      ],
      multiEntity: {
        totalVariable: "totalPopulation",
        componentVariables: ["malePopulation", "femalePopulation"],
      },
    },
  );
  const canonical = problem({
    id: "population_growth",
    category: "population",
    subtype: "population_growth",
    reasoningPattern: "population_projection",
    variables: {
      totalPopulation,
      malePercent,
      femalePercent,
      malePopulation,
      femalePopulation,
      maleGrowthRate,
      femaleDecayRate,
      shiftedMalePopulation,
      shiftedFemalePopulation,
      finalPopulation,
    },
    answer: finalPopulation,
    traps: [
      "additive_instead_of_multiplicative",
      "wrong_base",
      "ignoring_remaining_component",
    ],
    difficulty: "hard",
    topology: metadata,
  });
  const steps = [
    step({
      id: "derive_male_population",
      type: "map_percentage_to_value",
      descriptionKey: "derive_male_population_component",
      inputVariables: ["totalPopulation", "malePercent"],
      outputVariable: "malePopulation",
      equation: "malePopulation = {totalPopulation} * {malePercent} / 100",
    }),
    step({
      id: "derive_female_population",
      type: "derive_remaining_component",
      descriptionKey: "derive_female_population_component",
      inputVariables: ["totalPopulation", "malePopulation"],
      outputVariable: "femalePopulation",
      equation: "femalePopulation = {totalPopulation} - malePopulation",
    }),
    step({
      id: "shift_male_population",
      type: "apply_multiplier",
      descriptionKey: "apply_male_population_growth",
      inputVariables: ["malePopulation", "maleGrowthRate"],
      outputVariable: "shiftedMalePopulation",
      equation:
        "shiftedMalePopulation = malePopulation * (100 + {maleGrowthRate}) / 100",
    }),
    step({
      id: "shift_female_population",
      type: "apply_multiplier",
      descriptionKey: "apply_female_population_decay",
      inputVariables: ["femalePopulation", "femaleDecayRate"],
      outputVariable: "shiftedFemalePopulation",
      equation:
        "shiftedFemalePopulation = femalePopulation * (100 - {femaleDecayRate}) / 100",
    }),
    step({
      id: "aggregate_shifted_population",
      type: "aggregate_components",
      descriptionKey: "aggregate_shifted_population_components",
      inputVariables: ["shiftedMalePopulation", "shiftedFemalePopulation"],
      outputVariable: "finalPopulation",
      equation:
        "finalPopulation = shiftedMalePopulation + shiftedFemalePopulation",
      trapWarning: "additive_instead_of_multiplicative",
    }),
    finalStep(["finalPopulation", "answer"]),
  ];

  return {
    problem: canonical,
    graph: graph({
      subtype: "population_growth",
      reasoningPattern: "population_projection",
      insightKey: "population_components_shift_on_their_own_bases",
      steps,
      finalEquation: "answer = {finalPopulation}",
      trapSummary: canonical.traps.join("|"),
      branches: [
        branch("standard", "standard", steps),
        branch("weighted_effective_rate", "shortcut", [
          step({
            id: "derive_weighted_change",
            type: "aggregate_components",
            descriptionKey: "derive_weighted_population_change_rate",
            inputVariables: [
              "malePercent",
              "maleGrowthRate",
              "femalePercent",
              "femaleDecayRate",
            ],
            outputVariable: "weightedChangePercent",
            equation:
              "weightedChangePercent = ({malePercent} * {maleGrowthRate} - {femalePercent} * {femaleDecayRate}) / 100",
          }),
          step({
            id: "apply_weighted_change",
            type: "population_projection",
            descriptionKey: "apply_weighted_change_to_total_population",
            inputVariables: ["totalPopulation", "weightedChangePercent"],
            outputVariable: "finalPopulation",
            equation:
              "finalPopulation = {totalPopulation} * (100 + weightedChangePercent) / 100",
          }),
          finalStep(["finalPopulation", "answer"]),
        ]),
      ],
    }),
  };
}

const ELECTION_BUILDERS = {
  direct_margin: directMargin,
  invalid_vote_margin: invalidVoteMargin,
  turnout_margin: turnoutMargin,
  multi_candidate_margin: multiCandidateMargin,
  remaining_vote_margin: remainingVoteMargin,
  filtered_valid_vote_margin: filteredValidVoteMargin,
} satisfies Record<ElectionTopology, (ctx: BuildContext) => TopologyBuildResult>;

const PASS_FAIL_BUILDERS = {
  simple_shortfall: simpleShortfall,
  pass_fail_gap: passFailGap,
  successive_mark_adjustment: successiveMarkAdjustment,
  remaining_marks_required: remainingMarksRequired,
} satisfies Record<PassFailTopology, (ctx: BuildContext) => TopologyBuildResult>;

const POPULATION_BUILDERS = {
  single_growth: singleGrowth,
  growth_then_decay: growthThenDecay,
  migration_adjusted_population: migrationAdjustedPopulation,
  male_female_population_shift: maleFemalePopulationShift,
} satisfies Record<PopulationTopology, (ctx: BuildContext) => TopologyBuildResult>;

export const TOPOLOGY_BUILDERS = {
  ...ELECTION_BUILDERS,
  ...PASS_FAIL_BUILDERS,
  ...POPULATION_BUILDERS,
} satisfies Partial<Record<TopologyVariant, (ctx: BuildContext) => TopologyBuildResult>>;

export function buildTopologyVariant(
  variant: TopologyVariant,
  seed?: number | string,
): TopologyBuildResult {
  const builder = TOPOLOGY_BUILDERS[variant];
  if (!builder) {
    throw new Error(`No topology builder registered for variant: ${variant}.`);
  }
  return builder(context(seed));
}

export function buildTopologyReasoningGraph(
  problem: CanonicalPercentageProblem,
): ReasoningGraph {
  const variant = problem.topology?.variant;
  if (!variant) {
    throw new Error("Cannot build topology graph without topology metadata.");
  }

  return buildTopologyVariant(
    variant,
    `${problem.id}:${variant}:${JSON.stringify(problem.variables)}`,
  ).graph;
}
