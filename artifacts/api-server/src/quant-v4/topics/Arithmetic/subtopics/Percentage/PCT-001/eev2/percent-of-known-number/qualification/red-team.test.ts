import { strict as assert } from "node:assert";
import {
  RED_TEAM_CORPUS,
  RED_TEAM_FATIGUE_CORPUS,
} from "./red-team-corpus";
import {
  RED_TEAM_REPORT,
  produceRedTeamReport,
} from "./red-team-report";

assert.equal(RED_TEAM_CORPUS.length, 200);
assert.equal(RED_TEAM_FATIGUE_CORPUS.length, 500);
assert.equal(new Set(RED_TEAM_CORPUS.map((item) => item.redTeamId)).size, 200);
assert.equal(
  new Set(RED_TEAM_FATIGUE_CORPUS.map((item) => item.redTeamId)).size,
  500,
);
assert.deepEqual(
  RED_TEAM_REPORT,
  produceRedTeamReport(),
  "The adversarial qualification must be deterministic.",
);
assert.equal(RED_TEAM_REPORT.totalExamples, 200);
assert.equal(RED_TEAM_REPORT.fatigueStudy.totalExplanations, 500);
assert.equal(RED_TEAM_REPORT.categorySummaries.length, 10);
assert.ok(
  RED_TEAM_REPORT.categorySummaries.every(
    (summary) => summary.totalExamples === 20,
  ),
);
assert.ok(
  RED_TEAM_REPORT.criticalFindings.every(
    (finding) =>
      finding.code === "MISSING_ONE_UNIT_REASONING" ||
      finding.code === "ANSWER_JUMP" ||
      finding.code === "FORMULA_FIRST_REGRESSION" ||
      finding.code === "WRONG_DISPLAYED_ANSWER",
  ),
);

console.log(
  `QUAL-001 Phase C red-team: ${RED_TEAM_REPORT.approvedExamples}/200 approved, ` +
    `${RED_TEAM_REPORT.criticalFindings.length} critical, ` +
    `${RED_TEAM_REPORT.majorFindings.length} major, ` +
    `${RED_TEAM_REPORT.minorFindings.length} minor; ` +
    `fatigue ${RED_TEAM_REPORT.fatigueStudy.acceptable ? "acceptable" : "failed"} ` +
    `across 500 explanations.`,
);

