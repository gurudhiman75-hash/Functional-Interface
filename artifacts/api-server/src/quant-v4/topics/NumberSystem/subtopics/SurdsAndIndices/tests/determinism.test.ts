import { strict as assert } from "node:assert";
import { sriBucket, sriHashSeed, sriInt, sriPick } from "../../../../../shared/surds-indices";

const seed = "SRI:phase0:determinism";
assert.equal(sriHashSeed(seed), sriHashSeed(seed));
assert.equal(sriBucket(seed, 17), sriBucket(seed, 17));
assert.equal(sriInt(seed, 2, 20), sriInt(seed, 2, 20));
assert.equal(sriPick(seed, ["a", "b", "c"]), sriPick(seed, ["a", "b", "c"]));
