import { strict as assert } from "node:assert";
import { exactNthRoot, extractPerfectPower } from "../../../../../shared/surds-indices";

assert.deepEqual(extractPerfectPower(72n, 2), { index: 2, outside: 6n, residual: 2n });
assert.deepEqual(extractPerfectPower(40n, 3), { index: 3, outside: 2n, residual: 5n });
assert.equal(exactNthRoot(625n, 4), 5n);
assert.equal(exactNthRoot(50n, 2), null);
