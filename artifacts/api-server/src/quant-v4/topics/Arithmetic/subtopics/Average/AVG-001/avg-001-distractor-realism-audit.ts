import { strict as assert } from "node:assert";
import { getAvg001QuestionLanguageIds } from "./foundation/library";
import { toNumber } from "./foundation/math";
import { runAvg001Pipeline } from "./foundation/pipeline";

const genericFallbackStrategies = new Set([
  "misconception:one-display-step-low",
  "misconception:one-display-step-high",
  "misconception:double-counted-result",
  "misconception:halved-result",
]);

const boundedCombinedAverageModes = new Set([
  "findCombinedAverageOfTwoGroups",
  "findCombinedAverageOfThreeOrFourGroups",
  "findClassAverageFromSectionAverages",
  "findSuperGroupAverageFromSubgroups",
]);

function numericOption(option: string) {
  const normalized = option.replace(/[₹,]/g, "");
  const match = normalized.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : Number.NaN;
}

const failures: string[] = [];
const strategiesByMode = new Map<string, Set<string>>();
let cases = 0;

for (const questionLanguageId of getAvg001QuestionLanguageIds()) {
  for (let index = 0; index < 2; index += 1) {
    const seed = `avg-distractor-realism:${questionLanguageId}:${index}`;
    const pkg = runAvg001Pipeline({ questionLanguageId, seed });
    cases += 1;

    if (pkg.options.length !== 4) failures.push(`${questionLanguageId}:${index}: expected four options`);
    if (new Set(pkg.options).size !== 4) failures.push(`${questionLanguageId}:${index}: options are not unique`);
    if (pkg.options[pkg.correctIndex] !== pkg.answer) failures.push(`${questionLanguageId}:${index}: correct index mismatch`);
    if (pkg.options.filter((option) => option === pkg.answer).length !== 1) failures.push(`${questionLanguageId}:${index}: answer does not appear exactly once`);

    if (boundedCombinedAverageModes.has(pkg.solveMode)) {
      const averages = pkg.parameters.values.groupAverages ?? pkg.parameters.values.subgroupAverages ?? [];
      const minimum = Math.min(...averages.map(toNumber));
      const maximum = Math.max(...averages.map(toNumber));
      for (const option of pkg.options) {
        const numeric = numericOption(option);
        if (!Number.isFinite(numeric) || numeric < minimum - 0.51 || numeric > maximum + 0.51) {
          failures.push(`${questionLanguageId}:${index}: weighted-average option outside supplied range ${minimum}–${maximum}: ${option}`);
        }
      }
    }

    if (pkg.traceability.distractorPolicy !== "MISCONCEPTION_V1") {
      failures.push(`${questionLanguageId}:${index}: missing misconception distractor policy`);
    }

    const strategies = pkg.traceability.distractorStrategyIds;
    if (!Array.isArray(strategies) || strategies.length !== 3) {
      failures.push(`${questionLanguageId}:${index}: expected three distractor strategy IDs`);
      continue;
    }
    if (new Set(strategies).size !== 3) {
      failures.push(`${questionLanguageId}:${index}: distractor strategy IDs are not unique`);
    }
    if (strategies.some((strategy) => typeof strategy !== "string" || !strategy.startsWith("misconception:"))) {
      failures.push(`${questionLanguageId}:${index}: invalid distractor strategy ID`);
    }
    const primaryCount = strategies.filter((strategy) => !genericFallbackStrategies.has(strategy)).length;
    if (primaryCount < 2) {
      failures.push(`${questionLanguageId}:${index}: fewer than two solve-mode-specific distractors: ${strategies.join(", ")}`);
    }

    const modeStrategies = strategiesByMode.get(pkg.solveMode) ?? new Set<string>();
    for (const strategy of strategies) modeStrategies.add(strategy);
    strategiesByMode.set(pkg.solveMode, modeStrategies);

    const repeated = runAvg001Pipeline({ questionLanguageId, seed });
    if (JSON.stringify(repeated.options) !== JSON.stringify(pkg.options) || repeated.correctIndex !== pkg.correctIndex) {
      failures.push(`${questionLanguageId}:${index}: option generation is not deterministic`);
    }

    if (!pkg.validation.checks.some((check) => check.name === "distractor-realism" && check.passed)) {
      failures.push(`${questionLanguageId}:${index}: validation does not record distractor realism`);
    }
  }
}

for (const [solveMode, strategies] of strategiesByMode) {
  if (strategies.size < 3) failures.push(`${solveMode}: only ${strategies.size} distinct misconception strategies`);
}

console.log(JSON.stringify({
  qlCount: getAvg001QuestionLanguageIds().length,
  cases,
  solveModeCount: strategiesByMode.size,
  strategyCountsByMode: Object.fromEntries(
    [...strategiesByMode.entries()].map(([solveMode, strategies]) => [solveMode, strategies.size]),
  ),
  failureCount: failures.length,
  failures: failures.slice(0, 200),
  status: failures.length ? "FAIL" : "PASS",
}, null, 2));

assert.equal(getAvg001QuestionLanguageIds().length, 425);
assert.equal(failures.length, 0, failures.join("\n"));
