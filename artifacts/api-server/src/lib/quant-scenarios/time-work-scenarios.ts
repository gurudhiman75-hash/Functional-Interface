import type {
  DifficultyLabel,
  OptionMetadata,
  Pattern,
  QuantTopicCluster,
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
  topicCluster: QuantTopicCluster;
  values: Record<string, number>;
  text: string;
  correctAnswer: number;
  formula?: string;
  reasoningSteps: ReasoningStep[];
  explanation?: string;
  distractorHints?: string[];
  context?: QuantScenarioContext;
  motifId?: string;
  scenarioLogicBranch?: string;
  structuralSignature?: string;
  customOptionBundle?: {
    options: string[];
    correct: number;
    optionMetadata?: OptionMetadata[];
  };
  subjectContext?: {
    variant: "default" | "PunjabState";
    replacements?: Record<string, string>;
  };
  validationTokens?: string[];
};

type TimeWorkScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

type PairCandidate = {
  a: number;
  b: number;
};

type WorkSnapshot = {
  label: string;
  duration: number;
  activeRate: number;
  unitsDone: number;
  remainingWork: number;
};

type TimeWorkFinalizationConfig = {
  motifId: string;
  scenarioLogicBranch: string;
  validationTokens?: string[];
  signatureKeys?: string[];
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

function buildContext(
  entity: string,
  metric: string,
  context: string,
): QuantScenarioContext {
  return {
    entity,
    metric,
    context,
  };
}

function gcd(
  a: number,
  b: number,
): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const temp = x % y;
    x = y;
    y = temp;
  }
  return x || 1;
}

function lcm(
  ...values: number[]
): number {
  return values.reduce((acc, value) => {
    if (value === 0) {
      return acc;
    }
    return Math.abs(
      (acc * value) / gcd(acc, value),
    );
  }, 1);
}

function createWorkSnapshot(
  label: string,
  totalWork: number,
  currentUnitsDone: number,
  activeRate: number,
  duration: number,
): WorkSnapshot {
  const unitsDone =
    currentUnitsDone + activeRate * duration;
  return {
    label,
    duration,
    activeRate,
    unitsDone,
    remainingWork: totalWork - unitsDone,
  };
}

function formatTimeWorkValue(
  value: number,
): string {
  return Number.isInteger(value)
    ? `${value}`
    : `${Number(value.toFixed(4))}`;
}

function formatMathNumber(
  value: number,
): string {
  return `$${formatTimeWorkValue(value)}$`;
}

function formatMathFraction(
  numerator: number,
  denominator: number,
): string {
  const divisor = gcd(
    numerator,
    denominator,
  );
  const reducedNumerator =
    numerator / divisor;
  const reducedDenominator =
    denominator / divisor;

  if (reducedDenominator === 1) {
    return formatMathNumber(
      reducedNumerator,
    );
  }

  return `$\\frac{${reducedNumerator}}{${reducedDenominator}}$`;
}

function buildTimeWorkStructuralSignature(
  motifId: string,
  scenarioLogicBranch: string,
  values: Record<string, number>,
  signatureKeys?: string[],
): string {
  const keys =
    signatureKeys && signatureKeys.length > 0
      ? signatureKeys
      : Object.keys(values).sort();
  const numericProfile = keys
    .filter((key) => key in values)
    .map(
      (key) =>
        `${key}:${formatTimeWorkValue(values[key])}`,
    )
    .join("|");

  return `${motifId}::${scenarioLogicBranch}::${numericProfile}`;
}

function finalizeTimeWorkScenario(
  scenario: QuantProceduralScenario,
  config: TimeWorkFinalizationConfig,
): QuantProceduralScenario {
  return {
    ...scenario,
    motifId: config.motifId,
    scenarioLogicBranch:
      config.scenarioLogicBranch,
    structuralSignature:
      buildTimeWorkStructuralSignature(
        config.motifId,
        config.scenarioLogicBranch,
        scenario.values,
        config.signatureKeys,
      ),
    validationTokens:
      config.validationTokens,
  };
}

export function createSimpleCombinedWorkScenario(
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
  const combinedRate =
    aRate + bRate;
  const correctAnswer =
    totalWorkUnits / combinedRate;

  return {
    scenarioType: "simple-combined-work",
    topicCluster: "time-work",
    values: {
      a: pair.a,
      b: pair.b,
      totalWorkUnits,
    },
    text: `A can complete a work in ${pair.a} days and B can complete the same work in ${pair.b} days. In how many days will A and B together complete it?`,
    correctAnswer,
    distractorHints: [
      "reciprocalInversion",
      "wrongLCMAggregation",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Take total work as ${totalWorkUnits} units, so A's and B's daily rates are ${aRate} and ${bRate} units.`,
      ),
      createReasoningStep(
        "aggregate",
        `Together they complete ${combinedRate} units per day.`,
      ),
      createReasoningStep(
        "reverse",
        `Invert the combined rate: ${totalWorkUnits}/${combinedRate} = ${correctAnswer} days.`,
      ),
    ],
    context: buildDefaultContext(),
    motifId: "tw-basic-2-sum",
    scenarioLogicBranch:
      "two-agent-reciprocal-addition",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-basic-2-sum",
        "two-agent-reciprocal-addition",
        {
          a: pair.a,
          b: pair.b,
        },
      ),
    validationTokens: [
      "A can complete a work",
      "together complete it",
    ],
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
    motifId: "tw-eff-integer",
    scenarioLogicBranch:
      "integer-efficiency-combined-rate",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-eff-integer",
        "integer-efficiency-combined-rate",
        {
          ratio: efficiencyRatio,
          bDays,
        },
      ),
    validationTokens: [
      "times as efficient",
      "together complete",
    ],
  };
}

export function createEfficiencyPercentageScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const baseDays =
    difficulty === "Hard" ? 24 : 18;
  const moreEfficient =
    difficulty === "Hard" ? 50 : 25;
  const fasterFactor =
    1 + moreEfficient / 100;
  const efficientWorkerDays =
    baseDays / fasterFactor;
  const combinedDays =
    (baseDays * efficientWorkerDays) /
    (baseDays + efficientWorkerDays);

  return {
    scenarioType:
      "efficiency-percentage",
    topicCluster: "time-work",
    values: {
      baseDays,
      moreEfficient,
      efficientWorkerDays,
    },
    text: `Worker A is ${moreEfficient}% more efficient than Worker B. If Worker B alone can finish a work in ${baseDays} days, in how many days can A and B together finish the work?`,
    correctAnswer: combinedDays,
    distractorHints: [
      "wrongEfficiencyBase",
      "rateTimeSwap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `If A is ${moreEfficient}% more efficient, A's rate is ${fasterFactor} times B's rate, so A alone takes ${efficientWorkerDays} days.`,
      ),
      createReasoningStep(
        "aggregate",
        "Combine the two daily work rates.",
      ),
      createReasoningStep(
        "infer",
        `The combined time is ${combinedDays} days.`,
      ),
    ],
    context: buildDefaultContext(),
    motifId: "tw-eff-pct-boost",
    scenarioLogicBranch:
      "percentage-efficiency-boost",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-eff-pct-boost",
        "percentage-efficiency-boost",
        {
          baseDays,
          moreEfficient,
        },
      ),
    validationTokens: [
      "% more efficient",
      "together finish the work",
    ],
  };
}

export function createEfficiencyNumericalScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const multiplier =
    difficulty === "Hard" ? 4 : 3;
  const bDays =
    difficulty === "Hard" ? 24 : 18;
  const aDays = bDays / multiplier;
  const totalWork = aDays * bDays;
  const correctAnswer =
    totalWork / (totalWork / aDays + totalWork / bDays);

  return {
    scenarioType:
      "efficiency-numerical",
    topicCluster: "time-work",
    values: {
      multiplier,
      bDays,
      aDays,
    },
    text: `Worker A is ${multiplier} times as efficient as Worker B. If Worker B alone can complete a work in ${bDays} days, how many days will A and B together take to complete it?`,
    correctAnswer,
    distractorHints: [
      "rateTimeSwap",
      "wrongEfficiencyBase",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `If A is ${multiplier} times as efficient, A alone takes ${aDays} days.`,
      ),
      createReasoningStep(
        "aggregate",
        `Using total work ${totalWork} units, combine the rates.`,
      ),
      createReasoningStep(
        "infer",
        `The work is completed in ${correctAnswer} days.`,
      ),
    ],
    context: buildDefaultContext(),
    motifId: "tw-eff-integer",
    scenarioLogicBranch:
      "integer-efficiency-direct",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-eff-integer",
        "integer-efficiency-direct",
        {
          multiplier,
          bDays,
        },
      ),
    validationTokens: [
      "times as efficient",
      "together take",
    ],
  };
}

export function createThreeWorkerCombinedScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const values =
    difficulty === "Hard"
      ? { a: 12, b: 18, c: 24 }
      : difficulty === "Medium"
        ? { a: 8, b: 12, c: 24 }
        : { a: 6, b: 12, c: 18 };
  const totalWork = lcm(
    values.a,
    values.b,
    values.c,
  );
  const aRate = totalWork / values.a;
  const bRate = totalWork / values.b;
  const cRate = totalWork / values.c;
  const combinedRate =
    aRate + bRate + cRate;
  const correctAnswer =
    totalWork / combinedRate;

  return finalizeTimeWorkScenario(
    {
      scenarioType: "three-worker-combined",
      topicCluster: "time-work",
      values: {
        ...values,
        totalWork,
      },
      text: `A can complete a work in ${values.a} days, B in ${values.b} days, and C in ${values.c} days. In how many days will they complete the work together?`,
      correctAnswer,
      distractorHints: [
        "reciprocalInversion",
        "wrongLCMAggregation",
      ],
      reasoningSteps: [
        createReasoningStep(
          "transform",
          `Take total work as ${totalWork} units. Their daily rates are ${aRate}, ${bRate}, and ${cRate} units.`,
        ),
        createReasoningStep(
          "aggregate",
          `Combined rate = ${combinedRate} units per day.`,
        ),
        createReasoningStep(
          "infer",
          `Time = ${totalWork}/${combinedRate} = ${correctAnswer} days.`,
        ),
      ],
      context: buildDefaultContext(),
    },
    {
      motifId: "tw-basic-3-sum",
      scenarioLogicBranch:
        "three-agent-reciprocal-addition",
      validationTokens: [
        "A can complete a work",
        "C in",
        "together",
      ],
      signatureKeys: ["a", "b", "c"],
    },
  );
}

export function createComponentExtractScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const aDays =
    difficulty === "Hard" ? 18 : 12;
  const bDays =
    difficulty === "Hard" ? 30 : 20;
  const totalWork = lcm(aDays, bDays);
  const aRate = totalWork / aDays;
  const bRate = totalWork / bDays;
  const togetherDays =
    totalWork / (aRate + bRate);

  return finalizeTimeWorkScenario(
    {
      scenarioType: "component-extract",
      topicCluster: "time-work",
      values: {
        aDays,
        bDays,
        togetherDays,
      },
      text: `A and B together can complete a work in ${togetherDays} days. A alone can complete it in ${aDays} days. In how many days can B alone complete the same work?`,
      correctAnswer: bDays,
      distractorHints: [
        "reciprocalInversion",
        "Residual_Work_Trap",
      ],
      reasoningSteps: [
        createReasoningStep(
          "transform",
          `Take total work as ${totalWork} units. Then A's rate is ${aRate} units/day and A+B rate is ${aRate + bRate} units/day.`,
        ),
        createReasoningStep(
          "filter",
          `B's rate = ${aRate + bRate} - ${aRate} = ${bRate} units/day.`,
        ),
        createReasoningStep(
          "infer",
          `So B alone takes ${totalWork}/${bRate} = ${bDays} days.`,
        ),
      ],
      context: buildDefaultContext(),
    },
    {
      motifId: "tw-component-extract",
      scenarioLogicBranch:
        "known-agent-subtracted-from-combined-rate",
      validationTokens: [
        "together can complete",
        "A alone can complete",
      ],
      signatureKeys: ["aDays", "bDays"],
    },
  );
}

export function createEfficiencyPercentageReduceScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const baseDays =
    difficulty === "Hard" ? 20 : 16;
  const lessEfficient =
    difficulty === "Hard" ? 20 : 25;
  const rateFactor =
    1 - lessEfficient / 100;
  const slowerDays =
    baseDays / rateFactor;
  const totalWork = lcm(
    baseDays,
    slowerDays,
  );
  const baseRate = totalWork / baseDays;
  const slowerRate =
    totalWork / slowerDays;
  const correctAnswer =
    totalWork / (baseRate + slowerRate);

  return finalizeTimeWorkScenario(
    {
      scenarioType: "efficiency-percentage-reduce",
      topicCluster: "time-work",
      values: {
        baseDays,
        lessEfficient,
        slowerDays,
      },
      text: `A is ${lessEfficient}% less efficient than B. If B alone can complete a work in ${baseDays} days, in how many days will A and B together complete the work?`,
      correctAnswer,
      distractorHints: [
        "Efficiency_Flip",
        "rateTimeSwap",
      ],
      reasoningSteps: [
        createReasoningStep(
          "transform",
          `If A is ${lessEfficient}% less efficient, A works at ${rateFactor} of B's rate, so A alone takes ${slowerDays} days.`,
        ),
        createReasoningStep(
          "aggregate",
          `Convert both to daily rates and add them.`,
        ),
        createReasoningStep(
          "infer",
          `The combined completion time is ${correctAnswer} days.`,
        ),
      ],
      context: buildDefaultContext(),
    },
    {
      motifId: "tw-eff-pct-reduce",
      scenarioLogicBranch:
        "percentage-efficiency-reduction",
      validationTokens: [
        "% less efficient",
        "together complete",
      ],
      signatureKeys: [
        "baseDays",
        "lessEfficient",
      ],
    },
  );
}

export function createHiddenComparisonScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const fasterDays =
    difficulty === "Hard" ? 20 : 15;
  const difference =
    difficulty === "Hard" ? 10 : 5;
  const slowerDays =
    fasterDays + difference;
  const totalWork = lcm(
    fasterDays,
    slowerDays,
  );
  const fastRate = totalWork / fasterDays;
  const slowRate = totalWork / slowerDays;
  const correctAnswer =
    totalWork / (fastRate + slowRate);

  return finalizeTimeWorkScenario(
    {
      scenarioType: "hidden-comparison",
      topicCluster: "time-work",
      values: {
        fasterDays,
        difference,
        slowerDays,
      },
      text: `A takes ${difference} days less than B to complete a work. If A alone can finish the work in ${fasterDays} days, how many days will A and B together take to complete it?`,
      correctAnswer,
      distractorHints: [
        "Efficiency_Flip",
        "wrongEfficiencyBase",
      ],
      reasoningSteps: [
        createReasoningStep(
          "transform",
          `If A takes ${difference} days less, B alone takes ${slowerDays} days.`,
        ),
        createReasoningStep(
          "aggregate",
          `Take total work as ${totalWork} units and add the two rates.`,
        ),
        createReasoningStep(
          "infer",
          `Together they complete the work in ${correctAnswer} days.`,
        ),
      ],
      context: buildDefaultContext(),
    },
    {
      motifId: "tw-comparison-hidden",
      scenarioLogicBranch:
        "time-gap-to-hidden-efficiency",
      validationTokens: [
        "days less than",
        "together take",
      ],
      signatureKeys: [
        "fasterDays",
        "difference",
      ],
    },
  );
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
    motifId: "tw-stage-join-start",
    scenarioLogicBranch:
      "single-start-delayed-join",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-stage-join-start",
        "single-start-delayed-join",
        {
          a: pair.a,
          b: pair.b,
          soloDays,
        },
      ),
    validationTokens: [
      "works alone",
      "joins A",
    ],
  };
}

export function createStageAsymmetricThreeScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const totalWork = difficulty === "Hard" ? 180 : 120;
  const aRate = difficulty === "Hard" ? 4 : 3;
  const bRate = difficulty === "Hard" ? 5 : 4;
  const cRate = difficulty === "Hard" ? 3 : 2;
  const aLeavesAfter = difficulty === "Hard" ? 6 : 5;
  const bLeavesBeforeEnd = difficulty === "Hard" ? 3 : 2;
  const totalDays =
    difficulty === "Hard" ? 12 : 10;

  const firstSnapshot = createWorkSnapshot(
    "all-active",
    totalWork,
    0,
    aRate + bRate + cRate,
    aLeavesAfter,
  );
  const secondPhaseDays =
    totalDays - bLeavesBeforeEnd - aLeavesAfter;
  const secondSnapshot = createWorkSnapshot(
    "b-and-c-active",
    totalWork,
    firstSnapshot.unitsDone,
    bRate + cRate,
    secondPhaseDays,
  );
  const finalSnapshot = createWorkSnapshot(
    "c-only-finish",
    totalWork,
    secondSnapshot.unitsDone,
    cRate,
    bLeavesBeforeEnd,
  );

  return finalizeTimeWorkScenario(
    {
      scenarioType: "stage-asymmetric-3",
      topicCluster: "time-work",
      values: {
        totalWork,
        aRate,
        bRate,
        cRate,
        aLeavesAfter,
        bLeavesBeforeEnd,
        totalDays,
      },
      text: `A, B, and C start a work together. A leaves after ${aLeavesAfter} days. B leaves ${bLeavesBeforeEnd} days before the work is completed. Their daily work rates are ${aRate}, ${bRate}, and ${cRate} units respectively, and the total work is ${totalWork} units. Find the total time taken.`,
      correctAnswer: totalDays,
      distractorHints: [
        "Before_Completion_Gap",
        "Joiner_Active_Omission",
      ],
      reasoningSteps: [
        createReasoningStep(
          "aggregate",
          `In phase 1, all three work for ${aLeavesAfter} days and complete ${firstSnapshot.unitsDone} units.`,
        ),
        createReasoningStep(
          "aggregate",
          `In phase 2, B and C work for ${secondPhaseDays} days and raise the total completed work to ${secondSnapshot.unitsDone} units.`,
        ),
        createReasoningStep(
          "infer",
          `C alone works for the last ${bLeavesBeforeEnd} days and the work reaches ${finalSnapshot.unitsDone} units, so total time is ${totalDays} days.`,
        ),
      ],
      context: buildDefaultContext(),
    },
    {
      motifId: "tw-stage-asymmetric-3",
      scenarioLogicBranch:
        "three-agent-multi-exit-state-machine",
      validationTokens: [
        "A leaves after",
        "B leaves",
        "before the work is completed",
      ],
      signatureKeys: [
        "totalWork",
        "aRate",
        "bRate",
        "cRate",
        "aLeavesAfter",
        "bLeavesBeforeEnd",
      ],
    },
  );
}

export function createStageHandoffScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const totalWork = difficulty === "Hard" ? 120 : 90;
  const fractionDoneNumerator =
    difficulty === "Hard" ? 3 : 2;
  const fractionDoneDenominator =
    difficulty === "Hard" ? 5 : 3;
  const aRate = difficulty === "Hard" ? 8 : 6;
  const bRate = difficulty === "Hard" ? 5 : 4;
  const firstPart =
    (totalWork * fractionDoneNumerator) /
    fractionDoneDenominator;
  const remainingWork =
    totalWork - firstPart;
  const correctAnswer =
    firstPart / aRate +
    remainingWork / bRate;

  return finalizeTimeWorkScenario(
    {
      scenarioType: "stage-handoff",
      topicCluster: "time-work",
      values: {
        totalWork,
        fractionDoneNumerator,
        fractionDoneDenominator,
        aRate,
        bRate,
      },
      text: `A starts a work and completes ${fractionDoneNumerator}/${fractionDoneDenominator} of it. B then takes over and completes the remaining part. If A works at ${aRate} units per day, B works at ${bRate} units per day, and the total work is ${totalWork} units, find the total time taken.`,
      correctAnswer,
      distractorHints: [
        "Target_Scope_Error",
        "Residual_Work_Trap",
      ],
      reasoningSteps: [
        createReasoningStep(
          "transform",
          `A completes ${firstPart} units, leaving ${remainingWork} units.`,
        ),
        createReasoningStep(
          "aggregate",
          `A takes ${firstPart}/${aRate} days and B takes ${remainingWork}/${bRate} days.`,
        ),
        createReasoningStep(
          "infer",
          `Total time = ${correctAnswer} days.`,
        ),
      ],
      context: buildDefaultContext(),
    },
    {
      motifId: "tw-stage-handoff",
      scenarioLogicBranch:
        "fractional-handoff-residual-finish",
      validationTokens: [
        "takes over",
        "remaining part",
      ],
      signatureKeys: [
        "totalWork",
        "fractionDoneNumerator",
        "fractionDoneDenominator",
        "aRate",
        "bRate",
      ],
    },
  );
}

export function createStageStaggeredJoinScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const totalWork = difficulty === "Hard" ? 144 : 96;
  const aRate = difficulty === "Hard" ? 6 : 4;
  const bRate = difficulty === "Hard" ? 4 : 3;
  const cRate = difficulty === "Hard" ? 2 : 1;
  const bJoin = difficulty === "Hard" ? 3 : 2;
  const cJoin = difficulty === "Hard" ? 6 : 4;
  const firstSnapshot = createWorkSnapshot(
    "a-only",
    totalWork,
    0,
    aRate,
    bJoin,
  );
  const secondSnapshot = createWorkSnapshot(
    "a-b-active",
    totalWork,
    firstSnapshot.unitsDone,
    aRate + bRate,
    cJoin - bJoin,
  );
  const remainingWork =
    totalWork - secondSnapshot.unitsDone;
  const finalPhaseDays =
    remainingWork / (aRate + bRate + cRate);
  const correctAnswer =
    cJoin + finalPhaseDays;

  return finalizeTimeWorkScenario(
    {
      scenarioType: "stage-staggered-join",
      topicCluster: "time-work",
      values: {
        totalWork,
        aRate,
        bRate,
        cRate,
        bJoin,
        cJoin,
      },
      text: `A starts a work alone at time 0. B joins after ${bJoin} days and C joins after ${cJoin} days. Their daily work rates are ${aRate}, ${bRate}, and ${cRate} units respectively. If the total work is ${totalWork} units, find the total time taken.`,
      correctAnswer,
      distractorHints: [
        "Joiner_Active_Omission",
        "Denominator_Lag",
      ],
      reasoningSteps: [
        createReasoningStep(
          "aggregate",
          `Phase 1: A alone completes ${firstSnapshot.unitsDone} units in ${bJoin} days.`,
        ),
        createReasoningStep(
          "aggregate",
          `Phase 2: A and B together raise the completed work to ${secondSnapshot.unitsDone} units by day ${cJoin}.`,
        ),
        createReasoningStep(
          "infer",
          `The remaining ${remainingWork} units are done by all three in ${finalPhaseDays} days, so total time is ${correctAnswer} days.`,
        ),
      ],
      context: buildDefaultContext(),
    },
    {
      motifId: "tw-stage-staggered-join",
      scenarioLogicBranch:
        "staggered-entry-three-phase",
      validationTokens: [
        "B joins after",
        "C joins after",
      ],
      signatureKeys: [
        "totalWork",
        "aRate",
        "bRate",
        "cRate",
        "bJoin",
        "cJoin",
      ],
    },
  );
}

export function createStageLeaveStartScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const totalWork =
    difficulty === "Hard" ? 180 : 120;
  const aRate =
    difficulty === "Hard" ? 8 : 6;
  const bRate =
    difficulty === "Hard" ? 7 : 4;
  const leaveDays =
    difficulty === "Hard" ? 5 : 4;
  const firstPhaseWork =
    (aRate + bRate) * leaveDays;
  const remainingWork =
    totalWork - firstPhaseWork;
  const secondPhaseDays =
    remainingWork / bRate;
  const correctAnswer =
    leaveDays + secondPhaseDays;

  return {
    scenarioType:
      "stage-leave-start",
    topicCluster: "time-work",
    values: {
      totalWork,
      aRate,
      bRate,
      leaveDays,
    },
    text: `A and B together can do ${aRate + bRate} units of work per day. After working together for ${leaveDays} days, A leaves and B completes the remaining ${remainingWork} units alone at ${bRate} units per day. Find the total time taken.`,
    correctAnswer,
    distractorHints: [
      "partialAggregation",
      "incorrectResidualAllocation",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `In the first phase they complete ${firstPhaseWork} units.`,
      ),
      createReasoningStep(
        "filter",
        `Remaining work = ${totalWork} - ${firstPhaseWork} = ${remainingWork} units.`,
      ),
      createReasoningStep(
        "infer",
        `B alone takes ${remainingWork}/${bRate} = ${secondPhaseDays} days, so total time is ${correctAnswer} days.`,
      ),
    ],
    context: buildDefaultContext(),
    motifId: "tw-stage-leave-start",
    scenarioLogicBranch:
      "joint-start-one-leaves-early",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-stage-leave-start",
        "joint-start-one-leaves-early",
        {
          totalWork,
          aRate,
          bRate,
          leaveDays,
        },
      ),
    validationTokens: [
      "A leaves",
      "B completes the remaining",
    ],
  };
}

export function createStageLeaveEndScenario(): QuantProceduralScenario {
  const aRate = 4;
  const bRate = 3;
  const leaveGap = 2;
  const totalWork = 70;
  const totalDays =
    (totalWork + aRate * leaveGap) /
    (aRate + bRate);

  return {
    scenarioType:
      "stage-leave-end",
    topicCluster: "time-work",
    values: {
      aRate,
      bRate,
      leaveGap,
      totalWork,
    },
    text: `A and B start a work together. A can do ${aRate} units per day and B can do ${bRate} units per day. A leaves ${leaveGap} days before the work is completed, and the total work is ${totalWork} units. Find the total number of days taken to finish the work.`,
    correctAnswer: totalDays,
    distractorHints: [
      "wrongIntermediateValue",
      "incorrectResidualAllocation",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Let the total time be T days. Then A works for T - ${leaveGap} days while B works for T days.`,
      ),
      createReasoningStep(
        "aggregate",
        `So ${aRate}(T - ${leaveGap}) + ${bRate}T = ${totalWork}.`,
      ),
      createReasoningStep(
        "infer",
        `Solving gives T = ${totalDays} days.`,
      ),
    ],
    context: buildDefaultContext(),
    motifId: "tw-stage-deadline-exit",
    scenarioLogicBranch:
      "leave-days-before-completion",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-stage-deadline-exit",
        "leave-days-before-completion",
        {
          aRate,
          bRate,
          leaveGap,
          totalWork,
        },
      ),
    validationTokens: [
      "leaves",
      "before the work is completed",
    ],
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
    motifId: "tw-cycle-alternate-2",
    scenarioLogicBranch:
      "two-agent-alternate-cycle",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-cycle-alternate-2",
        "two-agent-alternate-cycle",
        {
          aRate,
          bRate,
          totalWork,
        },
      ),
    validationTokens: [
      "alternate days",
      "starting with A",
    ],
  };
}

export function createCyclicAssistedScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const dailyRate = difficulty === "Hard" ? 5 : 4;
  const assistRate = difficulty === "Hard" ? 7 : 5;
  const cycleDays = 3;
  const cycleWork =
    dailyRate * 3 + assistRate;
  const fullCycles =
    difficulty === "Hard" ? 3 : 2;
  const remainingWork =
    difficulty === "Hard" ? 8 : 5;
  const totalWork =
    fullCycles * cycleWork +
    remainingWork;
  const extraDays =
    remainingWork / dailyRate;
  const correctAnswer =
    fullCycles * cycleDays +
    extraDays;

  return {
    scenarioType:
      "cyclic-assisted",
    topicCluster: "time-work",
    values: {
      dailyRate,
      assistRate,
      totalWork,
      cycleDays,
    },
    text: `A works every day and completes ${dailyRate} units daily. B works only on every 3rd day and adds ${assistRate} extra units on those days. If the total work is ${totalWork} units, in how many days will the work be completed?`,
    correctAnswer,
    distractorHints: [
      "cycleBoundaryError",
      "cumulativeMistake",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `Each 3-day cycle contributes ${cycleWork} units.`,
      ),
      createReasoningStep(
        "compare",
        `After ${fullCycles} full cycles, ${fullCycles * cycleWork} units are done.`,
      ),
      createReasoningStep(
        "infer",
        `The remaining ${remainingWork} units take ${extraDays} more days, so the total time is ${correctAnswer} days.`,
      ),
    ],
    context: buildDefaultContext(),
    motifId: "tw-cycle-assist-single",
    scenarioLogicBranch:
      "single-assistant-periodic-cycle",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-cycle-assist-single",
        "single-assistant-periodic-cycle",
        {
          dailyRate,
          assistRate,
          totalWork,
          cycleDays,
        },
      ),
    validationTokens: [
      "works every day",
      "every 3rd day",
    ],
  };
}

export function createThreeCycleScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const totalWork = difficulty === "Hard" ? 144 : 108;
  const aRate = difficulty === "Hard" ? 8 : 6;
  const bRate = difficulty === "Hard" ? 6 : 4;
  const cRate = difficulty === "Hard" ? 4 : 2;
  const cycleWork =
    aRate + bRate + cRate;
  const fullCycles =
    difficulty === "Hard" ? 4 : 3;
  const partialWork =
    totalWork - fullCycles * cycleWork;
  const correctAnswer =
    fullCycles * 3 +
    partialWork / aRate;

  return finalizeTimeWorkScenario(
    {
      scenarioType: "cycle-alternate-3",
      topicCluster: "time-work",
      values: {
        totalWork,
        aRate,
        bRate,
        cRate,
      },
      text: `A, B, and C work on successive days in the order A, then B, then C, and repeat the same cycle. Their one-day works are ${aRate}, ${bRate}, and ${cRate} units respectively. If the total work is ${totalWork} units, find the time required.`,
      correctAnswer,
      distractorHints: [
        "Cycle_Boundary_Floor",
        "Goal_Overshoot",
      ],
      reasoningSteps: [
        createReasoningStep(
          "aggregate",
          `One full 3-day cycle completes ${cycleWork} units.`,
        ),
        createReasoningStep(
          "compare",
          `After ${fullCycles} full cycles, ${fullCycles * cycleWork} units are done.`,
        ),
        createReasoningStep(
          "infer",
          `The remaining ${partialWork} units are completed by A first in the next cycle, so total time is ${correctAnswer} days.`,
        ),
      ],
      context: buildDefaultContext(),
    },
    {
      motifId: "tw-cycle-alternate-3",
      scenarioLogicBranch:
        "three-agent-successive-cycle",
      validationTokens: [
        "successive days",
        "repeat the same cycle",
      ],
      signatureKeys: [
        "totalWork",
        "aRate",
        "bRate",
        "cRate",
      ],
    },
  );
}

export function createCyclicAssistGroupScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const totalWork = difficulty === "Hard" ? 210 : 150;
  const aRate = difficulty === "Hard" ? 8 : 6;
  const bRate = difficulty === "Hard" ? 5 : 4;
  const cRate = difficulty === "Hard" ? 4 : 2;
  const assistEvery =
    difficulty === "Hard" ? 4 : 3;
  const cycleWork =
    aRate * assistEvery + bRate + cRate;
  const fullCycles =
    difficulty === "Hard" ? 4 : 3;
  const doneAfterCycles =
    fullCycles * cycleWork;
  const remainingWork =
    totalWork - doneAfterCycles;
  const extraDays =
    remainingWork / aRate;
  const correctAnswer =
    fullCycles * assistEvery + extraDays;

  return finalizeTimeWorkScenario(
    {
      scenarioType: "cycle-assist-group",
      topicCluster: "time-work",
      values: {
        totalWork,
        aRate,
        bRate,
        cRate,
        assistEvery,
      },
      text: `A works every day and completes ${aRate} units daily. B and C join together on every ${assistEvery}th day, adding ${bRate + cRate} extra units on those days. If the total work is ${totalWork} units, find the total time required.`,
      correctAnswer,
      distractorHints: [
        "Cycle_Boundary_Floor",
        "Joiner_Active_Omission",
      ],
      reasoningSteps: [
        createReasoningStep(
          "aggregate",
          `Each ${assistEvery}-day cycle contributes ${cycleWork} units.`,
        ),
        createReasoningStep(
          "compare",
          `After ${fullCycles} such cycles, ${doneAfterCycles} units are completed.`,
        ),
        createReasoningStep(
          "infer",
          `The remaining ${remainingWork} units take ${extraDays} more days at A's regular rate, so total time is ${correctAnswer} days.`,
        ),
      ],
      context: buildDefaultContext(),
    },
    {
      motifId: "tw-cycle-assist-group",
      scenarioLogicBranch:
        "daily-worker-group-assistance-cycle",
      validationTokens: [
        "every day",
        "assist together on every",
      ],
      signatureKeys: [
        "totalWork",
        "aRate",
        "bRate",
        "cRate",
        "assistEvery",
      ],
    },
  );
}

export function createHelperToggleScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const totalWork = difficulty === "Hard" ? 162 : 108;
  const aRate = difficulty === "Hard" ? 7 : 5;
  const bRate = difficulty === "Hard" ? 4 : 3;
  const cRate = difficulty === "Hard" ? 2 : 1;
  const evenDayRate = aRate + bRate;
  const oddDayRate = aRate + cRate;
  const cycleWork =
    evenDayRate + oddDayRate;
  const fullCycles =
    difficulty === "Hard" ? 7 : 6;
  const doneAfterCycles =
    fullCycles * cycleWork;
  const remainingWork =
    totalWork - doneAfterCycles;
  const correctAnswer =
    fullCycles * 2 +
    remainingWork / oddDayRate;

  return finalizeTimeWorkScenario(
    {
      scenarioType: "cycle-helper-toggle",
      topicCluster: "time-work",
      values: {
        totalWork,
        aRate,
        bRate,
        cRate,
      },
      text: `A works every day. On odd days A is joined by C, and on even days A is joined by B. Their one-day works are ${aRate}, ${bRate}, and ${cRate} units respectively for A, B, and C. If the total work is ${totalWork} units, find the time taken.`,
      correctAnswer,
      distractorHints: [
        "Cycle_Boundary_Floor",
        "Asymmetric_Start_Swap",
      ],
      reasoningSteps: [
        createReasoningStep(
          "aggregate",
          `Odd-day work = ${oddDayRate} units and even-day work = ${evenDayRate} units.`,
        ),
        createReasoningStep(
          "compare",
          `Each 2-day helper-toggle cycle completes ${cycleWork} units.`,
        ),
        createReasoningStep(
          "infer",
          `After ${fullCycles} full cycles, the remaining work is completed on the next odd day in ${remainingWork}/${oddDayRate} day, so total time is ${correctAnswer} days.`,
        ),
      ],
      context: buildDefaultContext(),
    },
    {
      motifId: "tw-cycle-helper-toggle",
      scenarioLogicBranch:
        "odd-even-helper-toggle",
      validationTokens: [
        "odd days",
        "even days",
      ],
      signatureKeys: [
        "totalWork",
        "aRate",
        "bRate",
        "cRate",
      ],
    },
  );
}

export function createPipeFillingLeakScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const fillRate =
    difficulty === "Hard" ? 9 : 6;
  const leakRate =
    difficulty === "Hard" ? 4 : 2;
  const totalWork =
    difficulty === "Hard" ? 70 : 40;
  const correctAnswer =
    totalWork / (fillRate - leakRate);
  const skin = pickRandomItem([
    {
      text: `Pipe A fills a reservoir at ${fillRate} units per hour while a leak drains ${leakRate} units per hour. If the reservoir needs ${totalWork} units for full capacity, how long will it take to fill?`,
      context: buildContext(
        "reservoir",
        "fill time",
        "hydraulic system",
      ),
    },
    {
      text: `An inlet valve fills a chemical vat at ${fillRate} units per hour, but a drain valve leaks ${leakRate} units per hour. If the vat needs ${totalWork} units to fill completely, find the time required.`,
      context: buildContext(
        "chemical vat",
        "fill time",
        "industrial leak",
      ),
    },
  ]);

  return finalizeTimeWorkScenario(
    {
      scenarioType: "pipe-fill-leak",
      topicCluster: "time-work",
      values: {
        fillRate,
        leakRate,
        totalWork,
      },
      text: skin.text,
      correctAnswer,
      distractorHints: [
        "Sign_Inversion",
        "Linear_Sum",
      ],
      reasoningSteps: [
        createReasoningStep(
          "filter",
          `Net rate = ${fillRate} - ${leakRate} = ${fillRate - leakRate} units per hour.`,
        ),
        createReasoningStep(
          "infer",
          `Time required = ${totalWork}/${fillRate - leakRate} = ${correctAnswer} hours.`,
        ),
      ],
      context: skin.context,
    },
    {
      motifId: "tw-pipe-fill-leak",
      scenarioLogicBranch:
        "net-fill-minus-leak-rate",
      validationTokens: [
        "units per hour",
        "fill",
      ],
      signatureKeys: [
        "fillRate",
        "leakRate",
        "totalWork",
      ],
    },
  );
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
    motifId: "positive-negative-competition",
    scenarioLogicBranch:
      "positive-minus-negative-work",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "positive-negative-competition",
        "positive-minus-negative-work",
        {
          fillRate,
          spoilRate,
          totalWork,
        },
      ),
    validationTokens: [
      "spoils",
      "both work together",
    ],
  };
}

export function createChainRuleMDHScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const m1 = difficulty === "Hard" ? 18 : 12;
  const d1 = difficulty === "Hard" ? 8 : 10;
  const h1 = difficulty === "Hard" ? 6 : 8;
  const w1 = difficulty === "Hard" ? 72 : 48;
  const m2 = difficulty === "Hard" ? 24 : 18;
  const d2 = difficulty === "Hard" ? 6 : 5;
  const h2 = difficulty === "Hard" ? 8 : 8;
  const w2 = (m2 * d2 * h2 * w1) / (m1 * d1 * h1);

  return {
    scenarioType:
      "chain-rule-mdh",
    topicCluster: "time-work",
    values: {
      m1,
      d1,
      h1,
      w1,
      m2,
      d2,
      h2,
    },
    text: `${m1} men working ${h1} hours a day for ${d1} days can complete ${w1} units of work. How many units of work can ${m2} men working ${h2} hours a day for ${d2} days complete?`,
    correctAnswer: w2,
    distractorHints: [
      "wrongIntermediateValue",
      "wrongDenominator",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Work is proportional to men x days x hours.`,
      ),
      createReasoningStep(
        "aggregate",
        `So W2/W1 = (${m2} x ${d2} x ${h2}) / (${m1} x ${d1} x ${h1}).`,
      ),
      createReasoningStep(
        "infer",
        `Hence the required work is ${w2} units.`,
      ),
    ],
    context: buildContext(
      "men",
      "work output",
      "men-days-hours",
    ),
    motifId: "tw-group-mdh-standard",
    scenarioLogicBranch:
      "men-days-hours-chain-rule",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-group-mdh-standard",
        "men-days-hours-chain-rule",
        {
          m1,
          d1,
          h1,
          w1,
          m2,
          d2,
          h2,
        },
      ),
    validationTokens: [
      "hours a day",
      "units of work",
    ],
  };
}

export function createGroupBridgeOrScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const men = difficulty === "Hard" ? 12 : 8;
  const women = difficulty === "Hard" ? 18 : 12;
  const days = difficulty === "Hard" ? 10 : 9;
  const equivalentRatio = women / men;

  return {
    scenarioType:
      "group-bridge-or",
    topicCluster: "time-work",
    values: {
      men,
      women,
      days,
      equivalentRatio,
    },
    text: `If ${men} men can complete a work in ${days} days and ${women} women can complete the same work in ${days} days, find the ratio of efficiency of one man to one woman.`,
    correctAnswer: equivalentRatio,
    distractorHints: [
      "weightedEntityConfusion",
      "wrongEfficiencyBase",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Equal work in equal time means total efficiencies are equal.`,
      ),
      createReasoningStep(
        "aggregate",
        `${men} men = ${women} women in work terms.`,
      ),
      createReasoningStep(
        "infer",
        `So 1 man : 1 woman = ${women}:${men} = ${equivalentRatio}:1.`,
      ),
    ],
    context: buildContext(
      "men and women",
      "efficiency ratio",
      "worker bridge",
    ),
    motifId: "tw-group-equivalence-or",
    scenarioLogicBranch:
      "or-bridge-efficiency-conversion",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-group-equivalence-or",
        "or-bridge-efficiency-conversion",
        {
          men,
          women,
          days,
        },
      ),
    validationTokens: [
      "men can complete a work",
      "women can complete the same work",
    ],
  };
}

export function createGroupBridgeAndScenario(): QuantProceduralScenario {
  const menOnlyRate = 2;
  const womenOnlyRate = 1;
  const mixedRate = 7;
  const correctAnswer = menOnlyRate;

  return {
    scenarioType:
      "group-bridge-and",
    topicCluster: "time-work",
    values: {
      menOnlyRate,
      womenOnlyRate,
      mixedRate,
    },
    text: `Suppose the combined one-day work of 2 men and 3 women is ${mixedRate} units, and one woman does ${womenOnlyRate} unit per day. Find the one-day work of one man.`,
    correctAnswer,
    distractorHints: [
      "weightedEntityConfusion",
      "pairwiseSystemMisresolution",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Let one man's rate be m units per day. Then 2m + 3 x ${womenOnlyRate} = ${mixedRate}.`,
      ),
      createReasoningStep(
        "infer",
        `So 2m = ${mixedRate - 3 * womenOnlyRate} and m = ${correctAnswer}.`,
      ),
    ],
    context: buildContext(
      "mixed groups",
      "individual rate",
      "group bridge",
    ),
    motifId: "tw-group-system-and",
    scenarioLogicBranch:
      "mixed-linear-system-recovery",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-group-system-and",
        "mixed-linear-system-recovery",
        {
          menOnlyRate,
          womenOnlyRate,
          mixedRate,
        },
      ),
    validationTokens: [
      "2 men and 3 women",
      "one woman does",
    ],
  };
}

export function createContractorPressureScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const men = difficulty === "Hard" ? 30 : 24;
  const totalDays = difficulty === "Hard" ? 18 : 15;
  const elapsedDays = difficulty === "Hard" ? 6 : 5;
  const workDoneFraction =
    difficulty === "Hard"
      ? { done: 2, total: 5 }
      : { done: 1, total: 3 };
  const workDoneUnits =
    (men * totalDays * workDoneFraction.done) /
    workDoneFraction.total;
  const remainingWorkUnits =
    men * totalDays - workDoneUnits;
  const remainingDays =
    totalDays - elapsedDays;
  const totalMenNeeded =
    remainingWorkUnits / remainingDays;
  const extraMen =
    totalMenNeeded - men;

  return finalizeTimeWorkScenario(
    {
      scenarioType: "contractor-pressure",
      topicCluster: "time-work",
      values: {
        men,
        totalDays,
        elapsedDays,
        workDoneNumerator: workDoneFraction.done,
        workDoneDenominator:
          workDoneFraction.total,
      },
      text: `A contractor hires ${men} men to complete a job in ${totalDays} days. After ${elapsedDays} days, only ${workDoneFraction.done}/${workDoneFraction.total} of the work has been completed. How many extra men must be hired to finish the work on time, assuming all men work at the same rate?`,
      correctAnswer: extraMen,
      distractorHints: [
        "Residual_Work_Trap",
        "Denominator_Lag",
      ],
      reasoningSteps: [
        createReasoningStep(
          "transform",
          `Take the total work as ${men * totalDays} man-days.`,
        ),
        createReasoningStep(
          "filter",
          `Completed work = ${workDoneUnits} man-days, so remaining work = ${remainingWorkUnits} man-days.`,
        ),
        createReasoningStep(
          "infer",
          `To finish ${remainingWorkUnits} man-days in ${remainingDays} days, ${totalMenNeeded} men are needed. Extra men = ${extraMen}.`,
        ),
      ],
      context: buildContext(
        "contractor crew",
        "extra manpower",
        "construction deadline",
      ),
    },
    {
      motifId: "tw-contractor-pressure",
      scenarioLogicBranch:
        "deadline-recovery-extra-men",
      validationTokens: [
        "only",
        "extra men",
        "finish the work on time",
      ],
      signatureKeys: [
        "men",
        "totalDays",
        "elapsedDays",
        "workDoneNumerator",
        "workDoneDenominator",
      ],
    },
  );
}

export function createWageEfficiencyScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const ratioA = difficulty === "Hard" ? 5 : 3;
  const ratioB = difficulty === "Hard" ? 4 : 2;
  const totalWage = difficulty === "Hard" ? 5400 : 3000;
  const correctAnswer =
    (totalWage * ratioA) /
    (ratioA + ratioB);

  return {
    scenarioType:
      "wage-efficiency",
    topicCluster: "time-work",
    values: {
      ratioA,
      ratioB,
      totalWage,
    },
    text: `A and B do the same work together and their efficiencies are in the ratio ${ratioA}:${ratioB}. If they receive ₹${totalWage} in total, find A's share.`,
    correctAnswer,
    distractorHints: [
      "wrongEfficiencyBase",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        "Wages are shared in the ratio of contribution, which here follows efficiency.",
      ),
      createReasoningStep(
        "infer",
        `A's share = ₹${totalWage} x ${ratioA} / ${ratioA + ratioB} = ₹${correctAnswer}.`,
      ),
    ],
    context: buildContext(
      "workers",
      "wage share",
      "wages",
    ),
    motifId: "tw-wage-efficiency",
    scenarioLogicBranch:
      "share-by-efficiency-ratio",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-wage-efficiency",
        "share-by-efficiency-ratio",
        {
          ratioA,
          ratioB,
          totalWage,
        },
      ),
    validationTokens: [
      "efficiencies are in the ratio",
      "find A's share",
    ],
  };
}

export function createWageDaysWorkedScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const aRate = difficulty === "Hard" ? 5 : 4;
  const bRate = difficulty === "Hard" ? 3 : 2;
  const aDays = difficulty === "Hard" ? 8 : 6;
  const bDays = difficulty === "Hard" ? 6 : 5;
  const totalWage = difficulty === "Hard" ? 5280 : 2520;
  const aContribution = aRate * aDays;
  const bContribution = bRate * bDays;
  const correctAnswer =
    (totalWage * aContribution) /
    (aContribution + bContribution);

  return {
    scenarioType:
      "wage-days-worked",
    topicCluster: "time-work",
    values: {
      aRate,
      bRate,
      aDays,
      bDays,
      totalWage,
    },
    text: `A and B are paid ₹${totalWage} for a job. A can do ${aRate} units of work per day and works for ${aDays} days, while B can do ${bRate} units per day and works for ${bDays} days. Find A's wage share.`,
    correctAnswer,
    distractorHints: [
      "weightedEntityConfusion",
      "wrongIntermediateValue",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Contributions are proportional to rate x days worked.`,
      ),
      createReasoningStep(
        "aggregate",
        `A contributes ${aContribution} units and B contributes ${bContribution} units.`,
      ),
      createReasoningStep(
        "infer",
        `A's share = ₹${totalWage} x ${aContribution} / ${aContribution + bContribution} = ₹${correctAnswer}.`,
      ),
    ],
    context: buildContext(
      "workers",
      "wage share",
      "wages",
    ),
    motifId: "tw-wage-work-done",
    scenarioLogicBranch:
      "share-by-rate-times-days",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-wage-work-done",
        "share-by-rate-times-days",
        {
          aRate,
          bRate,
          aDays,
          bDays,
          totalWage,
        },
      ),
    validationTokens: [
      "works for",
      "wage share",
    ],
  };
}

export function createPipeSequentialScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const aRate = difficulty === "Hard" ? 4 : 3;
  const bRate = difficulty === "Hard" ? 5 : 4;
  const cRate = difficulty === "Hard" ? 6 : 5;
  const target = difficulty === "Hard" ? 74 : 48;
  const correctAnswer =
    difficulty === "Hard" ? 5 : 4;

  return {
    scenarioType:
      "pipe-sequential",
    topicCluster: "time-work",
    values: {
      aRate,
      bRate,
      cRate,
      target,
    },
    text: `Pipe A fills ${aRate} units per hour, pipe B fills ${bRate} units per hour, and pipe C fills ${cRate} units per hour. A is opened first, B one hour later, and C another hour later. If the tank needs ${target} units to fill, find the total time taken.`,
    correctAnswer,
    distractorHints: [
      "partialAggregation",
      "cumulativeMistake",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `Track volume hour by hour as new pipes are added to the system.`,
      ),
      createReasoningStep(
        "infer",
        `The tank fills after ${correctAnswer} hours in total.`,
      ),
    ],
    context: buildContext(
      "pipes",
      "fill time",
      "sequential opening",
    ),
    motifId: "tw-pipe-clock-sync",
    scenarioLogicBranch:
      "sequential-pipes-duration",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-pipe-clock-sync",
        "sequential-pipes-duration",
        {
          aRate,
          bRate,
          cRate,
          target,
        },
      ),
    validationTokens: [
      "opened first",
      "one hour later",
    ],
  };
}

export function createPipeCapacityScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const rate = difficulty === "Hard" ? 45 : 30;
  const time = difficulty === "Hard" ? 8 : 6;
  const correctAnswer = rate * time;

  return {
    scenarioType:
      "pipe-capacity-volume",
    topicCluster: "time-work",
    values: {
      rate,
      time,
    },
    text: `A pipe fills a tank at the rate of ${rate} litres per minute. If the pipe runs for ${time} minutes, find the capacity of the tank that gets completely filled.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "rateTimeSwap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Capacity = rate x time.`,
      ),
      createReasoningStep(
        "infer",
        `So the capacity is ${correctAnswer} litres.`,
      ),
    ],
    context: buildContext(
      "tank",
      "capacity",
      "pipes",
    ),
    motifId: "tw-pipe-fill-leak",
    scenarioLogicBranch:
      "capacity-from-rate-and-time",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-pipe-fill-leak",
        "capacity-from-rate-and-time",
        {
          rate,
          time,
        },
      ),
    validationTokens: [
      "litres per minute",
      "capacity of the tank",
    ],
  };
}

export function createPipeClockSyncScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const aRate = difficulty === "Hard" ? 8 : 6;
  const bRate = difficulty === "Hard" ? 10 : 8;
  const startHour = difficulty === "Hard" ? 9 : 10;
  const bStartsAfter =
    difficulty === "Hard" ? 2 : 1;
  const totalWork = difficulty === "Hard" ? 96 : 56;
  const firstSnapshot = createWorkSnapshot(
    "a-only",
    totalWork,
    0,
    aRate,
    bStartsAfter,
  );
  const remainingWork =
    firstSnapshot.remainingWork;
  const jointHours =
    remainingWork / (aRate + bRate);
  const finishHour =
    startHour + bStartsAfter + jointHours;
  const finishLabel =
    `${Math.floor(finishHour)}:00`;

  return finalizeTimeWorkScenario(
    {
      scenarioType: "pipe-clock-sync",
      topicCluster: "time-work",
      values: {
        aRate,
        bRate,
        startHour,
        bStartsAfter,
        totalWork,
      },
      text: `Pipe A starts filling a tank at ${startHour}:00 and fills ${aRate} units per hour. Pipe B starts ${bStartsAfter} hour later and fills ${bRate} units per hour. If the tank requires ${totalWork} units, at what time will the tank be full?`,
      correctAnswer: finishHour,
      distractorHints: [
        "Clock_Duration_Slip",
        "Joiner_Active_Omission",
      ],
      reasoningSteps: [
        createReasoningStep(
          "aggregate",
          `Before Pipe B starts, Pipe A fills ${firstSnapshot.unitsDone} units.`,
        ),
        createReasoningStep(
          "filter",
          `Remaining work = ${remainingWork} units.`,
        ),
        createReasoningStep(
          "infer",
          `Both pipes together finish the remaining work in ${jointHours} hours, so the tank fills at ${finishLabel}.`,
        ),
      ],
      explanation: `The tank becomes full at ${finishLabel}.`,
      context: buildContext(
        "tank",
        "clock finish time",
        "staggered pipes",
      ),
    },
    {
      motifId: "tw-pipe-clock-sync",
      scenarioLogicBranch:
        "time-of-day-staggered-pipes",
      validationTokens: [
        "at what time",
        "starts filling a tank",
      ],
      signatureKeys: [
        "aRate",
        "bRate",
        "startHour",
        "bStartsAfter",
        "totalWork",
      ],
    },
  );
}

export function createPipeThresholdScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const totalWork = difficulty === "Hard" ? 100 : 80;
  const thresholdPercent =
    difficulty === "Hard" ? 60 : 50;
  const inletRate =
    difficulty === "Hard" ? 8 : 6;
  const outletRate =
    difficulty === "Hard" ? 3 : 2;
  const thresholdUnits =
    (totalWork * thresholdPercent) / 100;
  const timeToThreshold =
    thresholdUnits / inletRate;
  const remainingUnits =
    totalWork - thresholdUnits;
  const postThresholdTime =
    remainingUnits / (inletRate - outletRate);
  const correctAnswer =
    timeToThreshold + postThresholdTime;

  return finalizeTimeWorkScenario(
    {
      scenarioType: "pipe-threshold",
      topicCluster: "time-work",
      values: {
        totalWork,
        thresholdPercent,
        inletRate,
        outletRate,
      },
      text: `A tank is filled by an inlet at ${inletRate} units per hour. An outlet positioned at ${thresholdPercent}% of the tank's height starts draining ${outletRate} units per hour only after the water reaches that level. If the full tank holds ${totalWork} units, find the total time to fill the tank.`,
      correctAnswer,
      distractorHints: [
        "Midpoint_Neglect",
        "Sign_Inversion",
      ],
      reasoningSteps: [
        createReasoningStep(
          "aggregate",
          `Until the water reaches ${thresholdUnits} units, only the inlet works, taking ${timeToThreshold} hours.`,
        ),
        createReasoningStep(
          "filter",
          `After that threshold, net filling rate becomes ${inletRate - outletRate} units per hour.`,
        ),
        createReasoningStep(
          "infer",
          `The remaining ${remainingUnits} units take ${postThresholdTime} hours, so total time is ${correctAnswer} hours.`,
        ),
      ],
      context: buildContext(
        "threshold tank",
        "fill time",
        "height-gated outlet",
      ),
    },
    {
      motifId: "tw-pipe-threshold",
      scenarioLogicBranch:
        "height-gated-outlet-activation",
      validationTokens: [
        "starts draining",
        "only after the water reaches that level",
      ],
      signatureKeys: [
        "totalWork",
        "thresholdPercent",
        "inletRate",
        "outletRate",
      ],
    },
  );
}

export function createRegressiveClimbScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const target =
    difficulty === "Hard" ? 45 : 30;
  const up =
    difficulty === "Hard" ? 8 : 7;
  const slip =
    difficulty === "Hard" ? 3 : 2;
  let currentHeight = 0;
  let days = 0;

  while (currentHeight < target) {
    days += 1;
    currentHeight += up;
    if (currentHeight >= target) {
      break;
    }
    currentHeight -= slip;
  }

  return finalizeTimeWorkScenario(
    {
      scenarioType: "regressive-climb",
      topicCluster: "time-work",
      values: {
        target,
        up,
        slip,
      },
      text: `A climber moves up ${up} metres each day but slips back ${slip} metres each night. On which day will the climber first reach the top of a ${target}-metre wall?`,
      correctAnswer: days,
      distractorHints: [
        "Goal_Overshoot",
        "Regression_Net_Flat",
      ],
      reasoningSteps: [
        createReasoningStep(
          "aggregate",
          `Each full day-night cycle gives a net gain of ${up - slip} metres, but the final day must be checked separately.`,
        ),
        createReasoningStep(
          "infer",
          `The climber first touches the top on day ${days}.`,
        ),
      ],
      context: buildContext(
        "climber",
        "first-touch day",
        "regressive climb",
      ),
    },
    {
      motifId: "tw-regressive-climb",
      scenarioLogicBranch:
        "first-touch-before-night-slip",
      validationTokens: [
        "slips back",
        "first reach the top",
      ],
      signatureKeys: ["target", "up", "slip"],
    },
  );
}

export function createVariableRateScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const initialRate = difficulty === "Hard" ? 4 : 3;
  const doubledAfter = difficulty === "Hard" ? 5 : 4;
  const totalWork = difficulty === "Hard" ? 60 : 36;
  const firstPhase = initialRate * doubledAfter;
  const remaining = totalWork - firstPhase;
  const correctAnswer =
    doubledAfter + remaining / (2 * initialRate);

  return {
    scenarioType:
      "work-variable-rate",
    topicCluster: "time-work",
    values: {
      initialRate,
      doubledAfter,
      totalWork,
    },
    text: `A worker completes ${initialRate} units of work per day for the first ${doubledAfter} days. After that, the worker's rate doubles. If the total work is ${totalWork} units, find the total number of days required.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "cumulativeMistake",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `In the first phase, ${firstPhase} units are completed.`,
      ),
      createReasoningStep(
        "filter",
        `Remaining work = ${remaining} units, done at ${2 * initialRate} units per day.`,
      ),
      createReasoningStep(
        "infer",
        `Total time = ${doubledAfter} + ${remaining}/${2 * initialRate} = ${correctAnswer} days.`,
      ),
    ],
    context: buildDefaultContext(),
    motifId: "tw-stage-join-start",
    scenarioLogicBranch:
      "midstream-rate-change",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-stage-join-start",
        "midstream-rate-change",
        {
          initialRate,
          doubledAfter,
          totalWork,
        },
      ),
    validationTokens: [
      "rate doubles",
      "total work",
    ],
  };
}

export function createPartialTargetScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const days = difficulty === "Hard" ? 20 : 15;
  const targetFraction =
    difficulty === "Hard" ? 0.75 : 0.6;
  const correctAnswer =
    days * targetFraction;

  return {
    scenarioType:
      "work-partial-target",
    topicCluster: "time-work",
    values: {
      days,
      targetFraction,
    },
    text: `A worker can complete a job in ${days} days. In how many days will the worker complete ${targetFraction * 100}% of the work?`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "incorrectResidualAllocation",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Time for a fraction of work scales directly with the same fraction of the total time.`,
      ),
      createReasoningStep(
        "infer",
        `${targetFraction * 100}% of ${days} days = ${correctAnswer} days.`,
      ),
    ],
    context: buildDefaultContext(),
    motifId: "tw-stage-handoff",
    scenarioLogicBranch:
      "fraction-of-total-target",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-stage-handoff",
        "fraction-of-total-target",
        {
          days,
          targetFraction,
        },
      ),
    validationTokens: [
      "% of the work",
      "complete a job",
    ],
  };
}

export function createNegativeWorkDestroyScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const buildRate = difficulty === "Hard" ? 9 : 7;
  const destroyRate = difficulty === "Hard" ? 4 : 3;
  const totalWork = difficulty === "Hard" ? 65 : 44;
  const correctAnswer =
    totalWork / (buildRate - destroyRate);

  return {
    scenarioType:
      "negative-work-destroy",
    topicCluster: "time-work",
    values: {
      buildRate,
      destroyRate,
      totalWork,
    },
    text: `A mason builds a wall at ${buildRate} units per day while another worker breaks ${destroyRate} units per day. If the wall requires ${totalWork} units of work, how many days will it take to complete the wall?`,
    correctAnswer,
    distractorHints: [
      "signError",
      "wrongIntermediateValue",
    ],
    reasoningSteps: [
      createReasoningStep(
        "filter",
        `Net progress per day = ${buildRate} - ${destroyRate} = ${buildRate - destroyRate} units.`,
      ),
      createReasoningStep(
        "infer",
        `Required time = ${totalWork}/${buildRate - destroyRate} = ${correctAnswer} days.`,
      ),
    ],
    context: buildContext(
      "workers",
      "wall completion time",
      "build and destroy",
    ),
    motifId: "tw-regressive-climb",
    scenarioLogicBranch:
      "signed-work-build-vs-break",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-regressive-climb",
        "signed-work-build-vs-break",
        {
          buildRate,
          destroyRate,
          totalWork,
        },
      ),
    validationTokens: [
      "builds a wall",
      "breaks",
    ],
  };
}

export function createResourceConsumptionScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const workers =
    difficulty === "Hard" ? 60 : 48;
  const totalDays =
    difficulty === "Hard" ? 36 : 30;
  const elapsedDays =
    difficulty === "Hard" ? 12 : 10;
  const leavingWorkers =
    difficulty === "Hard" ? 12 : 8;
  const remainingWorkers =
    workers - leavingWorkers;
  const totalWorkerDays =
    workers * totalDays;
  const consumedWorkerDays =
    workers * elapsedDays;
  const remainingWorkerDays =
    totalWorkerDays -
    consumedWorkerDays;
  const correctAnswer =
    remainingWorkerDays /
    remainingWorkers;

  return {
    scenarioType: "resource-consumption",
    topicCluster: "time-work",
    values: {
      workers,
      totalDays,
      elapsedDays,
      leavingWorkers,
      remainingWorkers,
    },
    text: `A camp has provisions for ${workers} workers for ${totalDays} days. After ${elapsedDays} days, ${leavingWorkers} workers leave the camp. For how many more days will the remaining provisions last?`,
    correctAnswer,
    distractorHints: [
      "weightedEntityConfusion",
      "incorrectResidualAllocation",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Total provisions equal ${workers} x ${totalDays} = ${totalWorkerDays} worker-days.`,
      ),
      createReasoningStep(
        "filter",
        `The first ${elapsedDays} days consume ${consumedWorkerDays} worker-days, leaving ${remainingWorkerDays} worker-days.`,
      ),
      createReasoningStep(
        "infer",
        `After ${leavingWorkers} workers leave, ${remainingWorkers} workers remain, so the provisions last ${correctAnswer} more days.`,
      ),
    ],
    context: {
      entity: "workers",
      metric: "provision duration",
      context: "camp",
    },
    motifId: "tw-group-mdh-standard",
    scenarioLogicBranch:
      "worker-day-conservation",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-group-mdh-standard",
        "worker-day-conservation",
        {
          workers,
          totalDays,
          elapsedDays,
          leavingWorkers,
        },
      ),
    validationTokens: [
      "provisions for",
      "leave the camp",
    ],
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
  const combinedNumerator =
    pair.a * pair.b;
  const combinedDenominator =
    pair.a + pair.b;
  const combinedDays =
    combinedNumerator /
    combinedDenominator;
  const combinedDaysLabel =
    formatMathFraction(
      combinedNumerator,
      combinedDenominator,
    );

  return {
    scenarioType: "inverse-work",
    topicCluster: "time-work",
    values: {
      a: pair.a,
      combinedDays,
    },
    text: `A and B together can complete a piece of work in ${combinedDaysLabel} days. A alone takes ${formatMathNumber(pair.a)} days. In how many days can B alone complete the work?`,
    correctAnswer: pair.b,
    distractorHints: [
      "inverseRelationMiss",
      "wrongEfficiencyBase",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Convert the times into rates: A's rate is $\\frac{1}{${pair.a}}$, while the combined rate is $\\frac{1}{${combinedDaysLabel.replace(/\$/g, "")}}$.`,
      ),
      createReasoningStep(
        "filter",
        "Subtract A's rate from the combined rate to isolate B's rate.",
      ),
      createReasoningStep(
        "reverse",
        `Taking the reciprocal of B's rate gives B's time as ${formatMathNumber(pair.b)} days.`,
      ),
    ],
    context: buildDefaultContext(),
    motifId: "tw-component-extract",
    scenarioLogicBranch:
      "combined-minus-known-single",
    structuralSignature:
      buildTimeWorkStructuralSignature(
        "tw-component-extract",
        "combined-minus-known-single",
        {
          a: pair.a,
          combinedDays,
        },
      ),
    validationTokens: [
      "together can complete",
      "A alone takes",
    ],
  };
}

export function createTimeWorkScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario | null {
  const topicKey = [
    pattern.topic,
    pattern.subtopic,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .trim();

  if (
    !topicKey.includes("time-work") &&
    !topicKey.includes("time & work")
  ) {
    return null;
  }

  const scenarioFactoriesByMotif: Record<
    string,
    TimeWorkScenarioFactory[]
  > = {
    "tw-basic-2-sum": [
      createSimpleCombinedWorkScenario,
    ],
    "tw-basic-3-sum": [
      createThreeWorkerCombinedScenario,
    ],
    "tw-component-extract": [
      createComponentExtractScenario,
      createInverseWorkScenario,
    ],
    "tw-eff-integer": [
      createEfficiencyNumericalScenario,
      createWorkerEquivalenceScenario,
    ],
    "tw-eff-pct-boost": [
      createEfficiencyPercentageScenario,
    ],
    "tw-eff-pct-reduce": [
      createEfficiencyPercentageReduceScenario,
    ],
    "tw-comparison-hidden": [
      createHiddenComparisonScenario,
    ],
    "tw-stage-join-start": [
      createDelayedJoinScenario,
    ],
    "tw-stage-leave-start": [
      createStageLeaveStartScenario,
    ],
    "tw-stage-deadline-exit": [
      createStageLeaveEndScenario,
    ],
    "tw-stage-asymmetric-3": [
      createStageAsymmetricThreeScenario,
    ],
    "tw-stage-handoff": [
      createStageHandoffScenario,
      createPartialTargetScenario,
    ],
    "tw-stage-staggered-join": [
      createStageStaggeredJoinScenario,
    ],
    "tw-cycle-alternate-2": [
      createAlternatingOperationScenario,
    ],
    "tw-cycle-alternate-3": [
      createThreeCycleScenario,
    ],
    "tw-cycle-assist-single": [
      createCyclicAssistedScenario,
    ],
    "tw-cycle-assist-group": [
      createCyclicAssistGroupScenario,
    ],
    "tw-cycle-helper-toggle": [
      createHelperToggleScenario,
    ],
    "tw-group-mdh-standard": [
      createChainRuleMDHScenario,
      createResourceConsumptionScenario,
    ],
    "tw-group-equivalence-or": [
      createGroupBridgeOrScenario,
    ],
    "tw-group-system-and": [
      createGroupBridgeAndScenario,
    ],
    "tw-contractor-pressure": [
      createContractorPressureScenario,
    ],
    "tw-wage-efficiency": [
      createWageEfficiencyScenario,
    ],
    "tw-wage-work-done": [
      createWageDaysWorkedScenario,
    ],
    "tw-pipe-fill-leak": [
      createPipeFillingLeakScenario,
    ],
    "tw-pipe-clock-sync": [
      createPipeClockSyncScenario,
      createPipeSequentialScenario,
    ],
    "tw-pipe-threshold": [
      createPipeThresholdScenario,
    ],
    "tw-regressive-climb": [
      createRegressiveClimbScenario,
      createNegativeWorkDestroyScenario,
    ],
    "basic-unit-rate": [
      createSimpleCombinedWorkScenario,
    ],
    "efficiency-percentage": [
      createEfficiencyPercentageScenario,
    ],
    "efficiency-numerical": [
      createEfficiencyNumericalScenario,
    ],
    "simple-combined-work": [
      createSimpleCombinedWorkScenario,
    ],
    "stage-leave-start": [
      createStageLeaveStartScenario,
    ],
    "stage-leave-end": [
      createStageLeaveEndScenario,
    ],
    "stage-join-delayed": [
      createDelayedJoinScenario,
    ],
    "delayed-join": [
      createDelayedJoinScenario,
    ],
    "cyclic-simple": [
      createAlternatingOperationScenario,
    ],
    "alternating-operation": [
      createAlternatingOperationScenario,
    ],
    "cyclic-assisted": [
      createCyclicAssistedScenario,
    ],
    "chain-rule-mdh": [
      createChainRuleMDHScenario,
    ],
    "group-bridge-or": [
      createGroupBridgeOrScenario,
    ],
    "group-bridge-and": [
      createGroupBridgeAndScenario,
    ],
    "wage-efficiency": [
      createWageEfficiencyScenario,
    ],
    "wage-days-worked": [
      createWageDaysWorkedScenario,
    ],
    "pipe-filling-leak": [
      createPipeFillingLeakScenario,
    ],
    "pipe-sequential": [
      createPipeSequentialScenario,
    ],
    "pipe-capacity-volume": [
      createPipeCapacityScenario,
    ],
    "work-variable-rate": [
      createVariableRateScenario,
    ],
    "work-partial-target": [
      createPartialTargetScenario,
    ],
    "negative-work-destroy": [
      createNegativeWorkDestroyScenario,
    ],
    "positive-negative-competition": [
      createPositiveNegativeCompetitionScenario,
    ],
    "worker-equivalence": [
      createWorkerEquivalenceScenario,
    ],
    "resource-consumption": [
      createResourceConsumptionScenario,
    ],
    "efficiency-substitution": [
      createEfficiencyPercentageScenario,
      createEfficiencyNumericalScenario,
      createWorkerEquivalenceScenario,
      createDelayedJoinScenario,
      createAlternatingOperationScenario,
    ],
    "inverse-work-trap": [
      createInverseWorkScenario,
      createStageLeaveEndScenario,
      createPositiveNegativeCompetitionScenario,
      createDelayedJoinScenario,
    ],
  };

  const scenarioFactories =
    pattern.id.startsWith(
      "registry-time-work-phases-",
    )
      ? [
          createDelayedJoinScenario,
          createStageLeaveStartScenario,
          createStageLeaveEndScenario,
          createStageAsymmetricThreeScenario,
          createStageHandoffScenario,
          createStageStaggeredJoinScenario,
          createVariableRateScenario,
        ]
      : pattern.id.startsWith(
            "registry-time-work-efficiency-",
          )
        ? [
            createEfficiencyPercentageScenario,
            createEfficiencyPercentageReduceScenario,
            createEfficiencyNumericalScenario,
            createHiddenComparisonScenario,
            createWorkerEquivalenceScenario,
            createGroupBridgeOrScenario,
            createGroupBridgeAndScenario,
            createWageEfficiencyScenario,
            createWageDaysWorkedScenario,
          ]
        : pattern.id.startsWith(
              "registry-time-work-pipes-",
            )
          ? [
              createPipeFillingLeakScenario,
              createPipeClockSyncScenario,
              createPipeThresholdScenario,
              createRegressiveClimbScenario,
              createPipeSequentialScenario,
              createPipeCapacityScenario,
            ]
          : motif?.id
            ? scenarioFactoriesByMotif[
                motif.id
              ]
            : [
        createSimpleCombinedWorkScenario,
        createThreeWorkerCombinedScenario,
        createComponentExtractScenario,
        createEfficiencyPercentageReduceScenario,
        createHiddenComparisonScenario,
        createDelayedJoinScenario,
        createStageLeaveStartScenario,
        createStageLeaveEndScenario,
        createStageAsymmetricThreeScenario,
        createStageHandoffScenario,
        createStageStaggeredJoinScenario,
        createAlternatingOperationScenario,
        createThreeCycleScenario,
        createCyclicAssistedScenario,
        createCyclicAssistGroupScenario,
        createHelperToggleScenario,
        createEfficiencyPercentageScenario,
        createGroupBridgeOrScenario,
        createGroupBridgeAndScenario,
        createContractorPressureScenario,
        createWageEfficiencyScenario,
        createWageDaysWorkedScenario,
        createPipeFillingLeakScenario,
        createPipeClockSyncScenario,
        createPipeThresholdScenario,
        createRegressiveClimbScenario,
        createVariableRateScenario,
        createPartialTargetScenario,
        createNegativeWorkDestroyScenario,
        createResourceConsumptionScenario,
        createInverseWorkScenario,
      ];

  if (motif?.id && !scenarioFactories) {
    throw new Error(
      `No strict time-work scenario mapping exists for motif ${motif.id}.`,
    );
  }

  return pickRandomItem(
    scenarioFactories,
  )(difficulty, motif);
}
