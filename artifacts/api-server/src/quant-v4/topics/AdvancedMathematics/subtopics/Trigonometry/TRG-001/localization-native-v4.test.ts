import assert from "node:assert/strict";

import { TRG_001_FREEZE, generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import {
  generateLocalizedTrg001QuestionNativeV4,
  trg001V4ResidualEnglishTokens,
} from "./localization-native-v4";

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

function mechanicalArtifacts(text: string, locale: "hi-IN" | "pa-IN") {
  const patterns = locale === "hi-IN"
    ? [
        /^का\s/u,
        /^के लिए\s/u,
        /मान का\s/u,
        /है परिभाषित/u,
        /है बराबर को/u,
        /बराबर (?:है|हैं) को/u,
        /कर्ण है [0-9√]/u,
        /भुजा है [0-9√]/u,
        /स्केल है/u,
        /प्रतिस्थापित करें .+ से/u,
        /न करें प्रतिस्थापित/u,
        /भाग दें से/u,
        /भाग देने पर से/u,
        /ज्ञात कीजिए .+ सटीक रूप से/u,
        /मान ज्ञात कीजिए .+ सटीक रूप से/u,
        /कौन-सा का/u,
        /न करें\s+\S+\s+करें/u,
      ]
    : [
        /^ਦਾ\s/u,
        /^ਲਈ\s/u,
        /ਮਾਨ ਦਾ\s/u,
        /ਹੈ ਪਰਿਭਾਸ਼ਿਤ/u,
        /ਹੈ ਬਰਾਬਰ ਨੂੰ/u,
        /ਬਰਾਬਰ (?:ਹੈ|ਹਨ) ਨੂੰ/u,
        /ਕਰਣ ਹੈ [0-9√]/u,
        /ਭੁਜਾ ਹੈ [0-9√]/u,
        /ਸਕੇਲ ਗੁਣਕ ਹੈ [0-9√]/u,
        /ਬਦਲੋ .+ ਨਾਲ/u,
        /ਨਾ ਕਰੋ ਬਦਲੋ/u,
        /ਭਾਗ ਦਿਓ ਨਾਲ/u,
        /ਭਾਗ ਦੇਣ ਤੇ ਨਾਲ/u,
        /ਕੱਢੋ .+ ਸਹੀ ਤੌਰ ਤੇ/u,
        /ਮਾਨ ਕੱਢੋ .+ ਸਹੀ ਤੌਰ ਤੇ/u,
        /ਕਿਹੜਾ ਦਾ/u,
        /ਨਾ ਕਰੋ\s+\S+\s+ਕਰੋ/u,
      ];
  return patterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144, "V4 must cover all frozen TRG-001 QLs.");
assert.equal(
  TRG_001_FREEZE.approvedContentFingerprint,
  "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
  "Frozen English authority fingerprint drifted.",
);

const seeds = ["native-v4-a", "native-v4-b", "native-v4-c"] as const;
let surfaces = 0;
let inspectedLearnerTexts = 0;
let residualEnglishProseTokens = 0;
let mechanicalArtifactCount = 0;
const residualSamples: any[] = [];
const mechanicalSamples: any[] = [];
const fingerprints = new Set<string>();

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    for (const seedSuffix of seeds) {
      const seed = `trg001-${qlId}-${locale}-${seedSuffix}`;
      const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
      const localized = generateLocalizedTrg001QuestionNativeV4(qlId, seed, locale) as any;
      const id = `${qlId}:${locale}:${seedSuffix}`;

      assert.equal(
        trg001CanonicalSemanticFingerprint(localized),
        trg001CanonicalSemanticFingerprint(source),
        `${id}: semantic fingerprint drift.`,
      );
      assert.equal(localized.qlId, source.qlId, `${id}: QL drift.`);
      assert.equal(localized.cpId, source.cpId, `${id}: CP drift.`);
      assert.equal(localized.seed, source.seed, `${id}: seed drift.`);
      assert.equal(localized.lockedFamily, source.lockedFamily, `${id}: family drift.`);
      assert.equal(localized.solveMode, source.solveMode, `${id}: solve-mode drift.`);
      assert.equal(localized.answer, source.answer, `${id}: answer drift.`);
      assert.deepEqual(localized.exactAnswer, source.exactAnswer, `${id}: exact-answer drift.`);
      assert.equal(localized.correctIndex, source.correctIndex, `${id}: correct-index drift.`);
      assert.deepEqual(optionSemantics(localized), optionSemantics(source), `${id}: option semantic drift.`);
      assert.deepEqual(localized.canonicalState, source.canonicalState, `${id}: canonical-state drift.`);
      assert.deepEqual(localized.verification, source.verification, `${id}: verification drift.`);

      for (const [field, value] of learnerTexts(localized)) {
        const text = String(value ?? "");
        const residual = trg001V4ResidualEnglishTokens(text);
        const mechanical = mechanicalArtifacts(text, locale);
        residualEnglishProseTokens += residual.length;
        mechanicalArtifactCount += mechanical.length;
        if (residual.length && residualSamples.length < 40) {
          residualSamples.push({ id, field, tokens: residual, text });
        }
        if (mechanical.length && mechanicalSamples.length < 40) {
          mechanicalSamples.push({ id, field, artifacts: mechanical, text });
        }
        inspectedLearnerTexts += 1;
      }

      assert.equal(localized.reviewStatus, "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V4", `${id}: V4 review status drift.`);
      assert.equal(localized.humanReviewStatus, "PENDING", `${id}: human review must remain pending.`);
      assert.equal(localized.frozen, false, `${id}: V4 cannot inherit English freeze.`);
      assert.equal(localized.freezeEligible, false, `${id}: V4 cannot auto-freeze.`);
      assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: V4 freeze status drift.`);
      assert.equal(localized.activationAuthorized, false, `${id}: activation must remain OFF.`);
      assert.equal(localized.questionStudioDiscoverable, false, `${id}: localized Question Studio gate must remain OFF.`);
      assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: localized bank gate must remain locked.`);
      assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: localized test gate must remain OFF.`);
      assert.equal(localized.publiclyPublishable, false, `${id}: public publication must remain OFF.`);
      assert.equal(localized.publicReleaseAuthorized, false, `${id}: public release authorization must remain OFF.`);
      assert.equal(localized.localizationLifecycle?.multilingualFreezeGranted, false, `${id}: multilingual freeze must remain false.`);
      assert.equal(localized.localizationLifecycle?.productDeliveryUnlocked, false, `${id}: product delivery must remain locked.`);
      assert.match(localized.localizationProof?.localizationFingerprint ?? "", /^[0-9a-f]{64}$/u, `${id}: V4 fingerprint invalid.`);
      assert(!fingerprints.has(localized.localizationProof.localizationFingerprint), `${id}: duplicate V4 fingerprint.`);
      fingerprints.add(localized.localizationProof.localizationFingerprint);
      surfaces += 1;
    }
  }
}

const inventory = {
  status: residualEnglishProseTokens === 0 && mechanicalArtifactCount === 0
    ? "TRG001_LOCALIZATION_NATIVE_V4_PASS"
    : "TRG001_LOCALIZATION_NATIVE_V4_DEFECT_INVENTORY",
  frozenEnglishQls: 144,
  locales: [...TRG_001_LOCALIZATION_LOCALES],
  seedsPerQl: seeds.length,
  localizedSurfaces: surfaces,
  inspectedLearnerTexts,
  residualEnglishProseTokens,
  mechanicalArtifactCount,
  residualSamples,
  mechanicalSamples,
  englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
};

console.log(JSON.stringify(inventory, null, 2));

assert.equal(surfaces, 864, `Expected 864 V4 localized surfaces, got ${surfaces}.`);
assert.equal(fingerprints.size, 864, "Expected one unique V4 fingerprint per localized surface.");
assert.equal(residualEnglishProseTokens, 0, `V4 has ${residualEnglishProseTokens} residual English prose tokens.`);
assert.equal(mechanicalArtifactCount, 0, `V4 has ${mechanicalArtifactCount} known mechanical grammar artifacts.`);
