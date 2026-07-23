import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-003",
);
const failures: string[] = [];
const modeCounts = new Map<string, number>();
const scenarioCounts = new Map<string, number>();
let generated = 0;

for (let index = 0; index < 1500; index += 1) {
  const entry = entries[index % entries.length]!;
  try {
    const pkg = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed: `avg-cp003-residual:${index}`,
    });
    generated += 1;
    modeCounts.set(
      pkg.solveMode,
      (modeCounts.get(pkg.solveMode) ?? 0) + 1,
    );
    scenarioCounts.set(
      pkg.parameters.scenarioVariant,
      (scenarioCounts.get(pkg.parameters.scenarioVariant) ?? 0) + 1,
    );
    if (!pkg.validation.valid) failures.push(`${entry.qlId}:${index}: invalid`);
    if (pkg.options.length !== 4 || new Set(pkg.options).size !== 4) {
      failures.push(`${entry.qlId}:${index}: bad options`);
    }
    if (pkg.options[pkg.correctIndex] !== pkg.answer) {
      failures.push(`${entry.qlId}:${index}: wrong correct index`);
    }
    if (/undefined|NaN|Infinity|null|\{[A-Za-z]/.test(pkg.stem)) {
      failures.push(`${entry.qlId}:${index}: unresolved stem`);
    }
  } catch (error) {
    failures.push(
      `${entry.qlId}:${index}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

for (const mode of new Set(entries.map((entry) => entry.solveMode))) {
  if (!modeCounts.get(mode)) failures.push(`Unreached mode ${mode}`);
}
for (const variant of new Set(entries.map((entry) => entry.scenarioVariant))) {
  if (!scenarioCounts.get(variant)) failures.push(`Unreached variant ${variant}`);
}

console.log(
  JSON.stringify(
    {
      generated,
      modeCounts: Object.fromEntries(modeCounts),
      scenarioCount: scenarioCounts.size,
      failureCount: failures.length,
      failures: failures.slice(0, 100),
    },
    null,
    2,
  ),
);
assert.equal(generated, 1500);
assert.equal(failures.length, 0, failures.join("\n"));
