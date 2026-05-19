import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import type { TopologyVariant } from "../reasoning/topology-types";
import type { ValidationResult } from "./problem-validator";

export type TopologyDiversitySample = {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
};

export type TopologyDiversityMetrics = {
  sampleCount: number;
  topologySampleCount: number;
  topologyDistribution: Record<string, number>;
  maxConsecutiveTopologyReuse: number;
  filteringChainCount: number;
  filteringChainVariants: Record<string, number>;
  hiddenBaseCount: number;
  branchCountDistribution: Record<string, number>;
  branchTypeDistribution: Record<string, number>;
  structuralGraphSignatures: Record<string, number>;
};

function increment(
  record: Record<string, number>,
  key: string,
  amount = 1,
) {
  record[key] = (record[key] ?? 0) + amount;
}

function graphStructureSignature(graph: ReasoningGraph) {
  return [
    graph.subtype,
    graph.reasoningPattern,
    graph.steps.map((step) => `${step.type}:${step.outputVariable ?? "_"}`).join(">"),
    graph.branches
      .map((branch) =>
        `${branch.branchType}:${branch.steps.map((step) => step.type).join(">")}`,
      )
      .sort()
      .join("|"),
  ].join("::");
}

export function createTopologyDiversityMetrics(
  samples: readonly TopologyDiversitySample[],
): TopologyDiversityMetrics {
  const metrics: TopologyDiversityMetrics = {
    sampleCount: samples.length,
    topologySampleCount: 0,
    topologyDistribution: {},
    maxConsecutiveTopologyReuse: 0,
    filteringChainCount: 0,
    filteringChainVariants: {},
    hiddenBaseCount: 0,
    branchCountDistribution: {},
    branchTypeDistribution: {},
    structuralGraphSignatures: {},
  };
  let previousVariant: TopologyVariant | undefined;
  let currentRun = 0;

  for (const sample of samples) {
    const topology = sample.problem.topology;
    if (!topology) {
      continue;
    }

    metrics.topologySampleCount += 1;
    increment(metrics.topologyDistribution, topology.variant);
    increment(
      metrics.branchCountDistribution,
      String(sample.graph.branches.length),
    );
    increment(
      metrics.structuralGraphSignatures,
      graphStructureSignature(sample.graph),
    );

    if (topology.filteringChain) {
      metrics.filteringChainCount += 1;
      increment(
        metrics.filteringChainVariants,
        topology.filteringChain.stages
          .map((stage) => `${stage.inputVariable}->${stage.outputVariable}`)
          .join("|"),
      );
    }

    if (topology.hiddenBase) {
      metrics.hiddenBaseCount += 1;
    }

    for (const branch of sample.graph.branches) {
      increment(metrics.branchTypeDistribution, branch.branchType);
    }

    if (topology.variant === previousVariant) {
      currentRun += 1;
    } else {
      currentRun = 1;
      previousVariant = topology.variant;
    }
    metrics.maxConsecutiveTopologyReuse = Math.max(
      metrics.maxConsecutiveTopologyReuse,
      currentRun,
    );
  }

  return metrics;
}

export function validateTopologyDiversity(
  samples: readonly TopologyDiversitySample[],
): ValidationResult {
  const metrics = createTopologyDiversityMetrics(samples);
  const issues: string[] = [];
  const variantCount = Object.keys(metrics.topologyDistribution).length;
  const graphShapeCount = Object.keys(metrics.structuralGraphSignatures).length;
  const filteringShapeCount = Object.keys(metrics.filteringChainVariants).length;
  const branchTypeCount = Object.keys(metrics.branchTypeDistribution).length;

  if (metrics.topologySampleCount < Math.min(100, samples.length)) {
    issues.push("Topology activation is too sparse in the generated sample.");
  }
  if (variantCount < 6) {
    issues.push(
      `Expected at least 6 topology variants, received ${variantCount}.`,
    );
  }
  if (metrics.maxConsecutiveTopologyReuse > 2) {
    issues.push(
      `Topology reuse is too repetitive: max run ${metrics.maxConsecutiveTopologyReuse}.`,
    );
  }
  if (metrics.filteringChainCount === 0 || filteringShapeCount < 3) {
    issues.push("Filtering-chain diversity is missing or too narrow.");
  }
  if (metrics.hiddenBaseCount === 0) {
    issues.push("Hidden-base reasoning did not appear.");
  }
  if (branchTypeCount < 3) {
    issues.push(
      `Expected at least 3 branch types, received ${branchTypeCount}.`,
    );
  }
  if (graphShapeCount < variantCount) {
    issues.push("Reasoning graph structures do not vary with topology.");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
