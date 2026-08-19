import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
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

const runnerSource = fs.readFileSync(
  fileURLToPath(new URL("../src/pages/test.tsx", import.meta.url)),
  "utf8",
);
const storageSource = fs.readFileSync(
  fileURLToPath(new URL("../src/lib/storage.ts", import.meta.url)),
  "utf8",
);
const safeStorageSource = fs.readFileSync(
  fileURLToPath(new URL("../src/lib/install-safe-storage.ts", import.meta.url)),
  "utf8",
);

assert.match(
  storageSource,
  /timerMode\?: "overall" \| "sectional"/,
  "active test drafts must persist an explicit timer mode contract",
);
assert.match(
  runnerSource,
  /const \[attemptType, setAttemptType\] = useState<"REAL" \| "PRACTICE">\(initialMode \?\? "REAL"\)/,
  "practice runners must not transiently initialise as real attempts",
);
assert.match(
  runnerSource,
  /saveActiveTestSession\(\{[\s\S]*?attemptType: "REAL",[\s\S]*?timerMode: hasSectionalTiming \? "sectional" : "overall"/,
  "a fresh real runner must save a timer-typed draft before interaction",
);
assert.match(
  runnerSource,
  /const hasSectionTimerProgress =/,
  "fixed-sectional clock movement must count as persisted attempt progress",
);
assert.match(
  runnerSource,
  /sessionHydrated && \(attemptType === "REAL" \|\| hasAttemptProgress\)/,
  "navigation/storage guards must wait for draft hydration before protecting the active attempt",
);
assert.match(
  safeStorageSource,
  /session\?\.timerMode \?\? \(testId \? timerModeByTest\.get\(testId\) : undefined\)/,
  "background recovery must prefer the explicit draft timer mode",
);
assert.match(
  safeStorageSource,
  /document\.addEventListener\("freeze"/,
  "page lifecycle freeze must mark real timer suspension",
);
assert.match(
  safeStorageSource,
  /document\.addEventListener\("resume"/,
  "page lifecycle resume must reconcile suspended real timers",
);

console.log("Timer recovery audit passed (15 assertions)." );
