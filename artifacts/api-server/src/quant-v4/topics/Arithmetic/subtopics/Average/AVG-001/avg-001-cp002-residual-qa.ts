import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-002",
);
const failures: string[] = [];
const modeCounts: Record<string, number> = {};
const difficultyCounts: Record<string, number> = {};
const fingerprints = new Set<string>();

for (let index = 0; index < 1000; index += 1) {
  const entry = entries[index % entries.length]!;
  const pkg = runAvg001Pipeline({
    questionLanguageId: entry.qlId,
    seed: `avg-cp002-residual:${index}`,
  });

  if (!pkg.validation.valid) {
    failures.push(`${entry.qlId}:${index}: validation failed`);
  }
  if (pkg.options.length !== 4 || new Set(pkg.options).size !== 4) {
    failures.push(`${entry.qlId}:${index}: invalid options`);
  }
  if (pkg.options[pkg.correctIndex] !== pkg.answer) {
    failures.push(`${entry.qlId}:${index}: correct-index mismatch`);
  }
  if (/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem)) {
    failures.push(`${entry.qlId}:${index}: unresolved/internal stem value`);
  }
  modeCounts[pkg.solveMode] = (modeCounts[pkg.solveMode] ?? 0) + 1;
  difficultyCounts[pkg.difficultyBand] =
    (difficultyCounts[pkg.difficultyBand] ?? 0) + 1;
  fingerprints.add(pkg.mathematicalFingerprint);
}

for (const mode of [
  "findAverageOfConsecutiveSet",
  "findMiddleTermFromAverage",
  "findExtremeFromAverageAndCount",
  "findAverageOfOddOrEvenSet",
]) {
  assert((modeCounts[mode] ?? 0) > 0, `${mode} not reached`);
}

console.log(
  JSON.stringify(
    {
      cases: 1000,
      uniqueFingerprints: fingerprints.size,
      modeCounts,
      difficultyCounts,
      failureCount: failures.length,
      failures: failures.slice(0, 100),
    },
    null,
    2,
  ),
);
assert.equal(failures.length, 0, failures.join("\n"));
