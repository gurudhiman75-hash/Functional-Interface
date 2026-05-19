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
import { validateEditorialRealization } from "../validators/editorial-validator";
import { validateHumanReasoningRealization } from "../validators/human-reasoning-validator";
import { validateEditorialMicroPolish } from "../validators/editorial-micro-polish-validator";
import { validateContextualHumanization } from "../validators/contextual-humanization-validator";
import { validateSemanticStability } from "../validators/semantic-stability-validator";
import {
  createPresentationPolishMetrics,
  validatePresentationPolish,
  validatePresentationPolishBatch,
} from "../validators/presentation-polish-validator";

const NEGATIVE_SIGNATURE_PATTERN = /(?:^|[|_])-\d|ans=-/u;
const WEAK_LABEL_PATTERN =
  /^(?:Filtered total|Remaining share|Result|Required value)\s*=/mu;
const ROBOTIC_SHORTCUT_PATTERN =
  /\b(?:This directly gives|This gives|This means)\b/iu;

test("presentation refinement keeps output compact and multilingual-safe", () => {
  const realizations = [];
  const finalOpenings = new Set<string>();
  let genericScenarios = 0;
  let averageCompactness = 0;

  for (let index = 0; index < 3000; index += 1) {
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
    const label = `${problem.subtype} sample ${index + 1}`;

    assert.equal(validatePercentageProblem(problem).valid, true, `${label} canonical`);
    assert.equal(validateReasoningGraph(problem, graph).valid, true, `${label} reasoning`);
    assert.equal(
      validateEditorialRealization(problem, graph, realization).valid,
      true,
      `${label} editorial`,
    );
    assert.equal(
      validateHumanReasoningRealization(realization).valid,
      true,
      `${label} human reasoning`,
    );
    assert.equal(
      validateEditorialMicroPolish(realization).valid,
      true,
      `${label} micro polish`,
    );
    assert.equal(
      validateContextualHumanization(problem, realization).valid,
      true,
      `${label} contextual humanization`,
    );
    assert.equal(
      validateSemanticStability(problem, realization).valid,
      true,
      `${label} semantic stability`,
    );

    const polish = validatePresentationPolish(problem, realization);
    assert.equal(
      polish.valid,
      true,
      `${label} presentation polish failed: ${polish.issues.join("; ")}`,
    );

    assert.ok(!NEGATIVE_SIGNATURE_PATTERN.test(signature), `${label} negative signature leakage`);
    assert.ok(!WEAK_LABEL_PATTERN.test(realization.explanation), `${label} weak generic label`);
    assert.ok(!ROBOTIC_SHORTCUT_PATTERN.test(realization.explanation), `${label} robotic shortcut narration`);

    if (realization.scenario.family === "general_percentage") {
      genericScenarios += 1;
    }

    const finalLine = realization.explanation.split("\n").at(-1) ?? "";
    finalOpenings.add(finalLine.split(/[,\s=]/u)[0] ?? "");
    averageCompactness += createPresentationPolishMetrics(
      problem,
      realization,
    ).editorialCompactnessScore;
    realizations.push(realization);
  }

  const batch = validatePresentationPolishBatch(realizations);
  assert.equal(
    batch.valid,
    true,
    `presentation batch failed: ${batch.issues.join("; ")}`,
  );
  assert.ok(genericScenarios / 3000 <= 0.03, "generic scenarios must be rare");
  assert.ok(finalOpenings.size >= 5, "final transition diversity must be visible");
  assert.ok(
    averageCompactness / 3000 >= 95,
    "editorial compactness must stay high",
  );
});

export {};
