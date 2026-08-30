import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY } from "../BTD-CP-014/btd-cp014-test-projection-materialization-v1";
import {
  BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY,
  BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION,
  buildBtdCp015ScoredTestEligibilityPlanV1,
} from "./btd-cp015-scored-test-eligibility-v1";
import {
  getGeneratedQuestionDeliveryIssues,
  isGeneratedQuestionBlueprintEligible,
} from "../../../../../../../lib/admin-question-delivery-policy";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const EXAM_SCOPES = Object.freeze([
  Object.freeze({
    examVersionId: "11111111-1111-4111-8111-111111111111",
    primaryTaxonomyNodeId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    taxonomyNodeIds: Object.freeze([
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    ]),
  }),
  Object.freeze({
    examVersionId: "22222222-2222-4222-8222-222222222222",
    primaryTaxonomyNodeId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    taxonomyNodeIds: Object.freeze([
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    ]),
  }),
]);

const identityByKey = new Map<string, string>();
let plansValidated = 0;
let deterministicChecks = 0;
let lifecycleChecks = 0;
let placementChecks = 0;
let sourceLockChecks = 0;
let deliveryPolicyChecks = 0;
let blueprintEligibilityChecks = 0;
let safeRepeats = 0;
let unsafeCollisions = 0;
const scopeUnique = new Map<string, Set<string>>();

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (let index = 0; index < 50; index += 1) {
    const seed = `btd-cp015-${entry.qlId}-${index + 1}`;
    for (const scope of EXAM_SCOPES) {
      const plan = buildBtdCp015ScoredTestEligibilityPlanV1({
        qlId: entry.qlId,
        seed,
        examVersionId: scope.examVersionId,
        primaryTaxonomyNodeId: scope.primaryTaxonomyNodeId,
        taxonomyNodeIds: scope.taxonomyNodeIds,
      });
      const replay = buildBtdCp015ScoredTestEligibilityPlanV1({
        qlId: entry.qlId,
        seed,
        examVersionId: scope.examVersionId,
        primaryTaxonomyNodeId: scope.primaryTaxonomyNodeId,
        taxonomyNodeIds: scope.taxonomyNodeIds,
      });

      plansValidated += 1;
      assert(JSON.stringify(plan) === JSON.stringify(replay), `${entry.qlId}: deterministic replay drift`);
      deterministicChecks += 1;

      assert(plan.checkpointId === "BTD-CP-015", `${entry.qlId}: wrong checkpoint`);
      assert(plan.eligibilityVersion === BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION, `${entry.qlId}: wrong eligibility authority`);
      assert(plan.examVersionId === scope.examVersionId, `${entry.qlId}: exam scope drift`);
      assert(plan.primaryTaxonomyNodeId === scope.primaryTaxonomyNodeId, `${entry.qlId}: primary taxonomy drift`);
      assert(plan.taxonomyNodeIds.includes(scope.primaryTaxonomyNodeId), `${entry.qlId}: primary taxonomy missing`);
      placementChecks += 5;

      assert(plan.expectedProjectionState.questionStatus === "approved", `${entry.qlId}: source projection must be approved`);
      assert(plan.expectedProjectionState.publishedVersionId === null, `${entry.qlId}: source projection must be unpublished`);
      assert(plan.expectedProjectionState.testProjectionMaterialized === true, `${entry.qlId}: source projection must be materialized`);
      assert(plan.expectedProjectionState.testEligible === false, `${entry.qlId}: source projection must remain ineligible before grant`);
      assert(plan.expectedProjectionState.mockTestEligible === false, `${entry.qlId}: source mock gate drift`);
      assert(plan.expectedProjectionState.publiclyPublishable === false, `${entry.qlId}: source public gate drift`);
      sourceLockChecks += 6;

      assert(plan.targetProjectionState.questionStatus === "published", `${entry.qlId}: target must enter internal published pool`);
      assert(plan.targetProjectionState.testEligibility === "ELIGIBLE", `${entry.qlId}: target eligibility label mismatch`);
      assert(plan.targetProjectionState.testEligible === true, `${entry.qlId}: target test gate not opened`);
      assert(plan.targetProjectionState.mockTestEligible === false, `${entry.qlId}: mock gate must remain closed`);
      assert(plan.targetProjectionState.publiclyPublishable === false, `${entry.qlId}: public gate must remain closed`);
      assert(plan.targetProjectionState.automaticStudentPublication === false, `${entry.qlId}: automatic publication must remain closed`);
      lifecycleChecks += 6;

      const answerModel = {
        generation: {
          packageId: "BTD-001",
          testProjectionMaterialized: true,
          testProjectionBundleKey: plan.projectionBundleKey,
          testEligibility: "ELIGIBLE",
          testEligible: true,
          mockTestEligible: false,
          publiclyPublishable: false,
          automaticStudentPublication: false,
          testEligibilityAuthority: BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION,
        },
      };
      assert(getGeneratedQuestionDeliveryIssues({ testEligible: true, publiclyPublishable: false }).length === 0, `${entry.qlId}: test-only delivery policy blocked`);
      deliveryPolicyChecks += 1;
      assert(isGeneratedQuestionBlueprintEligible(answerModel), `${entry.qlId}: eligible projection rejected by blueprint policy`);
      blueprintEligibilityChecks += 1;

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

assert(BTD_PERMANENT_QL_REGISTRY.length === 20, "BTD-001 CP015 expected 20 permanent QLs");
assert(plansValidated === 2000, `Expected 2,000 eligibility plans, got ${plansValidated}`);
assert(unsafeCollisions === 0, `Unsafe projection collisions detected: ${unsafeCollisions}`);
assert(BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testEligible === false, "CP014 source unexpectedly test eligible");
assert(BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.publiclyPublishable === false, "CP014 source unexpectedly public");
assert(BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY.testEligibilityApprovalGranted === true, "CP015 eligibility authority missing");
assert(BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY.testEligible === true, "CP015 test gate not opened");
assert(BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY.mockTestEligible === false, "CP015 mock gate unexpectedly opened");
assert(BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY.publiclyPublishable === false, "CP015 public gate unexpectedly opened");
assert(getGeneratedQuestionDeliveryIssues({ testEligible: false, publiclyPublishable: false }).length > 0, "false/false delivery unexpectedly allowed");
assert(getGeneratedQuestionDeliveryIssues({ testEligible: false, publiclyPublishable: true }).length === 0, "public-only delivery unexpectedly blocked");
assert(!isGeneratedQuestionBlueprintEligible({ generation: { testEligible: false } }), "ineligible generated question entered blueprint policy");

const minimumScopeUnique = Math.min(...[...scopeUnique.values()].map((set) => set.size));
assert(minimumScopeUnique >= 45, `Minimum QL/exam uniqueness too low: ${minimumScopeUnique}/50`);

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP015-SCORED-TEST-ELIGIBILITY-AUDIT-v1",
  eligibilityVersion: BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION,
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-015",
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  examScopes: EXAM_SCOPES.length,
  seedsPerQlPerExam: 50,
  plansValidated,
  deterministicChecks,
  placementChecks,
  sourceLockChecks,
  lifecycleChecks,
  deliveryPolicyChecks,
  blueprintEligibilityChecks,
  uniqueProjectionBundleKeys: identityByKey.size,
  safeProjectionRepeats: safeRepeats,
  unsafeProjectionCollisions: unsafeCollisions,
  minimumScopeUnique,
  testEligibilityApprovalGranted: BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY.testEligibilityApprovalGranted,
  testEligible: BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY.testEligible,
  mockTestEligible: BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY.mockTestEligible,
  publiclyPublishable: BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY.publiclyPublishable,
}, null, 2));
console.log("PASS_BTD_001_CP015_SCORED_TEST_ELIGIBILITY_AUDIT_V1");
