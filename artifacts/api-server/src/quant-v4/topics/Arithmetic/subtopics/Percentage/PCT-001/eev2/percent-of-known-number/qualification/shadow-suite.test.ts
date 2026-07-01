import { strict as assert } from "node:assert";
import {
  QUAL_001_INSTANCE_COUNT,
  runActivationStabilityQualification,
  runShadowStabilityQualification,
} from "./qualification-report";

const shadow = await runShadowStabilityQualification();
assert.deepEqual(shadow, {
  passed: true,
  checkedInstances: QUAL_001_INSTANCE_COUNT,
});

const activation = await runActivationStabilityQualification();
assert.deepEqual(activation, {
  passed: true,
  checkedInstances: 1,
});

console.log(
  `QUAL-001 shadow qualification passed (${QUAL_001_INSTANCE_COUNT} runs); activation states passed.`,
);

