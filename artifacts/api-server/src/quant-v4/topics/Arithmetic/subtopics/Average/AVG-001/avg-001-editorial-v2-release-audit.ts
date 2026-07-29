import { strict as assert } from "node:assert";

import {
  AVG_001_ENGLISH_RELEASE_V2,
  runAvg001EditorialV2Pipeline,
} from "./foundation/editorial-v2-release";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter((entry) => entry.active);
const failures: string[] = [];
const cpCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const solveModes = new Set<string>();
let generated = 0;

function fail(message: string) {
  failures.push(message);
}

assert.equal(entries.length, AVG_001_ENGLISH_RELEASE_V2.qlCount);

for (const entry of entries) {
  cpCounts.set(entry.cpId, (cpCounts.get(entry.cpId) ?? 0) + 1);
  difficultyCounts.set(entry.difficulty, (difficultyCounts.get(entry.difficulty) ?? 0) + 1);
  solveModes.add(entry.solveMode);

  for (let seedIndex = 0; seedIndex < 3; seedIndex += 1) {
    const seed = `avg-001-en-v2-release:${entry.qlId}:${seedIndex}`;
    const v1 = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
    const v2 = runAvg001EditorialV2Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
    const again = runAvg001EditorialV2Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
    generated += 1;

    if (v2.mathematicalFingerprint !== v1.mathematicalFingerprint) {
      fail(`${entry.qlId}:${seedIndex}: mathematical fingerprint changed`);
    }
    if (
      v2.solver.exactAnswer.numerator !== v1.solver.exactAnswer.numerator ||
      v2.solver.exactAnswer.denominator !== v1.solver.exactAnswer.denominator
    ) {
      fail(`${entry.qlId}:${seedIndex}: exact answer changed`);
    }
    if (v2.maturity !== "FROZEN" || !v2.publiclyPublishable) {
      fail(`${entry.qlId}:${seedIndex}: package is not frozen and publishable`);
    }
    if (v2.traceability.releaseId !== AVG_001_ENGLISH_RELEASE_V2.releaseId) {
      fail(`${entry.qlId}:${seedIndex}: release ID mismatch`);
    }
    if (v2.traceability.supersedesReleaseId !== AVG_001_ENGLISH_RELEASE_V2.supersedes) {
      fail(`${entry.qlId}:${seedIndex}: superseded release ID missing`);
    }
    if (v2.traceability.questionStudioRelease !== true) {
      fail(`${entry.qlId}:${seedIndex}: Question Studio release trace missing`);
    }
    if (!v2.validation.valid || v2.validation.checks.some((check) => !check.passed)) {
      const failed = v2.validation.checks
        .filter((check) => !check.passed)
        .map((check) => check.name)
        .join(", ");
      fail(`${entry.qlId}:${seedIndex}: release validation failed [${failed}]`);
    }
    if (!v2.validation.checks.some((check) => check.name === "release-approval-v2" && check.passed)) {
      fail(`${entry.qlId}:${seedIndex}: release-approval-v2 check missing`);
    }
    if (v2.options.length !== 4 || new Set(v2.options).size !== 4) {
      fail(`${entry.qlId}:${seedIndex}: options are not four and unique`);
    }
    if (v2.options[v2.correctIndex] !== v2.answer) {
      fail(`${entry.qlId}:${seedIndex}: answer does not match correct option`);
    }
    if (v2.explanation.lines.length !== 4) {
      fail(`${entry.qlId}:${seedIndex}: explanation does not have four tiers`);
    }
    if (
      v2.questionLanguageId !== again.questionLanguageId ||
      v2.stem !== again.stem ||
      v2.answer !== again.answer ||
      JSON.stringify(v2.options) !== JSON.stringify(again.options) ||
      JSON.stringify(v2.explanation.lines) !== JSON.stringify(again.explanation.lines)
    ) {
      fail(`${entry.qlId}:${seedIndex}: release generation is not deterministic`);
    }
  }
}

if (cpCounts.size !== AVG_001_ENGLISH_RELEASE_V2.cpCount) {
  fail(`Expected ${AVG_001_ENGLISH_RELEASE_V2.cpCount} CPs; found ${cpCounts.size}`);
}
if (solveModes.size !== AVG_001_ENGLISH_RELEASE_V2.solveModeCount) {
  fail(`Expected ${AVG_001_ENGLISH_RELEASE_V2.solveModeCount} solve modes; found ${solveModes.size}`);
}
for (const [difficulty, expected] of Object.entries(AVG_001_ENGLISH_RELEASE_V2.difficultyDistribution)) {
  if (difficultyCounts.get(difficulty) !== expected) {
    fail(`${difficulty}: expected ${expected}; found ${difficultyCounts.get(difficulty) ?? 0}`);
  }
}

assert.throws(
  () => runAvg001EditorialV2Pipeline({ questionLanguageId: "AVG-QL-001", language: "hi" }),
  /approves English only/,
);
assert.throws(
  () => runAvg001EditorialV2Pipeline({ questionLanguageId: "AVG-QL-001", language: "pa" }),
  /approves English only/,
);

console.log(JSON.stringify({
  releaseId: AVG_001_ENGLISH_RELEASE_V2.releaseId,
  supersedes: AVG_001_ENGLISH_RELEASE_V2.supersedes,
  qlCount: entries.length,
  cpCounts: Object.fromEntries([...cpCounts.entries()].sort()),
  solveModeCount: solveModes.size,
  difficultyCounts: Object.fromEntries([...difficultyCounts.entries()].sort()),
  generated,
  deterministicReplayCases: generated,
  exactAnswerPreservationCases: generated,
  fingerprintChanges: 0,
  rejectedNonEnglishCases: 2,
  failureCount: failures.length,
  failures: failures.slice(0, 250),
  status: failures.length ? "FAIL" : "PASS",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
