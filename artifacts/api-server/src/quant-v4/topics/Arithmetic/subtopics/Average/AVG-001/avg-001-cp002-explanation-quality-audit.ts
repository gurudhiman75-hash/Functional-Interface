import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const failures: string[] = [];
let cases = 0;
const strategiesByMode = new Map<string, Set<string>>();
const skeletonsByMode = new Map<string, Set<string>>();

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/\$\$.*?\$\$/gs, "[formula]")
    .replace(/[0-9]+(?:\.[0-9]+)?/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}

function conceptPattern(mode: string) {
  if (mode === "findMiddleTermFromAverage") {
    return /middle|central|symmetr|balance|average/i;
  }
  if (mode === "findExtremeFromAverageAndCount") {
    return /gap|span|offset|extreme|endpoint|average|centre/i;
  }
  if (mode === "findTermCountFromAverageAndExtreme") {
    return /equally spaced|midway|extreme|one-side gaps|other side|number of terms/i;
  }
  if (mode === "findCommonDifferenceFromAverageCountAndExtreme") {
    return /extreme|series span|one-side gaps|equal spacing|common difference/i;
  }
  return /equally spaced|arithmetic progression|endpoint|first and last|halfway|centre|balance|opposite ends/i;
}

const reverseModes = new Set([
  "findTermCountFromAverageAndExtreme",
  "findCommonDifferenceFromAverageCountAndExtreme",
]);

const entries = getAvg001QuestionEntries().filter(
  (item) => item.cpId === "AVG-CP-002",
);
assert.equal(entries.length, 62);

for (const entry of entries) {
  const strategies = strategiesByMode.get(entry.solveMode) ?? new Set<string>();
  strategies.add(entry.explanationStrategyId);
  strategiesByMode.set(entry.solveMode, strategies);

  for (let index = 0; index < 3; index += 1) {
    const pkg = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed: `avg-explanation:${entry.qlId}:${index}`,
    });
    cases += 1;
    const lines = pkg.explanation.lines;
    const joined = lines.join("\n");

    if (lines.length < 4 || lines.length > 8) {
      failures.push(
        `${entry.qlId}:${index}: ${lines.length} explanation lines; expected 4–8`,
      );
    }
    if (!joined.includes(pkg.answer)) {
      failures.push(`${entry.qlId}:${index}: final answer absent`);
    }
    if (!/[0-9]/.test(joined)) {
      failures.push(`${entry.qlId}:${index}: no numeric substitution`);
    }
    if (!/[×÷+\-−=]|\\times|\\div/.test(joined)) {
      failures.push(`${entry.qlId}:${index}: no mathematical relation`);
    }
    if (!conceptPattern(entry.solveMode).test(joined)) {
      failures.push(`${entry.qlId}:${index}: AP concept not explained`);
    }
    if (/^(setup|calculation|answer|apply formula)\b/im.test(joined)) {
      failures.push(`${entry.qlId}:${index}: generic explanation shell`);
    }

    const skeletons = skeletonsByMode.get(entry.solveMode) ?? new Set<string>();
    skeletons.add(normalize(joined));
    skeletonsByMode.set(entry.solveMode, skeletons);
  }
}

for (const [mode, strategies] of strategiesByMode) {
  const requiredVariety = reverseModes.has(mode) ? 1 : 3;
  if (strategies.size < requiredVariety) {
    failures.push(`${mode}: only ${strategies.size} explanation strategies`);
  }
  const skeletonCount = skeletonsByMode.get(mode)?.size ?? 0;
  if (skeletonCount < requiredVariety) {
    failures.push(`${mode}: only ${skeletonCount} explanation structures`);
  }
}

console.log(
  JSON.stringify(
    {
      cases,
      strategyCounts: Object.fromEntries(
        [...strategiesByMode].map(([mode, strategies]) => [mode, strategies.size]),
      ),
      skeletonCounts: Object.fromEntries(
        [...skeletonsByMode].map(([mode, skeletons]) => [mode, skeletons.size]),
      ),
      failureCount: failures.length,
      failures: failures.slice(0, 100),
    },
    null,
    2,
  ),
);
assert.equal(cases, 186);
assert.equal(failures.length, 0, failures.join("\n"));
