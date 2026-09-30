import assert from "node:assert/strict";
import { LP_001_011_PERMANENT_QL_REGISTRY_V3 } from "./lp-001-011-permanent-ql-registry-v3.ts";
import { LP_001_FINAL_CONTENT_DEEP_AUDIT_CLOSURE_V1 } from "./lp-001-final-content-deep-audit-closure-v1.ts";

const closure = LP_001_FINAL_CONTENT_DEEP_AUDIT_CLOSURE_V1;
const registry = LP_001_011_PERMANENT_QL_REGISTRY_V3;

assert.equal(closure.status, "CONTENT_DEEP_AUDIT_CLOSED");
assert.equal(closure.registryAuthorityId, registry.authorityId);
assert.equal(registry.permanentQlCount, 47);
assert.equal(closure.permanentQlCount, 47);
assert.deepEqual(registry.allocatedRange, ["LP-QL-001", "LP-QL-047"]);
assert.deepEqual(closure.allocatedRange, registry.allocatedRange);
assert.equal(registry.nextAvailableQlId, "LP-QL-048");
assert.equal(closure.nextAvailableQlId, "LP-QL-048");
assert.equal(new Set(registry.permanentQlIds).size, 47);
assert.equal(closure.qlBoundaryDecision, "RETAIN_ALL_001_047__NO_MERGE_SPLIT__NO_NEW_QL");
assert.equal(closure.runtimeMode, "REVIEW_ONLY");
assert.equal(closure.contentDeepAuditClosed, true);
assert.equal(closure.sourceSaturatedForTargetExams, false);
assert.equal(closure.productionEligible, false);
assert.equal(closure.questionBankWritable, false);
assert.equal(closure.testEligible, false);
assert.equal(closure.mockTestEligible, false);
assert.equal(closure.publiclyPublishable, false);
assert.equal(closure.automaticStudentPublication, false);

console.log("LP-001 final content deep-audit closure passed: 47 QLs retained, QL048 unallocated, review-only lifecycle preserved, production source gate closed.");
