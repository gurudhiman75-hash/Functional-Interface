import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION } from "../BTD-CP-015/btd-cp015-scored-test-eligibility-v1";
import { BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_BOUNDARY } from "../BTD-CP-016/btd-cp016-mock-test-eligibility-readiness-v1";
import {
  BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY,
  BTD_CP017_MOCK_TEST_ELIGIBILITY_VERSION,
  buildBtdCp017MockTestEligibilityPlanV1,
} from "./btd-cp017-mock-test-eligibility-v1";

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
const scopeUnique = new Map<string, Set<string>>();
let plansValidated = 0;
let deterministicChecks = 0;
let sourceStateChecks = 0;
let targetStateChecks = 0;
let placementChecks = 0;
let multilingualChecks = 0;
let seriesPolicyChecks = 0;
let safeRepeats = 0;
let unsafeCollisions = 0;

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (let index = 0; index < 50; index += 1) {
    const seed = `btd-cp017-${entry.qlId}-${index + 1}`;
    for (const scope of EXAM_SCOPES) {
      const request = {
        qlId: entry.qlId,
        seed,
        examVersionId: scope.examVersionId,
        primaryTaxonomyNodeId: scope.primaryTaxonomyNodeId,
        taxonomyNodeIds: scope.taxonomyNodeIds,
      } as const;
      const plan = buildBtdCp017MockTestEligibilityPlanV1(request);
      const replay = buildBtdCp017MockTestEligibilityPlanV1(request);

      plansValidated += 1;
      assert(JSON.stringify(plan) === JSON.stringify(replay), `${entry.qlId}: deterministic replay drift`);
      deterministicChecks += 1;

      assert(plan.checkpointId === "BTD-CP-017", `${entry.qlId}: wrong checkpoint`);
      assert(plan.eligibilityVersion === BTD_CP017_MOCK_TEST_ELIGIBILITY_VERSION, `${entry.qlId}: wrong eligibility authority`);
      assert(plan.scoredTestAuthority === BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION, `${entry.qlId}: scored-test authority drift`);
      assert(plan.examVersionId === scope.examVersionId, `${entry.qlId}: exam scope drift`);
      assert(plan.primaryTaxonomyNodeId === scope.primaryTaxonomyNodeId, `${entry.qlId}: primary taxonomy drift`);
      assert(plan.taxonomyNodeIds.includes(scope.primaryTaxonomyNodeId), `${entry.qlId}: primary taxonomy missing`);
      placementChecks += 6;

      assert(plan.expectedProjectionState.questionStatus === "published", `${entry.qlId}: source must be published`);
      assert(plan.expectedProjectionState.testEligibility === "ELIGIBLE", `${entry.qlId}: source scored-test label drift`);
      assert(plan.expectedProjectionState.testEligible === true, `${entry.qlId}: source scored-test gate closed`);
      assert(plan.expectedProjectionState.mockTestEligible === false, `${entry.qlId}: source mock gate opened early`);
      assert(plan.expectedProjectionState.publiclyPublishable === false, `${entry.qlId}: source public gate open`);
      assert(plan.expectedProjectionState.automaticStudentPublication === false, `${entry.qlId}: source auto-publication open`);
      sourceStateChecks += 6;

      assert(plan.targetProjectionState.questionStatus === "published", `${entry.qlId}: target publication state drift`);
      assert(plan.targetProjectionState.testEligibility === "ELIGIBLE", `${entry.qlId}: target scored-test label drift`);
      assert(plan.targetProjectionState.testEligible === true, `${entry.qlId}: target scored-test gate closed`);
      assert(plan.targetProjectionState.mockTestEligible === true, `${entry.qlId}: target mock-test gate not opened`);
      assert(plan.targetProjectionState.publiclyPublishable === false, `${entry.qlId}: target public gate opened`);
      assert(plan.targetProjectionState.automaticStudentPublication === false, `${entry.qlId}: target auto-publication opened`);
      targetStateChecks += 6;

      assert(Object.keys(plan.sourceAdmissionKeys).sort().join(",") === "en,hi,pa", `${entry.qlId}: multilingual source authority incomplete`);
      assert(/^BTD-QB-[0-9a-f]{32}$/u.test(String(plan.sourceAdmissionKeys.en)), `${entry.qlId}: EN source key invalid`);
      assert(/^BTD-QB-[0-9a-f]{32}$/u.test(String(plan.sourceAdmissionKeys.hi)), `${entry.qlId}: HI source key invalid`);
      assert(/^BTD-QB-[0-9a-f]{32}$/u.test(String(plan.sourceAdmissionKeys.pa)), `${entry.qlId}: PA source key invalid`);
      multilingualChecks += 4;

      assert(plan.testSeriesPolicy.mockEligibilityFlagRequiredForGeneratedQuestions === true, `${entry.qlId}: series flag requirement drift`);
      assert(plan.testSeriesPolicy.canonicalQaStillRequired === true, `${entry.qlId}: canonical QA requirement drift`);
      assert(plan.testSeriesPolicy.acceptedMemberTestStatuses.join(",") === "qa_approved,scheduled,live,completed", `${entry.qlId}: accepted series statuses drift`);
      seriesPolicyChecks += 3;

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

assert(BTD_PERMANENT_QL_REGISTRY.length === 20, "BTD-001 CP017 expected 20 permanent QLs");
assert(plansValidated === 2000, `Expected 2,000 mock eligibility plans, got ${plansValidated}`);
assert(unsafeCollisions === 0, `Unsafe projection collisions detected: ${unsafeCollisions}`);
assert(BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_BOUNDARY.mockTestEligible === false, "CP016 source unexpectedly mock eligible");
assert(BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_BOUNDARY.projectionMockEligibilityMutationAuthorized === false, "CP016 source unexpectedly authorized mutation");
assert(BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY.mockTestEligibilityApprovalGranted === true, "CP017 mock-test approval missing");
assert(BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY.testEligible === true, "CP017 must preserve scored-test eligibility");
assert(BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY.mockTestEligible === true, "CP017 mock-test gate not opened");
assert(BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY.publiclyPublishable === false, "CP017 public gate unexpectedly opened");
assert(BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY.automaticStudentPublication === false, "CP017 automatic publication unexpectedly opened");
assert(BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY.projectionContentMutationAuthorized === false, "CP017 must not authorize learner-content mutation");
assert(BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY.projectionMockEligibilityMutationAuthorized === true, "CP017 mock metadata mutation not authorized");

const minimumScopeUnique = Math.min(...[...scopeUnique.values()].map((set) => set.size));
assert(minimumScopeUnique >= 45, `Minimum QL/exam uniqueness too low: ${minimumScopeUnique}/50`);

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP017-MOCK-TEST-ELIGIBILITY-AUDIT-v1",
  eligibilityVersion: BTD_CP017_MOCK_TEST_ELIGIBILITY_VERSION,
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-017",
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  examScopes: EXAM_SCOPES.length,
  seedsPerQlPerExam: 50,
  plansValidated,
  deterministicChecks,
  placementChecks,
  sourceStateChecks,
  targetStateChecks,
  multilingualChecks,
  seriesPolicyChecks,
  uniqueProjectionBundleKeys: identityByKey.size,
  safeProjectionRepeats: safeRepeats,
  unsafeProjectionCollisions: unsafeCollisions,
  minimumScopeUnique,
  mockTestEligibilityApprovalGranted: true,
  testEligible: true,
  mockTestEligible: true,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_BTD_001_CP017_MOCK_TEST_ELIGIBILITY_AUDIT_V1");
