import type {
  CanonicalPercentageProblem,
  Difficulty,
  Trap,
} from "./percentage-types";
import {
  generateDeterministicDistractors,
  marginConfusionDistractor,
  reverseDirectionDistractor,
  samePercentageAssumptionDistractor,
  simpleAdditionDistractor,
  type TrapCandidate,
  wrongBaseDistractor,
} from "./distractor-engine";
import {
  CLEAN_BASES,
  CLEAN_ELECTION_WINNER_PERCENTAGES,
  CLEAN_INTEGER_PERCENTAGES,
  CLEAN_MARGINS,
  CLEAN_MARK_PERCENTAGES,
  CLEAN_MIXTURE_SETUPS,
  CLEAN_MONEY_BASES,
  CLEAN_POPULATIONS,
} from "../utils/clean-number-pools";
import {
  applyPercentage,
  createSeededRandom,
  percentageOf,
  reversePercentage,
  roundClean,
  safeDivide,
  sanitizeValue,
  type SeededRandom,
} from "../utils/math-utils";
import { buildTopologyVariant } from "../reasoning/topology-builders";
import {
  selectElectionTopology,
  selectPassFailTopology,
  selectPopulationTopology,
} from "../reasoning/topology-selectors";
import { beautifyCanonicalValues } from "../realism/value-beautifier";

export type PercentageMotifFactoryInput =
  | number
  | string
  | SeededRandom;

export type PercentageMotifFactory = (
  input?: PercentageMotifFactoryInput,
) => CanonicalPercentageProblem;

function rngFromInput(input: PercentageMotifFactoryInput | undefined) {
  if (
    input &&
    typeof input === "object" &&
    "next" in input &&
    "int" in input &&
    "pick" in input
  ) {
    return input;
  }

  return createSeededRandom(input ?? 1);
}

function topologyFactorySeed(
  input: PercentageMotifFactoryInput | undefined,
  namespace: string,
) {
  if (
    input &&
    typeof input === "object" &&
    "int" in input
  ) {
    const value = input.int(1_000_000);
    return {
      selectionSeed: value,
      builderSeed: value,
    };
  }

  const seedValue = input ?? 1;
  return {
    selectionSeed: seedValue,
    builderSeed: seedValue,
  };
}

function problem(
  data: Omit<CanonicalPercentageProblem, "concept" | "distractors"> & {
    candidates: readonly TrapCandidate[];
  },
): CanonicalPercentageProblem {
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
      candidates: data.candidates,
    }),
    traps: data.traps,
    difficulty: data.difficulty,
  });
}

function difficultyFromRates(rates: readonly number[]): Difficulty {
  return rates.some((rate) => Math.abs(rate) >= 40)
    ? "hard"
    : rates.some((rate) => Math.abs(rate) >= 25)
      ? "medium"
      : "easy";
}

export function createSuccessiveIncreaseDecreaseProblem(
  input?: PercentageMotifFactoryInput,
): CanonicalPercentageProblem {
  const rng = rngFromInput(input);
  const base = rng.pick(CLEAN_BASES);
  const firstRate = rng.pick([10, 20, 25, 40] as const);
  const secondRate = -rng.pick([5, 10, 20, 25] as const);
  const afterFirst = applyPercentage(base, firstRate);
  const answer = applyPercentage(afterFirst, secondRate);
  const simpleAdd = simpleAdditionDistractor(base, firstRate, secondRate);

  return problem({
    id: "successive_increase_decrease",
    category: "base_change",
    subtype: "increase_then_decrease",
    reasoningPattern: "successive_base_change",
    variables: {
      base,
      firstRate,
      secondRate,
      afterFirst,
    },
    answer,
    candidates: [
      simpleAdd,
      wrongBaseDistractor(base, secondRate, afterFirst),
      samePercentageAssumptionDistractor(base, firstRate),
      reverseDirectionDistractor(base, firstRate),
    ],
    traps: [
      "simple_addition",
      "wrong_base",
      "reverse_direction",
    ],
    difficulty: difficultyFromRates([firstRate, secondRate]),
  });
}

export function createElectionLeadProblem(
  input?: PercentageMotifFactoryInput,
): CanonicalPercentageProblem {
  const seed = topologyFactorySeed(input, "election_margin");
  return buildTopologyVariant(
    selectElectionTopology(seed.selectionSeed),
    seed.builderSeed,
  ).problem;
}

export function createPassFailProblem(
  input?: PercentageMotifFactoryInput,
): CanonicalPercentageProblem {
  const seed = topologyFactorySeed(input, "pass_fail");
  return buildTopologyVariant(
    selectPassFailTopology(seed.selectionSeed),
    seed.builderSeed,
  ).problem;
}

export function createReversePercentageProblem(
  input?: PercentageMotifFactoryInput,
): CanonicalPercentageProblem {
  const rng = rngFromInput(input);
  const whole = rng.pick(CLEAN_BASES);
  const percent = rng.pick(CLEAN_INTEGER_PERCENTAGES);
  const part = percentageOf(whole, percent);
  const answer = reversePercentage(part, percent);

  return problem({
    id: "reverse_percentage",
    category: "base_change",
    subtype: "reverse_percentage",
    reasoningPattern: "reverse_reconstruction",
    variables: {
      part,
      percent,
    },
    answer,
    candidates: [
      {
        trap: "wrong_base",
        value: percentageOf(part, percent),
      },
      samePercentageAssumptionDistractor(part, percent),
      reverseDirectionDistractor(part, percent),
      {
        trap: "reverse_direction",
        value: sanitizeValue(part - percent),
      },
    ],
    traps: [
      "wrong_base",
      "reverse_direction",
    ],
    difficulty: percent <= 10 ? "medium" : "easy",
  });
}

export function createRestoreValueProblem(
  input?: PercentageMotifFactoryInput,
): CanonicalPercentageProblem {
  const rng = rngFromInput(input);
  const cutPercent = rng.pick([10, 20, 25, 40, 50] as const);
  const remainingPercent = 100 - cutPercent;
  const answer = sanitizeValue((cutPercent * 100) / remainingPercent);

  return problem({
    id: "restore_original",
    category: "base_change",
    subtype: "restore_original",
    reasoningPattern: "reverse_reconstruction",
    variables: {
      cutPercent,
      remainingPercent,
    },
    answer,
    candidates: [
      {
        trap: "same_percentage_assumption",
        value: cutPercent,
      },
      {
        trap: "wrong_base",
        value: remainingPercent,
      },
      {
        trap: "reverse_direction",
        value: sanitizeValue(100 - answer),
      },
      samePercentageAssumptionDistractor(remainingPercent, cutPercent),
    ],
    traps: [
      "same_percentage_assumption",
      "wrong_base",
      "reverse_direction",
    ],
    difficulty: cutPercent >= 40 ? "medium" : "easy",
  });
}

export function createPopulationGrowthProblem(
  input?: PercentageMotifFactoryInput,
): CanonicalPercentageProblem {
  const seed = topologyFactorySeed(input, "population_growth");
  return buildTopologyVariant(
    selectPopulationTopology(seed.selectionSeed),
    seed.builderSeed,
  ).problem;
}

export function createSalaryRevisionProblem(
  input?: PercentageMotifFactoryInput,
): CanonicalPercentageProblem {
  const rng = rngFromInput(input);
  const oldSalary = rng.pick(CLEAN_MONEY_BASES);
  const revisionPercent = rng.pick([5, 10, 20, 25] as const);
  const newSalary = applyPercentage(oldSalary, revisionPercent);
  const answer = safeDivide((newSalary - oldSalary) * 100, oldSalary);

  return problem({
    id: "salary_revision",
    category: "finance",
    subtype: "salary_revision",
    reasoningPattern: "difference_mapping",
    variables: {
      oldSalary,
      newSalary,
      revisionPercent,
    },
    answer,
    candidates: [
      {
        trap: "wrong_base",
        value: safeDivide((newSalary - oldSalary) * 100, newSalary),
      },
      {
        trap: "simple_addition",
        value: sanitizeValue(newSalary - oldSalary),
      },
      reverseDirectionDistractor(revisionPercent, 10),
      samePercentageAssumptionDistractor(revisionPercent, revisionPercent),
    ],
    traps: [
      "wrong_base",
      "reverse_direction",
    ],
    difficulty: "easy",
  });
}

export function createPriceConsumptionProblem(
  input?: PercentageMotifFactoryInput,
): CanonicalPercentageProblem {
  const rng = rngFromInput(input);
  const priceIncreasePercent = rng.pick([10, 20, 25, 40, 50] as const);
  const answer = sanitizeValue(
    (priceIncreasePercent * 100) / (100 + priceIncreasePercent),
  );

  return problem({
    id: "price_consumption",
    category: "expenditure",
    subtype: "price_consumption",
    reasoningPattern: "fixed_base_relation",
    variables: {
      priceIncreasePercent,
    },
    answer,
    candidates: [
      {
        trap: "same_percentage_assumption",
        value: priceIncreasePercent,
      },
      {
        trap: "wrong_base",
        value: sanitizeValue(100 - priceIncreasePercent),
      },
      reverseDirectionDistractor(100, priceIncreasePercent),
      {
        trap: "reverse_direction",
        value: sanitizeValue(
          (priceIncreasePercent * 100) / (100 - priceIncreasePercent),
        ),
      },
    ],
    traps: [
      "wrong_base",
      "reverse_direction",
      "same_percentage_assumption",
    ],
    difficulty: priceIncreasePercent >= 40 ? "medium" : "easy",
  });
}

export function createProfitLossProblem(
  input?: PercentageMotifFactoryInput,
): CanonicalPercentageProblem {
  const rng = rngFromInput(input);
  const costPrice = rng.pick(CLEAN_BASES);
  const rate = rng.pick([10, 20, 25, 40] as const);
  const direction = rng.int(2) === 0 ? 1 : -1;
  const sellingPrice = applyPercentage(costPrice, direction * rate);
  const answer = safeDivide((sellingPrice - costPrice) * 100, costPrice);

  return problem({
    id: "profit_loss",
    category: "commercial",
    subtype: "profit_loss",
    reasoningPattern: "difference_mapping",
    variables: {
      costPrice,
      sellingPrice,
      direction,
    },
    answer,
    candidates: [
      {
        trap: "wrong_base",
        value: safeDivide((sellingPrice - costPrice) * 100, sellingPrice),
      },
      {
        trap: "reverse_direction",
        value: -answer,
      },
      {
        trap: "simple_addition",
        value: sanitizeValue(Math.abs(sellingPrice - costPrice)),
      },
      samePercentageAssumptionDistractor(Math.abs(answer), rate),
    ],
    traps: [
      "wrong_base",
      "reverse_direction",
    ],
    difficulty: rate >= 25 ? "medium" : "easy",
  });
}

export function createMixturePercentageProblem(
  input?: PercentageMotifFactoryInput,
): CanonicalPercentageProblem {
  const rng = rngFromInput(input);
  const setup = rng.pick(CLEAN_MIXTURE_SETUPS);
  const total = setup.total;
  const initialPercent = setup.initialPercent;
  const targetPercent = setup.targetPercent;
  const initialPure = percentageOf(total, initialPercent);
  const answer = safeDivide(
    total * (targetPercent - initialPercent),
    100 - targetPercent,
  );

  return problem({
    id: "mixture_percentage",
    category: "mixture",
    subtype: "mixture_percentage",
    reasoningPattern: "mixture_balance",
    variables: {
      total,
      initialPercent,
      targetPercent,
      initialPure,
    },
    answer,
    candidates: [
      {
        trap: "simple_addition",
        value: percentageOf(total, targetPercent - initialPercent),
      },
      {
        trap: "wrong_base",
        value: percentageOf(total, targetPercent),
      },
      {
        trap: "same_percentage_assumption",
        value: sanitizeValue(targetPercent - initialPercent),
      },
      reverseDirectionDistractor(total, targetPercent - initialPercent),
    ],
    traps: [
      "wrong_base",
      "simple_addition",
    ],
    difficulty: targetPercent >= 50 ? "medium" : "easy",
  });
}

export const PERCENTAGE_MOTIF_FACTORIES = {
  successiveIncreaseDecrease: createSuccessiveIncreaseDecreaseProblem,
  electionLead: createElectionLeadProblem,
  passFail: createPassFailProblem,
  reversePercentage: createReversePercentageProblem,
  restoreValue: createRestoreValueProblem,
  populationGrowth: createPopulationGrowthProblem,
  salaryRevision: createSalaryRevisionProblem,
  priceConsumption: createPriceConsumptionProblem,
  profitLoss: createProfitLossProblem,
  mixturePercentage: createMixturePercentageProblem,
} satisfies Record<string, PercentageMotifFactory>;

export const PERCENTAGE_MOTIF_FACTORY_LIST = Object.values(
  PERCENTAGE_MOTIF_FACTORIES,
);
