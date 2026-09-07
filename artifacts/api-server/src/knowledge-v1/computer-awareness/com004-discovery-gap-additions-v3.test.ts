import { strict as assert } from "node:assert";

import {
  COM004_DISCOVERY_GAP_ADDITIONS_V3,
  auditCom004DiscoveryGapAdditionsV3,
} from "./com004-discovery-gap-additions-v3";

const audit = auditCom004DiscoveryGapAdditionsV3();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.gapCandidateCount, 1);
assert.equal(audit.totalDiscoveryCandidateCount, 41);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.productionReady, false);

const cookie = COM004_DISCOVERY_GAP_ADDITIONS_V3[0];
assert.equal(cookie.candidateId, "WEB-DISC-041");
assert.equal(cookie.evidence.includes("OFFICIAL_EXAM"), true);
assert.equal(cookie.evidence.includes("STANDARDS_AUTHORITY"), true);
assert.equal(cookie.ownershipNotes?.some((note) => note.includes("COM-006")), true);
assert.equal(cookie.ambiguityRisks?.some((risk) => /not teach all third-party cookies as malicious/i.test(risk)), true);
assert.equal(cookie.ambiguityRisks?.some((risk) => /browser-vendor default/i.test(risk)), true);

console.log("[COM004-DISCOVERY-GAP-ADDITIONS-V3]", audit);
