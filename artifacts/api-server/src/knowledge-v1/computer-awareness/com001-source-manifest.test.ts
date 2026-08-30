import { strict as assert } from "node:assert";

import {
  COM001_SOURCE_AUTHORITIES,
  COM001_SOURCE_REJECTIONS,
  auditCom001SourceManifest,
} from "./com001-source-manifest";

const audit = auditCom001SourceManifest();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.authorityCount >= 8, true);
assert.equal(audit.rejectionCount >= 1, true);

const ssc = COM001_SOURCE_AUTHORITIES.find(
  (source) => source.sourceId === "SSC-CGL-2026-NOTICE",
);
assert.ok(ssc);
assert.equal(ssc.authorityClass, "OFFICIAL_EXAM");
assert.equal(ssc.supports.includes("scope:computer-memory"), true);
assert.equal(ssc.supports.includes("scope:backup-devices"), true);

const nistByte = COM001_SOURCE_AUTHORITIES.find(
  (source) => source.sourceId === "NIST-CSRC-BYTE",
);
assert.ok(nistByte);
assert.equal(nistByte.authorityClass, "STANDARD");

const binary = COM001_SOURCE_AUTHORITIES.find(
  (source) => source.sourceId === "NIST-BINARY-PREFIXES",
);
assert.ok(binary);
assert.equal(
  binary.notes.some((note) => /MB with MiB/i.test(note)),
  true,
);

const virtualMemorySources = COM001_SOURCE_AUTHORITIES.filter((source) =>
  source.supports.includes("virtual-memory-concept"),
);
assert.equal(virtualMemorySources.length >= 2, true);

const romSources = COM001_SOURCE_AUTHORITIES.filter((source) =>
  source.supports.some((scope) => /rom|eeprom|eprom|prom/i.test(scope)),
);
assert.equal(romSources.length >= 2, true);

const rejectedIBM = COM001_SOURCE_REJECTIONS.find(
  (source) => source.sourceId === "IBM-PRIMARY-VS-SECONDARY-STORAGE",
);
assert.ok(rejectedIBM);
assert.match(rejectedIBM.reason, /DRAM-volatility statement/i);
assert.equal(
  COM001_SOURCE_AUTHORITIES.some(
    (source) => source.sourceId === rejectedIBM.sourceId,
  ),
  false,
);
