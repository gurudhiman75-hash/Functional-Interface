import { strict as assert } from "node:assert";

import { auditCom003EditorialQualityV3 } from "./com003-editorial-quality-audit-v3";

const audit = auditCom003EditorialQualityV3();
assert.equal(audit.questionCount, 228);
assert.equal(audit.qlCount, 19);
assert.equal(audit.valid, true, [...audit.blockers, ...audit.advisories].join("\n"));
assert.equal(audit.blockerCount, 0);
assert.equal(audit.advisoryCount, 0, audit.advisories.join("\n"));
assert.equal(audit.duplicateStemGroups.length, 0);
assert.equal(audit.coverage.every((entry) => entry.questionCount === 12), true);
assert.equal(audit.coverage.every((entry) => entry.uniqueStemCount >= 8), true);
assert.equal(audit.coverage.every((entry) => entry.stemFamilyCount >= 3), true);
assert.equal(audit.coverage.every((entry) => entry.uniqueExplanationCount >= 6), true);
assert.equal(audit.coverage.every((entry) => entry.answerPositions.every((count) => count > 0)), true);
assert.equal(audit.status, "EDITORIAL_AUDIT_CLEAN");
assert.equal(audit.contentFrozen, false);
assert.equal(audit.runtimeRegistered, false);
assert.equal(audit.productionReleased, false);

console.log("[COM003-EDITORIAL-QUALITY-AUDIT-V3]", JSON.stringify(audit, null, 2));
