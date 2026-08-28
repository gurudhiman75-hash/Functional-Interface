import { strict as assert } from "node:assert";
import { SRI_001_MANIFEST } from "../SRI-001/manifest";
import { SRI_002_MANIFEST } from "../SRI-002/manifest";
import { SRI_CHAPTER_MANIFEST, assertSriReleaseLocks } from "../chapter-manifest";
import { SRI_PERMANENT_ALLOCATION_V1 } from "../permanent-allocation-v1";
import {
  SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1,
  SRI_PERMANENT_MULTILINGUAL_FREEZE_ID_V1,
  auditSriPermanentMultilingualFreezeV1,
  generateSriPermanentMultilingualFrozenQuestionV1,
} from "../permanent-multilingual-freeze-v1";
import {
  generateSriPermanentLocalizedQuestionV1,
  type SriLocalizedLocaleV1,
} from "../permanent-localization-v1";

const EXPECTED_QLS = 58;
const SEEDS_PER_QL = 24;
const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly SriLocalizedLocaleV1[];

assertSriReleaseLocks();
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen, true);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.multilingualFrozen, true);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.questionStudioDiscoverable, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.questionStudioGenerationEnabled, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.questionBankWritesEnabled, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.testEligibilityEnabled, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.publicPublicationEnabled, false);
assert.equal(SRI_PERMANENT_ALLOCATION_V1.length, EXPECTED_QLS);
assert.equal(SRI_001_MANIFEST.permanentQlCount, 29);
assert.equal(SRI_002_MANIFEST.permanentQlCount, 29);
assert.equal(SRI_001_MANIFEST.downstreamEligibility.questionStudio, false);
assert.equal(SRI_001_MANIFEST.downstreamEligibility.questionBank, false);
assert.equal(SRI_001_MANIFEST.downstreamEligibility.tests, false);
assert.equal(SRI_001_MANIFEST.downstreamEligibility.public, false);
assert.equal(SRI_002_MANIFEST.downstreamEligibility.questionStudio, false);
assert.equal(SRI_002_MANIFEST.downstreamEligibility.questionBank, false);
assert.equal(SRI_002_MANIFEST.downstreamEligibility.tests, false);
assert.equal(SRI_002_MANIFEST.downstreamEligibility.public, false);

assert.equal(SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvalAuthority, "EXPLICIT_PRODUCT_OWNER_ARTIFACT_APPROVAL");
assert.equal(SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedArtifactId, 9684834606);
assert.equal(
  SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedArtifactDigest,
  "sha256:a212a40f917e8e91a6d5741fc4acd32a73782885981b2b7f7ef8b4c3bb7251ac",
);
assert.equal(SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedSourceHead, "a3d24d97221bf94da04e77daa140164dbcdb0e51");
assert.equal(SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.baseRecertificationRunId, 33176307480);
assert.equal(SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.recertifiedBaseSha, "2754618366072250467e4d862caa11525d4e0900");
assert.equal(SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.permanentQlCount, EXPECTED_QLS);
assert.equal(SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.localizedRuntimeQuestions, EXPECTED_QLS * SEEDS_PER_QL * LOCALES.length);
assert.deepEqual(SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.locales, LOCALES);

let generated = 0;
let deepFrozenObjects = 0;
for (const allocation of SRI_PERMANENT_ALLOCATION_V1) {
  for (let seedIndex = 0; seedIndex < SEEDS_PER_QL; seedIndex += 1) {
    const externalSeed = `phase9-freeze:${seedIndex}`;
    for (const locale of LOCALES) {
      const reviewed = generateSriPermanentLocalizedQuestionV1(allocation.qlId, externalSeed, locale);
      const frozen = generateSriPermanentMultilingualFrozenQuestionV1(allocation.qlId, externalSeed, locale);
      const repeat = generateSriPermanentMultilingualFrozenQuestionV1(allocation.qlId, externalSeed, locale);
      generated += 1;

      assert.deepEqual(repeat, frozen, `${allocation.qlId}/${externalSeed}/${locale}: frozen runtime is non-deterministic`);
      assert.equal(reviewed.lifecycle.reviewStatus, "LOCALIZATION_REVIEW_READY");
      assert.equal(reviewed.lifecycle.localizationStatus, "REVIEW_READY");
      assert.equal(frozen.localizationFreezeId, SRI_PERMANENT_MULTILINGUAL_FREEZE_ID_V1);
      assert.equal(frozen.approvedLocalizationArtifactId, 9684834606);
      assert.equal(frozen.approvedLocalizationSourceHead, "a3d24d97221bf94da04e77daa140164dbcdb0e51");
      assert.equal(frozen.permanentQlId, reviewed.permanentQlId);
      assert.equal(frozen.permanentSolveModeId, reviewed.permanentSolveModeId);
      assert.equal(frozen.packageId, reviewed.packageId);
      assert.equal(frozen.checkpointId, reviewed.checkpointId);
      assert.equal(frozen.retainedGroupId, reviewed.retainedGroupId);
      assert.equal(frozen.locale, reviewed.locale);
      assert.equal(frozen.sourceCandidateId, reviewed.sourceCandidateId);
      assert.equal(frozen.sourceCheckpointId, reviewed.sourceCheckpointId);
      assert.equal(frozen.sourceSeed, reviewed.sourceSeed);
      assert.equal(frozen.englishFingerprint, reviewed.englishFingerprint);
      assert.deepEqual(frozen.question, reviewed.question);

      assert.equal(frozen.lifecycle.maturity, "PERMANENT_AUTHORITY");
      assert.equal(frozen.lifecycle.reviewStatus, "MULTILINGUAL_FROZEN");
      assert.equal(frozen.lifecycle.localizationStatus, "FROZEN");
      assert.equal(frozen.lifecycle.questionBankStatus, "NOT_STORED");
      assert.equal(frozen.lifecycle.testEligibility, "INELIGIBLE");
      assert.equal(frozen.lifecycle.active, false);
      assert.equal(frozen.lifecycle.questionStudioDiscoverable, false);
      assert.equal(frozen.lifecycle.questionStudioGenerationEnabled, false);
      assert.equal(frozen.lifecycle.questionBankWritable, false);
      assert.equal(frozen.lifecycle.testEligible, false);
      assert.equal(frozen.lifecycle.publiclyPublishable, false);
      deepFrozenObjects += assertDeepFrozen(frozen);
    }
  }
}

assert.equal(generated, EXPECTED_QLS * SEEDS_PER_QL * LOCALES.length);
const audit = auditSriPermanentMultilingualFreezeV1();
assert.equal(audit.freezeId, SRI_PERMANENT_MULTILINGUAL_FREEZE_ID_V1);
assert.equal(audit.artifactId, 9684834606);
assert.equal(audit.englishFrozen, true);
assert.equal(audit.multilingualFrozen, true);
assert.equal(audit.downstreamLocked, true);

console.log(JSON.stringify({
  status: "PASS_SRI_PERMANENT_MULTILINGUAL_FREEZE_V1",
  freezeId: SRI_PERMANENT_MULTILINGUAL_FREEZE_ID_V1,
  permanentQls: EXPECTED_QLS,
  locales: LOCALES,
  runtimeSeedsPerQl: SEEDS_PER_QL,
  frozenLocalizedRuntimeQuestions: generated,
  approvedArtifactId: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedArtifactId,
  approvedArtifactDigest: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedArtifactDigest,
  baseRecertificationRunId: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.baseRecertificationRunId,
  recertifiedBaseSha: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.recertifiedBaseSha,
  deepFrozenObjects,
  englishFrozen: true,
  multilingualFrozen: true,
  downstreamReleaseEnabled: false,
}, null, 2));

function assertDeepFrozen(value: unknown, seen = new WeakSet<object>()): number {
  if (typeof value !== "object" || value === null) return 0;
  const objectValue = value as object;
  if (seen.has(objectValue)) return 0;
  seen.add(objectValue);
  assert.equal(Object.isFrozen(objectValue), true, "frozen localized runtime returned a mutable object");
  let count = 1;
  for (const key of Reflect.ownKeys(objectValue)) {
    count += assertDeepFrozen((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return count;
}
