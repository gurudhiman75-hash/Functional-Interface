import assert from "node:assert/strict";
import {
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION,
  CLOCK_EFFECTIVE_SOURCE_AUDIT,
  generateClockQuestion,
  outputForClockTask,
} from "../topics/Clocks/CLK-001/runtime";

assert.equal(outputForClockTask("TIME_AFTER_HANDS_INTERCHANGED"), "duration");
assert.equal(
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION.TIME_AFTER_HANDS_INTERCHANGED.disposition,
  "PROVISIONAL_AUTHORITY_ANCHOR",
);
assert.equal(
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION.TIME_AFTER_HANDS_INTERCHANGED.cluster,
  "HAND_INTERCHANGE",
);
assert.equal(CLOCK_EFFECTIVE_SOURCE_AUDIT.TIME_AFTER_HANDS_INTERCHANGED.evidenceLevel, "DIRECT_SOURCE");

for (let seedIndex = 0; seedIndex < 40; seedIndex += 1) {
  const question = generateClockQuestion({
    taskId: "TIME_AFTER_HANDS_INTERCHANGED",
    seed: `CLK-CP013-EXAM-NATURAL-${seedIndex}`,
    correctOptionIndex: (seedIndex % 4) as 0 | 1 | 2 | 3,
  });

  assert.equal(question.answer.kind, "DURATION");
  assert.equal(question.answer.semanticKey, "DURATION:43200/13");
  assert.equal(question.answer.display, "55 5/13 minutes");
  assert.equal(question.solveTrace.verifierAnswerKey, "DURATION:43200/13");
  assert.equal(question.solveTrace.agreement, true);
  assert.equal(question.solveTrace.contractOracle, "CP013_SOURCE_NATURAL_INTERCHANGE_DURATION_ORACLE");
  assert.equal(question.discoveryAudit.candidateDisposition, "PROVISIONAL_AUTHORITY_ANCHOR");
  assert.equal(question.discoveryAudit.semanticCluster, "HAND_INTERCHANGE");
  assert.equal(question.lifecycle.permanentQlId, null);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.testEligible, false);

  assert(question.stem.includes("between 5 p.m. and 6 p.m."));
  assert(question.stem.includes("less than one hour later"));
  assert(question.stem.includes("exactly interchanged"));
  assert(question.stem.toLowerCase().includes("how long"));
  assert(!question.stem.includes("/143"));
  assert(!question.options.some((option) => option.display.includes("/143")));
  assert(question.options.some((option) => option.display === "65 5/11 minutes"));
  assert(question.options.some((option) => option.display === "60 minutes"));
  assert(question.options.some((option) => option.display === "51 3/7 minutes"));
  assert.equal(new Set(question.options.map((option) => option.semanticKey)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert(question.explanation.working.some((line) => line.includes("6.5t = 360")));
  assert(question.explanation.closestTrap.includes("5.5 degrees per minute"));
}

console.log(JSON.stringify({
  status: "PASS_CLK_001_CP013_SOURCE_NATURAL_HAND_INTERCHANGE",
  calibratedTask: "TIME_AFTER_HANDS_INTERCHANGED",
  exactDurationMinutes: "720/13",
  exactDurationDisplay: "55 5/13 minutes",
  seedsChecked: 40,
  learnerExactPairDenominator143Exposure: 0,
  lifecycle: "OPEN_DISCOVERY_ONLY",
}, null, 2));
