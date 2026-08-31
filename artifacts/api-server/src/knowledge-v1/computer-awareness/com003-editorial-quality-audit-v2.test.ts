import { strict as assert } from "node:assert";

import { auditCom003EditorialQualityV2 } from "./com003-editorial-quality-audit-v2";

const audit = auditCom003EditorialQualityV2();
assert.equal(audit.questionCount, 228);
assert.equal(audit.qlCount, 19);
assert.equal(audit.valid, true, [
  ...audit.blockers,
  ...audit.duplicateStemGroups.map((group) => `DUPLICATE:${group.stem}:${group.questionIds.join(",")}`),
].join("\n"));
assert.equal(audit.blockerCount, 0);
assert.equal(audit.duplicateStemGroups.length, 0);
assert.equal(audit.coverage.every((entry) => entry.questionCount === 12), true);
assert.equal(audit.coverage.every((entry) => entry.uniqueStemCount >= 8), true);
assert.equal(audit.coverage.every((entry) => entry.stemFamilyCount >= 3), true);
assert.equal(audit.coverage.every((entry) => entry.answerPositions.every((count) => count > 0)), true);
assert.equal(audit.contentFrozen, false);
assert.equal(audit.runtimeRegistered, false);
assert.equal(audit.productionReleased, false);

console.log("[COM003-EDITORIAL-QUALITY-AUDIT-V2]", JSON.stringify(audit, null, 2));
