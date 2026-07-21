import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import {
  add,
  equals,
  multiply,
  rational,
  subtract,
  toNumber,
} from "./foundation/math";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-003",
);
assert.equal(entries.length, 14);

const modes = new Map<string, number>();
const strategiesByMode = new Map<string, Set<string>>();
const normalizedStems = new Set<string>();
const failures: string[] = [];
let cases = 0;

function normalizeStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\{[a-z0-9_]+\}/gi, "#")
    .replace(/\s+/g, " ")
    .trim();
}

function presentNumbers(values: Array<unknown>) {
  return values
    .filter((value): value is NonNullable<typeof value> => value != null)
    .map((value) => toNumber(value as Parameters<typeof toNumber>[0]));
}

for (const entry of entries) {
  modes.set(entry.solveMode, (modes.get(entry.solveMode) ?? 0) + 1);
  const strategies = strategiesByMode.get(entry.solveMode) ?? new Set<string>();
  strategies.add(entry.explanationStrategyId);
  strategiesByMode.set(entry.solveMode, strategies);

  const normalizedStem = normalizeStem(entry.template);
  if (normalizedStems.has(normalizedStem)) {
    failures.push(`${entry.qlId}: duplicate normalized stem`);
  }
  normalizedStems.add(normalizedStem);

  for (let index = 0; index < 12; index += 1) {
    const pkg = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed: `avg-cp003-proof:${entry.qlId}:${index}`,
    });
    cases += 1;
    const v = pkg.parameters.values;
    const oldAverageAtChange =
      entry.scenarioVariant.includes("Years") ||
      entry.scenarioVariant.includes("Elapsed")
        ? add(v.oldAverage!, rational(v.elapsedYears ?? 0))
        : v.oldAverage!;
    const oldTotal = multiply(oldAverageAtChange, rational(v.oldCount!));
    const newTotal = multiply(v.newAverage!, rational(v.newCount!));

    if (
      entry.solveMode === "findNewAverageAfterAddition" ||
      (entry.solveMode === "findInningsValueOrNewCricketAverage" &&
        v.targetKind === "newAverage")
    ) {
      if (!equals(add(oldTotal, v.addedValue!), newTotal)) {
        failures.push(`${entry.qlId}:${index}: addition invariant`);
      }
    }
    if (entry.solveMode === "findNewAverageAfterRemoval") {
      if (!equals(subtract(oldTotal, v.removedValue!), newTotal)) {
        failures.push(`${entry.qlId}:${index}: removal invariant`);
      }
    }
    if (entry.solveMode === "findNewAverageAfterReplacement") {
      if (
        !equals(
          add(subtract(oldTotal, v.outgoingValue!), v.incomingValue!),
          newTotal,
        )
      ) {
        failures.push(`${entry.qlId}:${index}: replacement invariant`);
      }
    }
    if (
      entry.solveMode === "findAddedMemberValueFromShift" ||
      (entry.solveMode === "findInningsValueOrNewCricketAverage" &&
        v.targetKind === "memberValue")
    ) {
      if (!equals(add(oldTotal, pkg.solver.exactAnswer), newTotal)) {
        failures.push(`${entry.qlId}:${index}: reverse addition invariant`);
      }
    }
    if (entry.solveMode === "findRemovedMemberValueFromShift") {
      if (!equals(subtract(oldTotal, pkg.solver.exactAnswer), newTotal)) {
        failures.push(`${entry.qlId}:${index}: reverse removal invariant`);
      }
    }
    if (entry.solveMode === "findReplacementValueFromShift") {
      if (
        !equals(
          add(subtract(oldTotal, v.outgoingValue!), pkg.solver.exactAnswer),
          newTotal,
        )
      ) {
        failures.push(`${entry.qlId}:${index}: reverse replacement invariant`);
      }
    }

    if (entry.contextDomain === "Classroom") {
      for (const value of presentNumbers([
        v.oldAverage,
        v.newAverage,
        v.addedValue,
        v.removedValue,
        v.outgoingValue,
        v.incomingValue,
      ])) {
        if (value < 0 || value > 100) {
          failures.push(
            `${entry.qlId}:${index}: classroom value ${value} outside 0–100`,
          );
        }
      }
    }

    if (
      entry.scenarioVariant === "familyAgeElapsedTime" ||
      entry.scenarioVariant === "newbornAfterElapsedYears"
    ) {
      const childAge = toNumber(v.addedValue!);
      if (childAge < 1 || childAge > 18) {
        failures.push(
          `${entry.qlId}:${index}: child age ${childAge} outside 1–18`,
        );
      }
    }
    if (entry.scenarioVariant === "memberLeavesAfterYears") {
      const leavingAge = toNumber(v.removedValue!);
      if (leavingAge < 18 || leavingAge > 90) {
        failures.push(
          `${entry.qlId}:${index}: leaving age ${leavingAge} outside 18–90`,
        );
      }
    }

    if (entry.contextDomain === "Workplace") {
      for (const value of presentNumbers([
        v.oldAverage,
        v.newAverage,
        v.removedValue,
      ])) {
        if (value < 10000 || value % 500 !== 0) {
          failures.push(
            `${entry.qlId}:${index}: salary value ${value} is not a realistic ₹500 increment`,
          );
        }
      }
      if (!/₹\d{2},\d{3}/.test(pkg.stem)) {
        failures.push(`${entry.qlId}:${index}: salary stem lacks Indian grouping`);
      }
    }

    if (pkg.stem.length > 220) {
      failures.push(`${entry.qlId}:${index}: stem too long`);
    }
    if (
      pkg.explanation.lines.length < 4 ||
      pkg.explanation.lines.length > 7
    ) {
      failures.push(`${entry.qlId}:${index}: explanation length`);
    }
    if (!pkg.explanation.lines.some((line) => line.includes(pkg.answer))) {
      failures.push(`${entry.qlId}:${index}: answer missing from explanation`);
    }
    if (new Set(pkg.options).size !== 4) {
      failures.push(`${entry.qlId}:${index}: duplicate options`);
    }
  }
}

for (const [mode, count] of modes) {
  assert.equal(count, 2, `${mode} proof allocation`);
  assert.equal(
    strategiesByMode.get(mode)?.size,
    2,
    `${mode} explanation strategy variation`,
  );
}
assert.equal(normalizedStems.size, 14);
assert.equal(entries.filter((entry) => entry.contextDomain === "Sports").length, 2);
assert.equal(
  entries.filter((entry) =>
    entry.scenarioVariant.toLowerCase().includes("years"),
  ).length >= 2,
  true,
);
assert.equal(cases, 168);
assert.equal(failures.length, 0, failures.join("\n"));
console.log(
  JSON.stringify(
    {
      qlCount: entries.length,
      cases,
      uniqueStems: normalizedStems.size,
      modes: Object.fromEntries(modes),
      strategyCounts: Object.fromEntries(
        [...strategiesByMode].map(([mode, strategies]) => [mode, strategies.size]),
      ),
      failures,
    },
    null,
    2,
  ),
);
