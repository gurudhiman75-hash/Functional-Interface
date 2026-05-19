import assert from "node:assert/strict";
import test from "node:test";
import { validatePercentageProblem } from "../validators/problem-validator";
import { validateReasoningGraph } from "../validators/reasoning-validator";
import { validateTopology } from "../validators/topology-validator";
import {
  buildTopologyVariant,
} from "../reasoning/topology-builders";
import {
  ELECTION_TOPOLOGIES,
  PASS_FAIL_TOPOLOGIES,
  POPULATION_TOPOLOGIES,
} from "../reasoning/topology-registry";
import type {
  TopologyVariant,
} from "../reasoning/topology-types";
import { createProblemSignature } from "../utils/problem-signature";

const ALL_TOPOLOGIES: readonly TopologyVariant[] = [
  ...ELECTION_TOPOLOGIES,
  ...PASS_FAIL_TOPOLOGIES,
  ...POPULATION_TOPOLOGIES,
];

const FILTERING_TOPOLOGIES = new Set<TopologyVariant>([
  "invalid_vote_margin",
  "turnout_margin",
  "filtered_valid_vote_margin",
  "remaining_marks_required",
]);

const HIDDEN_BASE_TOPOLOGIES = new Set<TopologyVariant>([
  "invalid_vote_margin",
  "turnout_margin",
  "remaining_marks_required",
]);

function stableJson(value: unknown) {
  return JSON.stringify(value);
}

function closeEnough(left: number, right: number) {
  return Math.abs(left - right) <= 0.01;
}

test("topology variants generate deterministic structural diversity", () => {
  const globalSignatures = new Set<string>();

  for (const variant of ALL_TOPOLOGIES) {
    const variantSignatures = new Set<string>();

    for (let seed = 1; seed <= 100; seed += 1) {
      const { problem, graph } = buildTopologyVariant(variant, seed);
      const repeated = buildTopologyVariant(variant, seed);
      const label = `${variant} seed ${seed}`;

      assert.equal(
        stableJson({ problem, graph }),
        stableJson(repeated),
        `${label} must be deterministic`,
      );

      assert.equal(
        problem.topology?.variant,
        variant,
        `${label} must carry topology variant metadata`,
      );
      assert.ok(
        problem.topology?.family,
        `${label} must carry topology family metadata`,
      );
      assert.ok(
        graph.branches.length >= 1,
        `${label} must include reasoning branches`,
      );

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
        signature.includes(`${problem.topology?.family}|${variant}|`),
        `${label} signature must include topology family and variant`,
      );
      assert.ok(
        !variantSignatures.has(signature),
        `${label} repeated topology signature`,
      );
      variantSignatures.add(signature);
      globalSignatures.add(signature);

      if (FILTERING_TOPOLOGIES.has(variant)) {
        assert.ok(
          problem.topology?.filteringChain,
          `${label} must include a filtering chain`,
        );
        assert.ok(
          problem.topology.filteringChain.stages.length >= 1,
          `${label} filtering chain must have stages`,
        );
      }

      if (HIDDEN_BASE_TOPOLOGIES.has(variant)) {
        assert.ok(
          problem.topology?.hiddenBase,
          `${label} must include hidden-base metadata`,
        );
      }

      const misconceptionValues =
        problem.topology?.misconceptionDistractors.map(
          (item) => item.value,
        ) ?? [];
      const groundedDistractors = problem.distractors.filter(
        (distractor) =>
          misconceptionValues.some((value) =>
            closeEnough(value, distractor),
          ),
      );
      assert.ok(
        groundedDistractors.length >= 2,
        `${label} must ground distractors in misconception traversal`,
      );

      for (const branch of graph.branches) {
        const final = branch.steps.at(-1);
        assert.equal(
          final?.type,
          "final_answer",
          `${label} branch ${branch.branchId} must end in final_answer`,
        );
        assert.ok(
          final.inputVariables.includes("answer"),
          `${label} branch ${branch.branchId} final step must consume answer`,
        );
      }
    }

    assert.equal(
      variantSignatures.size,
      100,
      `${variant} must generate 100 unique topology signatures`,
    );
  }

  assert.equal(
    globalSignatures.size,
    ALL_TOPOLOGIES.length * 100,
    "topology signatures must not collide across variants",
  );
});

export {};
