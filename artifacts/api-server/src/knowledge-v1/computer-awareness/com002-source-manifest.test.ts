import { strict as assert } from "node:assert";

import {
  COM002_SOURCE_AUTHORITIES,
  auditCom002SourceManifest,
} from "./com002-source-manifest";

const audit = auditCom002SourceManifest();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.sourceCount, 13);
assert.equal(audit.pyqCount >= 5, true);
assert.equal(audit.firstPartyCount >= 7, true);

for (const requiredScope of [
  "operating-system-basics",
  "file-folder-management",
  "file-extension-concept",
  "file-type-extension-mapping",
  "windows-shortcuts",
  "kernel-core",
  "pyq:kernel-core",
  "pyq:real-time-os",
  "pyq:file-type-extension",
  "pyq:recycle-bin",
]) {
  assert.equal(
    audit.supportScopes.includes(requiredScope),
    true,
    `COM-002 source manifest missing support scope ${requiredScope}`,
  );
}

assert.equal(
  COM002_SOURCE_AUTHORITIES.some(
    (source) => source.sourceId === "MICROSOFT-WINDOWS-SHORTCUTS-2026",
  ),
  true,
);
assert.equal(
  COM002_SOURCE_AUTHORITIES.some(
    (source) => source.sourceId === "NIELIT-CCC-REV4-2023",
  ),
  true,
);

console.log("[COM002-SOURCE-MANIFEST]", audit);
