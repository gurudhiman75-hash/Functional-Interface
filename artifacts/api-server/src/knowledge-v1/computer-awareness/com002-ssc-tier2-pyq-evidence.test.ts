import { strict as assert } from "node:assert";

import {
  COM002_SSC_TIER2_PYQ_EVIDENCE,
  auditCom002SscTier2PyqEvidence,
} from "./com002-ssc-tier2-pyq-evidence";

const audit = auditCom002SscTier2PyqEvidence();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.evidenceCount, 5);
assert.equal(audit.shortcutEvidenceCount >= 3, true);
assert.equal(audit.multiStatementEvidence, true);

for (const candidateId of [
  "OS-DISC-014",
  "OS-DISC-018",
  "OS-DISC-020",
  "OS-DISC-021",
  "OS-DISC-022",
  "OS-DISC-023",
]) {
  assert.equal(
    audit.supportedCandidateIds.includes(candidateId),
    true,
    `Recent SSC Tier-II evidence missing ${candidateId}`,
  );
}

assert.equal(
  COM002_SSC_TIER2_PYQ_EVIDENCE.every(
    (entry) => entry.evidenceUse === "TASK_RELEVANCE_ONLY",
  ),
  true,
);

console.log("[COM002-SSC-TIER2-PYQ]", audit);
