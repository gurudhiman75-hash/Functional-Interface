import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const authority = JSON.parse(
  readFileSync(new URL("./spatial-production-authority-v1.json", import.meta.url), "utf8"),
);

const EXPECTED_BASELINE = "caff1d753358a0a9b12e8c892c391adbb007eab8";
const EXPECTED_CHAPTERS = ["MIR-001", "WAT-001", "FAN-001", "FCL-001", "FSR-001"];
const ALLOWED_STATUSES = new Set([
  "PRODUCTION_SCALE_VALIDATED",
  "PROOF_VALIDATED_SCALE_PENDING",
  "HOLD",
]);

assert.equal(authority.schemaVersion, "spa-production-authority-v1");
assert.equal(authority.authorityId, "SPA-FND-001-PRODUCTION-AUTHORITY-V1");
assert.equal(authority.baseline.pullRequest, 692);
assert.equal(authority.baseline.headSha, EXPECTED_BASELINE);
assert.equal(authority.baseline.proofMarker, "PASS_SPA_FND_001_PRODUCTION_SCALE_V2");

for (const [key, value] of Object.entries(authority.principles)) {
  assert.equal(value, true, `Authority principle '${key}' must remain true.`);
}

assert.equal(authority.lifecycle.permanentQlCount, 0);
for (const key of [
  "discoveryFrozen",
  "englishHumanFreeze",
  "questionStudioDiscovery",
  "questionBankWrites",
  "mockTestEligibility",
  "publicPublication",
  "hindiPunjabiGeneration",
  "apiDatabaseSchemaChanges",
]) {
  assert.equal(authority.lifecycle[key], false, `Lifecycle lock '${key}' must remain false.`);
}

assert.deepEqual(
  authority.chapters.map((chapter) => chapter.chapterId),
  EXPECTED_CHAPTERS,
  "The controlled authority must contain exactly the five approved spatial chapters in canonical order.",
);

const checkpoints = authority.chapters.flatMap((chapter) => chapter.checkpoints);
const anchors = checkpoints.flatMap((checkpoint) => checkpoint.anchors);
const checkpointIds = checkpoints.map((checkpoint) => checkpoint.id);
const anchorIds = anchors.map((anchor) => anchor.id);

assert.equal(new Set(checkpointIds).size, checkpointIds.length, "Discovery checkpoint IDs must be unique.");
assert.equal(new Set(anchorIds).size, anchorIds.length, "Authority anchor IDs must be unique.");
assert(checkpoints.every((checkpoint) => checkpoint.anchors.length > 0), "Every discovery checkpoint must own at least one authority anchor.");
assert(anchors.every((anchor) => ALLOWED_STATUSES.has(anchor.status)), "Every authority anchor must use an approved maturity status.");
assert(anchors.every((anchor) => Array.isArray(anchor.evidence) && anchor.evidence.length > 0), "Every authority anchor must cite controlled proof evidence.");
assert(anchorIds.every((id) => /^(MIR|WAT|FAN|FCL|FSR)-AUTH-\d{3}$/.test(id)), "Authority anchors must use non-QL discovery IDs.");
assert(checkpointIds.every((id) => /^(MIR|WAT|FAN|FCL|FSR)-CP-D\d{2}$/.test(id)), "Discovery checkpoints must use provisional D-prefixed IDs.");
assert(!JSON.stringify(authority).includes("-QL-"), "Production Authority V1 must not allocate or embed permanent QL IDs.");

const statusCount = (status) => anchors.filter((anchor) => anchor.status === status).length;
assert.equal(authority.declaredCounts.chapters, 5);
assert.equal(authority.declaredCounts.discoveryCheckpoints, 24);
assert.equal(authority.declaredCounts.authorityAnchorsIncludingHolds, 49);
assert.equal(authority.declaredCounts.learnerCandidateAnchors, 48);
assert.equal(authority.declaredCounts.productionScaleValidatedAnchors, 26);
assert.equal(authority.declaredCounts.proofValidatedScalePendingAnchors, 22);
assert.equal(authority.declaredCounts.heldPolicyAnchors, 1);
assert.equal(authority.chapters.length, authority.declaredCounts.chapters);
assert.equal(checkpoints.length, authority.declaredCounts.discoveryCheckpoints);
assert.equal(anchors.length, authority.declaredCounts.authorityAnchorsIncludingHolds);
assert.equal(statusCount("PRODUCTION_SCALE_VALIDATED"), 26);
assert.equal(statusCount("PROOF_VALIDATED_SCALE_PENDING"), 22);
assert.equal(statusCount("HOLD"), 1);
assert.equal(anchors.filter((anchor) => anchor.status !== "HOLD").length, 48);

const productionScaleIds = anchors
  .filter((anchor) => anchor.status === "PRODUCTION_SCALE_VALIDATED")
  .map((anchor) => anchor.id)
  .sort();
const expectedProductionScaleIds = [
  "FAN-AUTH-001",
  "FAN-AUTH-002",
  "FAN-AUTH-003",
  "FAN-AUTH-004",
  ...Array.from({ length: 12 }, (_, index) => `FCL-AUTH-${String(index + 9).padStart(3, "0")}`),
  ...Array.from({ length: 10 }, (_, index) => `FSR-AUTH-${String(index + 1).padStart(3, "0")}`),
].sort();
assert.deepEqual(
  productionScaleIds,
  expectedProductionScaleIds,
  "Scale-validated authority must exactly match the 4 FAN + 12 FCL + 10 FSR synthesis families proved by Production Scale V2.",
);

const holdAnchors = anchors.filter((anchor) => anchor.status === "HOLD");
assert.deepEqual(holdAnchors.map((anchor) => anchor.id), ["WAT-AUTH-004"]);
assert.match(holdAnchors[0].notes, /DIAGRAM_ONLY/);

for (const chapterId of ["MIR-001", "WAT-001"]) {
  const chapterAnchors = authority.chapters
    .find((chapter) => chapter.chapterId === chapterId)
    .checkpoints.flatMap((checkpoint) => checkpoint.anchors);
  assert(
    chapterAnchors.every((anchor) => anchor.status !== "PRODUCTION_SCALE_VALIDATED"),
    `${chapterId} must not inherit FAN/FCL/FSR scale status by association.`,
  );
}

const ownership = new Map(authority.crossChapterOwnership.map((entry) => [entry.case, entry]));
assert.equal(ownership.get("Numeric vertical mirror time arithmetic")?.owner, "CLK-001");
assert.match(ownership.get("Analog clock water image")?.spatialPolicy ?? "", /DIAGRAM_ONLY/);
assert.match(ownership.get("Language-specific vector glyph geometry")?.spatialPolicy ?? "", /Devanagari\/Gurmukhi/);
assert.equal(ownership.get("Figure Completion and later non-verbal chapters")?.owner, "future spatial chapters");

const requiredGates = new Set(authority.requiredNextGates);
for (const gate of [
  "SOURCE_AND_EXAM_SATURATION_REVIEW",
  "ARCHETYPE_MERGE_SPLIT_GAP_AUDIT",
  "PRODUCTION_SCALE_PROOF_FOR_SCALE_PENDING_ANCHORS",
  "ENGLISH_STEM_OPTION_EXPLANATION_HUMAN_REVIEW",
  "PERMANENT_QL_ALLOCATION_APPROVAL",
  "QUESTION_STUDIO_ACTIVATION_APPROVAL",
]) {
  assert(requiredGates.has(gate), `Required downstream gate '${gate}' is missing.`);
}

console.log("PASS_SPA_FND_001_PRODUCTION_AUTHORITY_V1");
console.log(
  JSON.stringify(
    {
      chapters: authority.chapters.length,
      discoveryCheckpoints: checkpoints.length,
      authorityAnchors: anchors.length,
      learnerCandidateAnchors: anchors.filter((anchor) => anchor.status !== "HOLD").length,
      productionScaleValidated: statusCount("PRODUCTION_SCALE_VALIDATED"),
      proofValidatedScalePending: statusCount("PROOF_VALIDATED_SCALE_PENDING"),
      holds: statusCount("HOLD"),
      permanentQls: authority.lifecycle.permanentQlCount,
      questionStudioDiscovery: authority.lifecycle.questionStudioDiscovery,
    },
    null,
    2,
  ),
);
