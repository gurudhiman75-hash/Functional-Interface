import type {
  CanonicalPercentageProblem,
  Difficulty,
  ReasoningPattern,
  Trap,
} from "./percentage-types";
import {
  generateDeterministicDistractors,
  type TrapCandidate,
} from "./distractor-engine";
import {
  createSeededRandom,
  roundClean,
  sanitizeValue,
  type SeededRandom,
} from "../utils/math-utils";
import type { ReasoningGraph, ReasoningStep } from "../reasoning/reasoning-graph-types";
import type { LanguageCode, LocalizedRealization } from "../localization/contracts/language-contracts";
import type { EditorialRealization } from "../editorial/editorial-types";

export const ADVANCED_PERCENTAGE_MOTIF_IDS = [
  "perc_geom_dimensional_scale",
  "perc_demo_cross_tab_literacy",
  "perc_budget_cascading_remainder",
  "perc_const_absolute_offset",
  "perc_exam_weighted_aggregate",
  "perc_asset_variable_depreciation",
  "perc_workforce_hierarchical_attrition",
  "perc_elect_three_candidate_forfeiture",
  "perc_agri_land_yield_compound",
  "perc_demo_multi_factor_growth",
  "perc_comm_tiered_salary_override",
  "perc_asset_compound_leakage",
  "perc_num_linear_equation_balancing",
  "perc_num_fractional_perturbation_complex",
  "perc_tax_bracket_retained_income",
  "perc_num_square_proportional_delta",
  "perc_mix_alloy_replacement",
] as const;

export type AdvancedPercentageMotifId = typeof ADVANCED_PERCENTAGE_MOTIF_IDS[number];
type AdvancedFactoryInput = number | string | SeededRandom;

const PERCENT_ANSWER_IDS = new Set<AdvancedPercentageMotifId>([
  "perc_geom_dimensional_scale",
  "perc_demo_cross_tab_literacy",
  "perc_exam_weighted_aggregate",
  "perc_asset_variable_depreciation",
  "perc_workforce_hierarchical_attrition",
  "perc_agri_land_yield_compound",
  "perc_demo_multi_factor_growth",
  "perc_asset_compound_leakage",
  "perc_num_fractional_perturbation_complex",
  "perc_num_square_proportional_delta",
  "perc_mix_alloy_replacement",
]);

function rngFromInput(input: AdvancedFactoryInput | undefined) {
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

function n(value: number | undefined) {
  if (typeof value !== "number") return "";
  const rounded = roundClean(value, 2);
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/0+$/u, "").replace(/\.$/u, "");
}

function pct(value: number | undefined) {
  return `${n(value)}%`;
}

function money(value: number | undefined) {
  return `₹${n(value)}`;
}

function cleanVariables(values: Record<string, number>) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, sanitizeValue(value)]),
  );
}

function makeProblem(input: {
  id: AdvancedPercentageMotifId;
  category: CanonicalPercentageProblem["category"];
  reasoningPattern: ReasoningPattern;
  variables: Record<string, number>;
  answer: number;
  candidates: readonly TrapCandidate[];
  traps: Trap[];
  difficulty: Difficulty;
}): CanonicalPercentageProblem {
  const variables = cleanVariables({
    ...input.variables,
    answerIsPercentage: PERCENT_ANSWER_IDS.has(input.id) ? 1 : 0,
  });
  const answer = sanitizeValue(input.answer);

  return {
    id: input.id,
    concept: "percentage",
    category: input.category,
    subtype: input.id,
    reasoningPattern: input.reasoningPattern,
    variables,
    answer,
    distractors: generateDeterministicDistractors({
      answer,
      candidates: input.candidates,
    }),
    traps: input.traps,
    difficulty: input.difficulty,
  };
}

function percentCandidates(answer: number, direct: number, wrongBase: number, average?: number) {
  const delta = Math.max(5, Math.round(Math.abs(answer) / 4));
  const positivePercent = (value: number) => sanitizeValue(Math.max(1, value));
  return [
    { trap: "simple_addition", value: positivePercent(direct) },
    { trap: "wrong_base", value: positivePercent(wrongBase) },
    { trap: "same_percentage_assumption", value: positivePercent(average ?? answer + delta) },
    { trap: "reverse_direction", value: positivePercent(answer - delta) },
  ] satisfies TrapCandidate[];
}

function nearAbsoluteCandidates(answer: number, floor: number, trapValue: number) {
  const clean = (value: number) => {
    const step = answer >= 10_000 ? 1000 : answer >= 1000 ? 100 : 10;
    return sanitizeValue(Math.max(floor, Math.round(value / step) * step));
  };
  return [
    { trap: "simple_addition", value: clean(answer * 0.8) },
    { trap: "wrong_base", value: clean(trapValue) },
    { trap: "same_percentage_assumption", value: clean(answer * 1.2) },
    { trap: "reverse_direction", value: clean(answer * 0.9) },
  ] satisfies TrapCandidate[];
}

export function solveAdvancedPercentage(problem: CanonicalPercentageProblem) {
  const v = problem.variables;
  switch (problem.subtype) {
    case "perc_geom_dimensional_scale":
      return sanitizeValue((v.finalIndex ?? 100) - 100);
    case "perc_demo_cross_tab_literacy":
      return sanitizeValue(((v.maleShare ?? 0) * (v.maleLiteracy ?? 0) + (v.femaleShare ?? 0) * (v.femaleLiteracy ?? 0)) / 100);
    case "perc_budget_cascading_remainder":
      return sanitizeValue((v.leftAmount ?? 0) * 100 / (v.remainingIndex ?? 1));
    case "perc_const_absolute_offset": {
      const newConsumptionIndex = 10000 / (100 + (v.priceIncreasePercent ?? 0));
      const reductionPercent = 100 - newConsumptionIndex;
      return sanitizeValue((v.reductionAmount ?? 0) * 100 / reductionPercent);
    }
    case "perc_exam_weighted_aggregate":
      return sanitizeValue((((v.paper1Weight ?? 0) * (v.paper1Percent ?? 0) / 100) + ((v.paper2Weight ?? 0) * (v.paper2Percent ?? 0) / 100)) * 100 / ((v.paper1Weight ?? 0) + (v.paper2Weight ?? 0)));
    case "perc_asset_variable_depreciation":
      return sanitizeValue(100 - (v.finalIndex ?? 100));
    case "perc_workforce_hierarchical_attrition":
      return sanitizeValue((v.finalIndex ?? 100) - 100);
    case "perc_elect_three_candidate_forfeiture":
      return sanitizeValue((v.marginVotes ?? 0) * 100 / ((v.winnerPercent ?? 0) - (v.runnerUpPercent ?? 0)));
    case "perc_agri_land_yield_compound":
      return sanitizeValue((v.productionIndex ?? 100) - 100);
    case "perc_demo_multi_factor_growth":
      return sanitizeValue((v.newIndex ?? 100) - 100);
    case "perc_comm_tiered_salary_override":
      return sanitizeValue((v.costPrice ?? 0) * (v.buyRate ?? 0) / 100 + (v.sellingPrice ?? 0) * (v.sellRate ?? 0) / 100);
    case "perc_asset_compound_leakage":
      return sanitizeValue((v.finalIndex ?? 100) - 100);
    case "perc_num_linear_equation_balancing":
      return sanitizeValue((v.absoluteChange ?? 0) * 100 / Math.abs(v.changeIndex ?? 1));
    case "perc_num_fractional_perturbation_complex":
      return sanitizeValue(((100 + (v.numeratorIncreasePercent ?? 0)) / (100 - (v.denominatorDecreasePercent ?? 0)) - 1) * 100);
    case "perc_tax_bracket_retained_income":
      return sanitizeValue((((v.targetNetIncome ?? 0) * 100 / (100 - (v.taxRate ?? 0))) - (v.fixedSalary ?? 0)) * 100 / (v.commissionRate ?? 1));
    case "perc_num_square_proportional_delta":
      return sanitizeValue(100 * ((100 + (v.inputIncreasePercent ?? 0)) / 100) ** 2 - 100);
    case "perc_mix_alloy_replacement":
      return sanitizeValue(100 * ((100 - (v.replacementPercent ?? 0)) / 100) ** (v.iterations ?? 1));
    default:
      return sanitizeValue(problem.answer);
  }
}

export function createAdvancedPercentageProblem(
  id: AdvancedPercentageMotifId,
  input?: AdvancedFactoryInput,
): CanonicalPercentageProblem {
  const rng = rngFromInput(input);

  switch (id) {
    case "perc_geom_dimensional_scale": {
      const variant = rng.pick(["square", "cube", "rectangle"] as const);
      if (variant === "cube") {
        const sideIncreasePercent = rng.pick([10, 20] as const);
        const finalIndex = sanitizeValue(((100 + sideIncreasePercent) ** 3) / 10000);
        const answer = finalIndex - 100;
        return makeProblem({
          id,
          category: "base_change",
          reasoningPattern: "compound_shift",
          variables: { variantCode: 2, sideIncreasePercent, finalIndex },
          answer,
          candidates: percentCandidates(answer, sideIncreasePercent * 3, sideIncreasePercent, sideIncreasePercent * 2),
          traps: ["simple_addition", "wrong_base"],
          difficulty: "hard",
        });
      }
      if (variant === "rectangle") {
        const pair = rng.pick([[20, 10], [25, 10], [50, 20]] as const);
        const lengthIncreasePercent = pair[0];
        const breadthDecreasePercent = pair[1];
        const finalIndex = sanitizeValue((100 + lengthIncreasePercent) * (100 - breadthDecreasePercent) / 100);
        const answer = finalIndex - 100;
        return makeProblem({
          id,
          category: "base_change",
          reasoningPattern: "compound_shift",
          variables: { variantCode: 3, lengthIncreasePercent, breadthDecreasePercent, finalIndex },
          answer,
          candidates: percentCandidates(answer, lengthIncreasePercent - breadthDecreasePercent, lengthIncreasePercent + breadthDecreasePercent, (lengthIncreasePercent + breadthDecreasePercent) / 2),
          traps: ["simple_addition", "wrong_base"],
          difficulty: "medium",
        });
      }
      const sideIncreasePercent = rng.pick([20, 25, 50] as const);
      const finalIndex = sanitizeValue(((100 + sideIncreasePercent) ** 2) / 100);
      const answer = finalIndex - 100;
      return makeProblem({
        id,
        category: "base_change",
        reasoningPattern: "compound_shift",
        variables: { variantCode: 1, sideIncreasePercent, finalIndex },
        answer,
        candidates: percentCandidates(answer, sideIncreasePercent * 2, sideIncreasePercent, sideIncreasePercent * 1.5),
        traps: ["simple_addition", "wrong_base"],
        difficulty: sideIncreasePercent >= 25 ? "medium" : "easy",
      });
    }
    case "perc_demo_cross_tab_literacy": {
      const maleShare = rng.pick([40, 45, 60] as const);
      const femaleShare = 100 - maleShare;
      const [maleLiteracy, femaleLiteracy] = rng.pick([[70, 55], [75, 60], [80, 65], [85, 70]] as const);
      const answer = sanitizeValue((maleShare * maleLiteracy + femaleShare * femaleLiteracy) / 100);
      return makeProblem({
        id,
        category: "data_interpretation",
        reasoningPattern: "weighted_average",
        variables: { maleShare, femaleShare, maleLiteracy, femaleLiteracy },
        answer,
        candidates: percentCandidates(answer, (maleLiteracy + femaleLiteracy) / 2, maleLiteracy, femaleLiteracy),
        traps: ["wrong_base", "same_percentage_assumption"],
        difficulty: "medium",
      });
    }
    case "perc_budget_cascading_remainder": {
      const [foodPercent, rentPercent, savingsPercent] = rng.pick([[20, 25, 20], [25, 20, 10], [10, 20, 25]] as const);
      const remainingIndex = sanitizeValue(100 * (1 - foodPercent / 100) * (1 - rentPercent / 100) * (1 - savingsPercent / 100));
      const income = rng.pick([40000, 50000, 60000] as const);
      const leftAmount = sanitizeValue(income * remainingIndex / 100);
      return makeProblem({
        id,
        category: "expenditure",
        reasoningPattern: "reverse_reconstruction",
        variables: { foodPercent, rentPercent, savingsPercent, remainingIndex, leftAmount },
        answer: income,
        candidates: nearAbsoluteCandidates(income, leftAmount + 1000, leftAmount * 100 / (100 - foodPercent - rentPercent - savingsPercent)),
        traps: ["simple_addition", "wrong_base"],
        difficulty: "hard",
      });
    }
    case "perc_const_absolute_offset": {
      const priceIncreasePercent = rng.pick([25, 100] as const);
      const reductionPercent = sanitizeValue(100 - 10000 / (100 + priceIncreasePercent));
      const originalQuantity = rng.pick([40, 60, 80, 100] as const);
      const reductionAmount = sanitizeValue(originalQuantity * reductionPercent / 100);
      return makeProblem({
        id,
        category: "expenditure",
        reasoningPattern: "reverse_reconstruction",
        variables: { priceIncreasePercent, reductionPercent, reductionAmount },
        answer: originalQuantity,
        candidates: nearAbsoluteCandidates(originalQuantity, reductionAmount + 1, reductionAmount * 100 / priceIncreasePercent),
        traps: ["wrong_base", "simple_addition"],
        difficulty: "hard",
      });
    }
    case "perc_exam_weighted_aggregate": {
      const [paper1Weight, paper2Weight] = rng.pick([[80, 120], [100, 150], [60, 90]] as const);
      const [paper1Percent, paper2Percent] = rng.pick([[60, 50], [70, 60], [80, 75], [75, 60]] as const);
      const answer = sanitizeValue(((paper1Weight * paper1Percent / 100) + (paper2Weight * paper2Percent / 100)) * 100 / (paper1Weight + paper2Weight));
      return makeProblem({
        id,
        category: "data_interpretation",
        reasoningPattern: "weighted_average",
        variables: { paper1Weight, paper2Weight, paper1Percent, paper2Percent },
        answer,
        candidates: percentCandidates(answer, (paper1Percent + paper2Percent) / 2, paper1Percent, paper2Percent),
        traps: ["same_percentage_assumption", "wrong_base"],
        difficulty: "medium",
      });
    }
    case "perc_asset_variable_depreciation": {
      const [firstDepreciationPercent, secondDepreciationPercent] = rng.pick([[10, 20], [20, 25], [25, 20]] as const);
      const finalIndex = sanitizeValue(100 * (1 - firstDepreciationPercent / 100) * (1 - secondDepreciationPercent / 100));
      const answer = 100 - finalIndex;
      return makeProblem({
        id,
        category: "growth_decay",
        reasoningPattern: "successive_base_change",
        variables: { firstDepreciationPercent, secondDepreciationPercent, finalIndex },
        answer,
        candidates: percentCandidates(answer, firstDepreciationPercent + secondDepreciationPercent, firstDepreciationPercent, secondDepreciationPercent),
        traps: ["simple_addition", "wrong_base"],
        difficulty: "medium",
      });
    }
    case "perc_workforce_hierarchical_attrition": {
      const [attritionPercent, hiringPercent] = rng.pick([[10, 20], [20, 30], [25, 40]] as const);
      const finalIndex = sanitizeValue(100 * (1 - attritionPercent / 100) * (1 + hiringPercent / 100));
      const answer = finalIndex - 100;
      return makeProblem({
        id,
        category: "growth_decay",
        reasoningPattern: "successive_base_change",
        variables: { attritionPercent, hiringPercent, finalIndex },
        answer,
        candidates: percentCandidates(answer, hiringPercent - attritionPercent, hiringPercent, attritionPercent),
        traps: ["simple_addition", "wrong_base"],
        difficulty: "medium",
      });
    }
    case "perc_elect_three_candidate_forfeiture": {
      const winnerPercent = rng.pick([48, 52, 55] as const);
      const runnerUpPercent = rng.pick([32, 34, 35] as const);
      const thirdPercent = 100 - winnerPercent - runnerUpPercent;
      const totalVotes = rng.pick([120000, 160000, 200000, 240000] as const);
      const marginVotes = sanitizeValue(totalVotes * (winnerPercent - runnerUpPercent) / 100);
      return makeProblem({
        id,
        category: "election",
        reasoningPattern: "margin_mapping",
        variables: { winnerPercent, runnerUpPercent, thirdPercent, marginVotes },
        answer: totalVotes,
        candidates: nearAbsoluteCandidates(totalVotes, marginVotes + 1000, marginVotes * 100 / winnerPercent),
        traps: ["margin_confusion", "wrong_denominator"],
        difficulty: "hard",
      });
    }
    case "perc_agri_land_yield_compound": {
      const [areaIncreasePercent, yieldIncreasePercent] = rng.pick([[20, 10], [25, 20], [10, 25]] as const);
      const productionIndex = sanitizeValue((100 + areaIncreasePercent) * (100 + yieldIncreasePercent) / 100);
      const answer = productionIndex - 100;
      return makeProblem({
        id,
        category: "data_interpretation",
        reasoningPattern: "compound_shift",
        variables: { areaIncreasePercent, yieldIncreasePercent, productionIndex },
        answer,
        candidates: percentCandidates(answer, areaIncreasePercent + yieldIncreasePercent, areaIncreasePercent, yieldIncreasePercent),
        traps: ["simple_addition", "wrong_base"],
        difficulty: "medium",
      });
    }
    case "perc_demo_multi_factor_growth": {
      const [maleShare, maleGrowthPercent, femaleDecreasePercent] = rng.pick([
        [40, 30, 10],
        [50, 25, 10],
        [50, 30, 20],
        [60, 20, 20],
        [60, 25, 10],
      ] as const);
      const femaleShare = 100 - maleShare;
      const newIndex = sanitizeValue(maleShare * (100 + maleGrowthPercent) / 100 + femaleShare * (100 - femaleDecreasePercent) / 100);
      const answer = newIndex - 100;
      return makeProblem({
        id,
        category: "population",
        reasoningPattern: "weighted_average",
        variables: { maleShare, femaleShare, maleGrowthPercent, femaleDecreasePercent, newIndex },
        answer,
        candidates: percentCandidates(answer, maleGrowthPercent - femaleDecreasePercent, (maleGrowthPercent + femaleDecreasePercent) / 2, maleGrowthPercent),
        traps: ["simple_addition", "wrong_base"],
        difficulty: "hard",
      });
    }
    case "perc_comm_tiered_salary_override": {
      const costPrice = rng.pick([40000, 50000, 60000] as const);
      const profitPercent = rng.pick([10, 20, 25] as const);
      const buyRate = rng.pick([1, 2] as const);
      const sellRate = rng.pick([2, 3] as const);
      const sellingPrice = sanitizeValue(costPrice * (100 + profitPercent) / 100);
      const answer = sanitizeValue(costPrice * buyRate / 100 + sellingPrice * sellRate / 100);
      return makeProblem({
        id,
        category: "commercial",
        reasoningPattern: "successive_base_change",
        variables: { costPrice, profitPercent, buyRate, sellRate, sellingPrice },
        answer,
        candidates: nearAbsoluteCandidates(answer, answer * 0.5, costPrice * (buyRate + sellRate) / 100),
        traps: ["wrong_base", "simple_addition"],
        difficulty: "hard",
      });
    }
    case "perc_asset_compound_leakage": {
      const [firstIncreasePercent, secondIncreasePercent, leakagePercent] = rng.pick([[20, 25, 10], [10, 20, 10], [25, 20, 20]] as const);
      const finalIndex = sanitizeValue(100 * (1 + firstIncreasePercent / 100) * (1 + secondIncreasePercent / 100) * (1 - leakagePercent / 100));
      const answer = finalIndex - 100;
      return makeProblem({
        id,
        category: "growth_decay",
        reasoningPattern: "successive_base_change",
        variables: { firstIncreasePercent, secondIncreasePercent, leakagePercent, finalIndex },
        answer,
        candidates: percentCandidates(answer, firstIncreasePercent + secondIncreasePercent - leakagePercent, firstIncreasePercent + secondIncreasePercent, leakagePercent),
        traps: ["simple_addition", "wrong_base"],
        difficulty: "hard",
      });
    }
    case "perc_num_linear_equation_balancing": {
      const [increasePercent, decreasePercent] = rng.pick([[25, 10], [50, 40], [20, 10]] as const);
      const finalIndex = sanitizeValue((100 + increasePercent) * (100 - decreasePercent) / 100);
      const changeIndex = Math.abs(finalIndex - 100);
      const originalValue = rng.pick([500, 800, 1000, 1200] as const);
      const absoluteChange = sanitizeValue(originalValue * changeIndex / 100);
      return makeProblem({
        id,
        category: "base_change",
        reasoningPattern: "reverse_reconstruction",
        variables: { increasePercent, decreasePercent, finalIndex, changeIndex, absoluteChange },
        answer: originalValue,
        candidates: nearAbsoluteCandidates(originalValue, absoluteChange + 10, absoluteChange * 100 / Math.abs(increasePercent - decreasePercent)),
        traps: ["wrong_base", "simple_addition"],
        difficulty: "hard",
      });
    }
    case "perc_num_fractional_perturbation_complex": {
      const [numeratorIncreasePercent, denominatorDecreasePercent] = rng.pick([[20, 20], [25, 20], [50, 25]] as const);
      const answer = sanitizeValue(((100 + numeratorIncreasePercent) / (100 - denominatorDecreasePercent) - 1) * 100);
      return makeProblem({
        id,
        category: "ratio_mapping",
        reasoningPattern: "ratio_to_percentage",
        variables: { numeratorIncreasePercent, denominatorDecreasePercent },
        answer,
        candidates: percentCandidates(answer, numeratorIncreasePercent + denominatorDecreasePercent, numeratorIncreasePercent - denominatorDecreasePercent, numeratorIncreasePercent),
        traps: ["simple_addition", "wrong_denominator"],
        difficulty: "hard",
      });
    }
    case "perc_tax_bracket_retained_income": {
      const fixedSalary = rng.pick([30000, 40000, 50000] as const);
      const commissionRate = rng.pick([5, 10] as const);
      const taxRate = rng.pick([10, 20] as const);
      const sales = rng.pick([100000, 120000, 150000] as const);
      const commission = sanitizeValue(sales * commissionRate / 100);
      const grossIncome = fixedSalary + commission;
      const targetNetIncome = sanitizeValue(grossIncome * (100 - taxRate) / 100);
      return makeProblem({
        id,
        category: "commercial",
        reasoningPattern: "reverse_reconstruction",
        variables: { fixedSalary, commissionRate, taxRate, targetNetIncome, commission, grossIncome },
        answer: sales,
        candidates: nearAbsoluteCandidates(sales, fixedSalary + 1000, commission),
        traps: ["wrong_base", "forgetting_filtering_stage"],
        difficulty: "hard",
      });
    }
    case "perc_num_square_proportional_delta": {
      const inputIncreasePercent = rng.pick([10, 20, 25, 50] as const);
      const answer = sanitizeValue(100 * ((100 + inputIncreasePercent) / 100) ** 2 - 100);
      return makeProblem({
        id,
        category: "base_change",
        reasoningPattern: "compound_shift",
        variables: { inputIncreasePercent },
        answer,
        candidates: percentCandidates(answer, inputIncreasePercent * 2, inputIncreasePercent, inputIncreasePercent * 1.5),
        traps: ["simple_addition", "wrong_base"],
        difficulty: "medium",
      });
    }
    case "perc_mix_alloy_replacement": {
      const replacementPercent = rng.pick([10, 20, 25] as const);
      const iterations = rng.pick([2, 3] as const);
      const answer = sanitizeValue(100 * ((100 - replacementPercent) / 100) ** iterations);
      return makeProblem({
        id,
        category: "mixture",
        reasoningPattern: "mixture_balance",
        variables: { replacementPercent, iterations },
        answer,
        candidates: percentCandidates(answer, 100 - replacementPercent * iterations, 100 - replacementPercent, replacementPercent * iterations),
        traps: ["simple_addition", "wrong_base"],
        difficulty: "hard",
      });
    }
  }
}

export const ADVANCED_PERCENTAGE_MOTIF_FACTORIES = Object.fromEntries(
  ADVANCED_PERCENTAGE_MOTIF_IDS.map((id) => [
    id,
    (input?: AdvancedFactoryInput) => createAdvancedPercentageProblem(id, input),
  ]),
) as Record<AdvancedPercentageMotifId, (input?: AdvancedFactoryInput) => CanonicalPercentageProblem>;

function line(label: string, equation: string, value: number) {
  return `${label}:\n${equation}\n= ${n(value)}`;
}

type TextSet = {
  stem: string;
  labels: string[];
  equations: string[];
  values: number[];
  final: string;
};

function textSet(problem: CanonicalPercentageProblem, language: LanguageCode): TextSet {
  const v = problem.variables;
  const hi = language === "hi";
  const pa = language === "pa";
  const en = language === "en";
  const percentSuffix = PERCENT_ANSWER_IDS.has(problem.subtype as AdvancedPercentageMotifId) ? "%" : "";

  switch (problem.subtype) {
    case "perc_geom_dimensional_scale":
      if (v.variantCode === 2) {
        return {
          stem: en
            ? `The side of a cube is increased by ${pct(v.sideIncreasePercent)}. Find the percentage increase in its volume.`
            : hi
              ? `एक घन की भुजा ${pct(v.sideIncreasePercent)} बढ़ाई गई। उसके आयतन में प्रतिशत वृद्धि ज्ञात कीजिए।`
              : `ਇੱਕ ਘਣ ਦੀ ਭੁਜਾ ${pct(v.sideIncreasePercent)} ਵਧਾਈ ਗਈ। ਇਸ ਦੇ ਆਇਤਨ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`,
          labels: [en ? "Volume index" : hi ? "आयतन सूचकांक" : "ਆਇਤਨ ਸੂਚਕਾਂਕ", en ? "Increase in volume" : hi ? "आयतन में वृद्धि" : "ਆਇਤਨ ਵਿੱਚ ਵਾਧਾ"],
          equations: [`(100 + ${n(v.sideIncreasePercent)})^3 / 10000`, `${n(v.finalIndex)} - 100`],
          values: [v.finalIndex, problem.answer],
          final: en ? `Increase in volume = ${n(problem.answer)}%` : hi ? `आयतन में वृद्धि = ${n(problem.answer)}%` : `ਆਇਤਨ ਵਿੱਚ ਵਾਧਾ = ${n(problem.answer)}%`,
        };
      }
      if (v.variantCode === 3) {
        return {
          stem: en
            ? `The length of a rectangle is increased by ${pct(v.lengthIncreasePercent)} and its breadth is decreased by ${pct(v.breadthDecreasePercent)}. Find the percentage change in area.`
            : hi
              ? `एक आयत की लंबाई ${pct(v.lengthIncreasePercent)} बढ़ाई गई और चौड़ाई ${pct(v.breadthDecreasePercent)} घटाई गई। क्षेत्रफल में प्रतिशत परिवर्तन ज्ञात कीजिए।`
              : `ਇੱਕ ਆਯਤ ਦੀ ਲੰਬਾਈ ${pct(v.lengthIncreasePercent)} ਵਧਾਈ ਗਈ ਅਤੇ ਚੌੜਾਈ ${pct(v.breadthDecreasePercent)} ਘਟਾਈ ਗਈ। ਖੇਤਰਫਲ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਪਤਾ ਕਰੋ।`,
          labels: [en ? "Area index" : hi ? "क्षेत्रफल सूचकांक" : "ਖੇਤਰਫਲ ਸੂਚਕਾਂਕ", en ? "Increase in area" : hi ? "क्षेत्रफल में वृद्धि" : "ਖੇਤਰਫਲ ਵਿੱਚ ਵਾਧਾ"],
          equations: [`(100 + ${n(v.lengthIncreasePercent)}) x (100 - ${n(v.breadthDecreasePercent)}) / 100`, `${n(v.finalIndex)} - 100`],
          values: [v.finalIndex, problem.answer],
          final: en ? `Increase in area = ${n(problem.answer)}%` : hi ? `क्षेत्रफल में वृद्धि = ${n(problem.answer)}%` : `ਖੇਤਰਫਲ ਵਿੱਚ ਵਾਧਾ = ${n(problem.answer)}%`,
        };
      }
      return {
        stem: en
          ? `The side of a square is increased by ${pct(v.sideIncreasePercent)}. Find the percentage increase in its area.`
          : hi
            ? `एक वर्ग की भुजा ${pct(v.sideIncreasePercent)} बढ़ाई गई। उसके क्षेत्रफल में प्रतिशत वृद्धि ज्ञात कीजिए।`
            : `ਇੱਕ ਵਰਗ ਦੀ ਭੁਜਾ ${pct(v.sideIncreasePercent)} ਵਧਾਈ ਗਈ। ਇਸ ਦੇ ਖੇਤਰਫਲ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`,
        labels: [en ? "Area index" : hi ? "क्षेत्रफल सूचकांक" : "ਖੇਤਰਫਲ ਸੂਚਕਾਂਕ", en ? "Increase in area" : hi ? "क्षेत्रफल में वृद्धि" : "ਖੇਤਰਫਲ ਵਿੱਚ ਵਾਧਾ"],
        equations: [`(100 + ${n(v.sideIncreasePercent)})^2 / 100`, `${n(v.finalIndex)} - 100`],
        values: [v.finalIndex, problem.answer],
        final: en ? `Increase in area = ${n(problem.answer)}%` : hi ? `क्षेत्रफल में वृद्धि = ${n(problem.answer)}%` : `ਖੇਤਰਫਲ ਵਿੱਚ ਵਾਧਾ = ${n(problem.answer)}%`,
      };
    case "perc_demo_cross_tab_literacy":
      return {
        stem: en
          ? `In a population survey, males are ${pct(v.maleShare)} and females are ${pct(v.femaleShare)}. Male literacy is ${pct(v.maleLiteracy)} and female literacy is ${pct(v.femaleLiteracy)}. Find the overall literacy percentage.`
          : hi
            ? `एक जनसंख्या सर्वे में पुरुष ${pct(v.maleShare)} और महिलाएं ${pct(v.femaleShare)} हैं। पुरुष साक्षरता ${pct(v.maleLiteracy)} और महिला साक्षरता ${pct(v.femaleLiteracy)} है। कुल साक्षरता प्रतिशत ज्ञात कीजिए।`
            : `ਇੱਕ ਆਬਾਦੀ ਸਰਵੇ ਵਿੱਚ ਮਰਦ ${pct(v.maleShare)} ਅਤੇ ਔਰਤਾਂ ${pct(v.femaleShare)} ਹਨ। ਮਰਦ ਸਾਖਰਤਾ ${pct(v.maleLiteracy)} ਅਤੇ ਔਰਤ ਸਾਖਰਤਾ ${pct(v.femaleLiteracy)} ਹੈ। ਕੁੱਲ ਸਾਖਰਤਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
        labels: [en ? "Male literacy contribution" : hi ? "पुरुष साक्षरता योगदान" : "ਮਰਦ ਸਾਖਰਤਾ ਯੋਗਦਾਨ", en ? "Female literacy contribution" : hi ? "महिला साक्षरता योगदान" : "ਔਰਤ ਸਾਖਰਤਾ ਯੋਗਦਾਨ", en ? "Overall literacy" : hi ? "कुल साक्षरता" : "ਕੁੱਲ ਸਾਖਰਤਾ"],
        equations: [`${n(v.maleShare)} x ${n(v.maleLiteracy)} / 100`, `${n(v.femaleShare)} x ${n(v.femaleLiteracy)} / 100`, `${n(v.maleShare * v.maleLiteracy / 100)} + ${n(v.femaleShare * v.femaleLiteracy / 100)}`],
        values: [v.maleShare * v.maleLiteracy / 100, v.femaleShare * v.femaleLiteracy / 100, problem.answer],
        final: en ? `Overall literacy = ${n(problem.answer)}%` : hi ? `कुल साक्षरता = ${n(problem.answer)}%` : `ਕੁੱਲ ਸਾਖਰਤਾ = ${n(problem.answer)}%`,
      };
    case "perc_budget_cascading_remainder":
      return {
        stem: en
          ? `A person spends ${pct(v.foodPercent)} of income on food, then ${pct(v.rentPercent)} of the remainder on rent, and allocates ${pct(v.savingsPercent)} of the next remainder to savings. If Rs. ${n(v.leftAmount)} is still unallocated, find the income.`
          : hi
            ? `एक व्यक्ति आय का ${pct(v.foodPercent)} भोजन पर, फिर शेष का ${pct(v.rentPercent)} किराए पर, और फिर अगले शेष का ${pct(v.savingsPercent)} बचत में रखता है। यदि ${money(v.leftAmount)} बचते हैं, तो आय ज्ञात कीजिए।`
            : `ਇੱਕ ਵਿਅਕਤੀ ਆਮਦਨ ਦਾ ${pct(v.foodPercent)} ਖਾਣੇ ਤੇ, ਫਿਰ ਬਾਕੀ ਦਾ ${pct(v.rentPercent)} ਕਿਰਾਏ ਤੇ, ਅਤੇ ਫਿਰ ਅਗਲੇ ਬਾਕੀ ਦਾ ${pct(v.savingsPercent)} ਬਚਤ ਲਈ ਰੱਖਦਾ ਹੈ। ਜੇ ${money(v.leftAmount)} ਬਚਦੇ ਹਨ, ਤਾਂ ਆਮਦਨ ਪਤਾ ਕਰੋ।`,
        labels: [en ? "Remaining income index" : hi ? "शेष आय सूचकांक" : "ਬਚੀ ਆਮਦਨ ਸੂਚਕਾਂਕ", en ? "Income" : hi ? "आय" : "ਆਮਦਨ"],
        equations: [`100 x ${100 - v.foodPercent} / 100 x ${100 - v.rentPercent} / 100 x ${100 - v.savingsPercent} / 100`, `${n(v.leftAmount)} x 100 / ${n(v.remainingIndex)}`],
        values: [v.remainingIndex, problem.answer],
        final: en ? `Income = ${n(problem.answer)}` : hi ? `आय = ${n(problem.answer)}` : `ਆਮਦਨ = ${n(problem.answer)}`,
      };
    case "perc_const_absolute_offset":
      return {
        stem: en
          ? `The price of rice increases by ${pct(v.priceIncreasePercent)}. With the same budget, a family buys ${n(v.reductionAmount)} kg less rice. Find the original quantity bought.`
          : hi
            ? `चावल की कीमत ${pct(v.priceIncreasePercent)} बढ़ जाती है। समान बजट में एक परिवार ${n(v.reductionAmount)} kg कम चावल खरीदता है। मूल खरीदी गई मात्रा ज्ञात कीजिए।`
            : `ਚੌਲਾਂ ਦੀ ਕੀਮਤ ${pct(v.priceIncreasePercent)} ਵਧ ਜਾਂਦੀ ਹੈ। ਉਸੇ ਬਜਟ ਵਿੱਚ ਇੱਕ ਪਰਿਵਾਰ ${n(v.reductionAmount)} kg ਘੱਟ ਚੌਲ ਖਰੀਦਦਾ ਹੈ। ਮੂਲ ਖਰੀਦੀ ਮਾਤਰਾ ਪਤਾ ਕਰੋ।`,
        labels: [en ? "New consumption index" : hi ? "नई खपत सूचकांक" : "ਨਵਾਂ ਖਪਤ ਸੂਚਕਾਂਕ", en ? "Reduction percentage" : hi ? "कमी प्रतिशत" : "ਕਮੀ ਪ੍ਰਤੀਸ਼ਤ", en ? "Original quantity" : hi ? "मूल मात्रा" : "ਮੂਲ ਮਾਤਰਾ"],
        equations: [`10000 / (100 + ${n(v.priceIncreasePercent)})`, `100 - ${n(10000 / (100 + v.priceIncreasePercent))}`, `${n(v.reductionAmount)} x 100 / ${n(v.reductionPercent)}`],
        values: [10000 / (100 + v.priceIncreasePercent), v.reductionPercent, problem.answer],
        final: en ? `Original quantity = ${n(problem.answer)}` : hi ? `मूल मात्रा = ${n(problem.answer)}` : `ਮੂਲ ਮਾਤਰਾ = ${n(problem.answer)}`,
      };
    case "perc_exam_weighted_aggregate":
      return {
        stem: en
          ? `In an exam, Paper I has ${n(v.paper1Weight)} marks and Paper II has ${n(v.paper2Weight)} marks. A student scores ${pct(v.paper1Percent)} in Paper I and ${pct(v.paper2Percent)} in Paper II. Find the overall percentage.`
          : hi
            ? `एक परीक्षा में पेपर I ${n(v.paper1Weight)} अंकों का और पेपर II ${n(v.paper2Weight)} अंकों का है। छात्र पेपर I में ${pct(v.paper1Percent)} और पेपर II में ${pct(v.paper2Percent)} अंक पाता है। कुल प्रतिशत ज्ञात कीजिए।`
            : `ਇੱਕ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਪੇਪਰ I ${n(v.paper1Weight)} ਅੰਕਾਂ ਦਾ ਅਤੇ ਪੇਪਰ II ${n(v.paper2Weight)} ਅੰਕਾਂ ਦਾ ਹੈ। ਵਿਦਿਆਰਥੀ ਪੇਪਰ I ਵਿੱਚ ${pct(v.paper1Percent)} ਅਤੇ ਪੇਪਰ II ਵਿੱਚ ${pct(v.paper2Percent)} ਅੰਕ ਲੈਂਦਾ ਹੈ। ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
        labels: [en ? "Marks in Paper I" : hi ? "पेपर I के अंक" : "ਪੇਪਰ I ਦੇ ਅੰਕ", en ? "Marks in Paper II" : hi ? "पेपर II के अंक" : "ਪੇਪਰ II ਦੇ ਅੰਕ", en ? "Overall percentage" : hi ? "कुल प्रतिशत" : "ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ"],
        equations: [`${n(v.paper1Weight)} x ${n(v.paper1Percent)} / 100`, `${n(v.paper2Weight)} x ${n(v.paper2Percent)} / 100`, `(${n(v.paper1Weight * v.paper1Percent / 100)} + ${n(v.paper2Weight * v.paper2Percent / 100)}) x 100 / ${n(v.paper1Weight + v.paper2Weight)}`],
        values: [v.paper1Weight * v.paper1Percent / 100, v.paper2Weight * v.paper2Percent / 100, problem.answer],
        final: en ? `Overall percentage = ${n(problem.answer)}%` : hi ? `कुल प्रतिशत = ${n(problem.answer)}%` : `ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ = ${n(problem.answer)}%`,
      };
    default:
      return genericTextSet(problem, language, percentSuffix);
  }
}

function genericTextSet(problem: CanonicalPercentageProblem, language: LanguageCode, percentSuffix: string): TextSet {
  const v = problem.variables;
  const hi = language === "hi";
  const pa = language === "pa";
  const en = language === "en";
  const finalLabel = finalLabelFor(problem, language);
  const labels = labelsFor(problem, language);
  const equations = equationsFor(problem);
  const values = valuesFor(problem);
  const stem = stemFor(problem, language);
  return {
    stem,
    labels,
    equations,
    values,
    final: en
      ? `${finalLabel} = ${n(problem.answer)}${percentSuffix}`
      : hi
        ? `${finalLabel} = ${n(problem.answer)}${percentSuffix}`
        : pa
          ? `${finalLabel} = ${n(problem.answer)}${percentSuffix}`
          : `${finalLabel} = ${n(problem.answer)}${percentSuffix}`,
  };
}

function stemFor(problem: CanonicalPercentageProblem, language: LanguageCode) {
  const v = problem.variables;
  const hi = language === "hi";
  const pa = language === "pa";
  switch (problem.subtype) {
    case "perc_asset_variable_depreciation":
      return language === "en"
        ? `A machine depreciates by ${pct(v.firstDepreciationPercent)} in the first year and by ${pct(v.secondDepreciationPercent)} in the second year. Find the net percentage decrease in value.`
        : hi
          ? `एक मशीन पहले वर्ष ${pct(v.firstDepreciationPercent)} और दूसरे वर्ष ${pct(v.secondDepreciationPercent)} घटती है। मूल्य में कुल प्रतिशत कमी ज्ञात कीजिए।`
          : `ਇੱਕ ਮਸ਼ੀਨ ਪਹਿਲੇ ਸਾਲ ${pct(v.firstDepreciationPercent)} ਅਤੇ ਦੂਜੇ ਸਾਲ ${pct(v.secondDepreciationPercent)} ਘਟਦੀ ਹੈ। ਮੁੱਲ ਵਿੱਚ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਕਮੀ ਪਤਾ ਕਰੋ।`;
    case "perc_workforce_hierarchical_attrition":
      return language === "en"
        ? `A company first loses ${pct(v.attritionPercent)} of its workforce and then hires employees equal to ${pct(v.hiringPercent)} of the reduced workforce. Find the net percentage increase in workforce.`
        : hi
          ? `एक कंपनी पहले कर्मचारियों का ${pct(v.attritionPercent)} खो देती है और फिर घटी हुई संख्या के ${pct(v.hiringPercent)} के बराबर कर्मचारी नियुक्त करती है। कर्मचारियों में कुल प्रतिशत वृद्धि ज्ञात कीजिए।`
          : `ਇੱਕ ਕੰਪਨੀ ਪਹਿਲਾਂ ਕਰਮਚਾਰੀਆਂ ਦਾ ${pct(v.attritionPercent)} ਗੁਆ ਦਿੰਦੀ ਹੈ ਅਤੇ ਫਿਰ ਘਟੀ ਹੋਈ ਗਿਣਤੀ ਦੇ ${pct(v.hiringPercent)} ਦੇ ਬਰਾਬਰ ਕਰਮਚਾਰੀ ਰੱਖਦੀ ਹੈ। ਕਰਮਚਾਰੀਆਂ ਵਿੱਚ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`;
    case "perc_elect_three_candidate_forfeiture":
      return language === "en"
        ? `In a three-candidate election, the winner got ${pct(v.winnerPercent)} votes and the runner-up got ${pct(v.runnerUpPercent)} votes. The winning margin was ${n(v.marginVotes)} votes. Find the total votes polled.`
        : hi
          ? `तीन उम्मीदवारों वाले चुनाव में विजेता को ${pct(v.winnerPercent)} वोट और दूसरे स्थान वाले उम्मीदवार को ${pct(v.runnerUpPercent)} वोट मिले। जीत का अंतर ${n(v.marginVotes)} वोट था। कुल डाले गए वोट ज्ञात कीजिए।`
          : `ਤਿੰਨ ਉਮੀਦਵਾਰਾਂ ਵਾਲੀ ਚੋਣ ਵਿੱਚ ਜੇਤੂ ਨੂੰ ${pct(v.winnerPercent)} ਵੋਟ ਅਤੇ ਦੂਜੇ ਸਥਾਨ ਵਾਲੇ ਉਮੀਦਵਾਰ ਨੂੰ ${pct(v.runnerUpPercent)} ਵੋਟ ਮਿਲੇ। ਜਿੱਤ ਦਾ ਅੰਤਰ ${n(v.marginVotes)} ਵੋਟ ਸੀ। ਕੁੱਲ ਪਈਆਂ ਵੋਟਾਂ ਪਤਾ ਕਰੋ।`;
    case "perc_agri_land_yield_compound":
      return language === "en"
        ? `A farmer increases cultivated area by ${pct(v.areaIncreasePercent)} and yield per acre by ${pct(v.yieldIncreasePercent)}. Find the percentage increase in total production.`
        : hi
          ? `एक किसान खेती का क्षेत्र ${pct(v.areaIncreasePercent)} और प्रति एकड़ उपज ${pct(v.yieldIncreasePercent)} बढ़ाता है। कुल उत्पादन में प्रतिशत वृद्धि ज्ञात कीजिए।`
          : `ਇੱਕ ਕਿਸਾਨ ਖੇਤੀ ਦਾ ਖੇਤਰ ${pct(v.areaIncreasePercent)} ਅਤੇ ਪ੍ਰਤੀ ਏਕੜ ਪੈਦਾਵਾਰ ${pct(v.yieldIncreasePercent)} ਵਧਾਉਂਦਾ ਹੈ। ਕੁੱਲ ਉਤਪਾਦਨ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`;
    case "perc_demo_multi_factor_growth":
      return language === "en"
        ? `In a population, males are ${pct(v.maleShare)} and females are ${pct(v.femaleShare)}. Male population increases by ${pct(v.maleGrowthPercent)} while female population decreases by ${pct(v.femaleDecreasePercent)}. Find the net percentage increase in population.`
        : hi
          ? `एक जनसंख्या में पुरुष ${pct(v.maleShare)} और महिलाएं ${pct(v.femaleShare)} हैं। पुरुष जनसंख्या ${pct(v.maleGrowthPercent)} बढ़ती है जबकि महिला जनसंख्या ${pct(v.femaleDecreasePercent)} घटती है। कुल जनसंख्या में प्रतिशत वृद्धि ज्ञात कीजिए।`
          : `ਇੱਕ ਆਬਾਦੀ ਵਿੱਚ ਮਰਦ ${pct(v.maleShare)} ਅਤੇ ਔਰਤਾਂ ${pct(v.femaleShare)} ਹਨ। ਮਰਦ ਆਬਾਦੀ ${pct(v.maleGrowthPercent)} ਵਧਦੀ ਹੈ ਜਦਕਿ ਔਰਤ ਆਬਾਦੀ ${pct(v.femaleDecreasePercent)} ਘਟਦੀ ਹੈ। ਕੁੱਲ ਆਬਾਦੀ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`;
    case "perc_comm_tiered_salary_override":
      return language === "en"
        ? `An agent buys property for ${money(v.costPrice)} and sells it at ${pct(v.profitPercent)} profit. Brokerage is ${pct(v.buyRate)} on buying price and ${pct(v.sellRate)} on selling price. Find the total brokerage.`
        : hi
          ? `एक दलाल ${money(v.costPrice)} में संपत्ति खरीदता है और उसे ${pct(v.profitPercent)} लाभ पर बेचता है। खरीद मूल्य पर ${pct(v.buyRate)} और बिक्री मूल्य पर ${pct(v.sellRate)} दलाली मिलती है। कुल दलाली ज्ञात कीजिए।`
          : `ਇੱਕ ਏਜੰਟ ${money(v.costPrice)} ਵਿੱਚ ਜਾਇਦਾਦ ਖਰੀਦਦਾ ਹੈ ਅਤੇ ਇਸ ਨੂੰ ${pct(v.profitPercent)} ਲਾਭ ਤੇ ਵੇਚਦਾ ਹੈ। ਖਰੀਦ ਮੁੱਲ ਤੇ ${pct(v.buyRate)} ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ ਤੇ ${pct(v.sellRate)} ਦਲਾਲੀ ਮਿਲਦੀ ਹੈ। ਕੁੱਲ ਦਲਾਲੀ ਪਤਾ ਕਰੋ।`;
    case "perc_asset_compound_leakage":
      return language === "en"
        ? `A factory output rises by ${pct(v.firstIncreasePercent)}, then rises by ${pct(v.secondIncreasePercent)}, but later ${pct(v.leakagePercent)} output is lost. Find the net percentage increase in output.`
        : hi
          ? `एक कारखाने का उत्पादन पहले ${pct(v.firstIncreasePercent)} बढ़ता है, फिर ${pct(v.secondIncreasePercent)} बढ़ता है, लेकिन बाद में ${pct(v.leakagePercent)} उत्पादन घट जाता है। उत्पादन में कुल प्रतिशत वृद्धि ज्ञात कीजिए।`
          : `ਇੱਕ ਫੈਕਟਰੀ ਦਾ ਉਤਪਾਦਨ ਪਹਿਲਾਂ ${pct(v.firstIncreasePercent)} ਵਧਦਾ ਹੈ, ਫਿਰ ${pct(v.secondIncreasePercent)} ਵਧਦਾ ਹੈ, ਪਰ ਬਾਅਦ ਵਿੱਚ ${pct(v.leakagePercent)} ਉਤਪਾਦਨ ਘਟ ਜਾਂਦਾ ਹੈ। ਉਤਪਾਦਨ ਵਿੱਚ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`;
    case "perc_num_linear_equation_balancing":
      return language === "en"
        ? `A number is increased by ${pct(v.increasePercent)} and then decreased by ${pct(v.decreasePercent)}. The final change is ${n(v.absoluteChange)}. Find the original number.`
        : hi
          ? `एक संख्या को ${pct(v.increasePercent)} बढ़ाया गया और फिर ${pct(v.decreasePercent)} घटाया गया। अंतिम परिवर्तन ${n(v.absoluteChange)} है। मूल संख्या ज्ञात कीजिए।`
          : `ਇੱਕ ਸੰਖਿਆ ਨੂੰ ${pct(v.increasePercent)} ਵਧਾਇਆ ਗਿਆ ਅਤੇ ਫਿਰ ${pct(v.decreasePercent)} ਘਟਾਇਆ ਗਿਆ। ਅੰਤਿਮ ਬਦਲਾਅ ${n(v.absoluteChange)} ਹੈ। ਮੂਲ ਸੰਖਿਆ ਪਤਾ ਕਰੋ।`;
    case "perc_num_fractional_perturbation_complex":
      return language === "en"
        ? `In a fraction, the numerator is increased by ${pct(v.numeratorIncreasePercent)} and the denominator is decreased by ${pct(v.denominatorDecreasePercent)}. Find the percentage increase in the fraction.`
        : hi
          ? `एक भिन्न में अंश ${pct(v.numeratorIncreasePercent)} बढ़ाया गया और हर ${pct(v.denominatorDecreasePercent)} घटाया गया। भिन्न में प्रतिशत वृद्धि ज्ञात कीजिए।`
          : `ਇੱਕ ਭਿੰਨ ਵਿੱਚ ਅੰਸ਼ ${pct(v.numeratorIncreasePercent)} ਵਧਾਇਆ ਗਿਆ ਅਤੇ ਹਰ ${pct(v.denominatorDecreasePercent)} ਘਟਾਇਆ ਗਿਆ। ਭਿੰਨ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`;
    case "perc_tax_bracket_retained_income":
      return language === "en"
        ? `A salesperson has fixed salary ${money(v.fixedSalary)} and earns ${pct(v.commissionRate)} commission on sales. After ${pct(v.taxRate)} tax on gross income, net income is ${money(v.targetNetIncome)}. Find total sales.`
        : hi
          ? `एक विक्रेता का निश्चित वेतन ${money(v.fixedSalary)} है और बिक्री पर ${pct(v.commissionRate)} कमीशन मिलता है। सकल आय पर ${pct(v.taxRate)} कर के बाद शुद्ध आय ${money(v.targetNetIncome)} है। कुल बिक्री ज्ञात कीजिए।`
          : `ਇੱਕ ਵਿਕਰੇਤਾ ਦੀ ਨਿਸ਼ਚਿਤ ਤਨਖਾਹ ${money(v.fixedSalary)} ਹੈ ਅਤੇ ਵਿਕਰੀ ਤੇ ${pct(v.commissionRate)} ਕਮਿਸ਼ਨ ਮਿਲਦਾ ਹੈ। ਕੁੱਲ ਆਮਦਨ ਤੇ ${pct(v.taxRate)} ਕਰ ਤੋਂ ਬਾਅਦ ਸ਼ੁੱਧ ਆਮਦਨ ${money(v.targetNetIncome)} ਹੈ। ਕੁੱਲ ਵਿਕਰੀ ਪਤਾ ਕਰੋ।`;
    case "perc_num_square_proportional_delta":
      return language === "en"
        ? `A quantity is proportional to the square of another quantity. If the independent quantity increases by ${pct(v.inputIncreasePercent)}, find the percentage increase in the dependent quantity.`
        : hi
          ? `एक मात्रा दूसरी मात्रा के वर्ग के समानुपाती है। यदि स्वतंत्र मात्रा ${pct(v.inputIncreasePercent)} बढ़ती है, तो आश्रित मात्रा में प्रतिशत वृद्धि ज्ञात कीजिए।`
          : `ਇੱਕ ਮਾਤਰਾ ਦੂਜੀ ਮਾਤਰਾ ਦੇ ਵਰਗ ਦੇ ਸਮਾਨੁਪਾਤੀ ਹੈ। ਜੇ ਸੁਤੰਤਰ ਮਾਤਰਾ ${pct(v.inputIncreasePercent)} ਵਧਦੀ ਹੈ, ਤਾਂ ਨਿਰਭਰ ਮਾਤਰਾ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`;
    case "perc_mix_alloy_replacement":
      return language === "en"
        ? `From a vessel, ${pct(v.replacementPercent)} of the liquid is removed and replaced by water. This is done ${n(v.iterations)} times. Find the percentage of original liquid left.`
        : hi
          ? `एक बर्तन से ${pct(v.replacementPercent)} द्रव निकाला गया और पानी से प्रतिस्थापित किया गया। यह प्रक्रिया ${n(v.iterations)} बार की गई। बचा हुआ मूल द्रव प्रतिशत ज्ञात कीजिए।`
          : `ਇੱਕ ਬਰਤਨ ਵਿੱਚੋਂ ${pct(v.replacementPercent)} ਤਰਲ ਕੱਢਿਆ ਗਿਆ ਅਤੇ ਪਾਣੀ ਨਾਲ ਬਦਲਿਆ ਗਿਆ। ਇਹ ਪ੍ਰਕਿਰਿਆ ${n(v.iterations)} ਵਾਰ ਕੀਤੀ ਗਈ। ਬਚਿਆ ਹੋਇਆ ਮੂਲ ਤਰਲ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`;
    default:
      return "";
  }
}

function finalLabelFor(problem: CanonicalPercentageProblem, language: LanguageCode) {
  const hi = language === "hi";
  const pa = language === "pa";
  switch (problem.subtype) {
    case "perc_asset_variable_depreciation": return hi ? "कुल प्रतिशत कमी" : pa ? "ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਕਮੀ" : "Net percentage decrease";
    case "perc_workforce_hierarchical_attrition": return hi ? "कुल प्रतिशत वृद्धि" : pa ? "ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ" : "Net percentage increase";
    case "perc_elect_three_candidate_forfeiture": return hi ? "कुल डाले गए वोट" : pa ? "ਕੁੱਲ ਪਈਆਂ ਵੋਟਾਂ" : "Total votes polled";
    case "perc_agri_land_yield_compound": return hi ? "उत्पादन में वृद्धि" : pa ? "ਉਤਪਾਦਨ ਵਿੱਚ ਵਾਧਾ" : "Increase in production";
    case "perc_demo_multi_factor_growth": return hi ? "जनसंख्या में कुल वृद्धि" : pa ? "ਆਬਾਦੀ ਵਿੱਚ ਕੁੱਲ ਵਾਧਾ" : "Net population increase";
    case "perc_comm_tiered_salary_override": return hi ? "कुल दलाली" : pa ? "ਕੁੱਲ ਦਲਾਲੀ" : "Total brokerage";
    case "perc_asset_compound_leakage": return hi ? "उत्पादन में कुल वृद्धि" : pa ? "ਉਤਪਾਦਨ ਵਿੱਚ ਕੁੱਲ ਵਾਧਾ" : "Net output increase";
    case "perc_num_linear_equation_balancing": return hi ? "मूल संख्या" : pa ? "ਮੂਲ ਸੰਖਿਆ" : "Original number";
    case "perc_num_fractional_perturbation_complex": return hi ? "भिन्न में वृद्धि" : pa ? "ਭਿੰਨ ਵਿੱਚ ਵਾਧਾ" : "Increase in fraction";
    case "perc_tax_bracket_retained_income": return hi ? "कुल बिक्री" : pa ? "ਕੁੱਲ ਵਿਕਰੀ" : "Total sales";
    case "perc_num_square_proportional_delta": return hi ? "आश्रित मात्रा में वृद्धि" : pa ? "ਨਿਰਭਰ ਮਾਤਰਾ ਵਿੱਚ ਵਾਧਾ" : "Dependent quantity increase";
    case "perc_mix_alloy_replacement": return hi ? "बचा हुआ मूल द्रव" : pa ? "ਬਚਿਆ ਹੋਇਆ ਮੂਲ ਤਰਲ" : "Original liquid left";
    default: return hi ? "उत्तर" : pa ? "ਉੱਤਰ" : "Answer";
  }
}

function labelsFor(problem: CanonicalPercentageProblem, language: LanguageCode) {
  const hi = language === "hi";
  const pa = language === "pa";
  const final = finalLabelFor(problem, language);
  switch (problem.subtype) {
    case "perc_comm_tiered_salary_override":
      return [hi ? "विक्रय मूल्य" : pa ? "ਵਿਕਰੀ ਮੁੱਲ" : "Selling price", hi ? "खरीद दलाली" : pa ? "ਖਰੀਦ ਦਲਾਲੀ" : "Buying brokerage", hi ? "बिक्री दलाली" : pa ? "ਵਿਕਰੀ ਦਲਾਲੀ" : "Selling brokerage", final];
    case "perc_tax_bracket_retained_income":
      return [hi ? "सकल आय" : pa ? "ਕੁੱਲ ਆਮਦਨ" : "Gross income", hi ? "कमीशन" : pa ? "ਕਮਿਸ਼ਨ" : "Commission", final];
    case "perc_num_linear_equation_balancing":
      return [hi ? "अंतिम सूचकांक" : pa ? "ਅੰਤਿਮ ਸੂਚਕਾਂਕ" : "Final index", hi ? "परिवर्तन सूचकांक" : pa ? "ਬਦਲਾਅ ਸੂਚਕਾਂਕ" : "Change index", final];
    default:
      return [hi ? "नया सूचकांक" : pa ? "ਨਵਾਂ ਸੂਚਕਾਂਕ" : "New index", final];
  }
}

function equationsFor(problem: CanonicalPercentageProblem) {
  const v = problem.variables;
  switch (problem.subtype) {
    case "perc_asset_variable_depreciation": return [`100 x ${100 - v.firstDepreciationPercent} / 100 x ${100 - v.secondDepreciationPercent} / 100`, `100 - ${n(v.finalIndex)}`];
    case "perc_workforce_hierarchical_attrition": return [`100 x ${100 - v.attritionPercent} / 100 x ${100 + v.hiringPercent} / 100`, `${n(v.finalIndex)} - 100`];
    case "perc_elect_three_candidate_forfeiture": return [`${n(v.winnerPercent)} - ${n(v.runnerUpPercent)}`, `${n(v.marginVotes)} x 100 / ${n(v.winnerPercent - v.runnerUpPercent)}`];
    case "perc_agri_land_yield_compound": return [`(100 + ${n(v.areaIncreasePercent)}) x (100 + ${n(v.yieldIncreasePercent)}) / 100`, `${n(v.productionIndex)} - 100`];
    case "perc_demo_multi_factor_growth": return [`${n(v.maleShare)} x ${100 + v.maleGrowthPercent} / 100 + ${n(v.femaleShare)} x ${100 - v.femaleDecreasePercent} / 100`, `${n(v.newIndex)} - 100`];
    case "perc_comm_tiered_salary_override": return [`${n(v.costPrice)} x ${100 + v.profitPercent} / 100`, `${n(v.costPrice)} x ${n(v.buyRate)} / 100`, `${n(v.sellingPrice)} x ${n(v.sellRate)} / 100`, `${n(v.costPrice * v.buyRate / 100)} + ${n(v.sellingPrice * v.sellRate / 100)}`];
    case "perc_asset_compound_leakage": return [`100 x ${100 + v.firstIncreasePercent} / 100 x ${100 + v.secondIncreasePercent} / 100 x ${100 - v.leakagePercent} / 100`, `${n(v.finalIndex)} - 100`];
    case "perc_num_linear_equation_balancing": return [`(100 + ${n(v.increasePercent)}) x (100 - ${n(v.decreasePercent)}) / 100`, `|${n(v.finalIndex)} - 100|`, `${n(v.absoluteChange)} x 100 / ${n(v.changeIndex)}`];
    case "perc_num_fractional_perturbation_complex": return [`(100 + ${n(v.numeratorIncreasePercent)}) / (100 - ${n(v.denominatorDecreasePercent)})`, `(${n((100 + v.numeratorIncreasePercent) / (100 - v.denominatorDecreasePercent))} - 1) x 100`];
    case "perc_tax_bracket_retained_income": return [`${n(v.targetNetIncome)} x 100 / (100 - ${n(v.taxRate)})`, `${n(v.grossIncome)} - ${n(v.fixedSalary)}`, `${n(v.commission)} x 100 / ${n(v.commissionRate)}`];
    case "perc_num_square_proportional_delta": return [`100 x (100 + ${n(v.inputIncreasePercent)})^2 / 100^2`, `${n(100 * ((100 + v.inputIncreasePercent) / 100) ** 2)} - 100`];
    case "perc_mix_alloy_replacement": return [`100 x (100 - ${n(v.replacementPercent)})^${n(v.iterations)} / 100^${n(v.iterations)}`];
    default: return ["answer"];
  }
}

function valuesFor(problem: CanonicalPercentageProblem) {
  const v = problem.variables;
  switch (problem.subtype) {
    case "perc_asset_variable_depreciation": return [v.finalIndex, problem.answer];
    case "perc_workforce_hierarchical_attrition": return [v.finalIndex, problem.answer];
    case "perc_elect_three_candidate_forfeiture": return [v.winnerPercent - v.runnerUpPercent, problem.answer];
    case "perc_agri_land_yield_compound": return [v.productionIndex, problem.answer];
    case "perc_demo_multi_factor_growth": return [v.newIndex, problem.answer];
    case "perc_comm_tiered_salary_override": return [v.sellingPrice, v.costPrice * v.buyRate / 100, v.sellingPrice * v.sellRate / 100, problem.answer];
    case "perc_asset_compound_leakage": return [v.finalIndex, problem.answer];
    case "perc_num_linear_equation_balancing": return [v.finalIndex, v.changeIndex, problem.answer];
    case "perc_num_fractional_perturbation_complex": return [(100 + v.numeratorIncreasePercent) / (100 - v.denominatorDecreasePercent), problem.answer];
    case "perc_tax_bracket_retained_income": return [v.grossIncome, v.commission, problem.answer];
    case "perc_num_square_proportional_delta": return [100 * ((100 + v.inputIncreasePercent) / 100) ** 2, problem.answer];
    case "perc_mix_alloy_replacement": return [problem.answer];
    default: return [problem.answer];
  }
}

export function renderAdvancedPercentageStem(problem: CanonicalPercentageProblem, language: LanguageCode = "en") {
  if (!ADVANCED_PERCENTAGE_MOTIF_IDS.includes(problem.subtype as AdvancedPercentageMotifId)) {
    return undefined;
  }
  return textSet(problem, language).stem;
}

function renderPriceConsumptionAbsoluteExplanation(problem: CanonicalPercentageProblem, language: LanguageCode) {
  const v = problem.variables;
  const newPriceIndex = 100 + v.priceIncreasePercent;
  const newQuantityIndex = 10000 / newPriceIndex;
  const reductionPercent = 100 - newQuantityIndex;
  if (language === "hi") {
    return [
      "मान लें मूल कीमत प्रति kg = x।",
      `नई कीमत प्रति kg = x x ${n(newPriceIndex)} / 100।`,
      "समान खर्च के लिए:",
      "पुरानी मात्रा = खर्च / x।",
      `नई मात्रा = खर्च / (x x ${n(newPriceIndex)} / 100)।`,
      `अंतर = खर्च / x - खर्च / (x x ${n(newPriceIndex)} / 100) = ${n(v.reductionAmount)}।`,
      `नई मात्रा सूचकांक = 100 x 100 / ${n(newPriceIndex)} = ${n(newQuantityIndex)}।`,
      `मात्रा में कमी = 100 - ${n(newQuantityIndex)} = ${n(reductionPercent)}%।`,
      `मूल मात्रा = ${n(v.reductionAmount)} x 100 / ${n(reductionPercent)} = ${n(problem.answer)}।`,
      `मूल मात्रा = ${n(problem.answer)}`,
    ].join("\n");
  }
  if (language === "pa") {
    return [
      "ਮੰਨ ਲਓ ਮੂਲ ਕੀਮਤ ਪ੍ਰਤੀ kg = x।",
      `ਨਵੀਂ ਕੀਮਤ ਪ੍ਰਤੀ kg = x x ${n(newPriceIndex)} / 100।`,
      "ਉਸੇ ਖਰਚ ਲਈ:",
      "ਪੁਰਾਣੀ ਮਾਤਰਾ = ਖਰਚ / x।",
      `ਨਵੀਂ ਮਾਤਰਾ = ਖਰਚ / (x x ${n(newPriceIndex)} / 100)।`,
      `ਅੰਤਰ = ਖਰਚ / x - ਖਰਚ / (x x ${n(newPriceIndex)} / 100) = ${n(v.reductionAmount)}।`,
      `ਨਵੀਂ ਮਾਤਰਾ ਸੂਚਕਾਂਕ = 100 x 100 / ${n(newPriceIndex)} = ${n(newQuantityIndex)}।`,
      `ਮਾਤਰਾ ਵਿੱਚ ਕਮੀ = 100 - ${n(newQuantityIndex)} = ${n(reductionPercent)}%।`,
      `ਮੂਲ ਮਾਤਰਾ = ${n(v.reductionAmount)} x 100 / ${n(reductionPercent)} = ${n(problem.answer)}।`,
      `ਮੂਲ ਮਾਤਰਾ = ${n(problem.answer)}`,
    ].join("\n");
  }
  return [
    "Let original price per kg = x.",
    `New price per kg = x x ${n(newPriceIndex)} / 100.`,
    "For the same expenditure:",
    "Old quantity = expenditure / x.",
    `New quantity = expenditure / (x x ${n(newPriceIndex)} / 100).`,
    `Difference = expenditure/x - expenditure/(x x ${n(newPriceIndex)}/100) = ${n(v.reductionAmount)}.`,
    `New quantity index = 100 x 100 / ${n(newPriceIndex)} = ${n(newQuantityIndex)}.`,
    `Quantity reduction = 100 - ${n(newQuantityIndex)} = ${n(reductionPercent)}%.`,
    `Original quantity = ${n(v.reductionAmount)} x 100 / ${n(reductionPercent)} = ${n(problem.answer)}.`,
    `Original quantity = ${n(problem.answer)}`,
  ].join("\n");
}

function renderLiquidReplacementExplanation(problem: CanonicalPercentageProblem, language: LanguageCode) {
  const v = problem.variables;
  const equation = `100 x (100 - ${n(v.replacementPercent)})^${n(v.iterations)} / 100^${n(v.iterations)}`;
  if (language === "hi") {
    return [
      "बचा हुआ मूल द्रव सूचकांक:",
      equation,
      `= ${n(problem.answer)}`,
      `बचा हुआ मूल द्रव = ${n(problem.answer)}%`,
    ].join("\n");
  }
  if (language === "pa") {
    return [
      "ਬਚਿਆ ਹੋਇਆ ਮੂਲ ਤਰਲ ਸੂਚਕਾਂਕ:",
      equation,
      `= ${n(problem.answer)}`,
      `ਬਚਿਆ ਹੋਇਆ ਮੂਲ ਤਰਲ = ${n(problem.answer)}%`,
    ].join("\n");
  }
  return [
    "Original liquid left index:",
    equation,
    `= ${n(problem.answer)}`,
    `Original liquid left = ${n(problem.answer)}%`,
  ].join("\n");
}

export function renderAdvancedPercentageExplanation(problem: CanonicalPercentageProblem, language: LanguageCode = "en") {
  if (!ADVANCED_PERCENTAGE_MOTIF_IDS.includes(problem.subtype as AdvancedPercentageMotifId)) {
    return undefined;
  }
  if (problem.subtype === "perc_const_absolute_offset") {
    return renderPriceConsumptionAbsoluteExplanation(problem, language);
  }
  if (problem.subtype === "perc_mix_alloy_replacement") {
    return renderLiquidReplacementExplanation(problem, language);
  }
  const text = textSet(problem, language);
  const lines: string[] = [];
  for (let index = 0; index < text.labels.length; index += 1) {
    lines.push(line(text.labels[index]!, text.equations[index]!, text.values[index]!));
  }
  lines.push(text.final);
  return lines.join("\n");
}

export function renderAdvancedLocalizedRealization(input: {
  language: LanguageCode;
  problem: CanonicalPercentageProblem;
  editorial?: EditorialRealization;
}): LocalizedRealization | undefined {
  const stem = renderAdvancedPercentageStem(input.problem, input.language);
  const explanation = renderAdvancedPercentageExplanation(input.problem, input.language);
  if (!stem || !explanation) return undefined;
  return {
    language: input.language,
    stem,
    explanation,
    lines: explanation.split("\n").map((renderedText) => ({
      intentKey: "fallback.english",
      sourceText: renderedText,
      renderedText,
      kind: "narration",
      fallbackUsed: false,
    })),
    coverage: {
      totalIntentLines: 0,
      localizedIntentLines: 0,
      fallbackCount: 0,
      missingIntents: [],
    },
  };
}

function advancedStep(id: string, label: string, variables: string[], outputVariable?: string, equation?: string): ReasoningStep {
  return {
    id,
    type: id === "final" ? "final_answer" : "apply_multiplier",
    descriptionKey: label,
    inputVariables: variables,
    outputVariable,
    equation,
  };
}

export function buildAdvancedPercentageGraph(problem: CanonicalPercentageProblem): ReasoningGraph {
  const stepInputs = Object.keys(problem.variables)
    .filter((key) => key !== "answerIsPercentage")
    .slice(0, 6);
  const steps = [
    advancedStep(
      "advanced_index_method",
      `${problem.subtype}_calculation`,
      stepInputs,
      "advancedResult",
      "advancedResult = {answer}",
    ),
    advancedStep(
      "final",
      "confirm_final_answer",
      ["advancedResult", "answer"],
      undefined,
      "answer = {answer}",
    ),
  ];

  return {
    subtype: problem.subtype,
    reasoningPattern: problem.reasoningPattern,
    insightKey: `${problem.subtype}_index_method`,
    steps,
    branches: [
      {
        branchId: "standard",
        branchType: "standard",
        steps,
      },
    ],
    finalEquation: "answer = {answer}",
    trapSummary: problem.traps.join("|"),
  };
}
