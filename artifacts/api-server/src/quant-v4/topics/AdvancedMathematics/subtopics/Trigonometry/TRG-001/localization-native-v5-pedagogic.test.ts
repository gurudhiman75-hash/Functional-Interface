import assert from "node:assert/strict";

import { TRG_001_FREEZE, generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import { trg001V3ResidualEnglishTokens } from "./localization-editorial-v3";
import { localizeFrozenTrg001QuestionNativeV4 } from "./localization-native-v4";
import { trg001V5RuleText } from "./localization-native-v5-final";
import {
  generateLocalizedTrg001QuestionNativeV5Pedagogic,
} from "./localization-native-v5-pedagogic";
import { trg001V5BindingFor } from "./localization-native-v5-registry";

function formulaAtoms(value: unknown) {
  const text = String(value ?? "");
  return Array.from(new Set(text.match(
    /(?:sin|cos|tan|cot|sec|cosec)[A-Za-z0-9αβγθπ²°()+\-/*√=]*|\d+(?:\/\d+)?(?:°)?|π|√\d+/giu,
  ) ?? []));
}

function learnerExplanationTexts(question: any) {
  return [
    ["keyRule", question.explanation?.keyRule],
    ...question.explanation.steps.flatMap((step: any, index: number) => [
      [`step-${index + 1}-title`, step.title],
      [`step-${index + 1}-body`, step.body],
    ]),
    ["shortcut", question.explanation?.shortcut],
    ...question.explanation.traps.map((trap: any, index: number) => [`trap-${index + 1}`, trap]),
  ] as Array<[string, unknown]>;
}

function machineArtifacts(text: string, locale: "hi-IN" | "pa-IN") {
  const patterns = locale === "hi-IN"
    ? [
        /\$\{/u,
        /अनुपातs/u,
        /चतुर्थांशI/u,
        /चतुर्थांश-IV/u,
        /के के बराबर/u,
        /है केवल/u,
        /सरल करें को/u,
        /गुणा करें को/u,
        /न करें (?:मान रखें|प्रयोग करें|जोड़ें|घटाएँ|काटें)/u,
        /हल करने पर देता है/u,
        /जोड़ें समीकरण को प्राप्त करें/u,
        /घटाएँ समीकरण:/u,
        /मान रखें दोनों दिया गया/u,
        /sin²θ\+cos²θ=1 नहीं करता लागू करें/u,
        /हर के लिए एक टैन्जेंट योग/u,
        /दिए गए मान लगाने पर सही उत्तर/u,
        /मुख्य सूत्र या सर्वसमिका को सीधे लागू करने पर/u,
      ]
    : [
        /\$\{/u,
        /ਅਨੁਪਾਤs/u,
        /ਚਤੁਰਭਾਗI/u,
        /ਚਤੁਰਭਾਗ-IV/u,
        /ਦੇ ਦੇ ਬਰਾਬਰ/u,
        /ਹੈ ਕੇਵਲ/u,
        /ਸਰਲ ਕਰੋ ਨੂੰ/u,
        /ਗੁਣਾ ਕਰੋ ਨੂੰ/u,
        /ਨਾ ਕਰੋ (?:ਮਾਨ ਰੱਖੋ|ਵਰਤੋ|ਜੋੜੋ|ਘਟਾਓ|ਕੱਟੋ)/u,
        /ਹੱਲ ਕਰਨ ਤੇ ਦਿੰਦਾ ਹੈ/u,
        /ਜੋੜੋ ਸਮੀਕਰਨ ਨੂੰ ਪ੍ਰਾਪਤ ਕਰੋ/u,
        /ਘਟਾਓ ਸਮੀਕਰਨ:/u,
        /ਮਾਨ ਰੱਖੋ ਦੋਵੇਂ ਦਿੱਤਾ/u,
        /sin²θ\+cos²θ=1 ਨਹੀਂ ਕਰਦਾ ਲਾਗੂ ਕਰੋ/u,
        /ਹਰ ਲਈ ਇੱਕ ਟੈਂਜੈਂਟ ਜੋੜ/u,
        /ਦਿੱਤੇ ਮਾਨ ਲਗਾਉਣ ਤੇ ਸਹੀ ਉੱਤਰ/u,
        /ਮੁੱਖ ਸੂਤਰ ਜਾਂ ਸਰਬਸਮਿਕਾ ਸਿੱਧੀ ਲਗਾਉਣ ਤੇ/u,
      ];
  return patterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144, "Pedagogic V5 requires all 144 frozen QLs.");
assert.equal(
  TRG_001_FREEZE.approvedContentFingerprint,
  "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
  "Frozen English authority fingerprint drifted.",
);

const failures: Array<{ id: string; field: string; issue: string; text?: string }> = [];
const fingerprints = new Set<string>();
const seedsPerQl = 3;
let cases = 0;
let preservedMathAtoms = 0;
let inspectedExplanationFields = 0;

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  const binding = trg001V5BindingFor(qlId);
  assert(binding, `${qlId}: missing V5 binding.`);

  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    for (let index = 1; index <= seedsPerQl; index += 1) {
      const seed = `trg001-v5-pedagogic-${String(index).padStart(2, "0")}-${qlId}-${locale}`;
      const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
      const v4 = localizeFrozenTrg001QuestionNativeV4(source, locale) as any;
      const localized = generateLocalizedTrg001QuestionNativeV5Pedagogic(qlId, seed, locale) as any;
      const repeated = generateLocalizedTrg001QuestionNativeV5Pedagogic(qlId, seed, locale) as any;
      const id = `${qlId}:${locale}:seed${index}`;

      assert.deepEqual(localized, repeated, `${id}: pedagogic V5 is not deterministic.`);
      assert.equal(
        trg001CanonicalSemanticFingerprint(localized),
        trg001CanonicalSemanticFingerprint(source),
        `${id}: semantic fingerprint drift.`,
      );
      assert.equal(localized.explanation.keyRule, trg001V5RuleText(binding.ruleKey, locale), `${id}: V5 native rule drift.`);
      assert.equal(localized.explanation.steps.length, v4.explanation.steps.length, `${id}: question-specific step count drift.`);

      for (let stepIndex = 0; stepIndex < v4.explanation.steps.length; stepIndex += 1) {
        const sourceStep = v4.explanation.steps[stepIndex];
        const localizedStep = localized.explanation.steps[stepIndex];
        for (const atom of formulaAtoms(sourceStep.body)) {
          if (!String(localizedStep.body).includes(atom)) {
            failures.push({ id, field: `step-${stepIndex + 1}-body`, issue: `missing-math-atom:${atom}`, text: localizedStep.body });
          } else {
            preservedMathAtoms += 1;
          }
        }
      }

      for (const [field, raw] of learnerExplanationTexts(localized)) {
        const text = String(raw ?? "");
        const english = trg001V3ResidualEnglishTokens(text);
        if (english.length) failures.push({ id, field, issue: `residual-english:${english.join(",")}`, text });
        for (const artifact of machineArtifacts(text, locale)) {
          failures.push({ id, field, issue: `machine-artifact:${artifact}`, text });
        }
        inspectedExplanationFields += 1;
      }

      assert.equal(localized.reviewStatus, "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC", `${id}: review status drift.`);
      assert.equal(localized.localizationProof?.v5PedagogicOverlay, true, `${id}: pedagogic proof missing.`);
      assert.equal(localized.localizationProof?.pedagogicWorkingSource, "V4_QUESTION_SPECIFIC_EXPLANATION", `${id}: working source drift.`);
      assert.equal(localized.humanReviewStatus, "PENDING", `${id}: human review must remain pending.`);
      assert.equal(localized.frozen, false, `${id}: localized surface cannot inherit English freeze.`);
      assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: freeze status drift.`);
      assert.equal(localized.activationAuthorized, false, `${id}: activation must remain OFF.`);
      assert.equal(localized.questionStudioDiscoverable, false, `${id}: Question Studio must remain OFF.`);
      assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: bank must remain locked.`);
      assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: Test Builder must remain OFF.`);
      assert.equal(localized.publiclyPublishable, false, `${id}: public publication must remain OFF.`);
      assert.equal(localized.publicReleaseAuthorized, false, `${id}: public release must remain OFF.`);
      assert.equal(localized.localizationLifecycle?.multilingualFreezeGranted, false, `${id}: multilingual freeze must remain false.`);
      assert.equal(localized.localizationLifecycle?.activationAuthorized, false, `${id}: lifecycle activation must remain false.`);
      assert.equal(localized.localizationLifecycle?.questionStudioEnabled, false, `${id}: localized Studio gate must remain false.`);
      assert.equal(localized.localizationLifecycle?.questionBankWritable, false, `${id}: localized bank gate must remain false.`);
      assert.equal(localized.localizationLifecycle?.testBuilderEligible, false, `${id}: localized test gate must remain false.`);
      assert.equal(localized.localizationLifecycle?.productDeliveryUnlocked, false, `${id}: product delivery must remain locked.`);

      assert.match(localized.localizationProof?.localizationFingerprint ?? "", /^[0-9a-f]{64}$/u, `${id}: localization fingerprint invalid.`);
      assert(!fingerprints.has(localized.localizationProof.localizationFingerprint), `${id}: duplicate localization fingerprint.`);
      fingerprints.add(localized.localizationProof.localizationFingerprint);
      cases += 1;
    }
  }
}

const inventory = {
  status: failures.length ? "TRG001_LOCALIZATION_NATIVE_V5_PEDAGOGIC_DEFECT_INVENTORY" : "TRG001_LOCALIZATION_NATIVE_V5_PEDAGOGIC_PASS",
  frozenEnglishQls: 144,
  seedsPerQl,
  expectedCases: 144 * 2 * seedsPerQl,
  completedCases: cases,
  inspectedExplanationFields,
  preservedMathAtoms,
  failures: failures.length,
  failureSamples: failures.slice(0, 80),
  englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
};
console.log(JSON.stringify(inventory, null, 2));

assert.equal(failures.length, 0, `Pedagogic V5 has ${failures.length} editorial/preservation failures.`);
assert.equal(cases, 144 * 2 * seedsPerQl, `Expected ${144 * 2 * seedsPerQl} pedagogic cases, got ${cases}.`);
assert.equal(fingerprints.size, cases, "Expected one unique pedagogic localization fingerprint per case.");
