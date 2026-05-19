import fs from "node:fs";
import path from "node:path";
import {
  PERCENTAGE_MOTIF_FACTORY_LIST,
} from "../canonical/percentage-motif-factories";
import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import { semanticAnswerText } from "../editorial/contextual-humanization";
import type { EditorialRealization } from "../editorial/editorial-types";
import { realizeEditorialProblem } from "../editorial/stem-realizer";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { createProblemSignature } from "../utils/problem-signature";
import { roundClean } from "../utils/math-utils";
import { validateContextualHumanization } from "../validators/contextual-humanization-validator";
import { validateEditorialMicroPolish } from "../validators/editorial-micro-polish-validator";
import { validateEditorialRealization } from "../validators/editorial-validator";
import { validateHumanReasoningRealization } from "../validators/human-reasoning-validator";
import {
  createCalibratedQualityReport,
  validateMetricCalibration,
} from "../validators/metric-calibration-validator";
import { validatePercentageProblem } from "../validators/problem-validator";
import { validatePresentationPolish } from "../validators/presentation-polish-validator";
import { validateReasoningGraph } from "../validators/reasoning-validator";
import { validateRealism } from "../validators/realism-validator";
import { validateSemanticStability } from "../validators/semantic-stability-validator";
import { validateTopology } from "../validators/topology-validator";

export const STABILITY_VERSION = "v1-english-core-stable";
export const SEMANTIC_CONTRACT_VERSION = "semantic-values.v1";
export const REALIZATION_CONTRACT_VERSION = "english-realization.v1";
const SNAPSHOT_DATE = "2026-05-18";
const SAMPLE_POOL_SIZE = 2400;

type ReferenceBand = "elite" | "average" | "edge";

interface ReferenceSample {
  id: string;
  band: ReferenceBand;
  sourceIndex: number;
  seed: number;
  subtype: string;
  category: string;
  difficulty: string;
  signature: string;
  stem: string;
  explanation: string;
  answer: string;
  distractors: number[];
  topology: {
    family: string | null;
    variant: string | null;
    hiddenBase: boolean;
    filteringChainLength: number;
    branchCount: number;
    branchTypes: string[];
  };
  metrics: ReturnType<typeof createCalibratedQualityReport>["metrics"];
  quality: {
    tier: string;
    confidence: string;
    explanationBreakdown: string[];
    penaltyBreakdown: string[];
    realismWeighting: string[];
    repetitionPenalties: string[];
  };
  semantic: {
    answerText: string;
    semanticContractVersion: string;
    signatureSafe: boolean;
    formattingGuarantees: string[];
  };
}

interface BuiltSample {
  index: number;
  seed: number;
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  realization: EditorialRealization;
  report: ReturnType<typeof createCalibratedQualityReport>;
  signature: string;
}

interface SnapshotArtifacts {
  manifest: Record<string, unknown>;
  freezeReport: string;
  referenceSamples: Record<ReferenceBand, ReferenceSample[]>;
  summary: {
    sampleCounts: Record<ReferenceBand, number>;
    overallScore: {
      min: number;
      max: number;
      average: number;
    };
    topologyFamilies: string[];
    topologyVariants: string[];
    validators: Record<string, boolean>;
  };
}

function stableNumber(value: number) {
  const rounded = roundClean(value, 2);
  return Number.isInteger(rounded)
    ? rounded
    : Number(rounded.toFixed(2));
}

function average(values: readonly number[]) {
  return stableNumber(
    values.reduce((sum, value) => sum + value, 0) /
      Math.max(1, values.length),
  );
}

function uniqueSorted(values: readonly string[]) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function buildSample(index: number): BuiltSample {
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
    seed: `${index}:${signature}`,
  });
  const report = createCalibratedQualityReport(problem, graph, realization);

  return {
    index,
    seed,
    problem,
    graph,
    realization,
    report,
    signature,
  };
}

function validateSample(sample: BuiltSample) {
  const validators = {
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
  };

  return validators;
}

function allValidatorsPass(sample: BuiltSample) {
  return Object.values(validateSample(sample)).every(Boolean);
}

function isEdgeCase(sample: BuiltSample) {
  return Boolean(
    sample.problem.topology?.hiddenBase ||
      sample.problem.topology?.filteringChain ||
      sample.graph.shortcutEquation ||
      sample.problem.answer < 0 ||
      sample.problem.difficulty === "hard" ||
      sample.problem.topology?.family === "layered_population" ||
      sample.problem.topology?.family === "successive_filtering",
  );
}

function toReferenceSample(
  sample: BuiltSample,
  band: ReferenceBand,
): ReferenceSample {
  return {
    id: `${band}-${String(sample.index + 1).padStart(4, "0")}`,
    band,
    sourceIndex: sample.index,
    seed: sample.seed,
    subtype: sample.problem.subtype,
    category: sample.problem.category,
    difficulty: sample.problem.difficulty,
    signature: sample.signature,
    stem: sample.realization.stem,
    explanation: sample.realization.explanation,
    answer: semanticAnswerText(sample.problem),
    distractors: sample.problem.distractors.map(stableNumber),
    topology: {
      family: sample.problem.topology?.family ?? null,
      variant: sample.problem.topology?.variant ?? null,
      hiddenBase: Boolean(sample.problem.topology?.hiddenBase),
      filteringChainLength:
        sample.problem.topology?.filteringChain?.stages.length ?? 0,
      branchCount: sample.graph.branches.length,
      branchTypes: sample.graph.branches.map((branch) => branch.branchType),
    },
    metrics: sample.report.metrics,
    quality: {
      tier: sample.report.tier,
      confidence: sample.report.confidence,
      explanationBreakdown: sample.report.explanationBreakdown,
      penaltyBreakdown: sample.report.penaltyBreakdown,
      realismWeighting: sample.report.realismWeighting,
      repetitionPenalties: sample.report.repetitionPenalties,
    },
    semantic: {
      answerText: semanticAnswerText(sample.problem),
      semanticContractVersion: SEMANTIC_CONTRACT_VERSION,
      signatureSafe: !/(?:^|[|_])-\d|ans=-/u.test(sample.signature),
      formattingGuarantees: [
        "absolute-values-never-render-percent",
        "negative-semantics-render-as-direction",
        "equations-remain-language-neutral",
      ],
    },
  };
}

function selectReferences(samples: readonly BuiltSample[]) {
  const validSamples = samples.filter(allValidatorsPass);
  const elite = [...validSamples]
    .sort((left, right) =>
      right.report.metrics.overallQualityScore -
        left.report.metrics.overallQualityScore ||
      left.index - right.index,
    )
    .slice(0, 100);
  const eliteSignatures = new Set(elite.map((sample) => sample.signature));
  const targetAverage = 86;
  const averageBand = validSamples
    .filter((sample) => !eliteSignatures.has(sample.signature))
    .sort((left, right) =>
      Math.abs(left.report.metrics.overallQualityScore - targetAverage) -
        Math.abs(right.report.metrics.overallQualityScore - targetAverage) ||
      left.index - right.index,
    )
    .slice(0, 100);
  const used = new Set([
    ...elite.map((sample) => sample.signature),
    ...averageBand.map((sample) => sample.signature),
  ]);
  const edge = validSamples
    .filter((sample) => !used.has(sample.signature) && isEdgeCase(sample))
    .sort((left, right) =>
      left.report.metrics.semanticSafetyScore -
        right.report.metrics.semanticSafetyScore ||
      right.graph.steps.length - left.graph.steps.length ||
      left.index - right.index,
    )
    .slice(0, 50);

  return {
    elite: elite.map((sample) => toReferenceSample(sample, "elite")),
    average: averageBand.map((sample) => toReferenceSample(sample, "average")),
    edge: edge.map((sample) => toReferenceSample(sample, "edge")),
  };
}

function validatorCoverage(samples: readonly BuiltSample[]) {
  return samples.reduce<Record<string, boolean>>((coverage, sample) => {
    const validators = validateSample(sample);
    for (const [key, valid] of Object.entries(validators)) {
      coverage[key] = (coverage[key] ?? true) && valid;
    }
    return coverage;
  }, {});
}

function buildManifest(
  samples: readonly BuiltSample[],
  references: Record<ReferenceBand, ReferenceSample[]>,
) {
  const scores = samples.map((sample) => sample.report.metrics.overallQualityScore);
  const topologyFamilies = uniqueSorted(
    samples
      .map((sample) => sample.problem.topology?.family ?? "none"),
  );
  const topologyVariants = uniqueSorted(
    samples
      .map((sample) => sample.problem.topology?.variant ?? "none"),
  );
  const validatorCoverageSummary = validatorCoverage(samples);

  return {
    snapshotVersion: STABILITY_VERSION,
    snapshotDate: SNAPSHOT_DATE,
    semanticContractVersion: SEMANTIC_CONTRACT_VERSION,
    realizationContractVersion: REALIZATION_CONTRACT_VERSION,
    referenceSampleCounts: {
      elite: references.elite.length,
      average: references.average.length,
      edge: references.edge.length,
      total:
        references.elite.length +
        references.average.length +
        references.edge.length,
    },
    topologyCoverage: {
      families: topologyFamilies,
      variants: topologyVariants,
    },
    validatorCoverage: validatorCoverageSummary,
    metricBaselineSummary: {
      overallQualityScore: {
        min: Math.min(...scores),
        max: Math.max(...scores),
        average: average(scores),
      },
      healthyRanges: {
        editorialRealismScore: "82-98",
        semanticSafetyScore: "95-100",
        repetitionResistanceScore: "84-95",
        overallQualityScore: "72-96",
      },
    },
    runtimeGuarantees: [
      "deterministic-generation",
      "semantic-safe-formatting",
      "language-neutral-equations",
      "topology-signature-stability",
      "validator-gated-reference-exports",
    ],
  };
}

function buildFreezeReport(
  manifest: Record<string, unknown>,
  references: Record<ReferenceBand, ReferenceSample[]>,
) {
  const counts = manifest.referenceSampleCounts as Record<string, number>;
  const metrics = manifest.metricBaselineSummary as {
    overallQualityScore: { min: number; max: number; average: number };
  };

  return `# V1 English Core Freeze Report

Snapshot version: ${STABILITY_VERSION}
Snapshot date: ${SNAPSHOT_DATE}

## Stability Status

The English percentage reasoning core is frozen as the V1 baseline. Reference exports were regenerated deterministically and passed semantic, editorial, topology, presentation, and metric-calibration gates.

## Reference Exports

- Elite samples: ${references.elite.length}
- Average samples: ${references.average.length}
- Edge-case samples: ${references.edge.length}
- Total samples: ${counts.total}

## Validator Status

All reference samples pass:

- canonical problem validation
- reasoning graph validation
- topology validation where topology metadata exists
- realism validation
- editorial realization validation
- human reasoning validation
- micro polish validation
- contextual humanization validation
- semantic stability validation
- presentation polish validation
- metric calibration validation

## Metric Calibration Status

- overallQualityScore min: ${metrics.overallQualityScore.min}
- overallQualityScore max: ${metrics.overallQualityScore.max}
- overallQualityScore average: ${metrics.overallQualityScore.average}

Scores are deterministic, explainable, and non-random. They are intended for QA ranking and regression detection, not for changing generation behavior.

## Multilingual Readiness

The V1 English core is ready for multilingual realization layers. Future Hindi/Punjabi implementations must consume semantic intents and preserve language-neutral equations rather than translating English strings directly.

## Known Limitations

- Reference samples freeze English realization behavior, not future localized prose.
- Metric ranges are calibrated for percentage reasoning only.
- Generated reference files are deterministic, but should be regenerated only through \`pnpm stability:freeze\`.

## Future Compatibility

This baseline supports multilingual realization, SVG pedagogy, adaptive learning, analytics, teacher review workflows, and future metric calibration without rewriting the reasoning core.

## Git Tag Recommendation

After review, create one of the following tags manually:

\`\`\`bash
git tag v1-english-core-stable
git tag pre-multilingual-stable
\`\`\`
`;
}

export function buildStabilitySnapshot(): SnapshotArtifacts {
  const samples = Array.from(
    { length: SAMPLE_POOL_SIZE },
    (_, index) => buildSample(index),
  );
  const referenceSamples = selectReferences(samples);
  const referenceSignatures = new Set(
    [
      ...referenceSamples.elite,
      ...referenceSamples.average,
      ...referenceSamples.edge,
    ].map((sample) => sample.signature),
  );
  const referenceBuiltSamples = samples.filter((sample) =>
    referenceSignatures.has(sample.signature),
  );
  const manifest = buildManifest(referenceBuiltSamples, referenceSamples);
  const scores = referenceBuiltSamples.map((sample) => sample.report.metrics.overallQualityScore);

  return {
    manifest,
    freezeReport: buildFreezeReport(manifest, referenceSamples),
    referenceSamples,
    summary: {
      sampleCounts: {
        elite: referenceSamples.elite.length,
        average: referenceSamples.average.length,
        edge: referenceSamples.edge.length,
      },
      overallScore: {
        min: Math.min(...scores),
        max: Math.max(...scores),
        average: average(scores),
      },
      topologyFamilies:
        (manifest.topologyCoverage as { families: string[] }).families,
      topologyVariants:
        (manifest.topologyCoverage as { variants: string[] }).variants,
      validators: manifest.validatorCoverage as Record<string, boolean>,
    },
  };
}

function writeJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function writeStabilitySnapshot(
  rootDir = path.join(process.cwd(), "src/quant-v2/stability"),
) {
  const snapshot = buildStabilitySnapshot();
  const sampleDir = path.join(rootDir, "reference-samples");

  fs.mkdirSync(sampleDir, { recursive: true });
  writeJson(path.join(rootDir, "stability-manifest.json"), snapshot.manifest);
  writeJson(path.join(sampleDir, "elite-samples.json"), snapshot.referenceSamples.elite);
  writeJson(path.join(sampleDir, "average-samples.json"), snapshot.referenceSamples.average);
  writeJson(path.join(sampleDir, "edge-case-samples.json"), snapshot.referenceSamples.edge);
  fs.writeFileSync(
    path.join(rootDir, "freeze-report.md"),
    snapshot.freezeReport,
    "utf8",
  );

  return snapshot;
}

function main() {
  const snapshot = writeStabilitySnapshot();
  const counts = snapshot.summary.sampleCounts;

  console.log("V1 English core stability snapshot regenerated.");
  console.log(`elite samples: ${counts.elite}`);
  console.log(`average samples: ${counts.average}`);
  console.log(`edge-case samples: ${counts.edge}`);
  console.log(`overall score range: ${snapshot.summary.overallScore.min}-${snapshot.summary.overallScore.max}`);
  console.log("");
  console.log("Manual tag recommendation:");
  console.log("  git tag v1-english-core-stable");
  console.log("  git tag pre-multilingual-stable");
}

const invokedPath = process.argv[1]?.replace(/\\/gu, "/") ?? "";
if (
  invokedPath.endsWith("stability-freeze.mjs") ||
  invokedPath.endsWith("freeze-english-core.mjs")
) {
  main();
}
