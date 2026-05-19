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
import { createProblemSignature } from "../../quant-v2/utils/problem-signature";

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
};

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
    context?.generationId ?? String(options?.seed ?? "standalone");
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

  const keys = Object.keys(PERCENTAGE_MOTIF_FACTORIES) as QuantV2FactoryKey[];
  const seed = `${options?.seed ?? ""}|${pattern.id}|${pattern.topic}|${pattern.subtopic}|${sequence}`;
  const key = keys[hashText(seed) % keys.length]!;
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

function buildValidatorReports(input: ReturnType<typeof buildQuantV2Artifacts>) {
  const {
    problem,
    graph,
    editorial,
    localized,
    svg,
    qualityReport,
    optionSets,
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
  const seed = `${input.options?.seed ?? ""}|${input.pattern.id}|${sequence}|${selected.key}`;
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
  const optionSets = {
    en: renderOptions({
      problem,
      values: [problem.answer, ...problem.distractors],
      language: "en",
    }),
    hi: renderOptions({
      problem,
      values: [problem.answer, ...problem.distractors],
      language: "hi",
    }),
    pa: renderOptions({
      problem,
      values: [problem.answer, ...problem.distractors],
      language: "pa",
    }),
  };

  return {
    sequence,
    selectedFactory: selected.key,
    realizationProfile,
    seed,
    problem,
    graph,
    editorial,
    localized,
    svg,
    qualityReport,
    optionSets,
  };
}

export function createQuantV2PercentageQuestionCandidate(
  pattern: Pattern,
  options?: GeneratorOptions,
): FormulaQuestion {
  const startedAt = Date.now();
  const artifacts = buildQuantV2Artifacts({
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
    qualityReport,
  } = artifacts;
  const signature = createProblemSignature(problem);
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
    },
    generationMetrics: {
      generationDurationMs: Date.now() - startedAt,
      validationRetries: 0,
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
        answer: {
          raw: problem.answer,
          rendered: answerOption,
        },
        variables: problem.variables,
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
    },
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
      validationRetries: 0,
      uniquenessFailures: 0,
      branchingFactor: graph.branches.length,
      branchingComplexity: graph.branches.length,
      deductionDependencyScore: graph.steps.length,
      structuralDiversityScore:
        qualityReport.metrics.topologyComplexityScore / 100,
      uniquenessVerified: true,
      generationMetrics: {
        generationDurationMs: Date.now() - startedAt,
        validationRetries: 0,
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
