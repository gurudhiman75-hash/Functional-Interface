import { GEO_001_MANIFEST } from "../GEO-001/manifest";
import { GEO_002_MANIFEST } from "../GEO-002/manifest";
import { assertGeometryLifecycleLocked, GEOMETRY_LIFECYCLE } from "../lifecycle";
import { assert, pass } from "./test-helpers";

assertGeometryLifecycleLocked();
for (const manifest of [GEO_001_MANIFEST, GEO_002_MANIFEST]) {
  assert(manifest.permanentQlIds.length === 0, `${manifest.packageId}: permanent QLs were allocated during Phase 0`);
  assert(manifest.frozenSolveModes.length === 0, `${manifest.packageId}: solve modes were frozen during Phase 0`);
  assert(manifest.runtimeEnabled === false, `${manifest.packageId}: runtime was enabled during Phase 0`);
}
assert(GEOMETRY_LIFECYCLE.questionStudioDiscoverable === false, "Question Studio gate opened");
assert(GEOMETRY_LIFECYCLE.questionBankWritable === false, "Question Bank gate opened");
assert(GEOMETRY_LIFECYCLE.testEligible === false, "Test gate opened");
assert(GEOMETRY_LIFECYCLE.publiclyPublishable === false, "Publication gate opened");
pass("lifecycle-lock");
