import { createWriteStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { finished } from "node:stream/promises";
import { randomUUID } from "node:crypto";

import type { FormulaQuestion, GeneratorOptions, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2PercentageQuestionCandidate } from "../../lib/quant-v2/percentage-admin-adapter";
import { createQuantV2ProfitLossQuestionCandidate } from "../../lib/quant-v2/profit-loss-admin-adapter";
import { createQuantV2InterestQuestionCandidate } from "../../lib/quant-v2/interest-admin-adapter";
import { createQuantV2RatioProportionQuestionCandidate } from "../../lib/quant-v2/ratio-proportion-admin-adapter";
import { createQuantV2TimeWorkQuestionCandidate } from "../../lib/quant-v2/time-work-admin-adapter";
import { createQuantV2TimeSpeedDistanceQuestionCandidate } from "../../lib/quant-v2/time-speed-distance-admin-adapter";
import { createQuantV2MixtureAlligationQuestionCandidate } from "../../lib/quant-v2/mixture-alligation-admin-adapter";
import { COMMERCIAL_OBJECT_POOL } from "../editorial/commercial-object-pools";
import { validateCorpusAuditBatch } from "../validators/corpus-audit-validator";
import {
  createCorpusSchedulerState,
  generateScheduledQuestion,
  interleaveScheduledPreviewQuestions,
  extractCorpusSchedulerMetadata,
  summarizeCorpusScheduler,
  type CorpusSchedulerState,
  type CorpusSchedulerSummary,
} from "../corpus-scheduler/corpus-scheduler";
import { evaluateCorpusQuality } from "../corpus-scheduler/corpus-quality-evaluator";
import { getCorpusAuditPreset } from "./corpus-audit-presets";
import {
  validateQuantV2SchedulerProfileForPreset,
  validateQuantV2TopologyForPreset,
} from "../../lib/quant-v2/migrated-quant-topics";
import {
  estimateCorpusAuditExportSizeMb,
  getCorpusAuditExportProfile,
  shouldIncludeMultilingualExplanations,
} from "./corpus-audit-profiles";
import type {
  CorpusAuditExportItem,
  CorpusAuditExportOptions,
  CorpusAuditExportResult,
  CorpusAuditJobSnapshot,
  CorpusAuditSummary,
  CorpusAuditStatus,
} from "./corpus-audit-types";

const DEFAULT_BATCH_SIZE = 250;
const MAX_AUDIT_COUNT = 20_000;
const PREVIEW_SAMPLE_COUNT = 25;
const TIME_WORK_SMALL_EXPORT_OPENING_CAP = 2;
const TIME_WORK_TRIVIAL_ONE_STEP_FAMILIES = new Set<string>([
  "tw_contract_penalty_bonus",
  "tw_work_quality_rejection",
  "tw_typist_pages_per_hour",
  "tw_printer_job_queue",
  "tw_parallel_machine_batches",
  "tw_one_day_work_fraction",
  "pc_capacity_leakage_rate",
  "pc_tank_capacity_from_rate",
  "pc_two_tanks_transfer",
  "pc_overflow_waste_rate",
]);
const TIME_WORK_TRIVIAL_ONE_STEP_SOLVER_KINDS = new Set<string>([
  "one_day_fraction",
  "capacity_from_rate",
  "overflow_waste",
]);

const PERCENTAGE_AUDIT_PATTERN: Pattern = {
  id: "quant-v2-corpus-audit-percentage",
  type: "formula",
  section: "Quant",
  topic: "percentage",
  subtopic: "percentage",
  difficulty: "Medium",
  templateVariants: ["Quant-v2 corpus audit percentage pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-percentage",
};

const PROFIT_LOSS_AUDIT_PATTERN: Pattern = {
  id: "quant-v2-corpus-audit-profit-loss",
  type: "formula",
  section: "Quant",
  topic: "profit_loss_discount",
  subtopic: "profit_loss_discount",
  difficulty: "Medium",
  templateVariants: ["Quant-v2 corpus audit profit loss discount pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-profit-loss",
};

const INTEREST_AUDIT_PATTERN: Pattern = {
  id: "quant-v2-corpus-audit-interest",
  type: "formula",
  section: "Quant",
  topic: "interest",
  subtopic: "si-ci",
  difficulty: "Medium",
  templateVariants: ["Quant-v2 corpus audit interest pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-interest",
};

const RATIO_PROPORTION_AUDIT_PATTERN: Pattern = {
  id: "quant-v2-corpus-audit-ratio-proportion",
  type: "formula",
  section: "Quant",
  topic: "ratio_proportion",
  subtopic: "ratio_proportion",
  difficulty: "Medium",
  templateVariants: ["Quant-v2 corpus audit ratio proportion variation pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-ratio-proportion",
};

const TIME_WORK_AUDIT_PATTERN: Pattern = {
  id: "quant-v2-corpus-audit-time-work",
  type: "formula",
  section: "Quant",
  topic: "time_work",
  subtopic: "time_work",
  difficulty: "Medium",
  templateVariants: ["Quant-v2 corpus audit time work pipes cisterns pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-time-work",
};

const TIME_SPEED_DISTANCE_AUDIT_PATTERN: Pattern = {
  id: "quant-v2-corpus-audit-time-speed-distance",
  type: "formula",
  section: "Quant",
  topic: "time_speed_distance",
  subtopic: "time_speed_distance",
  difficulty: "Medium",
  templateVariants: ["Quant-v2 corpus audit time speed distance pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-time-speed-distance",
};

const MIXTURE_ALLIGATION_AUDIT_PATTERN: Pattern = {
  id: "quant-v2-corpus-audit-mixture-alligation",
  type: "formula",
  section: "Quant",
  topic: "mixture_alligation",
  subtopic: "mixture_alligation",
  difficulty: "Medium",
  templateVariants: ["Quant-v2 corpus audit mixture alligation pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-mixture-alligation",
};

function auditPatternForPreset(presetId: string): Pattern {
  if (presetId === "profit_loss_audit") return PROFIT_LOSS_AUDIT_PATTERN;
  if (presetId === "interest_audit") return INTEREST_AUDIT_PATTERN;
  if (presetId === "ratio_proportion_audit") return RATIO_PROPORTION_AUDIT_PATTERN;
  if (presetId === "time_work_audit") return TIME_WORK_AUDIT_PATTERN;
  if (presetId === "time_speed_distance_audit") return TIME_SPEED_DISTANCE_AUDIT_PATTERN;
  if (presetId === "mixture_alligation_audit") return MIXTURE_ALLIGATION_AUDIT_PATTERN;
  return PERCENTAGE_AUDIT_PATTERN;
}

function generateForPreset(presetId: string, pattern: Pattern, options: GeneratorOptions) {
  if (presetId === "profit_loss_audit") {
    return createQuantV2ProfitLossQuestionCandidate(pattern, options);
  }
  if (presetId === "interest_audit") {
    return createQuantV2InterestQuestionCandidate(pattern, options);
  }
  if (presetId === "ratio_proportion_audit") {
    return createQuantV2RatioProportionQuestionCandidate(pattern, options);
  }
  if (presetId === "time_work_audit") {
    return createQuantV2TimeWorkQuestionCandidate(pattern, options);
  }
  if (presetId === "time_speed_distance_audit") {
    return createQuantV2TimeSpeedDistanceQuestionCandidate(pattern, options);
  }
  if (presetId === "mixture_alligation_audit") {
    return createQuantV2MixtureAlligationQuestionCandidate(pattern, options);
  }
  return createQuantV2PercentageQuestionCandidate(pattern, options);
}

function normalizeExportText(text: unknown) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/\s+/gu, " ")
    .replace(/[^\p{L}\p{N}\s:.₹-]/gu, "")
    .trim();
}

function exportOpeningKey(question: FormulaQuestion) {
  return String(question.text ?? "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/u)
    .filter(Boolean)
    .slice(0, 8)
    .join(" ")
    .toLowerCase();
}

function canonicalProblemOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.canonicalProblem ??
    (question.semanticMetadata as any)?.problem;
}

function topologyNumericAnswerFingerprint(question: FormulaQuestion) {
  const problem = canonicalProblemOf(question);
  const numericSignature = problem?.auditMeta?.numericSignature ??
    Object.entries(problem?.variables ?? {})
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${key}:${Array.isArray(value) ? value.join(",") : String(value)}`)
      .join("|");
  const answer = question.options?.[question.correct ?? 0] ?? "";
  return `${problem?.topologyId ?? problem?.family ?? ""}::${numericSignature}::${normalizeExportText(answer)}`;
}

function timeWorkUglyDecimalIssue(question: FormulaQuestion) {
  const text = [
    question.text,
    question.explanation,
    question.explanationHi,
    question.explanationPa,
    question.options?.join("\n"),
  ].filter(Boolean).join("\n");
  const decimalValues = text.match(/(?:₹|â‚¹)?\d+\.\d+/gu) ?? [];
  const allowed = [0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8];
  return decimalValues.some((raw) => {
    const value = Number(raw.replace(/[^\d.-]/gu, ""));
    if (!Number.isFinite(value)) return false;
    const fraction = Math.round((Math.abs(value) - Math.floor(Math.abs(value))) * 100) / 100;
    if (/^(?:₹|â‚¹)/u.test(raw)) return !(Math.abs(fraction) < 0.006 || Math.abs(fraction - 0.5) < 0.006);
    return !allowed.some((allowedFraction) => Math.abs(fraction - allowedFraction) < 0.006);
  });
}

function timeWorkTrivialOneStepIssue(question: FormulaQuestion) {
  const problem = canonicalProblemOf(question);
  const family = String(problem?.family ?? problem?.motifId ?? "");
  const solverKind = String(problem?.solverModel?.kind ?? "");
  if (TIME_WORK_TRIVIAL_ONE_STEP_FAMILIES.has(family)) return true;
  if (TIME_WORK_TRIVIAL_ONE_STEP_SOLVER_KINDS.has(solverKind)) return true;
  const stem = normalizeExportText(question.text);
  const explanation = normalizeExportText(question.explanation);
  if (/\bone day work\b|\bone day output\b|\bwork done in one day\b/u.test(stem)) return true;
  if (
    /\b(?:litres?|pages?|parts?|boxes?|files?)\b/u.test(stem) &&
    /\bper\b/u.test(stem) &&
    /\b(?:minutes?|hours?|days?)\b/u.test(stem) &&
    /(?:how much|how many|quantity|volume|output|supplied|received)/u.test(stem) &&
    /(?:c\s*=\s*r|waste\s*=\s*r|rate\s*times\s*time|r\\times|\\times)/u.test(explanation)
  ) {
    return true;
  }
  return false;
}

function timeWorkBrokenStemIssue(question: FormulaQuestion) {
  const text = String(question.text ?? "").trim();
  if (!text) return true;
  if (!/[?]\s*$/u.test(text)) return true;
  const withoutQuestion = text.replace(/[?\s]+$/u, "").trim().toLowerCase();
  if (/\b(?:from|with|for|by|and|then|starting with)\s*$/u.test(withoutQuestion)) return true;
  if (/starting with\s*\?/iu.test(text)) return true;
  if (/continue alternately from(?:\s|[?.]|$)/iu.test(text)) return true;
  return !/(in how many|how many|what fraction|what is|what will|find|by how many|for how many)/iu.test(text);
}

function timeWorkExportQualityIssue(
  presetId: CorpusAuditExportOptions["presetId"],
  question: FormulaQuestion,
  guards: {
    stems: Set<string>;
    topologyNumericAnswers: Set<string>;
    openings: Map<string, number>;
    enforceOpeningCap: boolean;
  },
) {
  if (presetId !== "time_work_audit") return undefined;
  const stem = normalizeExportText(question.text);
  if (guards.stems.has(stem)) return "exact duplicate EN stem";
  if (guards.topologyNumericAnswers.has(topologyNumericAnswerFingerprint(question))) {
    return "same topology numeric answer duplicate";
  }
  if (timeWorkBrokenStemIssue(question)) return "broken/incomplete stem";
  if (timeWorkUglyDecimalIssue(question)) return "ugly decimal";
  if (timeWorkTrivialOneStepIssue(question)) return "trivial one-step question";
  const opening = exportOpeningKey(question);
  if (guards.enforceOpeningCap && (guards.openings.get(opening) ?? 0) >= TIME_WORK_SMALL_EXPORT_OPENING_CAP) {
    return "first eight words repeated";
  }
  return undefined;
}

function acceptTimeWorkExportQuestion(
  presetId: CorpusAuditExportOptions["presetId"],
  question: FormulaQuestion,
  guards: {
    stems: Set<string>;
    topologyNumericAnswers: Set<string>;
    openings: Map<string, number>;
  },
) {
  if (presetId !== "time_work_audit") return;
  guards.stems.add(normalizeExportText(question.text));
  guards.topologyNumericAnswers.add(topologyNumericAnswerFingerprint(question));
  const opening = exportOpeningKey(question);
  guards.openings.set(opening, (guards.openings.get(opening) ?? 0) + 1);
}

type RunningSummary = CorpusAuditSummary & {
  scoreTotal: number;
  hindiPresent: number;
  punjabiPresent: number;
  hindiScriptOk: number;
  punjabiScriptOk: number;
  hindiExplanationPresent: number;
  punjabiExplanationPresent: number;
  fallbackCount: number;
  englishExplanationLines: number;
  hindiExplanationLines: number;
  punjabiExplanationLines: number;
  openings: Map<string, number>;
  scheduler?: CorpusSchedulerSummary;
};

function sanitizeCount(count: number) {
  return Math.min(MAX_AUDIT_COUNT, Math.max(1, Math.floor(Number(count) || 1)));
}

function increment(map: Record<string, number>, key: unknown) {
  const normalized = String(key ?? "unknown").trim() || "unknown";
  map[normalized] = (map[normalized] ?? 0) + 1;
}

function exportRoot() {
  return path.resolve(process.cwd(), "exports");
}

function timestampSlug(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + `-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function createSummary(): RunningSummary {
  return {
    generatedCount: 0,
    topologyDistribution: {},
    subtypeDistribution: {},
    difficultyDistribution: {},
    compactnessDistribution: {},
    domainDistribution: {},
    objectFrequency: {},
    realismScores: {
      min: 100,
      max: 0,
      average: 0,
    },
    validatorFailureCounts: {},
    repeatedStructureWarnings: [],
    multilingualConsistency: {
      hindiCoverage: 0,
      punjabiCoverage: 0,
      hindiScriptConsistency: 0,
      punjabiScriptConsistency: 0,
      hindiExplanationCoverage: 0,
      punjabiExplanationCoverage: 0,
      localizationCompleteness: 0,
      fallbackCount: 0,
    },
    explanationCompactness: {
      englishAverageLines: 0,
      hindiAverageLines: 0,
      punjabiAverageLines: 0,
    },
    exportProfile: "audit_light",
    includeMultilingualExplanations: false,
    estimatedSizeMb: 0,
    exportWarnings: [],
    scoreTotal: 0,
    hindiPresent: 0,
    punjabiPresent: 0,
    hindiScriptOk: 0,
    punjabiScriptOk: 0,
    hindiExplanationPresent: 0,
    punjabiExplanationPresent: 0,
    fallbackCount: 0,
    englishExplanationLines: 0,
    hindiExplanationLines: 0,
    punjabiExplanationLines: 0,
    openings: new Map(),
  };
}

function forcedMotifsForTopology(selection: CorpusAuditExportOptions["topologySelection"]) {
  if (selection === "relational_percentage") {
    return [
      "perc_relational_chain",
      "perc_reverse_relation",
      "perc_ratio_percentage_hybrid",
    ];
  }

  if (selection === "advanced_percentage") {
    return [
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
    ];
  }

  if (selection === "direct_profit_loss") {
    return [
      "pl_cp_sp_percent",
      "pl_cp_percent_to_sp",
      "pl_sp_percent_to_cp",
      "pl_no_profit_no_loss",
      "pl_equal_sp_profit_loss",
      "pl_two_article_overall",
    ];
  }

  if (selection === "markup_discount_profit_loss") {
    return [
      "pl_mp_discount_to_sp",
      "pl_mp_sp_discount_percent",
      "pl_cp_mp_discount_to_percent",
      "pl_successive_discounts",
      "pl_mp_for_target_profit",
      "pl_markup_discount_triangle",
      "pl_target_profit_discount_calibration",
      "pl_target_profit_mp_calibration",
      "pl_successive_discount_equivalent",
    ];
  }

  if (selection === "advanced_profit_loss") {
    return [
      "pl_partial_inventory_allocation",
      "pl_sequential_supply_chain",
      "pl_supply_chain_mixed_profit_loss",
      "pl_compound_error_baseline_shift",
      "pl_dishonest_dealer_weight_fraud",
      "pl_dishonest_dealer_dual_fraud",
      "pl_dishonest_dealer_absolute_hybrid",
      "pl_profit_after_commission_tax",
      "pl_repair_overhead_cost",
      "pl_required_sp_after_overhead",
      "pl_manufacturing_breakdown",
      "pl_multi_condition_inverse_absolute",
    ];
  }

  if (selection === "simple_interest_core") {
    return [
      "int_si_from_prt",
      "int_si_amount_from_prt",
      "int_si_principal_from_si_rt",
      "int_si_rate_from_si_pt",
      "int_si_time_from_si_pr",
      "int_si_difference_two_cases",
      "int_si_sum_doubles",
      "int_si_sum_triples",
      "int_si_partial_discharge_timeline",
      "int_si_alligation_mixture",
      "int_two_sums_same_interest",
    ];
  }

  if (selection === "compound_interest_core") {
    return [
      "int_ci_amount_annual",
      "int_ci_from_amount",
      "int_ci_principal_from_amount",
      "int_ci_rate_from_amount",
      "int_ci_time_from_amount",
      "int_ci_two_year_formula",
      "int_ci_three_year_formula",
      "int_ci_si_difference_2_years",
      "int_ci_si_difference_3_years",
      "int_ci_half_yearly",
      "int_ci_quarterly",
      "int_ci_monthly",
    ];
  }

  if (selection === "advanced_interest") {
    return [
      "int_hybrid_si_ci_crossover",
      "int_si_ci_amount_difference",
      "int_si_partial_discharge_timeline",
      "int_ci_specific_year_isolation",
      "int_ci_nth_year_interest_from_principal",
      "int_same_interest_different_sums_rates_times",
      "int_divide_total_interest_between_investments",
      "int_investment_ratio_from_interest",
      "int_weighted_interest_income",
      "int_ci_specific_year_rate_principal",
      "int_si_ci_mixed_condition_inverse",
    ];
  }

  return undefined;
}

function quantV2Payload(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 ?? {}) as Record<string, any>;
}

function validatorReports(question: FormulaQuestion) {
  return (
    quantV2Payload(question).validatorReports ??
    (question.proceduralLogic as any)?.validatorReports ??
    {}
  ) as Record<string, any>;
}

function topologyKey(topology: any, fallbackSubtype: string) {
  if (!topology) return `none:${fallbackSubtype}`;
  return [
    topology.family ?? "none",
    topology.variant ?? fallbackSubtype,
  ].join(":");
}

function hasHindiScript(value: string) {
  return /[\u0900-\u097F]/.test(value);
}

function hasPunjabiScript(value: string) {
  return /[\u0A00-\u0A7F]/.test(value);
}

function updateObjectFrequency(summary: RunningSummary, text: string) {
  const lower = text.toLowerCase();
  for (const object of COMMERCIAL_OBJECT_POOL) {
    if (lower.includes(object.en.toLowerCase())) {
      increment(summary.objectFrequency, object.en);
    }
  }
}

function explanationLineCount(value: string | undefined) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean).length;
}

function itemFromQuestion(input: {
  index: number;
  question: FormulaQuestion;
  includeSvg: boolean;
  includeFullQuestion: boolean;
  includeMultilingualExplanations: boolean;
  includeReasoningGraph: boolean;
  includeValidatorReports: boolean;
  includeRealismMetadata: boolean;
  includeLocalizationMetadata: boolean;
}): CorpusAuditExportItem {
  const quantV2 = quantV2Payload(input.question);
  const reports = validatorReports(input.question);
  const problem = quantV2.canonicalProblem ?? (input.question.semanticMetadata as any)?.problem;
  const correct = input.question.correct ?? 0;
  const answer = input.question.options?.[correct] ?? String(problem?.answer ?? "");

  const explanationHi = input.includeMultilingualExplanations
    ? input.question.explanationHi ?? ""
    : undefined;
  const explanationPa = input.includeMultilingualExplanations
    ? input.question.explanationPa ?? ""
    : undefined;

  return {
    index: input.index,
    id: String(quantV2.signature ?? `sample-${input.index}`),
    question: input.question.text,
    options: input.question.options,
    correct,
    answer,
    explanation: input.question.explanation,
    ...(explanationHi ? { explanationHi } : {}),
    ...(explanationPa ? { explanationPa } : {}),
    multilingual: {
      en: {
        question: input.question.text,
        options: input.question.options,
        explanation: input.question.explanation,
      },
      hi: input.question.textHi
        ? {
            question: input.question.textHi,
            options: input.question.optionsHi ?? input.question.options,
            ...(explanationHi ? { explanation: explanationHi } : {}),
          }
        : undefined,
      pa: input.question.textPa
        ? {
            question: input.question.textPa,
            options: input.question.optionsPa ?? input.question.options,
            ...(explanationPa ? { explanation: explanationPa } : {}),
          }
        : undefined,
    },
    difficulty: input.question.difficultyLabel ?? input.question.difficulty ?? "Medium",
    topology: quantV2.topology ?? problem?.topology ?? null,
    reasoningGraph: input.includeReasoningGraph
      ? quantV2.reasoningGraph ?? input.question.reasoningGraph ?? null
      : null,
    semanticMetadata: quantV2.semanticMetadata ?? input.question.semanticMetadata ?? null,
    visual:
      quantV2.visual ??
      quantV2.semanticMetadata?.visual ??
      (input.question as any).visual ??
      (input.question.semanticMetadata as any)?.visual ??
      null,
    validatorReports: input.includeValidatorReports ? reports : null,
    traps: problem?.traps ?? input.question.examRealismMetadata?.reasoningTraps ?? [],
    qualityMetrics: quantV2.qualityMetrics ?? input.question.qualityMetrics ?? null,
    realismMetadata: input.includeRealismMetadata
      ? input.question.examRealismMetadata ?? null
      : null,
    difficultyMetadata: input.question.difficultyMetadata ?? null,
    compactnessProfile:
      quantV2.realizationCompactness ??
      (quantV2.editorial?.naturalization?.rhythmProfile as string | undefined) ??
      "unknown",
    semanticAnchors: {
      scenario: quantV2.scenario,
      category: quantV2.category,
      subtype: quantV2.subtype,
      reasoningPattern: quantV2.reasoningPattern,
      canonicalScenario:
        quantV2.canonicalScenario ??
        quantV2.semanticMetadata?.canonicalScenario ??
        (input.question.semanticMetadata as any)?.canonicalScenario ??
        null,
      semanticConsistency: reports.semanticConsistency ?? null,
      ...(input.includeLocalizationMetadata
        ? {
            localizationCoverage: input.question.nativeCoverage ?? null,
          }
        : {}),
    },
    corpusRealism: reports.corpusRealism ?? null,
    ...(input.includeSvg
      ? {
          svgRendering: quantV2.svgRendering ?? input.question.svgRendering ?? null,
        }
      : {}),
    ...(input.includeFullQuestion ? { sourceQuestion: input.question } : {}),
  };
}

function updateSummary(summary: RunningSummary, item: CorpusAuditExportItem) {
  summary.generatedCount += 1;

  const problem = (item.semanticMetadata as any)?.problem ?? (item.semanticMetadata as any);
  const subtype = String((item.semanticAnchors as any)?.subtype ?? problem?.subtype ?? "unknown");
  const category = String((item.semanticAnchors as any)?.category ?? problem?.category ?? "unknown");
  increment(summary.topologyDistribution, topologyKey(item.topology as any, subtype));
  increment(summary.subtypeDistribution, subtype);
  increment(summary.difficultyDistribution, item.difficulty);
  increment(summary.compactnessDistribution, item.compactnessProfile);
  increment(summary.domainDistribution, category);
  updateObjectFrequency(summary, item.question);

  const score =
    Number((item.qualityMetrics as any)?.metrics?.editorialRealismScore) ||
    Number((item.realismMetadata as any)?.realismScore) ||
    0;
  if (score > 0) {
    summary.realismScores.min = Math.min(summary.realismScores.min, score);
    summary.realismScores.max = Math.max(summary.realismScores.max, score);
    summary.scoreTotal += score;
  }

  for (const [name, report] of Object.entries((item.validatorReports as any) ?? {})) {
    if (report && typeof report === "object" && "valid" in report && report.valid === false) {
      increment(summary.validatorFailureCounts, name);
    }
  }

  const opening = item.question.split(/\s+/).slice(0, 7).join(" ").toLowerCase();
  summary.openings.set(opening, (summary.openings.get(opening) ?? 0) + 1);

  if (item.multilingual.hi?.question) {
    summary.hindiPresent += 1;
    if (hasHindiScript(item.multilingual.hi.question)) summary.hindiScriptOk += 1;
    if (item.multilingual.hi.explanation || item.explanationHi) {
      summary.hindiExplanationPresent += 1;
      summary.hindiExplanationLines += explanationLineCount(
        item.multilingual.hi.explanation ?? item.explanationHi,
      );
    }
  }
  if (item.multilingual.pa?.question) {
    summary.punjabiPresent += 1;
    if (hasPunjabiScript(item.multilingual.pa.question)) summary.punjabiScriptOk += 1;
    if (item.multilingual.pa.explanation || item.explanationPa) {
      summary.punjabiExplanationPresent += 1;
      summary.punjabiExplanationLines += explanationLineCount(
        item.multilingual.pa.explanation ?? item.explanationPa,
      );
    }
  }
  summary.englishExplanationLines += explanationLineCount(item.explanation);

  if (
    item.multilingual.hi?.question &&
    item.multilingual.hi.question === item.question
  ) {
    summary.fallbackCount += 1;
  }
  if (
    item.multilingual.pa?.question &&
    item.multilingual.pa.question === item.question
  ) {
    summary.fallbackCount += 1;
  }
}

function finalizeSummary(
  summary: RunningSummary,
  options: {
    exportProfile: CorpusAuditSummary["exportProfile"];
    includeMultilingualExplanations: boolean;
    estimatedSizeMb: number;
  },
): CorpusAuditSummary {
  const total = Math.max(summary.generatedCount, 1);
  const repeated = [...summary.openings.entries()]
    .filter(([, count]) => count > Math.max(5, total * 0.02))
    .slice(0, 20)
    .map(([opening, count]) => `Opening repeated ${count} times: ${opening}`);

  const finalized: CorpusAuditSummary = {
    generatedCount: summary.generatedCount,
    topologyDistribution: summary.topologyDistribution,
    subtypeDistribution: summary.subtypeDistribution,
    difficultyDistribution: summary.difficultyDistribution,
    compactnessDistribution: summary.compactnessDistribution,
    domainDistribution: summary.domainDistribution,
    objectFrequency: summary.objectFrequency,
    realismScores: {
      min: summary.realismScores.min === 100 ? 0 : summary.realismScores.min,
      max: summary.realismScores.max,
      average: Number((summary.scoreTotal / total).toFixed(2)),
    },
    validatorFailureCounts: summary.validatorFailureCounts,
    repeatedStructureWarnings: repeated,
    multilingualConsistency: {
      hindiCoverage: Number((summary.hindiPresent / total).toFixed(4)),
      punjabiCoverage: Number((summary.punjabiPresent / total).toFixed(4)),
      hindiScriptConsistency: Number((summary.hindiScriptOk / total).toFixed(4)),
      punjabiScriptConsistency: Number((summary.punjabiScriptOk / total).toFixed(4)),
      hindiExplanationCoverage: Number((summary.hindiExplanationPresent / total).toFixed(4)),
      punjabiExplanationCoverage: Number((summary.punjabiExplanationPresent / total).toFixed(4)),
      localizationCompleteness: Number(
        ((
          summary.hindiPresent +
          summary.punjabiPresent +
          summary.hindiExplanationPresent +
          summary.punjabiExplanationPresent
        ) / (total * 4)).toFixed(4),
      ),
      fallbackCount: summary.fallbackCount,
    },
    explanationCompactness: {
      englishAverageLines: Number((summary.englishExplanationLines / total).toFixed(2)),
      hindiAverageLines: Number((summary.hindiExplanationLines / total).toFixed(2)),
      punjabiAverageLines: Number((summary.punjabiExplanationLines / total).toFixed(2)),
    },
    exportProfile: options.exportProfile,
    includeMultilingualExplanations: options.includeMultilingualExplanations,
    estimatedSizeMb: options.estimatedSizeMb,
    exportWarnings: summary.exportWarnings,
    ...(summary.scheduler ? { scheduler: summary.scheduler } : {}),
    ...(summary.scheduler
      ? { corpusQuality: evaluateCorpusQuality(summary.scheduler) }
      : {}),
  };

  const validation = validateCorpusAuditBatch({
    samples: [],
    summary: finalized,
  });
  for (const issue of validation.issues) {
    finalized.exportWarnings.push(issue);
  }
  for (const warning of validation.warnings) {
    finalized.exportWarnings.push(warning);
  }

  return finalized;
}

function writeTxtItem(
  item: CorpusAuditExportItem,
  includeMultilingualExplanations: boolean,
) {
  const lines = [
    `[Q${item.index + 1}]`,
    "EN:",
    item.question,
    "",
    "HI:",
    item.multilingual.hi?.question ?? "missing",
    "",
    "PA:",
    item.multilingual.pa?.question ?? "missing",
    "",
    `Options: ${item.options.join(" | ")}`,
    `Answer: ${item.answer}`,
    `Difficulty: ${item.difficulty}`,
    `Topology: ${topologyKey(item.topology as any, String((item.semanticAnchors as any)?.subtype ?? "unknown"))}`,
    `Realism: ${Number((item.qualityMetrics as any)?.metrics?.editorialRealismScore ?? 0)}`,
    "",
    "Explanation EN:",
    item.explanation,
    "",
  ];

  if (includeMultilingualExplanations) {
    lines.push(
      "Explanation HI:",
      item.explanationHi ?? item.multilingual.hi?.explanation ?? "missing",
      "",
      "Explanation PA:",
      item.explanationPa ?? item.multilingual.pa?.explanation ?? "missing",
      "",
    );
  }

  return `${lines.join("\n")}\n`;
}

function previewItem(item: CorpusAuditExportItem) {
  return {
    index: item.index,
    question: item.question,
    options: item.options,
    answer: item.answer,
    difficulty: item.difficulty,
    topology: item.topology,
    semanticAnchors: item.semanticAnchors,
    multilingual: item.multilingual,
    realismScore: Number((item.qualityMetrics as any)?.metrics?.editorialRealismScore ?? 0),
  };
}

export async function runCorpusAuditExport(
  options: CorpusAuditExportOptions,
  onProgress?: (snapshot: { generatedCount: number; outputDir: string }) => void,
): Promise<CorpusAuditExportResult> {
  const startedAt = Date.now();
  const preset = getCorpusAuditPreset(options.presetId);
  const auditPattern = auditPatternForPreset(preset.id);
  const exportProfile = getCorpusAuditExportProfile(options.exportProfile);
  const count = sanitizeCount(options.count || preset.defaultCount);
  const batchSize = Math.min(1000, Math.max(1, options.batchSize ?? DEFAULT_BATCH_SIZE));
  const exportId = `corpus-${timestampSlug()}`;
  const explicitSeed =
    typeof options.seed === "string" &&
    options.seed.length > 0;
  const runId = explicitSeed
    ? `seeded-${Buffer.from(options.seed!).toString("base64url").slice(0, 18)}`
    : `run-${randomUUID()}`;
  const seedPrefix = explicitSeed
    ? options.seed!
    : `${preset.seedPrefix}:${runId}`;
  const outputDir = path.resolve(options.outDir ?? path.join(exportRoot(), exportId));
  const files = {
    json: path.join(outputDir, "corpus.json"),
    txt: path.join(outputDir, "corpus.txt"),
    summary: path.join(outputDir, "audit-summary.json"),
    preview: path.join(outputDir, "sample-preview.json"),
  };

  await mkdir(outputDir, { recursive: true });

  const topologyValidation =
    validateQuantV2TopologyForPreset(
      preset.id,
      options.topologySelection,
    );

  if (!topologyValidation.valid) {
    throw new Error(
      topologyValidation.error ??
        "Invalid corpus audit topology.",
    );
  }

  const topologySelection =
    topologyValidation.topology;
  const schedulerProfileValidation =
    validateQuantV2SchedulerProfileForPreset(
      preset.id,
      options.schedulerProfile,
    );

  if (!schedulerProfileValidation.valid) {
    throw new Error(
      schedulerProfileValidation.error ??
        "Invalid corpus audit scheduler profile.",
    );
  }

  const jsonStream = createWriteStream(files.json, { encoding: "utf8" });
  const txtStream = createWriteStream(files.txt, { encoding: "utf8" });
  const summary = createSummary();
  const forcedMotifIds =
    options.forcedMotifIds?.length
      ? options.forcedMotifIds
      : forcedMotifsForTopology(topologySelection) ?? preset.forcedMotifIds;
  const examProfile = options.examProfile ?? preset.examProfile;
  const includeSvg = options.includeSvg ?? exportProfile.includeSvgByDefault;
  const includeFullQuestion = options.includeFullQuestion ?? false;
  const includeMultilingualExplanations =
    shouldIncludeMultilingualExplanations(options);
  const estimatedSizeMb = estimateCorpusAuditExportSizeMb({
    count,
    exportProfile: exportProfile.id,
    includeSvg,
    includeMultilingualExplanations,
  });

  jsonStream.write("[\n");
  txtStream.write(
    `# Quant V2 Corpus Audit Export\n\nExport: ${exportId}\nRun: ${runId}\nSeed: ${seedPrefix}\nExplicit seed: ${explicitSeed ? "yes" : "no"}\nPreset: ${preset.id}\nProfile: ${exportProfile.id}\nCount: ${count}\nEstimated Size: ~${estimatedSizeMb} MB\nMultilingual explanations: ${includeMultilingualExplanations ? "yes" : "no"}\n\n`,
  );

  let first = true;
  let generatedCount = 0;
  const previewItems: ReturnType<typeof previewItem>[] = [];
  const schedulerState: CorpusSchedulerState | undefined = options.useScheduler
    ? createCorpusSchedulerState({
        targetCount: count,
        profileId:
          schedulerProfileValidation.schedulerProfile,
      })
    : undefined;
  const scheduledQuestions: FormulaQuestion[] = [];
  const timeWorkGuards = {
    stems: new Set<string>(),
    topologyNumericAnswers: new Set<string>(),
    openings: new Map<string, number>(),
  };

  for (let start = 0; start < count; start += batchSize) {
    const end = Math.min(count, start + batchSize);
    for (let index = start; index < end; index += 1) {
      const forcedMotifId = forcedMotifIds?.[index % forcedMotifIds.length];
      let generatedQuestion: FormulaQuestion | undefined;
      let lastRejectReason = "";
      const maxQuestionAttempts = preset.id === "time_work_audit" ? 160 : 1;
      for (let attempt = 0; attempt < maxQuestionAttempts; attempt += 1) {
        const schedulerSeed = preset.id === "time_work_audit" ? `${seedPrefix}:${index}:attempt:${attempt}` : seedPrefix;
        const directSeed = preset.id === "time_work_audit" ? `${seedPrefix}:${index}:attempt:${attempt}` : `${seedPrefix}:${index}`;
        const candidate = schedulerState
          ? generateScheduledQuestion({
              state: schedulerState,
              index,
              seedPrefix: schedulerSeed,
              examProfile,
              forcedMotifId,
              generate: (generatorOptions: GeneratorOptions) =>
                generateForPreset(preset.id, auditPattern, generatorOptions),
            }).question
          : generateForPreset(
              preset.id,
              auditPattern,
              {
                seed: directSeed,
                examProfile,
                ...(forcedMotifId ? { forcedMotifId } : {}),
              },
            );
        const issue = timeWorkExportQualityIssue(preset.id, candidate, {
          ...timeWorkGuards,
          enforceOpeningCap: count <= 200,
        });
        if (issue) {
          lastRejectReason = issue;
          continue;
        }
        generatedQuestion = candidate;
        break;
      }
      if (!generatedQuestion) {
        throw new Error(`Unable to generate clean Time Work corpus question at index ${index}: ${lastRejectReason || "quality gate"}`);
      }
      const question: FormulaQuestion = {
        ...generatedQuestion,
        debugMetadata: {
          ...generatedQuestion.debugMetadata,
          runId,
          corpusSeed: seedPrefix,
          explicitSeed,
        },
      };
      acceptTimeWorkExportQuestion(preset.id, question, timeWorkGuards);
      if (schedulerState && count <= 200) {
        scheduledQuestions.push(question);
        continue;
      }

      const item = itemFromQuestion({
        index,
        question,
        includeSvg,
        includeFullQuestion,
        includeMultilingualExplanations,
        includeReasoningGraph: exportProfile.includeReasoningGraph,
        includeValidatorReports: exportProfile.includeValidatorReports,
        includeRealismMetadata: exportProfile.includeRealismMetadata,
        includeLocalizationMetadata: exportProfile.includeLocalizationMetadata,
      });

      jsonStream.write(`${first ? "" : ",\n"}${JSON.stringify(item)}`);
      txtStream.write(writeTxtItem(item, includeMultilingualExplanations));
      first = false;
      generatedCount += 1;
      updateSummary(summary, item);
      if (previewItems.length < PREVIEW_SAMPLE_COUNT) {
        previewItems.push(previewItem(item));
      }
    }

    if (!(schedulerState && count <= 200)) {
      onProgress?.({
        generatedCount,
        outputDir,
      });
    }
  }

  if (schedulerState && count <= 200) {
    const orderedQuestions = interleaveScheduledPreviewQuestions(
      scheduledQuestions,
      seedPrefix,
      (question) => extractCorpusSchedulerMetadata(question).familyKey,
    );
    for (const [index, question] of orderedQuestions.entries()) {
      const item = itemFromQuestion({
        index,
        question,
        includeSvg,
        includeFullQuestion,
        includeMultilingualExplanations,
        includeReasoningGraph: exportProfile.includeReasoningGraph,
        includeValidatorReports: exportProfile.includeValidatorReports,
        includeRealismMetadata: exportProfile.includeRealismMetadata,
        includeLocalizationMetadata: exportProfile.includeLocalizationMetadata,
      });

      jsonStream.write(`${first ? "" : ",\n"}${JSON.stringify(item)}`);
      txtStream.write(writeTxtItem(item, includeMultilingualExplanations));
      first = false;
      generatedCount += 1;
      updateSummary(summary, item);
      if (previewItems.length < PREVIEW_SAMPLE_COUNT) {
        previewItems.push(previewItem(item));
      }
    }
    onProgress?.({
      generatedCount,
      outputDir,
    });
  }

  jsonStream.write("\n]\n");
  jsonStream.end();
  txtStream.end();

  await Promise.all([finished(jsonStream), finished(txtStream)]);

  const finalizedSummary = finalizeSummary(summary, {
    exportProfile: exportProfile.id,
    includeMultilingualExplanations,
    estimatedSizeMb,
  });
  finalizedSummary.runId = runId;
  finalizedSummary.seed = seedPrefix;
  finalizedSummary.explicitSeed = explicitSeed;
  if (schedulerState) {
    finalizedSummary.scheduler = summarizeCorpusScheduler(schedulerState);
    finalizedSummary.corpusQuality = evaluateCorpusQuality(
      finalizedSummary.scheduler,
    );
  }
  await writeFile(files.summary, `${JSON.stringify(finalizedSummary, null, 2)}\n`, "utf8");
  await writeFile(files.preview, `${JSON.stringify(previewItems, null, 2)}\n`, "utf8");

  return {
    exportId,
    status: "completed",
    count,
    outputDir,
    files,
    summary: finalizedSummary,
    durationMs: Date.now() - startedAt,
  };
}

const jobs = new Map<string, CorpusAuditJobSnapshot>();

function createJobId() {
  return `corpusaudit_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function setJobStatus(
  job: CorpusAuditJobSnapshot,
  status: CorpusAuditStatus,
  patch: Partial<CorpusAuditJobSnapshot> = {},
) {
  const next = {
    ...job,
    ...patch,
    status,
    updatedAt: new Date().toISOString(),
  };
  jobs.set(job.id, next);
  return next;
}

export function startCorpusAuditExportJob(options: CorpusAuditExportOptions) {
  const preset = getCorpusAuditPreset(options.presetId);
  const job: CorpusAuditJobSnapshot = {
    id: createJobId(),
    status: "queued",
    requestedCount: sanitizeCount(options.count || preset.defaultCount),
    generatedCount: 0,
    progress: 0,
    presetId: preset.id,
    queuedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  jobs.set(job.id, job);

  setTimeout(() => {
    const running = setJobStatus(job, "running", {
      startedAt: new Date().toISOString(),
    });
    void runCorpusAuditExport(options, (progress) => {
      const current = jobs.get(job.id) ?? running;
      setJobStatus(current, "running", {
        generatedCount: progress.generatedCount,
        progress: Number((progress.generatedCount / job.requestedCount).toFixed(4)),
        outputDir: progress.outputDir,
      });
    })
      .then((result) => {
        const current = jobs.get(job.id) ?? running;
        setJobStatus(current, "completed", {
          generatedCount: result.count,
          progress: 1,
          outputDir: result.outputDir,
          files: result.files,
          summary: result.summary,
          completedAt: new Date().toISOString(),
        });
      })
      .catch((error) => {
        const current = jobs.get(job.id) ?? running;
        setJobStatus(current, "failed", {
          errorMessage:
            error instanceof Error ? error.message : "Unknown corpus audit export failure",
          completedAt: new Date().toISOString(),
        });
      });
  }, 0);

  return job;
}

export function getCorpusAuditJob(id: string) {
  return jobs.get(id) ?? null;
}

export function listCorpusAuditJobs() {
  return [...jobs.values()].sort((a, b) => b.queuedAt.localeCompare(a.queuedAt));
}
