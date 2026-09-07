import { strict as assert } from "node:assert";
import { COM005_DISCOVERY_SOURCE_REFS, COM005_NETWORKING_DISCOVERY, auditCom005NetworkingDiscovery } from "./com005-networking-discovery";

const audit = auditCom005NetworkingDiscovery();
assert.deepEqual(audit.issues, []);
assert.equal(audit.candidateCount, 10);
assert.equal(audit.relationFamilyCount, 10);
assert.equal(audit.sourceRefCount, 8);
assert.equal(audit.officialOrStandardsCandidateCount >= 8, true);
assert.equal(audit.pyqRequiredCandidateCount >= 8, true);
assert.equal(audit.pyqConfirmedCandidateCount, 1);
assert.deepEqual(audit.com004BoundaryIds, ["NET-DISC-005", "NET-DISC-006", "NET-DISC-007"]);
assert.deepEqual(audit.com006BoundaryIds, ["NET-DISC-005"]);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.productionReady, false);
assert.equal(audit.sourceSaturationClosed, false);
assert.equal(Object.keys(COM005_DISCOVERY_SOURCE_REFS).length, 8);
assert.equal(COM005_NETWORKING_DISCOVERY.every((candidate) => candidate.productionState === "DISCOVERY_ONLY"), true);
assert.equal(COM005_NETWORKING_DISCOVERY.some((candidate) => candidate.candidateId === "NET-DISC-003"), true);
assert.equal(COM005_NETWORKING_DISCOVERY.some((candidate) => candidate.candidateId === "NET-DISC-007"), true);

console.log("[COM005-NETWORKING-DISCOVERY]", audit);
