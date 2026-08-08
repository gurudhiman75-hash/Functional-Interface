import assert from "node:assert/strict";
import { SER_CP007_TEMPLATE_PROBES_V71 } from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v7-1";
import { generateSerCp007PermanentEnglishPackage } from "../SER-CP-007-ENGLISH-FREEZE/ser-cp-007-permanent-runtime";
import {
  generateSerCp007FrozenLocalizedPackage,
  regenerateSerCp007FrozenLocalizedPackage,
  SER_CP007_MULTILINGUAL_FREEZE,
  SER_CP007_MULTILINGUAL_FREEZE_VERSION,
} from "./ser-cp-007-multilingual-freeze";
import { SER_CP007_LOCALES } from "./ser-cp-007-localized-runtime-final";

const DEVANAGARI_LETTERS_AND_MARKS = /[\u0900-\u0963\u0966-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;

assert.equal(
  SER_CP007_MULTILINGUAL_FREEZE.status,
  "MULTILINGUAL_MANUAL_FREEZE_APPROVED",
);
assert.equal(
  SER_CP007_MULTILINGUAL_FREEZE.approvalAuthority,
  "EXPLICIT_USER_EDITORIAL_SIGN_OFF_IN_PROJECT_CHAT",
);
assert.equal(SER_CP007_MULTILINGUAL_FREEZE.approvalStatement, "approved");
assert.equal(
  SER_CP007_MULTILINGUAL_FREEZE.approvedReviewedHead,
  "ae0da642814de6a96c04f30732c7bba03f18ca72",
);
assert.equal(SER_CP007_MULTILINGUAL_FREEZE.reviewTripletCount, 104);
assert.equal(SER_CP007_MULTILINGUAL_FREEZE.permanentQlIds.length, 13);
assert.deepEqual(SER_CP007_MULTILINGUAL_FREEZE.frozenLocales, [
  "hi-IN",
  "pa-IN",
]);
assert.equal(
  SER_CP007_MULTILINGUAL_FREEZE.parityProof.localizedPackageCount,
  840,
);
assert.equal(
  SER_CP007_MULTILINGUAL_FREEZE.reviewEvidence.artifactId,
  9017239441,
);
assert.equal(
  SER_CP007_MULTILINGUAL_FREEZE.lifecycle.questionStudioDiscoverable,
  false,
);
assert.equal(
  SER_CP007_MULTILINGUAL_FREEZE.lifecycle.publiclyPublishable,
  false,
);

let frozenPackages = 0;
let deterministicRegenerationProofs = 0;
let answerOptionParityProofs = 0;
let releaseMetadataParityProofs = 0;
let lifecycleLockProofs = 0;
let scriptProofs = 0;
const reachedPermanentQls = new Set<string>();

for (const locale of SER_CP007_LOCALES) {
  for (const probe of SER_CP007_TEMPLATE_PROBES_V71) {
    for (const seed of [1, 2, 3]) {
      const english = generateSerCp007PermanentEnglishPackage(
        probe.temporaryTemplateId,
        seed,
      );
      const frozen = generateSerCp007FrozenLocalizedPackage(
        probe.temporaryTemplateId,
        locale,
        seed,
      );
      const repeated = generateSerCp007FrozenLocalizedPackage(
        probe.temporaryTemplateId,
        locale,
        seed,
      );
      const regenerated = regenerateSerCp007FrozenLocalizedPackage({
        temporaryTemplateId: probe.temporaryTemplateId,
        locale,
        seed,
        subtypeId: frozen.frozenTemplateAuthority.subtypeId,
        learnerRenderer: frozen.frozenTemplateAuthority.learnerRenderer,
      });

      assert.deepEqual(frozen, repeated);
      assert.deepEqual(frozen, regenerated);
      deterministicRegenerationProofs += 1;

      assert.equal(
        frozen.localizationVersion,
        SER_CP007_MULTILINGUAL_FREEZE_VERSION,
      );
      assert.equal(
        frozen.reviewDecision,
        "APPROVED_NATIVE_LANGUAGE_MANUAL_FREEZE",
      );
      assert.equal(frozen.permanentQlId, english.permanentQlId);
      assert.equal(frozen.temporaryTemplateId, english.temporaryTemplateId);
      assert.equal(frozen.seed, english.seed);
      reachedPermanentQls.add(frozen.permanentQlId);

      assert.deepEqual(frozen.question.options, english.question.options);
      assert.equal(frozen.question.correctIndex, english.question.correctIndex);
      assert.equal(frozen.question.correctAnswer, english.question.correctAnswer);
      assert.deepEqual(frozen.question.hiddenState, english.question.hiddenState);
      answerOptionParityProofs += 1;

      assert.equal(frozen.review.difficulty, english.review.difficulty);
      assert.equal(frozen.review.releaseTier, english.review.releaseTier);
      assert.equal(
        frozen.review.studentReleasePoolKey,
        english.review.studentReleasePoolKey,
      );
      assert.equal(
        frozen.review.renderingContract?.kind ?? null,
        english.review.renderingContract?.kind ?? null,
      );
      releaseMetadataParityProofs += 1;

      const localizedText = [
        frozen.question.stem,
        frozen.review.conciseReview,
        frozen.review.expandedReview,
        ...frozen.review.workedSteps,
      ].join("\n");
      if (locale === "hi-IN") {
        assert.match(localizedText, DEVANAGARI_LETTERS_AND_MARKS);
        assert.doesNotMatch(localizedText, GURMUKHI);
      } else {
        assert.match(localizedText, GURMUKHI);
        assert.doesNotMatch(localizedText, DEVANAGARI_LETTERS_AND_MARKS);
      }
      scriptProofs += 1;

      assert.equal(
        frozen.lifecycle.localizationStatus,
        "MULTILINGUAL_MANUAL_FREEZE_APPROVED",
      );
      assert.equal(frozen.lifecycle.active, false);
      assert.equal(frozen.lifecycle.questionStudioDiscoverable, false);
      assert.equal(frozen.lifecycle.questionBankWritable, false);
      assert.equal(frozen.lifecycle.testEligible, false);
      assert.equal(frozen.lifecycle.publiclyPublishable, false);
      lifecycleLockProofs += 1;

      frozenPackages += 1;
    }
  }
}

assert.equal(frozenPackages, 840);
assert.equal(reachedPermanentQls.size, 13);
assert.equal(deterministicRegenerationProofs, 840);
assert.equal(answerOptionParityProofs, 840);
assert.equal(releaseMetadataParityProofs, 840);
assert.equal(scriptProofs, 840);
assert.equal(lifecycleLockProofs, 840);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_MULTILINGUAL_MANUAL_FREEZE",
      approvalDate: "2026-08-08",
      approvalAuthority:
        SER_CP007_MULTILINGUAL_FREEZE.approvalAuthority,
      approvedReviewedHead:
        SER_CP007_MULTILINGUAL_FREEZE.approvedReviewedHead,
      frozenLocales: SER_CP007_MULTILINGUAL_FREEZE.frozenLocales,
      reviewTriplets: SER_CP007_MULTILINGUAL_FREEZE.reviewTripletCount,
      frozenPackages,
      permanentQlsReached: reachedPermanentQls.size,
      deterministicRegenerationProofs,
      answerOptionParityProofs,
      releaseMetadataParityProofs,
      scriptProofs,
      lifecycleLockProofs,
      lifecycle: SER_CP007_MULTILINGUAL_FREEZE.lifecycle,
      nextAuthority: SER_CP007_MULTILINGUAL_FREEZE.nextAuthority,
    },
    null,
    2,
  ),
);
