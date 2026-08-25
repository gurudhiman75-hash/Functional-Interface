import { strict as assert } from "node:assert";
import { SRI_001_MANIFEST } from "../SRI-001/manifest";
import { SRI_002_MANIFEST } from "../SRI-002/manifest";
import { SRI_CHAPTER_MANIFEST, assertSriReleaseLocks } from "../chapter-manifest";
import { SRI_PERMANENT_ALLOCATION_V1 } from "../permanent-allocation-v1";
import {
  SRI_PERMANENT_ENGLISH_FINGERPRINTS_V1,
  SRI_PERMANENT_ENGLISH_FREEZE_V1,
  assertSriPermanentEnglishFreezeV1,
  computeSriPermanentEnglishFingerprintsV1,
} from "../permanent-english-freeze-v1";
import { generateSriPermanentEnglishQuestionV1 } from "../permanent-runtime-v1";

const EXPECTED_QLS = 58;
const RUNTIME_SEEDS_PER_QL = 16;

assertSriReleaseLocks();
assertSriPermanentEnglishFreezeV1();

assert.equal(SRI_PERMANENT_ALLOCATION_V1.length, EXPECTED_QLS);
assert.equal(SRI_PERMANENT_ENGLISH_FREEZE_V1.length, EXPECTED_QLS);
assert.equal(Object.keys(SRI_PERMANENT_ENGLISH_FINGERPRINTS_V1).length, EXPECTED_QLS);
assert.equal(new Set(Object.values(SRI_PERMANENT_ENGLISH_FINGERPRINTS_V1)).size, EXPECTED_QLS);

const observedFingerprints = computeSriPermanentEnglishFingerprintsV1();
assert.deepEqual(observedFingerprints, SRI_PERMANENT_ENGLISH_FINGERPRINTS_V1);

assert.equal(SRI_CHAPTER_MANIFEST.permanentQlCount, 58);
assert.equal(SRI_CHAPTER_MANIFEST.frozenSolveModeCount, 58);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen, true);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.multilingualFrozen, false);
assert.equal(SRI_001_MANIFEST.permanentQlCount, 29);
assert.equal(SRI_001_MANIFEST.frozenSolveModeCount, 29);
assert.equal(SRI_002_MANIFEST.permanentQlCount, 29);
assert.equal(SRI_002_MANIFEST.frozenSolveModeCount, 29);

for (const entry of SRI_PERMANENT_ENGLISH_FREEZE_V1) {
  assert.equal(entry.solveModeFrozen, true);
  assert.equal(entry.englishFrozen, true);
  assert.match(entry.englishFingerprint, /^sha256:[0-9a-f]{64}$/u);
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionStudioGenerationEnabled, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.publiclyPublishable, false);
}

const ancestrySeenByQl = new Map<string, Set<string>>();
let generated = 0;
for (const entry of SRI_PERMANENT_ENGLISH_FREEZE_V1) {
  const seen = new Set<string>();
  for (let seedIndex = 0; seedIndex < RUNTIME_SEEDS_PER_QL; seedIndex += 1) {
    const externalSeed = `phase8:${seedIndex}`;
    const pkg = generateSriPermanentEnglishQuestionV1(entry.qlId, externalSeed);
    const repeat = generateSriPermanentEnglishQuestionV1(entry.qlId, externalSeed);
    generated += 1;

    assert.deepEqual(repeat, pkg, `${entry.qlId}/${externalSeed}: permanent runtime is non-deterministic`);
    assert.equal(pkg.permanentQlId, entry.qlId);
    assert.equal(pkg.permanentSolveModeId, entry.solveModeId);
    assert.equal(pkg.packageId, entry.packageId);
    assert.equal(pkg.checkpointId, entry.checkpointId);
    assert.equal(pkg.retainedGroupId, entry.retainedGroupId);
    assert.equal(pkg.locale, "en-IN");
    assert.equal(pkg.englishFingerprint, entry.englishFingerprint);
    assert.ok(entry.memberCandidateIds.includes(pkg.sourceCandidateId));
    assert.equal(pkg.question.candidateId, pkg.sourceCandidateId);
    assert.equal(pkg.question.seed, pkg.sourceSeed);
    assert.equal(pkg.question.verification.solverVerifierAgree, true);
    assert.equal(pkg.question.verification.exactlyOneCorrectOption, true);
    assert.equal(pkg.question.verification.domainValid, true);
    assert.equal(pkg.question.options.length, 4);
    assert.equal(pkg.question.options[pkg.question.correctIndex]?.canonicalKey, pkg.question.answer.canonicalKey);

    assert.equal(pkg.lifecycle.maturity, "PERMANENT_AUTHORITY");
    assert.equal(pkg.lifecycle.reviewStatus, "ENGLISH_FROZEN");
    assert.equal(pkg.lifecycle.localizationStatus, "PENDING");
    assert.equal(pkg.lifecycle.active, false);
    assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
    assert.equal(pkg.lifecycle.questionStudioGenerationEnabled, false);
    assert.equal(pkg.lifecycle.questionBankWritable, false);
    assert.equal(pkg.lifecycle.testEligible, false);
    assert.equal(pkg.lifecycle.publiclyPublishable, false);
    seen.add(pkg.sourceCandidateId);
  }
  ancestrySeenByQl.set(entry.qlId, seen);
}

assert.equal(generated, EXPECTED_QLS * RUNTIME_SEEDS_PER_QL);
assert.equal(ancestrySeenByQl.size, EXPECTED_QLS);

for (const entry of SRI_PERMANENT_ENGLISH_FREEZE_V1.filter((item) => item.memberCandidateIds.length > 1)) {
  assert.ok(
    (ancestrySeenByQl.get(entry.qlId)?.size ?? 0) >= 2,
    `${entry.qlId}: permanent runtime did not exercise merged ancestry`,
  );
}

console.log(JSON.stringify({
  status: "PASS_SRI_PERMANENT_ENGLISH_FREEZE_V1",
  permanentQls: EXPECTED_QLS,
  frozenSolveModes: SRI_CHAPTER_MANIFEST.frozenSolveModeCount,
  storedEnglishFingerprints: Object.keys(SRI_PERMANENT_ENGLISH_FINGERPRINTS_V1).length,
  reviewedFingerprintQuestions: 184,
  runtimeSeedsPerQl: RUNTIME_SEEDS_PER_QL,
  permanentRuntimeQuestions: generated,
  englishFrozen: SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen,
  multilingualFrozen: SRI_CHAPTER_MANIFEST.lifecycle.multilingualFrozen,
  downstreamReleaseEnabled: false,
}, null, 2));
