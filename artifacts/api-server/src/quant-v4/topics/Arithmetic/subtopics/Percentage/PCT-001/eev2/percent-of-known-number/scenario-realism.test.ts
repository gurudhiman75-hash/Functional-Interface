import { strict as assert } from "node:assert";
import type { ExplanationPlan } from "../../../../../../../common/eev2/contracts";
import { solvePct001 } from "../../solver";
import type { Pct001Parameters } from "../../types";
import { buildPercentOfKnownNumberGraph } from "./graph-builder";
import { renderPercentOfKnownNumberEnglishV2 } from "./language-renderer.v2";
import { planPercentOfKnownNumberExplanation } from "./planner";
import {
  RED_TEAM_REPORT,
  produceRedTeamReport,
} from "./qualification/red-team-report";
import { ScenarioRealismError } from "./scenario-realism";
import { buildPercentOfKnownNumberTrace } from "./trace-builder";

function parameters(
  knownRate: number,
  knownValue: number,
  targetRate: number,
  contextLabel: string,
  semanticUnit: string,
): Pct001Parameters {
  return {
    archetypeId: "PCT-001",
    canonicalProblemId: "PCT-CP-002",
    questionId: `REAL-003:${contextLabel}`,
    questionLanguageId: "PCT-QL-017",
    explanationId: "PCT-ES-002",
    language: "en",
    difficultyBand: "Easy",
    taskKind: "percentOfKnownNumber",
    answerType: semanticUnit === "rupees" ? "ABSOLUTE" : "COUNT",
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
          numberType: semanticUnit === "rupees" ? "uncountable" : "countable",
        },
      },
    },
    sourceTrace: {
      questionLanguageSource: "REAL-003",
      explanationSource: "REAL-003",
      variableRangeSource: "REAL-003",
      semanticSource: "REAL-003",
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

for (const rejected of [
  parameters(5, 25, 15, "marriages", "marriages"),
  parameters(3, 18, 12, "accidents", "accidents"),
  parameters(2, 100, 5, "votes cast", "votes"),
]) {
  assert.throws(
    () => render(rejected),
    (error) => error instanceof ScenarioRealismError,
  );
}

for (const [label, unit] of [
  ["monthly salary", "rupees"],
  ["annual profit", "rupees"],
  ["total books", "books"],
  ["exam marks", "marks"],
] as const) {
  const knownValue = label === "monthly salary" ? 1_200 : 600;
  const rendered = render(parameters(20, knownValue, 25, label, unit));
  const visible = rendered.roles.filter(
    (role) => role.visibility.state === "visible",
  );
  const contextBearingRoles = visible.filter((role) =>
    role.sentence.toLowerCase().includes(label),
  );
  assert.ok(
    contextBearingRoles.length >= 4,
    `${label}: compound label must persist across the teaching path`,
  );
  const answer = visible.find(
    (role) => role.roleKind === "ANSWER_INTERPRETATION",
  );
  assert.ok(answer?.sentence.toLowerCase().includes(label));
}

assert.deepEqual(
  RED_TEAM_REPORT,
  produceRedTeamReport(),
  "REAL-003 red-team rerun must be deterministic.",
);
assert.equal(RED_TEAM_REPORT.criticalFindings.length, 0);
assert.ok(RED_TEAM_REPORT.majorFindings.length < 40);

console.log(
  `REAL-003 passed: ${RED_TEAM_REPORT.majorFindings.length} major findings, ` +
    `${RED_TEAM_REPORT.criticalFindings.length} critical findings.`,
);
