import { strict as assert } from "node:assert";

import { COM003_SOURCE_AUTHORITIES, auditCom003SourceManifest } from "./com003-source-manifest";

const audit = auditCom003SourceManifest();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.sourceCount >= 18, true);
assert.equal(audit.firstPartyCount >= 12, true);
assert.equal(audit.pyqCount >= 6, true);
assert.equal(audit.officialScopeCount >= 3, true);

for (const requiredSource of [
  "SSC-CGL-2026-NOTICE",
  "NIELIT-CCC-REV3-2019",
  "MICROSOFT-WORD-MAIL-MERGE-2026",
  "MICROSOFT-EXCEL-FORMULAS-2026",
  "MICROSOFT-POWERPOINT-TRANSITION-ANIMATION-2026",
  "PYQ-SSC-CHSL-2024-MAIL-MERGE",
  "PYQ-SSC-CGL-2024-T2-OFFICE-SHORTCUTS",
  "PYQ-PUNJAB-POLICE-SI-POWERPOINT-TABS",
]) {
  assert.equal(
    COM003_SOURCE_AUTHORITIES.some((source) => source.sourceId === requiredSource),
    true,
    `COM-003 source manifest missing ${requiredSource}`,
  );
}

const pyqSources = COM003_SOURCE_AUTHORITIES.filter((source) => source.authorityClass === "PYQ_EVIDENCE");
for (const source of pyqSources) {
  assert.equal(
    source.notes.some((note) => /canonical|source|truth|version/i.test(note)),
    true,
    `${source.sourceId} must preserve the PYQ-vs-truth authority boundary`,
  );
}

console.log("[COM003-SOURCE-MANIFEST]", audit);