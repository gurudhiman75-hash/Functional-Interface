import assert from "node:assert/strict";

import { canonicalDigest } from "../../SEA-001/canonical.ts";
import { buildCp006EnglishReviewCorpus, cp006EnglishReviewFingerprint } from "./cp006-review-corpus.ts";
import { SEA002_CP006_APPROVED_LOCALIZATION_REVIEW } from "./localization/approved-review.ts";
import { localizeCp006FrozenCaselet } from "./localization/frozen-localizer.ts";
import { cp006CorrectedRationaleMatch, cp006HasKnownGenderedParticipantSurface } from "./localization/language-fidelity-polish.ts";
import {
  SEA002_CP006_LOCALIZATION_READINESS,
  SEA002_CP006_TRANSLATION_TARGET_LOCALES,
  assertCp006LocalizationBindsToApprovedEnglish,
  assertCp006LocalizationFoundationFrozen,
} from "./localization/readiness.ts";
import {
  SEA002_CP006_ENGLISH_FREEZE,
  SEA002_CP006_LOCALIZATION_FREEZE,
  SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE,
  assertCp006PermanentLayerStillInactive,
} from "./permanent/freeze.ts";
import { SEA002_CP006_PERMANENT_QL_REGISTRY } from "./permanent/registry.ts";

const corpus = buildCp006EnglishReviewCorpus();
assert.equal(corpus.length, 100);
assert.equal(cp006EnglishReviewFingerprint(corpus), SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.englishAuthorityFingerprint);
assert.equal(SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint, SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.englishAuthorityFingerprint);
assert.equal(SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.status, "APPROVED");
assert.equal(SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.artifactName, "cp006-hi-pa-review-200");
assert.equal(SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.artifactId, 9475802210);
assert.equal(SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.artifactSha256, "93f898d640ad95dfcf00100eeaf8047c436748f84abd7306a8524a45c7364195");
assert.equal(SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.approvedLocalizedReviewFingerprint, "75edc8b938402ec2cf700fe3fa9053b25844981e281150f85b4238e5f7c0d4b9");
assert.equal(SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.validationWorkflowRunId, 32572932472);
assert.equal(SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.implementationHead, "1f35a3af456083a192b4677686b7a7b3a2022199");
assert.equal(SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.decision, "200_ACCEPT_0_REWRITE_0_REJECT");
assert.equal(SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.downstreamProductActivationAuthorized, false);

assertCp006LocalizationBindsToApprovedEnglish();
assertCp006LocalizationFoundationFrozen();
assertCp006PermanentLayerStillInactive();

let canonicalCorrectedRationales = 0;
let localizedChildren = 0;
let latinResidue = 0;
let learnerColumnResidue = 0;
let genderedParticipantResidue = 0;
const localized = corpus.flatMap((canonical) => {
  for (const child of canonical.children) {
    for (const option of child.options) {
      if (cp006CorrectedRationaleMatch(option.explanation)) canonicalCorrectedRationales += 1;
    }
  }
  return SEA002_CP006_TRANSLATION_TARGET_LOCALES.map((locale) => {
    const item = localizeCp006FrozenCaselet(canonical, locale);
    localizedChildren += item.children.length;
    assert.equal(item.localizationStatus, "FROZEN_AFTER_HUMAN_REVIEW");
    assert.equal(item.humanLanguageReviewRequired, false);
    assert.equal(item.humanReviewStatus, "APPROVED");
    assert.deepEqual(item.activeEditorialBlockers, []);
    assert.equal(item.approvedLocalizedReviewFingerprint, SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.approvedLocalizedReviewFingerprint);
    assert.equal(item.approvedLocalizationArtifactId, SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.artifactId);
    assert.equal(item.productDeliveryUnlocked, false);
    assert.equal(item.productionStagingApproved, false);
    const learnerSurface = [
      item.setupText,
      ...item.clueTexts,
      item.sharedExplanation,
      item.diagramText,
      ...item.children.flatMap((child) => [child.text, child.displayAnswer, child.explanation, ...child.options.flatMap((option) => [option.displayValue, option.explanation])]),
    ].join("\n");
    if (/[A-Za-z]/u.test(learnerSurface)) latinResidue += 1;
    if (/\bcolumns?\b/iu.test(learnerSurface)) learnerColumnResidue += 1;
    if (cp006HasKnownGenderedParticipantSurface(learnerSurface, canonical, locale)) genderedParticipantResidue += 1;
    return item;
  });
});

assert.equal(localized.length, SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.localizedCaseletCount);
assert.equal(localizedChildren, SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.localizedChildQuestionCount);
assert.equal(canonicalCorrectedRationales, SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.canonicalCorrectedRationaleCount);
assert.equal(canonicalCorrectedRationales * SEA002_CP006_TRANSLATION_TARGET_LOCALES.length, SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.localizedCorrectedRationaleCount);
assert.equal(latinResidue, 0);
assert.equal(learnerColumnResidue, 0);
assert.equal(genderedParticipantResidue, 0);

const localizedReviewFingerprint = canonicalDigest(localized.map((item) => ({
  locale: item.locale,
  canonicalCaseletId: item.canonicalCaseletId,
  canonicalParityFingerprint: item.canonicalParityFingerprint,
  canonicalContentFingerprint: item.canonicalContentFingerprint,
  presentationFingerprint: item.presentationFingerprint,
})));
assert.equal(localizedReviewFingerprint, SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.approvedLocalizedReviewFingerprint);
assert.equal(localizedReviewFingerprint, SEA002_CP006_LOCALIZATION_FREEZE.approvedLocalizedReviewFingerprint);
assert.equal(SEA002_CP006_LOCALIZATION_FREEZE.freezeActive, true);
assert.equal(SEA002_CP006_LOCALIZATION_READINESS.humanReviewStatus, "APPROVED");
assert.equal(SEA002_CP006_LOCALIZATION_READINESS.activeEditorialBlockers.length, 0);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.localizationStatus, "FROZEN");
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.localizationFrozen, true);
assert.equal(SEA002_CP006_PERMANENT_QL_REGISTRY.length, 4);
for (const entry of SEA002_CP006_PERMANENT_QL_REGISTRY) {
  assert.equal(entry.localizationStatus, "LOCALIZATION_MANUAL_FREEZE_APPROVED");
  assert.equal(entry.approvedLocalizedReviewFingerprint, localizedReviewFingerprint);
  assert.equal(entry.approvedLocalizationArtifactId, SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.artifactId);
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.publiclyPublishable, false);
}
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.mockTestEligible, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.productionStaging, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable, false);

console.log("PASS_SEA002_CP006_LOCALIZATION_FREEZE");
console.log("approved localized fingerprint", localizedReviewFingerprint);
console.log("approved localization artifact", SEA002_CP006_APPROVED_LOCALIZATION_REVIEW.artifactId);
console.log("localized caselets / children", localized.length, localizedChildren);
console.log("corrected rationale inventory", canonicalCorrectedRationales, canonicalCorrectedRationales * SEA002_CP006_TRANSLATION_TARGET_LOCALES.length);
console.log("Latin / column / gendered residue", latinResidue, learnerColumnResidue, genderedParticipantResidue);
console.log("localization frozen", SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.localizationFrozen);
console.log("Studio/Bank/mock/staging/public", false, false, false, false, false);
