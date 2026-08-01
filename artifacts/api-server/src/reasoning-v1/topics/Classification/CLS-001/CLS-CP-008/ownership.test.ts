import assert from "node:assert/strict";
import {
  buildClsCp008OwnershipAudit,
  CLS_CP008_CANDIDATES,
  CLS_CP008_SOURCE_CONTROLS,
} from "./ownership-registry";

const audit = buildClsCp008OwnershipAudit();

assert.equal(audit.checkpointId, "CLS-CP-008");
assert.equal(audit.permanentQlCount, 0);
assert.deepEqual(audit.permanentQlIds, []);
assert.equal(audit.newRuntimeGeneratorCount, 0);
assert.equal(audit.questionStudioDiscoverable, false);
assert.equal(audit.questionBankWritable, false);
assert.equal(audit.testEligible, false);
assert.equal(audit.publiclyPublishable, false);

assert.equal(CLS_CP008_CANDIDATES.length, 11);
assert.equal(CLS_CP008_SOURCE_CONTROLS.length, 6);
assert.equal(new Set(CLS_CP008_CANDIDATES.map((candidate) => candidate.candidateId)).size, 11);
assert.equal(new Set(CLS_CP008_SOURCE_CONTROLS.map((control) => control.sourceControlId)).size, 6);

const candidatesById = new Map(
  CLS_CP008_CANDIDATES.map((candidate) => [candidate.candidateId, candidate]),
);
for (const control of CLS_CP008_SOURCE_CONTROLS) {
  const candidate = candidatesById.get(control.candidateId);
  assert.ok(candidate, `${control.sourceControlId} points to an unknown candidate`);
  assert.equal(candidate.renderer, control.renderer);
  assert.equal(candidate.sourceBacked, true);
}

const retainedNewQlCandidates = CLS_CP008_CANDIDATES.filter(
  (candidate) => ![
    "MERGE_EXISTING_QL",
    "REASSIGN_TO_CHAPTER",
    "REJECT_FOR_SOURCE_GAP",
  ].includes(candidate.disposition),
);
assert.deepEqual(retainedNewQlCandidates, []);

const merged = CLS_CP008_CANDIDATES.filter(
  (candidate) => candidate.disposition === "MERGE_EXISTING_QL",
);
assert.equal(merged.length, 1);
assert.equal(merged[0]?.candidateId, "CLS-CP008-CAND-001");
assert.equal(merged[0]?.targetOwner, "CLS-001");
assert.equal(merged[0]?.targetQlId, "CLS-QL-001");
assert.equal(merged[0]?.renderer, "TEXT");

const reassigned = CLS_CP008_CANDIDATES.filter(
  (candidate) => candidate.disposition === "REASSIGN_TO_CHAPTER",
);
assert.ok(reassigned.length >= 6);
assert.ok(reassigned.every((candidate) => candidate.targetOwner !== null));
assert.ok(reassigned.every((candidate) => candidate.targetQlId === null));

const visualCandidates = CLS_CP008_CANDIDATES.filter(
  (candidate) => candidate.renderer === "FIGURE",
);
assert.ok(visualCandidates.length > 0);
assert.ok(
  visualCandidates.every(
    (candidate) =>
      candidate.disposition === "REASSIGN_TO_CHAPTER" &&
      candidate.targetOwner === "REAS-FCL",
  ),
);

const sourceGapRejects = CLS_CP008_CANDIDATES.filter(
  (candidate) => candidate.disposition === "REJECT_FOR_SOURCE_GAP",
);
assert.equal(sourceGapRejects.length, 3);
assert.ok(sourceGapRejects.every((candidate) => candidate.sourceBacked === false));
assert.ok(sourceGapRejects.every((candidate) => candidate.recurringSourceAuthority === false));
assert.ok(sourceGapRejects.every((candidate) => candidate.targetOwner === null));
assert.ok(sourceGapRejects.every((candidate) => candidate.targetQlId === null));

assert.ok(
  CLS_CP008_CANDIDATES.every(
    (candidate) => candidate.reason.trim().length >= 25,
  ),
);
assert.ok(
  CLS_CP008_SOURCE_CONTROLS.every(
    (control) => control.observedForm.trim().length >= 20,
  ),
);

console.log("CLS-CP-008 zero-allocation ownership audit passed.", {
  candidateFamilies: CLS_CP008_CANDIDATES.length,
  sourceControls: CLS_CP008_SOURCE_CONTROLS.length,
  mergedIntoExistingQl: merged.map((candidate) => candidate.targetQlId),
  reassignedOwners: [...new Set(reassigned.map((candidate) => candidate.targetOwner))].sort(),
  sourceGapRejects: sourceGapRejects.length,
  permanentQlCount: audit.permanentQlCount,
  runtimeGeneratorCount: audit.newRuntimeGeneratorCount,
});
