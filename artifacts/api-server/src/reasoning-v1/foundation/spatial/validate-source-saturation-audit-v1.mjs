import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const baseUrl = import.meta.url;
const authority = JSON.parse(readFileSync(new URL("./spatial-production-authority-v1.json", baseUrl), "utf8"));
const audit = JSON.parse(readFileSync(new URL("./spatial-source-saturation-audit-v1.json", baseUrl), "utf8"));

const EXPECTED_AUTHORITY_HEAD = "29df0b4e904e94ab4030b265add1c503704efbcf";
const EXPECTED_SCALE_HEAD = "caff1d753358a0a9b12e8c892c391adbb007eab8";
const EXPECTED_CHAPTERS = ["MIR-001", "WAT-001", "FAN-001", "FCL-001", "FSR-001"];

assert.equal(audit.schemaVersion, "spa-source-saturation-audit-v1");
assert.equal(audit.auditId, "SPA-FND-001-SOURCE-SATURATION-AUDIT-V1");
assert.equal(audit.authorityManifest.authorityId, authority.authorityId);
assert.equal(audit.authorityManifest.authorityHeadBeforeAudit, EXPECTED_AUTHORITY_HEAD);
assert.equal(audit.authorityManifest.baselineProductionScaleHead, EXPECTED_SCALE_HEAD);
assert.equal(authority.baseline.headSha, EXPECTED_SCALE_HEAD);
assert.equal(authority.lifecycle.permanentQlCount, 0);
assert.equal(audit.authorityManifest.permanentQlCount, 0);

for (const [key, value] of Object.entries(audit.principles)) {
  assert.equal(value, true, `Audit principle '${key}' must remain true.`);
}

assert.deepEqual(audit.chapterAudits.map((chapter) => chapter.chapterId), EXPECTED_CHAPTERS);
assert.equal(audit.sources.length, 6);
assert.equal(new Set(audit.sources.map((source) => source.id)).size, audit.sources.length);
assert.equal(audit.examScope.SSC.status, "TAXONOMY_EVIDENCE_SUFFICIENT_FOR_DISCOVERY");
assert.equal(audit.examScope.RAILWAY_POLICE_DSSSB.status, "SUPPORTING_EVIDENCE_PRESENT");
assert.equal(audit.examScope.BANKING.status, "NOT_ESTABLISHED");
assert.equal(audit.examScope.PUNJAB_STATE.status, "NOT_ESTABLISHED");

const authorityAnchors = authority.chapters.flatMap((chapter) =>
  chapter.checkpoints.flatMap((checkpoint) => checkpoint.anchors),
);
const authorityAnchorIds = authorityAnchors.map((anchor) => anchor.id).sort();
const normalized = audit.chapterAudits.flatMap((chapter) => chapter.normalizedLearnerArchetypes);
const gaps = audit.chapterAudits.flatMap((chapter) => chapter.newGapCandidates);
const heldPatterns = audit.chapterAudits.flatMap((chapter) => chapter.heldSourcePatterns ?? []);
const mappedAnchorIds = normalized.flatMap((entry) => entry.maps ?? []).sort();
const referencedGapIds = normalized.flatMap((entry) => entry.gapIds ?? []);
const gapIds = gaps.map((gap) => gap.id);

assert.equal(new Set(normalized.map((entry) => entry.id)).size, normalized.length, "Normalized learner archetype IDs must be unique.");
assert.equal(new Set(gapIds).size, gapIds.length, "Gap IDs must be unique.");
assert(normalized.every((entry) => /^(MIR|WAT|FAN|FCL|FSR)-LA-\d{2}$/.test(entry.id)), "Normalized learner archetypes must use provisional LA IDs.");
assert(gaps.every((gap) => /^(FAN|FCL|FSR)-GAP-\d{2}$/.test(gap.id)), "Only FAN/FCL/FSR may own remediation gap IDs in this audit.");
assert(heldPatterns.every((entry) => /^FCL-HOLD-\d{2}$/.test(entry.id)), "Held source-pattern IDs must remain explicit and non-QL.");
assert.deepEqual(mappedAnchorIds, authorityAnchorIds, "Every current technical authority anchor must map exactly once into the normalized learner-archetype audit.");
assert.equal(new Set(mappedAnchorIds).size, mappedAnchorIds.length, "A technical authority anchor must not be mapped into multiple normalized learner archetypes.");
assert(referencedGapIds.every((id) => gapIds.includes(id)), "Every normalized gap reference must resolve to a declared gap candidate.");
assert(gapIds.every((id) => referencedGapIds.includes(id)), "Every declared gap candidate must be attached to a normalized learner archetype.");

const byChapter = new Map(audit.chapterAudits.map((chapter) => [chapter.chapterId, chapter]));
assert.equal(byChapter.get("MIR-001").verdict, "DISCOVERY_TAXONOMY_SATURATED_SCALE_PENDING");
assert.equal(byChapter.get("WAT-001").verdict, "DISCOVERY_TAXONOMY_SATURATED_SCALE_PENDING");
for (const id of ["FAN-001", "FCL-001", "FSR-001"]) {
  assert.equal(byChapter.get(id).verdict, "REMEDIATION_REQUIRED_BEFORE_EXAM_SATURATION");
}
assert.equal(byChapter.get("MIR-001").newGapCandidates.length, 0);
assert.equal(byChapter.get("WAT-001").newGapCandidates.length, 0);
assert.equal(byChapter.get("FAN-001").newGapCandidates.length, 5);
assert.equal(byChapter.get("FCL-001").newGapCandidates.length, 6);
assert.equal(byChapter.get("FSR-001").newGapCandidates.length, 8);
assert.equal(byChapter.get("WAT-001").normalizedLearnerArchetypes.filter((entry) => entry.status === "HOLD").length, 1);
assert.equal(byChapter.get("FCL-001").heldSourcePatterns.length, 1);

const c = audit.declaredCounts;
assert.equal(c.controlledChapters, 5);
assert.equal(c.currentTechnicalAnchorsIncludingHold, 49);
assert.equal(c.currentLearnerCandidateAnchors, 48);
assert.equal(c.normalizedLearnerArchetypesIncludingHolds, 35);
assert.equal(c.normalizedActiveLearnerArchetypes, 34);
assert.equal(c.normalizedHoldArchetypes, 1);
assert.equal(c.newGapCandidates, 19);
assert.equal(c.heldSourcePatterns, 1);
assert.equal(c.permanentQls, 0);
assert.equal(authorityAnchors.length, c.currentTechnicalAnchorsIncludingHold);
assert.equal(authorityAnchors.filter((anchor) => anchor.status !== "HOLD").length, c.currentLearnerCandidateAnchors);
assert.equal(normalized.length, c.normalizedLearnerArchetypesIncludingHolds);
assert.equal(normalized.filter((entry) => entry.status !== "HOLD").length, c.normalizedActiveLearnerArchetypes);
assert.equal(normalized.filter((entry) => entry.status === "HOLD").length, c.normalizedHoldArchetypes);
assert.equal(gaps.length, c.newGapCandidates);
assert.equal(heldPatterns.length, c.heldSourcePatterns);

assert.equal(audit.gateResult.sourceAndExamSaturationReview, "COMPLETED_WITH_SCOPE_LIMITS");
assert.equal(audit.gateResult.archetypeMergeSplitGapAudit, "COMPLETED_REMEDIATION_REQUIRED");
assert.equal(audit.gateResult.permanentQlAllocationAllowed, false);
assert.equal(audit.gateResult.questionStudioActivationAllowed, false);
assert.equal(audit.gateResult.nextGate, "SPATIAL_GAP_AUTHORITY_AND_RUNTIME_REMEDIATION_V1");
assert(!JSON.stringify(audit).match(/(?:MIR|WAT|FAN|FCL|FSR)-QL-\d+/), "Source saturation audit must not allocate permanent QL IDs.");

console.log("PASS_SPA_FND_001_SOURCE_SATURATION_AUDIT_V1");
console.log(JSON.stringify({
  controlledChapters: c.controlledChapters,
  normalizedLearnerArchetypes: normalized.length,
  newGapCandidates: gaps.length,
  heldSourcePatterns: heldPatterns.length,
  banking: audit.examScope.BANKING.status,
  punjabState: audit.examScope.PUNJAB_STATE.status,
  permanentQls: c.permanentQls,
  nextGate: audit.gateResult.nextGate,
}, null, 2));
