import { strict as assert } from "node:assert";
import { runShadowStabilityQualification } from "./qualification/qualification-report";
const result = await runShadowStabilityQualification();
assert.equal(result.passed, true);
assert.equal(result.checkedInstances, 1_000);
console.log("ENG-010 Shadow Mode regression passed.");

