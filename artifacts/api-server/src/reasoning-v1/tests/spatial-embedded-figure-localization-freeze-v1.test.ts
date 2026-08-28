import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/embedded-figure-english-freeze-v1";
import {
  EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1,
  freezeEmbeddedFigureLocalizedQuestionV1,
} from "../foundation/spatial/embedded-figure-localization-freeze-v1";
import {
  EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1,
  localizeEmbeddedFigureQuestionV1,
} from "../foundation/spatial/embedded-figure-localization-v1";
import { EMBEDDED_FIGURE_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/embedded-figure-localization-product-owner-approval-v1";
import { generateEmbeddedFigurePermanentEnglishQuestionV1 } from "../foundation/spatial/embedded-figure-permanent-english-runtime-v1";

assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.governance.englishFrozen, true);
assert.equal(EMBEDDED_FIGURE_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(EMBEDDED_FIGURE_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.authorization.localizationFreezeAllowed, true);
assert.equal(EMBEDDED_FIGURE_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.authorization.seededQuestionStudioIntegrationAllowed, true);
assert.equal(EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.localizationFrozen, true);
assert.equal(EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.seededQuestionStudioIntegrationAuthorized, true);
assert.equal(EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.questionStudioProductionReleaseAuthorized, false);
assert.equal(EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.persistenceAuthorized, false);
assert.equal(EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.questionBankWritesAuthorized, false);
assert.equal(EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.publicTestEligibilityAuthorized, false);
assert.equal(EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.automaticPublicationAuthorized, false);
assert.equal(EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedLocalization.headSha, "80e54dc3d9accfda3463f8590c09ab19819afec1");
assert.equal(EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedLocalization.workflowRunId, 33057345379);
assert.equal(EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedLocalization.artifactId, 9640423819);
assert.equal(EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedLocalization.artifactDigest, "sha256:384ee85d9918fb6491f6c5c7c99be602ecd6e318680dd378609f2781848d5e9e");

const seeds = Array.from({ length: 240 }, (_, index) => `EMB-LOC-SCALE-${index}`);
let frozenQuestionCount = 0;
let parityChecks = 0;
let scriptChecks = 0;
const hiStems = new Set<string>();
const paStems = new Set<string>();
const geometries = new Set<string>();
const contentFingerprints = new Set<string>();

for (const seed of seeds) {
  const en = generateEmbeddedFigurePermanentEnglishQuestionV1(seed);
  for (const language of ["hi", "pa"] as const) {
    const candidate = localizeEmbeddedFigureQuestionV1(en, language);
    const frozen = freezeEmbeddedFigureLocalizedQuestionV1(en, language);

    assert.equal(frozen.language, candidate.language, `${seed}/${language}: language changed at freeze.`);
    assert.equal(frozen.locale, candidate.locale, `${seed}/${language}: locale changed at freeze.`);
    assert.equal(frozen.permanentQlTitle, candidate.permanentQlTitle, `${seed}/${language}: QL title changed at freeze.`);
    assert.equal(frozen.stem, candidate.stem, `${seed}/${language}: stem changed at freeze.`);
    assert.deepEqual(frozen.explanation, candidate.explanation, `${seed}/${language}: explanation changed at freeze.`);
    assert.equal(frozen.targetSvg, candidate.targetSvg, `${seed}/${language}: target SVG changed at freeze.`);
    assert.deepEqual(frozen.optionSvgs, candidate.optionSvgs, `${seed}/${language}: option SVGs changed at freeze.`);
    assert.deepEqual(frozen.targetGraph, candidate.targetGraph, `${seed}/${language}: target graph changed at freeze.`);
    assert.deepEqual(frozen.optionGraphs, candidate.optionGraphs, `${seed}/${language}: option graphs changed at freeze.`);
    assert.equal(frozen.correctIndex, candidate.correctIndex, `${seed}/${language}: answer index changed at freeze.`);
    assert.equal(frozen.answer, candidate.answer, `${seed}/${language}: answer changed at freeze.`);
    assert.equal(frozen.permanentQlId, "SPA-QL-041", `${seed}/${language}: permanent QL changed at freeze.`);
    assert.equal(frozen.equivalencePolicy, "FIXED_ORIENTATION", `${seed}/${language}: equivalence policy changed at freeze.`);
    assert.equal(frozen.geometryFingerprint, candidate.geometryFingerprint, `${seed}/${language}: geometry fingerprint changed at freeze.`);
    assert.equal(frozen.contentFingerprint, candidate.contentFingerprint, `${seed}/${language}: content fingerprint changed at freeze.`);
    assert.deepEqual(frozen.validation, candidate.validation, `${seed}/${language}: validation changed at freeze.`);
    assert.deepEqual(frozen.connectivityValidation, candidate.connectivityValidation, `${seed}/${language}: connectivity validation changed at freeze.`);
    assert.deepEqual(frozen.lifecycle, candidate.lifecycle, `${seed}/${language}: downstream lifecycle changed at freeze.`);
    assert.equal(frozen.localization.authorityId, EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1.authorityId);
    assert.equal(frozen.localization.freezeAuthorityId, EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId);
    assert.equal(frozen.localization.frozen, true);
    assert.equal(frozen.localization.reviewOnly, false);
    assert.equal(frozen.localization.activationBlockedUntilEnglishFreezeCiGreen, false);
    assert.equal(frozen.localization.sourceEnglishContentFingerprint, en.contentFingerprint);
    assert.equal(frozen.localization.sourceEnglishGeometryFingerprint, en.geometryFingerprint);

    if (language === "hi") {
      assert.match(frozen.stem, /[\u0900-\u097F]/, `${seed}: frozen Hindi stem lacks Devanagari.`);
      assert.match(Object.values(frozen.explanation).join(" "), /[\u0900-\u097F]/, `${seed}: frozen Hindi explanation lacks Devanagari.`);
      hiStems.add(frozen.stem);
    } else {
      assert.match(frozen.stem, /[\u0A00-\u0A7F]/, `${seed}: frozen Punjabi stem lacks Gurmukhi.`);
      assert.match(Object.values(frozen.explanation).join(" "), /[\u0A00-\u0A7F]/, `${seed}: frozen Punjabi explanation lacks Gurmukhi.`);
      paStems.add(frozen.stem);
    }
    scriptChecks += 2;
    parityChecks += 14;
    frozenQuestionCount += 1;
  }
  geometries.add(en.geometryFingerprint);
  contentFingerprints.add(en.contentFingerprint);
}

assert.equal(frozenQuestionCount, 480);
assert.equal(hiStems.size, 8);
assert.equal(paStems.size, 8);
assert.equal(geometries.size, 240);
assert.equal(contentFingerprints.size, 240);

const evidence = {
  status: "PASS_EMB_001_HI_PA_LOCALIZATION_FREEZE_V1",
  authorityId: EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  productOwnerApprovalAuthorityId: EMBEDDED_FIGURE_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  exactReviewedLocalization: EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedLocalization,
  englishQuestionCount: seeds.length,
  frozenLocalizedQuestionCount: frozenQuestionCount,
  parityChecks,
  scriptChecks,
  hindiStemVariantCount: hiStems.size,
  punjabiStemVariantCount: paStems.size,
  uniqueGeometryFingerprints: geometries.size,
  uniqueCanonicalContentFingerprints: contentFingerprints.size,
  governance: EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance,
  nextGate: EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.nextGate,
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-emb-001-localization-freeze-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
