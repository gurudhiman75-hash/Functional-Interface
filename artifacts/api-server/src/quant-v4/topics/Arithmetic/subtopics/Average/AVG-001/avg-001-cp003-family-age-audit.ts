import { strict as assert } from "node:assert";
import { toNumber } from "./foundation/math";
import { runAvg001Pipeline } from "./foundation/pipeline";

const qlIds = ["AVG-QL-124", "AVG-QL-130"] as const;
const failures: string[] = [];
let cases = 0;

for (const qlId of qlIds) {
  for (let index = 0; index < 200; index += 1) {
    const seed = `avg-cp003-family-age:${qlId}:${index}`;
    const pkg = runAvg001Pipeline({
      questionLanguageId: qlId,
      seed,
    });
    cases += 1;

    const joiningAge = pkg.parameters.values.addedValue;
    if (!joiningAge) {
      failures.push(`${qlId}:${index}: missing joining age`);
      continue;
    }
    const age = toNumber(joiningAge);
    if (age < 1 || age > 12) {
      failures.push(`${qlId}:${index}: joining age ${age} outside 1–12`);
    }
    if (/\bchild\b/i.test(pkg.stem)) {
      failures.push(`${qlId}:${index}: age-bearing stem still labels the member as a child`);
    }
    if (pkg.seed !== seed || pkg.parameters.seed !== seed) {
      failures.push(`${qlId}:${index}: external seed identity was not preserved`);
    }
    if (pkg.questionId !== `AVG-001:${qlId}:${seed}`) {
      failures.push(`${qlId}:${index}: question ID does not preserve the requested seed`);
    }

    if (qlId === "AVG-QL-130") {
      const options = pkg.options.map(Number);
      if (options.some((option) => option < 1 || option > 12)) {
        failures.push(
          `${qlId}:${index}: joining-age options outside 1–12 (${options.join(", ")})`,
        );
      }
    }
  }
}

assert.equal(cases, 400);
assert.equal(failures.length, 0, failures.join("\n"));

console.log(
  JSON.stringify(
    {
      qlIds,
      cases,
      joiningAgeRange: [1, 12],
      failures,
      status: "PASS",
    },
    null,
    2,
  ),
);
