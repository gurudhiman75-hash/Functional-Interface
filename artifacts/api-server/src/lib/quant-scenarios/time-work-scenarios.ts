import type {
  DifficultyLabel,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import type {
  QuantScenarioContext,
} from "../quant/realization";
import type { ReasoningStep } from "../shared";
import {
  createReasoningStep,
  pickRandomItem,
} from "../shared";

export type QuantProceduralScenario = {
  scenarioType: string;
  topicCluster: "time-work";
  values: Record<string, number>;
  text: string;
  correctAnswer: number;
  reasoningSteps: ReasoningStep[];
  explanation?: string;
  distractorHints?: string[];
  context?: QuantScenarioContext;
};

type TimeWorkScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

type PairCandidate = {
  a: number;
  b: number;
};

const TIME_PAIR_CANDIDATES: Record<
  DifficultyLabel,
  PairCandidate[]
> = {
  Easy: [
    { a: 6, b: 12 },
    { a: 8, b: 24 },
    { a: 10, b: 15 },
  ],
  Medium: [
    { a: 6, b: 15 },
    { a: 9, b: 18 },
    { a: 12, b: 18 },
  ],
  Hard: [
    { a: 8, b: 12 },
    { a: 9, b: 15 },
    { a: 12, b: 20 },
  ],
};

function pickTimePair(
  difficulty: DifficultyLabel,
) {
  return pickRandomItem(
    TIME_PAIR_CANDIDATES[
      difficulty
    ],
  );
}

function buildDefaultContext(): QuantScenarioContext {
  return {
    entity: "team",
    metric: "work completion time",
    context: "project",
  };
}

export function createWorkerEquivalenceScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const efficiencyRatio =
    difficulty === "Hard" ? 3 : 2;
  const bDays =
    difficulty === "Easy" ? 12 : 18;
  const aDays =
    bDays / efficiencyRatio;
  const combinedDays =
    (aDays * bDays) /
    (aDays + bDays);

  return {
    scenarioType:
      "worker-equivalence",
    topicCluster: "time-work",
    values: {
      a: aDays,
      b: bDays,
      ratio: efficiencyRatio,
    },
    text: `Worker A is ${efficiencyRatio} times as efficient as Worker B. If Worker B alone completes a piece of work in ${bDays} days, in how many days will A and B together complete the same work?`,
    correctAnswer: combinedDays,
    distractorHints: [
      "wrongEfficiencyBase",
      "directTimeAdd",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Convert the efficiency relation into time: if A is ${efficiencyRatio} times as efficient as B, then A alone takes ${aDays} days.`,
      ),
      createReasoningStep(
        "aggregate",
        "Add the two work rates to get the combined one-day work.",
      ),
      createReasoningStep(
        "infer",
        `Invert the combined rate to obtain the total time, which is ${combinedDays} days.`,
      ),
    ],
    context: buildDefaultContext(),
  };
}

export function createDelayedJoinScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const pair = pickTimePair(difficulty);
  const totalWorkUnits = Math.abs(
    pair.a * pair.b,
  );
  const aRate =
    totalWorkUnits / pair.a;
  const bRate =
    totalWorkUnits / pair.b;
  const soloDays =
    difficulty === "Hard" ? 2 : 1;
  const remainingWork =
    totalWorkUnits -
    aRate * soloDays;
  const jointDays =
    remainingWork /
    (aRate + bRate);
  const correctAnswer =
    soloDays + jointDays;

  return {
    scenarioType: "delayed-join",
    topicCluster: "time-work",
    values: {
      a: pair.a,
      b: pair.b,
      soloDays,
      totalWorkUnits,
    },
    text: `A can finish a work in ${pair.a} days and B can finish the same work in ${pair.b} days. A works alone for ${soloDays} day${soloDays > 1 ? "s" : ""}, after which B joins A. In how many days will the work be completed altogether?`,
    correctAnswer,
    distractorHints: [
      "partialAggregation",
      "directTimeAdd",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Take total work as ${totalWorkUnits} units so that A's and B's daily rates become ${aRate} and ${bRate} units respectively.`,
      ),
      createReasoningStep(
        "filter",
        `Subtract the ${aRate * soloDays} units done by A alone in the first ${soloDays} day${soloDays > 1 ? "s" : ""}.`,
      ),
      createReasoningStep(
        "aggregate",
        `Together they complete ${aRate + bRate} units per day, so the remaining work takes ${jointDays} days.`,
      ),
      createReasoningStep(
        "infer",
        `Add the initial solo period to get the total time: ${correctAnswer} days.`,
      ),
    ],
    context: buildDefaultContext(),
  };
}

export function createAlternatingOperationScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const easy =
    difficulty === "Easy";
  const aRate = easy ? 3 : 4;
  const bRate = easy ? 2 : 3;
  const cycleDays = 2;
  const cycleWork =
    aRate + bRate;
  const fullCycles =
    difficulty === "Hard" ? 3 : 2;
  const remainingWork =
    easy ? 1 : 2;
  const totalWork =
    fullCycles * cycleWork +
    remainingWork;
  const correctAnswer =
    fullCycles * cycleDays +
    remainingWork / aRate;

  return {
    scenarioType: "alternating-operation",
    topicCluster: "time-work",
    values: {
      aRate,
      bRate,
      totalWork,
      cycleWork,
    },
    text: `A and B work on alternate days starting with A. A completes ${aRate}/${totalWork} of the work in one day and B completes ${bRate}/${totalWork} of the work in one day. In how many days will the work be completed?`,
    correctAnswer,
    distractorHints: [
      "partialAggregation",
      "rateTimeSwap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `In every two-day cycle, A and B together complete ${cycleWork}/${totalWork} of the work.`,
      ),
      createReasoningStep(
        "compare",
        `After ${fullCycles} full cycles, ${fullCycles * cycleWork}/${totalWork} of the work is done.`,
      ),
      createReasoningStep(
        "infer",
        `The remaining ${remainingWork}/${totalWork} of the work is completed by A on the next day in ${remainingWork / aRate} day, so the total time is ${correctAnswer} days.`,
      ),
    ],
    context: buildDefaultContext(),
  };
}

export function createPositiveNegativeCompetitionScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const fillRate =
    difficulty === "Hard" ? 7 : 5;
  const spoilRate =
    difficulty === "Hard" ? 2 : 1;
  const totalWork =
    difficulty === "Hard" ? 45 : 24;
  const netRate =
    fillRate - spoilRate;
  const correctAnswer =
    totalWork / netRate;

  return {
    scenarioType:
      "positive-negative-competition",
    topicCluster: "time-work",
    values: {
      fillRate,
      spoilRate,
      totalWork,
    },
    text: `Worker A completes ${fillRate} units of a job per day, while Worker B spoils ${spoilRate} units of the same job per day. If the total job contains ${totalWork} units, in how many days will the job be completed when both work together?`,
    correctAnswer,
    distractorHints: [
      "directTimeAdd",
      "inverseRelationMiss",
    ],
    reasoningSteps: [
      createReasoningStep(
        "filter",
        `Treat B's contribution as negative work, so the net daily completion is ${netRate} units.`,
      ),
      createReasoningStep(
        "infer",
        `Divide the total ${totalWork} units by the net rate ${netRate} to get ${correctAnswer} days.`,
      ),
    ],
    context: buildDefaultContext(),
  };
}

export function createInverseWorkScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const pair = pickTimePair(
    difficulty === "Easy"
      ? "Medium"
      : difficulty,
  );
  const combinedDays =
    (pair.a * pair.b) /
    (pair.a + pair.b);

  return {
    scenarioType: "inverse-work",
    topicCluster: "time-work",
    values: {
      a: pair.a,
      combinedDays,
    },
    text: `A and B together can complete a work in ${combinedDays} days. A alone takes ${pair.a} days. In how many days can B alone complete the work?`,
    correctAnswer: pair.b,
    distractorHints: [
      "inverseRelationMiss",
      "wrongEfficiencyBase",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Convert the times into rates: A's rate is 1/${pair.a}, while the combined rate is 1/${combinedDays}.`,
      ),
      createReasoningStep(
        "filter",
        "Subtract A's rate from the combined rate to isolate B's rate.",
      ),
      createReasoningStep(
        "reverse",
        `Take the reciprocal of B's rate to get B's time, which is ${pair.b} days.`,
      ),
    ],
    context: buildDefaultContext(),
  };
}

export function createTimeWorkScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario | null {
  if (
    pattern.topic
      .toLowerCase()
      .trim() !== "time-work"
  ) {
    return null;
  }

  const scenarioFactories: TimeWorkScenarioFactory[] =
    motif?.id ===
    "efficiency-substitution"
      ? [
        createWorkerEquivalenceScenario,
        createDelayedJoinScenario,
        createAlternatingOperationScenario,
      ]
      : motif?.id ===
          "inverse-work-trap"
        ? [
          createInverseWorkScenario,
          createPositiveNegativeCompetitionScenario,
          createDelayedJoinScenario,
        ]
        : [
          createDelayedJoinScenario,
          createWorkerEquivalenceScenario,
          createInverseWorkScenario,
        ];

  return pickRandomItem(
    scenarioFactories,
  )(difficulty, motif);
}
