import assert from "node:assert/strict";

import { TRG_001_FREEZE, generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import { TRG_001_LOCALIZATION_LOCALES, TRG_001_LOCALIZATION_QL_IDS, trg001CanonicalSemanticFingerprint } from "./localization-v1";
import {
  generateLocalizedTrg001QuestionEditorialV2,
  trg001ResidualEnglishTokens,
} from "./localization-editorial-v2";

function learnerTexts(question: any) {
  return [
    ["stem", question.stem],
    ...question.options.map((option: any, index: number) => [`option-${index + 1}`, option.display]),
    ["localizedAnswerDisplay", question.localizedAnswerDisplay],
    ["keyRule", question.explanation?.keyRule],
    ...question.explanation.steps.map((step: any, index: number) => [`step-${index + 1}-title`, step.title]),
    ...question.explanation.steps.map((step: any, index: number) => [`step-${index + 1}-body`, step.body]),
    ["shortcut", question.explanation?.shortcut],
    ...question.explanation.traps.map((trap: any, index: number) => [`trap-${index + 1}`, trap]),
  ] as Array<[string, unknown]>;
}

function optionSemantics(question: any) {
  return question.options.map((option: any) => ({
    value: option.value,
    isCorrect: option.isCorrect,
    misconceptionId: option.misconceptionId,
  }));
}

function assertNoKnownGrammarArtifacts(text: string, locale: "hi-IN" | "pa-IN", id: string) {
  if (locale === "hi-IN") {
    assert(!/^में\s/u.test(text), `${id}: Hindi sentence starts with stranded 'में': ${text}`);
    assert(!/कौन-सा भुजा/u.test(text), `${id}: Hindi gender mismatch remains: ${text}`);
    assert(!/सटा हुआ भुजा/u.test(text), `${id}: Hindi adjacent-side gender mismatch remains: ${text}`);
    assert(!/समकोण कोण/u.test(text), `${id}: redundant Hindi right-angle phrase remains: ${text}`);
    assert(!/\ba\s+[\u0900-\u097F]/u.test(text), `${id}: English article 'a' remains before Hindi prose: ${text}`);
    return;
  }
  assert(!/^ਵਿੱਚ\s/u.test(text), `${id}: Punjabi sentence starts with stranded 'ਵਿੱਚ': ${text}`);
  assert(!/ਕਿਹੜਾ ਭੁਜਾ/u.test(text), `${id}: Punjabi gender mismatch remains: ${text}`);
  assert(!/ਲੱਗਦਾ ਭੁਜਾ/u.test(text), `${id}: Punjabi adjacent-side gender mismatch remains: ${text}`);
  assert(!/ਸਮਕੋਣ ਕੋਣ/u.test(text), `${id}: redundant Punjabi right-angle phrase remains: ${text}`);
  assert(!/\ba\s+[\u0A00-\u0A7F]/u.test(text), `${id}: English article 'a' remains before Punjabi prose: ${text}`);
}

assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144, "Editorial V2 must cover all 144 frozen TRG-001 QLs.");
assert.equal(
  TRG_001_FREEZE.approvedContentFingerprint,
  "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
  "Frozen English authority fingerprint drifted.",
);

let surfaces = 0;
let inspectedTexts = 0;
const localizationFingerprints = new Set<string>();

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    const seed = `trg001-localization-editorial-v2-${qlId}-${locale}`;
    const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
    const localized = generateLocalizedTrg001QuestionEditorialV2(qlId, seed, locale) as any;
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
    assert.deepEqual(optionSemantics(localized), optionSemantics(source), `${id}: option semantics drift.`);
    assert.deepEqual(localized.canonicalState, source.canonicalState, `${id}: canonical-state drift.`);
    assert.deepEqual(localized.verification, source.verification, `${id}: verification drift.`);

    for (const [field, value] of learnerTexts(localized)) {
      const text = String(value ?? "");
      const residual = trg001ResidualEnglishTokens(text);
      assert.deepEqual(residual, [], `${id}:${field}: residual English prose ${JSON.stringify(residual)} in '${text}'`);
      assertNoKnownGrammarArtifacts(text, locale, `${id}:${field}`);
      inspectedTexts += 1;
    }

    assert.equal(localized.reviewStatus, "LOCALIZATION_EDITORIAL_REVIEW_CANDIDATE_V2", `${id}: V2 review status drift.`);
    assert.equal(localized.humanReviewStatus, "PENDING", `${id}: human review must remain pending.`);
    assert.equal(localized.frozen, false, `${id}: localized V2 must not inherit English freeze.`);
    assert.equal(localized.freezeEligible, false, `${id}: V2 cannot auto-freeze.`);
    assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: V2 freeze status drift.`);
    assert.equal(localized.activationAuthorized, false, `${id}: localized activation must remain OFF.`);
    assert.equal(localized.questionStudioDiscoverable, false, `${id}: localized Question Studio gate must remain OFF.`);
    assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: localized bank gate must remain locked.`);
    assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: localized Test Builder gate must remain OFF.`);
    assert.equal(localized.publiclyPublishable, false, `${id}: public publication must remain OFF.`);
    assert.equal(localized.publicReleaseAuthorized, false, `${id}: public release authorization must remain OFF.`);
    assert.equal(localized.localizationLifecycle?.multilingualFreezeGranted, false, `${id}: multilingual freeze must remain false.`);
    assert.equal(localized.localizationLifecycle?.productDeliveryUnlocked, false, `${id}: product delivery must remain locked.`);
    assert.match(localized.localizationProof?.localizationFingerprint ?? "", /^[0-9a-f]{64}$/u, `${id}: localization fingerprint invalid.`);
    assert(!localizationFingerprints.has(localized.localizationProof.localizationFingerprint), `${id}: duplicate localization fingerprint.`);
    localizationFingerprints.add(localized.localizationProof.localizationFingerprint);
    surfaces += 1;
  }
}

assert.equal(surfaces, 288, `Expected 288 V2 surfaces, got ${surfaces}.`);
assert.equal(localizationFingerprints.size, 288, "Expected a unique V2 localization fingerprint for every surface.");

console.log(JSON.stringify({
  status: "TRG001_LOCALIZATION_EDITORIAL_V2_PASS",
  frozenEnglishQls: 144,
  localizedSurfaces: surfaces,
  inspectedLearnerTexts: inspectedTexts,
  residualEnglishProseTokens: 0,
  englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
}, null, 2));
