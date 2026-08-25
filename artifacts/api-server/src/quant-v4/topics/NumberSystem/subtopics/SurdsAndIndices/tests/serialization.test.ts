import { strict as assert } from "node:assert";
import { parseRational, rational, serializeRational } from "../../../../../shared/surds-indices";

const value = rational(-42, 56);
const serialized = serializeRational(value);
assert.deepEqual(serialized, { numerator: "-3", denominator: "4" });
assert.deepEqual(parseRational(serialized), value);
