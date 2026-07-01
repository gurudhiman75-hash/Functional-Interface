import { strict as assert } from "node:assert";
import type { ExplanationPlan } from "../../../../../../../common/eev2/contracts";
import { solvePct001 } from "../../solver";
import type { Pct001Parameters } from "../../types";
import { formatNumberForPresentation } from "./number-formatting";
import { buildPercentOfKnownNumberGraph } from "./graph-builder";
import { renderPercentOfKnownNumberEnglishV2 } from "./language-renderer.v2";
import { planPercentOfKnownNumberExplanation } from "./planner";
import {
  RED_TEAM_REPORT,
  produceRedTeamReport,
} from "./qualification/red-team-report";
import { resolveEntityPolicy } from "./entity-policies";
import { buildPercentOfKnownNumberTrace } from "./trace-builder";
import { presentRealisticValue } from "./unit-policies";

assert.equal(formatNumberForPresentation(1_250_000).grouped, "12,50,000");
assert.equal(formatNumberForPresentation(375_000).grouped, "3,75,000");
assert.equal(formatNumberForPresentation(42_000_000).grouped, "4,20,00,000");
assert.equal(formatNumberForPresentation(999).grouped, "999");
assert.equal(formatNumberForPresentation(1_000).grouped, "1,000");
assert.equal(formatNumberForPresentation(3.3333333333333).grouped, "3.33");
assert.equal(formatNumberForPresentation(-1_250_000.5).grouped, "-12,50,000.5");

const moneyPolicy = resolveEntityPolicy("rupees", "monthly salary");
assert.equal(
  presentRealisticValue(1_250_000, moneyPolicy).display,
  "₹12,50,000",
);
assert.equal(
  presentRealisticValue(3.3333333333333, moneyPolicy).display,
  "about ₹3.33",
);

const parameters: Pct001Parameters = {
  archetypeId: "PCT-001",
  canonicalProblemId: "PCT-CP-002",
  questionId: "PRESENT-001:monthly-salary",
  questionLanguageId: "PCT-QL-017",
  explanationId: "PCT-ES-002",
  language: "en",
  difficultyBand: "Easy",
  taskKind: "percentOfKnownNumber",
  answerType: "ABSOLUTE",
  requiredVariables: ["rate1", "value1", "rate2"],
  variables: { rate1: 20, value1: 1_250_000, rate2: 60 },
  semanticContext: {
    scenario: "monthly salary",
    entities: {
      quantity: {
        id: "rupees",
        en: "rupees",
        hi: "rupees",
        pa: "rupees",
        numberType: "uncountable",
      },
    },
  },
  sourceTrace: {
    questionLanguageSource: "PRESENT-001",
    explanationSource: "PRESENT-001",
    variableRangeSource: "PRESENT-001",
    semanticSource: "PRESENT-001",
  },
};

function render(
  input: Pct001Parameters,
  mode: ExplanationPlan["detailMode"] = "standard",
) {
  const solved = solvePct001(input);
  assert.ok(solved.educationalEvidence);
  const trace = buildPercentOfKnownNumberTrace(solved.educationalEvidence);
  const graph = buildPercentOfKnownNumberGraph(trace);
  const plan = planPercentOfKnownNumberExplanation(graph, mode);
  return renderPercentOfKnownNumberEnglishV2(plan, trace, {
    contextLabel: input.semanticContext?.scenario,
  });
}

const rendered = render(parameters);
const renderedText = rendered.roles
  .filter((role) => role.visibility.state === "visible")
  .map((role) => `${role.sentence} ${role.math ?? ""}`)
  .join("\n");
assert.match(renderedText, /₹12,50,000/);
assert.match(renderedText, /monthly salary/i);
assert.doesNotMatch(renderedText, /\b1250000\b/);

assert.deepEqual(
  RED_TEAM_REPORT,
  produceRedTeamReport(),
  "PRESENT-001 red-team rerun must be deterministic.",
);
assert.equal(RED_TEAM_REPORT.criticalFindings.length, 0);
assert.equal(
  RED_TEAM_REPORT.majorFindings.filter(
    (finding) => finding.code === "LARGE_NUMBER_UNGROUPED",
  ).length,
  0,
);

console.log(
  `PRESENT-001 passed: ungrouped-large-number findings 0, ` +
    `${RED_TEAM_REPORT.criticalFindings.length} critical findings.`,
);
