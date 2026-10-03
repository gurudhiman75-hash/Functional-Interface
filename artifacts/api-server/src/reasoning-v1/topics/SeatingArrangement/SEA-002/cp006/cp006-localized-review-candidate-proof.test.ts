import assert from "node:assert/strict";

import { buildCp006EnglishReviewCorpus, cp006EnglishReviewFingerprint } from "./cp006-review-corpus.ts";
import {
  cp006TeachingSkeleton,
  localizeCp006ReviewCaselet,
} from "./localization/candidate-localizer.ts";
import {
  SEA002_CP006_LOCALIZATION_HUMAN_REVIEW_BLOCKER,
  SEA002_CP006_TRANSLATION_TARGET_LOCALES,
  cp006CanonicalParityFingerprint,
} from "./localization/readiness.ts";
import { SEA002_CP006_ENGLISH_FREEZE, SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE } from "./permanent/freeze.ts";
import { SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL } from "./permanent/registry.ts";

const corpus = buildCp006EnglishReviewCorpus();
assert.equal(corpus.length, 100);
assert.equal(cp006EnglishReviewFingerprint(corpus), SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint);

const localizedCounts = new Map<string, number>();
const pbaCounts = new Map<string, number>();
const presentationFingerprints = new Set<string>();
let localizedCaselets = 0;
let localizedChildren = 0;
let semanticParity = 0;
let teachingParity = 0;
let optionParity = 0;
let caseTeachingParity = 0;
let latinResidue = 0;
let wrongScript = 0;
let learnerColumnResidue = 0;

for (const canonical of corpus) {
  const canonicalParity = cp006CanonicalParityFingerprint(canonical);
  const skeleton = cp006TeachingSkeleton(canonical.sharedExplanation);
  const canonicalCaseTeaching = skeleton.filter((block) => block === "CASE").length;
  pbaCounts.set(canonical.blueprintAuthorityId, (pbaCounts.get(canonical.blueprintAuthorityId) ?? 0) + 1);

  for (const locale of SEA002_CP006_TRANSLATION_TARGET_LOCALES) {
    const localized = localizeCp006ReviewCaselet(canonical, locale);
    localizedCaselets += 1;
    localizedChildren += localized.children.length;
    localizedCounts.set(locale, (localizedCounts.get(locale) ?? 0) + 1);

    assert.equal(localized.canonicalCaseletId, canonical.caseletId);
    assert.equal(localized.blueprintAuthorityId, canonical.blueprintAuthorityId);
    assert.equal(localized.permanentQlId, SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL[canonical.blueprintAuthorityId]);
    assert.equal(localized.canonicalParityFingerprint, canonicalParity);
    assert.equal(localized.localizationStatus, "EXECUTABLE_EXPLANATION_PARITY_HUMAN_REVIEW_REQUIRED");
    assert.equal(localized.humanLanguageReviewRequired, true);
    assert.deepEqual(localized.activeEditorialBlockers, [SEA002_CP006_LOCALIZATION_HUMAN_REVIEW_BLOCKER]);
    assert.equal(localized.productDeliveryUnlocked, false);
    assert.equal(localized.productionStagingApproved, false);
    semanticParity += 1;

    assert.deepEqual(localized.teachingSkeleton, skeleton, `${canonical.caseletId}/${locale}: teaching skeleton drift`);
    assert.equal(localized.sharedExplanation.split("\n").length, canonical.sharedExplanation.split("\n").length, `${canonical.caseletId}/${locale}: shared-line parity`);
    const localizedCaseTeaching = localized.teachingSkeleton.filter((block) => block === "CASE").length;
    assert.equal(localizedCaseTeaching, canonicalCaseTeaching, `${canonical.caseletId}/${locale}: case-formation parity`);
    teachingParity += 1;
    if (canonicalCaseTeaching > 0) caseTeachingParity += 1;

    assert.equal(localized.clueTexts.length, canonical.clueTexts.length);
    assert.equal(localized.children.length, 4);
    for (let index = 0; index < 4; index += 1) {
      const sourceChild = canonical.children[index]!;
      const targetChild = localized.children[index]!;
      assert.equal(targetChild.questionOrder, sourceChild.questionOrder);
      assert.equal(targetChild.queryContractId, sourceChild.queryContractId);
      assert.equal(targetChild.answerType, sourceChild.answerType);
      assert.equal(targetChild.answerDeterminingFactFingerprint, sourceChild.answerDeterminingFactFingerprint);
      assert.equal(targetChild.answerIndex, sourceChild.answerIndex);
      assert.equal(targetChild.canonicalAnswer, sourceChild.answer);
      assert.equal(targetChild.options.length, 4);
      assert.equal(targetChild.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(targetChild.options[targetChild.answerIndex]?.isCorrect, true);
      assert.equal(targetChild.options[targetChild.answerIndex]?.displayValue, targetChild.displayAnswer);
      for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
        const sourceOption = sourceChild.options[optionIndex]!;
        const targetOption = targetChild.options[optionIndex]!;
        assert.equal(targetOption.isCorrect, sourceOption.isCorrect);
        assert.equal(targetOption.misconceptionId ?? null, sourceOption.misconceptionId ?? null);
        assert.ok(targetOption.explanation.length >= 12, `${canonical.caseletId}/${locale}/Q${index + 1}/O${optionIndex + 1}: rationale too thin`);
      }
      optionParity += 1;
    }

    const learnerSurface = [
      localized.setupText,
      ...localized.clueTexts,
      localized.sharedExplanation,
      localized.diagramText,
      ...localized.children.flatMap((child) => [
        child.text,
        child.displayAnswer,
        child.explanation,
        ...child.options.flatMap((option) => [option.displayValue, option.explanation]),
      ]),
    ].join("\n");

    if (/[A-Za-z]/u.test(learnerSurface)) latinResidue += 1;
    if (/\bcolumns?\b/iu.test(learnerSurface)) learnerColumnResidue += 1;
    if (locale === "hi-IN" && !/[\u0900-\u097F]/u.test(learnerSurface)) wrongScript += 1;
    if (locale === "pa-IN" && !/[\u0A00-\u0A7F]/u.test(learnerSurface)) wrongScript += 1;
    assert.ok(!/[A-Za-z]/u.test(learnerSurface), `${canonical.caseletId}/${locale}: Latin learner residue`);
    assert.ok(!/\bcolumns?\b/iu.test(learnerSurface), `${canonical.caseletId}/${locale}: learner-facing column wording returned`);
    assert.ok(locale === "hi-IN" ? /[\u0900-\u097F]/u.test(learnerSurface) : /[\u0A00-\u0A7F]/u.test(learnerSurface), `${canonical.caseletId}/${locale}: target script missing`);

    assert.match(localized.presentationFingerprint, /^[a-f0-9]{64}$/u);
    assert.ok(!presentationFingerprints.has(localized.presentationFingerprint), `${canonical.caseletId}/${locale}: duplicate localized presentation fingerprint`);
    presentationFingerprints.add(localized.presentationFingerprint);
  }
}

assert.deepEqual(Object.fromEntries(localizedCounts), { "hi-IN": 100, "pa-IN": 100 });
assert.deepEqual(Object.fromEntries(pbaCounts), { "SEA-PBA-021": 25, "SEA-PBA-022": 25, "SEA-PBA-023": 25, "SEA-PBA-024": 25 });
assert.equal(localizedCaselets, 200);
assert.equal(localizedChildren, 800);
assert.equal(semanticParity, 200);
assert.equal(teachingParity, 200);
assert.equal(optionParity, 800);
assert.equal(presentationFingerprints.size, 200);
assert.ok(caseTeachingParity >= 160, `localized case-teaching coverage unexpectedly thin: ${caseTeachingParity}/200`);
assert.equal(latinResidue, 0);
assert.equal(wrongScript, 0);
assert.equal(learnerColumnResidue, 0);

assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.mockTestEligible, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.productionStaging, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable, false);

console.log("PASS_SEA002_CP006_LOCALIZED_REVIEW_CANDIDATE");
console.log("localized caselets", localizedCaselets);
console.log("localized child questions", localizedChildren);
console.log("locale counts", Object.fromEntries(localizedCounts));
console.log("PBA source counts", Object.fromEntries(pbaCounts));
console.log("semantic parity", `${semanticParity}/${localizedCaselets}`);
console.log("teaching skeleton parity", `${teachingParity}/${localizedCaselets}`);
console.log("case-teaching localized cases", caseTeachingParity);
console.log("option rationale parity", `${optionParity}/${localizedChildren}`);
console.log("presentation fingerprints", presentationFingerprints.size);
console.log("Latin learner residue", latinResidue);
console.log("learner column residue", learnerColumnResidue);
console.log("human Hindi/Punjabi review", "PENDING");
console.log("multilingual freeze", false);
console.log("Question Studio registered", SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered);
console.log("publicly publishable", SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable);
