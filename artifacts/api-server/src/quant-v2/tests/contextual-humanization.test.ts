import assert from "node:assert/strict";
import test from "node:test";
import {
  PERCENTAGE_MOTIF_FACTORY_LIST,
} from "../canonical/percentage-motif-factories";
import {
  semanticAnswerText,
} from "../editorial/contextual-humanization";
import { realizeEditorialProblem } from "../editorial/stem-realizer";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { createProblemSignature } from "../utils/problem-signature";
import { validatePercentageProblem } from "../validators/problem-validator";
import { validateReasoningGraph } from "../validators/reasoning-validator";
import { validateRealism } from "../validators/realism-validator";
import { validateEditorialRealization } from "../validators/editorial-validator";
import { validateHumanReasoningRealization } from "../validators/human-reasoning-validator";
import { validateEditorialMicroPolish } from "../validators/editorial-micro-polish-validator";
import {
  createContextualHumanizationMetrics,
  validateContextualHumanization,
} from "../validators/contextual-humanization-validator";

const GENERIC_LABEL_PATTERN =
  /^(?:Required difference|Changed value is|Remaining value|Total value is|Required percentage is|At this stage, the value is|100% value is|Original value is|Filtered value)\s*:/imu;

const DOMAIN_PATTERNS = {
  election_margin: /\b(?:votes?|margin|winner|registered voters|valid votes|votes polled)\b/iu,
  pass_fail: /\b(?:marks?|pass mark|candidate|score|paper)\b/iu,
  population_growth: /\b(?:population|male|female|migration|growth|reduction)\b/iu,
  price_consumption: /\b(?:price|consumption|expenditure|spending)\b/iu,
  profit_loss: /\b(?:cost price|selling price|profit|loss)\b/iu,
  mixture_percentage: /\b(?:mixture|water|milk|pure component|quantity)\b/iu,
  salary_revision: /\b(?:salary|increase|decrease|percentage change)\b/iu,
  restore_original: /\b(?:reduction|remaining|required increase|original)\b/iu,
  reverse_percentage: /\b(?:quantity|total|100%)\b/iu,
  increase_then_decrease: /\b(?:increase|decrease|final value|change)\b/iu,
  relational_percentage: /\b(?:income|more|less|assume|compared)\b/iu,
  commission: /\b(?:commission|sales|bonus|base|excess|total)\b/iu,
  taxation: /\b(?:tax|income|rate|difference|payable|amount)\b/iu,
  venn_diagram: /\b(?:both|neither|passed|failed|subjects|only|students)\b/iu,
} as const;

function domainPattern(subtype: string) {
  return DOMAIN_PATTERNS[
    subtype as keyof typeof DOMAIN_PATTERNS
  ] ?? /\b(?:value|percentage|total)\b/iu;
}

test("contextual humanization keeps explanations domain-native", () => {
  let shortcutSamples = 0;
  let semanticLossSamples = 0;
  let averageContextualRealism = 0;

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
    assert.equal(
      validateEditorialMicroPolish(realization).valid,
      true,
      `${label} micro polish`,
    );

    const contextual = validateContextualHumanization(problem, realization);
    assert.equal(
      contextual.valid,
      true,
      `${label} contextual humanization failed: ${contextual.issues.join("; ")}`,
    );

    assert.ok(
      !GENERIC_LABEL_PATTERN.test(realization.explanation),
      `${label} should not use generic lead-in labels`,
    );
    assert.match(
      realization.explanation,
      domainPattern(problem.subtype),
      `${label} should use domain-native narration`,
    );
    assert.ok(
      realization.explanation.includes(semanticAnswerText(problem)),
      `${label} should include semantic answer text`,
    );

    if (realization.naturalization.shortcutSurfaced) {
      shortcutSamples += 1;
      assert.match(
        realization.explanation,
        /(?:\d+(?:\.\d+)?%\s+(?:votes|marks|quantity|consumption|value)\s*=|100%\s+(?:votes|marks|quantity|consumption|value)\s*=|(?:Required increase|Reduction in consumption|(?:Profit|Loss) percentage|Maximum marks|Total (?:quantity|votes|value))\s*=)/iu,
        `${label} shortcut should be context-aware`,
      );
    }

    if (problem.subtype === "profit_loss" && problem.answer < 0) {
      semanticLossSamples += 1;
      assert.match(
        realization.explanation,
        /\b\d+(?:\.\d+)?% loss\b/iu,
        `${label} should realize loss semantically`,
      );
    }

    averageContextualRealism += createContextualHumanizationMetrics(
      problem,
      realization,
    ).contextualRealismScore;
  }

  assert.equal(
    shortcutSamples,
    0,
    "shortcuts should stay hidden unless explicitly enabled",
  );
  assert.ok(semanticLossSamples > 0, "semantic loss samples must be covered");
  assert.ok(
    averageContextualRealism / 1000 >= 95,
    "average contextual realism must stay high",
  );
});

export {};
