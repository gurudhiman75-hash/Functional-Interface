import assert from "node:assert/strict";

import { TRG_001_FREEZE, generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import { trg001V3ResidualEnglishTokens } from "./localization-editorial-v3";
import {
  generateLocalizedTrg001QuestionNativeV5,
  trg001V5BindingCount,
  trg001V5RuleText,
} from "./localization-native-v5-final";
import {
  TRG_001_V5_BINDINGS,
  trg001V5BindingFor,
} from "./localization-native-v5-registry";

function optionSemantics(question: any) {
  return question.options.map((option: any) => ({
    value: option.value,
    isCorrect: option.isCorrect,
    misconceptionId: option.misconceptionId,
  }));
}

function learnerTexts(question: any) {
  return [
    ["stem", question.stem],
    ...question.options.map((option: any, index: number) => [`option-${index + 1}`, option.display]),
    ["localizedAnswerDisplay", question.localizedAnswerDisplay],
    ["keyRule", question.explanation?.keyRule],
    ...question.explanation.steps.flatMap((step: any, index: number) => [
      [`step-${index + 1}-title`, step.title],
      [`step-${index + 1}-body`, step.body],
    ]),
    ["shortcut", question.explanation?.shortcut],
    ...question.explanation.traps.map((trap: any, index: number) => [`trap-${index + 1}`, trap]),
  ] as Array<[string, unknown]>;
}

function containsNativeScript(value: unknown, locale: "hi-IN" | "pa-IN") {
  const text = String(value ?? "");
  return locale === "hi-IN" ? /[\u0900-\u097F]/u.test(text) : /[\u0A00-\u0A7F]/u.test(text);
}

function nativeArtifacts(text: string, locale: "hi-IN" | "pa-IN") {
  const patterns = locale === "hi-IN"
    ? [
        /का सटीक मान ज्ञात कीजिए\s+(?:sin|cos|tan|cot|sec|cosec)/u,
        /है परिभाषित/u,
        /कौन-सा option/u,
        /समकोण-angled/u,
        /^में\s/u,
        /\breciprocal\b/iu,
        /प्रश्न की जानकारी को पहचानें:\s*.+(?:ज्ञात कीजिए|सरल कीजिए|बदलिए|क्या है)/u,
      ]
    : [
        /ਦਾ ਸਹੀ ਮਾਨ ਕੱਢੋ\s+(?:sin|cos|tan|cot|sec|cosec)/u,
        /ਹੈ ਪਰਿਭਾਸ਼ਿਤ/u,
        /ਕਿਹੜਾ option/u,
        /ਸਮਕੋਣ-angled/u,
        /^ਵਿੱਚ\s/u,
        /\breciprocal\b/iu,
        /ਪ੍ਰਸ਼ਨ ਦੀ ਜਾਣਕਾਰੀ ਪਛਾਣੋ:\s*.+(?:ਕੱਢੋ|ਸਰਲ ਕਰੋ|ਬਦਲੋ|ਕੀ ਹੈ)/u,
      ];
  return patterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144, "V5 requires all 144 frozen TRG-001 QLs.");
assert.equal(trg001V5BindingCount(), 144, "V5 registry must contain exactly 144 QL bindings.");
assert.equal(Object.keys(TRG_001_V5_BINDINGS).length, 144, "V5 binding object count drifted.");
assert.equal(
  TRG_001_FREEZE.approvedContentFingerprint,
  "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
  "Frozen English authority fingerprint drifted.",
);
for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  assert(trg001V5BindingFor(qlId), `${qlId}: missing mandatory V5 binding.`);
}

const templateFailures: Array<{ qlId: string; locale: string; seed: string; error: string }> = [];
const languageFailures: Array<{ id: string; field: string; tokens: string[]; text: string }> = [];
const artifactFailures: Array<{ id: string; field: string; artifacts: string[]; text: string }> = [];
const fingerprints = new Set<string>();
let cases = 0;
let inspectedLearnerTexts = 0;
const seedsPerQl = 5;

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  const binding = trg001V5BindingFor(qlId);
  assert(binding, `${qlId}: missing V5 binding.`);

  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    for (let index = 1; index <= seedsPerQl; index += 1) {
      const seed = `trg001-native-v5-${String(index).padStart(2, "0")}-${qlId}-${locale}`;
      const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
      let localized: any;
      try {
        localized = generateLocalizedTrg001QuestionNativeV5(qlId, seed, locale) as any;
      } catch (error) {
        templateFailures.push({
          qlId,
          locale,
          seed,
          error: error instanceof Error ? error.message : String(error),
        });
        continue;
      }
      const repeated = generateLocalizedTrg001QuestionNativeV5(qlId, seed, locale) as any;
      const id = `${qlId}:${locale}:seed${index}`;

      assert.deepEqual(localized, repeated, `${id}: V5 generation is not deterministic.`);
      assert.equal(trg001CanonicalSemanticFingerprint(localized), trg001CanonicalSemanticFingerprint(source), `${id}: semantic fingerprint drift.`);
      assert.equal(localized.qlId, source.qlId, `${id}: QL drift.`);
      assert.equal(localized.cpId, source.cpId, `${id}: CP drift.`);
      assert.equal(localized.seed, source.seed, `${id}: seed drift.`);
      assert.equal(localized.lockedFamily, source.lockedFamily, `${id}: family drift.`);
      assert.equal(localized.solveMode, source.solveMode, `${id}: solve-mode drift.`);
      assert.equal(localized.difficulty, source.difficulty, `${id}: difficulty drift.`);
      assert.equal(localized.target, source.target, `${id}: target drift.`);
      assert.deepEqual(localized.exactAnswer, source.exactAnswer, `${id}: exact-answer drift.`);
      assert.equal(localized.answer, source.answer, `${id}: canonical answer drift.`);
      assert.equal(localized.correctIndex, source.correctIndex, `${id}: correct-index drift.`);
      assert.deepEqual(optionSemantics(localized), optionSemantics(source), `${id}: option semantic drift.`);
      assert.deepEqual(localized.canonicalState, source.canonicalState, `${id}: canonical-state drift.`);
      assert.deepEqual(localized.verification, source.verification, `${id}: verification drift.`);

      assert.equal(localized.localizationProof?.v5TemplateHit, true, `${id}: mandatory V5 template hit missing.`);
      assert.equal(localized.localizationProof?.v5StemKind, binding.stemKind, `${id}: V5 stem binding drift.`);
      assert.equal(localized.localizationProof?.v5RuleKey, binding.ruleKey, `${id}: V5 rule binding drift.`);
      assert.equal(localized.explanation?.keyRule, trg001V5RuleText(binding.ruleKey, locale), `${id}: V5 native rule drift.`);
      assert(containsNativeScript(localized.stem, locale), `${id}: V5 stem lacks native script.`);
      assert.notEqual(localized.stem, source.stem, `${id}: V5 stem fell back to English authority.`);

      for (const [field, value] of learnerTexts(localized)) {
        const text = String(value ?? "");
        const tokens = trg001V3ResidualEnglishTokens(text);
        if (tokens.length) languageFailures.push({ id, field, tokens, text });
        const artifacts = nativeArtifacts(text, locale);
        if (artifacts.length) artifactFailures.push({ id, field, artifacts, text });
        inspectedLearnerTexts += 1;
      }

      assert.equal(localized.reviewStatus, "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5", `${id}: V5 review status drift.`);
      assert.equal(localized.humanReviewStatus, "PENDING", `${id}: human language review must remain pending.`);
      assert.equal(localized.frozen, false, `${id}: V5 cannot inherit English freeze.`);
      assert.equal(localized.freezeEligible, false, `${id}: V5 cannot auto-freeze.`);
      assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: V5 freeze status drift.`);
      assert.equal(localized.activationAuthorized, false, `${id}: activation must remain OFF.`);
      assert.equal(localized.questionStudioDiscoverable, false, `${id}: localized Question Studio gate must remain OFF.`);
      assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: localized bank gate must remain locked.`);
      assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: localized test gate must remain OFF.`);
      assert.equal(localized.publiclyPublishable, false, `${id}: public publication must remain OFF.`);
      assert.equal(localized.publicReleaseAuthorized, false, `${id}: public release authorization must remain OFF.`);
      assert.equal(localized.localizationLifecycle?.multilingualFreezeGranted, false, `${id}: multilingual freeze must remain false.`);
      assert.equal(localized.localizationLifecycle?.activationAuthorized, false, `${id}: localization lifecycle activation must remain false.`);
      assert.equal(localized.localizationLifecycle?.questionStudioEnabled, false, `${id}: localized Studio lifecycle gate must remain false.`);
      assert.equal(localized.localizationLifecycle?.questionBankWritable, false, `${id}: localized Bank lifecycle gate must remain false.`);
      assert.equal(localized.localizationLifecycle?.testBuilderEligible, false, `${id}: localized Test Builder lifecycle gate must remain false.`);
      assert.equal(localized.localizationLifecycle?.productDeliveryUnlocked, false, `${id}: product delivery must remain locked.`);

      assert.match(localized.localizationProof?.localizationFingerprint ?? "", /^[0-9a-f]{64}$/u, `${id}: V5 localization fingerprint invalid.`);
      assert(!fingerprints.has(localized.localizationProof.localizationFingerprint), `${id}: duplicate V5 localization fingerprint.`);
      fingerprints.add(localized.localizationProof.localizationFingerprint);
      cases += 1;
    }
  }
}

const inventory = {
  status: templateFailures.length || languageFailures.length || artifactFailures.length
    ? "TRG001_LOCALIZATION_NATIVE_V5_DEFECT_INVENTORY"
    : "TRG001_LOCALIZATION_NATIVE_V5_PASS",
  frozenEnglishQls: 144,
  bindingCount: trg001V5BindingCount(),
  seedsPerQl,
  expectedCases: 144 * 2 * seedsPerQl,
  completedCases: cases,
  inspectedLearnerTexts,
  templateFailures: templateFailures.length,
  residualEnglishFields: languageFailures.length,
  nativeArtifactFields: artifactFailures.length,
  templateFailureSamples: templateFailures.slice(0, 50),
  residualEnglishSamples: languageFailures.slice(0, 50),
  nativeArtifactSamples: artifactFailures.slice(0, 50),
  englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
};
console.log(JSON.stringify(inventory, null, 2));

assert.equal(templateFailures.length, 0, `V5 has ${templateFailures.length} template failures.`);
assert.equal(languageFailures.length, 0, `V5 has ${languageFailures.length} learner fields with residual English prose.`);
assert.equal(artifactFailures.length, 0, `V5 has ${artifactFailures.length} known native-language artifacts.`);
assert.equal(cases, 144 * 2 * seedsPerQl, `Expected ${144 * 2 * seedsPerQl} V5 cases, got ${cases}.`);
assert.equal(fingerprints.size, cases, "Expected one unique V5 fingerprint per generated case.");