import { strict as assert } from "node:assert";

import {
  COM003_OFFICE_PRODUCTIVITY_DISCOVERY,
  auditCom003OfficeProductivityDiscovery,
} from "./com003-office-productivity-discovery";

const audit = auditCom003OfficeProductivityDiscovery();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.candidateCount, 40);
assert.equal(audit.relationFamilyCount >= 32, true);
assert.equal(audit.pyqConfirmedCandidateIds.length >= 12, true);
assert.equal(audit.versionSensitiveCandidateIds.length >= 5, true);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.productionReady, false);

for (const requiredCandidate of [
  "OFF-DISC-001",
  "OFF-DISC-004",
  "OFF-DISC-007",
  "OFF-DISC-017",
  "OFF-DISC-019",
  "OFF-DISC-022",
  "OFF-DISC-024",
  "OFF-DISC-026",
  "OFF-DISC-029",
  "OFF-DISC-031",
  "OFF-DISC-035",
  "OFF-DISC-036",
  "OFF-DISC-040",
]) {
  assert.equal(
    COM003_OFFICE_PRODUCTIVITY_DISCOVERY.some((candidate) => candidate.candidateId === requiredCandidate),
    true,
    `COM-003 discovery missing ${requiredCandidate}`,
  );
}

const officeFormats = COM003_OFFICE_PRODUCTIVITY_DISCOVERY.find((candidate) => candidate.candidateId === "OFF-DISC-004");
assert.ok(officeFormats);
assert.equal(
  officeFormats.ownershipNotes?.some((note) => note.includes("COM-002")),
  true,
  "COM-003 must protect generic file-extension ownership in COM-002",
);

const appPurpose = COM003_OFFICE_PRODUCTIVITY_DISCOVERY.find((candidate) => candidate.candidateId === "OFF-DISC-001");
assert.ok(appPurpose);
assert.equal(
  appPurpose.ownershipNotes?.some((note) => note.includes("COM-004")) &&
    appPurpose.ownershipNotes?.some((note) => note.includes("COM-007")),
  true,
  "COM-003 must protect e-mail/database ownership boundaries",
);

for (const compositionId of ["OFF-DISC-039", "OFF-DISC-040"]) {
  const composition = COM003_OFFICE_PRODUCTIVITY_DISCOVERY.find((candidate) => candidate.candidateId === compositionId);
  assert.ok(composition);
  assert.equal(
    composition.ownershipNotes?.some((note) => /approved atomic facts|source-approved/i.test(note)),
    true,
    `${compositionId} must remain a composition-only family`,
  );
}

console.log("[COM003-OFFICE-PRODUCTIVITY-DISCOVERY]", audit);