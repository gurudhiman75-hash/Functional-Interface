import assert from "node:assert/strict";
import test from "node:test";
import {
  PERCENTAGE_MOTIF_FACTORY_LIST,
} from "../canonical/percentage-motif-factories";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { validatePercentageProblem } from "../validators/problem-validator";
import { validateReasoningGraph } from "../validators/reasoning-validator";
import { validateTopology } from "../validators/topology-validator";
import {
  createRealismMetrics,
  validateRealism,
} from "../validators/realism-validator";

function decimalPlaces(value: number) {
  const text = String(value);
  const [, decimals = ""] = text.split(".");
  return decimals.length;
}

function assertNoUglyDecimals(
  values: readonly number[],
  label: string,
) {
  for (const value of values) {
    assert.ok(
      decimalPlaces(value) <= 2,
      `${label} has over-precise decimal value: ${value}`,
    );
  }
}

test("realism calibration preserves correctness across mixed generation", () => {
  let topologySamples = 0;
  let hiddenBaseSamples = 0;
  let filteringSamples = 0;
  let highCleanlinessSamples = 0;
  let highDistractorSamples = 0;
  let highScaleSamples = 0;

  for (let index = 0; index < 1000; index += 1) {
    const factory =
      PERCENTAGE_MOTIF_FACTORY_LIST[
        index % PERCENTAGE_MOTIF_FACTORY_LIST.length
      ]!;
    const seed =
      Math.floor(index / PERCENTAGE_MOTIF_FACTORY_LIST.length) + 1;
    const problem = factory(seed);
    const graph = buildReasoningGraph(problem);
    const label = `${problem.subtype} sample ${index + 1}`;

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

    if (problem.topology) {
      topologySamples += 1;
      if (problem.topology.hiddenBase) {
        hiddenBaseSamples += 1;
      }
      if (problem.topology.filteringChain) {
        filteringSamples += 1;
      }

      const topology = validateTopology(problem, graph);
      assert.equal(
        topology.valid,
        true,
        `${label} topology validation failed: ${topology.issues.join("; ")}`,
      );
    }

    const realism = validateRealism(problem);
    assert.equal(
      realism.valid,
      true,
      `${label} realism validation failed: ${realism.issues.join("; ")}`,
    );

    const metrics = createRealismMetrics(problem);
    highCleanlinessSamples += metrics.visualCleanliness >= 90 ? 1 : 0;
    highDistractorSamples += metrics.distractorRealism >= 90 ? 1 : 0;
    highScaleSamples += metrics.scaleRealism >= 90 ? 1 : 0;

    assertNoUglyDecimals(
      [
        problem.answer,
        ...problem.distractors,
        ...Object.values(problem.variables),
      ],
      label,
    );
  }

  assert.ok(
    topologySamples >= 250,
    "mixed realism run must include topology-activated samples",
  );
  assert.ok(
    hiddenBaseSamples > 0,
    "realism calibration must preserve hidden-base samples",
  );
  assert.ok(
    filteringSamples > 0,
    "realism calibration must preserve filtering chains",
  );
  assert.ok(
    highCleanlinessSamples >= 950,
    "visual cleanliness must stay high across mixed generation",
  );
  assert.ok(
    highDistractorSamples >= 950,
    "distractor realism must stay high across mixed generation",
  );
  assert.ok(
    highScaleSamples >= 950,
    "scale realism must stay high across mixed generation",
  );
});

export {};
