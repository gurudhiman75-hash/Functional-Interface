import assert from "node:assert/strict";
import {
  generateClockQuestion,
  type ClockTaskId,
} from "../topics/Clocks/CLK-001/runtime";

const TASKS = [
  "DISPLAYED_FROM_ACTUAL_ELAPSED",
  "INITIAL_OFFSET_CORRECT_RATE",
  "DERIVE_RATE_FROM_OBSERVATIONS",
  "COMPARE_TWO_FAULTY_CLOCKS",
] as const satisfies readonly ClockTaskId[];

let generated = 0;
const oracleNames = new Set<string>();
const stemFingerprints = new Set<string>();
const taskCounts: Record<string, number> = {};

for (const taskId of TASKS) {
  taskCounts[taskId] = 0;
  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const question = generateClockQuestion({
      taskId,
      seed: `CLK-FAULTY-CORE-EXAM-NATURAL-${taskId}-${seedIndex}`,
      locale: "en-IN",
      correctOptionIndex: (seedIndex % 4) as 0 | 1 | 2 | 3,
    });

    assert.equal(question.solveTrace.proofLevel, "DUAL_ANSWER_ORACLE");
    assert.equal(question.solveTrace.stemScenarioParity, true);
    assert.equal(question.solveTrace.answerContractVerified, true);
    assert.match(question.solveTrace.contractOracle ?? "", /EXAM_NATURAL/);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.semanticKey)).size, 4);
    assert.equal(new Set(question.options.map((option) => option.display)).size, 4);

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

    assert.doesNotMatch(question.stem, /displayed\s*:\s*actual/i);
    assert.doesNotMatch(question.stem, /\brate\s*=|rate\s*\d+\s*:\s*\d+/i);
    assert.doesNotMatch(visible, /\(day \+0\)|day 0/i);
    assert.doesNotMatch(visible, /\b(?:319|517|737|803|1309|1969)\b/);
    assert.doesNotMatch(question.stem, /prototype|solver|affine|metadata|generator/i);

    if (taskId === "DISPLAYED_FROM_ACTUAL_ELAPSED") {
      assert.match(question.stem, /correct at 8:00 a\.m\./i);
      assert.match(question.stem, /gains \d+ minutes in every 24 actual hours/i);
      assert.match(question.stem, /after \d+ actual hours/i);
      assert.match(question.explanation.working.join(" "), /Gain in \d+ hours/i);
    }

    if (taskId === "INITIAL_OFFSET_CORRECT_RATE") {
      assert.match(question.stem, /At 8:00 a\.m\./i);
      assert.match(question.stem, /minutes (?:slow|fast)/i);
      assert.match(question.stem, /runs at the correct rate/i);
      assert.match(question.explanation.rule, /same fixed error/i);
    }

    if (taskId === "DERIVE_RATE_FROM_OBSERVATIONS") {
      assert.match(question.stem, /minutes slow/i);
      assert.match(question.stem, /Exactly 24 actual hours later/i);
      assert.match(question.stem, /ratio of time shown by the clock to actual time/i);
      assert.match(question.explanation.working.join(" "), /Additional loss in 24 hours/i);
      assert.match(question.answer.display, /^\d+:\d+$/);
    }

    if (taskId === "COMPARE_TWO_FAULTY_CLOCKS") {
      assert.match(question.stem, /clock A is \d+ minutes fast and gains \d+ minutes per day/i);
      assert.match(question.stem, /clock B is \d+ minutes slow and loses \d+ minutes per day/i);
      assert.match(question.stem, /after 24 actual hours/i);
      assert.match(question.explanation.working.join(" "), /Initial separation/i);
      assert.match(question.explanation.working.join(" "), /Additional separation/i);
    }

    oracleNames.add(question.solveTrace.contractOracle!);
    stemFingerprints.add(`${taskId}|${question.stem}`);
    taskCounts[taskId]! += 1;
    generated += 1;
  }
}

assert.equal(generated, 400);
assert.equal(oracleNames.size, TASKS.length);
assert.equal(Object.values(taskCounts).every((count) => count === 100), true);
assert(stemFingerprints.size >= 40, `Expected broad faulty-clock stem/value diversity; got ${stemFingerprints.size}.`);

console.log(JSON.stringify({
  status: "PASS_CLK_FAULTY_CORE_EXAM_NATURAL_CALIBRATION",
  generated,
  taskCount: TASKS.length,
  oracleCount: oracleNames.size,
  distinctTaskStemPairs: stemFingerprints.size,
  taskCounts,
}, null, 2));
