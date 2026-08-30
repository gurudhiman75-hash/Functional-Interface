import assert from "node:assert/strict";

import { TRG_001_LOCALIZATION_QL_IDS, trg001CanonicalSemanticFingerprint } from "./localization-v1";
import {
  TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL4_VERSION,
  generateLocalizedTrg001QuestionNativeReviewFinal4,
} from "./localization-native-v5-pedagogic-review-final4";
import { TRG_001_LOCALIZATION_FREEZE_READINESS } from "./localization-freeze-readiness";
import {
  TRG_001_FREEZE,
  generateHumanApprovedTrg001Question,
} from "./production-human-approved-runtime";

const manifest = TRG_001_LOCALIZATION_FREEZE_READINESS;

assert.equal(manifest.packageId, "TRG-001");
assert.equal(manifest.candidateVersion, TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL4_VERSION);
assert.equal(manifest.candidateSourceHead, "f42b5c6b26edfcb16c07a2b5a3f8620b976ac083");
assert.equal(manifest.mergedViaPullRequest, 1221);
assert.equal(manifest.mergedCommit, "2cce68bc694f3eee79ed1a37c030de93e5d4dac9");
assert.equal(manifest.englishAuthority.qls, 144);
assert.equal(manifest.englishAuthority.fingerprint, TRG_001_FREEZE.approvedContentFingerprint);
assert.equal(
  manifest.englishAuthority.fingerprint,
  "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
);
assert.equal(manifest.localizedScope.qls, 144);
assert.deepEqual(manifest.localizedScope.locales, ["hi-IN", "pa-IN"]);
assert.equal(manifest.localizedScope.localizedSurfaces, 288);
assert.equal(manifest.evidence.fiveSeedCrossCheck.workflowRunId, 33298656944);
assert.equal(manifest.evidence.fiveSeedCrossCheck.artifactId, 9728219257);
assert.equal(manifest.evidence.fiveSeedCrossCheck.failures, 0);
assert.equal(manifest.evidence.reviewReadiness.workflowRunId, 33298656954);
assert.equal(manifest.evidence.reviewReadiness.artifactId, 9728215685);
assert.equal(manifest.evidence.reviewReadiness.failures, 0);
assert.equal(manifest.engineeringReviewReadiness, "PASS");
assert.equal(manifest.humanLanguageApproval, "PENDING");
assert.equal(manifest.multilingualFreezeGranted, false);
assert.equal(manifest.freezeAuthorized, false);
assert.equal(manifest.activationAuthorized, false);
assert.equal(manifest.questionStudioEnabledForLocalizedSurface, false);
assert.equal(manifest.questionBankWritableForLocalizedSurface, false);
assert.equal(manifest.testBuilderEligibleForLocalizedSurface, false);
assert.equal(manifest.publiclyPublishable, false);
assert.equal(manifest.publicReleaseAuthorized, false);

assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144, "Final4 readiness requires all 144 frozen QLs.");

let cases = 0;
for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  for (const locale of manifest.localizedScope.locales) {
    const seed = `trg001-final4-freeze-readiness-${qlId}-${locale}`;
    const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
    const localized = generateLocalizedTrg001QuestionNativeReviewFinal4(qlId, seed, locale) as any;
    const id = `${qlId}:${locale}`;

    assert.equal(localized.qlId, source.qlId, `${id}: QL drift.`);
    assert.equal(localized.cpId, source.cpId, `${id}: CP drift.`);
    assert.equal(localized.seed, source.seed, `${id}: seed drift.`);
    assert.equal(localized.lockedFamily, source.lockedFamily, `${id}: family drift.`);
    assert.equal(localized.solveMode, source.solveMode, `${id}: solve-mode drift.`);
    assert.equal(localized.difficulty, source.difficulty, `${id}: difficulty drift.`);
    assert.equal(localized.target, source.target, `${id}: target drift.`);
    assert.deepEqual(localized.exactAnswer, source.exactAnswer, `${id}: exact answer drift.`);
    assert.equal(localized.answer, source.answer, `${id}: canonical answer drift.`);
    assert.equal(localized.correctIndex, source.correctIndex, `${id}: correct-index drift.`);
    assert.deepEqual(localized.canonicalState, source.canonicalState, `${id}: canonical state drift.`);
    assert.deepEqual(localized.verification, source.verification, `${id}: verification drift.`);
    assert.equal(
      trg001CanonicalSemanticFingerprint(localized),
      trg001CanonicalSemanticFingerprint(source),
      `${id}: semantic fingerprint drift.`,
    );

    assert.equal(
      localized.reviewStatus,
      "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL4",
      `${id}: Final4 review status drift.`,
    );
    assert.equal(localized.humanReviewStatus, "PENDING", `${id}: human approval was granted implicitly.`);
    assert.equal(localized.frozen, false, `${id}: localized candidate became frozen implicitly.`);
    assert.equal(localized.freezeEligible, false, `${id}: localized candidate became freeze eligible implicitly.`);
    assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: freeze status drift.`);
    assert.equal(localized.activationAuthorized, false, `${id}: activation was granted implicitly.`);
    assert.equal(localized.questionStudioDiscoverable, false, `${id}: localized Studio surface became visible.`);
    assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: localized Bank surface became writable.`);
    assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: localized Test Builder surface became eligible.`);
    assert.equal(localized.publiclyPublishable, false, `${id}: localized candidate became publicly publishable.`);
    assert.equal(localized.publicReleaseAuthorized, false, `${id}: localized public release was authorized.`);
    assert.equal(localized.localizationLifecycle?.version, TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL4_VERSION, `${id}: lifecycle version drift.`);
    assert.equal(localized.localizationLifecycle?.humanLanguageReviewRequired, true, `${id}: human review requirement removed.`);
    assert.equal(localized.localizationLifecycle?.multilingualFreezeGranted, false, `${id}: multilingual freeze granted implicitly.`);
    assert.equal(localized.localizationLifecycle?.activationAuthorized, false, `${id}: lifecycle activation granted implicitly.`);
    assert.equal(localized.localizationLifecycle?.questionStudioEnabled, false, `${id}: localized Studio lifecycle gate opened.`);
    assert.equal(localized.localizationLifecycle?.questionBankWritable, false, `${id}: localized Bank lifecycle gate opened.`);
    assert.equal(localized.localizationLifecycle?.testBuilderEligible, false, `${id}: localized Test Builder gate opened.`);
    assert.equal(localized.localizationLifecycle?.productDeliveryUnlocked, false, `${id}: product delivery unlocked implicitly.`);
    assert.equal(localized.localizationProof?.final4CanonicalTrigAngleGuard, true, `${id}: Final4 provenance guard missing.`);
    assert.equal(localized.localizationProof?.humanLanguageReviewRequired, true, `${id}: proof lost human-review requirement.`);
    cases += 1;
  }
}

assert.equal(cases, 288, `Expected 288 freeze-readiness cases, got ${cases}.`);

console.log(JSON.stringify({
  status: "TRG001_FINAL4_FREEZE_READINESS_PASS",
  candidateVersion: manifest.candidateVersion,
  candidateSourceHead: manifest.candidateSourceHead,
  englishAuthorityFingerprint: manifest.englishAuthority.fingerprint,
  localizedCases: cases,
  engineeringReviewReadiness: manifest.engineeringReviewReadiness,
  humanLanguageApproval: manifest.humanLanguageApproval,
  multilingualFreezeGranted: manifest.multilingualFreezeGranted,
  activationAuthorized: manifest.activationAuthorized,
}, null, 2));
