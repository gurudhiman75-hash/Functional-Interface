import assert from "node:assert/strict";
import { generateClockQuestion, type ClockTaskId } from "../topics/Clocks/CLK-001/runtime";

const TASKS = [
  "GAIN_FROM_COINCIDENCE_INTERVAL",
  "LOSS_FROM_COINCIDENCE_INTERVAL",
  "COINCIDENCE_INTERVAL_FROM_RATE",
  "CLASSIFY_FROM_EVENT_INTERVAL",
  "RATE_FROM_RIGHT_OR_OPPOSITION_RECURRENCE",
  "ACTUAL_TIME_OF_NTH_DISPLAYED_EVENT",
] as const satisfies readonly ClockTaskId[];

let generated = 0;
let maxVisibleFractionDenominator = 1;
const observedIntervals = new Set<string>();
const oracleNames = new Set<string>();

for (const taskId of TASKS) {
  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const question = generateClockQuestion({
      taskId,
      seed: `CLK-CP008-EXAM-NATURAL-${taskId}-${seedIndex}`,
      locale: "en-IN",
      correctOptionIndex: (seedIndex % 4) as 0 | 1 | 2 | 3,
    });
    assert.equal(question.checkpointCode, "CLK-CP-008");
    assert.equal(question.solveTrace.proofLevel, "DUAL_ANSWER_ORACLE");
    assert.equal(question.solveTrace.stemScenarioParity, true);
    assert.equal(question.solveTrace.answerContractVerified, true);
    assert(question.solveTrace.contractOracle?.includes("CP008_"));
    oracleNames.add(question.solveTrace.contractOracle!);

    const visible = [
      question.stem,
      question.answer.display,
      ...question.options.map((option) => option.display),
      question.explanation.given,
      question.explanation.rule,
      ...question.explanation.working,
      question.explanation.validityCheck,
      question.explanation.closestTrap,
      question.explanation.answer,
    ].join("\n");

    assert.doesNotMatch(visible, /displayed\s*:\s*actual/i);
    assert.doesNotMatch(visible, /day \+0/i);
    assert.doesNotMatch(visible, /\/(?:319|517|737|803|1309|1969)\b/);

    for (const match of visible.matchAll(/\b\d+\s+(\d+)\/(\d+)\b/g)) {
      maxVisibleFractionDenominator = Math.max(maxVisibleFractionDenominator, Number(match[2]));
    }
    if (typeof question.scenario.observedActualInterval === "string") {
      observedIntervals.add(question.scenario.observedActualInterval);
    }
    generated += 1;
  }
}

assert.equal(generated, TASKS.length * 100);
assert(maxVisibleFractionDenominator <= 121, `Unexpected CP008 learner fraction denominator ${maxVisibleFractionDenominator}.`);
assert(observedIntervals.has("64 minutes"));
assert(observedIntervals.has("66 minutes"));
assert(oracleNames.size >= TASKS.length);

const sourceReplicaGain = generateClockQuestion({
  taskId: "GAIN_FROM_COINCIDENCE_INTERVAL",
  seed: "CLK-CP008-RS-AGGARWAL-64-MINUTE-REPLICA",
  locale: "en-IN",
  correctOptionIndex: 0,
});
assert.match(sourceReplicaGain.stem, /coincide every 64 minutes/i);
assert.match(sourceReplicaGain.answer.display, /gain of 32 8\/11 minutes per day/i);

console.log(JSON.stringify({
  status: "PASS_CLK_CP008_SOURCE_NATURAL_VALUE_CALIBRATION",
  generated,
  taskCount: TASKS.length,
  maxVisibleFractionDenominator,
  observedIntervals: [...observedIntervals].sort(),
  oracleCount: oracleNames.size,
  sourceReplica: {
    stem: sourceReplicaGain.stem,
    answer: sourceReplicaGain.answer.display,
  },
}, null, 2));
