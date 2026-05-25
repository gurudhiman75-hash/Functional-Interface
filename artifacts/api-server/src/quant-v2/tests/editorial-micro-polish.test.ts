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
import { validateEditorialRealization } from "../validators/editorial-validator";
import { validateHumanReasoningRealization } from "../validators/human-reasoning-validator";
import {
  createEditorialMicroPolishMetrics,
  validateEditorialMicroPolish,
} from "../validators/editorial-micro-polish-validator";

const TRANSITION_COLLISION_PATTERN =
  /\b(?:So|Hence|Therefore|Thus|Now),\s+(?:so|hence|therefore|thus|now)\b/iu;
const AWKWARD_PATTERN =
  /\b(?:The required base is|The unchanged part is|The given value represents this share|For a fuel item|For a measured quantity|For a product)\b/iu;
const NEGATIVE_PERCENT_PATTERN =
  /(?:Loss percentage|Required reduction)\s*=\s*[\s\S]*?=\s*-\d|required answer is -\d/iu;
const BARE_SHORTCUT_PATTERN = /Shortcut:\n\s*\d+(?:\.\d+)?%\s*=\s*\d/iu;

test("editorial micro polish removes final English rough edges", () => {
  let averagePolish = 0;
  let shortcutSamples = 0;
  let lossSamples = 0;

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

    assert.equal(validatePercentageProblem(problem).valid, true, `${label} canonical`);
    assert.equal(validateReasoningGraph(problem, graph).valid, true, `${label} reasoning`);
    assert.equal(validateRealism(problem).valid, true, `${label} realism`);
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

    const polish = validateEditorialMicroPolish(realization);
    assert.equal(
      polish.valid,
      true,
      `${label} micro polish failed: ${polish.issues.join("; ")}`,
    );

    const text = `${realization.stem}\n${realization.explanation}`;
    assert.ok(!TRANSITION_COLLISION_PATTERN.test(text), `${label} transition collision`);
    assert.ok(!AWKWARD_PATTERN.test(text), `${label} awkward editorial phrase`);
    assert.ok(!NEGATIVE_PERCENT_PATTERN.test(realization.explanation), `${label} negative sign leakage`);
    assert.ok(!BARE_SHORTCUT_PATTERN.test(realization.explanation), `${label} bare shortcut`);

    if (realization.naturalization.shortcutSurfaced) {
      shortcutSamples += 1;
      assert.match(
        realization.explanation,
        /(?:\d+(?:\.\d+)?%\s+\w+\s*=|100%\s+\w+\s*=|Required (?:increase|reduction)\s*=|Reduction in consumption\s*=|(?:Profit|Loss) percentage\s*=|Maximum marks\s*=|Total (?:value|votes|quantity)\s*=)/u,
        `${label} shortcut should name the quantity`,
      );
    }
    if (problem.subtype === "profit_loss" && problem.answer < 0) {
      lossSamples += 1;
      assert.match(
        realization.explanation,
        /loss/iu,
        `${label} should realize negative percentage as loss`,
      );
    }

    averagePolish += createEditorialMicroPolishMetrics(realization)
      .editorialPolishScore;
  }

  assert.equal(
    shortcutSamples,
    0,
    "shortcuts should stay hidden unless explicitly enabled",
  );
  assert.ok(lossSamples > 0, "loss samples must be covered");
  assert.ok(averagePolish / 1000 >= 95, "average micro polish must stay high");
});

export {};
