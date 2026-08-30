import assert from "node:assert/strict";

import { TRG_001_FREEZE, generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import { TRG_001_LOCALIZATION_LOCALES, TRG_001_LOCALIZATION_QL_IDS, trg001CanonicalSemanticFingerprint } from "./localization-v1";
import {
  generateLocalizedTrg001QuestionEditorialV3,
  trg001V3ResidualEnglishTokens,
} from "./localization-editorial-v3";

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

function grammarArtifacts(text: string, locale: "hi-IN" | "pa-IN") {
  const patterns = locale === "hi-IN"
    ? [
        /^में\s/u,
        /कौन-सा भुजा/u,
        /सटा हुआ भुजा/u,
        /समकोण कोण/u,
        /अनुपातnal/u,
        /\ba\s+[\u0900-\u097F]/u,
      ]
    : [
        /^ਵਿੱਚ\s/u,
        /ਕਿਹੜਾ ਭੁਜਾ/u,
        /ਲੱਗਦਾ ਭੁਜਾ/u,
        /ਸਮਕੋਣ ਕੋਣ/u,
        /ਅਨੁਪਾਤnal/u,
        /\ba\s+[\u0A00-\u0A7F]/u,
      ];
  return patterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144, "V3 must cover all frozen TRG-001 QLs.");
assert.equal(
  TRG_001_FREEZE.approvedContentFingerprint,
  "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
  "Frozen English authority fingerprint drifted.",
);

let surfaces = 0;
let inspectedLearnerTexts = 0;
let residualEnglishProseTokens = 0;
let knownGrammarArtifacts = 0;
const fingerprints = new Set<string>();
const residualTokenCounts = new Map<string, number>();
const residualSamples: Array<{ id: string; field: string; tokens: string[]; text: string }> = [];
const grammarSamples: Array<{ id: string; field: string; artifacts: string[]; text: string }> = [];

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    const seed = `trg001-localization-editorial-v3-${qlId}-${locale}`;
    const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
    const localized = generateLocalizedTrg001QuestionEditorialV3(qlId, seed, locale) as any;
    const id = `${qlId}:${locale}`;

    assert.equal(trg001CanonicalSemanticFingerprint(localized), trg001CanonicalSemanticFingerprint(source), `${id}: semantic fingerprint drift.`);
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
      const residual = trg001V3ResidualEnglishTokens(text);
      const artifacts = grammarArtifacts(text, locale);
      residualEnglishProseTokens += residual.length;
      knownGrammarArtifacts += artifacts.length;
      for (const token of residual) {
        const key = `${locale}:${token.toLowerCase()}`;
        residualTokenCounts.set(key, (residualTokenCounts.get(key) ?? 0) + 1);
      }
      if (residual.length && residualSamples.length < 120) {
        residualSamples.push({ id, field, tokens: residual, text });
      }
      if (artifacts.length && grammarSamples.length < 120) {
        grammarSamples.push({ id, field, artifacts, text });
      }
      inspectedLearnerTexts += 1;
    }

    assert.equal(localized.reviewStatus, "LOCALIZATION_EDITORIAL_REVIEW_CANDIDATE_V3", `${id}: V3 review status drift.`);
    assert.equal(localized.humanReviewStatus, "PENDING", `${id}: human review must remain pending.`);
    assert.equal(localized.frozen, false, `${id}: V3 cannot inherit English freeze.`);
    assert.equal(localized.freezeEligible, false, `${id}: V3 cannot auto-freeze.`);
    assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: V3 freeze status drift.`);
    assert.equal(localized.activationAuthorized, false, `${id}: activation must remain OFF.`);
    assert.equal(localized.questionStudioDiscoverable, false, `${id}: localized Question Studio gate must remain OFF.`);
    assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: localized bank gate must remain locked.`);
    assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: localized test gate must remain OFF.`);
    assert.equal(localized.publiclyPublishable, false, `${id}: public publication must remain OFF.`);
    assert.equal(localized.publicReleaseAuthorized, false, `${id}: public release authorization must remain OFF.`);
    assert.equal(localized.localizationLifecycle?.multilingualFreezeGranted, false, `${id}: multilingual freeze must remain false.`);
    assert.equal(localized.localizationLifecycle?.productDeliveryUnlocked, false, `${id}: product delivery must remain locked.`);
    assert.match(localized.localizationProof?.localizationFingerprint ?? "", /^[0-9a-f]{64}$/u, `${id}: V3 localization fingerprint invalid.`);
    assert(!fingerprints.has(localized.localizationProof.localizationFingerprint), `${id}: duplicate V3 localization fingerprint.`);
    fingerprints.add(localized.localizationProof.localizationFingerprint);
    surfaces += 1;
  }
}

assert.equal(surfaces, 288, `Expected 288 V3 localized surfaces, got ${surfaces}.`);
assert.equal(fingerprints.size, 288, "Expected one unique V3 fingerprint per localized surface.");

const topResidualTokens = [...residualTokenCounts.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 120)
  .map(([token, count]) => ({ token, count }));

console.log(JSON.stringify({
  status: residualEnglishProseTokens === 0 && knownGrammarArtifacts === 0
    ? "TRG001_LOCALIZATION_EDITORIAL_V3_PASS"
    : "TRG001_LOCALIZATION_EDITORIAL_V3_DEFECT_INVENTORY",
  frozenEnglishQls: 144,
  localizedSurfaces: surfaces,
  inspectedLearnerTexts,
  residualEnglishProseTokens,
  knownGrammarArtifacts,
  topResidualTokens,
  residualSamples,
  grammarSamples,
  englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
}, null, 2));

assert.equal(residualEnglishProseTokens, 0, `V3 has ${residualEnglishProseTokens} residual English prose tokens.`);
assert.equal(knownGrammarArtifacts, 0, `V3 has ${knownGrammarArtifacts} known native grammar artifacts.`);
