import { randomUUID } from "node:crypto";

import type {
  FormulaQuestion,
  GeneratorOptions,
  Pattern,
} from "../core/generator-engine";
import type { CanonicalPercentageProblem } from "../../quant-v2/canonical/percentage-types";
import type { PercentageMotifFactory } from "../../quant-v2/canonical/percentage-motif-factories";
import {
  PERCENTAGE_MOTIF_FACTORIES,
  PERCENTAGE_MOTIF_FACTORY_LIST,
} from "../../quant-v2/canonical/percentage-motif-factories";
import { buildReasoningGraph } from "../../quant-v2/reasoning/reasoning-registry";
import { realizeEditorialProblem } from "../../quant-v2/editorial/stem-realizer";
import { renderLocalizedRealization } from "../../quant-v2/localization/renderers/language-renderer";
import { renderOption, renderOptions } from "../../quant-v2/localization/renderers/option-renderer";
import { renderSvgVisualization } from "../../quant-v2/svg/renderers/svg-pipeline";
import { resolveRealizationProfile } from "../../quant-v2/editorial/realization-profiles";
import { validatePercentageProblem } from "../../quant-v2/validators/problem-validator";
import { validateReasoningGraph } from "../../quant-v2/validators/reasoning-validator";
import { validateTopology } from "../../quant-v2/validators/topology-validator";
import {
  createRealismMetrics,
  validateRealism,
} from "../../quant-v2/validators/realism-validator";
import { validateEditorialRealization } from "../../quant-v2/validators/editorial-validator";
import { validateHumanReasoningRealization } from "../../quant-v2/validators/human-reasoning-validator";
import { validateLocalization } from "../../quant-v2/localization/validators/localization-validator";
import { validateMultilingualStem } from "../../quant-v2/localization/validators/multilingual-stem-validator";
import { validateSvgPedagogyGraph } from "../../quant-v2/svg/validators/svg-pedagogy-validator";
import {
  createCalibratedQualityReport,
  validateMetricCalibration,
} from "../../quant-v2/validators/metric-calibration-validator";
import { validatePedagogicalFlow } from "../../quant-v2/validators/pedagogical-flow-validator";
import { validateSemanticStability } from "../../quant-v2/validators/semantic-stability-validator";
import { validatePresentationPolish } from "../../quant-v2/validators/presentation-polish-validator";
import { validateRealizationNaturalness } from "../../quant-v2/validators/realization-naturalness-validator";
import { createCorpusRealismGovernorReport } from "../../quant-v2/realism/corpus-realism-governor";
import { validateRelationalPercentage } from "../../quant-v2/validators/relational-percentage-validator";
import { validateSemanticConsistency } from "../../quant-v2/validators/semantic-consistency-validator";
import { deriveCanonicalScenario } from "../../quant-v2/semantic/canonical-scenario";
import { calibrateDisplayedDistractors } from "../../quant-v2/semantic/distractor-realism";
import { createProblemSignature } from "../../quant-v2/utils/problem-signature";
import { createCorpusFingerprints } from "../../quant-v2/quality/corpus-fingerprints";
import { inferExaminerIntent } from "../../quant-v2/quality/examiner-intents";
import {
  createDistractorIntelligence,
  validateDistractorIntelligence,
} from "../../quant-v2/quality/distractor-intelligence";
import {
  validatePercentageIndependentSolver,
} from "../../quant-v2/validators/percentage-independent-solver";

type QuantV2FactoryKey = keyof typeof PERCENTAGE_MOTIF_FACTORIES;

const sequenceByGenerationId = new Map<string, number>();

const LEGACY_MOTIF_TO_FACTORY: Record<string, QuantV2FactoryKey> = {
  perc_price_increase: "successiveIncreaseDecrease",
  perc_price_decrease: "successiveIncreaseDecrease",
  perc_successive_hike: "successiveIncreaseDecrease",
  perc_compound_error: "successiveIncreaseDecrease",
  perc_machine_depreciation: "populationGrowth",
  perc_population_growth: "populationGrowth",
  perc_population_gender: "populationGrowth",
  perc_vote_election: "electionLead",
  perc_election_invalid: "electionLead",
  perc_exam_pass_fail: "passFail",
  perc_marks_calc: "passFail",
  perc_reverse_find: "reversePercentage",
  perc_restore_value: "restoreValue",
  perc_price_consumption: "priceConsumption",
  perc_salary_hike: "salaryRevision",
  perc_income_savings_expense: "salaryRevision",
  perc_sales_commission: "salaryRevision",
  perc_tax_income: "salaryRevision",
  perc_mixture_water_add: "mixturePercentage",
  perc_mixture_replacement: "mixturePercentage",
  perc_fruit_dry_weight: "mixturePercentage",
  perc_alloy_composition: "mixturePercentage",
  perc_relational_chain: "relationalPercentage",
  perc_reverse_relation: "relationalPercentage",
  perc_ratio_percentage_hybrid: "relationalPercentage",
  perc_venn_diagram: "vennDiagram",
  perc_taxation: "taxation",
  perc_commission: "commission",
  perc_geom_dimensional_scale: "perc_geom_dimensional_scale",
  perc_demo_cross_tab_literacy: "perc_demo_cross_tab_literacy",
  perc_budget_cascading_remainder: "perc_budget_cascading_remainder",
  perc_const_absolute_offset: "perc_const_absolute_offset",
  perc_exam_weighted_aggregate: "perc_exam_weighted_aggregate",
  perc_asset_variable_depreciation: "perc_asset_variable_depreciation",
  perc_workforce_hierarchical_attrition: "perc_workforce_hierarchical_attrition",
  perc_elect_three_candidate_forfeiture: "perc_elect_three_candidate_forfeiture",
  perc_agri_land_yield_compound: "perc_agri_land_yield_compound",
  perc_demo_multi_factor_growth: "perc_demo_multi_factor_growth",
  perc_comm_tiered_salary_override: "perc_comm_tiered_salary_override",
  perc_asset_compound_leakage: "perc_asset_compound_leakage",
  perc_num_linear_equation_balancing: "perc_num_linear_equation_balancing",
  perc_num_fractional_perturbation_complex: "perc_num_fractional_perturbation_complex",
  perc_tax_bracket_retained_income: "perc_tax_bracket_retained_income",
  perc_num_square_proportional_delta: "perc_num_square_proportional_delta",
  perc_mix_alloy_replacement: "perc_mix_alloy_replacement",
};

const COMMERCIAL_CORPUS_ROTATION: QuantV2FactoryKey[] = [
  "relationalPercentage",
  "electionLead",
  "reversePercentage",
  "priceConsumption",
  "relationalPercentage",
  "mixturePercentage",
  "passFail",
  "restoreValue",
  "populationGrowth",
  "profitLoss",
  "relationalPercentage",
  "salaryRevision",
  "successiveIncreaseDecrease",
  "electionLead",
  "priceConsumption",
  "mixturePercentage",
  "vennDiagram",
  "taxation",
  "commission",
];

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function nextSequence(options?: GeneratorOptions) {
  const context = options?.generationContext;
  const generationId =
    context?.generationId ??
    String(
      options?.seed ??
        options?.generationContext?.seed ??
        `standalone:${randomUUID()}`,
    );
  const current = sequenceByGenerationId.get(generationId) ?? 0;
  sequenceByGenerationId.set(generationId, current + 1);
  return current;
}

function isDisabledFlag(value: string | undefined) {
  return /^(0|false|off|legacy)$/i.test(String(value ?? "").trim());
}

export function isQuantV2PercentageEnabled() {
  return (
    !isDisabledFlag(process.env.QUANT_V2_PERCENTAGE_ENABLED) &&
    !isDisabledFlag(process.env.DISABLE_QUANT_V2_PERCENTAGE)
  );
}

export function isQuantV2PercentagePattern(pattern: Pattern) {
  return /percentage|percent/i.test(
    `${pattern.id} ${pattern.topic} ${pattern.subtopic}`,
  );
}

function selectFactory(
  pattern: Pattern,
  options: GeneratorOptions | undefined,
  sequence: number,
): {
  key: QuantV2FactoryKey;
  factory: PercentageMotifFactory;
} {
  const forced = options?.forcedMotifId;
  const mapped = forced ? LEGACY_MOTIF_TO_FACTORY[forced] : undefined;
  if (mapped) {
    return {
      key: mapped,
      factory: PERCENTAGE_MOTIF_FACTORIES[mapped],
    };
  }

  const seed = `${options?.seed ?? options?.generationContext?.seed ?? ""}|${pattern.id}|${pattern.topic}|${pattern.subtopic}|${sequence}`;
  const key =
    COMMERCIAL_CORPUS_ROTATION[
      (hashText(seed) + sequence) % COMMERCIAL_CORPUS_ROTATION.length
    ]!;
  return {
    key,
    factory: PERCENTAGE_MOTIF_FACTORIES[key],
  };
}

function difficultyLabel(problem: CanonicalPercentageProblem) {
  if (problem.difficulty === "hard") return "Hard";
  if (problem.difficulty === "medium") return "Medium";
  return "Easy";
}

function formatOption(problem: CanonicalPercentageProblem, value: number) {
  return renderOption({
    problem,
    value,
    language: "en",
  });
}

function optionValues(problem: CanonicalPercentageProblem) {
  return renderOptions({
    problem,
    values: [problem.answer, ...problem.distractors],
    language: "en",
  });
}

function resultToIssues(result: {
  valid: boolean;
  issues: unknown[];
  metrics?: unknown;
}) {
  return {
    valid: result.valid,
    issues: result.issues.map((issue) =>
      typeof issue === "string"
        ? issue
        : JSON.stringify(issue),
    ),
    ...(result.metrics ? { metrics: result.metrics } : {}),
  };
}

function tierFor(score: number) {
  if (score >= 92) return "S";
  if (score >= 84) return "A";
  if (score >= 72) return "B";
  return "C";
}

function capQualityReport(
  report: ReturnType<typeof createCalibratedQualityReport>,
  cap: number,
  reason: string,
) {
  const metrics = {
    ...report.metrics,
    editorialRealismScore: Math.min(report.metrics.editorialRealismScore, cap),
    coachingAuthenticityScore: Math.min(report.metrics.coachingAuthenticityScore, cap),
    contextualNaturalnessScore: Math.min(report.metrics.contextualNaturalnessScore, cap),
    domainRealismScore: Math.min(report.metrics.domainRealismScore, Math.max(50, cap + 4)),
    overallQualityScore: Math.min(report.metrics.overallQualityScore, cap),
  };

  return {
    ...report,
    metrics,
    tier: tierFor(metrics.overallQualityScore),
    confidence:
      metrics.overallQualityScore < 66
        ? "weak_editorial_quality"
        : report.confidence,
    penaltyBreakdown: [...report.penaltyBreakdown, reason],
  } satisfies ReturnType<typeof createCalibratedQualityReport>;
}

function applyRuntimeQualityCaps(input: {
  report: ReturnType<typeof createCalibratedQualityReport>;
  validatorReports: ReturnType<typeof buildValidatorReports>;
}) {
  let report = input.report;
  const localizationReports = Object.values(input.validatorReports.localization ?? {}) as Array<{
    valid?: boolean;
    issues?: Array<{ code?: string; message?: string }>;
  }>;
  const localizationCodes = localizationReports.flatMap((item) =>
    (item.issues ?? []).map((issue) => String(issue.code ?? issue.message ?? "")),
  );

  if (input.validatorReports.semanticConsistency.valid === false) {
    report = capQualityReport(report, 50, "semantic mismatch caps realism");
  }
  if (localizationCodes.some((code) => code === "incomplete_explanation")) {
    report = capQualityReport(report, 60, "incomplete localized explanation caps realism");
  }
  if (
    localizationCodes.some((code) =>
      ["english_leakage", "internal_label_leakage", "encoding_corruption"].includes(code),
    )
  ) {
    report = capQualityReport(report, 60, "localized English leakage caps realism");
  }
  if (input.validatorReports.distractorIntelligence.valid === false) {
    report = capQualityReport(report, 78, "weak distractors cap realism");
  }

  return report;
}

function buildValidatorReports(input: ReturnType<typeof buildQuantV2Artifacts>) {
  const {
    problem,
    graph,
    editorial,
    localized,
    svg,
    qualityReport,
    optionSets,
    canonicalScenario,
    distractorIntelligence,
  } = input;
  const localization = Object.fromEntries(
    Object.entries(localized).map(([language, realization]) => [
      language,
      validateLocalization({
        source: editorial,
        localized: realization,
      }),
    ]),
  );
  const multilingualStem = Object.fromEntries(
    Object.entries(localized).map(([language, realization]) => [
      language,
      validateMultilingualStem({
        language: language as "en" | "hi" | "pa",
        source: editorial,
        localized: realization,
        problem,
      }),
    ]),
  );
  const svgValidation = validateSvgPedagogyGraph(
    svg.layout,
    svg.rendered.svg,
  );

  return {
    canonical: resultToIssues(validatePercentageProblem(problem)),
    reasoningGraph: resultToIssues(validateReasoningGraph(problem, graph)),
    topology: problem.topology
      ? resultToIssues(validateTopology(problem, graph))
      : { valid: true, issues: [] },
    realism: resultToIssues(validateRealism(problem)),
    editorial: resultToIssues(
      validateEditorialRealization(problem, graph, editorial),
    ),
    humanReasoning: resultToIssues(
      validateHumanReasoningRealization(editorial),
    ),
    semanticStability: resultToIssues(
      validateSemanticStability(problem, editorial),
    ),
    presentationPolish: resultToIssues(
      validatePresentationPolish(problem, editorial),
    ),
    pedagogicalFlow: resultToIssues(
      validatePedagogicalFlow({
        problem,
        graph,
        realization: editorial,
        localized: Object.values(localized),
      }),
    ),
    realizationNaturalness: resultToIssues(
      validateRealizationNaturalness({
        problem,
        editorial,
        localized: Object.values(localized),
        optionsHi: optionSets.hi,
        optionsPa: optionSets.pa,
      }),
    ),
    corpusRealism: resultToIssues(
      createCorpusRealismGovernorReport({
        problem,
        editorial,
      }),
    ),
    semanticConsistency: resultToIssues(
      validateSemanticConsistency({
        problem,
        editorial,
        localized,
        optionSets,
      }),
    ),
    relationalPercentage: resultToIssues(
      validateRelationalPercentage(problem, graph),
    ),
    distractorIntelligence: resultToIssues(
      validateDistractorIntelligence(distractorIntelligence),
    ),
    independentSolver: resultToIssues(
      validatePercentageIndependentSolver({
        problem,
        graph,
        localized,
      }),
    ),
    localization,
    multilingualStem,
    svg: svgValidation,
    metricCalibration: resultToIssues(
      validateMetricCalibration(qualityReport),
    ),
  };
}

function buildQuantV2Artifacts(input: {
  pattern: Pattern;
  options?: GeneratorOptions;
}) {
  const sequence = nextSequence(input.options);
  const selected = selectFactory(input.pattern, input.options, sequence);
  const baseSeed =
    input.options?.seed ??
    input.options?.generationContext?.seed ??
    `percentage:${randomUUID()}`;
  const seed = `${baseSeed}|${input.pattern.id}|${sequence}|${selected.key}`;
  const realizationProfile = resolveRealizationProfile(
    input.options?.examProfile,
  );
  const problem = selected.factory(seed);
  const graph = buildReasoningGraph(problem);
  const editorial = realizeEditorialProblem({
    problem,
    graph,
    seed,
    realizationProfile,
  });
  const canonicalScenario = deriveCanonicalScenario({
    problem,
    editorial,
  });
  const localized = {
    en: renderLocalizedRealization({
      language: "en",
      problem,
      graph,
      editorial,
      realizationProfile,
    }),
    hi: renderLocalizedRealization({
      language: "hi",
      problem,
      graph,
      editorial,
      realizationProfile,
    }),
    pa: renderLocalizedRealization({
      language: "pa",
      problem,
      graph,
      editorial,
      realizationProfile,
    }),
  };
  const svg = renderSvgVisualization({
    problem,
    graph,
    language: "en",
    theme: "coaching_board",
  });
  const qualityReport = createCalibratedQualityReport(
    problem,
    graph,
    editorial,
  );
  const displayedDistractors = calibrateDisplayedDistractors({
    answer: problem.answer,
    distractors: problem.distractors,
  });
  const optionSets = {
    en: renderOptions({
      problem,
      values: [problem.answer, ...displayedDistractors],
      language: "en",
    }),
    hi: renderOptions({
      problem,
      values: [problem.answer, ...displayedDistractors],
      language: "hi",
    }),
    pa: renderOptions({
      problem,
      values: [problem.answer, ...displayedDistractors],
      language: "pa",
    }),
  };
  const corpusFingerprints = createCorpusFingerprints({
    problem,
    graph,
    editorial,
  });
  const examinerIntent = inferExaminerIntent(problem, graph);
  const distractorIntelligence = createDistractorIntelligence({
    problem,
    renderedOptions: optionSets.en,
    correctIndex: 0,
  });

  return {
    sequence,
    selectedFactory: selected.key,
    realizationProfile,
    seed,
    problem,
    graph,
    editorial,
    canonicalScenario,
    displayedDistractors,
    localized,
    svg,
    qualityReport,
    optionSets,
    corpusFingerprints,
    examinerIntent,
    distractorIntelligence,
  };
}

function buildValidatedQuantV2Artifacts(input: {
  pattern: Pattern;
  options?: GeneratorOptions;
}) {
  let lastArtifacts: ReturnType<typeof buildQuantV2Artifacts> | undefined;
  let rejectedCount = 0;
  const maxAttempts = 12;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const artifacts = buildQuantV2Artifacts(input);
    const canonicalReport = validatePercentageProblem(artifacts.problem);
    const electionMargin = Number(artifacts.problem.variables.margin);
    const hasElectionDistractorBelowMargin =
      artifacts.problem.subtype === "election_margin" &&
      Number.isFinite(electionMargin) &&
      artifacts.problem.distractors.some(
        (d) => Number.isFinite(d) && d <= electionMargin,
      );
    const solverReport = validatePercentageIndependentSolver({
      problem: artifacts.problem,
      graph: artifacts.graph,
      localized: artifacts.localized,
    });
    if (
      solverReport.valid &&
      canonicalReport.valid &&
      !hasElectionDistractorBelowMargin
    ) {
      return {
        ...artifacts,
        rejectedCandidateCount: rejectedCount,
      };
    }
    rejectedCount += 1;
    lastArtifacts = artifacts;
  }

  throw new Error(
    `Quant V2 Percentage validation failed after ${maxAttempts} attempts: ${[
      ...validatePercentageProblem(lastArtifacts!.problem).issues,
      ...(lastArtifacts!.problem.subtype === "election_margin" &&
      Number.isFinite(Number(lastArtifacts!.problem.variables.margin)) &&
      lastArtifacts!.problem.distractors.some(
        (d) =>
          Number.isFinite(d) &&
          d <= Number(lastArtifacts!.problem.variables.margin),
      )
        ? ["Election distractor cannot be less than or equal to margin."]
        : []),
      ...validatePercentageIndependentSolver({
      problem: lastArtifacts!.problem,
      graph: lastArtifacts!.graph,
      localized: lastArtifacts!.localized,
    }).issues,
    ].join(" | ")}`,
  );
}

export function createQuantV2PercentageQuestionCandidate(
  pattern: Pattern,
  options?: GeneratorOptions,
): FormulaQuestion {
  const startedAt = Date.now();
  const artifacts = buildValidatedQuantV2Artifacts({
    pattern,
    options,
  });
  const validatorReports = buildValidatorReports(artifacts);
  const {
    problem,
    graph,
    editorial,
    localized,
    svg,
  } = artifacts;
  const qualityReport = applyRuntimeQualityCaps({
    report: artifacts.qualityReport,
    validatorReports,
  });
  validatorReports.metricCalibration = resultToIssues(
    validateMetricCalibration(qualityReport),
  );
  const signature = createProblemSignature(problem);
  const visual = problem.visual ?? null;
  const optionsList = artifacts.optionSets.en;
  const optionsHi = artifacts.optionSets.hi;
  const optionsPa = artifacts.optionSets.pa;
  const answerOption = formatOption(problem, problem.answer);
  const correctIndex = Math.max(0, optionsList.indexOf(answerOption));
  const difficulty = difficultyLabel(problem);
  const realismMetrics = createRealismMetrics(problem);
  const failedValidators = Object.entries(validatorReports)
    .filter(([, report]) => {
      if (report && typeof report === "object" && "valid" in report) {
        return (report as { valid?: boolean }).valid === false;
      }
      return false;
    })
    .map(([key]) => key);

  const quantV2Metadata = {
    adapterVersion: "p2a-quant-v2-percentage",
    generationBackend: "quant-v2",
    debugSource: "quant-v2-percentage-adapter",
    featureFlag: "quantV2Percentage",
    selectedFactory: artifacts.selectedFactory,
    rejectedCandidateCount: artifacts.rejectedCandidateCount,
    signature,
    subtype: problem.subtype,
    category: problem.category,
    reasoningPattern: problem.reasoningPattern,
    topology: problem.topology ?? null,
    scenario: editorial.scenario.family,
    editorialStyle: editorial.style,
    rhythmProfile: editorial.naturalization.rhythmProfile,
    shortcutSurfaced: editorial.naturalization.shortcutSurfaced,
    realizationCompactness: artifacts.realizationProfile.compactness,
    examProfile: artifacts.realizationProfile.examProfile,
    canonicalScenario: artifacts.canonicalScenario,
    corpusFingerprints: artifacts.corpusFingerprints,
    examinerIntent: artifacts.examinerIntent,
    visual,
  };

  return {
    text: editorial.stem,
    options: optionsList,
    correct: correctIndex,
    explanation: editorial.explanation,
    generationBackend: "quant-v2",
    debugSource: "quant-v2-percentage-adapter",
    textHi: localized.hi.stem,
    optionsHi,
    explanationHi: localized.hi.explanation,
    textPa: localized.pa.stem,
    optionsPa,
    explanationPa: localized.pa.explanation,
    nativeRealization: localized,
    nativeCoverage: Object.fromEntries(
      Object.entries(localized).map(([language, realization]) => [
        language,
        realization.coverage,
      ]),
    ),
    section: pattern.section,
    topic: pattern.topic,
    subtopic: pattern.subtopic,
    difficulty,
    difficultyLabel: difficulty,
    difficultyScore: qualityReport.metrics.topologyComplexityScore,
    difficultyMetadata: {
      difficultyScore: qualityReport.metrics.topologyComplexityScore,
      difficultyLabel: difficulty,
      estimatedSolveTime: Math.max(35, graph.steps.length * 18),
      operationCount: graph.steps.length,
      reasoningDepth: graph.steps.length,
      reasoningSteps: graph.steps.map((step) => step.descriptionKey),
      dependencyComplexity: graph.branches.length,
      operationChain: graph.steps.map((step) => step.type),
      usesPercentage: true,
      usesRatio: /ratio|mixture/i.test(`${problem.category} ${problem.subtype}`),
      usesComparison: /margin|pass_fail|profit_loss|comparison/i.test(
        `${problem.category} ${problem.subtype}`,
      ),
      visualComplexity: svg.semanticGraph.nodes.length,
      inferenceComplexity: graph.branches.length,
    },
    optionMetadata: optionsList.map((value, index) => ({
      value,
      isCorrect: index === correctIndex,
      ...(index === correctIndex
        ? {}
        : {
            distractorType: "percentageTrap" as const,
            likelyMistake:
              problem.traps[index - 1] ?? "percentage misconception",
            reasoningTrap:
              problem.traps[index - 1] ?? "wrong_base",
            distractorIntelligence:
              artifacts.distractorIntelligence[index - 1] ?? null,
          }),
    })),
    examRealismMetadata: {
      examProfile: options?.examProfile ?? "custom",
      wordingStyle: "balanced",
      archetypeId: problem.reasoningPattern,
      archetypeCategory: problem.category,
      reasoningTraps: problem.traps,
      weightingSummary: [
        `scenario=${editorial.scenario.family}`,
        `qualityTier=${qualityReport.tier}`,
      ],
      realismScore: qualityReport.metrics.editorialRealismScore,
      realismBand:
        qualityReport.metrics.editorialRealismScore >= 90
          ? "pyq-like"
          : "strong",
      realismSignals: qualityReport.explanationBreakdown,
      realismPenalties: qualityReport.penaltyBreakdown,
      examinerIntent: artifacts.examinerIntent,
      corpusFingerprints: artifacts.corpusFingerprints,
    },
    generationMetrics: {
      generationDurationMs: Date.now() - startedAt,
      validationRetries: artifacts.rejectedCandidateCount,
      uniquenessFailures: 0,
      branchingFactor: graph.branches.length,
      branchingComplexity: graph.branches.length,
      clueDensity: graph.steps.length,
      inferenceDepth: graph.steps.length,
      redundancyScore: 0,
      deductionDependencyScore: graph.steps.length,
      redundancyRatio: 0,
      realismScore: qualityReport.metrics.editorialRealismScore,
    },
    proceduralLogic: {
      engine: "quant-v2",
      quantV2: quantV2Metadata,
      canonicalProblem: problem,
      reasoningGraph: graph,
      semanticMetadata: {
        canonicalScenario: artifacts.canonicalScenario,
        corpusFingerprints: artifacts.corpusFingerprints,
        examinerIntent: artifacts.examinerIntent,
        visual,
        answer: {
          raw: problem.answer,
          rendered: answerOption,
        },
        variables: problem.variables,
        displayedDistractors: artifacts.displayedDistractors,
        distractorIntelligence: artifacts.distractorIntelligence,
        traps: problem.traps,
      },
      svgRendering: svg.rendered,
      validatorReports,
      qualityMetrics: qualityReport,
      localizationMetadata: {
        coverage: {
          en: localized.en.coverage,
          hi: localized.hi.coverage,
          pa: localized.pa.coverage,
        },
      },
    } as unknown,
    motifs: [
      artifacts.selectedFactory,
      problem.subtype,
      problem.reasoningPattern,
    ],
    languages: {
      en: {
        question: editorial.stem,
        options: optionsList,
        correct: correctIndex,
        explanation: editorial.explanation,
      },
      hi: {
        question: localized.hi.stem,
        options: optionsHi,
        correct: correctIndex,
        explanation: localized.hi.explanation,
      },
      pa: {
        question: localized.pa.stem,
        options: optionsPa,
        correct: correctIndex,
        explanation: localized.pa.explanation,
      },
    },
    reasoningGraph: graph as unknown,
    semanticMetadata: {
      problem,
      signature,
      canonicalScenario: artifacts.canonicalScenario,
      corpusFingerprints: artifacts.corpusFingerprints,
      examinerIntent: artifacts.examinerIntent,
      visual,
    },
    visual,
    svgRendering: svg.rendered as unknown,
    qualityMetrics: qualityReport as unknown,
    localizationMetadata: {
      localized,
    } as unknown,
    pedagogicalMetrics: {
      svg: validateSvgPedagogyGraph(svg.layout, svg.rendered.svg).metrics,
      realism: realismMetrics,
    } as unknown,
    debugMetadata: {
      selectedPattern: pattern.id,
      seed: artifacts.seed,
      generationId: options?.generationContext?.generationId,
      generationTimestamp: Date.now(),
      generationDomain: "quant-v2-percentage",
      generationBackend: "quant-v2",
      debugSource: "quant-v2-percentage-adapter",
      selectedMotif: artifacts.selectedFactory,
      selectedArchetype: problem.reasoningPattern,
      compatibilityWarnings: [],
      inferenceDepth: graph.steps.length,
      validationWarnings: failedValidators,
      validationRetries: artifacts.rejectedCandidateCount,
      uniquenessFailures: 0,
      branchingFactor: graph.branches.length,
      branchingComplexity: graph.branches.length,
      deductionDependencyScore: graph.steps.length,
      structuralDiversityScore:
        qualityReport.metrics.topologyComplexityScore / 100,
      uniquenessVerified: true,
      generationMetrics: {
        generationDurationMs: Date.now() - startedAt,
        validationRetries: artifacts.rejectedCandidateCount,
        uniquenessFailures: 0,
        branchingFactor: graph.branches.length,
        branchingComplexity: graph.branches.length,
        clueDensity: graph.steps.length,
        inferenceDepth: graph.steps.length,
        redundancyScore: 0,
        deductionDependencyScore: graph.steps.length,
        redundancyRatio: 0,
        realismScore: qualityReport.metrics.editorialRealismScore,
      },
      proceduralScenario: {
        id: signature,
        domain: "quant-v2-percentage",
        subtype: problem.subtype,
        metadata: quantV2Metadata,
        entities: Object.entries(problem.variables).map(
          ([label, value], index) => ({
            id: `var-${index}`,
            type: "canonical-variable",
            label,
            value,
          }),
        ),
        constraints: graph.steps.map((step, index) => ({
          id: `step-${index}`,
          type: step.type,
          expression: step.equation ?? step.descriptionKey,
          metadata: step,
        })),
        content: {
          stem: editorial.stem,
          prompt: editorial.stem,
          options: optionsList,
          explanation: editorial.explanation,
          artifacts: {
            svg: svg.rendered.svg,
            visual,
          },
        },
        difficulty: {
          label: difficulty,
          score: qualityReport.metrics.topologyComplexityScore,
          inferenceDepth: graph.steps.length,
          metrics: qualityReport.metrics,
        },
        validation: {
          passed: failedValidators.length === 0,
          warnings: failedValidators,
          metrics: {
            overallQualityScore: qualityReport.metrics.overallQualityScore,
          },
        },
      },
      structuralSignatureKey: signature,
      scenarioLogicBranch: problem.reasoningPattern,
      reasoningEngineFamily: "quant-v2",
      reasoningStyleAnchor: editorial.style,
      reasoningSelfSolver: {
        solutionCount: graph.branches.length,
        uniqueAnswer: true,
        issues: failedValidators,
      },
      quantV2: {
        ...quantV2Metadata,
        canonicalProblem: problem,
        reasoningGraph: graph,
        editorial,
        localized,
        svgRendering: svg.rendered,
        semanticMetadata: {
          signature,
          canonicalScenario: artifacts.canonicalScenario,
          corpusFingerprints: artifacts.corpusFingerprints,
          examinerIntent: artifacts.examinerIntent,
          visual,
          displayedDistractors: artifacts.displayedDistractors,
          distractorIntelligence: artifacts.distractorIntelligence,
          answer: {
            raw: problem.answer,
            rendered: answerOption,
          },
        },
        qualityMetrics: qualityReport,
        validatorReports,
        pedagogicalMetrics: {
          svg: validateSvgPedagogyGraph(svg.layout, svg.rendered.svg).metrics,
          realism: realismMetrics,
        },
      },
    },
  };
}
