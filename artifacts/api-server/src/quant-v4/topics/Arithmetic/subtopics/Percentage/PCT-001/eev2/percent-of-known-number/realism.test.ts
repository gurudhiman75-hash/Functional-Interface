import { strict as assert } from "node:assert";
import type { ExplanationPlan } from "../../../../../../../common/eev2/contracts";
import { solvePct001 } from "../../solver";
import type { Pct001Parameters } from "../../types";
import { resolveEntityPolicy } from "./entity-policies";
import { buildPercentOfKnownNumberGraph } from "./graph-builder";
import { renderPercentOfKnownNumberEnglishV2 } from "./language-renderer.v2";
import { planPercentOfKnownNumberExplanation } from "./planner";
import {
  INDEPENDENT_AUDIT_REPORT,
  produceIndependentAuditReport,
} from "./qualification/independent-audit-report";
import { buildPercentOfKnownNumberTrace } from "./trace-builder";
import { presentRealisticValue } from "./unit-policies";

function parameters(
  contextLabel: string,
  semanticUnit: string,
  knownRate: number,
  knownValue: number,
  targetRate: number,
): Pct001Parameters {
  return {
    archetypeId: "PCT-001",
    canonicalProblemId: "PCT-CP-002",
    questionId: `REAL-001:${contextLabel}`,
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
      questionLanguageSource: "REAL-001",
      explanationSource: "REAL-001",
      variableRangeSource: "REAL-001",
      semanticSource: "REAL-001",
    },
  };
}

function render(
  input: Pct001Parameters,
  detailMode: ExplanationPlan["detailMode"] = "standard",
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

const salary = render(parameters("salary", "rupees", 20, 600, 25));
const salaryText = salary.roles.map((role) => role.sentence).join("\n");
assert.match(salaryText, /\bsalary\b/i);
assert.ok(
  salary.roles
    .filter((role) => role.visibility.state === "visible")
    .every((role) =>
      role.roleKind === "VERIFICATION"
        ? true
        : role.sentence.toLowerCase().includes("salary"),
    ),
  "The scenario must persist through every visible teaching role.",
);

const students = render(parameters("students", "students", 20, 67, 35));
const studentAnswer = students.roles.find(
  (role) => role.roleKind === "ANSWER_INTERPRETATION",
);
assert.ok(studentAnswer);
assert.match(studentAnswer.sentence, /\babout 117 students\b/i);
assert.doesNotMatch(studentAnswer.sentence, /\b117\.25 students\b/i);

const moneyPolicy = resolveEntityPolicy("rupees", "income");
assert.equal(presentRealisticValue(3.335, moneyPolicy).display, "about ₹3.34");
const bookPolicy = resolveEntityPolicy("books", "books");
assert.equal(presentRealisticValue(60.666, bookPolicy).display, "about 61 books");

assert.deepEqual(
  INDEPENDENT_AUDIT_REPORT,
  produceIndependentAuditReport(),
  "The REAL-001 rerun must be deterministic.",
);
assert.equal(INDEPENDENT_AUDIT_REPORT.totalExamples, 50);
assert.equal(INDEPENDENT_AUDIT_REPORT.criticalFindings.length, 0);
assert.ok(INDEPENDENT_AUDIT_REPORT.majorFindings.length < 10);
assert.ok(INDEPENDENT_AUDIT_REPORT.minorFindings.length < 10);
assert.ok(INDEPENDENT_AUDIT_REPORT.approvedExamples > 45);

console.log(
  `REAL-001 passed: ${INDEPENDENT_AUDIT_REPORT.approvedExamples}/50 approved, ` +
    `${INDEPENDENT_AUDIT_REPORT.majorFindings.length} major, ` +
    `${INDEPENDENT_AUDIT_REPORT.minorFindings.length} minor findings.`,
);
