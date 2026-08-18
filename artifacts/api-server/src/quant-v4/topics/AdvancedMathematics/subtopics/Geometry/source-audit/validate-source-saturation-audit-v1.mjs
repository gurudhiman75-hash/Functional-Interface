import assert from "node:assert/strict";
import fs from "node:fs";

const auditUrl = new URL("./geometry-source-saturation-audit-v1.json", import.meta.url);
const audit = JSON.parse(fs.readFileSync(auditUrl, "utf8"));

const expectedCheckpointIds = Array.from({ length: 14 }, (_, index) =>
  `GEO-CP-${String(index + 1).padStart(3, "0")}`,
);
const expectedDispositions = [
  "NO_DIAGRAM",
  "OPTIONAL_STEM_DIAGRAM",
  "REQUIRED_STEM_DIAGRAM",
  "REQUIRED_SOLUTION_DIAGRAM",
  "REQUIRED_BOTH",
];

assert.equal(audit.schemaVersion, "geo-source-saturation-audit-v1");
assert.equal(audit.auditId, "GEO-SOURCE-SATURATION-AUDIT-V1");
assert.equal(audit.authority.revision, 3);
assert.equal(
  audit.authority.baseRevision2Sha256,
  "1790e494167121d2541145deea128d202feb125496ac72533a3340f09edf10d8",
);
assert.equal(
  audit.authority.diagramPolicyAmendmentSha256,
  "08b8560c195b0bc090ef1c9c5ced5d0723c076db3bf7096fb01a108df2b06bf2",
);
assert.equal(audit.authority.permanentQlCount, 0);
assert.equal(audit.authority.frozenSolveModeCount, 0);

assert.deepEqual(audit.diagramPolicy.allowedDispositions, expectedDispositions);
assert.equal(
  audit.diagramPolicy.status,
  "PROVISIONAL_DISPOSITIONS_ASSIGNED__FREEZE_REVIEW_REQUIRED",
);

assert.equal(audit.chapterAudits.length, 14);
assert.deepEqual(
  audit.chapterAudits.map((chapter) => chapter.chapterId),
  expectedCheckpointIds,
);

const sourceIds = audit.sources.map((source) => source.id);
assert.equal(new Set(sourceIds).size, sourceIds.length, "source IDs must be unique");
assert.ok(audit.sources.length >= 8, "audit must retain multiple independent evidence sources");
for (const source of audit.sources) {
  assert.match(source.url, /^https:\/\//, `${source.id} must have an https URL`);
  assert.ok(source.coverage.length > 0, `${source.id} must declare coverage`);
}

assert.equal(
  audit.examScope.SSC.status,
  "DIRECT_SYLLABUS_AND_PYQ_EVIDENCE_PRESENT__SATURATION_NOT_CLOSED",
);
assert.equal(audit.examScope.BANKING.status, "NOT_ESTABLISHED");
assert.equal(
  audit.examScope.PUNJAB_STATE.status,
  "RECRUITMENT_PYQ_SATURATION_NOT_ESTABLISHED",
);

const mappedPrototypeIds = [];
let technicalAnchorCount = 0;
let gapCount = 0;
let archetypeCount = 0;
for (const chapter of audit.chapterAudits) {
  assert.ok(
    !chapter.verdict.includes("SATURATED") || chapter.verdict.includes("NOT") || chapter.verdict.includes("OPEN"),
    `${chapter.chapterId} must not claim source saturation`,
  );
  assert.ok(chapter.currentTechnicalAnchors > 0);
  technicalAnchorCount += chapter.currentTechnicalAnchors;
  gapCount += chapter.newGapCandidates.length;
  assert.ok(chapter.newGapCandidates.length > 0, `${chapter.chapterId} must retain explicit open gaps`);
  assert.ok(chapter.mergeSplitFindings.length > 0, `${chapter.chapterId} needs merge/split findings`);

  for (const archetype of chapter.normalizedLearnerArchetypes) {
    archetypeCount += 1;
    assert.ok(expectedDispositions.includes(archetype.diagramDisposition));
    assert.ok(archetype.maps.length > 0, `${archetype.id} must map at least one current prototype`);
    for (const prototypeId of archetype.maps) {
      assert.match(prototypeId, /^GEO-TMP-CP\d{3}-/);
      mappedPrototypeIds.push(prototypeId);
    }
  }
}

assert.equal(technicalAnchorCount, 38);
assert.equal(audit.authority.currentTemporaryPrototypeCount, 38);
assert.equal(audit.declaredCounts.currentTemporaryPrototypeCount, 38);
assert.equal(mappedPrototypeIds.length, 38);
assert.equal(
  new Set(mappedPrototypeIds).size,
  mappedPrototypeIds.length,
  "every current temporary prototype must map exactly once",
);
assert.equal(gapCount, 52);
assert.equal(audit.declaredCounts.newGapCandidates, gapCount);
assert.equal(audit.declaredCounts.controlledCheckpoints, 14);
assert.equal(audit.declaredCounts.permanentQls, 0);
assert.equal(audit.declaredCounts.frozenSolveModes, 0);
assert.ok(archetypeCount >= 30, "merge/split normalization must remain substantive");

for (const gate of [
  "sourceSaturationClaimAllowed",
  "permanentQlAllocationAllowed",
  "solveModeFreezeAllowed",
  "questionStudioActivationAllowed",
  "questionBankWriteAllowed",
  "testEligibilityAllowed",
  "publicPublicationAllowed",
]) {
  assert.equal(audit.gateResult[gate], false, `${gate} must remain false`);
}
assert.equal(audit.gateResult.externalSourceAuditWave1, "COMPLETED_WITH_GAPS");
assert.equal(audit.gateResult.nextGate, "GEO-GAP-AUTHORITY-AND-RUNTIME-REMEDIATION-V1");

console.log(
  `Geometry source audit v1 PASS: ${audit.chapterAudits.length} checkpoints, ${mappedPrototypeIds.length} mapped prototypes, ${archetypeCount} normalized archetypes, ${gapCount} explicit gaps, permanent QLs 0.`,
);
