import assert from "node:assert/strict";
import {
  inferExamTimerMode,
  reconcileExamTimer,
} from "../src/lib/timer-recovery.ts";

function session(overrides = {}) {
  return {
    timeLeft: 300,
    currentSectionIndex: 0,
    currentQuestionIndex: 4,
    sectionTimeLeftByName: {
      Quant: 30,
      Reasoning: 40,
    },
    ...overrides,
  };
}

assert.equal(
  inferExamTimerMode(session(), session({ timeLeft: 299 })),
  "overall",
  "overall timer mode should be inferred from a decreasing total timer",
);

assert.equal(
  inferExamTimerMode(
    session(),
    session({ sectionTimeLeftByName: { Quant: 29, Reasoning: 40 } }),
  ),
  "sectional",
  "sectional timer mode should be inferred from a decreasing section timer",
);

assert.equal(
  inferExamTimerMode(session(), session()),
  null,
  "a non-ticking/paused draft must not be classified as an active timer",
);

assert.deepEqual(
  reconcileExamTimer(session(), 45, "overall"),
  session({ timeLeft: 255 }),
  "overall timer recovery should subtract the hidden elapsed interval exactly once",
);

assert.deepEqual(
  reconcileExamTimer(session(), 45, "sectional"),
  session({
    currentSectionIndex: 1,
    currentQuestionIndex: 0,
    sectionTimeLeftByName: { Quant: 0, Reasoning: 25 },
  }),
  "sectional recovery should expire the current section and consume the remainder from the next section",
);

assert.deepEqual(
  reconcileExamTimer(session(), 100, "sectional"),
  session({
    currentSectionIndex: 1,
    currentQuestionIndex: 0,
    sectionTimeLeftByName: { Quant: 0, Reasoning: 0 },
  }),
  "sectional recovery should clamp the final section to zero when the hidden interval exhausts the exam",
);

const unchanged = session();
assert.equal(
  reconcileExamTimer(unchanged, 0, "overall"),
  unchanged,
  "zero elapsed time should not manufacture a new timer state",
);

console.log("Timer recovery audit passed (7 assertions).");
