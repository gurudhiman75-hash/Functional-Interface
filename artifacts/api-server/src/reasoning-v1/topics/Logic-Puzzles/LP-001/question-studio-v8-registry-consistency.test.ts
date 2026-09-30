import assert from "node:assert/strict";
import { listLogicPuzzleQuestionStudioPackagesV8 } from "./question-studio-v8.ts";
import { LP_001_011_PERMANENT_QL_REGISTRY_V3 } from "./lp-001-011-permanent-ql-registry-v3.ts";

const packages = listLogicPuzzleQuestionStudioPackagesV8();
const discovered = new Set<string>();

for (const pkg of packages as any[]) {
  for (const qlId of (pkg.permanentQlIds ?? [])) {
    assert.equal(discovered.has(qlId), false, `${qlId} is exposed by more than one live package`);
    discovered.add(qlId);
  }
}

const permanent = new Set<string>(LP_001_011_PERMANENT_QL_REGISTRY_V3.permanentQlIds);

assert.equal(permanent.size, 47);
assert.equal(discovered.size, permanent.size);
assert.deepEqual([...discovered].sort(), [...permanent].sort());
assert.equal(discovered.has("LP-QL-048"), false);

for (const pkg of packages as any[]) {
  assert.equal(pkg.runtimeMode, "REVIEW_ONLY");
  assert.equal(pkg.questionBankWritable, false);
  assert.equal(pkg.testEligible, false);
  assert.equal(pkg.publiclyPublishable, false);
}

console.log("PASS_LP_V8_REGISTRY_DISCOVERY_CONSISTENCY");
console.log("permanent/discoverable QLs 47");
console.log("next unallocated LP-QL-048 hidden");
