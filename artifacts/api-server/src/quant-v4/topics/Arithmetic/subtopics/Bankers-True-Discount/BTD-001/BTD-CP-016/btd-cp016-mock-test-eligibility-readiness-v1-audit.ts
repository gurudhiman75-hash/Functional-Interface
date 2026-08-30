import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY } from "../BTD-CP-015/btd-cp015-scored-test-eligibility-v1";
import {
  BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_BOUNDARY,
  BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_VERSION,
  buildBtdCp016MockTestEligibilityReadinessPlanV1,
} from "./btd-cp016-mock-test-eligibility-readiness-v1";
import { seriesReadiness } from "../../../../../../../lib/admin-test-series";

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
let placementChecks = 0;
let scoredSourceChecks = 0;
let multilingualSourceChecks = 0;
let mockBoundaryChecks = 0;
let seriesPolicyChecks = 0;
let safeRepeats = 0;
let unsafeCollisions = 0;

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (let index = 0; index < 50; index += 1) {
    const seed = `btd-cp016-${entry.qlId}-${index + 1}`;
    for (const scope of EXAM_SCOPES) {
      const request = {
        qlId: entry.qlId,
        seed,
        examVersionId: scope.examVersionId,
        primaryTaxonomyNodeId: scope.primaryTaxonomyNodeId,
        taxonomyNodeIds: scope.taxonomyNodeIds,
      } as const;
      const plan = buildBtdCp016MockTestEligibilityReadinessPlanV1(request);
      const replay = buildBtdCp016MockTestEligibilityReadinessPlanV1(request);

      plansValidated += 1;
      assert(JSON.stringify(plan) === JSON.stringify(replay), `${entry.qlId}: deterministic replay drift`);
      deterministicChecks += 1;

      assert(plan.checkpointId === "BTD-CP-016", `${entry.qlId}: wrong checkpoint`);
      assert(plan.readinessVersion === BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_VERSION, `${entry.qlId}: wrong readiness authority`);
      assert(plan.examVersionId === scope.examVersionId, `${entry.qlId}: exam scope drift`);
      assert(plan.primaryTaxonomyNodeId === scope.primaryTaxonomyNodeId, `${entry.qlId}: primary taxonomy drift`);
      assert(plan.taxonomyNodeIds.includes(scope.primaryTaxonomyNodeId), `${entry.qlId}: primary taxonomy missing`);
      placementChecks += 5;

      assert(plan.expectedProjectionState.questionStatus === "published", `${entry.qlId}: CP015 projection must be internally published`);
      assert(plan.expectedProjectionState.testEligibility === "ELIGIBLE", `${entry.qlId}: CP015 scored-test label drift`);
      assert(plan.expectedProjectionState.testEligible === true, `${entry.qlId}: CP015 scored-test gate closed`);
      assert(plan.expectedProjectionState.mockTestEligible === false, `${entry.qlId}: mock gate opened before approval`);
      assert(plan.expectedProjectionState.publiclyPublishable === false, `${entry.qlId}: public gate unexpectedly open`);
      assert(plan.expectedProjectionState.automaticStudentPublication === false, `${entry.qlId}: automatic publication unexpectedly open`);
      scoredSourceChecks += 6;

      assert(Object.keys(plan.sourceAdmissionKeys).sort().join(",") === "en,hi,pa", `${entry.qlId}: multilingual source authority incomplete`);
      assert(/^BTD-QB-[0-9a-f]{32}$/u.test(String(plan.sourceAdmissionKeys.en)), `${entry.qlId}: English admission key invalid`);
      assert(/^BTD-QB-[0-9a-f]{32}$/u.test(String(plan.sourceAdmissionKeys.hi)), `${entry.qlId}: Hindi admission key invalid`);
      assert(/^BTD-QB-[0-9a-f]{32}$/u.test(String(plan.sourceAdmissionKeys.pa)), `${entry.qlId}: Punjabi admission key invalid`);
      multilingualSourceChecks += 4;

      assert(plan.mockSeriesPolicy.explicitFalseMustBlockMembership === true, `${entry.qlId}: explicit false policy drift`);
      assert(plan.mockSeriesPolicy.explicitTrueMayProceedToCanonicalSeriesQa === true, `${entry.qlId}: explicit true policy drift`);
      assert(plan.mockSeriesPolicy.legacyMissingFlagMayProceedUnderLegacyRules === true, `${entry.qlId}: legacy compatibility drift`);
      assert(plan.mockSeriesPolicy.acceptedMemberTestStatuses.join(",") === "qa_approved,scheduled,live,completed", `${entry.qlId}: canonical series status policy drift`);
      assert(plan.futureGrantState.testEligible === true, `${entry.qlId}: future grant must preserve scored-test eligibility`);
      assert(plan.futureGrantState.mockTestEligible === true, `${entry.qlId}: future grant target missing mock eligibility`);
      assert(plan.futureGrantState.publiclyPublishable === false, `${entry.qlId}: future grant must not imply public release`);
      assert(plan.futureGrantState.automaticStudentPublication === false, `${entry.qlId}: future grant must not imply automatic publication`);
      mockBoundaryChecks += 8;

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

for (const acceptedStatus of ["qa_approved", "scheduled", "live", "completed"] as const) {
  const readiness = seriesReadiness({ itemCount: 1, memberStatuses: [acceptedStatus] });
  assert(readiness.ready, `${acceptedStatus}: canonical test-series member status rejected`);
  seriesPolicyChecks += 1;
}
for (const blockedStatus of ["draft", "under_review", "qa_pending"] as const) {
  const readiness = seriesReadiness({ itemCount: 1, memberStatuses: [blockedStatus] });
  assert(!readiness.ready, `${blockedStatus}: non-QA test unexpectedly mock-series ready`);
  seriesPolicyChecks += 1;
}
assert(!seriesReadiness({ itemCount: 0, memberStatuses: [] }).ready, "empty series unexpectedly ready");
seriesPolicyChecks += 1;

assert(BTD_PERMANENT_QL_REGISTRY.length === 20, "BTD-001 CP016 expected 20 permanent QLs");
assert(plansValidated === 2000, `Expected 2,000 mock readiness plans, got ${plansValidated}`);
assert(unsafeCollisions === 0, `Unsafe projection collisions detected: ${unsafeCollisions}`);
assert(BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY.testEligible === true, "CP015 source scored-test gate unexpectedly closed");
assert(BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY.mockTestEligible === false, "CP015 source mock gate unexpectedly open");
assert(BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_BOUNDARY.mockTestEligibilityApprovalGranted === false, "CP016 readiness must not grant mock eligibility");
assert(BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_BOUNDARY.mockTestEligible === false, "CP016 readiness must remain mock ineligible");
assert(BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_BOUNDARY.publiclyPublishable === false, "CP016 readiness must remain non-public");
assert(BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_BOUNDARY.projectionMockEligibilityMutationAuthorized === false, "CP016 readiness must not authorize mutation");

const minimumScopeUnique = Math.min(...[...scopeUnique.values()].map((set) => set.size));
assert(minimumScopeUnique >= 45, `Minimum QL/exam uniqueness too low: ${minimumScopeUnique}/50`);

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP016-MOCK-TEST-ELIGIBILITY-READINESS-AUDIT-v1",
  readinessVersion: BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_VERSION,
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-016",
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  examScopes: EXAM_SCOPES.length,
  seedsPerQlPerExam: 50,
  plansValidated,
  deterministicChecks,
  placementChecks,
  scoredSourceChecks,
  multilingualSourceChecks,
  mockBoundaryChecks,
  seriesPolicyChecks,
  uniqueProjectionBundleKeys: identityByKey.size,
  safeProjectionRepeats: safeRepeats,
  unsafeProjectionCollisions: unsafeCollisions,
  minimumScopeUnique,
  readinessStatus: BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_BOUNDARY.status,
  mockTestEligibilityApprovalGranted: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_BTD_001_CP016_MOCK_TEST_ELIGIBILITY_READINESS_AUDIT_V1");
