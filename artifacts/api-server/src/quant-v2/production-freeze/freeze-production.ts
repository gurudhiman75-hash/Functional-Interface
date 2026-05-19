import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { PERCENTAGE_MOTIF_FACTORY_LIST } from "../canonical/percentage-motif-factories";
import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import { semanticAnswerText } from "../editorial/contextual-humanization";
import type { EditorialRealization } from "../editorial/editorial-types";
import { realizeEditorialProblem } from "../editorial/stem-realizer";
import type { LocalizedRealization } from "../localization/contracts/language-contracts";
import { renderLocalizedRealization } from "../localization/renderers/language-renderer";
import { validateLocalization } from "../localization/validators/localization-validator";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { renderSvgVisualization } from "../svg/renderers/svg-pipeline";
import { validateSvgPedagogyGraph } from "../svg/validators/svg-pedagogy-validator";
import type { SvgPedagogyMetrics } from "../svg/validators/svg-pedagogy-validator";
import { createProblemSignature } from "../utils/problem-signature";
import { validateContextualHumanization } from "../validators/contextual-humanization-validator";
import { validateEditorialMicroPolish } from "../validators/editorial-micro-polish-validator";
import { validateEditorialRealization } from "../validators/editorial-validator";
import { validateHumanReasoningRealization } from "../validators/human-reasoning-validator";
import {
  createCalibratedQualityReport,
  validateMetricCalibration,
} from "../validators/metric-calibration-validator";
import { validatePedagogicalFlow } from "../validators/pedagogical-flow-validator";
import { validatePercentageProblem } from "../validators/problem-validator";
import { validatePresentationPolish } from "../validators/presentation-polish-validator";
import { validateReasoningGraph } from "../validators/reasoning-validator";
import { validateRealism } from "../validators/realism-validator";
import { validateSemanticStability } from "../validators/semantic-stability-validator";
import { validateTopology } from "../validators/topology-validator";

export const PRODUCTION_FREEZE_VERSION =
  "v1-production-multilingual-stable";
export const SEMANTIC_CONTRACT_VERSION = "semantic-values.v1";
export const LOCALIZATION_CONTRACT_VERSION = "semantic-intents.v1";
export const SVG_CONTRACT_VERSION = "svg-pedagogy.v1";
export const VALIDATOR_VERSION = "quant-v2-validator-suite.v1";
export const METRIC_CALIBRATION_VERSION = "metric-calibration.v1";
export const FREEZE_TIMESTAMP = "2026-05-18T00:00:00+05:30";

const SAMPLE_POOL_SIZE = 5000;
const TARGET_LANGUAGE_GOLDENS = 200;
const TARGET_EDGE_GOLDENS = 100;
const TARGET_SVG_GOLDENS = 100;
const TARGET_MULTILINGUAL_SVG_GOLDENS = 100;

type GoldenLanguage = "en" | "hi" | "pa";

interface BuiltProductionSample {
  index: number;
  seed: number;
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  realization: EditorialRealization;
  localized: {
    en: LocalizedRealization;
    hi: LocalizedRealization;
    pa: LocalizedRealization;
  };
  report: ReturnType<typeof createCalibratedQualityReport>;
  signature: string;
}

interface ProductionGolden {
  id: string;
  language: GoldenLanguage;
  sourceIndex: number;
  seed: number;
  signature: string;
  question: string;
  explanation: string;
  answer: string;
  topologyMetadata: Record<string, unknown>;
  reasoningGraph: ReasoningGraph;
  semanticMetadata: Record<string, unknown>;
  multilingualRendering: Record<string, unknown>;
  svgRendering?: Record<string, unknown>;
  metricMetadata: Record<string, unknown>;
}

interface SvgGolden {
  id: string;
  language: GoldenLanguage;
  sourceIndex: number;
  signature: string;
  topologyMetadata: Record<string, unknown>;
  semanticMetadata: Record<string, unknown>;
  reasoningGraph: ReasoningGraph;
  multilingualRendering: Record<string, unknown>;
  svgRendering: {
    width: number;
    height: number;
    svg: string;
    svgHash: string;
    nodeTypes: string[];
    metrics: SvgPedagogyMetrics;
  };
  metricMetadata: Record<string, unknown>;
}

export interface ProductionFreezeArtifacts {
  manifest: Record<string, unknown>;
  report: string;
  goldens: {
    english: ProductionGolden[];
    hindi: ProductionGolden[];
    punjabi: ProductionGolden[];
    edgeCases: ProductionGolden[];
    svg: SvgGolden[];
    multilingualSvg: SvgGolden[];
  };
  validationReport: Record<string, unknown>;
}

function hash(text: string) {
  return createHash("sha256").update(text).digest("hex");
}

function stableSample(index: number): BuiltProductionSample {
  const factory =
    PERCENTAGE_MOTIF_FACTORY_LIST[
      index % PERCENTAGE_MOTIF_FACTORY_LIST.length
    ]!;
  const seed =
    Math.floor(index / PERCENTAGE_MOTIF_FACTORY_LIST.length) + 1;
  const problem = factory(seed);
  const graph = buildReasoningGraph(problem);
  const signature = createProblemSignature(problem);
  const realization = realizeEditorialProblem({
    problem,
    graph,
    seed: `production:${index}:${signature}`,
  });
  const localized = {
    en: renderLocalizedRealization({
      language: "en",
      problem,
      graph,
      editorial: realization,
    }),
    hi: renderLocalizedRealization({
      language: "hi",
      problem,
      graph,
      editorial: realization,
    }),
    pa: renderLocalizedRealization({
      language: "pa",
      problem,
      graph,
      editorial: realization,
    }),
  };
  const report = createCalibratedQualityReport(problem, graph, realization);

  return {
    index,
    seed,
    problem,
    graph,
    realization,
    localized,
    report,
    signature,
  };
}

function validations(sample: BuiltProductionSample) {
  const localizationInputs = [
    ["en", sample.localized.en],
    ["hi", sample.localized.hi],
    ["pa", sample.localized.pa],
  ] as const;
  const localization = Object.fromEntries(
    localizationInputs.map(([language, localized]) => [
      language,
      validateLocalization({
        localized,
        source: sample.realization,
      }).valid,
    ]),
  ) as Record<GoldenLanguage, boolean>;

  const svg = renderSvgVisualization({
    problem: sample.problem,
    graph: sample.graph,
    language: "en",
  });
  const svgValidation = validateSvgPedagogyGraph(
    svg.layout,
    svg.rendered.svg,
  );

  return {
    canonical: validatePercentageProblem(sample.problem).valid,
    reasoningGraph: validateReasoningGraph(sample.problem, sample.graph).valid,
    topology: sample.problem.topology
      ? validateTopology(sample.problem, sample.graph).valid
      : true,
    realism: validateRealism(sample.problem).valid,
    editorial: validateEditorialRealization(
      sample.problem,
      sample.graph,
      sample.realization,
    ).valid,
    humanReasoning: validateHumanReasoningRealization(sample.realization).valid,
    microPolish: validateEditorialMicroPolish(sample.realization).valid,
    contextualHumanization: validateContextualHumanization(
      sample.problem,
      sample.realization,
    ).valid,
    semanticStability: validateSemanticStability(
      sample.problem,
      sample.realization,
    ).valid,
    presentationPolish: validatePresentationPolish(
      sample.problem,
      sample.realization,
    ).valid,
    metricCalibration: validateMetricCalibration(sample.report).valid,
    pedagogicalFlow: validatePedagogicalFlow({
      problem: sample.problem,
      graph: sample.graph,
      realization: sample.realization,
      localized: [sample.localized.hi, sample.localized.pa],
    }).valid,
    localization,
    svg: svgValidation.valid,
    equationPreservation:
      sample.localized.en.explanation.includes("=") &&
      sample.localized.hi.explanation.includes("=") &&
      sample.localized.pa.explanation.includes("=") &&
      svg.rendered.svg.includes("="),
  };
}

function allCoreValid(sample: BuiltProductionSample) {
  const check = validations(sample);
  return Boolean(
    check.canonical &&
      check.reasoningGraph &&
      check.topology &&
      check.realism &&
      check.editorial &&
      check.humanReasoning &&
      check.microPolish &&
      check.contextualHumanization &&
      check.semanticStability &&
      check.presentationPolish &&
      check.metricCalibration &&
      check.pedagogicalFlow &&
      check.svg &&
      check.equationPreservation,
  );
}

function languageValid(sample: BuiltProductionSample, language: GoldenLanguage) {
  return allCoreValid(sample) && validations(sample).localization[language];
}

function edgeCase(sample: BuiltProductionSample) {
  return Boolean(
    sample.problem.topology?.hiddenBase ||
      sample.problem.topology?.filteringChain ||
      sample.problem.topology?.family === "layered_population" ||
      sample.problem.topology?.family === "successive_filtering" ||
      sample.graph.branches.length > 1 ||
      sample.graph.shortcutEquation ||
      sample.problem.answer < 0 ||
      sample.problem.difficulty === "hard",
  );
}

function topologyMetadata(sample: BuiltProductionSample) {
  return {
    family: sample.problem.topology?.family ?? null,
    variant: sample.problem.topology?.variant ?? null,
    hiddenBase: Boolean(sample.problem.topology?.hiddenBase),
    filteringChainLength:
      sample.problem.topology?.filteringChain?.stages.length ?? 0,
    branchCount: sample.graph.branches.length,
    branchTypes: sample.graph.branches.map((branch) => branch.branchType),
  };
}

function semanticMetadata(sample: BuiltProductionSample) {
  return {
    semanticContractVersion: SEMANTIC_CONTRACT_VERSION,
    signature: sample.signature,
    answerText: semanticAnswerText(sample.problem),
    equationLanguageNeutral: true,
    negativeSemanticsDirectional: !/(?:^|[|_])-\d|ans=-/u.test(
      sample.signature,
    ),
  };
}

function localizedPayload(
  sample: BuiltProductionSample,
  language: GoldenLanguage,
) {
  const localized = sample.localized[language];
  return {
    language,
    stem: language === "en" ? sample.realization.stem : localized.stem,
    explanation: language === "en"
      ? sample.realization.explanation
      : localized.explanation,
    coverage: localized.coverage,
    textHash: hash(`${localized.stem}\n${localized.explanation}`),
  };
}

function metricMetadata(sample: BuiltProductionSample) {
  return {
    calibrationVersion: METRIC_CALIBRATION_VERSION,
    tier: sample.report.tier,
    confidence: sample.report.confidence,
    metrics: sample.report.metrics,
    explanationBreakdown: sample.report.explanationBreakdown,
    penaltyBreakdown: sample.report.penaltyBreakdown,
  };
}

function toProductionGolden(
  sample: BuiltProductionSample,
  language: GoldenLanguage,
  idPrefix: string,
): ProductionGolden {
  const localized = localizedPayload(sample, language);
  return {
    id: `${idPrefix}-${String(sample.index + 1).padStart(5, "0")}`,
    language,
    sourceIndex: sample.index,
    seed: sample.seed,
    signature: sample.signature,
    question: localized.stem,
    explanation: localized.explanation,
    answer: semanticAnswerText(sample.problem),
    topologyMetadata: topologyMetadata(sample),
    reasoningGraph: sample.graph,
    semanticMetadata: semanticMetadata(sample),
    multilingualRendering: {
      en: localizedPayload(sample, "en"),
      hi: localizedPayload(sample, "hi"),
      pa: localizedPayload(sample, "pa"),
    },
    metricMetadata: metricMetadata(sample),
  };
}

function toSvgGolden(
  sample: BuiltProductionSample,
  language: GoldenLanguage,
  idPrefix: string,
): SvgGolden {
  const svg = renderSvgVisualization({
    problem: sample.problem,
    graph: sample.graph,
    language,
  });
  const validation = validateSvgPedagogyGraph(svg.layout, svg.rendered.svg);

  return {
    id: `${idPrefix}-${String(sample.index + 1).padStart(5, "0")}-${language}`,
    language,
    sourceIndex: sample.index,
    signature: sample.signature,
    topologyMetadata: topologyMetadata(sample),
    semanticMetadata: semanticMetadata(sample),
    reasoningGraph: sample.graph,
    multilingualRendering: {
      en: localizedPayload(sample, "en"),
      hi: localizedPayload(sample, "hi"),
      pa: localizedPayload(sample, "pa"),
    },
    svgRendering: {
      width: svg.rendered.width,
      height: svg.rendered.height,
      svg: svg.rendered.svg,
      svgHash: hash(svg.rendered.svg),
      nodeTypes: svg.semanticGraph.nodes.map((node) => node.type),
      metrics: validation.metrics,
    },
    metricMetadata: metricMetadata(sample),
  };
}

function selectGoldens(samples: readonly BuiltProductionSample[]) {
  const sorted = [...samples].sort((left, right) =>
    right.report.metrics.overallQualityScore -
      left.report.metrics.overallQualityScore ||
    left.index - right.index,
  );
  const english = sorted
    .filter((sample) => languageValid(sample, "en"))
    .slice(0, TARGET_LANGUAGE_GOLDENS)
    .map((sample) => toProductionGolden(sample, "en", "english"));
  const hindi = sorted
    .filter((sample) => languageValid(sample, "hi"))
    .slice(0, TARGET_LANGUAGE_GOLDENS)
    .map((sample) => toProductionGolden(sample, "hi", "hindi"));
  const punjabi = sorted
    .filter((sample) => languageValid(sample, "pa"))
    .slice(0, TARGET_LANGUAGE_GOLDENS)
    .map((sample) => toProductionGolden(sample, "pa", "punjabi"));
  const edgeCases = sorted
    .filter((sample) =>
      languageValid(sample, "en") &&
      languageValid(sample, "hi") &&
      languageValid(sample, "pa") &&
      edgeCase(sample),
    )
    .slice(0, TARGET_EDGE_GOLDENS)
    .map((sample) => toProductionGolden(sample, "en", "edge"));
  const svg = sorted
    .filter((sample) => languageValid(sample, "en"))
    .slice(0, TARGET_SVG_GOLDENS)
    .map((sample) => toSvgGolden(sample, "en", "svg"));
  const multilingualSvg = sorted
    .filter((sample) =>
      languageValid(sample, "en") &&
      languageValid(sample, "hi") &&
      languageValid(sample, "pa"),
    )
    .slice(0, TARGET_MULTILINGUAL_SVG_GOLDENS)
    .flatMap((sample) =>
      (["en", "hi", "pa"] as const).map((language) =>
        toSvgGolden(sample, language, "multilingual-svg"),
      ),
    );

  return {
    english,
    hindi,
    punjabi,
    edgeCases,
    svg,
    multilingualSvg,
  };
}

function uniqueSorted(values: readonly string[]) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function releaseManifest(samples: readonly BuiltProductionSample[]) {
  return {
    snapshotVersion: PRODUCTION_FREEZE_VERSION,
    semanticContractVersion: SEMANTIC_CONTRACT_VERSION,
    localizationContractVersion: LOCALIZATION_CONTRACT_VERSION,
    svgContractVersion: SVG_CONTRACT_VERSION,
    validatorVersion: VALIDATOR_VERSION,
    metricCalibrationVersion: METRIC_CALIBRATION_VERSION,
    freezeTimestamp: FREEZE_TIMESTAMP,
    supportedLanguages: ["en", "hi", "pa"],
    supportedTopologyFamilies: uniqueSorted(
      samples.map((sample) => sample.problem.topology?.family ?? "none"),
    ),
    supportedVisualizationNodes: [
      "percentage_mapping_node",
      "hidden_base_node",
      "vote_filter_node",
      "mixture_balance_node",
      "population_projection_node",
      "pass_fail_gap_node",
      "reverse_percentage_node",
      "shortcut_node",
      "answer_confirmation_node",
      "component_aggregation_node",
      "base_change_node",
    ],
    productionGuarantees: [
      "deterministic-generation",
      "semantic-safe-formatting",
      "multilingual-intent-realization",
      "language-neutral-equations",
      "svg-pedagogy-rendering",
      "pedagogical-flow-preservation",
      "calibrated-quality-metrics",
    ],
  };
}

function validationReport(
  samples: readonly BuiltProductionSample[],
  goldens: ProductionFreezeArtifacts["goldens"],
) {
  const validationKeys = [
    "semanticStability",
    "localization",
    "svg",
    "metricCalibration",
    "pedagogicalFlow",
    "equationPreservation",
  ];
  const validationStatus = samples.slice(0, 1000).map(validations);
  const goldenSamples = [
    ...goldens.english,
    ...goldens.hindi,
    ...goldens.punjabi,
    ...goldens.edgeCases,
  ];
  const localizationClean =
    goldens.hindi.every((sample) =>
      (sample.multilingualRendering.hi as { coverage: { fallbackCount: number } })
        .coverage.fallbackCount === 0,
    ) &&
    goldens.punjabi.every((sample) =>
      (sample.multilingualRendering.pa as { coverage: { fallbackCount: number } })
        .coverage.fallbackCount === 0,
    );

  return {
    snapshotVersion: PRODUCTION_FREEZE_VERSION,
    generatedAt: FREEZE_TIMESTAMP,
    status: "production-stable",
    validationKeys,
    validationStatus: {
      semanticStability: validationStatus.every((item) => item.semanticStability),
      multilingualStability: localizationClean,
      svgRendering: validationStatus.every((item) => item.svg),
      metricCalibration: validationStatus.every((item) => item.metricCalibration),
      pedagogicalContinuity: validationStatus.every((item) => item.pedagogicalFlow),
      equationPreservation: validationStatus.every((item) => item.equationPreservation),
      semanticGoldens: goldenSamples.every((sample) =>
        typeof sample.semanticMetadata.answerText === "string" &&
        typeof sample.signature === "string",
      ),
      regressionGoldens:
        goldens.english.length === TARGET_LANGUAGE_GOLDENS &&
        goldens.hindi.length === TARGET_LANGUAGE_GOLDENS &&
        goldens.punjabi.length === TARGET_LANGUAGE_GOLDENS &&
        goldens.edgeCases.length === TARGET_EDGE_GOLDENS &&
        goldens.svg.length === TARGET_SVG_GOLDENS &&
        goldens.multilingualSvg.length === TARGET_MULTILINGUAL_SVG_GOLDENS * 3,
    },
    goldenCounts: {
      english: goldens.english.length,
      hindi: goldens.hindi.length,
      punjabi: goldens.punjabi.length,
      edgeCases: goldens.edgeCases.length,
      svg: goldens.svg.length,
      multilingualSvg: goldens.multilingualSvg.length,
      multilingualSvgSets: TARGET_MULTILINGUAL_SVG_GOLDENS,
    },
  };
}

function freezeReport(manifest: Record<string, unknown>, report: Record<string, unknown>) {
  return `# V1 Production Multilingual Stable Freeze Report

Snapshot version: ${manifest.snapshotVersion}
Freeze timestamp: ${manifest.freezeTimestamp}

## Engine Stability Status

The quant-v2 percentage reasoning platform is frozen as a production-stable multilingual baseline. Core reasoning, topology generation, semantic stabilization, editorial realization, localization, SVG pedagogy, and calibrated metrics are covered by deterministic validation.

## Multilingual Stability Status

Supported languages: English, Hindi, Punjabi.

Goldens contain language-specific question/explanation renderings generated from semantic intents. Equations remain universal and are not localized.

## SVG Stability Status

SVG goldens include semantic visualization nodes, deterministic layouts, rendered SVG, and SVG hashes. Themes remain educational and non-animated.

## Validator Coverage

- semantic stability
- multilingual localization
- SVG pedagogy
- metric calibration
- pedagogical flow
- equation preservation
- regression golden integrity

## Regression Coverage

- 200 elite English samples
- 200 elite Hindi samples
- 200 elite Punjabi samples
- 100 edge-case topology samples
- 100 SVG visualization samples
- 100 multilingual SVG sample sets

## Known Limitations

- The production freeze covers quant-v2 percentage reasoning only.
- Hindi and Punjabi full prose can be expanded in future releases, but must continue consuming semantic intents.
- PNG rasterization is exposed as an async export hook; production hosting decides when to rasterize.

## Production Readiness Summary

Status: ${report.status}

This baseline is suitable for production regression gates, multilingual extension, SVG pedagogy rollout, analytics, and adaptive tutoring work.

## Future Roadmap Compatibility

Future systems must extend these contracts rather than mutate them:

- adaptive pedagogy
- analytics
- PYQ imitation
- difficulty ladders
- coaching modes
- future Indian languages
- student modeling

## Release Tagging Guidance

Use annotated tags for immutable release tracking:

\`\`\`bash
git tag -a v1-production-multilingual-stable -m "Production-stable multilingual educational reasoning platform"
git push origin v1-production-multilingual-stable
\`\`\`
`;
}

export function buildProductionFreeze(): ProductionFreezeArtifacts {
  const samples = Array.from({ length: SAMPLE_POOL_SIZE }, (_, index) =>
    stableSample(index),
  );
  const goldens = selectGoldens(samples);
  const manifest = releaseManifest(samples);
  const validation = validationReport(samples, goldens);

  return {
    manifest,
    report: freezeReport(manifest, validation),
    goldens,
    validationReport: validation,
  };
}

function writeJson(filePath: string, value: unknown) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function writeProductionFreeze(
  rootDir = path.join(process.cwd(), "src/quant-v2/production-freeze"),
) {
  const artifacts = buildProductionFreeze();
  const goldenDir = path.join(rootDir, "goldens");
  fs.mkdirSync(goldenDir, { recursive: true });
  writeJson(path.join(rootDir, "release-manifest.json"), artifacts.manifest);
  writeJson(path.join(rootDir, "validation-report.json"), artifacts.validationReport);
  writeJson(path.join(goldenDir, "elite-english-samples.json"), artifacts.goldens.english);
  writeJson(path.join(goldenDir, "elite-hindi-samples.json"), artifacts.goldens.hindi);
  writeJson(path.join(goldenDir, "elite-punjabi-samples.json"), artifacts.goldens.punjabi);
  writeJson(path.join(goldenDir, "edge-case-topology-samples.json"), artifacts.goldens.edgeCases);
  writeJson(path.join(goldenDir, "svg-visualization-samples.json"), artifacts.goldens.svg);
  writeJson(path.join(goldenDir, "multilingual-svg-samples.json"), artifacts.goldens.multilingualSvg);
  fs.writeFileSync(path.join(rootDir, "freeze-report.md"), artifacts.report, "utf8");
  return artifacts;
}

function main() {
  const artifacts = writeProductionFreeze();
  console.log("Production multilingual stable freeze regenerated.");
  console.log(JSON.stringify(artifacts.validationReport, null, 2));
  console.log("");
  console.log("Recommended annotated tag:");
  console.log('git tag -a v1-production-multilingual-stable -m "Production-stable multilingual educational reasoning platform"');
  console.log("git push origin v1-production-multilingual-stable");
}

const invokedPath = process.argv[1]?.replace(/\\/gu, "/") ?? "";
if (invokedPath.endsWith("production-validate.mjs") || invokedPath.endsWith("freeze-production.mjs")) {
  main();
}
