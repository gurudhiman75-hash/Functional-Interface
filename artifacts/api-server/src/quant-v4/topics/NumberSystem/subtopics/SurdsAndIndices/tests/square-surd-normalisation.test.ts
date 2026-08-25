import { strict as assert } from "node:assert";
import { rational, squareRootSurd, squareSurd } from "../../../../../shared/surds-indices";

assert.deepEqual(squareRootSurd(72n), { coefficient: rational(6), radicand: 2n });
assert.deepEqual(squareSurd(rational(2), 18n), { coefficient: rational(6), radicand: 2n });
assert.deepEqual(squareRootSurd(49n), { coefficient: rational(7), radicand: 1n });
