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
import { buildPercentOfKnownNumberTrace } from "./trace-builder";

function parameters(
  knownRate: number,
  knownValue: number,
  targetRate: number,
  contextLabel = "salary",
  semanticUnit = "rupees",
): Pct001Parameters {
  return {
    archetypeId: "PCT-001",
    canonicalProblemId: "PCT-CP-002",
    questionId: `REAL-002:${knownRate}:${knownValue}:${targetRate}`,
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
      questionLanguageSource: "REAL-002",
      explanationSource: "REAL-002",
      variableRangeSource: "REAL-002",
      semanticSource: "REAL-002",
    },
  };
}

function render(
  input: Pct001Parameters,
  detailMode: ExplanationPlan["detailMode"],
) {
  const solved = solvePct001(input);
  assert.ok(solved.educationalEvidence);
  const trace = buildPercentOfKnownNumberTrace(solved.educationalEvidence);
  const graph = buildPercentOfKnownNumberGraph(trace);
  const plan = planPercentOfKnownNumberExplanation(graph, detailMode);
  return renderPercentOfKnownNumberEnglishV2(plan, trace, {
    contextLabel: input.semanticContext?.scenario,
  });
}

for (const mode of ["short", "standard", "detailed"] as const) {
  const rendered = render(parameters(20, 600, 25), mode);
  const division = rendered.roles.find(
    (role) => role.roleKind === "SINGLE_UNIT_DERIVATION",
  );
  const multiplication = rendered.roles.find(
    (role) => role.roleKind === "TARGET_SCALE_DERIVATION",
  );
  assert.ok(division);
  assert.ok(multiplication);
  assert.match(division.sentence, /equal (?:1% )?parts|equal percentage parts/i);
  assert.match(division.sentence, /divid/i);
  assert.match(multiplication.sentence, /1%/i);
  assert.match(multiplication.sentence, /gives|give|combines|to get/i);
}

const equalRate = render(parameters(30, 90, 30), "standard");
const equalText = equalRate.roles
  .filter((role) => role.visibility.state === "visible")
  .map((role) => `${role.sentence} ${role.math ?? ""}`)
  .join("\n");
assert.match(equalText, /already|both 30%|same 30%|provided/i);
assert.match(
  equalText,
  /1%.*(?:unnecessary|skip|no need)|(?:unnecessary|skip|no need).*1%/i,
);
assert.match(equalText, /no .*needed|does not need|no change|no further calculation/i);
assert.doesNotMatch(equalText, /\$\$1\\%|30\s*\\div\s*30/i);

assert.deepEqual(
  RED_TEAM_REPORT,
  produceRedTeamReport(),
  "REAL-002 red-team rerun must be deterministic.",
);
assert.equal(RED_TEAM_REPORT.criticalFindings.length, 0);
assert.ok(
  RED_TEAM_REPORT.majorFindings.filter(
    (finding) => finding.code === "DIVISION_NOT_EXPLAINED",
  ).length < 5,
);
assert.ok(
  RED_TEAM_REPORT.majorFindings.filter(
    (finding) => finding.code === "EQUAL_RATE_OVEREXPLAINED",
  ).length < 5,
);

console.log(
  `REAL-002 passed: division-intent findings ` +
    `${RED_TEAM_REPORT.majorFindings.filter((finding) => finding.code === "DIVISION_NOT_EXPLAINED").length}, ` +
    `equal-rate findings ` +
    `${RED_TEAM_REPORT.majorFindings.filter((finding) => finding.code === "EQUAL_RATE_OVEREXPLAINED").length}, ` +
    `${RED_TEAM_REPORT.criticalFindings.length} critical findings.`,
);
