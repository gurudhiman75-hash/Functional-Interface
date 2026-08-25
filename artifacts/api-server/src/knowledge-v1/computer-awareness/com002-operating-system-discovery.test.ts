import { strict as assert } from "node:assert";

import {
  COM002_OPERATING_SYSTEM_DISCOVERY,
  auditCom002OperatingSystemDiscovery,
} from "./com002-operating-system-discovery";

const audit = auditCom002OperatingSystemDiscovery();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.candidateCount, 25);
assert.equal(audit.relationFamilyCount >= 20, true);
assert.equal(audit.pyqConfirmedCandidateIds.length >= 7, true);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.productionReady, false);

for (const requiredCandidate of [
  "OS-DISC-001",
  "OS-DISC-004",
  "OS-DISC-005",
  "OS-DISC-008",
  "OS-DISC-014",
  "OS-DISC-016",
  "OS-DISC-017",
  "OS-DISC-019",
  "OS-DISC-020",
  "OS-DISC-025",
]) {
  assert.equal(
    COM002_OPERATING_SYSTEM_DISCOVERY.some(
      (candidate) => candidate.candidateId === requiredCandidate,
    ),
    true,
    `COM-002 discovery missing ${requiredCandidate}`,
  );
}

const officeBoundary = COM002_OPERATING_SYSTEM_DISCOVERY.find(
  (candidate) => candidate.candidateId === "OS-DISC-017",
);
assert.ok(officeBoundary);
assert.equal(
  officeBoundary.ownershipNotes?.some((note) => note.includes("COM-003")),
  true,
  "COM-002 must explicitly protect the Office-extension ownership boundary",
);

const legacyDos = COM002_OPERATING_SYSTEM_DISCOVERY.find(
  (candidate) => candidate.candidateId === "OS-DISC-025",
);
assert.ok(legacyDos);
assert.equal(legacyDos.evidence.includes("PYQ_REQUIRED"), true);

console.log("[COM002-OPERATING-SYSTEM-DISCOVERY]", audit);
