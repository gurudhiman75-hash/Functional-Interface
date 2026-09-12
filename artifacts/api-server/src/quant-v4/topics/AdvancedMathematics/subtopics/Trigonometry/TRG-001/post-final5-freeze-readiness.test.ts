import assert from "node:assert/strict";

import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import {
  TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL6_VERSION,
  generateLocalizedTrg001QuestionNativeReviewFinal6,
} from "./localization-native-v5-pedagogic-review-final6";
import { TRG_001_POST_FINAL5_FREEZE_READINESS } from "./post-final5-freeze-readiness";
import {
  TRG_001_POST_FREEZE_REMEDIATION_V1_VERSION,
  generatePostFreezeRemediatedTrg001Question,
} from "./production-post-freeze-remediation-v1";

const readiness = TRG_001_POST_FINAL5_FREEZE_READINESS;

assert.equal(readiness.manifestVersion, "TRG001_POST_FINAL5_FREEZE_READINESS_V1");
assert.equal(readiness.packageId, "TRG-001");
assert.equal(readiness.candidate.englishRemediationVersion, TRG_001_POST_FREEZE_REMEDIATION_V1_VERSION);
assert.equal(readiness.candidate.localizationVersion, TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL6_VERSION);
assert.equal(readiness.candidate.reviewedSourceHead, "cd6fc6bec42892b1d366617442cbe8dbebb48069");
assert.equal(readiness.candidate.mergedViaPullRequest, 1299);
assert.equal(readiness.candidate.mergedCommit, "5f819b129643bc74651473cf226142d0b239c635");
assert.equal(readiness.historicalEnglishAuthority.inheritedByCandidate, false);
assert.deepEqual(readiness.historicalEnglishAuthority.changedQlIds, ["TRG-001-QL-093"]);
assert.equal(readiness.historicalEnglishAuthority.newHumanReviewRequired, true);
assert.deepEqual(readiness.localizedScope.locales, ["hi-IN", "pa-IN"]);
assert.equal(readiness.localizedScope.localizedSurfaces, 288);
assert.equal(readiness.localizedScope.remediatedQlIds.length, 8);
assert.equal(readiness.evidence.workflowRunId, 33370572812);
assert.equal(readiness.evidence.artifactId, 9749893158);
assert.equal(readiness.evidence.artifactDigest, "sha256:e393b69a2ac89416c5bbb926681319e0938df28e9a5b849ba49fa6e0566bb834");
assert.equal(readiness.evidence.englishCases, 432);
assert.equal(readiness.evidence.localizedCases, 864);
assert.equal(readiness.evidence.correctionAssertions, 48);
assert.deepEqual(readiness.evidence.ql142ConjugateVariants, ["cos", "sin"]);
assert.equal(readiness.evidence.unresolvedTemplatePlaceholders, 0);
assert.equal(readiness.evidence.failures, 0);
assert.equal(readiness.engineeringReviewReadiness, "PASS");
assert.equal(readiness.humanReview, "PENDING");
assert.equal(readiness.newEnglishFreezeGranted, false);
assert.equal(readiness.multilingualFreezeGranted, false);
assert.equal(readiness.freezeAuthorized, false);
assert.equal(readiness.activationAuthorized, false);
assert.equal(readiness.questionStudioEnabled, false);
assert.equal(readiness.questionBankWritable, false);
assert.equal(readiness.testBuilderEligible, false);
assert.equal(readiness.publiclyPublishable, false);
assert.equal(readiness.publicReleaseAuthorized, false);

assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144);

let englishCases = 0;
let localizedCases = 0;
for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  const seed = `trg001-post-final5-readiness-${qlId}`;
  const english = generatePostFreezeRemediatedTrg001Question(qlId, seed) as any;

  assert.equal(english.humanReviewStatus, "PENDING", `${qlId}: English human review was inferred.`);
  assert.equal(english.frozen, false, `${qlId}: English remediation inherited frozen=true.`);
  assert.equal(english.freezeStatus, "NOT_FROZEN", `${qlId}: English remediation freeze status drift.`);
  assert.equal(english.questionStudioDiscoverable, false, `${qlId}: remediation Studio gate opened.`);
  assert.equal(english.questionBankStatus, "NOT_STORED", `${qlId}: remediation Bank gate opened.`);
  assert.equal(english.testEligibility, "INELIGIBLE", `${qlId}: remediation Test Builder gate opened.`);
  assert.equal(english.publiclyPublishable, false, `${qlId}: remediation public gate opened.`);

  const learnerText = [
    english.stem,
    ...(english.options ?? []).map((option: any) => option.display),
    english.answer,
    english.explanation?.keyRule,
    ...(english.explanation?.steps ?? []).flatMap((step: any) => [step.title, step.body]),
    english.explanation?.shortcut,
    ...(english.explanation?.traps ?? []),
  ].map((value) => String(value ?? "")).join("\n");
  assert(!/\$\{[^}]+\}/u.test(learnerText), `${qlId}: unresolved learner-facing template placeholder remains.`);
  if (qlId === "TRG-001-QL-093") {
    assert.equal(
      english.explanation?.traps?.[0],
      "Write 1 as a fraction with the same denominator before combining.",
      "QL093 English remediation drift.",
    );
  }
  englishCases += 1;

  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    const localized = generateLocalizedTrg001QuestionNativeReviewFinal6(qlId, seed, locale) as any;
    const id = `${qlId}:${locale}`;
    assert.equal(localized.reviewStatus, "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_FINAL6", `${id}: Final6 status drift.`);
    assert.equal(localized.humanReviewStatus, "PENDING", `${id}: localized human review inferred.`);
    assert.equal(localized.frozen, false, `${id}: localized freeze inferred.`);
    assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: localized freeze status drift.`);
    assert.equal(localized.activationAuthorized, false, `${id}: localized activation inferred.`);
    assert.equal(localized.questionStudioDiscoverable, false, `${id}: localized Studio gate opened.`);
    assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: localized Bank gate opened.`);
    assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: localized Test Builder gate opened.`);
    assert.equal(localized.publiclyPublishable, false, `${id}: localized public gate opened.`);
    assert.equal(localized.localizationLifecycle?.version, TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL6_VERSION, `${id}: lifecycle version drift.`);
    assert.equal(localized.localizationLifecycle?.humanLanguageReviewRequired, true, `${id}: human review requirement removed.`);
    assert.equal(localized.localizationLifecycle?.multilingualFreezeGranted, false, `${id}: multilingual freeze inferred.`);
    assert.equal(localized.localizationLifecycle?.activationAuthorized, false, `${id}: lifecycle activation inferred.`);
    assert.equal(
      trg001CanonicalSemanticFingerprint(localized),
      trg001CanonicalSemanticFingerprint(english),
      `${id}: canonical semantic drift between English remediation and Final6.`,
    );
    localizedCases += 1;
  }
}

assert.equal(englishCases, 144);
assert.equal(localizedCases, 288);

console.log(JSON.stringify({
  status: "TRG001_POST_FINAL5_FREEZE_READINESS_PASS",
  reviewedSourceHead: readiness.candidate.reviewedSourceHead,
  mergedCommit: readiness.candidate.mergedCommit,
  evidenceArtifactId: readiness.evidence.artifactId,
  englishCases,
  localizedCases,
  humanReview: readiness.humanReview,
  newEnglishFreezeGranted: readiness.newEnglishFreezeGranted,
  multilingualFreezeGranted: readiness.multilingualFreezeGranted,
  activationAuthorized: readiness.activationAuthorized,
}, null, 2));
