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
const mainSource = fs.readFileSync(
  fileURLToPath(new URL("../src/main.tsx", import.meta.url)),
  "utf8",
);
const mobileRunnerCss = fs.readFileSync(
  fileURLToPath(new URL("../src/test-runner-mobile.css", import.meta.url)),
  "utf8",
);
const playwrightConfig = fs.readFileSync(
  fileURLToPath(new URL("../../../scripts/e2e/playwright.config.ts", import.meta.url)),
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
assert.match(
  mainSource,
  /import "\.\/test-runner-mobile\.css"/,
  "the focused mobile runner hardening stylesheet must be loaded after the main app CSS",
);
assert.match(
  mobileRunnerCss,
  /header\.sticky\.top-0\.bg-blue-600 > div:first-child[\s\S]*?grid-template-columns: minmax\(0, 1fr\)/,
  "the mobile runner header must collapse to a single-column layout",
);
assert.match(
  mobileRunnerCss,
  /header\.sticky\.top-0\.bg-blue-600 \+ main[\s\S]*?padding-bottom: 5\.5rem/,
  "mobile runner content must reserve space above the fixed navigation bar",
);
assert.match(
  playwrightConfig,
  /testMatch: \/student-\(production\|timer-mobile\)-hardening\\\.spec\\\.ts\//,
  "Pixel-class CI must include the focused mobile runner certification without running the full desktop matrix twice",
);

console.log("Timer recovery audit passed (19 assertions).");
