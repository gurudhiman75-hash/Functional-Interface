import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { toNumber } from "./foundation/math";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter(
  (entry) =>
    entry.cpId === "AVG-CP-003" &&
    entry.scenarioVariant === "findChildAgeAfterYears" &&
    entry.answerType === "MEMBER_VALUE",
);
const failures: string[] = [];
let cases = 0;

assert.equal(entries.length, 1, "Expected one bounded child-age QL");

for (const entry of entries) {
  for (let index = 0; index < 200; index += 1) {
    const seed = `avg-cp003-family-age:${entry.qlId}:${index}`;
    const pkg = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed,
    });
    cases += 1;

    const joiningAge = pkg.parameters.values.addedValue;
    if (!joiningAge) {
      failures.push(`${entry.qlId}:${index}: missing joining age`);
      continue;
    }
    const age = toNumber(joiningAge);
    if (age < 1 || age > 12) {
      failures.push(`${entry.qlId}:${index}: joining age ${age} outside 1–12`);
    }
    if (Number(pkg.answer) !== age) {
      failures.push(`${entry.qlId}:${index}: answer does not equal joining age`);
    }
    if (pkg.seed !== seed || pkg.parameters.seed !== seed) {
      failures.push(`${entry.qlId}:${index}: external seed identity was not preserved`);
    }
    if (pkg.questionId !== `AVG-001:${entry.qlId}:${seed}`) {
      failures.push(`${entry.qlId}:${index}: question ID does not preserve the requested seed`);
    }

    const options = pkg.options.map(Number);
    if (options.some((option) => option < 1 || option > 12)) {
      failures.push(
        `${entry.qlId}:${index}: joining-age options outside 1–12 (${options.join(", ")})`,
      );
    }
  }
}

assert.equal(cases, entries.length * 200);
assert.equal(failures.length, 0, failures.join("\n"));

console.log(
  JSON.stringify(
    {
      qlIds: entries.map((entry) => entry.qlId),
      cases,
      joiningAgeRange: [1, 12],
      failures,
      status: "PASS",
    },
    null,
    2,
  ),
);