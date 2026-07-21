import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-003",
);
const failures: string[] = [];
let cases = 0;

for (const entry of entries) {
  for (let index = 0; index < 3; index += 1) {
    const pkg = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed: `avg-cp003-explanation:${entry.qlId}:${index}`,
    });
    cases += 1;
    const text = pkg.explanation.lines.join(" ");
    const nonFormula = text.replace(/\$\$.*?\$\$/g, "");
    if (pkg.explanation.lines.length < 4 || pkg.explanation.lines.length > 7) {
      failures.push(`${entry.qlId}:${index}: wrong explanation length`);
    }
    if (!text.includes(pkg.answer)) {
      failures.push(`${entry.qlId}:${index}: answer missing from explanation`);
    }
    if (
      !/[+\-×÷]|\\times|\\div/.test(text)
    ) {
      failures.push(`${entry.qlId}:${index}: arithmetic missing`);
    }
    if (/undefined|NaN|Infinity|null|\{[A-Za-z][A-Za-z0-9_]*\}/.test(nonFormula)) {
      failures.push(`${entry.qlId}:${index}: unresolved/internal token`);
    }
    if (
      entry.scenarioVariant.includes("AfterYears") ||
      entry.scenarioVariant.includes("ElapsedYears")
    ) {
      if (!text.toLowerCase().includes("after")) {
        failures.push(`${entry.qlId}:${index}: age shift not explained`);
      }
    }
  }
}

console.log(
  JSON.stringify(
    { qlCount: entries.length, cases, failureCount: failures.length, failures },
    null,
    2,
  ),
);
assert.equal(cases, 258);
assert.equal(failures.length, 0, failures.join("\n"));
