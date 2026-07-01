import { strict as assert } from "node:assert";
import {
  QUAL_001_INSTANCE_COUNT,
  runValidatorSweepQualification,
} from "./qualification-report";

const result = runValidatorSweepQualification();
assert.deepEqual(result, {
  passed: true,
  checkedInstances: QUAL_001_INSTANCE_COUNT,
});

console.log(
  `QUAL-001 validator qualification passed (${QUAL_001_INSTANCE_COUNT} instances × 3 modes).`,
);

