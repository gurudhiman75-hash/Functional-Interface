import type {
  CanonicalPercentageProblem,
  Difficulty,
  PercentageVennVisualPayload,
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
import { ADVANCED_PERCENTAGE_MOTIF_FACTORIES } from "./percentage-advanced-motifs";

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
    topology: data.topology,
    visual: data.visual,
  });
}

function difficultyFromRates(rates: readonly number[]): Difficulty {
  return rates.some((rate) => Math.abs(rate) >= 40)
    ? "hard"
    : rates.some((rate) => Math.abs(rate) >= 25)
      ? "medium"
      : "easy";
}

const RELATIONAL_PERCENTAGES = [10, 20, 25, 40, 50] as const;

function relationMultiplierPercent(percent: number, direction: number) {
  return direction === 1 ? 100 + percent : 100 - percent;
}

function relationDifficulty(relationCount: number, hasInverse: boolean): Difficulty {
  if (relationCount >= 3 || hasInverse) {
    return "hard";
  }
  if (relationCount === 2) {
    return "medium";
  }
  return "easy";
}

export function createRelationalPercentageProblem(
  input?: PercentageMotifFactoryInput,
): CanonicalPercentageProblem {
  const rng = rngFromInput(input);
  const variants = [
    "single_relation",
    "two_step_relation_chain",
    "three_step_relation_chain",
    "reverse_relation_inference",
    "ratio_percentage_bridge",
    "hidden_base_relation_chain",
  ] as const;
  const variant = rng.pick(variants);
  const relationCount =
    variant === "single_relation" || variant === "ratio_percentage_bridge"
      ? 1
      : variant === "two_step_relation_chain" ||
          variant === "reverse_relation_inference" ||
          variant === "hidden_base_relation_chain"
        ? 2
        : 3;
  const hasInverse =
    variant === "reverse_relation_inference" ||
    variant === "hidden_base_relation_chain";
  const directions = [1, -1, 1, -1].slice(0, relationCount);
  const relationPercents: number[] = Array.from({ length: relationCount }, (_, index) =>
    rng.pick(RELATIONAL_PERCENTAGES.slice(index % 2, index % 2 + 4)),
  );
  const multipliers = relationPercents.map((percent, index) =>
    relationMultiplierPercent(percent, directions[index] ?? 1),
  );
  let ratioNumerator = 0;
  let ratioDenominator = 0;

  if (variant === "ratio_percentage_bridge") {
    const ratioPairs = [
      [6, 5],
      [5, 4],
      [9, 8],
      [4, 5],
      [3, 4],
    ] as const;
    [ratioNumerator, ratioDenominator] = rng.pick(ratioPairs);
    multipliers[0] = sanitizeValue((ratioNumerator * 100) / ratioDenominator);
    relationPercents[0] = sanitizeValue(Math.abs(multipliers[0]! - 100));
    directions[0] = multipliers[0]! >= 100 ? 1 : -1;
  }

  let runningIndex = 100;
  const intermediateValues: number[] = [];
  for (const multiplier of multipliers) {
    runningIndex = sanitizeValue((runningIndex * multiplier) / 100);
    intermediateValues.push(runningIndex);
  }

  const answer = sanitizeValue(runningIndex - 100);
  const additive = sanitizeValue(
    relationPercents.reduce(
      (sum, percent, index) => sum + percent * (directions[index] ?? 1),
      0,
    ),
  );
  const inverseError = sanitizeValue((10000 / runningIndex) - 100);
  const wrongBase = sanitizeValue((relationPercents.at(-1) ?? 20) * (directions.at(-1) ?? 1));
  const normalizedToBase = sanitizeValue(runningIndex);

  const variables: Record<string, number> = {
    baseIndex: 100,
    relationCount,
    relation1Percent: relationPercents[0] ?? 0,
    relation1Direction: directions[0] === 1 ? 1 : 0,
    relation1Index: multipliers[0] ?? 100,
    afterRelation1: intermediateValues[0] ?? runningIndex,
    finalIndex: runningIndex,
  };
  if (relationCount >= 2) {
    variables.relation2Percent = relationPercents[1] ?? 0;
    variables.relation2Direction = directions[1] === 1 ? 1 : 0;
    variables.relation2Index = multipliers[1] ?? 100;
    variables.afterRelation2 = intermediateValues[1] ?? runningIndex;
  }
  if (relationCount >= 3) {
    variables.relation3Percent = relationPercents[2] ?? 0;
    variables.relation3Direction = directions[2] === 1 ? 1 : 0;
    variables.relation3Index = multipliers[2] ?? 100;
    variables.afterRelation3 = intermediateValues[2] ?? runningIndex;
  }
  if (variant === "ratio_percentage_bridge") {
    variables.ratioNumerator = ratioNumerator;
    variables.ratioDenominator = ratioDenominator;
  }

  const family =
    variant === "ratio_percentage_bridge"
      ? "percentage_ratio_hybrid"
      : variant === "reverse_relation_inference"
        ? "reverse_relation"
        : variant === "hidden_base_relation_chain"
          ? "inverse_percentage_mapping"
          : variant === "three_step_relation_chain"
            ? "multi_entity_percentage_network"
            : "relational_chain";

  return problem({
    id: "relational_percentage",
    category: variant === "ratio_percentage_bridge" ? "ratio_mapping" : "comparison",
    subtype: "relational_percentage",
    reasoningPattern: "relational_chain",
    variables,
    answer,
    candidates: [
      {
        trap: "simple_addition",
        value: additive,
      },
      {
        trap: "incorrect_inversion",
        value: inverseError,
      },
      {
        trap: "wrong_base",
        value: wrongBase,
      },
      {
        trap: "normalization_error",
        value: normalizedToBase,
      },
      {
        trap: "transitive_shortcut_error",
        value: sanitizeValue(additive + wrongBase),
      },
    ],
    traps: [
      "wrong_base",
      "incorrect_inversion",
      "normalization_error",
      "transitive_shortcut_error",
    ],
    difficulty: relationDifficulty(relationCount, hasInverse),
    topology: {
      family,
      variant,
      hiddenBase: hasInverse
        ? {
            baseVariable: "baseIndex",
            knownVariable: "afterRelation1",
            percentVariable: "relation1Index",
          }
        : undefined,
      misconceptionDistractors: [
        {
          misconception: "transitive_shortcut_error",
          value: additive,
        },
        {
          misconception: "incorrect_inversion",
          value: inverseError,
        },
        {
          misconception: "normalization_error",
          value: normalizedToBase,
        },
      ],
    },
  });
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
        value: safeDivide(part * 100, Math.max(1, 100 - percent)),
      },
      {
        trap: "simple_addition",
        value: sanitizeValue(part + Math.max(10, part * 0.25)),
      },
      {
        trap: "reverse_direction",
        value: sanitizeValue(answer + part),
      },
      {
        trap: "same_percentage_assumption",
        value: sanitizeValue(answer * ((100 + percent) / 100)),
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
        value: safeDivide((newSalary - oldSalary) * 100, oldSalary - (newSalary - oldSalary)),
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
  const variant = rng.pick(["standard", "fixed_expenditure_quantity", "partial_expenditure_adjustment"] as const);
  const priceIncreasePercent = rng.pick([10, 20, 25, 40, 50] as const);
  
  if (variant === "fixed_expenditure_quantity") {
    const originalPrice = rng.pick([100, 200, 400, 500, 1000] as const);
    const newPrice = originalPrice * (1 + priceIncreasePercent / 100);
    const quantityDifference = rng.pick([2, 4, 5, 10] as const);
    // (Total / originalPrice) - (Total / newPrice) = quantityDifference
    // Total * (newPrice - originalPrice) / (originalPrice * newPrice) = quantityDifference
    const totalExpenditure = quantityDifference * originalPrice * newPrice / (newPrice - originalPrice);
    
    return problem({
      id: "price_consumption",
      category: "expenditure",
      subtype: "price_consumption",
      reasoningPattern: "difference_mapping",
      variables: {
        priceIncreasePercent,
        quantityDifference,
        totalExpenditure,
        originalPrice,
        newPrice,
      },
      answer: originalPrice,
      candidates: [
        { trap: "wrong_base", value: newPrice },
        { trap: "simple_addition", value: originalPrice + quantityDifference },
        reverseDirectionDistractor(originalPrice, 10),
      ],
      traps: ["wrong_base", "simple_addition"],
      difficulty: "hard",
    });
  }
  
  if (variant === "partial_expenditure_adjustment") {
    const expenditureIncreasePercent = rng.pick([5, 10, 15] as const);
    const answer = sanitizeValue(((priceIncreasePercent - expenditureIncreasePercent) / (100 + priceIncreasePercent)) * 100);
    
    return problem({
      id: "price_consumption",
      category: "expenditure",
      subtype: "price_consumption",
      reasoningPattern: "fixed_base_relation",
      variables: {
        priceIncreasePercent,
        expenditureIncreasePercent,
      },
      answer,
      candidates: [
        { trap: "simple_addition", value: priceIncreasePercent - expenditureIncreasePercent },
        { trap: "wrong_base", value: ((priceIncreasePercent - expenditureIncreasePercent) / 100) * 100 },
        reverseDirectionDistractor(answer, 10),
      ],
      traps: ["wrong_base", "simple_addition"],
      difficulty: "hard",
    });
  }

  // Standard Variant
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

export function createTaxationProblem(
  input?: PercentageMotifFactoryInput,
): CanonicalPercentageProblem {
  const rng = rngFromInput(input);
  const income = rng.pick([40000, 50000, 60000, 80000, 100000] as const);
  const rate1 = rng.pick([5, 10, 15, 20, 25] as const);
  let rate2: number = rng.pick([5, 10, 15, 20, 25] as const);
  if (rate1 === rate2) rate2 = rate1 > 5 ? rate1 - 5 : rate1 + 5;
  
  const oldTaxRate = Math.max(rate1, rate2);
  const newTaxRate = Math.min(rate1, rate2);
  
  const oldTax = percentageOf(income, oldTaxRate);
  const newTax = percentageOf(income, newTaxRate);
  
  const taxDifference = oldTax - newTax;
  const taxRateDifference = oldTaxRate - newTaxRate;
  
  return problem({
    id: "taxation",
    category: "commercial",
    subtype: "taxation",
    reasoningPattern: "difference_mapping",
    variables: {
      income,
      oldTaxRate,
      newTaxRate,
      taxRateDifference,
      taxDifference,
    },
    answer: income,
    candidates: [
      {
        trap: "simple_addition",
        value: taxDifference,
      },
      {
        trap: "wrong_base",
        value: percentageOf(income, oldTaxRate),
      },
      {
        trap: "same_percentage_assumption",
        value: taxDifference + 1000,
      },
      reverseDirectionDistractor(income, oldTaxRate - newTaxRate),
    ],
    traps: ["simple_addition", "wrong_base"],
    difficulty: "medium",
  });
}

export function createVennDiagramProblem(
  input?: PercentageMotifFactoryInput,
): CanonicalPercentageProblem {
  const rng = rngFromInput(input);
  const total = rng.pick([400, 500, 600, 800, 1000, 1200, 1500, 2000] as const);
  
  const onlyAPct = rng.pick([20, 25, 30, 35, 40] as const);
  const onlyBPct = rng.pick([15, 20, 25, 30] as const);
  const bothPct = rng.pick([10, 15, 20, 25] as const);
  const nonePct = 100 - (onlyAPct + onlyBPct + bothPct);
  
  const subjectA = onlyAPct + bothPct;
  const subjectB = onlyBPct + bothPct;
  const neitherValue = percentageOf(total, nonePct);
  const visual = createVennVisual({
    subjectA,
    subjectB,
    bothPct,
    nonePct,
    onlyAPct,
    onlyBPct,
  });
  
  return problem({
    id: "venn_diagram",
    category: "data_interpretation",
    subtype: "venn_diagram",
    reasoningPattern: "difference_mapping",
    variables: {
      total,
      subjectA,
      subjectB,
      bothPct,
      nonePct,
      neitherValue,
    },
    visual,
    answer: total,
    candidates: [
      {
        trap: "simple_addition",
        value: Math.round(neitherValue / ((subjectA + subjectB) / 100)),
      },
      {
        trap: "wrong_base",
        value: total + 200,
      },
      {
        trap: "ratio_confusion",
        value: total - 100,
      },
      reverseDirectionDistractor(total, subjectA),
    ],
    traps: ["simple_addition", "wrong_base"],
    difficulty: "medium",
  });
}

function createVennVisual(input: {
  subjectA: number;
  subjectB: number;
  bothPct: number;
  nonePct: number;
  onlyAPct: number;
  onlyBPct: number;
}): PercentageVennVisualPayload {
  const visual: PercentageVennVisualPayload = {
    type: "venn",
    sets: [
      { id: "A", label: "Math", value: input.subjectA },
      { id: "B", label: "English", value: input.subjectB },
    ],
    intersection: input.bothPct,
    universe: 100,
    outside: input.nonePct,
    unit: "%",
    regions: {
      onlyA: input.onlyAPct,
      onlyB: input.onlyBPct,
      both: input.bothPct,
      neither: input.nonePct,
    },
    labels: {
      en: {
        onlyA: "only Math",
        onlyB: "only English",
        both: "both",
        neither: "neither",
        universe: "total students",
      },
      hi: {
        onlyA: "केवल गणित",
        onlyB: "केवल अंग्रेज़ी",
        both: "दोनों",
        neither: "कोई नहीं",
        universe: "कुल विद्यार्थी",
      },
      pa: {
        onlyA: "ਕੇਵਲ ਗਣਿਤ",
        onlyB: "ਕੇਵਲ ਅੰਗਰੇਜ਼ੀ",
        both: "ਦੋਵੇਂ",
        neither: "ਕੋਈ ਨਹੀਂ",
        universe: "ਕੁੱਲ ਵਿਦਿਆਰਥੀ",
      },
    },
  };

  return {
    ...visual,
    svg: renderVennSvg(visual),
  };
}

function renderVennSvg(visual: Omit<PercentageVennVisualPayload, "svg">) {
  const unit = visual.unit;
  const esc = (value: string) =>
    value
      .replace(/&/gu, "&amp;")
      .replace(/</gu, "&lt;")
      .replace(/>/gu, "&gt;")
      .replace(/"/gu, "&quot;");
  const fmt = (value: number) => `${Number.isInteger(value) ? value : value.toFixed(2)}${unit}`;

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 260" role="img" aria-label="Venn diagram for two subject sets">',
    '<rect x="12" y="18" width="436" height="218" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>',
    '<circle cx="185" cy="130" r="82" fill="#60a5fa" fill-opacity="0.28" stroke="#2563eb" stroke-width="2"/>',
    '<circle cx="275" cy="130" r="82" fill="#34d399" fill-opacity="0.28" stroke="#059669" stroke-width="2"/>',
    `<text x="142" y="48" fill="#1e3a8a" font-size="15" font-weight="700">${esc(visual.sets[0].label)} (${fmt(visual.sets[0].value)})</text>`,
    `<text x="258" y="48" fill="#065f46" font-size="15" font-weight="700">${esc(visual.sets[1].label)} (${fmt(visual.sets[1].value)})</text>`,
    `<text x="144" y="126" text-anchor="middle" fill="#0f172a" font-size="13">${esc(visual.labels.en.onlyA)}</text>`,
    `<text x="144" y="145" text-anchor="middle" fill="#0f172a" font-size="18" font-weight="700">${fmt(visual.regions.onlyA)}</text>`,
    `<text x="230" y="126" text-anchor="middle" fill="#0f172a" font-size="13">${esc(visual.labels.en.both)}</text>`,
    `<text x="230" y="145" text-anchor="middle" fill="#0f172a" font-size="18" font-weight="700">${fmt(visual.regions.both)}</text>`,
    `<text x="316" y="126" text-anchor="middle" fill="#0f172a" font-size="13">${esc(visual.labels.en.onlyB)}</text>`,
    `<text x="316" y="145" text-anchor="middle" fill="#0f172a" font-size="18" font-weight="700">${fmt(visual.regions.onlyB)}</text>`,
    `<text x="230" y="216" text-anchor="middle" fill="#475569" font-size="13">${esc(visual.labels.en.neither)} / outside = ${fmt(visual.regions.neither)}</text>`,
    `<text x="230" y="238" text-anchor="middle" fill="#475569" font-size="12">${esc(visual.labels.en.universe)} = ${fmt(visual.universe)}</text>`,
    "</svg>",
  ].join("");
}

export function createCommissionProblem(
  input?: PercentageMotifFactoryInput,
): CanonicalPercentageProblem {
  const rng = rngFromInput(input);
  const baseSales = rng.pick([10000, 15000, 20000] as const);
  const totalSales = rng.pick(
    ([20000, 25000, 30000, 40000, 50000] as const).filter((value) => value > baseSales),
  );
  const baseCommissionRate = rng.pick([5, 8, 10] as const);
  const bonusRate = rng.pick([2, 3, 4, 5] as const);
  
  const baseCommission = percentageOf(baseSales, baseCommissionRate);
  const excessSales = totalSales - baseSales;
  const bonusCommission = percentageOf(excessSales, baseCommissionRate + bonusRate);
  const totalCommission = baseCommission + bonusCommission;
  const totalBonusRate = baseCommissionRate + bonusRate;
  const nearLow = sanitizeValue(Math.max(baseSales + 1000, totalSales * 0.72));
  const nearHigh = sanitizeValue(totalSales * 1.28);
  const wrongRateBase = sanitizeValue(
    baseSales + safeDivide((totalCommission - baseCommission) * 100, Math.max(1, baseCommissionRate)),
  );
  const boundedWrongRateBase = sanitizeValue(
    Math.min(totalSales * 1.35, Math.max(Math.max(baseSales + 500, totalSales * 0.65), wrongRateBase)),
  );
  
  return problem({
    id: "commission",
    category: "commercial",
    subtype: "commission",
    reasoningPattern: "successive_base_change",
    variables: {
      totalSales,
      baseSales,
      baseCommissionRate,
      bonusRate,
      baseCommission,
      excessSales,
      totalBonusRate,
      totalCommission,
    },
    answer: totalSales,
    candidates: [
      {
        trap: "simple_addition",
        value: nearLow,
      },
      {
        trap: "wrong_base",
        value: boundedWrongRateBase,
      },
      {
        trap: "same_percentage_assumption",
        value: nearHigh,
      },
      {
        trap: "reverse_direction",
        value: sanitizeValue(Math.max(baseSales + 800, totalSales * 0.9)),
      },
    ],
    traps: ["simple_addition", "wrong_base"],
    difficulty: "hard",
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
  relationalPercentage: createRelationalPercentageProblem,
  taxation: createTaxationProblem,
  commission: createCommissionProblem,
  vennDiagram: createVennDiagramProblem,
  ...ADVANCED_PERCENTAGE_MOTIF_FACTORIES,
} satisfies Record<string, PercentageMotifFactory>;

export const PERCENTAGE_MOTIF_FACTORY_LIST = Object.entries(
  PERCENTAGE_MOTIF_FACTORIES,
)
  .filter(([key]) => !key.startsWith("perc_"))
  .map(([, factory]) => factory);
