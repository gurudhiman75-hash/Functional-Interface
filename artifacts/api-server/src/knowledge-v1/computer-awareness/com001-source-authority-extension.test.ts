import { strict as assert } from "node:assert";

import {
  COM001_ADDITIONAL_SOURCE_AUTHORITIES,
  auditCom001AdditionalSources,
} from "./com001-source-authority-extension";

const audit = auditCom001AdditionalSources();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.sourceCount >= 19, true);

for (const sourceId of [
  "NIST-CSRC-BIT",
  "TECHTARGET-COMPUTER-MEMORY-2025",
  "IBM-PRIMARY-STORAGE-2024",
  "INTEL-MEMORY-HIERARCHY-2007",
  "IBM-FLOPPY-HISTORY",
  "KINGSTON-SD-MICROSD-CARDS",
]) {
  assert.equal(
    COM001_ADDITIONAL_SOURCE_AUTHORITIES.some((entry) => entry.sourceId === sourceId),
    true,
    `Missing reviewed authority ${sourceId}`,
  );
}

const ibmPrimary = COM001_ADDITIONAL_SOURCE_AUTHORITIES.find(
  (entry) => entry.sourceId === "IBM-PRIMARY-STORAGE-2024",
);
assert.ok(ibmPrimary);
assert.equal(
  ibmPrimary.notes.some((note) =>
    /separate from the rejected IBM primary-vs-secondary page/i.test(note),
  ),
  true,
  "IBM primary-storage authority must explicitly remain separate from the rejected primary-vs-secondary page",
);
