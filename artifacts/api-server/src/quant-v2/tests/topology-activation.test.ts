import assert from "node:assert/strict";
import test from "node:test";
import {
  PERCENTAGE_MOTIF_FACTORIES,
  type PercentageMotifFactory,
} from "../canonical/percentage-motif-factories";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { createProblemSignature } from "../utils/problem-signature";
import { validatePercentageProblem } from "../validators/problem-validator";
import { validateReasoningGraph } from "../validators/reasoning-validator";
import { validateTopology } from "../validators/topology-validator";
import {
  createTopologyDiversityMetrics,
  validateTopologyDiversity,
} from "../validators/topology-diversity-validator";

const ACTIVE_FACTORIES = [
  PERCENTAGE_MOTIF_FACTORIES.electionLead,
  PERCENTAGE_MOTIF_FACTORIES.passFail,
  PERCENTAGE_MOTIF_FACTORIES.populationGrowth,
] as const satisfies readonly PercentageMotifFactory[];

function graphShape(graph: ReturnType<typeof buildReasoningGraph>) {
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

test("topology activation drives mixed live generation", () => {
  const samples = [];
  const signatures = new Set<string>();
  const variants = new Set<string>();
  const hiddenBaseVariants = new Set<string>();
  const filteringVariants = new Set<string>();
  const branchShapes = new Set<string>();
  const distractorFingerprintsByVariant = new Map<string, Set<string>>();
  const graphShapesByVariant = new Map<string, Set<string>>();

  for (let index = 0; index < 500; index += 1) {
    const factory = ACTIVE_FACTORIES[index % ACTIVE_FACTORIES.length]!;
    const seed = Math.floor(index / ACTIVE_FACTORIES.length) + 1;
    const problem = factory(seed);
    const graph = buildReasoningGraph(problem);
    const label = `${problem.subtype} sample ${index + 1}`;

    assert.ok(problem.topology, `${label} must be topology activated`);

    const canonical = validatePercentageProblem(problem);
    assert.equal(
      canonical.valid,
      true,
      `${label} canonical validation failed: ${canonical.issues.join("; ")}`,
    );

    const reasoning = validateReasoningGraph(problem, graph);
    assert.equal(
      reasoning.valid,
      true,
      `${label} reasoning validation failed: ${reasoning.issues.join("; ")}`,
    );

    const topology = validateTopology(problem, graph);
    assert.equal(
      topology.valid,
      true,
      `${label} topology validation failed: ${topology.issues.join("; ")}`,
    );

    const signature = createProblemSignature(problem);
    assert.ok(
      signature.includes(
        `${problem.topology.family}|${problem.topology.variant}|`,
      ),
      `${label} signature must include topology family and variant`,
    );
    signatures.add(signature);
    variants.add(problem.topology.variant);

    if (problem.topology.hiddenBase) {
      hiddenBaseVariants.add(problem.topology.variant);
    }
    if (problem.topology.filteringChain) {
      filteringVariants.add(problem.topology.variant);
    }
    branchShapes.add(
      graph.branches.map((branch) => branch.branchType).sort().join("|"),
    );

    const distractorFingerprint = problem.distractors
      .map((value) => value.toFixed(2))
      .join("|");
    const variantDistractors =
      distractorFingerprintsByVariant.get(problem.topology.variant) ??
      new Set<string>();
    variantDistractors.add(distractorFingerprint);
    distractorFingerprintsByVariant.set(
      problem.topology.variant,
      variantDistractors,
    );

    const variantGraphShapes =
      graphShapesByVariant.get(problem.topology.variant) ??
      new Set<string>();
    variantGraphShapes.add(graphShape(graph));
    graphShapesByVariant.set(
      problem.topology.variant,
      variantGraphShapes,
    );

    samples.push({
      problem,
      graph,
    });
  }

  const diversity = validateTopologyDiversity(samples);
  const metrics = createTopologyDiversityMetrics(samples);

  assert.equal(
    diversity.valid,
    true,
    `topology diversity failed: ${diversity.issues.join("; ")}`,
  );
  assert.ok(variants.size >= 10, "mixed generation must expose many variants");
  assert.ok(
    hiddenBaseVariants.size >= 3,
    "hidden-base reasoning must appear across variants",
  );
  assert.ok(
    filteringVariants.size >= 4,
    "filtering chains must appear across variants",
  );
  assert.ok(
    branchShapes.size >= 3,
    "branch diversity must appear in live generation",
  );
  assert.ok(
    signatures.size >= 450,
    "topology signatures must vary across mixed samples",
  );
  assert.ok(
    Object.keys(metrics.structuralGraphSignatures).length >= variants.size,
    "reasoning graph structures must vary by topology",
  );

  for (const [variant, fingerprints] of distractorFingerprintsByVariant) {
    assert.ok(
      fingerprints.size > 1,
      `${variant} must produce topology-aware distractor variation`,
    );
  }

  for (const [variant, shapes] of graphShapesByVariant) {
    assert.ok(
      shapes.size >= 1,
      `${variant} must produce a reasoning graph shape`,
    );
  }
});

export {};
