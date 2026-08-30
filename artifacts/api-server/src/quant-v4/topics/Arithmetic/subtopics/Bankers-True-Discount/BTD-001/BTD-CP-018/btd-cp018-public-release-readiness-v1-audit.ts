import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY } from "../BTD-CP-017/btd-cp017-mock-test-eligibility-v1";
import {
  BTD_CP018_PUBLIC_RELEASE_READINESS_BOUNDARY,
  BTD_CP018_PUBLIC_RELEASE_READINESS_VERSION,
  buildBtdCp018PublicReleaseReadinessPlanV1,
} from "./btd-cp018-public-release-readiness-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const EXAM_SCOPES = Object.freeze([
  Object.freeze({
    examVersionId: "11111111-1111-4111-8111-111111111111",
    primaryTaxonomyNodeId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    taxonomyNodeIds: Object.freeze(["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", "cccccccc-cccc-4ccc-8ccc-cccccccccccc"]),
  }),
  Object.freeze({
    examVersionId: "22222222-2222-4222-8222-222222222222",
    primaryTaxonomyNodeId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    taxonomyNodeIds: Object.freeze(["bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", "dddddddd-dddd-4ddd-8ddd-dddddddddddd"]),
  }),
]);

const identityByKey = new Map<string, string>();
const scopeUnique = new Map<string, Set<string>>();
let plansValidated = 0;
let deterministicChecks = 0;
let sourceChecks = 0;
let readinessChecks = 0;
let proposedStateChecks = 0;
let safeRepeats = 0;
let unsafeCollisions = 0;

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (let index = 0; index < 50; index += 1) {
    const seed = `btd-cp018-${entry.qlId}-${index + 1}`;
    for (const scope of EXAM_SCOPES) {
      const request = {
        qlId: entry.qlId,
        seed,
        examVersionId: scope.examVersionId,
        primaryTaxonomyNodeId: scope.primaryTaxonomyNodeId,
        taxonomyNodeIds: scope.taxonomyNodeIds,
      } as const;
      const plan = buildBtdCp018PublicReleaseReadinessPlanV1(request);
      const replay = buildBtdCp018PublicReleaseReadinessPlanV1(request);
      plansValidated += 1;
      assert(JSON.stringify(plan) === JSON.stringify(replay), `${entry.qlId}: replay drift`);
      deterministicChecks += 1;

      assert(plan.checkpointId === "BTD-CP-018", `${entry.qlId}: checkpoint drift`);
      assert(plan.readinessVersion === BTD_CP018_PUBLIC_RELEASE_READINESS_VERSION, `${entry.qlId}: authority drift`);
      assert(plan.expectedProjectionState.questionStatus === "published", `${entry.qlId}: source not published`);
      assert(plan.expectedProjectionState.testEligible === true, `${entry.qlId}: scored-test source gate closed`);
      assert(plan.expectedProjectionState.mockTestEligible === true, `${entry.qlId}: mock-test source gate closed`);
      assert(plan.expectedProjectionState.publiclyPublishable === false, `${entry.qlId}: public gate opened before readiness approval`);
      assert(plan.expectedProjectionState.automaticStudentPublication === false, `${entry.qlId}: automatic release opened`);
      assert(plan.examVersionId === scope.examVersionId, `${entry.qlId}: exam scope drift`);
      assert(plan.primaryTaxonomyNodeId === scope.primaryTaxonomyNodeId, `${entry.qlId}: taxonomy scope drift`);
      sourceChecks += 7;

      assert(Object.values(plan.requiredPublicReleaseChecks).every((value) => value === true), `${entry.qlId}: readiness requirement missing`);
      assert(Object.keys(plan.sourceAdmissionKeys).sort().join(",") === "en,hi,pa", `${entry.qlId}: multilingual authority incomplete`);
      readinessChecks += 10;

      assert(plan.proposedPublicReleaseState.questionStatus === "published", `${entry.qlId}: proposed status drift`);
      assert(plan.proposedPublicReleaseState.testEligible === true, `${entry.qlId}: proposed scored gate drift`);
      assert(plan.proposedPublicReleaseState.mockTestEligible === true, `${entry.qlId}: proposed mock gate drift`);
      assert(plan.proposedPublicReleaseState.publiclyPublishable === true, `${entry.qlId}: proposed public gate not open`);
      assert(plan.proposedPublicReleaseState.automaticStudentPublication === false, `${entry.qlId}: proposed automatic release opened`);
      proposedStateChecks += 5;

      const identity = JSON.stringify({
        qlId: plan.qlId,
        sourceAdmissionKeys: plan.sourceAdmissionKeys,
        examVersionId: plan.examVersionId,
        primaryTaxonomyNodeId: plan.primaryTaxonomyNodeId,
        taxonomyNodeIds: plan.taxonomyNodeIds,
      });
      const prior = identityByKey.get(plan.projectionBundleKey);
      if (prior === undefined) identityByKey.set(plan.projectionBundleKey, identity);
      else if (prior === identity) safeRepeats += 1;
      else unsafeCollisions += 1;
      const scopeKey = `${entry.qlId}:${scope.examVersionId}`;
      const bucket = scopeUnique.get(scopeKey) ?? new Set<string>();
      bucket.add(plan.projectionBundleKey);
      scopeUnique.set(scopeKey, bucket);
    }
  }
}

assert(plansValidated === 2000, `Expected 2,000 readiness plans, got ${plansValidated}`);
assert(unsafeCollisions === 0, `Unsafe projection collisions: ${unsafeCollisions}`);
assert(BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY.testEligible === true, "CP017 scored-test authority missing");
assert(BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY.mockTestEligible === true, "CP017 mock-test authority missing");
assert(BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY.publiclyPublishable === false, "CP017 public gate already open");
assert(BTD_CP018_PUBLIC_RELEASE_READINESS_BOUNDARY.publicReleaseApprovalGranted === false, "CP018 must remain readiness-only");
assert(BTD_CP018_PUBLIC_RELEASE_READINESS_BOUNDARY.publiclyPublishable === false, "CP018 public gate must remain closed");
assert(BTD_CP018_PUBLIC_RELEASE_READINESS_BOUNDARY.projectionPublicEligibilityMutationAuthorized === false, "CP018 must not authorize public mutation");
const minimumScopeUnique = Math.min(...[...scopeUnique.values()].map((set) => set.size));
assert(minimumScopeUnique >= 45, `Minimum QL/exam uniqueness too low: ${minimumScopeUnique}/50`);

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP018-PUBLIC-RELEASE-READINESS-AUDIT-v1",
  readinessVersion: BTD_CP018_PUBLIC_RELEASE_READINESS_VERSION,
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  examScopes: EXAM_SCOPES.length,
  seedsPerQlPerExam: 50,
  plansValidated,
  deterministicChecks,
  sourceChecks,
  readinessChecks,
  proposedStateChecks,
  uniqueProjectionBundleKeys: identityByKey.size,
  safeProjectionRepeats: safeRepeats,
  unsafeProjectionCollisions: unsafeCollisions,
  minimumScopeUnique,
  publicReleaseApprovalGranted: false,
  testEligible: true,
  mockTestEligible: true,
  publiclyPublishable: false,
  automaticStudentPublication: false,
}, null, 2));
console.log("PASS_BTD_001_CP018_PUBLIC_RELEASE_READINESS_AUDIT_V1");
