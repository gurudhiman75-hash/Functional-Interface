import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { equals, multiply, rational, add, subtract } from "./foundation/math";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-003");
assert.equal(entries.length, 14);

const modes = new Map<string, number>();
const failures: string[] = [];
let cases = 0;

for (const entry of entries) {
  modes.set(entry.solveMode, (modes.get(entry.solveMode) ?? 0) + 1);
  for (let index = 0; index < 12; index += 1) {
    const pkg = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed: `avg-cp003-proof:${entry.qlId}:${index}`,
    });
    cases += 1;
    const v = pkg.parameters.values;
    const oldAverageAtChange = entry.scenarioVariant.includes("Years") || entry.scenarioVariant.includes("Elapsed")
      ? add(v.oldAverage!, rational(v.elapsedYears ?? 0))
      : v.oldAverage!;
    const oldTotal = multiply(oldAverageAtChange, rational(v.oldCount!));
    const newTotal = multiply(v.newAverage!, rational(v.newCount!));

    if (entry.solveMode === "findNewAverageAfterAddition" || (entry.solveMode === "findInningsValueOrNewCricketAverage" && v.targetKind === "newAverage")) {
      if (!equals(add(oldTotal, v.addedValue!), newTotal)) failures.push(`${entry.qlId}:${index}: addition invariant`);
    }
    if (entry.solveMode === "findNewAverageAfterRemoval") {
      if (!equals(subtract(oldTotal, v.removedValue!), newTotal)) failures.push(`${entry.qlId}:${index}: removal invariant`);
    }
    if (entry.solveMode === "findNewAverageAfterReplacement") {
      if (!equals(add(subtract(oldTotal, v.outgoingValue!), v.incomingValue!), newTotal)) failures.push(`${entry.qlId}:${index}: replacement invariant`);
    }
    if (entry.solveMode === "findAddedMemberValueFromShift" || (entry.solveMode === "findInningsValueOrNewCricketAverage" && v.targetKind === "memberValue")) {
      if (!equals(add(oldTotal, pkg.solver.exactAnswer), newTotal)) failures.push(`${entry.qlId}:${index}: reverse addition invariant`);
    }
    if (entry.solveMode === "findRemovedMemberValueFromShift") {
      if (!equals(subtract(oldTotal, pkg.solver.exactAnswer), newTotal)) failures.push(`${entry.qlId}:${index}: reverse removal invariant`);
    }
    if (entry.solveMode === "findReplacementValueFromShift") {
      if (!equals(add(subtract(oldTotal, v.outgoingValue!), pkg.solver.exactAnswer), newTotal)) failures.push(`${entry.qlId}:${index}: reverse replacement invariant`);
    }

    if (pkg.stem.length > 220) failures.push(`${entry.qlId}:${index}: stem too long`);
    if (pkg.explanation.lines.length < 4 || pkg.explanation.lines.length > 7) failures.push(`${entry.qlId}:${index}: explanation length`);
    if (new Set(pkg.options).size !== 4) failures.push(`${entry.qlId}:${index}: duplicate options`);
  }
}

for (const [mode, count] of modes) assert.equal(count, 2, `${mode} proof allocation`);
assert.equal(entries.filter((entry) => entry.contextDomain === "Sports").length, 2);
assert.equal(entries.filter((entry) => entry.scenarioVariant.toLowerCase().includes("years")).length >= 2, true);
assert.equal(cases, 168);
assert.equal(failures.length, 0, failures.join("\n"));
console.log(JSON.stringify({ qlCount: entries.length, cases, modes: Object.fromEntries(modes), failures }, null, 2));
