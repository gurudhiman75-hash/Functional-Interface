import { strict as assert } from "node:assert";
import {
  QUAL_001_INSTANCE_COUNT,
  runDeterminismQualification,
} from "./qualification-report";

const result = runDeterminismQualification();
assert.deepEqual(result, {
  passed: true,
  checkedInstances: QUAL_001_INSTANCE_COUNT,
});

console.log(
  `QUAL-001 determinism qualification passed (${QUAL_001_INSTANCE_COUNT} instances).`,
);

