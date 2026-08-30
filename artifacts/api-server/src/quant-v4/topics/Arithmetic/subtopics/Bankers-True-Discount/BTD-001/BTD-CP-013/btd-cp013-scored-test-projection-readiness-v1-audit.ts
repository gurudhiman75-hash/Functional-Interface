import { createHash } from "node:crypto";
import assert from "node:assert/strict";

import {
  getGeneratedQuestionDeliveryIssues,
  isGeneratedQuestionBlueprintEligible,
} from "../../../../../../../lib/admin-question-delivery-policy";
import { getPublicationIssues } from "../../../../../../../lib/admin-question-management";
import {
  BTD_PERMANENT_QL_REGISTRY,
  type BtdPermanentQlId,
} from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  buildBtdCp012QuestionBankAdmissionPreviewV1,
  type BtdCp012Language,
} from "../BTD-CP-012/btd-cp012-question-bank-admission-v1";
import {
  BTD_CP013_SCORED_TEST_PROJECTION_READINESS_BOUNDARY,
  BTD_CP013_SCORED_TEST_PROJECTION_READINESS_VERSION,
  btdCp013SourceBankPayload,
  buildBtdCp013ScoredTestProjectionReadinessV1,
} from "./btd-cp013-scored-test-projection-readiness-v1";

const LANGUAGES = ["en", "hi", "pa"] as const satisfies readonly BtdCp012Language[];
const SEEDS_PER_QL_PER_LANGUAGE = 50;

function uuidFrom(value: string) {
  const hex = createHash("sha256").update(value).digest("hex").slice(0, 32).split("");
  hex[12] = "4";
  hex[16] = ["8", "9", "a", "b"][parseInt(hex[16]!, 16) % 4]!;
  const joined = hex.join("");
  return `${joined.slice(0, 8)}-${joined.slice(8, 12)}-${joined.slice(12, 16)}-${joined.slice(16, 20)}-${joined.slice(20)}`;
}

function stable(value: unknown) {
  return JSON.stringify(value);
}

let sourceCandidatesValidated = 0;
let projectionsValidated = 0;
let sourceParityChecks = 0;
let deterministicChecks = 0;
let scopeIsolationChecks = 0;
let lifecycleChecks = 0;
let placementChecks = 0;
let jsonChecks = 0;
const projectionKeys = new Map<string, string>();
let safeProjectionRepeats = 0;
let unsafeProjectionCollisions = 0;
const scopeUnique = new Map<string, Set<string>>();

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  const qlId = entry.qlId as BtdPermanentQlId;
  for (const language of LANGUAGES) {
    const scopeKey = `${qlId}:${language}`;
    const uniques = new Set<string>();
    scopeUnique.set(scopeKey, uniques);

    for (let index = 0; index < SEEDS_PER_QL_PER_LANGUAGE; index += 1) {
      const seed = `btd-cp013-audit:${qlId}:${language}:${index}`;
      const examA = uuidFrom(`exam-a:${qlId}:${language}:${index}`);
      const examB = uuidFrom(`exam-b:${qlId}:${language}:${index}`);
      const taxonomy = uuidFrom(`taxonomy:${qlId}`);

      const source = buildBtdCp012QuestionBankAdmissionPreviewV1(qlId, seed, language);
      const sourceBankPayload = btdCp013SourceBankPayload(source as Record<string, any>);
      const projectionA = buildBtdCp013ScoredTestProjectionReadinessV1(
        qlId,
        seed,
        language,
        examA,
        taxonomy,
      );
      const replayA = buildBtdCp013ScoredTestProjectionReadinessV1(
        qlId,
        seed,
        language,
        examA,
        taxonomy,
      );
      const projectionB = buildBtdCp013ScoredTestProjectionReadinessV1(
        qlId,
        seed,
        language,
        examB,
        taxonomy,
      );

      sourceCandidatesValidated += 1;
      projectionsValidated += 2;

      assert.deepEqual(projectionA.sourceBankPayload, sourceBankPayload);
      assert.equal(projectionA.sourceQuestionBankAdmissionKey, source.questionBankAdmissionKey);
      assert.equal(
        projectionA.sourceQuestionBankAdmissionPayloadFingerprint,
        source.questionBankAdmissionPayloadFingerprint,
      );
      sourceParityChecks += 3;

      assert.equal(projectionA.projectionKey, replayA.projectionKey);
      assert.equal(stable(projectionA), stable(replayA));
      deterministicChecks += 2;

      assert.notEqual(projectionA.projectionKey, projectionB.projectionKey);
      assert.equal(projectionA.sourceQuestionBankAdmissionKey, projectionB.sourceQuestionBankAdmissionKey);
      assert.notEqual(projectionA.examVersionId, projectionB.examVersionId);
      scopeIsolationChecks += 3;

      for (const projection of [projectionA, projectionB]) {
        assert.match(projection.examVersionId, /^[0-9a-f-]{36}$/);
        assert.match(projection.primaryTaxonomyNodeId, /^[0-9a-f-]{36}$/);
        assert.deepEqual(projection.taxonomyNodeIds, [projection.primaryTaxonomyNodeId]);
        assert.equal(projection.projectionContract.examVersionId, projection.examVersionId);
        assert.equal(
          projection.projectionContract.primaryTaxonomyNodeId,
          projection.primaryTaxonomyNodeId,
        );
        placementChecks += 5;

        const lifecycle = projection.lifecycle;
        assert.equal(lifecycle.testProjectionMaterializationApproved, false);
        assert.equal(lifecycle.testEligibilityApprovalGranted, false);
        assert.equal(lifecycle.testEligibility, "INELIGIBLE");
        assert.equal(lifecycle.testEligible, false);
        assert.equal(lifecycle.mockTestEligible, false);
        assert.equal(lifecycle.publiclyPublishable, false);
        assert.equal(lifecycle.automaticStudentPublication, false);
        assert.equal(lifecycle.contentMutationAuthorized, false);
        lifecycleChecks += 8;

        assert.doesNotThrow(() => JSON.stringify(projection));
        assert.equal(Object.isFrozen(projection), true);
        assert.equal(Object.isFrozen(projection.sourceBankPayload), true);
        assert.equal(Object.isFrozen(projection.lifecycle), true);
        jsonChecks += 4;

        const identity = stable({
          source: projection.sourceQuestionBankAdmissionKey,
          examVersionId: projection.examVersionId,
          taxonomyNodeId: projection.primaryTaxonomyNodeId,
        });
        const previous = projectionKeys.get(projection.projectionKey);
        if (previous === undefined) {
          projectionKeys.set(projection.projectionKey, identity);
        } else if (previous === identity) {
          safeProjectionRepeats += 1;
        } else {
          unsafeProjectionCollisions += 1;
        }
      }
      uniques.add(projectionA.projectionKey);
    }
  }
}

assert.equal(sourceCandidatesValidated, 20 * 3 * SEEDS_PER_QL_PER_LANGUAGE);
assert.equal(projectionsValidated, sourceCandidatesValidated * 2);
assert.equal(unsafeProjectionCollisions, 0);
assert.equal(projectionKeys.size + safeProjectionRepeats, projectionsValidated);

const minimumScopeUnique = Math.min(...[...scopeUnique.values()].map((set) => set.size));
assert.ok(minimumScopeUnique >= 45, `minimum per QL/language projection uniqueness too low: ${minimumScopeUnique}`);

const policyCases = [
  { flags: { testEligible: true, publiclyPublishable: false }, issues: 0 },
  { flags: { testEligible: false, publiclyPublishable: true }, issues: 0 },
  { flags: { testEligible: false, publiclyPublishable: false }, issues: 2 },
  { flags: { testEligible: false, publiclyPublishable: null }, issues: 1 },
  { flags: { testEligible: null, publiclyPublishable: false }, issues: 1 },
  { flags: { testEligible: null, publiclyPublishable: null }, issues: 0 },
] as const;
for (const policyCase of policyCases) {
  assert.equal(getGeneratedQuestionDeliveryIssues(policyCase.flags).length, policyCase.issues);
}

assert.equal(isGeneratedQuestionBlueprintEligible({ generation: { testEligible: false } }), false);
assert.equal(isGeneratedQuestionBlueprintEligible({ generation: { testEligible: true } }), true);
assert.equal(isGeneratedQuestionBlueprintEligible({ generation: {} }), true);
assert.equal(isGeneratedQuestionBlueprintEligible({}), true);

const publishBase = {
  status: "approved",
  approvedVersionId: uuidFrom("approved-version"),
  examVersionId: uuidFrom("exam-version"),
  primaryTaxonomyNodeId: uuidFrom("taxonomy-primary"),
  taxonomyNodeIds: [uuidFrom("taxonomy-primary")],
  stem: "A frozen BTD question stem",
  explanation: "A complete worked explanation",
  optionCount: 4,
  correctOptionCount: 1,
};
assert.deepEqual(getPublicationIssues({
  ...publishBase,
  generationTestEligible: true,
  generationPubliclyPublishable: false,
}), []);
assert.deepEqual(getPublicationIssues({
  ...publishBase,
  generationTestEligible: false,
  generationPubliclyPublishable: true,
}), []);
assert.equal(getPublicationIssues({
  ...publishBase,
  generationTestEligible: false,
  generationPubliclyPublishable: false,
}).length, 2);

assert.throws(
  () => buildBtdCp013ScoredTestProjectionReadinessV1(
    "BTD-QL-001",
    "bad-exam-id",
    "en",
    "not-a-uuid",
    uuidFrom("taxonomy"),
  ),
  /canonical exam-version UUID/,
);

const result = {
  auditVersion: "BTD-001-CP013-SCORED-TEST-PROJECTION-READINESS-AUDIT-v1",
  readinessVersion: BTD_CP013_SCORED_TEST_PROJECTION_READINESS_VERSION,
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-013",
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  languages: LANGUAGES,
  seedsPerQlPerLanguage: SEEDS_PER_QL_PER_LANGUAGE,
  sourceCandidatesValidated,
  projectionsValidated,
  sourceParityChecks,
  deterministicChecks,
  scopeIsolationChecks,
  placementChecks,
  lifecycleChecks,
  jsonChecks,
  uniqueProjectionKeys: projectionKeys.size,
  safeProjectionRepeats,
  unsafeProjectionCollisions,
  minimumScopeUnique,
  platformDeliveryPolicyCases: policyCases.length,
  blueprintEligibilityCases: 4,
  publishGateDecouplingCases: 3,
  readinessStatus: BTD_CP013_SCORED_TEST_PROJECTION_READINESS_BOUNDARY.status,
  testProjectionMaterializationApproved:
    BTD_CP013_SCORED_TEST_PROJECTION_READINESS_BOUNDARY.testProjectionMaterializationApproved,
  testEligibilityApprovalGranted:
    BTD_CP013_SCORED_TEST_PROJECTION_READINESS_BOUNDARY.testEligibilityApprovalGranted,
  testEligible: BTD_CP013_SCORED_TEST_PROJECTION_READINESS_BOUNDARY.testEligible,
  mockTestEligible: BTD_CP013_SCORED_TEST_PROJECTION_READINESS_BOUNDARY.mockTestEligible,
  publiclyPublishable:
    BTD_CP013_SCORED_TEST_PROJECTION_READINESS_BOUNDARY.publiclyPublishable,
};

console.log(JSON.stringify(result, null, 2));
console.log("PASS_BTD_001_CP013_SCORED_TEST_PROJECTION_READINESS_AUDIT_V1");
