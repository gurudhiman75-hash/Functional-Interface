import assert from "node:assert/strict";
import test from "node:test";
import {
  PERCENTAGE_MOTIF_FACTORY_LIST,
} from "../canonical/percentage-motif-factories";
import { realizeEditorialProblem } from "../editorial/stem-realizer";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { createProblemSignature } from "../utils/problem-signature";
import { validatePercentageProblem } from "../validators/problem-validator";
import { validateReasoningGraph } from "../validators/reasoning-validator";
import { validateRealism } from "../validators/realism-validator";
import {
  validateEditorialBatch,
  validateEditorialRealization,
} from "../validators/editorial-validator";

const UNSAFE_MATH_PATTERN = /[<>\[\]`]/u;

function includesAnswerText(problem: { subtype: string; answer: number }, text: string) {
  if (text.includes(String(problem.answer))) {
    return true;
  }
  if (problem.answer < 0 && text.includes(String(Math.abs(problem.answer)))) {
    return true;
  }
  return problem.subtype === "profit_loss" &&
    problem.answer < 0 &&
    text.includes(`${Math.abs(problem.answer)}% loss`);
}

test("editorial realization stays natural and reasoning-aligned", () => {
  const realizations = [];
  const scenarios = new Set<string>();
  const styles = new Set<string>();
  const openings = new Set<string>();
  let graphAlignedCount = 0;

  for (let index = 0; index < 1000; index += 1) {
    const factory =
      PERCENTAGE_MOTIF_FACTORY_LIST[
        index % PERCENTAGE_MOTIF_FACTORY_LIST.length
      ]!;
    const seed =
      Math.floor(index / PERCENTAGE_MOTIF_FACTORY_LIST.length) + 1;
    const problem = factory(seed);
    const graph = buildReasoningGraph(problem);
    const realization = realizeEditorialProblem({
      problem,
      graph,
      seed: `${index}:${createProblemSignature(problem)}`,
    });
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

    const realism = validateRealism(problem);
    assert.equal(
      realism.valid,
      true,
      `${label} realism validation failed: ${realism.issues.join("; ")}`,
    );

    const editorial = validateEditorialRealization(
      problem,
      graph,
      realization,
    );
    assert.equal(
      editorial.valid,
      true,
      `${label} editorial validation failed: ${editorial.issues.join("; ")}`,
    );

    assert.ok(
      !UNSAFE_MATH_PATTERN.test(realization.explanation),
      `${label} explanation must remain MathJax-compatible`,
    );
    assert.ok(
      includesAnswerText(problem, realization.explanation),
      `${label} explanation must include canonical answer`,
    );
    assert.ok(
      realization.stem.length >= 80,
      `${label} stem should not feel mechanically short`,
    );

    scenarios.add(realization.scenario.family);
    styles.add(realization.style);
    openings.add(realization.stem.split(/[,.]/u)[0]!.trim());
    graphAlignedCount += graph.steps.some((step) => {
      const value = step.outputVariable
        ? problem.variables[step.outputVariable] ?? problem.answer
        : undefined;
      if (typeof value !== "number") {
        return false;
      }
      const rounded = Number.isInteger(value) ? value : Number(value.toFixed(2));
      return realization.explanation.includes(String(rounded)) ||
        realization.explanation.includes(String(Math.abs(rounded)));
    })
      ? 1
      : 0;
    realizations.push(realization);
  }

  const batch = validateEditorialBatch(realizations);
  assert.equal(
    batch.valid,
    true,
    `editorial batch validation failed: ${batch.issues.join("; ")}`,
  );
  assert.ok(scenarios.size >= 10, "scenario diversity must be visible");
  assert.ok(styles.size === 4, "all editorial styles must appear");
  assert.ok(openings.size >= 10, "openings must not collapse into one template");
  assert.ok(
    graphAlignedCount >= 990,
    "explanations must map to reasoning graph equations",
  );
});

export {};
