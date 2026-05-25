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
import {
  createHumanReasoningMetrics,
  validateHumanReasoningRealization,
} from "../validators/human-reasoning-validator";

const UNSAFE_MATH_PATTERN = /[<>\[\]`]/u;
const INTERNAL_NAME_PATTERN =
  /\b(?:gapPercent|remainingPercent|consumptionIndex|firstMultiplier|secondMultiplier|growthMultiplier|afterFirst|finalValue|totalVotes|validVotes|totalMarks|projectedPopulation|salaryDifference|revisionPercent|priceDifference|profitLossPercent|fixedComponent|finalMixtureTotal|addedQuantity)\b/u;

function includesAnswerText(problem: { subtype: string; answer: number }, text: string) {
  const answerStr = String(Number.isInteger(problem.answer) ? problem.answer : Number(problem.answer.toFixed(2)));
  const absAnswerStr = String(Math.abs(Number.isInteger(problem.answer) ? problem.answer : Number(problem.answer.toFixed(2))));
  
  if (text.includes(answerStr) || text.includes(absAnswerStr)) {
    return true;
  }
  return problem.subtype === "profit_loss" &&
    problem.answer < 0 &&
    text.includes(`${Math.abs(problem.answer)}% loss`);
}

test("human reasoning realization hides solver semantics", () => {
  const scores = {
    humanization: 0,
    leakage: 0,
    readability: 0,
    teacher: 0,
  };
  let shortcutCount = 0;

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

    assert.equal(
      validatePercentageProblem(problem).valid,
      true,
      `${label} canonical validation failed`,
    );
    assert.equal(
      validateReasoningGraph(problem, graph).valid,
      true,
      `${label} reasoning validation failed`,
    );
    assert.equal(
      validateRealism(problem).valid,
      true,
      `${label} realism validation failed`,
    );
    assert.equal(
      validateEditorialRealization(problem, graph, realization).valid,
      true,
      `${label} editorial validation failed`,
    );

    const human = validateHumanReasoningRealization(realization);
    assert.equal(
      human.valid,
      true,
      `${label} human reasoning validation failed: ${human.issues.join("; ")}`,
    );
    assert.ok(
      !UNSAFE_MATH_PATTERN.test(realization.explanation),
      `${label} explanation must remain MathJax-compatible`,
    );
    assert.ok(
      !INTERNAL_NAME_PATTERN.test(realization.explanation),
      `${label} explanation must not expose internal variable names`,
    );
    assert.ok(
      !realization.explanation.includes("*"),
      `${label} explanation must use human multiplication symbols`,
    );
    assert.ok(
      includesAnswerText(problem, realization.explanation),
      `${label} explanation must include canonical answer`,
    );
    assert.ok(
      /[=×/%+\-^]/u.test(realization.explanation),
      `${label} explanation must show visible arithmetic`,
    );
    if (realization.naturalization.shortcutSurfaced) {
      shortcutCount += 1;
      assert.match(
        realization.explanation,
        /\d+(?:\.\d+)?%\s*(?:\w+\s*)?=\s*\d|\d+(?:\.\d+)?%\s+of\s+\d|(?:Required (?:value|increase|reduction)|Reduction in consumption|(?:Profit|Loss) percentage|Maximum marks|Total (?:value|votes|quantity))\s*=/u,
        `${label} shortcut must read like a coaching relation`,
      );
    }

    const metrics = createHumanReasoningMetrics(realization);
    scores.humanization += metrics.humanizationScore;
    scores.leakage += metrics.solverLeakageScore;
    scores.readability += metrics.equationReadabilityScore;
    scores.teacher += metrics.teacherStyleRealismScore;
  }

  assert.equal(
    shortcutCount,
    0,
    "shortcuts should stay hidden unless explicitly enabled",
  );
  assert.ok(scores.humanization / 1000 >= 90, "average humanization must stay high");
  assert.ok(scores.leakage / 1000 >= 95, "solver leakage must stay very low");
  assert.ok(scores.readability / 1000 >= 90, "equation readability must stay high");
  assert.ok(scores.teacher / 1000 >= 90, "teacher-style realism must stay high");
});

export {};
