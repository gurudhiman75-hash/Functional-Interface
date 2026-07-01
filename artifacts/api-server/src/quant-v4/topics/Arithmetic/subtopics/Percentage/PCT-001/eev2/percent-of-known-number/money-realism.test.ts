import { strict as assert } from "node:assert";
import type { ExplanationPlan } from "../../../../../../../common/eev2/contracts";
import { solvePct001 } from "../../solver";
import type { Pct001Parameters } from "../../types";
import { buildPercentOfKnownNumberGraph } from "./graph-builder";
import { renderPercentOfKnownNumberEnglishV2 } from "./language-renderer.v2";
import { MoneyRealismError } from "./money-realism";
import { evaluateMoneyPolicy } from "./money-policies";
import { planPercentOfKnownNumberExplanation } from "./planner";
import {
  RED_TEAM_REPORT,
  produceRedTeamReport,
} from "./qualification/red-team-report";
import { buildPercentOfKnownNumberTrace } from "./trace-builder";

function parameters(
  knownRate: number,
  knownValue: number,
  targetRate: number,
  contextLabel: string,
): Pct001Parameters {
  return {
    archetypeId: "PCT-001",
    canonicalProblemId: "PCT-CP-002",
    questionId: `REAL-004:${contextLabel}:${knownValue}`,
    questionLanguageId: "PCT-QL-017",
    explanationId: "PCT-ES-002",
    language: "en",
    difficultyBand: "Easy",
    taskKind: "percentOfKnownNumber",
    answerType: "ABSOLUTE",
    requiredVariables: ["rate1", "value1", "rate2"],
    variables: { rate1: knownRate, value1: knownValue, rate2: targetRate },
    semanticContext: {
      scenario: contextLabel,
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
      questionLanguageSource: "REAL-004",
      explanationSource: "REAL-004",
      variableRangeSource: "REAL-004",
      semanticSource: "REAL-004",
    },
  };
}

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

for (const unrealistic of [
  parameters(10, 0.17, 80, "salary"),
  parameters(20, 2.3, 50, "annual income"),
  parameters(25, 1.8, 75, "profit"),
  parameters(30, 2.4, 60, "revenue"),
  parameters(20, 5, 40, "bonus"),
]) {
  assert.throws(
    () => render(unrealistic),
    (error) =>
      error instanceof MoneyRealismError &&
      error.code === "UNREALISTIC_MONEY_SCALE",
  );
}

for (const realistic of [
  parameters(20, 6_000, 25, "monthly salary"),
  parameters(25, 25_000, 40, "annual profit"),
  parameters(10, 50_000, 30, "revenue"),
  parameters(20, 800, 50, "savings"),
  parameters(30, 1_200, 60, "expenses"),
  parameters(25, 500, 75, "commission"),
]) {
  const output = render(realistic);
  const label = realistic.semanticContext!.scenario;
  const answer = output.roles.find(
    (role) => role.roleKind === "ANSWER_INTERPRETATION",
  );
  assert.ok(answer?.sentence.toLowerCase().includes(label));
}

assert.equal(
  evaluateMoneyPolicy({
    contextLabel: "monthly salary",
    knownRate: 20,
    knownAmount: 6_000,
    targetRate: 25,
    targetAmount: 7_500,
  }).decision,
  "ACCEPT",
);

assert.deepEqual(
  RED_TEAM_REPORT,
  produceRedTeamReport(),
  "REAL-004 red-team rerun must be deterministic.",
);
assert.equal(RED_TEAM_REPORT.criticalFindings.length, 0);
assert.equal(
  RED_TEAM_REPORT.majorFindings.filter(
    (finding) => finding.code === "UNREALISTIC_MONEY_SCALE",
  ).length,
  0,
);

console.log(
  `REAL-004 passed: money-scale findings 0, ` +
    `${RED_TEAM_REPORT.criticalFindings.length} critical findings.`,
);
