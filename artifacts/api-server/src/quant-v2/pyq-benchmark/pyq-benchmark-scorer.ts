import type { FormulaQuestion } from "../../lib/core/generator-engine";
import type {
  PyqBenchmarkInput,
  PyqBenchmarkPattern,
  PyqDifficultyBand,
} from "./pyq-benchmark-types";

const ADVANCED_PERCENTAGE_FAMILIES = new Set([
  "perc_geom_dimensional_scale",
  "perc_demo_cross_tab_literacy",
  "perc_budget_cascading_remainder",
  "perc_const_absolute_offset",
  "perc_exam_weighted_aggregate",
  "perc_asset_variable_depreciation",
  "perc_workforce_hierarchical_attrition",
  "perc_agri_land_yield_compound",
  "perc_demo_multi_factor_growth",
  "perc_comm_tiered_salary_override",
  "perc_asset_compound_leakage",
  "perc_num_linear_equation_balancing",
  "perc_num_fractional_perturbation_complex",
  "perc_tax_bracket_retained_income",
  "perc_num_square_proportional_delta",
  "perc_mix_alloy_replacement",
]);

const ADVANCED_PROFIT_LOSS_PATTERNS =
  /partial_inventory|dishonest|fraud|hybrid|gst|tax|cashback|buy_get|repair|overhead|manufacturing|supply_chain|multi_condition|inverse|mixed_baseline|fractional|asymmetric/u;

const ADVANCED_INTEREST_PATTERNS =
  /installment|bankers|present_worth|true_discount|alligation|partial|specific_year|nominal|effective|mixed_condition|crossover|frequency|fractional|different_rates|weighted/u;

const ADVANCED_RATIO_PROPORTION_PATTERNS =
  /transfer|chain_ratio|joint_variation|combined_direct_inverse|side_area_volume|age_future|age_past|partnership_time/u;

const ADVANCED_TIME_WORK_PATTERNS =
  /cycle|leave|join|phase|replacement|pairwise|unknown|helper|contract|leak|overflow|resource|negative|decay|schedule|deadline|hidden/u;

const INVERSE_OR_HIDDEN =
  /reverse|inverse|hidden|target|recover|required|difference|calibration|from_difference|back_calc|mixed_baseline/u;

const MULTI_CONDITION =
  /successive|compound|hybrid|partial|weighted|two_article|dual|supply|commission|tax|cashback|overhead|manufacturing|migration|cascading|slab/u;

const DI_PATTERN =
  /\b(?:table|bar graph|bar chart|pie chart|line graph|chart|caselet|following data|given graph|study the given)\b/iu;

export function isDataInterpretationLike(question: FormulaQuestion) {
  return DI_PATTERN.test(String(question.text ?? ""));
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function answerText(question: FormulaQuestion) {
  return String(question.options?.[question.correct ?? 0] ?? "");
}

function allText(question: FormulaQuestion) {
  return [
    question.text,
    question.textHi,
    question.textPa,
    question.explanation,
    question.explanationHi,
    question.explanationPa,
    ...(question.options ?? []),
    ...((question as any).optionsHi ?? []),
    ...((question as any).optionsPa ?? []),
  ].join("\n");
}

function realismOf(question: FormulaQuestion) {
  return Number(
    question.examRealismMetadata?.realismScore ??
      (question.qualityMetrics as any)?.metrics?.editorialRealismScore ??
      (question.debugMetadata?.quantV2 as any)?.qualityMetrics?.metrics?.editorialRealismScore ??
      0,
  );
}

function graphStepCount(graph: any, family: string) {
  const graphSteps = Array.isArray(graph?.steps)
    ? graph.steps.length
    : 0;
  if (graphSteps > 0) return graphSteps;
  if (MULTI_CONDITION.test(family)) return 4;
  if (INVERSE_OR_HIDDEN.test(family)) return 3;
  return 2;
}

function inferDifficulty(input: PyqBenchmarkInput, steps: number): PyqDifficultyBand {
  const text = `${input.family} ${input.topology}`;
  if (
    input.topic === "profit-loss" &&
    ADVANCED_PROFIT_LOSS_PATTERNS.test(text)
  ) {
    return "advanced";
  }
  if (
    input.topic === "interest" &&
    ADVANCED_INTEREST_PATTERNS.test(text)
  ) {
    return steps >= 4 ? "advanced" : "hard";
  }
  if (
    input.topic === "ratio-proportion" &&
    ADVANCED_RATIO_PROPORTION_PATTERNS.test(text)
  ) {
    return steps >= 4 ? "advanced" : "hard";
  }
  if (
    input.topic === "time-work" &&
    ADVANCED_TIME_WORK_PATTERNS.test(text)
  ) {
    return steps >= 4 ? "advanced" : "hard";
  }
  if (
    input.topic === "percentage" &&
    ADVANCED_PERCENTAGE_FAMILIES.has(input.family)
  ) {
    return steps >= 4 ? "advanced" : "hard";
  }
  if (steps >= 5 || /multi_condition|hybrid/u.test(text)) return "advanced";
  if (steps >= 3 || INVERSE_OR_HIDDEN.test(text)) return "hard";
  if (steps === 2) return "medium";
  return "easy";
}

function semanticTrapTypes(input: PyqBenchmarkInput) {
  const known = [
    ...(input.schedulerMetadata?.distractorTraps ?? []),
    ...((input.question.optionMetadata ?? []) as any[])
      .filter((item) => !item.isCorrect)
      .map((item) => String(item.reasoningTrap ?? item.distractorType ?? ""))
      .filter(Boolean),
  ];
  const text = `${input.family} ${input.topology} ${input.question.text}`;
  const inferred: string[] = [];
  if (/\b(?:cp|sp|mp)\b|discount|marked|markup/iu.test(text)) inferred.push("CP/SP/MP confusion");
  if (/simple interest|compound interest|si_|ci_|interest/iu.test(text)) inferred.push("SI/CI base confusion");
  if (/half|quarter|month|nominal|effective|period/iu.test(text)) inferred.push("wrong compounding period conversion");
  if (/banker|true discount|present worth|bill/iu.test(text)) inferred.push("present worth vs amount confusion");
  if (/installment|repayment|partial|discharge/iu.test(text)) inferred.push("ignoring repayment timing");
  if (/nth|specific_year|second year|third year/iu.test(text)) inferred.push("nth-year interest vs total CI");
  if (/alligation|split|two parts|weighted|portfolio/iu.test(text)) inferred.push("wrong weighted-average side");
  if (/ratio|proportion|variation|partnership|age|map scale|similar|workers|A:B|B:C/iu.test(text)) inferred.push("ratio base confusion");
  if (/inverse|workers|days|varies inversely/iu.test(text)) inferred.push("direct/inverse variation confusion");
  if (/side|area|volume|similar/iu.test(text)) inferred.push("wrong geometry scaling power");
  if (/transfer|given by A to B|after.*given/iu.test(text)) inferred.push("transfer direction error");
  if (/time[-_ ]?work|pipe|cistern|leak|tank|worker|work|wage|cycle|alternate|food|resource/iu.test(text)) inferred.push("rate-state sign or unit-work confusion");
  if (/leak|empty|drain/iu.test(text)) inferred.push("adding emptying rate instead of subtracting");
  if (/alternate|cycle|rest/iu.test(text)) inferred.push("terminal cycle boundary error");
  if (/wage|helper|contract/iu.test(text)) inferred.push("wage share by time instead of contribution");
  if (/partnership|invests|profit/iu.test(text)) inferred.push("ignoring partnership time");
  if (/successive|compound|increase.*decrease|decrease.*increase/iu.test(text)) inferred.push("additive vs multiplicative");
  if (/false|weight|dishonest|fraud/iu.test(text)) inferred.push("wrong denominator in false weight");
  if (/weighted|literacy|aggregate/iu.test(text)) inferred.push("simple average instead of weighted average");
  if (/tax|gst/iu.test(text)) inferred.push("discount before/after tax");
  if (/repair|overhead|cashback|commission/iu.test(text)) inferred.push("ignoring overhead/cashback");
  if (/reverse|inverse|target|required|hidden|from_difference/iu.test(text)) inferred.push("wrong base");
  if (/election|vote|valid|margin/iu.test(text)) inferred.push("valid votes instead of total votes");
  return [...new Set([...known, ...inferred].filter(Boolean))];
}

function optionQuality(question: FormulaQuestion) {
  const options = question.options ?? [];
  let score = 100;
  const notes: string[] = [];
  if (!options.includes(answerText(question))) {
    score -= 45;
    notes.push("answer missing from options");
  }
  if (new Set(options).size !== options.length) {
    score -= 35;
    notes.push("duplicate options");
  }
  const correctAnswerText = answerText(question);
  const ratioOptions =
    /:/u.test(correctAnswerText) &&
    options.every((option) => /^\s*\d+(?:\.\d+)?:\d+(?:\.\d+)?(?::\d+(?:\.\d+)?)?\s*$/u.test(String(option)));
  const fractionOptions =
    /^\s*\d+\/\d+\s*$/u.test(correctAnswerText) &&
    options.every((option) => /^\s*\d+\/\d+\s*$/u.test(String(option)));
  if (ratioOptions || fractionOptions) {
    return {
      score: clamp(score),
      notes: [...new Set(notes)],
    };
  }
  const answerMatch = answerText(question).match(/-?\d+(?:\.\d+)?/u);
  const answer = answerMatch ? Number(answerMatch[0]) : undefined;
  if (Number.isFinite(answer) && answer !== 0) {
    const isPercent = /%/u.test(answerText(question));
    for (const option of options) {
      const optionMatch = String(option).match(/-?\d+(?:\.\d+)?/u);
      const value = optionMatch ? Number(optionMatch[0]) : undefined;
      if (!Number.isFinite(value) || value === answer) continue;
      if (value <= 0) {
        score -= 20;
        notes.push("non-positive option where positive value is expected");
      } else if (isPercent && value > 250) {
        score -= 20;
        notes.push("absurd percentage option");
      } else if (!isPercent && (value < Math.abs(answer) * 0.02 || value > Math.abs(answer) * 30)) {
        score -= 10;
        notes.push("option scale mismatch");
      }
    }
  }
  return {
    score: clamp(score),
    notes: [...new Set(notes)],
  };
}

function languageQuality(question: FormulaQuestion) {
  const text = allText(question);
  let score = 100;
  const notes: string[] = [];
  if (/\b(?:undefined|null|NaN)\b/u.test(text)) {
    score -= 60;
    notes.push("undefined/null/NaN leakage");
  }
  if (/\b(?:cost price|selling price|marked price|Find the|The price|newPriceIndex)\b/u.test(String(question.textHi ?? "")) ||
    /\b(?:cost price|selling price|marked price|Find the|The price|newPriceIndex)\b/u.test(String(question.textPa ?? ""))) {
    score -= 35;
    notes.push("English leakage in HI/PA");
  }
  if (/कुल मान|अंतिम मान|ਕੁੱਲ ਮਾਤਰਾ/u.test(text)) {
    score -= 20;
    notes.push("generic HI/PA labels");
  }
  return {
    score: clamp(score),
    notes,
  };
}

function statementNaturalness(question: FormulaQuestion, rawRealism: number) {
  let score = Math.max(rawRealism || 0, 82);
  const text = String(question.text ?? "");
  if (/worksheet|exam-style|selected item|given sale record|commercial arithmetic/iu.test(text)) {
    score -= 12;
  }
  if (text.length > 360) score -= 8;
  if (/\b(?:topology|graph|template|relation index)\b/iu.test(text)) score -= 30;
  return clamp(score);
}

export function scorePyqBenchmark(input: PyqBenchmarkInput): PyqBenchmarkPattern {
  const rawRealism = realismOf(input.question);
  const steps = graphStepCount(input.graph, input.family);
  const difficulty = inferDifficulty(input, steps);
  const traps = semanticTrapTypes(input);
  const option = optionQuality(input.question);
  const language = languageQuality(input.question);
  const naturalness = statementNaturalness(input.question, rawRealism);
  const hasHiddenOrInverse = INVERSE_OR_HIDDEN.test(`${input.family} ${input.topology}`);
  const hasMultiCondition = MULTI_CONDITION.test(`${input.family} ${input.topology}`);

  const conceptDepthScore = clamp(
    48 +
      Math.min(steps, 5) * 9 +
      (hasHiddenOrInverse ? 9 : 0) +
      (hasMultiCondition ? 8 : 0) +
      (difficulty === "advanced" ? 8 : 0),
  );
  const trapScore = clamp(
    traps.length >= 2 ? 92 : traps.length === 1 ? 78 : 52,
  );
  const realismScore = clamp(Math.max(rawRealism, naturalness));
  const sscLikenessScore = clamp(
    conceptDepthScore * 0.24 +
      realismScore * 0.3 +
      trapScore * 0.2 +
      option.score * 0.14 +
      language.score * 0.12,
  );
  const pyqLevelScore = clamp(
    sscLikenessScore +
      (difficulty === "medium" ? 3 : 0) +
      (difficulty === "hard" ? 5 : 0) +
      (difficulty === "advanced" ? 6 : 0),
  );
  const pyqPlusScore = clamp(
    pyqLevelScore -
      8 +
      (difficulty === "hard" ? 5 : 0) +
      (difficulty === "advanced" ? 10 : 0) +
      (traps.length >= 2 ? 4 : 0),
  );

  return {
    topic: isDataInterpretationLike(input.question)
      ? "data_interpretation"
      : input.topic,
    family: input.family,
    topology: input.topology,
    difficulty,
    requiredReasoningSteps: steps,
    trapTypes: traps,
    realism: Number(realismScore.toFixed(2)),
    statementNaturalness: Number(naturalness.toFixed(2)),
    sscLikenessScore: Number(sscLikenessScore.toFixed(2)),
    pyqLevelScore: Number(pyqLevelScore.toFixed(2)),
    pyqPlusScore: Number(pyqPlusScore.toFixed(2)),
    optionQualityScore: Number(option.score.toFixed(2)),
    languageQualityScore: Number(language.score.toFixed(2)),
    conceptDepthScore: Number(conceptDepthScore.toFixed(2)),
    notes: [...option.notes, ...language.notes],
  };
}
