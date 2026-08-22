import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { generatePfcTpfPermanentEnglishCorpusV3 } from "../foundation/spatial/paper-folding-permanent-english-runtime-v3";
import {
  generatePfcTpfLocalizedCorpusV2,
  PFC_TPF_LOCALIZATION_AUTHORITY_V2,
  renderPfcTpfLocalizationReviewHtmlV2,
} from "../foundation/spatial/paper-folding-localization-v2";
import { PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2 } from "../foundation/spatial/paper-folding-english-freeze-v2";

const english = generatePfcTpfPermanentEnglishCorpusV3();
const hindi = generatePfcTpfLocalizedCorpusV2("hi");
const punjabi = generatePfcTpfLocalizedCorpusV2("pa");

assert.equal(english.length, 84);
assert.equal(hindi.length, 84);
assert.equal(punjabi.length, 84);
assert.equal(PFC_TPF_LOCALIZATION_AUTHORITY_V2.localizedQuestionCount, 168);
assert.equal(PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.governance.englishFrozen, true);

const DEVANAGARI = /[\u0900-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;

for (let index = 0; index < english.length; index += 1) {
  const source = english[index];
  const hi = hindi[index];
  const pa = punjabi[index];
  for (const localized of [hi, pa]) {
    assert.equal(localized.permanentQuestionId, source.permanentQuestionId);
    assert.equal(localized.canonicalQuestionId, source.canonicalQuestionId);
    assert.equal(localized.permanentQlId, source.permanentQlId);
    assert.equal(localized.proposalId, source.proposalId);
    assert.equal(localized.chapterCode, source.chapterCode);
    assert.equal(localized.provenance, source.provenance);
    assert.equal(localized.representation, source.representation);
    assert.equal(localized.sourceReviewId, source.sourceReviewId);
    assert.equal(localized.stimulusSvg, source.stimulusSvg);
    assert.deepEqual(localized.options, source.options);
    assert.equal(localized.correctOptionId, source.correctOptionId);
    assert.equal(localized.contentFingerprint, source.contentFingerprint);
    assert.equal(localized.localization.sourceEnglishContentFingerprint, source.contentFingerprint);
    assert.equal(localized.localization.reviewOnly, true);
    assert.equal(localized.localization.frozen, false);
    assert.ok(!localized.stem.includes("�"));
    assert.ok(!localized.explanation.includes("�"));
  }
  assert.equal(hi.language, "hi");
  assert.equal(hi.locale, "hi-IN");
  assert.ok(DEVANAGARI.test(hi.permanentQlTitle));
  assert.ok(DEVANAGARI.test(hi.stem));
  assert.ok(DEVANAGARI.test(hi.explanation));
  assert.equal(pa.language, "pa");
  assert.equal(pa.locale, "pa-IN");
  assert.ok(GURMUKHI.test(pa.permanentQlTitle));
  assert.ok(GURMUKHI.test(pa.stem));
  assert.ok(GURMUKHI.test(pa.explanation));
}

const expectedQlCounts = PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.frozenCorpus.perQlCounts;
for (const qlId of Object.keys(expectedQlCounts) as Array<keyof typeof expectedQlCounts>) {
  assert.equal(hindi.filter((question) => question.permanentQlId === qlId).length, expectedQlCounts[qlId]);
  assert.equal(punjabi.filter((question) => question.permanentQlId === qlId).length, expectedQlCounts[qlId]);
}

const html = renderPfcTpfLocalizationReviewHtmlV2();
assert.ok(html.includes("PFC / TPF Hindi + Punjabi Localization Review V2"));
assert.ok(html.includes("हिन्दी"));
assert.ok(html.includes("ਪੰਜਾਬੀ"));
assert.equal((html.match(/class="q"/g) ?? []).length, 84);
assert.equal((html.match(/class="option"/g) ?? []).length, 336);

const evidence = {
  status: "PASS_PFC_TPF_HINDI_PUNJABI_LOCALIZATION_V2_PARITY",
  authority: PFC_TPF_LOCALIZATION_AUTHORITY_V2,
  englishFreezeAuthorityId: PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
  englishQuestionCount: english.length,
  hindiQuestionCount: hindi.length,
  punjabiQuestionCount: punjabi.length,
  localizedQuestionCount: hindi.length + punjabi.length,
  geometryInvariant: true,
  optionOrderInvariant: true,
  answerInvariant: true,
  permanentIdsInvariant: true,
  canonicalIdsInvariant: true,
  qlIdsInvariant: true,
  provenanceInvariant: true,
  representationInvariant: true,
  canonicalContentFingerprintInvariant: true,
  replacementGlyphCount: 0,
  governance: {
    humanReviewRequired: true,
    localizationFrozen: false,
    questionStudioAllowed: false,
    questionBankWritable: false,
    publicTestEligible: false,
    nextGate: "PFC_TPF_HINDI_PUNJABI_LOCALIZATION_V2_HUMAN_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-localization-review-v2.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-localization-review-v2-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
