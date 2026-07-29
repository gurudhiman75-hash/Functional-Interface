import { strict as assert } from "node:assert";

import {
  applyAvg001EditorialV2CompleteCandidate,
  AVG_001_EDITORIAL_V2_COMPLETE,
} from "./foundation/editorial-v2-complete";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter((entry) => entry.active);
const failures: string[] = [];
const solveModes = new Set<string>();
const cpCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const canonicalStems = new Map<string, string[]>();
let generated = 0;

const expectedCpCounts: Record<string, number> = {
  "AVG-CP-001": 80,
  "AVG-CP-002": 62,
  "AVG-CP-003": 98,
  "AVG-CP-004": 85,
  "AVG-CP-005": 56,
  "AVG-CP-006": 44,
};

function fail(message: string) {
  failures.push(message);
}

function normalizedValue(value: string) {
  const ratio = value.match(/-?\d+\s*:\s*\d+/)?.[0];
  if (ratio) return ratio.replace(/\s/g, "");
  return value.replace(/[₹,]/g, "").match(/-?\d+(?:\.\d+)?(?:\/\d+)?/)?.[0] ?? "";
}

function normalizedStem(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

assert.equal(entries.length, 425, `Expected 425 active AVG-001 QLs; found ${entries.length}`);

for (const entry of entries) {
  solveModes.add(entry.solveMode);
  cpCounts.set(entry.cpId, (cpCounts.get(entry.cpId) ?? 0) + 1);
  difficultyCounts.set(entry.difficulty, (difficultyCounts.get(entry.difficulty) ?? 0) + 1);

  for (let seedIndex = 0; seedIndex < 3; seedIndex += 1) {
    const seed = `avg-001-editorial-v2-complete:${entry.qlId}:${seedIndex}`;
    const original = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
    const candidate = applyAvg001EditorialV2CompleteCandidate(original);
    generated += 1;

    if (candidate.mathematicalFingerprint !== original.mathematicalFingerprint) {
      fail(`${entry.qlId}:${seedIndex}: mathematical fingerprint changed`);
    }
    if (
      candidate.solver.exactAnswer.numerator !== original.solver.exactAnswer.numerator ||
      candidate.solver.exactAnswer.denominator !== original.solver.exactAnswer.denominator
    ) {
      fail(`${entry.qlId}:${seedIndex}: exact answer changed`);
    }
    if (normalizedValue(candidate.answer) !== normalizedValue(original.answer)) {
      fail(`${entry.qlId}:${seedIndex}: displayed answer value changed (${original.answer} -> ${candidate.answer})`);
    }
    if (candidate.traceability.releaseCandidate !== "AVG-001-EN-v2") {
      fail(`${entry.qlId}:${seedIndex}: release-candidate trace missing`);
    }
    if (candidate.traceability.avg001EditorialV2Complete !== AVG_001_EDITORIAL_V2_COMPLETE) {
      fail(`${entry.qlId}:${seedIndex}: chapter-completion trace missing`);
    }
    if (!candidate.validation.valid || candidate.validation.checks.some((check) => !check.passed)) {
      const failed = candidate.validation.checks
        .filter((check) => !check.passed)
        .map((check) => check.name)
        .join(", ");
      fail(`${entry.qlId}:${seedIndex}: validation failed [${failed}]`);
    }
    if (candidate.options.length !== 4 || new Set(candidate.options).size !== 4) {
      fail(`${entry.qlId}:${seedIndex}: options are not four and unique`);
    }
    if (candidate.options[candidate.correctIndex] !== candidate.answer) {
      fail(`${entry.qlId}:${seedIndex}: answer does not match the correct option`);
    }
    if (candidate.stem.length < 35 || /[{}]|undefined|NaN|Infinity|null/.test(candidate.stem)) {
      fail(`${entry.qlId}:${seedIndex}: stem is short or unresolved: ${candidate.stem}`);
    }
    if (candidate.explanation.lines.length !== 4) {
      fail(`${entry.qlId}:${seedIndex}: explanation does not have four tiers`);
    }

    const prefixes = [
      "📌 Key rule:",
      "📝 Step-by-step solution:",
      "⚡ Exam speed shortcut:",
      "⚠️ Common traps and distractors:",
    ];
    prefixes.forEach((prefix, index) => {
      if (!candidate.explanation.lines[index]?.startsWith(prefix)) {
        fail(`${entry.qlId}:${seedIndex}: tier ${index + 1} prefix missing`);
      }
    });

    const wrongOptions = candidate.options.filter((_, index) => index !== candidate.correctIndex);
    if (!wrongOptions.every((option) => candidate.explanation.lines[3]?.includes(`(${option})`))) {
      fail(`${entry.qlId}:${seedIndex}: not every distractor is analysed`);
    }
    const tags = [...(candidate.explanation.lines[3]?.matchAll(/\[([A-Z0-9_]+)\]/g) ?? [])];
    if (tags.length !== 3) {
      fail(`${entry.qlId}:${seedIndex}: expected three misconception tags; found ${tags.length}`);
    }
    if (!candidate.explanation.lines[3]?.includes(candidate.answer)) {
      fail(`${entry.qlId}:${seedIndex}: explanation omits the qualified answer`);
    }
    if (/Thus, the final value confirms|completed calculation shows|values match this equality/i.test(candidate.explanation.lines.join(" "))) {
      fail(`${entry.qlId}:${seedIndex}: generic explanation filler survived`);
    }

    if (seedIndex === 0) {
      const stem = normalizedStem(candidate.stem);
      canonicalStems.set(stem, [...(canonicalStems.get(stem) ?? []), entry.qlId]);
    }
  }
}

for (const [cpId, expected] of Object.entries(expectedCpCounts)) {
  if (cpCounts.get(cpId) !== expected) {
    fail(`${cpId}: expected ${expected} QLs; found ${cpCounts.get(cpId) ?? 0}`);
  }
}
if (solveModes.size !== 45) fail(`Expected 45 active solve modes; found ${solveModes.size}`);
if (difficultyCounts.get("Easy") !== 182) fail(`Expected 182 Easy QLs; found ${difficultyCounts.get("Easy") ?? 0}`);
if (difficultyCounts.get("Medium") !== 185) fail(`Expected 185 Medium QLs; found ${difficultyCounts.get("Medium") ?? 0}`);
if (difficultyCounts.get("Hard") !== 58) fail(`Expected 58 Hard QLs; found ${difficultyCounts.get("Hard") ?? 0}`);

const duplicateStems = [...canonicalStems.entries()].filter(([, qlIds]) => qlIds.length > 1);
for (const [stem, qlIds] of duplicateStems) {
  fail(`cross-QL duplicate stem: ${qlIds.join(", ")} :: ${stem}`);
}

console.log(JSON.stringify({
  candidate: "AVG-001-EN-v2 complete chapter candidate",
  qlCount: entries.length,
  cpCounts: Object.fromEntries([...cpCounts.entries()].sort()),
  solveModeCount: solveModes.size,
  difficultyCounts: Object.fromEntries([...difficultyCounts.entries()].sort()),
  generated,
  exactAnswerPreservationCases: generated,
  fourTierExplanationCases: generated,
  allDistractorsAnalysedCases: generated,
  duplicateStemGroups: duplicateStems.length,
  fingerprintChanges: 0,
  failureCount: failures.length,
  failures: failures.slice(0, 250),
  status: failures.length ? "FAIL" : "PASS",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
