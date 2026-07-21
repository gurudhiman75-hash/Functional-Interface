import { strict as assert } from "node:assert";
import { getAvg001QuestionLanguageIds } from "./foundation/library";
import { equals } from "./foundation/math";
import { runAvg001Pipeline } from "./foundation/pipeline";

let unsupported = 0;
let mismatch = 0;
let displayMismatch = 0;
let cases = 0;

for (const questionLanguageId of getAvg001QuestionLanguageIds()) {
  for (let index = 0; index < 12; index += 1) {
    const questionPackage = runAvg001Pipeline({
      questionLanguageId,
      seed: `avg-independent:${questionLanguageId}:${index}`,
    });
    cases += 1;
    if (!questionPackage.independentVerification.supported) unsupported += 1;
    if (!equals(questionPackage.solver.exactAnswer, questionPackage.independentVerification.exactAnswer)) mismatch += 1;
    if (questionPackage.answer !== questionPackage.independentVerification.displayAnswer) displayMismatch += 1;
  }
}

console.log(JSON.stringify({ cases, unsupported, mismatch, displayMismatch }, null, 2));
assert.equal(cases, 1056);
assert.equal(unsupported, 0);
assert.equal(mismatch, 0);
assert.equal(displayMismatch, 0);
