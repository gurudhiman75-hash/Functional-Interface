import { strict as assert } from "node:assert";
import {
  QUAL_001_INSTANCE_COUNT,
  runLocaleStabilityQualification,
  runMathematicalParityQualification,
} from "./qualification-report";

const mathematicalParity = runMathematicalParityQualification();
assert.deepEqual(mathematicalParity, {
  passed: true,
  checkedInstances: QUAL_001_INSTANCE_COUNT,
});

const localeParity = runLocaleStabilityQualification();
assert.deepEqual(localeParity, {
  passed: true,
  checkedInstances: QUAL_001_INSTANCE_COUNT,
});

console.log(
  `QUAL-001 parity qualification passed (${QUAL_001_INSTANCE_COUNT} instances).`,
);

