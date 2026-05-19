import type {
  CanonicalPercentageProblem,
  Difficulty,
  PercentageSubtype,
} from "../canonical/percentage-types";
import {
  PERCENTAGE_MOTIF_FACTORIES,
  type PercentageMotifFactory,
} from "../canonical/percentage-motif-factories";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import type {
  ReasoningGraph,
  ReasoningStep,
} from "../reasoning/reasoning-graph-types";
import { sanitizeEquation } from "../reasoning/equation-utils";
import { createProblemSignature } from "../utils/problem-signature";
import { roundClean } from "../utils/math-utils";
import { validatePercentageProblem } from "../validators/problem-validator";
import { validateReasoningGraph } from "../validators/reasoning-validator";
import { validateTopology } from "../validators/topology-validator";
import {
  createRealismMetrics,
  validateRealism,
} from "../validators/realism-validator";
import { realizeEditorialProblem } from "../editorial/stem-realizer";
import { validateEditorialRealization } from "../validators/editorial-validator";
import {
  createHumanReasoningMetrics,
  validateHumanReasoningRealization,
} from "../validators/human-reasoning-validator";
import {
  createEditorialMicroPolishMetrics,
  validateEditorialMicroPolish,
} from "../validators/editorial-micro-polish-validator";
import {
  createContextualHumanizationMetrics,
  validateContextualHumanization,
} from "../validators/contextual-humanization-validator";
import {
  createSemanticStabilityMetrics,
  validateSemanticStability,
} from "../validators/semantic-stability-validator";
import {
  createPresentationPolishMetrics,
  validatePresentationPolish,
} from "../validators/presentation-polish-validator";
import {
  createCalibratedQualityReport,
  validateMetricCalibration,
} from "../validators/metric-calibration-validator";
import { semanticAnswerText } from "../editorial/contextual-humanization";
import { renderLocalizedRealization } from "../localization/renderers/language-renderer";
import { validateLocalization } from "../localization/validators/localization-validator";
import { createPedagogicalFlowMetrics } from "../validators/pedagogical-flow-validator";

type InspectorOptions = {
  subtype?: PercentageSubtype;
  difficulty?: Difficulty;
  count: number;
  seed: number;
  random: boolean;
  debugGraph: boolean;
};

type FactoryEntry = {
  name: string;
  factory: PercentageMotifFactory;
  subtype: PercentageSubtype;
};

type StepDisplay = {
  step: ReasoningStep;
  equation?: string;
};

const DEFAULT_COUNT = 5;
const DEFAULT_SEED = 1;
const MAX_COUNT = 100;
const LINE = "========================================";
const SUBTYPE_VALUES = new Set(
  Object.values(PERCENTAGE_MOTIF_FACTORIES).map(
    (factory) => factory(1).subtype,
  ),
);
const DIFFICULTY_VALUES = new Set([
  "easy",
  "medium",
  "hard",
]);

function stableNumberText(value: number) {
  const rounded = roundClean(value, 4);
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/0+$/u, "").replace(/\.$/u, "");
}

function parseIntegerOption(
  value: string | undefined,
  fallback: number,
  label: string,
) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new Error(`${label} must be an integer.`);
  }

  return parsed;
}

function parseArgs(args: string[]): InspectorOptions {
  const raw: Record<string, string | boolean> = {};

  for (const arg of args) {
    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected positional argument: ${arg}`);
    }

    const [key, value] = arg.slice(2).split("=", 2);
    raw[key] = value ?? true;
  }

  const subtype = raw.subtype;
  if (
    typeof subtype === "string" &&
    !SUBTYPE_VALUES.has(subtype as PercentageSubtype)
  ) {
    throw new Error(`Unsupported subtype: ${subtype}`);
  }

  const difficulty = raw.difficulty;
  if (
    typeof difficulty === "string" &&
    !DIFFICULTY_VALUES.has(difficulty as Difficulty)
  ) {
    throw new Error(`Unsupported difficulty: ${difficulty}`);
  }

  const count = Math.min(
    Math.max(
      parseIntegerOption(
        typeof raw.count === "string" ? raw.count : undefined,
        DEFAULT_COUNT,
        "--count",
      ),
      1,
    ),
    MAX_COUNT,
  );
  const seed = parseIntegerOption(
    typeof raw.seed === "string" ? raw.seed : undefined,
    DEFAULT_SEED,
    "--seed",
  );

  return {
    subtype:
      typeof subtype === "string"
        ? (subtype as PercentageSubtype)
        : undefined,
    difficulty:
      typeof difficulty === "string"
        ? (difficulty as Difficulty)
        : undefined,
    count,
    seed,
    random: raw.random === true,
    debugGraph: raw["debug-graph"] === true,
  };
}

function factoryEntries(): FactoryEntry[] {
  return Object.entries(PERCENTAGE_MOTIF_FACTORIES).map(
    ([name, factory]) => ({
      name,
      factory,
      subtype: factory(1).subtype,
    }),
  );
}

function randomIndex(seed: number, offset: number, length: number) {
  let state = (seed + offset * 2654435761) >>> 0;
  state = Math.imul(1664525, state) + 1013904223;
  return (state >>> 0) % length;
}

function selectEntries(
  options: InspectorOptions,
  entries: FactoryEntry[],
) {
  const filtered = options.subtype
    ? entries.filter((entry) => entry.subtype === options.subtype)
    : entries;

  if (filtered.length === 0) {
    throw new Error("No motif factories match the requested filters.");
  }

  return filtered;
}

function generateProblems(
  options: InspectorOptions,
): CanonicalPercentageProblem[] {
  const entries = selectEntries(options, factoryEntries());
  const problems: CanonicalPercentageProblem[] = [];
  let attempt = 0;

  while (
    problems.length < options.count &&
    attempt < options.count * entries.length * 50
  ) {
    const entry = options.random
      ? entries[randomIndex(options.seed, attempt, entries.length)]!
      : entries[attempt % entries.length]!;
    const sampleSeed =
      options.seed + Math.floor(attempt / entries.length);
    const problem = entry.factory(sampleSeed);

    if (
      !options.difficulty ||
      problem.difficulty === options.difficulty
    ) {
      problems.push(problem);
    }

    attempt += 1;
  }

  if (problems.length === 0) {
    throw new Error("No canonical problems matched the requested filters.");
  }

  return problems;
}

function evaluateExpression(
  expression: string,
  variables: Record<string, number>,
) {
  let substituted = expression.replace(
    /\{([A-Za-z_][A-Za-z0-9_]*)\}/gu,
    (_, key: string) => stableNumberText(variables[key] ?? Number.NaN),
  );
  substituted = substituted.replace(
    /\b[A-Za-z_][A-Za-z0-9_]*\b/gu,
    (key) =>
      typeof variables[key] === "number"
        ? stableNumberText(variables[key])
        : key,
  );

  if (/[A-Za-z_{}]/u.test(substituted)) {
    return null;
  }

  const safeExpression = substituted.replace(/\^/gu, "**");
  if (!/^[0-9+\-*/().\s%]+$/u.test(safeExpression)) {
    return null;
  }

  try {
    const value = Function(
      `"use strict"; return (${safeExpression});`,
    )() as unknown;
    return typeof value === "number" && Number.isFinite(value)
      ? roundClean(value, 4)
      : null;
  } catch {
    return null;
  }
}

function renderExpressionSegment(
  expression: string,
  variables: Record<string, number>,
) {
  return expression
    .replace(
      /\{([A-Za-z_][A-Za-z0-9_]*)\}/gu,
      (_, key: string) =>
        typeof variables[key] === "number"
          ? stableNumberText(variables[key])
          : `{${key}}`,
    )
    .replace(
      /\b[A-Za-z_][A-Za-z0-9_]*\b/gu,
      (key) =>
        typeof variables[key] === "number"
          ? stableNumberText(variables[key])
          : key,
    )
    .replace(/\s+%/gu, "%")
    .replace(/\s+;/gu, ";");
}

function renderEquation(
  equation: string | undefined,
  variables: Record<string, number>,
) {
  if (!equation) {
    return undefined;
  }

  const normalized = sanitizeEquation(equation);
  const [left, ...rightParts] = normalized.split("=");
  const output = left?.trim();
  const rightExpression = rightParts.join("=");
  const assignmentLike =
    Boolean(output) &&
    Boolean(rightExpression) &&
    /^[A-Za-z_][A-Za-z0-9_]*$/u.test(output);
  const substituted = assignmentLike
    ? `${output} = ${renderExpressionSegment(
        rightExpression.trim(),
        variables,
      )}`
    : renderExpressionSegment(normalized, variables);

  if (assignmentLike) {
    const value = evaluateExpression(
      rightExpression,
      variables,
    );
    if (
      value !== null &&
      /^[A-Za-z_][A-Za-z0-9_]*$/u.test(output)
    ) {
      variables[output] = value;
      return `${substituted} => ${stableNumberText(value)}`;
    }
  }

  return substituted;
}

function stepDisplays(
  graph: ReasoningGraph,
  problem: CanonicalPercentageProblem,
) {
  const variables: Record<string, number> = {
    ...problem.variables,
    answer: problem.answer,
  };

  return graph.steps.map((step): StepDisplay => {
    const equation = renderEquation(
      step.equation,
      variables,
    );

    if (
      step.outputVariable &&
      typeof variables[step.outputVariable] !== "number"
    ) {
      variables[step.outputVariable] =
        problem.variables[step.outputVariable] ??
        problem.answer;
    }

    return {
      step,
      equation,
    };
  });
}

function renderEquationWithProblem(
  equation: string | undefined,
  problem: CanonicalPercentageProblem,
) {
  return renderEquation(equation, {
    ...problem.variables,
    answer: problem.answer,
  });
}

function printKeyValues(
  title: string,
  values: Record<string, number>,
) {
  console.log(`${title}:`);
  for (const [key, value] of Object.entries(values)) {
    console.log(`  ${key} = ${stableNumberText(value)}`);
  }
  console.log("");
}

function printList(title: string, values: readonly (number | string)[]) {
  console.log(`${title}:`);
  if (values.length === 0) {
    console.log("  none");
  } else {
    for (const value of values) {
      console.log(`  - ${value}`);
    }
  }
  console.log("");
}

function validationLines(
  problem: CanonicalPercentageProblem,
  graph: ReasoningGraph,
) {
  const canonical = validatePercentageProblem(problem);
  const reasoning = validateReasoningGraph(problem, graph);
  const topology = problem.topology
    ? validateTopology(problem, graph)
    : undefined;
  const realism = validateRealism(problem);
  const editorial = realizeEditorialProblem({
    problem,
    graph,
    seed: createProblemSignature(problem),
  });
  const editorialValidation = validateEditorialRealization(
    problem,
    graph,
    editorial,
  );
  const humanReasoning = validateHumanReasoningRealization(editorial);
  const microPolish = validateEditorialMicroPolish(editorial);
  const contextualHumanization = validateContextualHumanization(
    problem,
    editorial,
  );
  const semanticStability = validateSemanticStability(problem, editorial);
  const presentationPolish = validatePresentationPolish(problem, editorial);
  const metricCalibration = validateMetricCalibration(
    createCalibratedQualityReport(problem, graph, editorial),
  );

  return [
    canonical.valid
      ? "  OK canonical valid"
      : "  FAIL canonical invalid",
    ...canonical.issues.map((issue) => `  FAIL ${issue}`),
    reasoning.valid
      ? "  OK reasoning graph valid"
      : "  FAIL reasoning graph invalid",
    ...reasoning.issues.map((issue) => `  FAIL ${issue}`),
    ...(topology
      ? [
          topology.valid
            ? "  OK topology valid"
            : "  FAIL topology invalid",
          ...topology.issues.map((issue) => `  FAIL ${issue}`),
        ]
      : []),
    realism.valid
      ? "  OK realism valid"
      : "  FAIL realism invalid",
    ...realism.issues.map((issue) => `  FAIL ${issue}`),
    editorialValidation.valid
      ? "  OK editorial valid"
      : "  FAIL editorial invalid",
    ...editorialValidation.issues.map((issue) => `  FAIL ${issue}`),
    humanReasoning.valid
      ? "  OK human reasoning valid"
      : "  FAIL human reasoning invalid",
    ...humanReasoning.issues.map((issue) => `  FAIL ${issue}`),
    microPolish.valid
      ? "  OK micro polish valid"
      : "  FAIL micro polish invalid",
    ...microPolish.issues.map((issue) => `  FAIL ${issue}`),
    contextualHumanization.valid
      ? "  OK contextual humanization valid"
      : "  FAIL contextual humanization invalid",
    ...contextualHumanization.issues.map((issue) => `  FAIL ${issue}`),
    semanticStability.valid
      ? "  OK semantic stability valid"
      : "  FAIL semantic stability invalid",
    ...semanticStability.issues.map((issue) => `  FAIL ${issue}`),
    presentationPolish.valid
      ? "  OK presentation polish valid"
      : "  FAIL presentation polish invalid",
    ...presentationPolish.issues.map((issue) => `  FAIL ${issue}`),
    metricCalibration.valid
      ? "  OK metric calibration valid"
      : "  FAIL metric calibration invalid",
    ...metricCalibration.issues.map((issue) => `  FAIL ${issue}`),
  ];
}

function printTopology(problem: CanonicalPercentageProblem) {
  const topology = problem.topology;

  console.log("Topology:");
  if (!topology) {
    console.log("  family = none");
    console.log("  variant = none");
    console.log("");
    return;
  }

  console.log(`  family = ${topology.family}`);
  console.log(`  variant = ${topology.variant}`);
  console.log(
    `  hiddenBase = ${topology.hiddenBase ? "yes" : "no"}`,
  );
  console.log(
    `  misconceptionDistractors = ${topology.misconceptionDistractors.length}`,
  );
  console.log("");
}

function printFilteringChain(problem: CanonicalPercentageProblem) {
  const chain = problem.topology?.filteringChain;

  console.log("Filtering Chain:");
  if (!chain) {
    console.log("  none");
    console.log("");
    return;
  }

  console.log(`  id = ${chain.chainId}`);
  console.log(
    `  path = ${[
      chain.baseVariable,
      ...chain.stages.map((stage) => stage.outputVariable),
    ].join(" -> ")}`,
  );
  for (const stage of chain.stages) {
    console.log(
      `  - ${stage.stageId}: ${stage.inputVariable} -> ${stage.outputVariable}`,
    );
  }
  console.log("");
}

function printProblem(
  problem: CanonicalPercentageProblem,
  index: number,
  options: InspectorOptions,
) {
  const graph = buildReasoningGraph(problem);
  const editorial = realizeEditorialProblem({
    problem,
    graph,
    seed: createProblemSignature(problem),
  });
  const equationCount = graph.steps.filter(
    (step) => Boolean(step.equation),
  ).length + (graph.finalEquation ? 1 : 0);

  console.log(LINE);
  console.log(`Sample: ${index}`);
  console.log(`Subtype: ${problem.subtype}`);
  console.log(`Category: ${problem.category}`);
  console.log(`Reasoning Pattern: ${problem.reasoningPattern}`);
  console.log(`Difficulty: ${problem.difficulty}`);
  console.log(LINE);
  console.log("");

  printTopology(problem);
  printFilteringChain(problem);
  console.log("Editorial:");
  console.log(`  scenario = ${editorial.scenario.family}`);
  console.log(`  style = ${editorial.style}`);
  console.log(`  rhythmProfile = ${editorial.naturalization.rhythmProfile}`);
  console.log(
    `  shortcutSurfaced = ${
      editorial.naturalization.shortcutSurfaced ? "yes" : "no"
    }`,
  );
  console.log(
    `  naturalizationScore = ${editorial.naturalization.naturalizationScore}`,
  );
  const humanMetrics = createHumanReasoningMetrics(editorial);
  console.log(`  humanizationScore = ${humanMetrics.humanizationScore}`);
  console.log(`  solverLeakageScore = ${humanMetrics.solverLeakageScore}`);
  console.log(
    `  equationReadabilityScore = ${humanMetrics.equationReadabilityScore}`,
  );
  console.log(
    `  teacherStyleRealismScore = ${humanMetrics.teacherStyleRealismScore}`,
  );
  const polishMetrics = createEditorialMicroPolishMetrics(editorial);
  console.log(
    `  transitionCollisionScore = ${polishMetrics.transitionCollisionScore}`,
  );
  console.log(`  semanticRealismScore = ${polishMetrics.semanticRealismScore}`);
  console.log(`  signRealizationScore = ${polishMetrics.signRealizationScore}`);
  console.log(
    `  shortcutReadabilityScore = ${polishMetrics.shortcutReadabilityScore}`,
  );
  console.log(`  editorialPolishScore = ${polishMetrics.editorialPolishScore}`);
  const contextualMetrics = createContextualHumanizationMetrics(
    problem,
    editorial,
  );
  console.log(
    `  contextualRealismScore = ${contextualMetrics.contextualRealismScore}`,
  );
  console.log(
    `  domainNarrationScore = ${contextualMetrics.domainNarrationScore}`,
  );
  console.log(
    `  semanticAnswerConsistency = ${contextualMetrics.semanticAnswerConsistency}`,
  );
  console.log(
    `  shortcutContextualizationScore = ${contextualMetrics.shortcutContextualizationScore}`,
  );
  console.log(
    `  coachingAuthenticityScore = ${contextualMetrics.coachingAuthenticityScore}`,
  );
  const semanticMetrics = createSemanticStabilityMetrics(problem, editorial);
  console.log(
    `  semanticStabilityScore = ${semanticMetrics.semanticStabilityScore}`,
  );
  console.log(
    `  formatterSafetyScore = ${semanticMetrics.formatterSafetyScore}`,
  );
  console.log(
    `  answerConsistencyScore = ${semanticMetrics.answerConsistencyScore}`,
  );
  console.log(
    `  realizationSafetyScore = ${semanticMetrics.realizationSafetyScore}`,
  );
  console.log(
    `  shortcutCompressionScore = ${semanticMetrics.shortcutCompressionScore}`,
  );
  console.log(
    `  signatureSemanticSafetyScore = ${semanticMetrics.signatureSemanticSafetyScore}`,
  );
  const presentationMetrics = createPresentationPolishMetrics(
    problem,
    editorial,
  );
  console.log(
    `  labelNaturalnessScore = ${presentationMetrics.labelNaturalnessScore}`,
  );
  console.log(
    `  narrationCompressionScore = ${presentationMetrics.narrationCompressionScore}`,
  );
  console.log(
    `  domainDiversityScore = ${presentationMetrics.domainDiversityScore}`,
  );
  console.log(
    `  transitionVariationScore = ${presentationMetrics.transitionVariationScore}`,
  );
  console.log(
    `  editorialCompactnessScore = ${presentationMetrics.editorialCompactnessScore}`,
  );
  const calibratedReport = createCalibratedQualityReport(
    problem,
    graph,
    editorial,
  );
  const hindi = renderLocalizedRealization({
    language: "hi",
    problem,
    graph,
    editorial,
  });
  const punjabi = renderLocalizedRealization({
    language: "pa",
    problem,
    graph,
    editorial,
  });
  const hindiLocalization = validateLocalization({
    source: editorial,
    localized: hindi,
  });
  const punjabiLocalization = validateLocalization({
    source: editorial,
    localized: punjabi,
  });
  const pedagogicalMetrics = createPedagogicalFlowMetrics({
    problem,
    graph,
    realization: editorial,
    localized: [hindi, punjabi],
  });
  console.log("");
  console.log("Calibrated Quality:");
  console.log(`  tier = ${calibratedReport.tier}`);
  console.log(`  confidence = ${calibratedReport.confidence}`);
  console.log(`  overallQualityScore = ${calibratedReport.metrics.overallQualityScore}`);
  console.log(`  topologyComplexityScore = ${calibratedReport.metrics.topologyComplexityScore}`);
  console.log(`  editorialRealismScore = ${calibratedReport.metrics.editorialRealismScore}`);
  console.log(`  calibratedEquationReadabilityScore = ${calibratedReport.metrics.equationReadabilityScore}`);
  console.log(`  calibratedCoachingAuthenticityScore = ${calibratedReport.metrics.coachingAuthenticityScore}`);
  console.log(`  contextualNaturalnessScore = ${calibratedReport.metrics.contextualNaturalnessScore}`);
  console.log(`  domainRealismScore = ${calibratedReport.metrics.domainRealismScore}`);
  console.log(`  shortcutUsefulnessScore = ${calibratedReport.metrics.shortcutUsefulnessScore}`);
  console.log(`  semanticSafetyScore = ${calibratedReport.metrics.semanticSafetyScore}`);
  console.log(`  repetitionResistanceScore = ${calibratedReport.metrics.repetitionResistanceScore}`);
  console.log(`  transitionFlowScore = ${calibratedReport.metrics.transitionFlowScore}`);
  console.log(`  narrationCompactnessScore = ${calibratedReport.metrics.narrationCompactnessScore}`);
  console.log("  explanationBreakdown:");
  for (const reason of calibratedReport.explanationBreakdown) {
    console.log(`    - ${reason}`);
  }
  console.log("  penaltyBreakdown:");
  if (calibratedReport.penaltyBreakdown.length === 0) {
    console.log("    - none");
  } else {
    for (const penalty of calibratedReport.penaltyBreakdown) {
      console.log(`    - ${penalty}`);
    }
  }
  console.log("  realismWeighting:");
  for (const reason of calibratedReport.realismWeighting) {
    console.log(`    - ${reason}`);
  }
  console.log("  repetitionPenalties:");
  for (const penalty of calibratedReport.repetitionPenalties) {
    console.log(`    - ${penalty}`);
  }
  console.log("");
  console.log("Localization:");
  console.log(
    `  hiCoverage = ${hindiLocalization.metrics.localizationCoverage}`,
  );
  console.log(
    `  hiFallbackUsage = ${hindiLocalization.metrics.fallbackCount}`,
  );
  console.log(
    `  hiScriptConsistency = ${hindiLocalization.metrics.scriptConsistencyScore}`,
  );
  console.log(
    `  hiEquationPreservation = ${hindiLocalization.metrics.equationPreservationScore}`,
  );
  console.log(
    `  hiMultilingualReadiness = ${hindiLocalization.metrics.multilingualReadinessScore}`,
  );
  console.log(
    `  paCoverage = ${punjabiLocalization.metrics.localizationCoverage}`,
  );
  console.log(
    `  paFallbackUsage = ${punjabiLocalization.metrics.fallbackCount}`,
  );
  console.log(
    `  paScriptConsistency = ${punjabiLocalization.metrics.scriptConsistencyScore}`,
  );
  console.log(
    `  paEquationPreservation = ${punjabiLocalization.metrics.equationPreservationScore}`,
  );
  console.log(
    `  paMultilingualReadiness = ${punjabiLocalization.metrics.multilingualReadinessScore}`,
  );
  if (
    hindi.coverage.missingIntents.length > 0 ||
    punjabi.coverage.missingIntents.length > 0
  ) {
    console.log(
      `  missingIntents = ${[
        ...new Set([
          ...hindi.coverage.missingIntents,
          ...punjabi.coverage.missingIntents,
        ]),
      ].join(", ")}`,
    );
  } else {
    console.log("  missingIntents = none");
  }
  console.log("");
  console.log("Pedagogical Flow:");
  console.log(
    `  pedagogicalContinuityScore = ${pedagogicalMetrics.pedagogicalContinuityScore}`,
  );
  console.log(
    `  derivationVisibilityScore = ${pedagogicalMetrics.derivationVisibilityScore}`,
  );
  console.log(
    `  shortcutBalanceScore = ${pedagogicalMetrics.shortcutBalanceScore}`,
  );
  console.log(
    `  explanationCompletenessScore = ${pedagogicalMetrics.explanationCompletenessScore}`,
  );
  console.log(
    `  compressionStabilityScore = ${pedagogicalMetrics.compressionStabilityScore}`,
  );
  console.log(
    `  collisionSuppressionScore = ${pedagogicalMetrics.collisionSuppressionScore}`,
  );
  console.log("");
  console.log("Stem:");
  console.log(`  ${editorial.stem}`);
  console.log("");
  console.log("Explanation:");
  for (const line of editorial.explanation.split("\n")) {
    console.log(`  ${line}`);
  }
  console.log("");
  if (options.debugGraph) {
    printKeyValues("Variables", problem.variables);
  }
  console.log("Answer:");
  console.log(`  ${semanticAnswerText(problem)}`);
  console.log("");
  printList(
    "Distractors",
    problem.distractors.map(stableNumberText),
  );
  if (options.debugGraph) {
    printList("Canonical Traps", problem.traps);
  }

  console.log("Validation:");
  for (const line of validationLines(problem, graph)) {
    console.log(line);
  }
  console.log("");

  console.log("Metrics:");
  console.log(`  stepCount = ${graph.steps.length}`);
  console.log(`  branchCount = ${graph.branches.length}`);
  console.log(
    `  branchTypes = ${
      graph.branches.map((branch) => branch.branchType).join(", ") || "none"
    }`,
  );
  console.log(`  equationCount = ${equationCount}`);
  console.log(
    `  shortcutAvailable = ${graph.shortcutEquation ? "yes" : "no"}`,
  );
  console.log(`  trapCount = ${problem.traps.length}`);
  console.log("");

  const realismMetrics = createRealismMetrics(problem);
  console.log("Realism Metrics:");
  console.log(`  visualCleanliness = ${realismMetrics.visualCleanliness}`);
  console.log(`  divisibilityQuality = ${realismMetrics.divisibilityQuality}`);
  console.log(`  distractorRealism = ${realismMetrics.distractorRealism}`);
  console.log(`  humanReadability = ${realismMetrics.humanReadability}`);
  console.log(`  scaleRealism = ${realismMetrics.scaleRealism}`);
  console.log("");

  if (options.debugGraph) {
    console.log("Reasoning Steps:");
    stepDisplays(graph, problem).forEach((display, stepIndex) => {
      console.log(
        `${stepIndex + 1}. ${display.step.type} (${display.step.descriptionKey})`,
      );
      if (display.step.inputVariables.length > 0) {
        console.log(
          `   inputs: ${display.step.inputVariables.join(", ")}`,
        );
      }
      if (display.step.outputVariable) {
        console.log(`   output: ${display.step.outputVariable}`);
      }
      if (display.equation) {
        console.log("   equation:");
        console.log(`     ${display.equation}`);
      }
      if (display.step.trapWarning) {
        console.log(`   trap: ${display.step.trapWarning}`);
      }
    });
    console.log("");

    console.log("Final Equation:");
    console.log(
      `  ${renderEquationWithProblem(graph.finalEquation, problem) ?? "none"}`,
    );
    console.log("");

    console.log("Shortcut:");
    console.log(
      `  ${
        renderEquationWithProblem(graph.shortcutEquation, problem) ??
        "none"
      }`,
    );
    console.log("");

    printList(
      "Graph Traps",
      graph.trapSummary ? graph.trapSummary.split("|") : [],
    );
  }

  console.log("Signature:");
  console.log(`  ${createProblemSignature(problem)}`);
  console.log("");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const problems = generateProblems(options);

  problems.forEach((problem, index) => {
    printProblem(problem, index + 1, options);
  });
}

try {
  main();
} catch (error) {
  console.error(
    error instanceof Error
      ? error.message
      : String(error),
  );
  console.error("");
  console.error(
    "Usage: pnpm reasoning:inspect --subtype=election_margin --count=5 --seed=1234",
  );
  console.error(
    "       pnpm reasoning:inspect --random --count=20 --difficulty=easy",
  );
  process.exitCode = 1;
}
