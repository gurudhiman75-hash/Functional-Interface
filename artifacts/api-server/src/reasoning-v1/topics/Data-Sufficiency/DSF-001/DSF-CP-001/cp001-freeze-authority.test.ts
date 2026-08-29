import assert from "node:assert/strict";
import {
  DS_STANDARD_5_EN,
  DSF_NEXT_AVAILABLE_QL_ID,
  DSF_PERMANENT_QL_REGISTRY,
  SUFFICIENCY_CLASSES,
} from "../foundation/index.ts";
import { DSF_CP001_FREEZE_AUTHORITY } from "./cp001-freeze-authority.ts";
import {
  DSF_CP001_PRE_FREEZE_DECISION,
  DSF_CP001_SOURCE_DEPENDENCIES,
} from "./cp001-source-dependencies.ts";

assert.equal(DSF_CP001_FREEZE_AUTHORITY.status, "FROZEN");
assert.equal(DSF_CP001_FREEZE_AUTHORITY.packageId, "DSF-001");
assert.equal(DSF_CP001_FREEZE_AUTHORITY.checkpointId, "DSF-CP-001");
assert.equal(DSF_CP001_FREEZE_AUTHORITY.permanentQl.qlId, "DSF-QL-001");
assert.equal(DSF_CP001_FREEZE_AUTHORITY.permanentQl.nextAvailableQlId, "DSF-QL-002");
assert.equal(DSF_CP001_FREEZE_AUTHORITY.permanentQl.newQlAllocationRequired, false);
assert.equal(DSF_NEXT_AVAILABLE_QL_ID, "DSF-QL-002");

assert.equal(SUFFICIENCY_CLASSES.length, 5);
assert.equal(DS_STANDARD_5_EN.options.length, 5);
assert.equal(new Set(DS_STANDARD_5_EN.options.map((option) => option.semanticClass)).size, 5);
assert.equal(DSF_CP001_FREEZE_AUTHORITY.semanticAuthority.targetUniquenessRequired, true);
assert.equal(DSF_CP001_FREEZE_AUTHORITY.semanticAuthority.completeWorldUniquenessRequired, false);
assert.equal(DSF_CP001_FREEZE_AUTHORITY.semanticAuthority.statementIndependenceRequired, true);
assert.equal(DSF_CP001_FREEZE_AUTHORITY.semanticAuthority.intendedActualClassParityRequired, true);

assert.equal(DSF_CP001_FREEZE_AUTHORITY.productionBackedSources.length, 4);
assert.deepEqual(
  DSF_CP001_FREEZE_AUTHORITY.productionBackedSources.map((entry) => entry.sourceChapterId),
  ["NUM-001", "RAP-001", "PCT-001", "ALG-002"],
);
const allSolveModes = DSF_CP001_FREEZE_AUTHORITY.productionBackedSources.flatMap((entry) => [...entry.solveModes]);
assert.equal(allSolveModes.length, 8);
assert.equal(new Set(allSolveModes).size, 8);
assert.equal(DSF_CP001_FREEZE_AUTHORITY.proofGate.crossWaveQuestionCount, 600);
assert.equal(DSF_CP001_FREEZE_AUTHORITY.proofGate.perDomainQuestionCount, 150);
assert.equal(DSF_CP001_FREEZE_AUTHORITY.proofGate.productionDomainCount, 4);
assert.equal(DSF_CP001_FREEZE_AUTHORITY.proofGate.productionSolveModeCount, 8);
assert.equal(DSF_CP001_FREEZE_AUTHORITY.freezeEvidence.candidateProofHead, "00ea0d1ea55b2cfacf88b761c3be41cb7784b8d8");
assert.equal(DSF_CP001_FREEZE_AUTHORITY.freezeEvidence.candidateProofRunId, 32562788021);
assert.equal(DSF_CP001_FREEZE_AUTHORITY.freezeEvidence.candidateProofStatus, "SUCCESS");
assert.equal(DSF_CP001_FREEZE_AUTHORITY.freezeEvidence.everyDomainCoveredAllFiveClasses, true);
assert.equal(DSF_CP001_FREEZE_AUTHORITY.freezeEvidence.allSourceDependenciesSatisfied, true);

const algebra = DSF_CP001_FREEZE_AUTHORITY.productionBackedSources.find((entry) => entry.sourceChapterId === "ALG-002")!;
assert("sourcePermanentQlId" in algebra);
assert.equal(algebra.sourcePermanentQlId, "ALG-QL-040");
assert.equal(algebra.sourceCpId, "ALG-CP-014");
assert.equal(algebra.sourceFreezeKey, "F-C040");
assert.equal(algebra.sourceFreezeId, "ALG-EN-v3-frozen");
assert.equal(algebra.algebraMergeCommit, "849017e332c75108aef37b8bd51d4886fc54c7f3");

assert.equal(DSF_CP001_FREEZE_AUTHORITY.sourceOwnership.sourceChaptersOwnDomainTruth, true);
assert.equal(DSF_CP001_FREEZE_AUTHORITY.sourceOwnership.dsfOwnsCanonicalSufficiencyClassification, true);
assert.equal(DSF_CP001_FREEZE_AUTHORITY.sourceOwnership.duplicateSourceSolversAllowed, false);
assert.equal(DSF_CP001_FREEZE_AUTHORITY.sourceOwnership.algebraUsesBoundedWorldApproximation, false);

assert.equal(DSF_CP001_SOURCE_DEPENDENCIES.length, 4);
assert(DSF_CP001_SOURCE_DEPENDENCIES.every((entry) => entry.status === "PRODUCTION_BACKED_ON_NEW_MAIN"));
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.status, "READY_FOR_FINAL_CP001_FREEZE");
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.blockingDomain, null);
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.sourceDependenciesSatisfied, true);
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.newQlAllocationRequired, false);

assert.equal(DSF_PERMANENT_QL_REGISTRY.length, 1);
const ql001 = DSF_PERMANENT_QL_REGISTRY[0]!;
assert.equal(ql001.qlId, "DSF-QL-001");
assert.equal(ql001.lifecycle.englishContentStatus, "CP001_PRODUCTION_GENERATION_FROZEN");
assert.deepEqual(ql001.lifecycle.productionBackedSourceChapters, ["NUM-001", "RAP-001", "PCT-001", "ALG-002"]);

for (const lifecycle of [ql001.lifecycle, DSF_CP001_FREEZE_AUTHORITY.lifecycle]) {
  assert.equal(lifecycle.questionStudioDiscoverable, false);
  assert.equal(lifecycle.questionBankWritable, false);
  assert.equal(lifecycle.testEligible, false);
  assert.equal(lifecycle.publiclyPublishable, false);
}

console.log(JSON.stringify({
  status: "PASS_DSF_CP_001_FROZEN_AUTHORITY",
  authorityId: DSF_CP001_FREEZE_AUTHORITY.authorityId,
  authorityStatus: DSF_CP001_FREEZE_AUTHORITY.status,
  permanentQlId: ql001.qlId,
  nextAvailableQlId: DSF_NEXT_AVAILABLE_QL_ID,
  productionDomains: DSF_CP001_FREEZE_AUTHORITY.productionBackedSources.map((entry) => entry.domain),
  solveModeCount: allSolveModes.length,
  crossWaveProofCount: DSF_CP001_FREEZE_AUTHORITY.proofGate.crossWaveQuestionCount,
  publicationLocked: true,
}, null, 2));
