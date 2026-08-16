import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  SPATIAL_GAP_AUTHORITY_V1,
  SPATIAL_GAP_CAPABILITY_IDS_V1,
  SPATIAL_GAP_IDS_V1,
  generateSpatialGapRuntimeCandidateV1,
  synthesizeSpatialGapRuntimeScaleV1,
  validateSpatialScene,
} from "../foundation/spatial/index";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const EXPECTED_GAPS = 19;
const REQUESTED_PER_GAP = 100;
const seedPrefix = "SPA-FND-001-GAP-RUNTIME-REMEDIATION-V1-PROOF";

assert(SPATIAL_GAP_IDS_V1.length === EXPECTED_GAPS, `Expected ${EXPECTED_GAPS} audited gaps.`);
assert(SPATIAL_GAP_AUTHORITY_V1.length === EXPECTED_GAPS, `Expected ${EXPECTED_GAPS} gap authority entries.`);
assert(
  JSON.stringify(SPATIAL_GAP_AUTHORITY_V1.map((entry) => entry.gapId)) === JSON.stringify(SPATIAL_GAP_IDS_V1),
  "Gap authority order or identity diverged from the audited gap list.",
);
assert(new Set(SPATIAL_GAP_IDS_V1).size === EXPECTED_GAPS, "Gap IDs must be unique.");
assert(
  SPATIAL_GAP_AUTHORITY_V1.every((entry) =>
    entry.runtimeStatus === "RUNTIME_CAPABILITY_SCALE_VALIDATED" &&
    entry.learnerQuestionStatus === "QUESTION_SYNTHESIS_PENDING" &&
    entry.permanentQlId === null,
  ),
  "Gap authority maturity or QL lock is incorrect.",
);

for (const gapId of SPATIAL_GAP_IDS_V1) {
  const sample = generateSpatialGapRuntimeCandidateV1(gapId, `${seedPrefix}:REP:${gapId}`);
  assert(sample.gapId === gapId, `${gapId}: representative gap identity changed.`);
  assert(sample.scenes.length >= 2, `${gapId}: representative proof must contain at least two scenes.`);
  assert(sample.proofChecks.length > 0, `${gapId}: representative proof has no semantic checks.`);
  assert(sample.proofChecks.every((proofCheck) => proofCheck.pass), `${gapId}: representative semantic proof failed.`);
  for (const scene of sample.scenes) {
    const validation = validateSpatialScene(scene);
    assert(validation.ok, `${gapId}: representative scene '${scene.id}' failed scene validation.`);
  }
}

const batch = synthesizeSpatialGapRuntimeScaleV1({
  seedPrefix,
  requestedPerGap: REQUESTED_PER_GAP,
});

assert(batch.totalAccepted === EXPECTED_GAPS * REQUESTED_PER_GAP, `Expected 1900 runtime candidates, got ${batch.totalAccepted}.`);
assert(batch.accepted.length === batch.totalAccepted, "Accepted runtime candidate count mismatch.");
assert(new Set(batch.accepted.map((candidate) => candidate.contentFingerprint)).size === batch.totalAccepted, "Runtime scale proof contains duplicate content fingerprints.");
assert(new Set(batch.accepted.map((candidate) => candidate.deliveryFingerprint)).size === batch.totalAccepted, "Runtime scale proof contains duplicate delivery fingerprints.");

for (const gapId of SPATIAL_GAP_IDS_V1) {
  assert(batch.gapCounts[gapId] === REQUESTED_PER_GAP, `${gapId}: expected ${REQUESTED_PER_GAP} candidates, got ${batch.gapCounts[gapId]}.`);
}
for (const capabilityId of SPATIAL_GAP_CAPABILITY_IDS_V1) {
  assert(batch.capabilityCounts[capabilityId] > 0, `Reusable capability '${capabilityId}' was not exercised by the 19-gap scale proof.`);
}

for (const candidate of batch.accepted) {
  assert(candidate.proofChecks.every((proofCheck) => proofCheck.pass), `${candidate.gapId}/${candidate.seed}: semantic proof failure leaked into accepted scale batch.`);
  assert(candidate.lifecycle.permanentQlId === null, `${candidate.gapId}: permanent QL leaked.`);
  assert(candidate.lifecycle.questionStudioDiscoverable === false, `${candidate.gapId}: Question Studio discovery leaked.`);
  assert(candidate.lifecycle.questionBankWritable === false, `${candidate.gapId}: Question Bank write leaked.`);
  assert(candidate.lifecycle.testEligible === false, `${candidate.gapId}: test eligibility leaked.`);
  assert(candidate.lifecycle.publiclyPublishable === false, `${candidate.gapId}: publication leaked.`);
}

const replay = synthesizeSpatialGapRuntimeScaleV1({
  seedPrefix,
  requestedPerGap: REQUESTED_PER_GAP,
});
assert(
  JSON.stringify(batch.accepted.map((candidate) => candidate.deliveryFingerprint)) ===
    JSON.stringify(replay.accepted.map((candidate) => candidate.deliveryFingerprint)),
  "Gap runtime scale proof is not deterministic for the same seed prefix.",
);

for (const gapId of SPATIAL_GAP_IDS_V1) {
  const original = generateSpatialGapRuntimeCandidateV1(gapId, `${seedPrefix}:ALT-CHECK:${gapId}:A`);
  const alternate = generateSpatialGapRuntimeCandidateV1(gapId, `${seedPrefix}:ALT-CHECK:${gapId}:B`);
  assert(original.contentFingerprint !== alternate.contentFingerprint, `${gapId}: alternate seed did not change runtime content.`);
}

const chapterCounts = {
  fan: batch.accepted.filter((candidate) => candidate.chapterCode === "FAN-001").length,
  fcl: batch.accepted.filter((candidate) => candidate.chapterCode === "FCL-001").length,
  fsr: batch.accepted.filter((candidate) => candidate.chapterCode === "FSR-001").length,
};
assert(chapterCounts.fan === 500, `Expected FAN runtime proof count 500, got ${chapterCounts.fan}.`);
assert(chapterCounts.fcl === 600, `Expected FCL runtime proof count 600, got ${chapterCounts.fcl}.`);
assert(chapterCounts.fsr === 800, `Expected FSR runtime proof count 800, got ${chapterCounts.fsr}.`);

const evidence = {
  status: "PASS_SPA_FND_001_GAP_RUNTIME_REMEDIATION_V1",
  runtimeAuthority: {
    auditedGaps: SPATIAL_GAP_IDS_V1.length,
    reusableCapabilities: SPATIAL_GAP_CAPABILITY_IDS_V1.length,
    learnerQuestionStatus: "QUESTION_SYNTHESIS_PENDING",
  },
  scale: {
    requestedPerGap: REQUESTED_PER_GAP,
    totalAccepted: batch.totalAccepted,
    chapterCounts,
    gapCounts: batch.gapCounts,
    capabilityCounts: batch.capabilityCounts,
  },
  checks: {
    exactNineteenGapIdentity: true,
    allRepresentativeSemanticProofsPass: true,
    allScenesValidate: true,
    uniqueRuntimeContent: true,
    deterministicReplay: true,
    alternateSeedDivergence: true,
    allReusableCapabilitiesExercised: true,
    noPermanentQls: true,
    noQuestionStudioActivation: true,
    noQuestionBankWrites: true,
    noMockEligibility: true,
    noPublication: true,
  },
  lifecycle: batch.lifecycle,
  nextGate: "SPATIAL_GAP_QUESTION_SYNTHESIS_AND_EDITORIAL_V1",
};

const outputDir = join(process.cwd(), "dist", "reasoning-v1", "spatial");
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "spa-gap-runtime-remediation-v1-evidence.json"), JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence, null, 2));
