import { strict as assert } from "node:assert";
import type { ExplanationPlan } from "../../../../../../../common/eev2/contracts";
import { solvePct001 } from "../../solver";
import type { Pct001Parameters } from "../../types";
import { evaluateCountConstraints } from "./count-policies";
import { EntityConstraintError } from "./entity-constraints";
import { buildPercentOfKnownNumberGraph } from "./graph-builder";
import { renderPercentOfKnownNumberEnglishV2 } from "./language-renderer.v2";
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
  semanticUnit: string,
  answerType: "COUNT" | "ABSOLUTE" = "COUNT",
): Pct001Parameters {
  return {
    archetypeId: "PCT-001",
    canonicalProblemId: "PCT-CP-002",
    questionId: `REAL-005:${contextLabel}:${knownRate}:${targetRate}`,
    questionLanguageId: "PCT-QL-017",
    explanationId: "PCT-ES-002",
    language: "en",
    difficultyBand: "Easy",
    taskKind: "percentOfKnownNumber",
    answerType,
    requiredVariables: ["rate1", "value1", "rate2"],
    variables: { rate1: knownRate, value1: knownValue, rate2: targetRate },
    semanticContext: {
      scenario: contextLabel,
      entities: {
        quantity: {
          id: semanticUnit,
          en: semanticUnit,
          hi: semanticUnit,
          pa: semanticUnit,
          numberType: answerType === "COUNT" ? "countable" : "uncountable",
        },
      },
    },
    sourceTrace: {
      questionLanguageSource: "REAL-005",
      explanationSource: "REAL-005",
      variableRangeSource: "REAL-005",
      semanticSource: "REAL-005",
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

for (const invalid of [
  parameters(100, 400, 200, "books", "books"),
  parameters(150, 450, 50, "trees", "trees"),
  parameters(20, 0.28, 20, "workers", "workers"),
  parameters(60, 0.24, 10, "students", "students"),
]) {
  assert.throws(
    () => render(invalid),
    (error) =>
      error instanceof EntityConstraintError &&
      (error.code === "COUNT_PERCENT_OVER_100" ||
        error.code === "COUNT_ROUNDED_TO_ZERO"),
  );
}

for (const valid of [
  parameters(20, 120, 30, "students", "students"),
  parameters(25, 200, 40, "total books", "books"),
  parameters(150, 1_500, 200, "population", "people", "ABSOLUTE"),
  parameters(150, 300, 200, "distance", "kilometres", "ABSOLUTE"),
  parameters(40, 90.5, 60, "exam marks", "marks", "ABSOLUTE"),
  parameters(25, 12.5, 75, "area", "square metres", "ABSOLUTE"),
]) {
  assert.doesNotThrow(() => render(valid));
}

assert.equal(
  evaluateCountConstraints({
    contextLabel: "inventory counts",
    semanticUnit: "inventory",
    knownRate: 50,
    targetRate: 125,
    targetQuantity: 250,
  }).decision,
  "REJECT",
);

assert.deepEqual(
  RED_TEAM_REPORT,
  produceRedTeamReport(),
  "REAL-005 red-team rerun must be deterministic.",
);
assert.equal(RED_TEAM_REPORT.criticalFindings.length, 0);
assert.equal(
  RED_TEAM_REPORT.majorFindings.filter(
    (finding) => finding.code === "COUNT_PERCENT_OVER_100",
  ).length,
  0,
);
assert.equal(
  RED_TEAM_REPORT.majorFindings.filter(
    (finding) => finding.code === "COUNT_ROUNDED_TO_ZERO",
  ).length,
  0,
);
assert.equal(RED_TEAM_REPORT.approvedExamples, 200);

console.log(
  `REAL-005 passed: ${RED_TEAM_REPORT.approvedExamples}/200 approved, ` +
    `${RED_TEAM_REPORT.criticalFindings.length} critical findings.`,
);
