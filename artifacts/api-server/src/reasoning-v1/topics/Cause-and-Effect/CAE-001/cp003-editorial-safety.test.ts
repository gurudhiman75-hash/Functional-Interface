import assert from "node:assert/strict";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";

let sawPumpValve = false;

for (let seed = 0; seed < 480; seed += 1) {
  const question = generateReviewedCaeQuestion({ qlId: "CAE-QL-003", locale: "en-IN", seed });
  for (const option of question.optionMetadata) {
    if (!option.id.includes("pump-pressure-valve")) continue;
    sawPumpValve = true;
    assert.match(option.text, /small side branch/i, `${question.causalStateId}: pump distractor must state its limited branch scope`);
    assert.doesNotMatch(option.text, /on the main line/i, `${question.causalStateId}: pump distractor must not remain an equally defensible main-line cause`);
    assert.equal(option.isCorrect, false, `${question.causalStateId}: pump side-branch event is a distractor, not the keyed cause`);
  }
}

assert.equal(sawPumpValve, true, "CP003 editorial-safety sweep must exercise the pump-pressure-valve distractor");
console.log("PASS_CAE_CP003_EDITORIAL_SAFETY");
