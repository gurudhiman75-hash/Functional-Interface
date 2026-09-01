import assert from "node:assert/strict";

import { answerClassFromCp003Strengths } from "./cp003-saturation-helpers.ts";
import {
  assertArgCp004LocalizedTemplateContract,
  renderArgCp004LocalizedTemplate,
} from "./cp004-localization-helpers.ts";
import { ARG_CP004_LOCALIZED_TEMPLATES_BY_LOCALE } from "./cp004-localized-templates.ts";
import type { ArgCp004LocalizedLocale } from "./cp004-localization-types.ts";
import { generateArgCp009EnglishQuestion } from "./cp009-english-generator.ts";
import { ARG_CP009_CHECKPOINT_ID, ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY } from "./cp009-english-remediated-templates.ts";
import { generateArgCp009LocalizedQuestionV2 } from "./cp009-localized-generator-v2.ts";
import {
  ARG_CP009_LOCALIZATION_AUTHORITY_V2,
  ARG_CP009_LOCALIZED_TEMPLATES_BY_LOCALE_V2,
} from "./cp009-localized-remediated-templates-v2.ts";
import { ARG_QL_IDS, type ArgAnswerClass } from "./types.ts";

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly ArgCp004LocalizedLocale[];
const EXPECTED_TEMPLATE_COUNT_PER_LOCALE = 48;
const EXPECTED_VARIANTS_PER_TEMPLATE = 256;
const EXPECTED_SURFACES_PER_QL = 2048;
const EXPECTED_SURFACES_PER_LOCALE = 12_288;
const EXPECTED_LOCALIZED_SURFACES = 24_576;

function correctIndex(answerClass: ArgAnswerClass): number {
  if (answerClass === "ONLY_I") return 0;
  if (answerClass === "ONLY_II") return 1;
  if (answerClass === "BOTH") return 2;
  return 3;
}

function templateById(locale: ArgCp004LocalizedLocale, id: string) {
  const templates = ARG_QL_IDS.flatMap((qlId) => ARG_CP009_LOCALIZED_TEMPLATES_BY_LOCALE_V2[locale][qlId]);
  const template = templates.find((entry) => entry.id === id);
  assert.ok(template, `${locale}: missing ${id}`);
  return template;
}

assert.equal(ARG_CP009_LOCALIZATION_AUTHORITY_V2, "ARG_CP009_TRILINGUAL_EDITORIAL_REMEDIATION_V2");
assert.equal(ARG_CP009_CHECKPOINT_ID, "ARG-CP-009");
assert.equal(ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY, "ARG_CP009_ENGLISH_EDITORIAL_REMEDIATION_V1");

for (const locale of LOCALES) {
  const original = ARG_QL_IDS.flatMap((qlId) => ARG_CP004_LOCALIZED_TEMPLATES_BY_LOCALE[locale][qlId]);
  const remediated = ARG_QL_IDS.flatMap((qlId) => ARG_CP009_LOCALIZED_TEMPLATES_BY_LOCALE_V2[locale][qlId]);
  assert.equal(original.length, EXPECTED_TEMPLATE_COUNT_PER_LOCALE, `${locale}: expected 48 historical localized templates`);
  assert.equal(remediated.length, EXPECTED_TEMPLATE_COUNT_PER_LOCALE, `${locale}: expected 48 CP009 localized templates`);
  assert.deepEqual(remediated.map((template) => template.id), original.map((template) => template.id), `${locale}: template ID/order drift`);
  for (let index = 0; index < original.length; index += 1) {
    assert.equal(remediated[index]!.qlId, original[index]!.qlId, `${locale}/${original[index]!.id}: QL drift`);
    assert.equal(remediated[index]!.locale, locale, `${locale}/${original[index]!.id}: locale drift`);
    assertArgCp004LocalizedTemplateContract(remediated[index]!);
  }
}

// Source-level guards for localized defects discovered after the English pass.
assert.match(templateById("hi-IN", "ARG-CP003-QL001-T08").arguments[0].text, /\{c\} से जुड़ी हर समस्या/);
assert.match(templateById("pa-IN", "ARG-CP003-QL001-T08").arguments[0].text, /\{c\} ਨਾਲ ਜੁੜੀ ਹਰ ਸਮੱਸਿਆ/);

assert.deepEqual(templateById("hi-IN", "ARG-CP003-QL005-T01").dimensions[3], [
  "आवेदन जमा करने",
  "सरकारी शुल्क चुकाने",
  "सेवा अनुरोध ट्रैक करने",
  "आधिकारिक जानकारी प्राप्त करने",
]);
assert.deepEqual(templateById("pa-IN", "ARG-CP003-QL005-T01").dimensions[3], [
  "ਅਰਜ਼ੀਆਂ ਜਮ੍ਹਾਂ ਕਰਨ",
  "ਸਰਕਾਰੀ ਫੀਸਾਂ ਭਰਨ",
  "ਸੇਵਾ ਬੇਨਤੀਆਂ ਟ੍ਰੈਕ ਕਰਨ",
  "ਅਧਿਕਾਰਤ ਜਾਣਕਾਰੀ ਲੈਣ",
]);

assert.equal(templateById("hi-IN", "ARG-CP003-QL002-T07").dimensions[3].includes("छात्र तनाव"), false);
assert.equal(templateById("pa-IN", "ARG-CP003-QL002-T07").dimensions[3].includes("ਵਿਦਿਆਰਥੀ ਤਣਾਅ"), false);
assert.equal(templateById("hi-IN", "ARG-CP003-QL004-T06").dimensions[2].some((value) => /से पहले/.test(value)), false);
assert.equal(templateById("pa-IN", "ARG-CP003-QL004-T06").dimensions[2].some((value) => /ਤੋਂ ਪਹਿਲਾਂ/.test(value)), false);
assert.equal(templateById("hi-IN", "ARG-CP003-QL006-T07").dimensions[1].includes("पुन:उपयोग विकल्प अधिभार"), false);
assert.equal(templateById("pa-IN", "ARG-CP003-QL006-T07").dimensions[1].some((value) => /ਪੁਨ.*ਵਰਤੋਂ.*ਸਰਚਾਰਜ/.test(value)), false);

assert.deepEqual(templateById("hi-IN", "ARG-CP003-QL006-T04").dimensions[3], [
  "प्रभावित केंद्र की जाँच",
  "प्रमाण और दायरे का सत्यापन",
  "प्रभावित सत्रों का पृथक्करण",
  "अनुपातिक सुधार प्रक्रिया",
]);
assert.deepEqual(templateById("pa-IN", "ARG-CP003-QL006-T04").dimensions[3], [
  "ਪ੍ਰਭਾਵਿਤ ਕੇਂਦਰ ਦੀ ਜਾਂਚ",
  "ਸਬੂਤ ਅਤੇ ਦਾਇਰੇ ਦੀ ਤਸਦੀਕ",
  "ਪ੍ਰਭਾਵਿਤ ਸੈਸ਼ਨਾਂ ਦੀ ਵੱਖਰੀ ਪਛਾਣ",
  "ਅਨੁਪਾਤਿਕ ਸੁਧਾਰ ਪ੍ਰਕਿਰਿਆ",
]);
assert.match(templateById("pa-IN", "ARG-CP003-QL006-T04").arguments[1].text, /\{d\} ਬਾਰੇ ਵਿਚਾਰ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ/);

let localizedSurfaceCount = 0;
for (const locale of LOCALES) {
  const localeSurfaceKeys = new Set<string>();
  const allRenderedText: string[] = [];
  for (const qlId of ARG_QL_IDS) {
    for (const template of ARG_CP009_LOCALIZED_TEMPLATES_BY_LOCALE_V2[locale][qlId]) {
      const perTemplate = new Set<string>();
      for (let variantIndex = 0; variantIndex < EXPECTED_VARIANTS_PER_TEMPLATE; variantIndex += 1) {
        const rendered = renderArgCp004LocalizedTemplate(template, variantIndex);
        const surface = `${rendered.statement}\n${rendered.arguments[0].text}\n${rendered.arguments[1].text}`;
        assert.doesNotMatch(surface, /\{[abcd]\}/, `${locale}/${template.id}/${variantIndex}: unresolved placeholder`);
        assert.equal(perTemplate.has(surface), false, `${locale}/${template.id}/${variantIndex}: duplicate within template`);
        perTemplate.add(surface);
        localeSurfaceKeys.add(`${qlId}\n${surface}`);
        allRenderedText.push(surface);
      }
      assert.equal(perTemplate.size, EXPECTED_VARIANTS_PER_TEMPLATE, `${locale}/${template.id}: expected 256 distinct surfaces`);
    }
  }
  assert.equal(localeSurfaceKeys.size, EXPECTED_SURFACES_PER_LOCALE, `${locale}: expected 12,288 distinct source surfaces`);
  localizedSurfaceCount += localeSurfaceKeys.size;

  const corpus = allRenderedText.join("\n");
  if (locale === "hi-IN") {
    assert.doesNotMatch(corpus, /सभी (?:आवेदन स्थिति प्रश्नों|भुगतान प्रश्नों|अपॉइंटमेंट समस्याओं|सेवा-वितरण प्रश्नों) तुरंत/);
    assert.doesNotMatch(corpus, /(?:आवेदन जमा करना|सरकारी शुल्क चुकाना|सेवा अनुरोध ट्रैक करना|आधिकारिक जानकारी प्राप्त करना) करने/);
    assert.doesNotMatch(corpus, /प्रभावित सत्रों को अलग करना (?:के बिना|पर विचार)/);
    assert.doesNotMatch(corpus, /बदलाव से (?:चौबीस घंटे|तीन दिन) पहले .* से पहले/);
    assert.doesNotMatch(corpus, /पुन:उपयोग विकल्प अधिभार/);
  } else {
    assert.doesNotMatch(corpus, /ਸਾਰੇ (?:ਅਰਜ਼ੀ ਸਥਿਤੀ ਸਵਾਲਾਂ|ਭੁਗਤਾਨ ਸਵਾਲਾਂ|ਅਪਾਇੰਟਮੈਂਟ ਸਮੱਸਿਆਵਾਂ|ਸੇਵਾ-ਪ੍ਰਦਾਨ ਸਵਾਲਾਂ) ਤੁਰੰਤ/);
    assert.doesNotMatch(corpus, /(?:ਅਰਜ਼ੀਆਂ ਜਮ੍ਹਾਂ ਕਰਨਾ|ਸਰਕਾਰੀ ਫੀਸਾਂ ਭਰਨਾ|ਸੇਵਾ ਬੇਨਤੀਆਂ ਟ੍ਰੈਕ ਕਰਨਾ|ਅਧਿਕਾਰਤ ਜਾਣਕਾਰੀ ਲੈਣਾ) ਕਰਨ/);
    assert.doesNotMatch(corpus, /ਪ੍ਰਭਾਵਿਤ ਸੈਸ਼ਨਾਂ ਨੂੰ ਵੱਖ ਕਰਨਾ (?:ਤੋਂ ਬਿਨਾਂ|ਬਾਰੇ)/);
    assert.doesNotMatch(corpus, /ਬਦਲਾਅ ਤੋਂ (?:ਚੌਵੀ ਘੰਟੇ|ਤਿੰਨ ਦਿਨ) ਪਹਿਲਾਂ .* ਤੋਂ ਪਹਿਲਾਂ/);
  }
}
assert.equal(localizedSurfaceCount, EXPECTED_LOCALIZED_SURFACES, "CP009 must expose 24,576 distinct HI+PA source surfaces");

for (const locale of LOCALES) {
  const generatedSurfaceKeys = new Set<string>();
  for (const qlId of ARG_QL_IDS) {
    const semanticPairs = new Set<string>();
    for (let seed = 0; seed < EXPECTED_SURFACES_PER_QL; seed += 1) {
      const english = generateArgCp009EnglishQuestion({ qlId, seed });
      const localized = generateArgCp009LocalizedQuestionV2({ qlId, locale, seed });

      assert.equal(localized.checkpointId, ARG_CP009_CHECKPOINT_ID);
      assert.equal(localized.authority, ARG_CP009_LOCALIZATION_AUTHORITY_V2);
      assert.equal(localized.sourceEnglishAuthority, ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY);
      assert.equal(localized.templateId, english.templateId, `${locale}/${qlId}/${seed}: template drift`);
      assert.equal(localized.variantIndex, english.variantIndex, `${locale}/${qlId}/${seed}: variant drift`);
      assert.equal(localized.variantKey, english.variantKey, `${locale}/${qlId}/${seed}: variant-key drift`);
      assert.equal(localized.difficulty, english.difficulty, `${locale}/${qlId}/${seed}: difficulty drift`);
      assert.equal(localized.archetype, english.archetype, `${locale}/${qlId}/${seed}: archetype drift`);
      assert.deepEqual(localized.argumentStrengths, english.argumentStrengths, `${locale}/${qlId}/${seed}: strength drift`);
      assert.equal(localized.answerClass, english.answerClass, `${locale}/${qlId}/${seed}: answer drift`);
      assert.equal(localized.correctIndex, english.correctIndex, `${locale}/${qlId}/${seed}: correct-index drift`);
      assert.equal(localized.correctIndex, correctIndex(localized.answerClass));
      assert.equal(
        answerClassFromCp003Strengths(localized.argumentStrengths[0], localized.argumentStrengths[1]),
        localized.answerClass,
        `${locale}/${qlId}/${seed}: strength/answer disagreement`,
      );
      assert.equal(localized.options.length, 4);
      assert.equal(localized.metadata.editorialRemediation, true);
      assert.equal(localized.metadata.trilingualSemanticParity, true);
      assert.equal(localized.metadata.localizationStatus, "CP009_HI_PA_REMEDIATED_V2");
      assert.equal(localized.metadata.reviewOnly, true);
      assert.equal(localized.metadata.manualApprovalRequired, true);
      assert.equal(localized.metadata.persistenceAllowed, false);
      assert.equal(localized.metadata.questionBankWritable, false);
      assert.equal(localized.metadata.testEligible, false);
      assert.equal(localized.metadata.mockEligible, false);
      assert.equal(localized.metadata.publicEligible, false);
      assert.equal(localized.metadata.automaticStudentPublication, false);
      assert.equal(localized.metadata.learnerRelease, "LOCKED");

      semanticPairs.add(`${localized.templateId}:${localized.variantIndex}`);
      generatedSurfaceKeys.add(`${qlId}\n${localized.statement}\n${localized.arguments[0]}\n${localized.arguments[1]}`);
    }
    assert.equal(semanticPairs.size, EXPECTED_SURFACES_PER_QL, `${locale}/${qlId}: scheduler must retain all 2048 semantic surfaces`);
  }
  assert.equal(generatedSurfaceKeys.size, EXPECTED_SURFACES_PER_LOCALE, `${locale}: generator must expose 12,288 distinct surfaces`);
}

for (const locale of LOCALES) {
  for (const qlId of ARG_QL_IDS) {
    for (const seed of [0, 1, 17, 255, 1023, 2047]) {
      assert.deepEqual(
        generateArgCp009LocalizedQuestionV2({ qlId, locale, seed }),
        generateArgCp009LocalizedQuestionV2({ qlId, locale, seed }),
        `${locale}/${qlId}/${seed}: deterministic replay failed`,
      );
    }
  }
}

console.log("ARG-001 CP009 trilingual remediation: PASS (24,576 exhaustive HI+PA surfaces; semantic parity with English)");
