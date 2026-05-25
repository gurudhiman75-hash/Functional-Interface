import assert from "node:assert/strict";
import test from "node:test";
import {
  PERCENTAGE_MOTIF_FACTORY_LIST,
} from "../canonical/percentage-motif-factories";
import { semanticAnswerText } from "../editorial/contextual-humanization";
import { realizeEditorialProblem } from "../editorial/stem-realizer";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { createProblemSignature } from "../utils/problem-signature";
import { validatePercentageProblem } from "../validators/problem-validator";
import { validateReasoningGraph } from "../validators/reasoning-validator";
import { validateEditorialRealization } from "../validators/editorial-validator";
import { validateHumanReasoningRealization } from "../validators/human-reasoning-validator";
import { validateEditorialMicroPolish } from "../validators/editorial-micro-polish-validator";
import { validateContextualHumanization } from "../validators/contextual-humanization-validator";
import {
  createSemanticStabilityMetrics,
  validateSemanticStability,
} from "../validators/semantic-stability-validator";

const ABSOLUTE_PERCENT_LEAK_PATTERN =
  /(?:Population|population|votes|voters|marks|quantity|amount|price|salary)[^\n=]*=\n[^\n]+\n=\s*-?\d+(?:\.\d+)?%/u;
const SIGN_LEAK_PATTERN =
  /(?:required answer|answer|result|percentage|reduction|loss|decrease)\s*(?:is|=)\s*-\d/iu;
const OLD_ENDING_PATTERN = /Therefore, the required answer is/iu;

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function countSemanticAnswerOccurrences(text: string, answer: string) {
  if (!answer) {
    return 0;
  }

  const matches = text.match(
    new RegExp(
      `(?:^|[^0-9.])${escapeRegExp(answer)}(?=$|[^0-9.%])`,
      "gu",
    ),
  );
  return matches?.length ?? 0;
}

test("semantic stability keeps final realization safe for localization", () => {
  let shortcutSamples = 0;
  let semanticLossSamples = 0;
  let endingVariants = new Set<string>();
  let averageStability = 0;

  for (let index = 0; index < 2000; index += 1) {
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

    const stability = validateSemanticStability(problem, realization);
    assert.equal(
      stability.valid,
      true,
      `${label} semantic stability failed: ${stability.issues.join("; ")}`,
    );

    assert.ok(
      !ABSOLUTE_PERCENT_LEAK_PATTERN.test(realization.explanation),
      `${label} absolute value must not render as percentage`,
    );
    assert.ok(
      !SIGN_LEAK_PATTERN.test(realization.explanation),
      `${label} semantic sign leakage`,
    );
    assert.ok(
      !OLD_ENDING_PATTERN.test(realization.explanation),
      `${label} should use contextual ending`,
    );
    assert.ok(
      realization.explanation.includes(semanticAnswerText(problem)),
      `${label} should include semantic answer text`,
    );

    if (realization.naturalization.shortcutSurfaced) {
      shortcutSamples += 1;
      const answerCount = countSemanticAnswerOccurrences(
        realization.explanation,
        semanticAnswerText(problem),
      );
      assert.ok(
        answerCount <= 4,
        `${label} shortcut support should not duplicate the answer excessively`,
      );
    }
    if (problem.subtype === "profit_loss" && problem.answer < 0) {
      semanticLossSamples += 1;
      assert.match(
        realization.explanation,
        /\b\d+(?:\.\d+)?% loss\b/iu,
        `${label} loss must be semantic`,
      );
    }

    const finalLine = realization.explanation.split("\n").at(-1) ?? "";
    endingVariants.add(finalLine.split("=")[0]!.trim());
    averageStability += createSemanticStabilityMetrics(
      problem,
      realization,
    ).semanticStabilityScore;
  }

  assert.equal(
    shortcutSamples,
    0,
    "shortcuts should stay hidden unless explicitly enabled",
  );
  assert.ok(semanticLossSamples > 0, "semantic loss samples must be covered");
  assert.ok(endingVariants.size >= 6, "contextual ending variation must appear");
  assert.ok(
    averageStability / 2000 >= 95,
    "average semantic stability must stay high",
  );
});

export {};
