import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import type { EditorialRealization } from "../editorial/editorial-types";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import { createProblemSignature } from "../utils/problem-signature";
import type { ValidationResult } from "./problem-validator";

export type QualityConfidence =
  | "high_confidence"
  | "stable"
  | "needs_review"
  | "weak_editorial_quality";

export type EditorialQualityTier =
  | "S"
  | "A"
  | "B"
  | "C";

export interface CalibratedQualityMetrics {
  topologyComplexityScore: number;
  editorialRealismScore: number;
  equationReadabilityScore: number;
  coachingAuthenticityScore: number;
  contextualNaturalnessScore: number;
  domainRealismScore: number;
  shortcutUsefulnessScore: number;
  semanticSafetyScore: number;
  repetitionResistanceScore: number;
  transitionFlowScore: number;
  narrationCompactnessScore: number;
  overallQualityScore: number;
}

export interface CalibratedQualityReport {
  metrics: CalibratedQualityMetrics;
  confidence: QualityConfidence;
  tier: EditorialQualityTier;
  explanationBreakdown: string[];
  penaltyBreakdown: string[];
  realismWeighting: string[];
  repetitionPenalties: string[];
}

const WORD_PATTERN = /\b[A-Za-z][A-Za-z-]*\b/gu;
const EQUATION_LINE_PATTERN = /[=/%+\-^]| x /u;
const TRANSITION_PATTERN = /^(?:Hence|Therefore|Thus|So|Accordingly|Now),/gmu;
const DOMAIN_WORDS = {
  election_margin: ["votes", "margin", "winner", "registered", "valid"],
  pass_fail: ["marks", "pass", "candidate", "score", "test"],
  population_growth: ["population", "male", "female", "migration", "growth"],
  price_consumption: ["price", "consumption", "expenditure", "fuel"],
  profit_loss: ["cost", "selling", "profit", "loss", "retailer"],
  mixture_percentage: ["mixture", "water", "milk", "pure", "quantity"],
  salary_revision: ["salary", "employee", "revision"],
  restore_original: ["reduction", "original", "increase", "restore"],
  reverse_percentage: ["quantity", "total", "record", "marks"],
  increase_then_decrease: ["increase", "decrease", "price", "final"],
} as const;

const SCENARIO_WEIGHTS = {
  constituency_election: 93,
  municipal_voting: 91,
  student_union_voting: 88,
  college_union_voting: 89,
  village_council_election: 90,
  employee_union_voting: 90,
  recruitment_test: 94,
  scholarship_exam: 90,
  qualifying_marks: 88,
  screening_test: 90,
  census_report: 94,
  district_population_survey: 96,
  migration_report: 93,
  urban_rural_growth: 86,
  salary_revision: 86,
  warehouse_stock_audit: 94,
  petroleum_consumption_survey: 96,
  coaching_institute_test: 90,
  inventory_record: 91,
  industrial_production_log: 93,
  school_result_analysis: 89,
  product_pricing: 78,
  retailer_discount: 84,
  online_sales_growth: 82,
  mixture_container: 83,
  general_percentage: 62,
} as const;

function clamp(value: number, min = 55, max = 98) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function wordCount(text: string) {
  return [...text.matchAll(WORD_PATTERN)].length;
}

function countMatches(text: string, pattern: RegExp) {
  return [...text.matchAll(new RegExp(pattern.source, `${pattern.flags.replace("g", "")}g`))].length;
}

function weightedAverage(entries: readonly [number, number][]) {
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  const total = entries.reduce((sum, [score, weight]) => sum + score * weight, 0);
  return Math.round(total / totalWeight);
}

function repeatedLineCount(text: string) {
  const counts = new Map<string, number>();
  for (const line of text.split("\n")) {
    const normalized = line.trim().toLowerCase();
    if (!normalized || EQUATION_LINE_PATTERN.test(normalized)) {
      continue;
    }
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  }

  return [...counts.values()].reduce(
    (sum, count) => sum + Math.max(0, count - 1),
    0,
  );
}

function uniqueTransitionCount(text: string) {
  return new Set(
    [...text.matchAll(TRANSITION_PATTERN)].map((match) => match[0]),
  ).size;
}

function domainTermHits(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
) {
  const words =
    DOMAIN_WORDS[problem.subtype as keyof typeof DOMAIN_WORDS] ?? [];
  const text = `${realization.stem}\n${realization.explanation}`.toLowerCase();
  return words.filter((word) => text.includes(word)).length;
}

function labelCount(realization: EditorialRealization) {
  return realization.explanation
    .split("\n")
    .filter((line) => line.trim().endsWith(":")).length;
}

function finalLine(realization: EditorialRealization) {
  return realization.explanation.split("\n").at(-1)?.trim() ?? "";
}

function hasInstitutionalScenario(realization: EditorialRealization) {
  return ![
    "general_percentage",
    "product_pricing",
    "online_sales_growth",
    "mixture_container",
  ].includes(realization.scenario.family);
}

function topologyComplexity(
  problem: CanonicalPercentageProblem,
  graph: ReasoningGraph,
) {
  const chainLength = problem.topology?.filteringChain?.stages.length ?? 0;
  return clamp(
    68 +
      graph.steps.length * 2.2 +
      graph.branches.length * 3.5 +
      chainLength * 5 +
      (problem.topology?.hiddenBase ? 5 : 0) +
      (problem.difficulty === "hard" ? 4 : problem.difficulty === "medium" ? 2 : 0),
    62,
    97,
  );
}

function editorialRealism(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
) {
  const scenarioWeight =
    SCENARIO_WEIGHTS[
      realization.scenario.family as keyof typeof SCENARIO_WEIGHTS
    ] ?? 76;
  const hits = domainTermHits(problem, realization);
  const words = wordCount(realization.explanation);
  const compactBonus = words >= 18 && words <= 85 ? 3 : words > 130 ? -5 : 0;
  return clamp(scenarioWeight - 4 + hits * 2 + compactBonus, 58, 98);
}

function equationReadability(realization: EditorialRealization) {
  const lines = realization.explanation.split("\n");
  const equationLines = lines.filter((line) => EQUATION_LINE_PATTERN.test(line));
  const longExpressionCount = equationLines.filter((line) => line.length > 44).length;
  const programmingSymbolPenalty = realization.explanation.includes("*") ? 12 : 0;
  return clamp(
    87 +
      Math.min(5, equationLines.length) -
      longExpressionCount * 3 -
      programmingSymbolPenalty,
    65,
    97,
  );
}

function coachingAuthenticity(
  problem: CanonicalPercentageProblem,
  graph: ReasoningGraph,
  realization: EditorialRealization,
) {
  const labels = labelCount(realization);
  const shortcutScore =
    graph.shortcutEquation && realization.naturalization.shortcutSurfaced
      ? 4
      : graph.shortcutEquation
        ? -2
        : 1;
  return clamp(
    78 +
      labels * 2 +
      domainTermHits(problem, realization) * 2 +
      shortcutScore +
      (realization.style === "coaching" ? 2 : 0),
    60,
    97,
  );
}

function contextualNaturalness(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
) {
  return clamp(
    76 +
      domainTermHits(problem, realization) * 3 +
      (hasInstitutionalScenario(realization) ? 5 : 0) -
      repeatedLineCount(realization.explanation) * 4,
    58,
    97,
  );
}

function shortcutUsefulness(
  graph: ReasoningGraph,
  realization: EditorialRealization,
) {
  if (!graph.shortcutEquation) {
    return 84;
  }

  const shortcutLines = realization.explanation.includes("Shortcut:")
    ? realization.explanation.split("\n").slice(0, 6).join("\n")
    : "";
  return clamp(
    76 +
      (realization.naturalization.shortcutSurfaced ? 12 : -4) +
      (/^Shortcut:/u.test(realization.explanation) ? 3 : 0) +
      (shortcutLines.includes("%") ? 3 : 0) -
      (shortcutLines.length > 160 ? 5 : 0),
    60,
    97,
  );
}

function semanticSafety(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
) {
  const signatureSafe = !/(?:^|[|_])-\d|ans=-/u.test(
    createProblemSignature(problem),
  );
  const signSafe = !/(?:answer|result|percentage|reduction|loss)\s*=\s*-\d/iu.test(
    realization.explanation,
  );
  return clamp(91 + (signatureSafe ? 3 : -12) + (signSafe ? 3 : -16), 55, 97);
}

function repetitionResistance(realization: EditorialRealization) {
  const repeats = repeatedLineCount(realization.explanation);
  const variantCount = new Set(realization.naturalization.phraseVariants).size;
  return clamp(
    87 +
      Math.min(5, variantCount) -
      repeats * 6 -
      (realization.naturalization.explanationPatternIds.length <= 1 ? 4 : 0),
    58,
    97,
  );
}

function transitionFlow(realization: EditorialRealization) {
  const transitionCount = countMatches(realization.explanation, TRANSITION_PATTERN);
  const uniqueCount = uniqueTransitionCount(realization.explanation);
  const final = finalLine(realization);
  return clamp(
    84 +
      (final.includes("=") ? 3 : 0) +
      uniqueCount * 2 -
      Math.max(0, transitionCount - uniqueCount - 1) * 4,
    60,
    96,
  );
}

function narrationCompactness(realization: EditorialRealization) {
  const words = wordCount(realization.explanation);
  const distance =
    words < 22 ? 22 - words : words > 90 ? Math.ceil((words - 90) / 2) : 0;
  return clamp(94 - distance, 60, 97);
}

function topologySpreadAdjustment(problem: CanonicalPercentageProblem) {
  const family = problem.topology?.family;
  if (!family) {
    return -5;
  }

  switch (family) {
    case "direct_mapping":
      return -2;
    case "filtered_base":
    case "base_shift":
      return 2;
    case "hidden_total":
    case "remaining_component":
    case "effective_percentage":
      return 3;
    case "successive_filtering":
    case "layered_population":
    case "multi_entity_distribution":
    case "ratio_percentage_hybrid":
      return 5;
    default:
      return 0;
  }
}

function difficultyAdjustment(problem: CanonicalPercentageProblem) {
  return problem.difficulty === "hard"
    ? 3
    : problem.difficulty === "medium"
      ? 1
      : -2;
}

function overallSpreadAdjustment(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  realization: EditorialRealization;
  domainRealismScore: number;
  repetitionResistanceScore: number;
  narrationCompactnessScore: number;
}) {
  return Math.round(
    topologySpreadAdjustment(input.problem) +
      difficultyAdjustment(input.problem) +
      (input.domainRealismScore - 86) / 2.5 +
      (input.repetitionResistanceScore - 90) / 4 +
      (input.narrationCompactnessScore - 90) / 5 +
      (input.graph.shortcutEquation && !input.realization.naturalization.shortcutSurfaced ? -2 : 0),
  );
}

function confidenceFor(metrics: CalibratedQualityMetrics): QualityConfidence {
  const minimum = Math.min(...Object.values(metrics).filter((score) => score <= 100));
  if (metrics.overallQualityScore >= 92 && minimum >= 82) {
    return "high_confidence";
  }
  if (metrics.overallQualityScore >= 84 && minimum >= 74) {
    return "stable";
  }
  if (metrics.overallQualityScore >= 74) {
    return "needs_review";
  }
  return "weak_editorial_quality";
}

function tierFor(metrics: CalibratedQualityMetrics): EditorialQualityTier {
  if (
    metrics.overallQualityScore >= 93 &&
    metrics.editorialRealismScore >= 88 &&
    metrics.semanticSafetyScore >= 92
  ) {
    return "S";
  }
  if (metrics.overallQualityScore >= 85) {
    return "A";
  }
  if (metrics.overallQualityScore >= 75) {
    return "B";
  }
  return "C";
}

function explain(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  realization: EditorialRealization;
  metrics: CalibratedQualityMetrics;
}) {
  const explanationBreakdown: string[] = [];
  const penaltyBreakdown: string[] = [];
  const realismWeighting: string[] = [];
  const repetitionPenalties: string[] = [];

  if (input.problem.topology) {
    explanationBreakdown.push("topology variant contributes structural depth");
  }
  if ((input.problem.topology?.filteringChain?.stages.length ?? 0) > 0) {
    explanationBreakdown.push("filtering chain increases reasoning richness");
  }
  if (domainTermHits(input.problem, input.realization) >= 3) {
    explanationBreakdown.push("domain-native terms are present");
  }
  if (input.graph.shortcutEquation && input.realization.naturalization.shortcutSurfaced) {
    explanationBreakdown.push("shortcut is surfaced compactly");
  }

  const scenarioWeight =
    SCENARIO_WEIGHTS[
      input.realization.scenario.family as keyof typeof SCENARIO_WEIGHTS
    ] ?? 76;
  realismWeighting.push(
    `${input.realization.scenario.family} scenario weight = ${scenarioWeight}`,
  );
  if (hasInstitutionalScenario(input.realization)) {
    realismWeighting.push("institutional framing improves realism");
  } else {
    penaltyBreakdown.push("generic commercial framing limits realism");
  }

  const repeats = repeatedLineCount(input.realization.explanation);
  if (repeats > 0) {
    repetitionPenalties.push(`${repeats} repeated narration line(s)`);
  } else {
    repetitionPenalties.push("no repeated narration lines detected");
  }
  if (input.metrics.narrationCompactnessScore < 88) {
    penaltyBreakdown.push("explanation length is outside the ideal compact band");
  }
  if (input.metrics.shortcutUsefulnessScore < 84) {
    penaltyBreakdown.push("shortcut opportunity was not fully used");
  }
  if (input.metrics.transitionFlowScore < 86) {
    penaltyBreakdown.push("transition flow is functional but not very varied");
  }

  return {
    explanationBreakdown,
    penaltyBreakdown,
    realismWeighting,
    repetitionPenalties,
  };
}

export function createCalibratedQualityReport(
  problem: CanonicalPercentageProblem,
  graph: ReasoningGraph,
  realization: EditorialRealization,
): CalibratedQualityReport {
  const metricsWithoutOverall = {
    topologyComplexityScore: topologyComplexity(problem, graph),
    editorialRealismScore: editorialRealism(problem, realization),
    equationReadabilityScore: equationReadability(realization),
    coachingAuthenticityScore: coachingAuthenticity(problem, graph, realization),
    contextualNaturalnessScore: contextualNaturalness(problem, realization),
    domainRealismScore:
      SCENARIO_WEIGHTS[
        realization.scenario.family as keyof typeof SCENARIO_WEIGHTS
      ] ?? 76,
    shortcutUsefulnessScore: shortcutUsefulness(graph, realization),
    semanticSafetyScore: semanticSafety(problem, realization),
    repetitionResistanceScore: repetitionResistance(realization),
    transitionFlowScore: transitionFlow(realization),
    narrationCompactnessScore: narrationCompactness(realization),
  };
  const rawOverallQualityScore = weightedAverage([
    [metricsWithoutOverall.topologyComplexityScore, 0.9],
    [metricsWithoutOverall.editorialRealismScore, 1.25],
    [metricsWithoutOverall.equationReadabilityScore, 1],
    [metricsWithoutOverall.coachingAuthenticityScore, 1.05],
    [metricsWithoutOverall.contextualNaturalnessScore, 1.1],
    [metricsWithoutOverall.domainRealismScore, 0.9],
    [metricsWithoutOverall.shortcutUsefulnessScore, 0.75],
    [metricsWithoutOverall.semanticSafetyScore, 1.25],
    [metricsWithoutOverall.repetitionResistanceScore, 0.9],
    [metricsWithoutOverall.transitionFlowScore, 0.75],
    [metricsWithoutOverall.narrationCompactnessScore, 0.9],
  ]);
  const overallQualityScore = clamp(
    rawOverallQualityScore +
      overallSpreadAdjustment({
        problem,
        graph,
        realization,
        domainRealismScore: metricsWithoutOverall.domainRealismScore,
        repetitionResistanceScore: metricsWithoutOverall.repetitionResistanceScore,
        narrationCompactnessScore: metricsWithoutOverall.narrationCompactnessScore,
      }),
    58,
    96,
  );
  const metrics = {
    ...metricsWithoutOverall,
    overallQualityScore,
  };
  const breakdown = explain({
    problem,
    graph,
    realization,
    metrics,
  });

  return {
    metrics,
    confidence: confidenceFor(metrics),
    tier: tierFor(metrics),
    ...breakdown,
  };
}

export function validateMetricCalibration(
  report: CalibratedQualityReport,
): ValidationResult {
  const issues: string[] = [];
  const metricValues = Object.values(report.metrics);
  const perfectCount = metricValues.filter((score) => score >= 99).length;

  if (perfectCount > 1) {
    issues.push("Calibrated metrics are too saturated for one sample.");
  }
  if (report.metrics.overallQualityScore < 60 || report.metrics.overallQualityScore > 98) {
    issues.push("Overall quality score is outside calibrated bounds.");
  }
  if (report.explanationBreakdown.length === 0) {
    issues.push("Metric report lacks positive explanation.");
  }
  if (report.realismWeighting.length === 0) {
    issues.push("Metric report lacks realism weighting.");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validateMetricCalibrationBatch(
  reports: readonly CalibratedQualityReport[],
): ValidationResult {
  const issues: string[] = [];
  const scores = reports.map((report) => report.metrics.overallQualityScore);
  const uniqueScores = new Set(scores);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const average =
    scores.reduce((sum, score) => sum + score, 0) / Math.max(1, scores.length);
  const saturatedShare =
    scores.filter((score) => score >= 97).length / Math.max(1, scores.length);
  const tierCount = new Set(reports.map((report) => report.tier)).size;

  if (max - min < 14) {
    issues.push("Overall quality score range is too narrow.");
  }
  if (uniqueScores.size < Math.min(18, reports.length)) {
    issues.push("Overall quality scores are over-clustered.");
  }
  if (saturatedShare > 0.18) {
    issues.push("Too many samples are saturated near perfect scores.");
  }
  if (average < 78 || average > 93) {
    issues.push("Average calibrated quality is outside the expected band.");
  }
  if (tierCount < 3) {
    issues.push("Quality tiering is not differentiating samples.");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
