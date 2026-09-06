import { strict as assert } from "node:assert";

import {
  COM004_SATURATION_SOURCES_V1,
  COM004_SOURCE_PATTERNS_V1,
  COM004_TEMPORARY_PROTOTYPES_V1,
  auditCom004SourceSaturationV1,
} from "./com004-source-saturation-v1";

const audit = auditCom004SourceSaturationV1();

assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.sourceCount, 9);
assert.equal(audit.patternCount, 25);
assert.equal(audit.temporaryPrototypeCount, 9);
assert.equal(audit.punjabPatternIds.length >= 8, true);
assert.equal(audit.bankingPatternIds.length >= 6, true);
assert.equal(audit.keepIds.length >= 10, true);
assert.equal(audit.mergeIds.length >= 3, true);
assert.equal(audit.com005Delegations.length >= 1, true);
assert.equal(audit.com006Delegations.length >= 1, true);
assert.equal(audit.needsMoreEvidenceIds.length >= 4, true);
assert.equal(audit.rejectedIds.length >= 1, true);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.sourceSaturationClosed, false);
assert.equal(audit.mergeSplitClosed, false);
assert.equal(audit.productionReady, false);
assert.equal(audit.nextGate, "COM004_SOURCE_SATURATION_V2_GAP_EXPANSION");

const pseb = COM004_SATURATION_SOURCES_V1.find((source) => source.sourceId === "SAT-SRC-PSEB-8-2026");
assert.ok(pseb);
assert.equal(pseb.authorityClass, "OFFICIAL_CURRICULUM");
assert.equal(pseb.examFamilies.includes("PUNJAB"), true);

for (const patternId of [
  "COM004-SAT-PAT-001",
  "COM004-SAT-PAT-003",
  "COM004-SAT-PAT-006",
  "COM004-SAT-PAT-011",
  "COM004-SAT-PAT-014",
  "COM004-SAT-PAT-015",
  "COM004-SAT-PAT-017",
  "COM004-SAT-PAT-018",
  "COM004-SAT-PAT-020",
  "COM004-SAT-PAT-024",
  "COM004-SAT-PAT-025",
]) {
  assert.equal(COM004_SOURCE_PATTERNS_V1.some((pattern) => pattern.patternId === patternId), true, `Missing ${patternId}`);
}

const protocolPattern = COM004_SOURCE_PATTERNS_V1.find((pattern) => pattern.patternId === "COM004-SAT-PAT-014");
assert.ok(protocolPattern);
assert.equal(protocolPattern.ownershipNotes?.some((note) => note.includes("COM-005")), true);

const bankingSafety = COM004_SOURCE_PATTERNS_V1.find((pattern) => pattern.patternId === "COM004-SAT-PAT-017");
assert.ok(bankingSafety);
assert.equal(bankingSafety.ownershipNotes?.some((note) => note.includes("COM-006")), true);

const mutableTrivia = COM004_SOURCE_PATTERNS_V1.find((pattern) => pattern.patternId === "COM004-SAT-PAT-025");
assert.ok(mutableTrivia);
assert.equal(mutableTrivia.provisionalDisposition, "REJECT_SOURCE_THIN");

assert.equal(new Set(COM004_TEMPORARY_PROTOTYPES_V1.map((prototype) => prototype.prototypeId)).size, COM004_TEMPORARY_PROTOTYPES_V1.length);
assert.equal(COM004_TEMPORARY_PROTOTYPES_V1.every((prototype) => /^COM004-PROT-\d{3}$/.test(prototype.prototypeId)), true);

console.log("[COM004-SOURCE-SATURATION-V1]", audit);
