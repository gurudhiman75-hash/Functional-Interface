import { strict as assert } from "node:assert";

import {
  AVG_001_CP_DIFFICULTY_TARGETS,
  AVG_001_EXAM_DIFFICULTY_CALIBRATION,
} from "./foundation/difficulty-calibration";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";
import { AVG_001_ENGLISH_RELEASE } from "./foundation/release";

const expectedCpDifficulty = AVG_001_CP_DIFFICULTY_TARGETS;
const expectedChapterDifficulty = AVG_001_EXAM_DIFFICULTY_CALIBRATION.calibratedChapterSplit;
const entries = getAvg001QuestionEntries();
const failures: string[] = [];
const canonicalStems = new Map<string, string[]>();
const cpIds = Object.keys(expectedCpDifficulty);
let generated = 0;

function fail(message: string) {
  failures.push(message);
}

function normalizeStem(stem: string) {
  return stem.toLowerCase().replace(/\s+/g, " ").trim();
}

function normalizeAnswerEvidence(value: string) {
  return value.toLowerCase().replace(/[₹,\s]/g, "");
}

function hasInternalToken(value: string) {
  return /undefined|NaN|Infinity|null|\{[A-Za-z][A-Za-z0-9_]*\}/.test(value);
}

if (AVG_001_ENGLISH_RELEASE.status !== "FROZEN") fail("release status is not FROZEN");
if (AVG_001_ENGLISH_RELEASE.editorialStatus !== "APPROVED") fail("editorial status is not APPROVED");
if (!AVG_001_ENGLISH_RELEASE.publiclyPublishable) fail("release is not publicly publishable");
if (AVG_001_ENGLISH_RELEASE.language !== "en") fail("release language is not English");
if (AVG_001_ENGLISH_RELEASE.qlCount !== 425) fail("release QL count is not 425");
if (AVG_001_ENGLISH_RELEASE.cpCount !== 6) fail("release CP count is not 6");

if (entries.length !== 425) fail(`expected 425 QLs; got ${entries.length}`);
if (new Set(entries.map((entry) => entry.qlId)).size !== 425) fail("QL IDs are not unique");
const expectedQlIds = Array.from(
  { length: 425 },
  (_, index) => `AVG-QL-${String(index + 1).padStart(3, "0")}`,
);
if (JSON.stringify(entries.map((entry) => entry.qlId)) !== JSON.stringify(expectedQlIds)) {
  fail("QL IDs are not the locked consecutive AVG-QL-001…AVG-QL-425 sequence");
}
if (entries.some((entry) => !entry.active)) fail("one or more English QLs are inactive");

for (const cpId of cpIds) {
  const expected = expectedCpDifficulty[cpId as keyof typeof expectedCpDifficulty];
  const expectedTotal = expected.Easy + expected.Medium + expected.Hard;
  const cpEntries = entries.filter((entry) => entry.cpId === cpId);
  if (cpEntries.length !== expectedTotal) {
    fail(`${cpId}: expected ${expectedTotal} QLs; got ${cpEntries.length}`);
  }
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const actual = cpEntries.filter((entry) => entry.difficulty === difficulty).length;
    if (actual !== expected[difficulty]) {
      fail(`${cpId}:${difficulty}: expected ${expected[difficulty]}; got ${actual}`);
    }
  }
}

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const actual = entries.filter((entry) => entry.difficulty === difficulty).length;
  if (actual !== expectedChapterDifficulty[difficulty]) {
    fail(`chapter:${difficulty}: expected ${expectedChapterDifficulty[difficulty]}; got ${actual}`);
  }
}

for (const entry of entries) {
  for (let seedIndex = 0; seedIndex < 3; seedIndex += 1) {
    const seed = `avg-freeze:${entry.qlId}:${seedIndex}`;
    const pkg = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed,
      language: "en",
    });
    const repeated = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed,
      language: "en",
    });
    generated += 1;

    if (pkg.maturity !== "FROZEN") fail(`${entry.qlId}:${seedIndex}: maturity is ${pkg.maturity}`);
    if (!pkg.publiclyPublishable) fail(`${entry.qlId}:${seedIndex}: package is not publishable`);
    if (!pkg.validation.valid || pkg.validation.checks.some((check) => !check.passed)) {
      fail(`${entry.qlId}:${seedIndex}: validation failed`);
    }
    if (!pkg.validation.checks.some((check) => check.name === "release-approval" && check.passed)) {
      fail(`${entry.qlId}:${seedIndex}: missing release approval validation`);
    }
    if (pkg.traceability.releaseId !== AVG_001_ENGLISH_RELEASE.releaseId) {
      fail(`${entry.qlId}:${seedIndex}: wrong release ID`);
    }
    if (pkg.traceability.editorialStatus !== "APPROVED") {
      fail(`${entry.qlId}:${seedIndex}: editorial approval missing`);
    }
    if (pkg.traceability.approvedLanguage !== "en") {
      fail(`${entry.qlId}:${seedIndex}: approved language is not English`);
    }
    if (pkg.traceability.distractorPolicy !== "MISCONCEPTION_V1") {
      fail(`${entry.qlId}:${seedIndex}: misconception distractor policy missing`);
    }
    if (pkg.options.length !== 4 || new Set(pkg.options).size !== 4) {
      fail(`${entry.qlId}:${seedIndex}: options are not four and unique`);
    }
    if (pkg.options[pkg.correctIndex] !== pkg.answer) {
      fail(`${entry.qlId}:${seedIndex}: correct index mismatch`);
    }
    if (pkg.options.filter((option) => option === pkg.answer).length !== 1) {
      fail(`${entry.qlId}:${seedIndex}: canonical answer does not appear exactly once`);
    }
    if (hasInternalToken(pkg.stem)) fail(`${entry.qlId}:${seedIndex}: unresolved/internal stem token`);
    if (pkg.explanation.lines.length < 4 || pkg.explanation.lines.length > 8) {
      fail(`${entry.qlId}:${seedIndex}: explanation depth outside 4–8 lines`);
    }
    const answerEvidence = normalizeAnswerEvidence(pkg.answer);
    const explanationEvidence = normalizeAnswerEvidence(pkg.explanation.lines.join(" "));
    if (!answerEvidence || !explanationEvidence.includes(answerEvidence)) {
      fail(`${entry.qlId}:${seedIndex}: explanation omits final answer evidence`);
    }
    if (
      pkg.stem !== repeated.stem ||
      pkg.answer !== repeated.answer ||
      pkg.correctIndex !== repeated.correctIndex ||
      JSON.stringify(pkg.options) !== JSON.stringify(repeated.options) ||
      JSON.stringify(pkg.explanation) !== JSON.stringify(repeated.explanation) ||
      JSON.stringify(pkg.parameters) !== JSON.stringify(repeated.parameters)
    ) {
      fail(`${entry.qlId}:${seedIndex}: generation is not deterministic`);
    }

    if (seedIndex === 0) {
      const normalized = normalizeStem(pkg.stem);
      canonicalStems.set(normalized, [...(canonicalStems.get(normalized) ?? []), entry.qlId]);
    }
  }

  for (const language of ["hi", "pa"] as const) {
    try {
      runAvg001Pipeline({
        questionLanguageId: entry.qlId,
        seed: `avg-freeze-unsupported:${entry.qlId}:${language}`,
        language,
      });
      fail(`${entry.qlId}:${language}: unsupported language generated successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/English only|supports English|approves English only/.test(message)) {
        fail(`${entry.qlId}:${language}: unexpected rejection message: ${message}`);
      }
    }
  }
}

const duplicateStemGroups = [...canonicalStems.entries()].filter(([, qlIds]) => qlIds.length > 1);
for (const [stem, qlIds] of duplicateStemGroups) {
  fail(`cross-QL exact rendered stem duplicate: ${qlIds.join(", ")} :: ${stem}`);
}

console.log(JSON.stringify({
  releaseId: AVG_001_ENGLISH_RELEASE.releaseId,
  status: AVG_001_ENGLISH_RELEASE.status,
  editorialStatus: AVG_001_ENGLISH_RELEASE.editorialStatus,
  language: AVG_001_ENGLISH_RELEASE.language,
  difficultyCalibration: AVG_001_EXAM_DIFFICULTY_CALIBRATION.version,
  qlCount: entries.length,
  cpCount: cpIds.length,
  generated,
  unsupportedLanguageChecks: entries.length * 2,
  duplicateStemGroups: duplicateStemGroups.length,
  failureCount: failures.length,
  failures: failures.slice(0, 200),
  verdict: failures.length ? "NOT FREEZE READY" : "APPROVED / PASS — ENGLISH FREEZE READY",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
