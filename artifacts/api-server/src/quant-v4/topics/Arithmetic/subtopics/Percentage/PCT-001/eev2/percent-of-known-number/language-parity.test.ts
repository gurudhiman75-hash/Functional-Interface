import { strict as assert } from "node:assert";
import { runLocaleStabilityQualification } from "./qualification/qualification-report";
const result = runLocaleStabilityQualification();
assert.equal(result.passed, true);
assert.equal(result.checkedInstances, 1_000);
console.log("ENG-012 Language Parity regression passed.");

