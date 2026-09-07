import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1,
  SPATIAL_FAMILY_FREEZE_AUTHORITY_V1,
} from "../foundation/spatial/spatial-family-freeze-v1";
import { SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2 } from "../foundation/spatial/spatial-family-final-closure-audit-v2";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13 } from "../foundation/spatial/spatial-permanent-ql-allocation-v13";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V9 } from "../foundation/spatial/spatial-question-studio-integration-v9";
import { CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 } from "../foundation/spatial/cubes-dice-test-builder-activation-v1";

const cwd = process.cwd();
const cndQlIds = ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"] as const;
const expectedNumbers = Array.from({ length: 63 }, (_, index) => index + 1);

function qlNumber(id: string): number {
  const match = /^SPA-QL-(\d{3})$/.exec(id);
  assert.ok(match, `Malformed permanent Spatial QL id: ${id}`);
  return Number(match[1]);
}

assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.authorityId, "SPA-FND-001-FAMILY-FREEZE-V1");
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.status, "FROZEN_COMPLETE_63_QL_INTERNAL_FAMILY_SNAPSHOT");
assert.equal(
  SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.sourceClosureAuditAuthorityId,
  SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.authorityId,
);
assert.equal(
  SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.sourceAllocationAuthorityId,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.authorityId,
);
assert.equal(
  SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.sourceQuestionStudioIntegrationAuthority,
  SPATIAL_QUESTION_STUDIO_PACKAGE_V9.integrationAuthority,
);
assert.equal(
  SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.sourceCndActivationAuthorityId,
  CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.authorityId,
);

assert.equal(SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.sourcePullRequest, 1475);
assert.equal(SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.sourceHeadSha, "aadb85754cf2ec6b677a70bedb069bcd5acc5206");
assert.equal(SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.mergedCommitSha, "a6786c4cd3b0b12331ab6bc4130b2e6c30e6d8b3");
assert.equal(SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.workflowRunId, 34143649753);
assert.equal(SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.artifactId, 10026854024);
assert.equal(
  SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.artifactDigest,
  "sha256:d69d1b74fecda4bef3a3341f240c9a153230703a79de029a68274c85575a323f",
);
assert.equal(SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.result, "SUCCESS");
assert.equal(
  SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.verdict,
  "PASS_UNIFIED_63_QL_SPATIAL_CORPUS_READY_FOR_FREEZE_REVIEW",
);
assert.equal(SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.generatedQuestions, 378);
assert.equal(SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.deterministicReplayChecks, 378);
assert.equal(SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.svgChecks, 1899);

assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.permanentQlRange, "SPA-QL-001..SPA-QL-063");
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.permanentQlCount, 63);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.nextAvailablePermanentQlId, "SPA-QL-064");
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.mainQuestionStudioQlCount, 58);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.separateCndQlCount, 5);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.familyPermanentQlUnionCount, 63);
assert.deepEqual(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.supportedLanguages, ["en", "hi", "pa"]);

const mainQlIds = [...SPATIAL_QUESTION_STUDIO_PACKAGE_V9.qlIds];
assert.equal(mainQlIds.length, 58);
assert.equal(new Set(mainQlIds).size, 58);
assert.deepEqual(CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.permanentQlIds, cndQlIds);
for (const qlId of cndQlIds) {
  assert.ok(!mainQlIds.includes(qlId as any), `${qlId}: CND ownership must remain separate.`);
}
const union = [...mainQlIds, ...cndQlIds];
assert.equal(new Set(union).size, 63);
assert.deepEqual(union.map(qlNumber).sort((a, b) => a - b), expectedNumbers);

assert.deepEqual(
  SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.formerlyBlockingChapters.map((entry) => entry.chapterCode),
  ["FFM-001", "DOT-001", "FMT-001", "IDF-001"],
);
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.blockingMissingChapters.length, 0);

assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.chapterInventoryComplete, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.sourceSaturationBlockersClosed, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.permanentQlAllocationGapFree, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.permanentQlAllocationFrozen, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.currentQuestionStudioIntegrationSnapshotFrozen, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.currentCndOwnershipSnapshotFrozen, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.multilingualRuntimeSnapshotFrozen, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.deterministicUnifiedSoakPassed, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.familyFreezeAuthorized, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.familyFrozen, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.contentMutationAuthorized, false);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.mutationRequiresExplicitSupersedingAuthority, true);

assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.questionStudioDiscoverable, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.persistenceAllowed, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.questionBankWritable, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.testBuilderEligible, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.mockTestEligible, false);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.publicReleaseAuthorized, false);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.studentDeliveryAuthorized, false);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.automaticStudentPublication, false);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.manualApprovalRequired, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.publicReleaseDecisionRequired, true);
assert.equal(
  SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.releaseBoundary,
  "FAMILY_FREEZE_DOES_NOT_AUTHORIZE_MOCK_PUBLIC_OR_STUDENT_RELEASE",
);

const evidence = {
  authorityId: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.authorityId,
  status: "PASS_SPATIAL_63_QL_FAMILY_FREEZE_V1" as const,
  sourceSoakAuthorityId: SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.authorityId,
  sourceSoakRunId: SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.workflowRunId,
  sourceSoakArtifactId: SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.artifactId,
  sourceSoakArtifactDigest: SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1.artifactDigest,
  permanentQlRange: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.permanentQlRange,
  permanentQlCount: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.permanentQlCount,
  mainQuestionStudioQlCount: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.mainQuestionStudioQlCount,
  separateCndQlCount: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.separateCndQlCount,
  familyPermanentQlUnionCount: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.familyPermanentQlUnionCount,
  supportedLanguages: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.supportedLanguages,
  familyFrozen: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.familyFrozen,
  releaseGates: {
    mockTestEligible: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.mockTestEligible,
    publicReleaseAuthorized: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.publicReleaseAuthorized,
    studentDeliveryAuthorized: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.studentDeliveryAuthorized,
    automaticStudentPublication: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.automaticStudentPublication,
  },
  mutationRequiresExplicitSupersedingAuthority:
    SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.mutationRequiresExplicitSupersedingAuthority,
  nextGate: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.nextGate,
} as const;

const evidencePath = resolve(cwd, "dist/reasoning-v1/spatial/spa-family-freeze-v1-evidence.json");
mkdirSync(dirname(evidencePath), { recursive: true });
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(evidence.status, evidence);
